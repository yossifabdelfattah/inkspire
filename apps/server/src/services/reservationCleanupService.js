const Book = require('../models/Book');
const InventoryReservation = require('../models/InventoryReservation');

const CLEANUP_INTERVAL_MS = 30 * 1000; // 30 seconds

// Releases a reservation's held stock without ever driving reservedStock
// negative. Only ever subtracts `quantity` (clamped at 0) — never resets the
// whole counter, so other active reservations' holds on the same book are
// left untouched. If reservedStock was already lower than `quantity`
// (shouldn't normally happen), the shortfall is logged as a warning.
const releaseReservedStock = async (bookId, quantity, session) => {
  const before = await Book.findById(bookId, 'reservedStock', { session });

  const updated = await Book.findOneAndUpdate(
    { _id: bookId },
    [
      {
        $set: {
          reservedStock: {
            $max: [0, { $subtract: [{ $ifNull: ['$reservedStock', 0] }, quantity] }],
          },
        },
      },
    ],
    { session, new: true }
  );

  if (!updated) {
    console.warn(`[ReservationCleanup] releaseReservedStock: book ${bookId} not found`);
    return;
  }

  if (before && before.reservedStock < quantity) {
    console.warn(
      `[ReservationCleanup] releaseReservedStock: book ${bookId} reservedStock (${before.reservedStock}) was less than release quantity (${quantity}); clamped to 0.`
    );
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
