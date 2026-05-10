import { useEffect, useMemo, useState } from 'react';
import { TextInput, Select, Skeleton } from '@mantine/core';
import { motion } from 'framer-motion';
import BookCard from '../components/books/BookCard';
import { useCart } from '../context/useCart';
import type { Book } from '../types/product';
import * as S from './Products.styled';

const SAMPLE_BOOKS: Book[] = [
  { id: 1, cover: 'https://covers.openlibrary.org/b/id/10523338-L.jpg', title: 'Atomic Habits', author: 'James Clear', price: 18.99, rating: 4.7, inStock: true },
  { id: 2, cover: 'https://covers.openlibrary.org/b/id/11153213-L.jpg', title: 'The Midnight Library', author: 'Matt Haig', price: 15.49, rating: 4.3, inStock: true },
  { id: 3, cover: 'https://covers.openlibrary.org/b/id/10958339-L.jpg', title: 'Project Hail Mary', author: 'Andy Weir', price: 22.99, rating: 4.8, inStock: false },
  { id: 4, cover: 'https://covers.openlibrary.org/b/id/10449159-L.jpg', title: 'The Silent Patient', author: 'Alex Michaelides', price: 14.99, rating: 4.1, inStock: true },
  { id: 5, cover: 'https://covers.openlibrary.org/b/id/10523339-L.jpg', title: 'The Great Novel', author: 'A. Author', price: 12.99, rating: 4.0, inStock: true },
];

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
