import { Card, Image, Text, Group, Badge, Button, Rating } from '@mantine/core';
import type { Book } from '../../types/product';

interface BookCardProps {
  book: Book;
  onAddToCart?: (book: Book) => void;
}

function BookCard({ book, onAddToCart }: BookCardProps) {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Card.Section>
        <Image src={book.cover} alt={book.title} height={200} fit="cover" />
      </Card.Section>

      <Text fw={700} mt="sm" truncate title={book.title}>
        {book.title}
      </Text>
      <Text size="sm" c="dimmed" truncate>
        {book.author}
      </Text>

      <Group justify="space-between" align="center" mt="xs">
        <Rating value={book.rating} readOnly fractions={2} size="sm" />
        <Badge color={book.inStock ? 'green' : 'red'} variant="light">
          {book.inStock ? 'In Stock' : 'Out of Stock'}
        </Badge>
      </Group>

      <Group justify="space-between" align="center" mt="md">
        <Text fw={600} c="blue">${book.price.toFixed(2)}</Text>
      </Group>

      <Button fullWidth mt="md" radius="md" color="indigo" disabled={!book.inStock} onClick={() => onAddToCart?.(book)}>
        Add to Cart
      </Button>
    </Card>
  );
}

export default BookCard;
