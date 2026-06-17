import mongoose from 'mongoose';
import crypto from 'crypto';
import { Book } from '../books/book.model';
import { Order, IOrder, IShippingInfo } from '../orders/order.model';
import { InventoryReservation } from '../reservations/reservation.model';
import { expireReservationIfNeeded } from '../reservations/reservationCleanup.service';
import { withOptionalTransaction } from '../../utils/transaction';
import { getShippingPrice } from '../../config/shipping';
import { ApiError } from '../../utils/ApiError';
import { AuthUser } from '../auth/user.types';

const ALLOWED_PAYMENT_METHODS = ['card', 'paypal', 'cod'];
const ALLOWED_DELIVERY_METHODS = ['standard', 'express', 'pickup'];

const DELIVERY_ESTIMATES: Record<string, string> = {
  standard: '5-7 business days',
  express: '1-2 business days',
  pickup: 'Ready for pickup within 24 hours',
};

const requiredShippingFields: (keyof IShippingInfo)[] = [
  'fullName',
  'email',
  'address',
  'city',
  'postal',
  'country',
];

export interface CheckoutInput {
  reservationId: string;
  shippingInfo: IShippingInfo;
  paymentMethod: string;
  deliveryMethod: string;
}

export interface MockPayment {
  status: string;
  transactionId: string;
  paidAt: Date;
}

// Simulates a payment provider charge. No real payment integration and no
// card data is ever accepted or stored — this only returns a mock receipt.
const simulateMockPayment = (): MockPayment => ({
  status: 'paid',
  transactionId: `MOCK-${crypto.randomBytes(6).toString('hex').toUpperCase()}`,
  paidAt: new Date(),
});

export const checkout = async (
  input: CheckoutInput,
  user: AuthUser
): Promise<{ order: IOrder; payment: MockPayment }> => {
  const { reservationId, shippingInfo, paymentMethod, deliveryMethod } = input;

  if (!user || !user.mongoId) {
    throw new ApiError(401, 'Not authorized');
  }

  if (!mongoose.Types.ObjectId.isValid(reservationId)) {
    throw new ApiError(400, 'Invalid reservation id');
  }

  if (!shippingInfo || requiredShippingFields.some((field) => !shippingInfo[field]?.trim())) {
    throw new ApiError(400, 'Complete shipping information is required');
  }

  if (!ALLOWED_PAYMENT_METHODS.includes(paymentMethod)) {
    throw new ApiError(400, `Invalid payment method. Allowed: ${ALLOWED_PAYMENT_METHODS.join(', ')}`);
  }

  if (!ALLOWED_DELIVERY_METHODS.includes(deliveryMethod)) {
    throw new ApiError(400, `Invalid delivery method. Allowed: ${ALLOWED_DELIVERY_METHODS.join(', ')}`);
  }

  const reservation = await InventoryReservation.findById(reservationId);

  if (!reservation) {
    throw new ApiError(404, 'Reservation not found');
  }

  if (reservation.userId && String(reservation.userId) !== String(user.mongoId)) {
    throw new ApiError(403, 'This reservation does not belong to you');
  }

  const justExpired = await expireReservationIfNeeded(reservation);

  if (justExpired || reservation.status === 'expired') {
    throw new ApiError(410, 'Your reservation has expired. Please return to your cart and try again.');
  }

  if (reservation.status !== 'active') {
    throw new ApiError(409, `Reservation is ${reservation.status} and can no longer be checked out`);
  }

  const itemsPrice = reservation.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingPrice = getShippingPrice(deliveryMethod, itemsPrice);
  const totalPrice = itemsPrice + shippingPrice;

  const result = await withOptionalTransaction(async (session) => {
    // Re-check the reservation's status inside the transaction so a
    // concurrent checkout or cleanup pass can't complete/expire it out
    // from under us between the check above and now.
    const claim = await InventoryReservation.findOneAndUpdate(
      { _id: reservation._id, status: 'active' },
      { $set: { status: 'completed' } },
      { session, new: true }
    );

    if (!claim) {
      throw new ApiError(409, 'Reservation is no longer active');
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
        {
          _id: item.book,
          stock: { $gte: item.quantity },
          reservedStock: { $gte: item.quantity },
        },
        { $inc: { stock: -item.quantity, reservedStock: -item.quantity } },
        { session, new: true }
      );

      if (!updatedBook) {
        throw new ApiError(409, `Unable to update stock for "${item.title}"`);
      }
    }

    const [createdOrder] = await Order.create(
      [
        {
          user: user.mongoId,
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
      { session: session ?? undefined }
    );

    return { order: createdOrder, payment };
  });

  return result;
};
