import { Card, Text, Group, Badge, Button, Rating } from '@mantine/core';
import type { Book } from '../../types/product';

interface BookCardProps {
  book: Book;
  onAddToCart?: (book: Book) => void;
}

function BookCard({ book, onAddToCart }: BookCardProps) {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder role="article" aria-labelledby={`book-title-${book.id}`}>
      <Card.Section>
        <img src={book.cover} alt={book.title} height={200} style={{ width: '100%', height: 200, objectFit: 'cover' }} loading="lazy" />
      </Card.Section>

      <Text id={`book-title-${book.id}`} fw={700} mt="sm" truncate title={book.title}>
        {book.title}
      </Text>
      <Text component="p" size="sm" c="dimmed" truncate>
        {book.author}
      </Text>

      <Group justify="space-between" align="center" mt="xs">
        <Rating value={book.rating} readOnly fractions={2} size="sm" aria-label={`Rating ${book.rating} out of 5`} />
        <Badge color={book.inStock ? 'green' : 'red'} variant="light" aria-hidden>
          {book.inStock ? 'In Stock' : 'Out of Stock'}
        </Badge>
      </Group>

      <Group justify="space-between" align="center" mt="md">
        <div aria-hidden>
          <Text fw={600} c="blue">${book.price.toFixed(2)}</Text>
        </div>
      </Group>

      <Button fullWidth mt="md" radius="md" color="indigo" disabled={!book.inStock} onClick={() => onAddToCart?.(book)} aria-label={`Add ${book.title} to cart`}>
        Add to Cart
      </Button>
    </Card>
  );
}

export default BookCard;
