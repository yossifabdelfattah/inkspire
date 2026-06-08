const mongoose = require('mongoose');

const bookRequestSchema = new mongoose.Schema(
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
    normalizedTitle: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    normalizedAuthor: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    note: {
      type: String,
      trim: true,
      default: '',
    },
    requestedBy: {
      type: String, // Firebase UID — optional, not an ObjectId
      default: null,
    },
    requestCount: {
      type: Number,
      default: 1,
      min: 1,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    priorityScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

bookRequestSchema.index({ normalizedTitle: 1, normalizedAuthor: 1 });

module.exports = mongoose.model('BookRequest', bookRequestSchema);
