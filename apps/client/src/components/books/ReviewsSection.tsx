import { useEffect, useState } from 'react';
import { Button, Rating, Textarea, Alert, Loader } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { getSocket } from '../../services/socket';
import { getBookReviews, submitBookReview, type Review, type ReviewSummary } from '../../services/reviewService';
import * as S from './ReviewsSection.styled';

interface ReviewsSectionProps {
  bookId: string;
  ratingAverage: number;
  ratingCount: number;
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

function ReviewsSection({ bookId, ratingAverage, ratingCount }: ReviewsSectionProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [average, setAverage] = useState(ratingAverage);
  const [count, setCount] = useState(ratingCount);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await getBookReviews(bookId);
        if (mounted) setReviews(data);
      } catch {
        // keep list empty on failure
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [bookId]);

  useEffect(() => {
    const socket = getSocket();
    socket.emit('joinBookRoom', bookId);

    const handleUpdate = (payload: { bookId: string } & ReviewSummary) => {
      if (payload.bookId !== bookId) return;

      setAverage(payload.ratingAverage);
      setCount(payload.ratingCount);
      setReviews((prev) => {
        const others = prev.filter((r) => r._id !== payload.review._id);
        return [payload.review, ...others];
      });
    };

    socket.on('review:updated', handleUpdate);

    return () => {
      socket.emit('leaveBookRoom', bookId);
      socket.off('review:updated', handleUpdate);
    };
  }, [bookId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating < 1) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      await submitBookReview(bookId, rating, comment);
      setStatus('success');
      setComment('');
    } catch {
      setStatus('error');
      setErrorMessage('Could not submit your review. Please try again.');
    }
  };

  return (
    <>
      <S.SummaryRow>
        <Rating value={average} readOnly fractions={2} aria-label={`Average rating ${average} out of 5`} />
        <span>
          {average.toFixed(1)} ({count} {count === 1 ? 'review' : 'reviews'})
        </span>
      </S.SummaryRow>

      {user ? (
        <S.Form onSubmit={handleSubmit} aria-label="Submit a review">
          {status === 'success' && (
            <Alert title="Thanks for your review!" color="green">
              Your rating and comment have been saved.
            </Alert>
          )}
          {status === 'error' && (
            <Alert title="Submission failed" color="red">
              {errorMessage}
            </Alert>
          )}

          <label htmlFor="review-rating">Your rating</label>
          <Rating id="review-rating" value={rating} onChange={setRating} aria-label="Your rating" />

          <label htmlFor="review-comment">Your comment (optional)</label>
          <Textarea
            id="review-comment"
            placeholder="Share your thoughts about this book..."
            value={comment}
            onChange={(e) => setComment(e.currentTarget.value)}
            minRows={2}
          />

          <div>
            <Button type="submit" loading={status === 'loading'} disabled={rating < 1 || status === 'loading'}>
              Submit Review
            </Button>
          </div>
        </S.Form>
      ) : (
        <Alert title="Want to leave a review?" color="blue" mb="sm">
          <Link to="/login">Log in</Link> to rate and comment on this book.
        </Alert>
      )}

      {loading ? (
        <Loader size="sm" />
      ) : reviews.length === 0 ? (
        <p>No reviews yet — be the first to share your thoughts!</p>
      ) : (
        <S.List>
          {reviews.map((r) => (
            <S.ReviewCard key={r._id}>
              <S.ReviewHeader>
                <S.ReviewerName>{r.userName}</S.ReviewerName>
                <S.ReviewDate>{new Date(r.createdAt).toLocaleDateString()}</S.ReviewDate>
              </S.ReviewHeader>
              <Rating value={r.rating} readOnly size="sm" aria-label={`Rated ${r.rating} out of 5`} />
              {r.comment && <p>{r.comment}</p>}
            </S.ReviewCard>
          ))}
        </S.List>
      )}
    </>
  );
}

export default ReviewsSection;
