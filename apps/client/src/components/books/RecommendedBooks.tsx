import { useEffect, useState } from 'react';
import type { Book } from '../../types/product';
import FeaturedBooks from './FeaturedBooks';
import { getRecommendations } from '../../services/bookService';

interface RecommendedBooksProps {
  onAddToCart?: (book: Book) => void;
}

function RecommendedBooks({ onAddToCart }: RecommendedBooksProps = {}) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    getRecommendations(8)
      .then((data) => {
        if (mounted) setBooks(data);
      })
      .catch(() => {
        if (mounted) setError('Failed to load recommendations.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Hide the section entirely when there's simply nothing to recommend.
  if (!loading && !error && books.length === 0) return null;

  return (
    <FeaturedBooks
      books={books}
      loading={loading}
      error={error}
      onAddToCart={onAddToCart}
      headingId="recommended-books-heading"
      title="Recommended for You"
      subtitle="Picks based on your reading history."
      emptyMessage="No recommendations yet."
    />
  );
}

export default RecommendedBooks;
