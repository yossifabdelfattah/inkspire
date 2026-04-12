const express = require('express');
const { getCart } = require('../controllers/cartController');

const router = express.Router();

router.get('/', getCart);

module.exports = router;
