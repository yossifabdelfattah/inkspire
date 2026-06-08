const express = require('express');
const { createOrder, getMyOrders } = require('../controllers/orderController');
const { verifyFirebaseToken } = require('../middleware/firebaseAuthMiddleware');

const router = express.Router();

router.route('/').post(verifyFirebaseToken, createOrder).get(verifyFirebaseToken, getMyOrders);

module.exports = router;
