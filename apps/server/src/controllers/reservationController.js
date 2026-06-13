const mongoose = require('mongoose');
const Book = require('../models/Book');
const InventoryReservation = require('../models/InventoryReservation');
const { releaseExpiredReservations } = require('../services/reservationCleanupService');

// POST /api/reservations
// Places a temporary hold on stock for the given cart items so that other
// shoppers can't oversell the same copies while this user is checking out.
const createReservation = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items to reserve' });
    }

    const books = [];

    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.id)) {
        return res.status(400).json({ message: `Invalid book id: ${item.id}` });
      }

      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ message: `Invalid quantity for book ${item.id}` });
      }

      const book = await Book.findById(item.id);
      if (!book) {
        return res.status(404).json({ message: `Book not found: ${item.id}` });
      }

      const available = book.stock - book.reservedStock;
      if (available < quantity) {
        return res.status(409).json({
          message: `Not enough stock for "${book.title}" (only ${available} available)`,
        });
      }

      books.push({ book, quantity });
    }

    // All items have enough available stock — place the holds.
    await Promise.all(
      books.map(({ book, quantity }) =>
        Book.updateOne({ _id: book._id }, { $inc: { reservedStock: quantity } })
      )
    );

    const expiresAt = new Date(Date.now() + InventoryReservation.RESERVATION_DURATION_MS);

    const reservation = await InventoryReservation.create({
      userId: req.user?.mongoId ?? null,
      items: books.map(({ book, quantity }) => ({
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

    let reservation = await InventoryReservation.findById(id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation.status === 'active' && reservation.expiresAt <= new Date()) {
      await releaseExpiredReservations();
      reservation = await InventoryReservation.findById(id);
    }

    res.status(200).json(reservation);
  } catch (error) {
    next(error);
  }
};

module.exports = { createReservation, getReservation };
