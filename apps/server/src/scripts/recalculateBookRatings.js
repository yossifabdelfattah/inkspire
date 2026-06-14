const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Book = require('../models/Book');
const { recalculateBookRating } = require('../services/ratingService');

dotenv.config();

// One-time fixup: recompute ratingAverage/ratingCount for every book from
// real Review documents, replacing the fake placeholder stats baked into
// the original seed data.
const run = async () => {
  try {
    await connectDB();

    const books = await Book.find({}, '_id');

    for (const book of books) {
      await recalculateBookRating(book._id);
    }

    console.log(`Recalculated ratings for ${books.length} books`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
