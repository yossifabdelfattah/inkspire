import { useState, useEffect } from 'react';
import type { Book } from '../../types/product';
import BookCard from './BookCard';
import BookCardSkeleton from './BookCardSkeleton';
import * as S from './FeaturedBooks.styled';
import SAMPLE_BOOKS from '../../mocks/books';

interface FeaturedBooksProps {
  books?: Book[];
  loading?: boolean;
  onAddToCart?: (book: Book) => void;
  headingId?: string;
  title?: string;
  subtitle?: string;
  emptyMessage?: string;
}

function FeaturedBooks({
  books: propsBooks,
  loading: propsLoading,
  onAddToCart,
  headingId = 'featured-books-heading',
  title = 'Featured Books',
  subtitle = 'Curated picks selected for Inkspire readers.',
  emptyMessage = 'No featured books available.',
}: FeaturedBooksProps = {}) {
  // For demo, simulate loading and use centralized mock data
  const [mockData, setMockData] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(!propsBooks);

  const displayBooks = propsBooks ?? mockData;
  const displayLoading = propsBooks ? propsLoading : isLoading;

  useEffect(() => {
    if (!propsBooks && mockData.length === 0) {
      const timer = setTimeout(() => {
        setMockData(SAMPLE_BOOKS);
        setIsLoading(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [propsBooks, mockData.length]);

  return (
    <S.Section aria-labelledby={headingId}>
      <S.Header>
        <S.Title id={headingId}>{title}</S.Title>
        <S.Subtitle>{subtitle}</S.Subtitle>
      </S.Header>

      {displayLoading ? (
        <S.Grid>
          {Array.from({ length: 4 }).map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </S.Grid>
      ) : displayBooks.length === 0 ? (
        <S.Empty>{emptyMessage}</S.Empty>
      ) : (
        <S.Grid>
          {displayBooks.map((book) => (
            <BookCard key={book.id} book={book} onAddToCart={onAddToCart} />
          ))}
        </S.Grid>
      )}
    </S.Section>
  );
}

export default FeaturedBooks;
