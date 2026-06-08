import api from '../api/axios';

export interface Review {
  _id: string;
  book: string;
  user: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewSummary {
  review: Review;
  ratingAverage: number;
  ratingCount: number;
}

export async function getBookReviews(bookId: string): Promise<Review[]> {
  const res = await api.get(`/books/${bookId}/reviews`);
  return res.data;
}

export async function submitBookReview(bookId: string, rating: number, comment: string): Promise<ReviewSummary> {
  const res = await api.post(`/books/${bookId}/reviews`, { rating, comment });
  return res.data;
}
