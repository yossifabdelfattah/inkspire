import { Router } from 'express';
import * as reservationController from './reservation.controller';
import { attachUserIfPresent } from '../auth/firebaseAuth.middleware';

const router = Router();

// POST /api/reservations — works for logged-in and anonymous shoppers
router.post('/', attachUserIfPresent, reservationController.createReservation);

// GET /api/reservations/:id
router.get('/:id', attachUserIfPresent, reservationController.getReservation);

export default router;
