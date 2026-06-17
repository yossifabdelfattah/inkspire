import mongoose from 'mongoose';
import { Book, IBook } from '../books/book.model';
import { InventoryReservation, IInventoryReservation } from './reservation.model';
import { expireReservationIfNeeded, releaseReservedStock } from './reservationCleanup.service';
import { ApiError } from '../../utils/ApiError';
import { CreateReservationInput } from './reservation.types';
import { AuthUser } from '../auth/user.types';

// Places a temporary hold on stock for the given cart items so that other
// shoppers can't oversell the same copies while this user is checking out.
export const createReservation = async (
  input: CreateReservationInput,
  user?: AuthUser | null
): Promise<IInventoryReservation> => {
  const { items } = input;

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, 'No items to reserve');
  }

  const requestedItems: { id: string; quantity: number }[] = [];

  for (const item of items) {
    if (!mongoose.Types.ObjectId.isValid(item.id)) {
      throw new ApiError(400, `Invalid book id: ${item.id}`);
    }

    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new ApiError(400, `Invalid quantity for book ${item.id}`);
    }

    requestedItems.push({ id: item.id, quantity });
  }

  // Hold stock one book at a time using an atomic conditional update so
  // concurrent requests can never both succeed in reserving the same
  // last-available copy. If any item can't be reserved, every hold
  // already placed in this request is rolled back.
  const reservedItems: { book: IBook; quantity: number }[] = [];

  for (const { id, quantity } of requestedItems) {
    const updatedBook = await Book.findOneAndUpdate(
      {
        _id: id,
        $expr: { $gte: [{ $subtract: ['$stock', '$reservedStock'] }, quantity] },
      },
      { $inc: { reservedStock: quantity } },
      { new: true }
    );

    if (!updatedBook) {
      const book = await Book.findById(id);

      await Promise.all(
        reservedItems.map(({ book: heldBook, quantity: heldQuantity }) =>
          releaseReservedStock(heldBook._id as mongoose.Types.ObjectId, heldQuantity)
        )
      );

      if (!book) {
        throw new ApiError(404, `Book not found: ${id}`);
      }

      const available = book.stock - book.reservedStock;
      throw new ApiError(409, `Not enough stock for "${book.title}" (only ${available} available)`);
    }

    reservedItems.push({ book: updatedBook, quantity });
  }

  const expiresAt = new Date(Date.now() + InventoryReservation.RESERVATION_DURATION_MS);

  const reservation = await InventoryReservation.create({
    userId: user?.mongoId ?? null,
    items: reservedItems.map(({ book, quantity }) => ({
      book: book._id,
      title: book.title,
      quantity,
      price: book.price,
    })),
    status: 'active',
    expiresAt,
  });

  return reservation;
};

// Lets the client re-check a reservation's status (e.g. after a page reload).
export const getReservation = async (
  id: string,
  user?: AuthUser | null
): Promise<IInventoryReservation> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid reservation id');
  }

  const reservation = await InventoryReservation.findById(id);

  if (!reservation) {
    throw new ApiError(404, 'Reservation not found');
  }

  if (reservation.userId && String(reservation.userId) !== String(user?.mongoId)) {
    throw new ApiError(403, 'This reservation does not belong to you');
  }

  await expireReservationIfNeeded(reservation);

  return reservation;
};
