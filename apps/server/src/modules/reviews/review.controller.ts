import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { getIO } from '../../config/socket';
import * as reviewService from './review.service';

// GET /api/books/:bookId/reviews
export const getBookReviews = asyncHandler(async (req: Request, res: Response) => {
  const reviews = await reviewService.getBookReviews(req.params.bookId as string);
  res.status(200).json(reviews);
});

// POST /api/books/:bookId/reviews
export const upsertBookReview = asyncHandler(async (req: Request, res: Response) => {
  const bookId = req.params.bookId as string;
  const { rating, comment } = req.body;

  const { review, ratingAverage, ratingCount } = await reviewService.upsertBookReview(
    bookId,
    rating,
    comment,
    req.user!
  );

  const io = getIO();
  if (io) {
    io.to(`book:${bookId}`).emit('review:updated', { bookId, review, ratingAverage, ratingCount });
  }

  res.status(200).json({ review, ratingAverage, ratingCount });
});
