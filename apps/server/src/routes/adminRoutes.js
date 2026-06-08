const express = require('express');
const {
  getTopSearches,
  getOverview,
  getSalesOverTime,
  getMostRequestedBooks,
  getTopPurchasedBooks,
} = require('../controllers/analyticsController');
const { verifyFirebaseToken, requireAdmin } = require('../middleware/firebaseAuthMiddleware');

const router = express.Router();

router.use(verifyFirebaseToken, requireAdmin);

// GET /api/admin/analytics/overview
router.get('/analytics/overview', getOverview);

// GET /api/admin/analytics/searches
router.get('/analytics/searches', getTopSearches);

// GET /api/admin/analytics/sales
router.get('/analytics/sales', getSalesOverTime);

// GET /api/admin/analytics/requests
router.get('/analytics/requests', getMostRequestedBooks);

// GET /api/admin/analytics/purchases
router.get('/analytics/purchases', getTopPurchasedBooks);

module.exports = router;
