const express = require('express');
const { createBookRequest, getBookRequests } = require('../controllers/bookRequestController');
const { verifyFirebaseToken, requireAdmin } = require('../middleware/firebaseAuthMiddleware');

const router = express.Router();

// POST /api/book-requests
router.post('/', createBookRequest);

// GET /api/book-requests (admin only)
router.get('/', verifyFirebaseToken, requireAdmin, getBookRequests);

module.exports = router;
