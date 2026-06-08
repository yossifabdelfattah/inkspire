const express = require('express');
const { getMe } = require('../controllers/userController');
const { verifyFirebaseToken } = require('../middleware/firebaseAuthMiddleware');

const router = express.Router();

// GET /api/users/me
router.get('/me', verifyFirebaseToken, getMe);

module.exports = router;
