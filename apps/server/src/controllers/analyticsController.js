const SearchLog = require('../models/SearchLog');
const BookRequest = require('../models/BookRequest');
const Order = require('../models/Order');
const Book = require('../models/Book');
const User = require('../models/User');

// GET /api/admin/analytics/searches
// Returns top searched terms grouped by normalizedQuery
const getTopSearches = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const results = await SearchLog.aggregate([
      {
        $group: {
          _id: '$normalizedQuery',
          count: { $sum: 1 },
          totalResults: { $sum: '$resultCount' },
          avgResults: { $avg: '$resultCount' },
          lastSearchedAt: { $max: '$createdAt' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          term: '$_id',
          count: 1,
          totalResults: 1,
          avgResults: { $round: ['$avgResults', 1] },
          lastSearchedAt: 1,
        },
      },
    ]);

    res.status(200).json({ searches: results, total: results.length });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch search analytics',
      error: error.message,
    });
  }
};

// GET /api/admin/analytics/overview
// Returns headline counts for the admin dashboard's overview cards
const getOverview = async (req, res) => {
  try {
    const [bookCount, pendingRequestCount, orderCount, userCount, revenueResult] = await Promise.all([
      Book.countDocuments(),
      BookRequest.countDocuments({ status: 'pending' }),
      Order.countDocuments(),
      User.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
    ]);

    res.status(200).json({
      bookCount,
      pendingRequestCount,
      orderCount,
      userCount,
      totalRevenue: revenueResult[0]?.total ?? 0,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch overview analytics',
      error: error.message,
    });
  }
};

// GET /api/admin/analytics/sales
// Returns order totals grouped by day for a sales-over-time chart
const getSalesOverTime = async (req, res) => {
  try {
    const results = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: '$_id', orders: 1, revenue: { $round: ['$revenue', 2] } } },
    ]);

    res.status(200).json({ sales: results });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch sales analytics',
      error: error.message,
    });
  }
};

// GET /api/admin/analytics/requests
// Returns the most-requested books, ranked by priority score / request count
const getMostRequestedBooks = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const results = await BookRequest.find()
      .sort({ requestCount: -1, priorityScore: -1 })
      .limit(limit)
      .select('title author requestCount priorityScore status');

    res.status(200).json({ requests: results });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch most-requested books',
      error: error.message,
    });
  }
};

// GET /api/admin/analytics/purchases
// Returns the top purchased books, ranked by quantity sold
const getTopPurchasedBooks = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const results = await Order.aggregate([
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          title: { $first: '$orderItems.title' },
          quantitySold: { $sum: '$orderItems.quantity' },
          revenue: { $sum: { $multiply: ['$orderItems.quantity', '$orderItems.price'] } },
        },
      },
      { $sort: { quantitySold: -1 } },
      { $limit: limit },
      { $project: { _id: 0, bookId: '$_id', title: 1, quantitySold: 1, revenue: { $round: ['$revenue', 2] } } },
    ]);

    res.status(200).json({ purchases: results });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch purchase analytics',
      error: error.message,
    });
  }
};

module.exports = {
  getTopSearches,
  getOverview,
  getSalesOverTime,
  getMostRequestedBooks,
  getTopPurchasedBooks,
};
