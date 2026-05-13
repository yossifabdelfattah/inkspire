const Book = require("../models/Book");

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
      if (minPrice) {
        filter.price.$gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        filter.price.$lte = parseFloat(maxPrice);
      }
    }
    
    // Build sort object
    let sortObj = {};
    if (sort === 'price-asc') {
      sortObj = { price: 1 };
    } else if (sort === 'price-desc') {
      sortObj = { price: -1 };
    } else if (sort === 'rating') {
      sortObj = { ratingAverage: -1 };
    } else if (sort === 'newest') {
      sortObj = { createdAt: -1 };
    }
    
    // Execute query
    const books = await Book.find(filter).sort(sortObj);

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch books",
      error: error.message,
    });
  }
};

// GET single book by ID
const getBookById = async (req, res) => {
  try {
    const bookId = req.params.id;

    const book = await Book.findById(bookId);

    // book not found
    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch book",
      error: error.message,
    });
  }
};

// POST /api/books
const createBook = async (req, res) => {
    try {
      const {
        title,
        author,
        description,
        price,
        category,
        image,
        stock,
      } = req.body;
  
      // simple validation
      if (
        !title ||
        !author ||
        !description ||
        !price ||
        !category ||
        !image
      ) {
        return res.status(400).json({
          message: "Please provide all required fields",
        });
      }
  
      const newBook = await Book.create({
        title,
        author,
        description,
        price,
        category,
        image,
        stock,
      });
  
      res.status(201).json(newBook);
    } catch (error) {
      res.status(500).json({
        message: "Failed to create book",
        error: error.message,
      });
    }
  };
  
  module.exports = {
    getBooks,
    getBookById,
    createBook,
  };

