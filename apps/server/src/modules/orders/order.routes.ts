import { Router } from 'express';
import * as orderController from './order.controller';
import { verifyFirebaseToken } from '../auth/firebaseAuth.middleware';

const router = Router();

router
  .route('/')
  .post(verifyFirebaseToken, orderController.createOrder)
  .get(verifyFirebaseToken, orderController.getMyOrders);

export default router;
