const Order = require('../models/Order');

const createOrder = async (req, res, next) => {
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
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders };
