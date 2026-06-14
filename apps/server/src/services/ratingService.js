const mongoose = require('mongoose');
const Review = require('../models/Review');
const Book = require('../models/Book');

// Recomputes a book's ratingAverage/ratingCount from its real Review
// documents. Books with no reviews fall back to 0/0.
const recalculateBookRating = async (bookId, session) => {
  const stats = await Review.aggregate(
    [
      { $match: { book: new mongoose.Types.ObjectId(bookId) } },
      { $group: { _id: '$book', average: { $avg: '$rating' }, count: { $sum: 1 } } },
    ],
    { session }
  );

  const ratingAverage = stats.length > 0 ? Math.round(stats[0].average * 10) / 10 : 0;
  const ratingCount = stats.length > 0 ? stats[0].count : 0;

  await Book.findByIdAndUpdate(bookId, { ratingAverage, ratingCount }, { session });

  return { ratingAverage, ratingCount };
};

module.exports = { recalculateBookRating };
