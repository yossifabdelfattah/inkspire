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

// MongoDB TTL index — automatically removes reservation documents once
// expiresAt is reached. The reservation cleanup service is responsible for
// releasing reservedStock and marking reservations as 'expired' before this
// background sweep removes the document.
inventoryReservationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const InventoryReservation = mongoose.model('InventoryReservation', inventoryReservationSchema);

InventoryReservation.RESERVATION_DURATION_MS = RESERVATION_DURATION_MS;

module.exports = InventoryReservation;
