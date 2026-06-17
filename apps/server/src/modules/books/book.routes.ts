import { Router } from 'express';
import * as bookController from './book.controller';
import {
  verifyFirebaseToken,
  requireAdmin,
  attachUserIfPresent,
} from '../auth/firebaseAuth.middleware';
import { validateObjectId } from '../../middleware/validateObjectId.middleware';

const router = Router();

// GET all books (attaches the user if logged in, so search logs can record who searched)
router.get('/', attachUserIfPresent, bookController.getBooks);

// GET personalized recommendations (works for both logged-in and anonymous users)
router.get('/recommendations', attachUserIfPresent, bookController.getRecommendations);

// GET books related to a given book (same category)
router.get('/:id/related', bookController.getRelatedBooks);

// GET stores where a given book is currently in stock
router.get('/:id/stores', bookController.getBookStores);

// GET single book
router.get('/:id', validateObjectId('id'), bookController.getBookById);

// POST create book (admin)
router.post('/', verifyFirebaseToken, requireAdmin, bookController.createBook);

// PUT update book (admin)
router.put('/:id', verifyFirebaseToken, requireAdmin, validateObjectId('id'), bookController.updateBook);

// DELETE book (admin)
router.delete('/:id', verifyFirebaseToken, requireAdmin, validateObjectId('id'), bookController.deleteBook);

export default router;
