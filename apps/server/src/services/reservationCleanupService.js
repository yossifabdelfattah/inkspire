const Book = require('../models/Book');
const InventoryReservation = require('../models/InventoryReservation');

const CLEANUP_INTERVAL_MS = 30 * 1000; // 30 seconds

// Releases a reservation's held stock without ever driving reservedStock
// negative — if reservedStock is already lower than the held quantity
// (shouldn't normally happen), the decrement is clamped to what's left.
const releaseReservedStock = async (bookId, quantity, session) => {
  const updated = await Book.findOneAndUpdate(
    { _id: bookId, reservedStock: { $gte: quantity } },
    { $inc: { reservedStock: -quantity } },
    { session, new: true }
  );

  if (!updated) {
    // Clamp to zero instead of leaving a stale positive reservedStock.
    await Book.updateOne({ _id: bookId, reservedStock: { $gt: 0 } }, { $set: { reservedStock: 0 } }, { session });
  }
};

// Marks a single reservation as 'expired' and releases its held stock,
// exactly once. Safe to call repeatedly — only reservations that are still
// 'active' and past their expiry are touched, so completed/expired
// reservations are never re-processed.
const expireReservationIfNeeded = async (reservation) => {
  if (reservation.status !== 'active' || reservation.expiresAt > new Date()) {
    return false;
  }

  const result = await InventoryReservation.updateOne(
    { _id: reservation._id, status: 'active' },
    { $set: { status: 'expired' } }
  );

  // Another request (e.g. checkout or a concurrent cleanup pass) already
  // expired/completed this reservation — don't release stock twice.
  if (result.modifiedCount === 0) {
    return false;
  }

  await Promise.all(reservation.items.map((item) => releaseReservedStock(item.book, item.quantity)));

  reservation.status = 'expired';
  return true;
};

// Finds active reservations whose hold has expired, releases the stock they
// were holding (decrements Book.reservedStock), and marks them 'expired'.
// Expired reservations are kept in the database for audit/history.
const releaseExpiredReservations = async () => {
  const expired = await InventoryReservation.find({
    status: 'active',
    expiresAt: { $lte: new Date() },
  });

  let count = 0;
  for (const reservation of expired) {
    if (await expireReservationIfNeeded(reservation)) {
      count += 1;
    }
  }

  return count;
};

let intervalHandle = null;

const startReservationCleanupJob = () => {
  if (intervalHandle) return intervalHandle;

  releaseExpiredReservations().catch((err) => {
    console.error('[ReservationCleanup] Failed to release expired reservations:', err.message);
  });

  intervalHandle = setInterval(() => {
    releaseExpiredReservations().catch((err) => {
      console.error('[ReservationCleanup] Failed to release expired reservations:', err.message);
    });
  }, CLEANUP_INTERVAL_MS);

  return intervalHandle;
};

const stopReservationCleanupJob = () => {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = null;
  }
};

module.exports = {
  releaseExpiredReservations,
  expireReservationIfNeeded,
  releaseReservedStock,
  startReservationCleanupJob,
  stopReservationCleanupJob,
};
