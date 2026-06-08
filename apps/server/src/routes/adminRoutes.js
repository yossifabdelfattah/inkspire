const express = require('express');
const { getTopSearches } = require('../controllers/analyticsController');
const { verifyFirebaseToken, requireAdmin } = require('../middleware/firebaseAuthMiddleware');

const router = express.Router();

// GET /api/admin/analytics/searches
router.get('/analytics/searches', verifyFirebaseToken, requireAdmin, getTopSearches);

module.exports = router;
