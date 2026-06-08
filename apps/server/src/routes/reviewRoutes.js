const express = require('express');
const { getBookReviews, upsertBookReview } = require('../controllers/reviewController');
const { verifyFirebaseToken } = require('../middleware/firebaseAuthMiddleware');

const router = express.Router({ mergeParams: true });

// GET /api/books/:bookId/reviews
router.get('/', getBookReviews);

// POST /api/books/:bookId/reviews (logged-in users only)
router.post('/', verifyFirebaseToken, upsertBookReview);

module.exports = router;
