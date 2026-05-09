import { useState, useEffect } from 'react';
import type { Book } from '../../types/product';
import BookCard from './BookCard';
import BookCardSkeleton from './BookCardSkeleton';
import * as S from './FeaturedBooks.styled';

// Example mock data (replace with API call or props in real app)
const MOCK_BOOKS: Book[] = [
  {
    id: 1,
    cover: 'https://covers.openlibrary.org/b/id/10523338-L.jpg',
    title: 'Atomic Habits',
    author: 'James Clear',
    price: 18.99,
    rating: 4.7,
    inStock: true,
  },
  {
    id: 2,
    cover: 'https://covers.openlibrary.org/b/id/11153213-L.jpg',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    price: 15.49,
    rating: 4.3,
    inStock: true,
  },
  {
    id: 3,
    cover: 'https://covers.openlibrary.org/b/id/10958339-L.jpg',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    price: 22.99,
    rating: 4.8,
    inStock: false,
  },
  {
    id: 4,
    cover: 'https://covers.openlibrary.org/b/id/10449159-L.jpg',
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    price: 14.99,
    rating: 4.1,
    inStock: true,
  },
];

interface FeaturedBooksProps {
  books?: Book[];
  loading?: boolean;
  onAddToCart?: (book: Book) => void;
}

function FeaturedBooks({ books, loading, onAddToCart }: FeaturedBooksProps = {}) {
  // For demo, simulate loading and use mock data
  const [isLoading, setIsLoading] = useState(loading ?? true);
  const [data, setData] = useState<Book[]>(books ?? []);

  useEffect(() => {
    if (books) {
      setData(books);
      setIsLoading(!!loading);
    } else {
      setIsLoading(true);
      setTimeout(() => {
        setData(MOCK_BOOKS);
        setIsLoading(false);
      }, 1200);
    }
  }, [books, loading]);

  return (
    <S.Section>
      <S.SectionTitle>Featured Books</S.SectionTitle>
      {isLoading ? (
        <S.Grid initial="hidden" animate="visible">
          {[...Array(4)].map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </S.Grid>
      ) : data.length === 0 ? (
        <S.EmptyState>No featured books available.</S.EmptyState>
      ) : (
        <S.Grid
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08 },
            },
          }}
        >
          {data.map((book) => (
            <BookCard key={book.id} book={book} onAddToCart={onAddToCart} />
          ))}
        </S.Grid>
      )}
    </S.Section>
  );
}

export default FeaturedBooks;
