const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    imageUrl: {
      type: String,
      default: ''
    },
    countInStock: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      default: 'General'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
