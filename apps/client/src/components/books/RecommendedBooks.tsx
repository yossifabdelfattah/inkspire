import type { Book } from '../../types/book';
import FeaturedBooks from './FeaturedBooks';
import { getRecommendations } from '../../services/bookService';
import { useFetch } from '../../hooks/useFetch';

interface RecommendedBooksProps {
  onAddToCart?: (book: Book) => void;
}

function RecommendedBooks({ onAddToCart }: RecommendedBooksProps = {}) {
  const { data: books, loading, error } = useFetch<Book[]>(
    (signal) => getRecommendations(8, signal),
    [],
    [],
    'Failed to load recommendations.'
  );

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
