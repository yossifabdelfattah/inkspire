const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    // Quantity currently held by active (unexpired) checkout reservations.
    // Available stock for new reservations is `stock - reservedStock`.
    reservedStock: {
      type: Number,
      default: 0,
      min: 0,
    },

    ratingAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    ratingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Speeds up category filtering (getBooks) and rating-based sorts
// (getBooks?sort=rating, getRecommendations, getRelatedBooks).
bookSchema.index({ category: 1 });
bookSchema.index({ ratingAverage: -1 });

module.exports = mongoose.model("Book", bookSchema);