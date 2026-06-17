import { Router } from 'express';
import analyticsRoutes from '../analytics/analytics.routes';
import { verifyFirebaseToken, requireAdmin } from '../auth/firebaseAuth.middleware';

const router = Router();

// Every admin route requires an authenticated admin user.
router.use(verifyFirebaseToken, requireAdmin);

// GET /api/admin/analytics/*
router.use('/analytics', analyticsRoutes);

export default router;
