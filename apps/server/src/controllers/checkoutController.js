const mongoose = require('mongoose');
const crypto = require('crypto');
const Book = require('../models/Book');
const Order = require('../models/Order');
const InventoryReservation = require('../models/InventoryReservation');
const { expireReservationIfNeeded } = require('../services/reservationCleanupService');
const { withOptionalTransaction } = require('../utils/transaction');

const FREE_SHIPPING_THRESHOLD = 50;
const STANDARD_SHIPPING_COST = 4.99;
const EXPRESS_SHIPPING_COST = 14.99;

const ALLOWED_PAYMENT_METHODS = ['card', 'paypal', 'cod'];
const ALLOWED_DELIVERY_METHODS = ['standard', 'express', 'pickup'];

const DELIVERY_ESTIMATES = {
  standard: '5-7 business days',
  express: '1-2 business days',
  pickup: 'Ready for pickup within 24 hours',
};

const requiredShippingFields = ['fullName', 'email', 'address', 'city', 'postal', 'country'];

const getShippingPrice = (deliveryMethod, itemsPrice) => {
  if (deliveryMethod === 'express') return EXPRESS_SHIPPING_COST;
  if (deliveryMethod === 'pickup') return 0;
  return itemsPrice >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
};

// Simulates a payment provider charge. No real payment integration and no
// card data is ever accepted or stored — this only returns a mock receipt.
const simulateMockPayment = () => ({
  status: 'paid',
  transactionId: `MOCK-${crypto.randomBytes(6).toString('hex').toUpperCase()}`,
  paidAt: new Date(),
});

// POST /api/checkout
const checkout = async (req, res, next) => {
  try {
    const { reservationId, shippingInfo, paymentMethod, deliveryMethod } = req.body;

    if (!req.user || !req.user.mongoId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!mongoose.Types.ObjectId.isValid(reservationId)) {
      return res.status(400).json({ message: 'Invalid reservation id' });
    }

    if (!shippingInfo || requiredShippingFields.some((field) => !shippingInfo[field]?.trim())) {
      return res.status(400).json({ message: 'Complete shipping information is required' });
    }

    if (!ALLOWED_PAYMENT_METHODS.includes(paymentMethod)) {
      return res.status(400).json({ message: `Invalid payment method. Allowed: ${ALLOWED_PAYMENT_METHODS.join(', ')}` });
    }

    if (!ALLOWED_DELIVERY_METHODS.includes(deliveryMethod)) {
      return res.status(400).json({ message: `Invalid delivery method. Allowed: ${ALLOWED_DELIVERY_METHODS.join(', ')}` });
    }

    const reservation = await InventoryReservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation.userId && String(reservation.userId) !== String(req.user.mongoId)) {
      return res.status(403).json({ message: 'This reservation does not belong to you' });
    }

    const justExpired = await expireReservationIfNeeded(reservation);

    if (justExpired || reservation.status === 'expired') {
      return res.status(410).json({ message: 'Your reservation has expired. Please return to your cart and try again.' });
    }

    if (reservation.status !== 'active') {
      return res.status(409).json({ message: `Reservation is ${reservation.status} and can no longer be checked out` });
    }

    const itemsPrice = reservation.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingPrice = getShippingPrice(deliveryMethod, itemsPrice);
    const totalPrice = itemsPrice + shippingPrice;

    const { order, payment } = await withOptionalTransaction(async (session) => {
      // Re-check the reservation's status inside the transaction so a
      // concurrent checkout or cleanup pass can't complete/expire it out
      // from under us between the check above and now.
      const claim = await InventoryReservation.findOneAndUpdate(
        { _id: reservation._id, status: 'active' },
        { $set: { status: 'completed' } },
        { session, new: true }
      );

      if (!claim) {
        throw Object.assign(new Error('Reservation is no longer active'), { statusCode: 409 });
      }

      // Simulate the payment step — never integrates a real provider and
      // never persists card details. Done inside the transaction so a
      // failure further down (e.g. insufficient stock) rolls the "charge"
      // back along with everything else.
      const payment = simulateMockPayment();

      // Permanently commit the stock deduction and release the reservation
      // hold, never letting either counter drop below zero.
      for (const item of reservation.items) {
        const updatedBook = await Book.findOneAndUpdate(
          { _id: item.book, stock: { $gte: item.quantity }, reservedStock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity, reservedStock: -item.quantity } },
          { session, new: true }
        );

        if (!updatedBook) {
          throw Object.assign(new Error(`Unable to update stock for "${item.title}"`), { statusCode: 409 });
        }
      }

      const [createdOrder] = await Order.create(
        [
          {
            user: req.user.mongoId,
            orderItems: reservation.items.map((item) => ({
              product: item.book,
              title: item.title,
              quantity: item.quantity,
              price: item.price,
            })),
            shippingInfo: {
              fullName: shippingInfo.fullName.trim(),
              email: shippingInfo.email.trim(),
              address: shippingInfo.address.trim(),
              city: shippingInfo.city.trim(),
              postal: shippingInfo.postal.trim(),
              country: shippingInfo.country.trim(),
            },
            paymentMethod,
            paymentStatus: 'paid',
            mockTransactionId: payment.transactionId,
            deliveryMethod,
            deliveryEstimate: DELIVERY_ESTIMATES[deliveryMethod],
            itemsPrice,
            shippingPrice,
            totalPrice,
            status: 'Paid',
          },
        ],
        { session }
      );

      return { order: createdOrder, payment };
    });

    res.status(201).json({ order, payment });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    next(error);
  }
};

module.exports = { checkout };
