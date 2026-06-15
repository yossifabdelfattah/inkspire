const express = require('express');
const { createBookRequest, getBookRequests, updateBookRequestStatus } = require('../controllers/bookRequestController');
const { verifyFirebaseToken, requireAdmin, attachUserIfPresent } = require('../middleware/firebaseAuthMiddleware');
const { validateObjectId } = require('../middleware/validateObjectId');

const router = express.Router();

// POST /api/book-requests
router.post('/', attachUserIfPresent, createBookRequest);

// GET /api/book-requests (admin only)
router.get('/', verifyFirebaseToken, requireAdmin, getBookRequests);

// PATCH /api/book-requests/:id (admin only) — approve/reject
router.patch('/:id', verifyFirebaseToken, requireAdmin, validateObjectId('id'), updateBookRequestStatus);

module.exports = router;
