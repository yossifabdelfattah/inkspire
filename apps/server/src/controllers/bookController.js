const mongoose = require("mongoose");
const Book = require("../models/Book");
const SearchLog = require("../models/SearchLog");
const Order = require("../models/Order");
const Inventory = require("../models/Inventory");

// GET all books with search, filter, and sort
const getBooks = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort } = req.query;

    // Build filter object
    const filter = {};

    // Search: match title or author case-insensitively
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      filter.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Build sort object
    let sortObj = {};
    if (sort === 'price-asc') sortObj = { price: 1 };
    else if (sort === 'price-desc') sortObj = { price: -1 };
    else if (sort === 'rating') sortObj = { ratingAverage: -1 };
    else if (sort === 'newest') sortObj = { createdAt: -1 };

    // Execute query
    const books = await Book.find(filter).sort(sortObj);

    // Fire-and-forget: log non-empty searches without blocking the response
    if (search && search.trim().length > 0) {
      SearchLog.create({
        query: search.trim(),
        normalizedQuery: search.trim().toLowerCase(),
        resultCount: books.length,
        userId: req.user?.uid ?? null,
      }).catch((err) => {
        console.error('[SearchLog] Failed to log search:', err.message);
      });
    }

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch books',
      error: error.message,
    });
  }
};

// GET /api/books/recommendations
// Personalized "recommended for you" list:
//  - Logged-in users with order history: top-rated books from categories they've
//    previously purchased, excluding books they already own.
//  - Anonymous users / users with no orders: top-rated books overall.
const getRecommendations = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 8, 20);
    const mongoId = req.user?.mongoId;

    let purchasedCategories = [];
    let purchasedBookIds = [];

    if (mongoId) {
      const orders = await Order.find({ user: mongoId }).select('orderItems.product');
      purchasedBookIds = [
        ...new Set(orders.flatMap((order) => order.orderItems.map((item) => String(item.product)))),
      ];

      if (purchasedBookIds.length > 0) {
        const purchasedBooks = await Book.find({ _id: { $in: purchasedBookIds } }).select('category');
        purchasedCategories = [...new Set(purchasedBooks.map((b) => b.category).filter(Boolean))];
      }
    }

    let books = [];

    if (purchasedCategories.length > 0) {
      books = await Book.find({
        category: { $in: purchasedCategories },
        _id: { $nin: purchasedBookIds },
      })
        .sort({ ratingAverage: -1, ratingCount: -1 })
        .limit(limit);
    }

    // Fallback (anonymous users, no order history, or not enough category matches)
    if (books.length < limit) {
      const excludeIds = [...purchasedBookIds, ...books.map((b) => String(b._id))];
      const fallback = await Book.find({ _id: { $nin: excludeIds } })
        .sort({ ratingAverage: -1, ratingCount: -1 })
        .limit(limit - books.length);

      books = [...books, ...fallback];
    }

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch recommendations',
      error: error.message,
    });
  }
};

// GET /api/books/:id/related
// Returns other books in the same category, falling back to top-rated books overall
// if there aren't enough in the same category.
const getRelatedBooks = async (req, res) => {
  try {
    const { id } = req.params;
    const limit = Math.min(parseInt(req.query.limit) || 6, 20);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book id' });
    }

    const book = await Book.findById(id).select('category');
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    let related = await Book.find({ _id: { $ne: id }, category: book.category })
      .sort({ ratingAverage: -1, ratingCount: -1 })
      .limit(limit);

    if (related.length < limit) {
      const excludeIds = [id, ...related.map((b) => String(b._id))];
      const fallback = await Book.find({ _id: { $nin: excludeIds } })
        .sort({ ratingAverage: -1, ratingCount: -1 })
        .limit(limit - related.length);

      related = [...related, ...fallback];
    }

    res.status(200).json(related);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch related books',
      error: error.message,
    });
  }
};

// GET /api/books/:id/stores
// Returns the physical stores that currently have this book in stock.
const getBookStores = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book id' });
    }

    const inventory = await Inventory.find({ book: id, stock: { $gt: 0 } })
      .populate('store')
      .sort({ stock: -1 });

    const stores = inventory
      .filter((item) => item.store)
      .map((item) => ({
        _id: item.store._id,
        name: item.store.name,
        address: item.store.address,
        city: item.store.city,
        latitude: item.store.latitude,
        longitude: item.store.longitude,
        stock: item.stock,
      }));

    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch store availability',
      error: error.message,
    });
  }
};

// GET single book by ID
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch book',
      error: error.message,
    });
  }
};

// POST /api/books
const createBook = async (req, res) => {
  try {
    const { title, author, description, price, category, image, stock } = req.body;

    if (!title || !author || !description || !price || !category || !image) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const newBook = await Book.create({ title, author, description, price, category, image, stock });
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create book',
      error: error.message,
    });
  }
};

// PUT /api/books/:id (admin)
const updateBook = async (req, res) => {
  try {
    const { title, author, description, price, category, image, stock } = req.body;

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (description !== undefined) book.description = description;
    if (price !== undefined) book.price = price;
    if (category !== undefined) book.category = category;
    if (image !== undefined) book.image = image;
    if (stock !== undefined) book.stock = stock;

    const updated = await book.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update book',
      error: error.message,
    });
  }
};

// DELETE /api/books/:id (admin)
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete book',
      error: error.message,
    });
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getRecommendations,
  getRelatedBooks,
  getBookStores,
};
