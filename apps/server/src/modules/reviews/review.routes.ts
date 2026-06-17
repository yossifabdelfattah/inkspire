import { Router } from 'express';
import * as reviewController from './review.controller';
import { verifyFirebaseToken } from '../auth/firebaseAuth.middleware';

const router = Router({ mergeParams: true });

// GET /api/books/:bookId/reviews
router.get('/', reviewController.getBookReviews);

// POST /api/books/:bookId/reviews (logged-in users only)
router.post('/', verifyFirebaseToken, reviewController.upsertBookReview);

export default router;
