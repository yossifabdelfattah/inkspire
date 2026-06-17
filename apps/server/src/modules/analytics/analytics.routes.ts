import { Router } from 'express';
import * as analyticsController from './analytics.controller';

// Mounted under /api/admin/analytics by the admin module, which applies the
// verifyFirebaseToken + requireAdmin guard. These routes assume the caller is
// already authenticated as an admin.
const router = Router();

router.get('/overview', analyticsController.getOverview);
router.get('/searches', analyticsController.getTopSearches);
router.get('/sales', analyticsController.getSalesOverTime);
router.get('/requests', analyticsController.getMostRequestedBooks);
router.get('/purchases', analyticsController.getTopPurchasedBooks);

export default router;
