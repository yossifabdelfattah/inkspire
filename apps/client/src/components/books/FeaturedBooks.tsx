import { useState, useEffect } from 'react';
import type { Book } from '../../types/product';
import BookCard from './BookCard';
import BookCardSkeleton from './BookCardSkeleton';
import { Container, Title, SimpleGrid, Text } from '@mantine/core';

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

function FeaturedBooks({ books: propsBooks, loading: propsLoading, onAddToCart }: FeaturedBooksProps = {}) {
  // For demo, simulate loading and use mock data
  const [mockData, setMockData] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(!propsBooks);

  const displayBooks = propsBooks ?? mockData;
  const displayLoading = propsBooks ? propsLoading : isLoading;

  useEffect(() => {
    if (!propsBooks && mockData.length === 0) {
      // Only load mock data if no books prop provided and not already loaded
      const timer = setTimeout(() => {
        setMockData(MOCK_BOOKS);
        setIsLoading(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [propsBooks, mockData.length]);

  return (
    <Container my="lg">
      <Title order={2} size="h3" mb="md">
        Featured Books
      </Title>

      {displayLoading ? (
        <SimpleGrid cols={4} spacing="lg">
          {Array.from({ length: 4 }).map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </SimpleGrid>
      ) : displayBooks.length === 0 ? (
        <Text c="dimmed" ta="center" py="lg">
          No featured books available.
        </Text>
      ) : (
        <SimpleGrid
          cols={{ base: 1, xs: 1, sm: 2, md: 3, lg: 4 }}
          spacing="lg"
        >
          {displayBooks.map((book) => (
            <BookCard key={book.id} book={book} onAddToCart={onAddToCart} />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}

export default FeaturedBooks;
