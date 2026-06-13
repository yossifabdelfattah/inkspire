const mongoose = require('mongoose');

// Ensure the Store model is registered so populate('store') works
// even when nothing else in the request path requires it directly.
require('./Store');

const inventorySchema = new mongoose.Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  { timestamps: true }
);

// A given book has at most one inventory record per store.
inventorySchema.index({ store: 1, book: 1 }, { unique: true });

module.exports = mongoose.model('Inventory', inventorySchema);
