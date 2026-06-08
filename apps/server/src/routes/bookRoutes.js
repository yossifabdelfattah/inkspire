const express = require("express");
const router = express.Router();

const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");
const { verifyFirebaseToken, requireAdmin } = require("../middleware/firebaseAuthMiddleware");

// GET all books
router.get("/", getBooks);

// GET single book
router.get("/:id", getBookById);

// POST create book (admin)
router.post("/", verifyFirebaseToken, requireAdmin, createBook);

// PUT update book (admin)
router.put("/:id", verifyFirebaseToken, requireAdmin, updateBook);

// DELETE book (admin)
router.delete("/:id", verifyFirebaseToken, requireAdmin, deleteBook);

module.exports = router;
