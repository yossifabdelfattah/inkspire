import mongoose, { ClientSession } from 'mongoose';
import { Review, IReview } from './review.model';
import { Book } from '../books/book.model';
import { withOptionalTransaction } from '../../utils/transaction';
import { ApiError } from '../../utils/ApiError';
import { AuthUser } from '../auth/user.types';

export interface RatingResult {
  ratingAverage: number;
  ratingCount: number;
}

// Recomputes a book's ratingAverage/ratingCount from its real Review
// documents. Books with no reviews fall back to 0/0.
export const recalculateBookRating = async (
  bookId: string,
  session?: ClientSession | null
): Promise<RatingResult> => {
  const stats = await Review.aggregate(
    [
      { $match: { book: new mongoose.Types.ObjectId(bookId) } },
      { $group: { _id: '$book', average: { $avg: '$rating' }, count: { $sum: 1 } } },
    ],
    { session: session ?? undefined }
  );

  const ratingAverage = stats.length > 0 ? Math.round(stats[0].average * 10) / 10 : 0;
  const ratingCount = stats.length > 0 ? stats[0].count : 0;

  await Book.findByIdAndUpdate(bookId, { ratingAverage, ratingCount }, { session });

  return { ratingAverage, ratingCount };
};

export const getBookReviews = async (bookId: string): Promise<IReview[]> => {
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    throw new ApiError(400, 'Invalid book id');
  }
  return Review.find({ book: bookId }).sort({ createdAt: -1 });
};

export interface UpsertReviewResult extends RatingResult {
  review: IReview;
}

// Creates the user's review, or updates it if one already exists
// (one rating per user per book).
export const upsertBookReview = async (
  bookId: string,
  rating: unknown,
  comment: unknown,
  user: AuthUser
): Promise<UpsertReviewResult> => {
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    throw new ApiError(400, 'Invalid book id');
  }

  const ratingNum = Number(rating);
  if (!Number.isFinite(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    throw new ApiError(400, 'Rating must be a number between 1 and 5');
  }

  const book = await Book.findById(bookId);
  if (!book) {
    throw new ApiError(404, 'Book not found');
  }

  const result = await withOptionalTransaction(async (session) => {
    const review = await Review.findOneAndUpdate(
      { book: bookId, user: user.mongoId },
      {
        book: bookId,
        user: user.mongoId,
        userName: user.name ?? 'Anonymous',
        rating: ratingNum,
        comment: typeof comment === 'string' ? comment.trim() : '',
      },
      { new: true, upsert: true, runValidators: true, session }
    );

    const { ratingAverage, ratingCount } = await recalculateBookRating(bookId, session);

    return { review: review as IReview, ratingAverage, ratingCount };
  });

  return result;
};
