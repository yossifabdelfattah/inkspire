const express = require("express");
const router = express.Router();

const {
  getBooks,
  getBookById,
  createBook,
} = require("../controllers/bookController");

// GET all books
router.get("/", getBooks);

// GET single book
router.get("/:id", getBookById);

// POST create book
router.post("/", createBook);

module.exports = router;