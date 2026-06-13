const express = require('express');
const { getMe, updateMe } = require('../controllers/userController');
const { verifyFirebaseToken } = require('../middleware/firebaseAuthMiddleware');

const router = express.Router();

// GET /api/users/me
router.get('/me', verifyFirebaseToken, getMe);

// PATCH /api/users/me
router.patch('/me', verifyFirebaseToken, updateMe);

module.exports = router;
