import { Router } from 'express';
import * as bookRequestController from './bookRequest.controller';
import {
  verifyFirebaseToken,
  requireAdmin,
  attachUserIfPresent,
} from '../auth/firebaseAuth.middleware';
import { validateObjectId } from '../../middleware/validateObjectId.middleware';

const router = Router();

// POST /api/book-requests
router.post('/', attachUserIfPresent, bookRequestController.createBookRequest);

// GET /api/book-requests (admin only)
router.get('/', verifyFirebaseToken, requireAdmin, bookRequestController.getBookRequests);

// GET /api/book-requests/:id/candidates (admin only) — metadata suggestions for approval
router.get(
  '/:id/candidates',
  verifyFirebaseToken,
  requireAdmin,
  validateObjectId('id'),
  bookRequestController.getBookRequestCandidates
);

// PATCH /api/book-requests/:id (admin only) — approve/reject
router.patch(
  '/:id',
  verifyFirebaseToken,
  requireAdmin,
  validateObjectId('id'),
  bookRequestController.updateBookRequestStatus
);

export default router;
