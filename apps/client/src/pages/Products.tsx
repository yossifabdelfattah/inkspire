import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TextInput, Select, Skeleton } from '@mantine/core';
import { motion } from 'framer-motion';
import BookCard from '../components/books/BookCard';
import { useCart } from '../context/useCart';
import type { Book } from '../types/product';
import * as S from './Products.styled';
import { useFetch } from '../hooks/useFetch';

import { getBooks } from '../services/bookService';

const CATEGORIES = ['All', 'Fiction', 'Programming', 'Self-help', 'Science Fiction', 'Mystery', 'History', 'Fantasy', 'Biography'];

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [sort, setSort] = useState('relevance');

  // Derive the active category directly from the URL so that navigating here
  // from "Browse by Category" (or sharing a link) applies the right filter.
  const categoryFromUrl = searchParams.get('category');
  const category = categoryFromUrl && CATEGORIES.includes(categoryFromUrl) ? categoryFromUrl : 'All';

  const handleCategoryChange = (value: string | null) => {
    const next = value ?? 'All';
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (next === 'All') {
        params.delete('category');
      } else {
        params.set('category', next);
      }
      return params;
    });
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Fetch books when filters change
  const { data: books, loading, error } = useFetch<Book[]>(
    (signal) =>
      getBooks(
        {
          search: debouncedQuery,
          category,
          sort: sort !== 'relevance' ? sort : undefined,
        },
        signal
      ),
    [debouncedQuery, category, sort],
    [],
    'Failed to fetch books'
  );

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
            onChange={handleCategoryChange}
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
              <BookCard book={book} onAddToCart={(b) => addToCart(b)} />
            </motion.div>
          ))}
        </S.Grid>
      )}
    </S.Page>
  );
}

export default Products;
