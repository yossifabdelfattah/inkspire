const express = require('express');
const { getTopSearches } = require('../controllers/analyticsController');

const router = express.Router();

// GET /api/admin/analytics/searches
router.get('/analytics/searches', getTopSearches);

module.exports = router;
