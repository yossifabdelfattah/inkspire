const express = require('express');
const { createBookRequest, getBookRequests } = require('../controllers/bookRequestController');

const router = express.Router();

// POST /api/book-requests
router.post('/', createBookRequest);

// GET /api/book-requests
router.get('/', getBookRequests);

module.exports = router;
