import { useEffect, useState } from 'react';
import type { Book } from '../../types/product';
import FeaturedBooks from './FeaturedBooks';
import { getRecommendations } from '../../services/bookService';

function RecommendedBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getRecommendations(8)
      .then((data) => {
        if (mounted) setBooks(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (!loading && books.length === 0) return null;

  return (
    <FeaturedBooks
      books={books}
      loading={loading}
      headingId="recommended-books-heading"
      title="Recommended for You"
      subtitle="Picks based on your reading history."
      emptyMessage="No recommendations yet."
    />
  );
}

export default RecommendedBooks;
