const express = require('express');
const { body } = require('express-validator');
const { getUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.get('/user', protect, getUser);

router.put(
  '/user',
  protect,
  [
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  validateRequest,
  updateUser
);

router.delete('/user', protect, deleteUser);

module.exports = router;