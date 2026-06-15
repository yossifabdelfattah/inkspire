const mongoose = require('mongoose');
const Book = require('../models/Book');
const InventoryReservation = require('../models/InventoryReservation');
const { expireReservationIfNeeded, releaseReservedStock } = require('../services/reservationCleanupService');

// POST /api/reservations
// Places a temporary hold on stock for the given cart items so that other
// shoppers can't oversell the same copies while this user is checking out.
const createReservation = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items to reserve' });
    }

    const requestedItems = [];

    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.id)) {
        return res.status(400).json({ message: `Invalid book id: ${item.id}` });
      }

      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ message: `Invalid quantity for book ${item.id}` });
      }

      requestedItems.push({ id: item.id, quantity });
    }

    // Hold stock one book at a time using an atomic conditional update so
    // concurrent requests can never both succeed in reserving the same
    // last-available copy. If any item can't be reserved, every hold
    // already placed in this request is rolled back.
    const reservedItems = [];

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
            releaseReservedStock(heldBook._id, heldQuantity)
          )
        );

        if (!book) {
          return res.status(404).json({ message: `Book not found: ${id}` });
        }

        const available = book.stock - book.reservedStock;
        return res.status(409).json({
          message: `Not enough stock for "${book.title}" (only ${available} available)`,
        });
      }

      reservedItems.push({ book: updatedBook, quantity });
    }

    const expiresAt = new Date(Date.now() + InventoryReservation.RESERVATION_DURATION_MS);

    const reservation = await InventoryReservation.create({
      userId: req.user?.mongoId ?? null,
      items: reservedItems.map(({ book, quantity }) => ({
        book: book._id,
        title: book.title,
        quantity,
        price: book.price,
      })),
      status: 'active',
      expiresAt,
    });

    res.status(201).json(reservation);
  } catch (error) {
    next(error);
  }
};

// GET /api/reservations/:id
// Lets the client re-check a reservation's status (e.g. after a page reload).
const getReservation = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid reservation id' });
    }

    const reservation = await InventoryReservation.findById(id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation.userId && String(reservation.userId) !== String(req.user?.mongoId)) {
      return res.status(403).json({ message: 'This reservation does not belong to you' });
    }

    await expireReservationIfNeeded(reservation);

    res.status(200).json(reservation);
  } catch (error) {
    next(error);
  }
};

module.exports = { createReservation, getReservation };
