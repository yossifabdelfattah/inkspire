const mongoose = require('mongoose');
const Order = require('../models/Order');
const Book = require('../models/Book');

const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 4.99;

const requiredShippingFields = ['fullName', 'email', 'address', 'city', 'postal', 'country'];

const createOrder = async (req, res, next) => {
  try {
    const { cartItems, shippingInfo, paymentMethod } = req.body;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    if (!shippingInfo || requiredShippingFields.some((field) => !shippingInfo[field]?.trim())) {
      return res.status(400).json({ message: 'Complete shipping information is required' });
    }

    // Validate cart items against the database — never trust client-supplied prices/stock
    const orderItems = [];
    let itemsPrice = 0;

    for (const item of cartItems) {
      if (!mongoose.Types.ObjectId.isValid(item.id)) {
        return res.status(400).json({ message: `Invalid book id: ${item.id}` });
      }

      const book = await Book.findById(item.id);
      if (!book) {
        return res.status(404).json({ message: `Book not found: ${item.id}` });
      }

      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ message: `Invalid quantity for ${book.title}` });
      }

      if (book.stock < quantity) {
        return res.status(400).json({ message: `Not enough stock for "${book.title}" (only ${book.stock} left)` });
      }

      orderItems.push({
        product: book._id,
        title: book.title,
        quantity,
        price: book.price
      });

      itemsPrice += book.price * quantity;
    }

    const shippingPrice = itemsPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const totalPrice = itemsPrice + shippingPrice;

    // Reduce stock for each ordered book
    await Promise.all(
      orderItems.map((item) =>
        Book.updateOne({ _id: item.product }, { $inc: { stock: -item.quantity } })
      )
    );

    const order = await Order.create({
      user: req.user.mongoId,
      orderItems,
      shippingInfo: {
        fullName: shippingInfo.fullName.trim(),
        email: shippingInfo.email.trim(),
        address: shippingInfo.address.trim(),
        city: shippingInfo.city.trim(),
        postal: shippingInfo.postal.trim(),
        country: shippingInfo.country.trim()
      },
      paymentMethod: paymentMethod || 'card',
      itemsPrice,
      shippingPrice,
      totalPrice
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.mongoId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders };
