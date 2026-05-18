//const Order = require('../models/Order');

const Order = require('../models/Order');
const Book = require('../models/Book');

const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice
    } = req.body;

    // 1. Validate order items
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    // 2. Validate shipping address
    if (
        !shippingAddress ||
        !shippingAddress.address ||
        !shippingAddress.city ||
        !shippingAddress.postalCode ||
        !shippingAddress.country
    ) {
      return res.status(400).json({
        message: 'Please provide full shipping address'
      });
    }

    // 3. Validate payment method
    if (!paymentMethod) {
      return res.status(400).json({
        message: 'Payment method is required'
      });
    }

    // 4. Check stock for each book
    for (const item of orderItems) {
      const book = await Book.findById(item.book);

      if (!book) {
        return res.status(404).json({
          message: `Book not found: ${item.book}`
        });
      }

      if (book.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for "${book.title}". Available: ${book.stock}`
        });
      }
    }

    // 5. Create order
    const order = await Order.create({
      user: req.user.userId,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice
    });

    // 6. Reduce stock after order is created
    for (const item of orderItems) {
      await Book.findByIdAndUpdate(item.book, {
        $inc: { stock: -item.quantity }
      });
    }

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

/*const createOrder = async (req, res, next) => {
  try {
    const { orderItems, totalPrice } = req.body;

    const order = await Order.create({
      user: req.user.userId,
      orderItems,
      totalPrice
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};*/

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders };
