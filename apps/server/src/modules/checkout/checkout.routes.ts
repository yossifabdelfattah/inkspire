import { Router } from 'express';
import * as checkoutController from './checkout.controller';
import { verifyFirebaseToken } from '../auth/firebaseAuth.middleware';

const router = Router();

// POST /api/checkout
router.post('/', verifyFirebaseToken, checkoutController.checkout);

export default router;
