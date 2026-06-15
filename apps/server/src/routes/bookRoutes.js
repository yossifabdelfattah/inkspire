const express = require("express");
const router = express.Router();

const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getRecommendations,
  getRelatedBooks,
  getBookStores,
} = require("../controllers/bookController");
const { verifyFirebaseToken, requireAdmin, attachUserIfPresent } = require("../middleware/firebaseAuthMiddleware");
const { validateObjectId } = require("../middleware/validateObjectId");

// GET all books
router.get("/", getBooks);

// GET personalized recommendations (works for both logged-in and anonymous users)
router.get("/recommendations", attachUserIfPresent, getRecommendations);

// GET books related to a given book (same category)
router.get("/:id/related", getRelatedBooks);

// GET stores where a given book is currently in stock
router.get("/:id/stores", getBookStores);

// GET single book
router.get("/:id", validateObjectId("id"), getBookById);

// POST create book (admin)
router.post("/", verifyFirebaseToken, requireAdmin, createBook);

// PUT update book (admin)
router.put("/:id", verifyFirebaseToken, requireAdmin, validateObjectId("id"), updateBook);

// DELETE book (admin)
router.delete("/:id", verifyFirebaseToken, requireAdmin, validateObjectId("id"), deleteBook);

module.exports = router;
