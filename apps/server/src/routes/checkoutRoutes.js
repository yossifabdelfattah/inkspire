const express = require('express');
const { checkout } = require('../controllers/checkoutController');
const { verifyFirebaseToken } = require('../middleware/firebaseAuthMiddleware');

const router = express.Router();

// POST /api/checkout
router.post('/', verifyFirebaseToken, checkout);

module.exports = router;
