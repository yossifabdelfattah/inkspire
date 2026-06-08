const mongoose = require('mongoose');

const searchLogSchema = new mongoose.Schema(
  {
    query: {
      type: String,
      required: true,
      trim: true,
    },
    normalizedQuery: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    resultCount: {
      type: Number,
      required: true,
      min: 0,
    },
    userId: {
      type: String, // Firebase UID — optional, not an ObjectId
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast analytics grouping
searchLogSchema.index({ normalizedQuery: 1 });
searchLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('SearchLog', searchLogSchema);
