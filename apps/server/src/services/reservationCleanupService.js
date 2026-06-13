const Book = require('../models/Book');
const InventoryReservation = require('../models/InventoryReservation');

const CLEANUP_INTERVAL_MS = 30 * 1000; // 30 seconds

// Finds active reservations whose hold has expired, releases the stock they
// were holding (decrements Book.reservedStock), and marks them 'expired'.
const releaseExpiredReservations = async () => {
  const expired = await InventoryReservation.find({
    status: 'active',
    expiresAt: { $lte: new Date() },
  });

  for (const reservation of expired) {
    await Promise.all(
      reservation.items.map((item) =>
        Book.updateOne({ _id: item.book }, { $inc: { reservedStock: -item.quantity } })
      )
    );

    reservation.status = 'expired';
    await reservation.save();
  }

  return expired.length;
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

module.exports = { releaseExpiredReservations, startReservationCleanupJob, stopReservationCleanupJob };
