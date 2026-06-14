import type { Book } from '../../types/product';
import BookCard from './BookCard';
import BookCardSkeleton from './BookCardSkeleton';
import * as S from './FeaturedBooks.styled';

interface FeaturedBooksProps {
  books: Book[];
  loading?: boolean;
  error?: string | null;
  onAddToCart?: (book: Book) => void;
  headingId?: string;
  title?: string;
  subtitle?: string;
  emptyMessage?: string;
}

function FeaturedBooks({
  books,
  loading = false,
  error = null,
  onAddToCart,
  headingId = 'featured-books-heading',
  title = 'Featured Books',
  subtitle = 'Curated picks selected for Inkspire readers.',
  emptyMessage = 'No featured books available.',
}: FeaturedBooksProps) {
  return (
    <S.Section aria-labelledby={headingId}>
      <S.Header>
        <S.Title id={headingId}>{title}</S.Title>
        <S.Subtitle>{subtitle}</S.Subtitle>
      </S.Header>

      {loading ? (
        <S.Grid>
          {Array.from({ length: 4 }).map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </S.Grid>
      ) : error ? (
        <S.ErrorText role="alert">{error}</S.ErrorText>
      ) : books.length === 0 ? (
        <S.Empty>{emptyMessage}</S.Empty>
      ) : (
        <S.Grid>
          {books.map((book) => (
            <BookCard key={book.id} book={book} onAddToCart={onAddToCart} />
          ))}
        </S.Grid>
      )}
    </S.Section>
  );
}

export default FeaturedBooks;
