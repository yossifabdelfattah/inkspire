import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { NumberInput, Button, Rating, Alert, Skeleton } from '@mantine/core';
import { motion } from 'framer-motion';
import type { ProductDetailsRouteParamKey } from '../types';
import type { Book } from '../types/product';
import * as S from './ProductDetails.styled';
import { useCart } from '../context/useCart';
import { getBookById } from '../services/bookService';

function ProductDetails() {
  const { id } = useParams<ProductDetailsRouteParamKey>();
  const bookId = id ?? '';
  const { addToCart } = useCart();

  const [qty, setQty] = useState(1);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const b = await getBookById(bookId);
        if (!mounted) return;
        
        if (b === null) {
          setError('Book not found');
        } else {
          setBook(b);
        }
      } catch (err) {
        if (!mounted) return;
        setError(`Failed to load book: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [bookId]);

  if (loading) {
    return (
      <S.Page as={motion.main} initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="main">
        <S.Layout>
          <div>
            <Skeleton height={400} circle={false} mb="lg" />
          </div>
          <S.Meta>
            <Skeleton height={30} mb="xs" />
            <Skeleton height={20} mb="lg" width="60%" />
            <Skeleton height={100} mb="lg" />
          </S.Meta>
        </S.Layout>
      </S.Page>
    );
  }

  if (error || !book) {
    return (
      <S.Page as={motion.main} initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="main">
        <S.Layout>
          <Alert title={error ? 'Error' : 'Not Found'} color="red" role="alert">
            {error || 'The book you are looking for does not exist.'}
          </Alert>
        </S.Layout>
      </S.Page>
    );
  }

  const handleAddToCart = () => {
    // Map `Book` to `Product` shape expected by cart context
    const product = { _id: book.id.toString(), name: book.title, price: book.price };
    for (let i = 0; i < qty; i++) addToCart(product);
  };

  return (
    <S.Page as={motion.main} initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="main" aria-labelledby={`book-title-${book.id}`}>
      <S.Layout>
        <div>
          <S.Cover src={book.cover} alt={book.title} loading="lazy" />
        </div>

        <S.Meta>
          <div>
            <S.Title id={`book-title-${book.id}`}>{book.title}</S.Title>
            <S.Author>by {book.author}</S.Author>
          </div>

          <div>
            <S.PriceRow>
              <S.Price aria-hidden>${book.price.toFixed(2)}</S.Price>
              <Rating value={book.rating} readOnly fractions={2} size="sm" aria-label={`Rating ${book.rating} out of 5`} />
              <S.Stock $inStock={book.inStock} aria-live="polite">{book.inStock ? 'In Stock' : 'Out of Stock'}</S.Stock>
            </S.PriceRow>

            <S.ControlsRow>
              <NumberInput
                value={qty}
                onChange={(v) => {
                  const parsed = typeof v === 'number' ? v : Number(v);
                  setQty(Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1);
                }}
                min={1}
                max={99}
                aria-label="Quantity"
              />
              <Button onClick={handleAddToCart} disabled={!book.inStock} radius="md" aria-label={`Add ${qty} ${book.title} to cart`}>Add to Cart</Button>
            </S.ControlsRow>
          </div>

          <S.Description>
            <S.SectionTitle>Description</S.SectionTitle>
            <p>
              This is a placeholder description for <strong>{book.title}</strong>. Replace with real book description from the API later. The description should summarize the book, highlight key themes, and entice readers to purchase.
            </p>
          </S.Description>

          <S.Section>
            <S.SectionTitle>Reviews & Comments</S.SectionTitle>
            <S.Placeholder role="region" aria-label="Reviews placeholder">Realtime comments and reviews will appear here (future feature).</S.Placeholder>
          </S.Section>

          <S.Section>
            <S.SectionTitle>Store Availability</S.SectionTitle>
            <S.Placeholder role="region" aria-label="Store availability placeholder">Map and store availability will be integrated here (Leaflet map planned).</S.Placeholder>
          </S.Section>

          <S.Section>
            <S.SectionTitle>Related Books</S.SectionTitle>
            <S.Placeholder role="region" aria-label="Related books placeholder">Related books carousel or recommendations will appear here.</S.Placeholder>
          </S.Section>
        </S.Meta>
      </S.Layout>
    </S.Page>
  );
}

export default ProductDetails;