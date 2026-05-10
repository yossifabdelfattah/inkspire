import { useEffect, useMemo, useState } from 'react';
import { TextInput, Select, Skeleton } from '@mantine/core';
import { motion } from 'framer-motion';
import BookCard from '../components/books/BookCard';
import { useCart } from '../context/useCart';
import type { Book } from '../types/product';
import * as S from './Products.styled';

import SAMPLE_BOOKS from '../mocks/books';

const CATEGORIES = ['All', 'Fiction', 'Non-fiction', 'Sci‑fi', 'Children'];

function Products() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('relevance');

  useEffect(() => {
    // simulate loading
    const t = setTimeout(() => {
      setBooks(SAMPLE_BOOKS);
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    let res = books.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      res = res.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
    }
    if (category !== 'All') {
      // naive category filtering based on title/author for demo
      res = res.filter((b) => b.title.toLowerCase().includes(category.toLowerCase()) || b.author.toLowerCase().includes(category.toLowerCase()));
    }
    if (sort === 'price-asc') res.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') res.sort((a, b) => b.price - a.price);
    if (sort === 'rating') res.sort((a, b) => b.rating - a.rating);
    return res;
  }, [books, query, category, sort]);

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
            data={[{ value: 'relevance', label: 'Relevance' }, { value: 'price-asc', label: 'Price: Low to High' }, { value: 'price-desc', label: 'Price: High to Low' }, { value: 'rating', label: 'Top Rated' }]}
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
        <S.EmptyState role="alert">Something went wrong. Please try again later.</S.EmptyState>
      ) : filtered.length === 0 ? (
        <S.EmptyState role="status" aria-live="polite">No books match your search. Try clearing filters.</S.EmptyState>
      ) : (
        <S.Grid initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ staggerChildren: 0.04 }} role="list" aria-label="Book results">
          {filtered.map((book) => (
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
