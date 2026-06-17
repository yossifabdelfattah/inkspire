# Reservation Flow

## Purpose

Inventory reservations prevent **overselling** during checkout. When a shopper
begins checkout, the requested quantities are held against each book's stock so
two shoppers can never both buy the last available copy. Holds are temporary and
released automatically if checkout is not completed in time.

Books track two counters: `stock` (physical units) and `reservedStock` (units
currently held by active reservations). Available stock is
`stock - reservedStock`.

## Lifecycle

A reservation moves through three states (`reservation.model.ts`):

```
            checkout succeeds
   active ─────────────────────► completed
      │
      │  timer expires (read, checkout, or cleanup job)
      └───────────────────────► expired
```

- **active** — stock is held; checkout can proceed.
- **completed** — checkout claimed the reservation and the order was created.
- **expired** — the 10-minute window passed; held stock was released.

Expired and completed reservations are **kept** in the database for
audit/history; they are never auto-deleted.

## Creating a Reservation — `POST /api/reservations`

`createReservation` (`reservation.service.ts`):

1. Validates the items array and each item's ObjectId and integer quantity
   (`≥ 1`).
2. For each item, performs an atomic conditional update on the `Book`:

   ```js
   Book.findOneAndUpdate(
     { _id: id, $expr: { $gte: [{ $subtract: ['$stock', '$reservedStock'] }, quantity] } },
     { $inc: { reservedStock: quantity } },
     { new: true }
   )
   ```

   The `$expr` guard ensures the update only succeeds when
   `stock - reservedStock ≥ quantity`.
3. If any item cannot be reserved, **all holds already placed in this request
   are rolled back** via `releaseReservedStock`, and the request fails with
   `409` (or `404` if the book no longer exists).
4. On success, creates the reservation with `status: 'active'` and
   `expiresAt = now + 10 minutes`.

## Expiry

- **Window:** 10 minutes (`RESERVATION_DURATION_MS = 10 * 60 * 1000`).
- **Cleanup job:** `startReservationCleanupJob` runs `releaseExpiredReservations`
  immediately on boot and then **every 30 seconds**
  (`CLEANUP_INTERVAL_MS = 30 * 1000`). It finds `active` reservations with
  `expiresAt ≤ now`, releases their stock, and marks them `expired`.
- **On-demand expiry:** `expireReservationIfNeeded` also runs when a reservation
  is read (`GET /api/reservations/:id`) or at checkout, so a stale reservation is
  never usable even between cleanup passes.

## Race-Condition Protection

- **Reserving:** the atomic `findOneAndUpdate` with the `$expr` available-stock
  guard means concurrent requests can never both reserve the same last copy —
  only one update matches the condition.
- **Expiring exactly once:** `expireReservationIfNeeded` updates with a
  `{ status: 'active' }` guard and checks `modifiedCount`. If another pass (or
  checkout) already expired/completed the reservation, `modifiedCount === 0`, so
  stock is **not** released twice; the in-memory copy is refreshed to the status
  that "won" the race.
- **Releasing without going negative:** `releaseReservedStock` uses an aggregation
  pipeline update,
  `reservedStock = $max[0, $subtract[reservedStock, quantity]]`, so the counter
  never drops below zero and only this reservation's `quantity` is subtracted —
  other active holds on the same book are untouched.

## Checkout Claim

At checkout, `checkout.service.ts` runs inside `withOptionalTransaction`:

1. **Claim** the reservation atomically:

   ```js
   InventoryReservation.findOneAndUpdate(
     { _id: reservationId, status: 'active' },
     { $set: { status: 'completed' } },
     { session, new: true }
   )
   ```

   If no document matches (already completed/expired), checkout fails with `409`.
2. **Commit stock** per item with a guarded atomic update so neither counter can
   go negative:

   ```js
   Book.findOneAndUpdate(
     { _id: item.book, stock: { $gte: item.quantity }, reservedStock: { $gte: item.quantity } },
     { $inc: { stock: -item.quantity, reservedStock: -item.quantity } },
     { session, new: true }
   )
   ```

   A non-match aborts the transaction (`409`), rolling back the claim and the
   mock payment.
3. **Create the order** in the same transaction.

Because all of this runs in `withOptionalTransaction`, a failure at any step
rolls the whole operation back when transactions are available (replica set);
on a single-node setup the same logic runs without a session.
