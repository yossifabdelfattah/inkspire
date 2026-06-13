const mongoose = require('mongoose');

const RESERVATION_DURATION_MS = 10 * 60 * 1000; // 10 minutes

const reservationItemSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    title: String,
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const inventoryReservationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    items: {
      type: [reservationItemSchema],
      required: true,
      validate: (items) => Array.isArray(items) && items.length > 0,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'expired'],
      default: 'active',
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Reservations are never auto-deleted — expired reservations are kept for
// audit/history and marked status: 'expired' by the cleanup service.
inventoryReservationSchema.index({ status: 1, expiresAt: 1 });

const InventoryReservation = mongoose.model('InventoryReservation', inventoryReservationSchema);

InventoryReservation.RESERVATION_DURATION_MS = RESERVATION_DURATION_MS;

module.exports = InventoryReservation;
