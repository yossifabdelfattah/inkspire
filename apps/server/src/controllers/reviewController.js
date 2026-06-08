const mongoose = require('mongoose');
const Review = require('../models/Review');
const Book = require('../models/Book');
const { getIO } = require('../config/socket');

const recalculateBookRating = async (bookId) => {
  const stats = await Review.aggregate([
    { $match: { book: new mongoose.Types.ObjectId(bookId) } },
    { $group: { _id: '$book', average: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  const ratingAverage = stats.length > 0 ? Math.round(stats[0].average * 10) / 10 : 0;
  const ratingCount = stats.length > 0 ? stats[0].count : 0;

  await Book.findByIdAndUpdate(bookId, { ratingAverage, ratingCount });

  return { ratingAverage, ratingCount };
};

// GET /api/books/:bookId/reviews
const getBookReviews = async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'Invalid book id' });
    }

    const reviews = await Review.find({ book: bookId }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
  }
};

// POST /api/books/:bookId/reviews
// Creates the user's review, or updates it if one already exists (one rating per user per book)
const upsertBookReview = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'Invalid book id' });
    }

    const ratingNum = Number(rating);
    if (!Number.isFinite(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const review = await Review.findOneAndUpdate(
      { book: bookId, user: req.user.mongoId },
      {
        book: bookId,
        user: req.user.mongoId,
        userName: req.user.email ?? 'Anonymous',
        rating: ratingNum,
        comment: comment?.trim() ?? '',
      },
      { new: true, upsert: true, runValidators: true }
    );

    const { ratingAverage, ratingCount } = await recalculateBookRating(bookId);

    const io = getIO();
    if (io) {
      io.to(`book:${bookId}`).emit('review:updated', {
        bookId,
        review,
        ratingAverage,
        ratingCount,
      });
    }

    res.status(200).json({ review, ratingAverage, ratingCount });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save review', error: error.message });
  }
};

module.exports = { getBookReviews, upsertBookReview };
