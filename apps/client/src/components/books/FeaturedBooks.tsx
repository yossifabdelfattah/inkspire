import { useState, useEffect } from 'react';
import type { Book } from '../../types/product';
import BookCard from './BookCard';
import BookCardSkeleton from './BookCardSkeleton';
import * as S from './FeaturedBooks.styled';
import { getBooks } from '../../services/bookService';

interface FeaturedBooksProps {
  books?: Book[];
  loading?: boolean;
  error?: string | null;
  onAddToCart?: (book: Book) => void;
  headingId?: string;
  title?: string;
  subtitle?: string;
  emptyMessage?: string;
  errorMessage?: string;
}

function FeaturedBooks({
  books: propsBooks,
  loading: propsLoading,
  error: propsError,
  onAddToCart,
  headingId = 'featured-books-heading',
  title = 'Featured Books',
  subtitle = 'Curated picks selected for Inkspire readers.',
  emptyMessage = 'No featured books available.',
  errorMessage = 'Failed to load books.',
}: FeaturedBooksProps = {}) {
  // When no `books` prop is provided, fetch a default set ourselves
  // (used for the "Featured Books" section on the Home page).
  const isSelfFetching = propsBooks === undefined;

  const [fetchedBooks, setFetchedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(isSelfFetching);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSelfFetching) return;

    let mounted = true;
    setIsLoading(true);
    setFetchError(null);

    getBooks({ sort: 'rating' })
      .then((data) => {
        if (mounted) setFetchedBooks(data.slice(0, 8));
      })
      .catch(() => {
        if (mounted) setFetchError(errorMessage);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [isSelfFetching, errorMessage]);

  const displayBooks = propsBooks ?? fetchedBooks;
  const displayLoading = isSelfFetching ? isLoading : (propsLoading ?? false);
  const displayError = isSelfFetching ? fetchError : (propsError ?? null);

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
      ) : displayError ? (
        <S.ErrorText role="alert">{displayError}</S.ErrorText>
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
