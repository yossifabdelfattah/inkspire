import { Badge, Button, Rating } from '@mantine/core';
import type { Book } from '../../types/product';
import * as S from './BookCard.styled';

interface BookCardProps {
  book: Book;
  onAddToCart?: (book: Book) => void;
}

function BookCard({ book, onAddToCart }: BookCardProps) {
  return (
    <S.Card role="article" aria-labelledby={`book-title-${book.id}`}>
      <S.CoverLink to={`/books/${book.id}`} aria-label={`View details for ${book.title}`}>
        <S.CoverWrap>
          <S.Cover src={book.cover} alt={book.title} loading="lazy" />
        </S.CoverWrap>
      </S.CoverLink>

      <S.Content>
        <S.TitleLink to={`/books/${book.id}`}>
          <S.Title id={`book-title-${book.id}`} title={book.title}>
            {book.title}
          </S.Title>
        </S.TitleLink>
        <S.Author>{book.author}</S.Author>

        <S.MetaRow>
          <Rating value={book.rating} readOnly fractions={2} size="sm" aria-label={`Rating ${book.rating} out of 5`} />
          <Badge color={book.inStock ? 'green' : 'red'} variant="light" aria-hidden>
            {book.inStock ? 'In Stock' : 'Out of Stock'}
          </Badge>
        </S.MetaRow>

        <S.MetaRow>
          <S.Price aria-hidden>${book.price.toFixed(2)}</S.Price>
        </S.MetaRow>

        <S.ActionWrap>
          <Button
            fullWidth
            radius="md"
            color="indigo"
            disabled={!book.inStock}
            onClick={() => onAddToCart?.(book)}
            aria-label={`Add ${book.title} to cart`}
          >
            Add to Cart
          </Button>
        </S.ActionWrap>
      </S.Content>
    </S.Card>
  );
}

export default BookCard;
