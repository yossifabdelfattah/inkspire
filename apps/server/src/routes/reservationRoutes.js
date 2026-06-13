const express = require('express');
const { createReservation, getReservation } = require('../controllers/reservationController');
const { attachUserIfPresent } = require('../middleware/firebaseAuthMiddleware');

const router = express.Router();

// POST /api/reservations — works for logged-in and anonymous shoppers
router.post('/', attachUserIfPresent, createReservation);

// GET /api/reservations/:id
router.get('/:id', getReservation);

module.exports = router;
