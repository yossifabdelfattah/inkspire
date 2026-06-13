const mongoose = require('mongoose');

// Cached after the first attempt so we don't retry a doomed transaction on
// every request when running against a standalone MongoDB instance (which
// doesn't support multi-document transactions).
let transactionsSupported = null;

const isUnsupportedTransactionError = (err) =>
  /Transaction numbers are only allowed|Transactions are not supported/i.test(err?.message || '');

// Runs `fn(session)` inside a MongoDB transaction when the server supports
// them, falling back to running `fn(null)` without a session otherwise.
const withOptionalTransaction = async (fn) => {
  if (transactionsSupported === false) {
    return fn(null);
  }

  const session = await mongoose.startSession();

  try {
    let result;
    await session.withTransaction(async () => {
      result = await fn(session);
    });
    transactionsSupported = true;
    return result;
  } catch (err) {
    if (transactionsSupported === null && isUnsupportedTransactionError(err)) {
      transactionsSupported = false;
      return fn(null);
    }
    throw err;
  } finally {
    await session.endSession();
  }
};

module.exports = { withOptionalTransaction };
