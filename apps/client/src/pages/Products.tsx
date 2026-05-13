import { useEffect, useState } from 'react';
import { TextInput, Select, Skeleton } from '@mantine/core';
import { motion } from 'framer-motion';
import BookCard from '../components/books/BookCard';
import { useCart } from '../context/useCart';
import type { Book } from '../types/product';
import * as S from './Products.styled';

import SAMPLE_BOOKS from '../mocks/books';
import { getBooks } from '../services/bookService';

const CATEGORIES = ['All', 'Fiction', 'Programming', 'Self-help', 'Science Fiction', 'Mystery', 'History', 'Fantasy', 'Biography'];

function Products() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('relevance');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Fetch books when filters change
  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getBooks({
          search: debouncedQuery,
          category,
          sort: sort !== 'relevance' ? sort : undefined,
        });
        if (!mounted) return;
        setBooks(data);
      } catch {
        if (!mounted) return;
        setError('Failed to fetch books');
        setBooks(SAMPLE_BOOKS);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [debouncedQuery, category, sort]);

  const { addToCart } = useCart();

  return (
    <S.Page>
      <S.Header>
        <div>
          <S.Title>Books</S.Title>
          <S.Subtitle>Browse Inkspire’s catalog</S.Subtitle>
        </div>

        <S.Controls>
          <TextInput
            placeholder="Search by title or author"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search books"
          />

          <Select
            data={CATEGORIES.map((c) => ({ value: c, label: c }))}
            value={category}
            onChange={(v) => setCategory(v ?? 'All')}
            aria-label="Filter by category"
          />

          <Select
            data={[{ value: 'relevance', label: 'Relevance' }, { value: 'price-asc', label: 'Price: Low to High' }, { value: 'price-desc', label: 'Price: High to Low' }, { value: 'rating', label: 'Top Rated' }, { value: 'newest', label: 'Newest' }]}
            value={sort}
            onChange={(v) => setSort(v ?? 'relevance')}
            aria-label="Sort books"
          />
        </S.Controls>
      </S.Header>

      {loading ? (
        <S.Grid initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="status" aria-live="polite" aria-busy="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={320} />
          ))}
        </S.Grid>
      ) : error ? (
        <S.EmptyState role="alert">{error}</S.EmptyState>
      ) : books.length === 0 ? (
        <S.EmptyState role="status" aria-live="polite">No books match your search. Try clearing filters.</S.EmptyState>
      ) : (
        <S.Grid initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ staggerChildren: 0.04 }} role="list" aria-label="Book results">
          {books.map((book) => (
            <motion.div key={book.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} role="listitem">
              <BookCard book={book} onAddToCart={(b) => addToCart({ _id: b.id.toString(), name: b.title, price: b.price })} />
            </motion.div>
          ))}
        </S.Grid>
      )}
    </S.Page>
  );
}

export default Products;
