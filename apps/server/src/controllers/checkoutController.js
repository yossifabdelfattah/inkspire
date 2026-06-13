const mongoose = require('mongoose');
const crypto = require('crypto');
const Book = require('../models/Book');
const Order = require('../models/Order');
const InventoryReservation = require('../models/InventoryReservation');

const FREE_SHIPPING_THRESHOLD = 50;
const STANDARD_SHIPPING_COST = 4.99;
const EXPRESS_SHIPPING_COST = 14.99;

const DELIVERY_ESTIMATES = {
  standard: '5-7 business days',
  express: '1-2 business days',
};

const requiredShippingFields = ['fullName', 'email', 'address', 'city', 'postal', 'country'];

const getShippingPrice = (deliveryMethod, itemsPrice) => {
  if (deliveryMethod === 'express') return EXPRESS_SHIPPING_COST;
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

    if (!mongoose.Types.ObjectId.isValid(reservationId)) {
      return res.status(400).json({ message: 'Invalid reservation id' });
    }

    if (!shippingInfo || requiredShippingFields.some((field) => !shippingInfo[field]?.trim())) {
      return res.status(400).json({ message: 'Complete shipping information is required' });
    }

    const reservation = await InventoryReservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation.userId && String(reservation.userId) !== String(req.user.mongoId)) {
      return res.status(403).json({ message: 'This reservation does not belong to you' });
    }

    if (reservation.status === 'expired' || (reservation.status === 'active' && reservation.expiresAt <= new Date())) {
      if (reservation.status === 'active') {
        await Promise.all(
          reservation.items.map((item) =>
            Book.updateOne({ _id: item.book }, { $inc: { reservedStock: -item.quantity } })
          )
        );
        reservation.status = 'expired';
        await reservation.save();
      }

      return res.status(410).json({ message: 'Your reservation has expired. Please return to your cart and try again.' });
    }

    if (reservation.status !== 'active') {
      return res.status(409).json({ message: `Reservation is ${reservation.status} and can no longer be checked out` });
    }

    const safeDeliveryMethod = deliveryMethod === 'express' ? 'express' : 'standard';

    const itemsPrice = reservation.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingPrice = getShippingPrice(safeDeliveryMethod, itemsPrice);
    const totalPrice = itemsPrice + shippingPrice;

    // Simulate the payment step — never integrates a real provider and never
    // persists card details.
    const payment = simulateMockPayment();

    // Permanently commit the stock deduction and release the reservation hold.
    await Promise.all(
      reservation.items.map((item) =>
        Book.updateOne({ _id: item.book }, { $inc: { stock: -item.quantity, reservedStock: -item.quantity } })
      )
    );

    const order = await Order.create({
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
      paymentMethod: paymentMethod || 'card',
      deliveryMethod: safeDeliveryMethod,
      deliveryEstimate: DELIVERY_ESTIMATES[safeDeliveryMethod],
      itemsPrice,
      shippingPrice,
      totalPrice,
      status: 'Paid',
    });

    reservation.status = 'completed';
    await reservation.save();

    res.status(201).json({ order, payment });
  } catch (error) {
    next(error);
  }
};

module.exports = { checkout };
