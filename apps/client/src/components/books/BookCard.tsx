import { Button as MantineButton, Rating, Badge } from '@mantine/core';
import type { Book } from '../../types/product';
import * as S from './BookCard.styled';

interface BookCardProps {
  book: Book;
  onAddToCart?: (book: Book) => void;
}

function BookCard({ book, onAddToCart }: BookCardProps) {
  return (
    <S.Card whileHover={{ scale: 1.03 }}>
      <S.Cover src={book.cover} alt={book.title} />
      <S.Title title={book.title}>{book.title}</S.Title>
      <S.Author>{book.author}</S.Author>
      <Rating value={book.rating} fractions={2} readOnly size="sm" />
      <S.CardFooter>
        <S.Price>${book.price.toFixed(2)}</S.Price>
        <Badge color={book.inStock ? 'green' : 'red'} variant="light" style={{ marginLeft: 'auto' }}>
          {book.inStock ? 'In Stock' : 'Out of Stock'}
        </Badge>
      </S.CardFooter>
      <MantineButton
        size="xs"
        radius="md"
        color="indigo"
        fullWidth
        disabled={!book.inStock}
        onClick={() => onAddToCart?.(book)}
        style={{ marginTop: 8 }}
      >
        Add to Cart
      </MantineButton>
    </S.Card>
  );
}

export default BookCard;
