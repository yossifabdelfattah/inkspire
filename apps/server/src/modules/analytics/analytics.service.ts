import { SearchLog } from './searchLog.model';
import { BookRequest } from '../bookRequests/bookRequest.model';
import { Order } from '../orders/order.model';
import { Book } from '../books/book.model';
import { User } from '../auth/user.model';

export const getTopSearches = async (limit: number) => {
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

  return { searches: results, total: results.length };
};

export const getOverview = async () => {
  const [bookCount, pendingRequestCount, orderCount, userCount, revenueResult] = await Promise.all([
    Book.countDocuments(),
    BookRequest.countDocuments({ status: 'pending' }),
    Order.countDocuments(),
    User.countDocuments(),
    Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
  ]);

  return {
    bookCount,
    pendingRequestCount,
    orderCount,
    userCount,
    totalRevenue: revenueResult[0]?.total ?? 0,
  };
};

export const getSalesOverTime = async () => {
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

  return { sales: results };
};

export const getMostRequestedBooks = async (limit: number) => {
  const results = await BookRequest.find()
    .sort({ requestCount: -1, priorityScore: -1 })
    .limit(limit)
    .select('title author requestCount priorityScore status');

  return { requests: results };
};

export const getTopPurchasedBooks = async (limit: number) => {
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

  return { purchases: results };
};
