import api from '../api/axios';
import type { Book } from '../types/product';
import type { BookApiItem } from '../types/backend';
import SAMPLE_BOOKS from '../mocks/books';

function mapToBook(item: BookApiItem, index = 0): Book {
  const productId = item._id ?? index + 1;
  const id = typeof productId === 'number' ? productId : Number(productId) || index + 1;

  return {
    id,
    cover: item.image && item.image.length > 0 ? item.image : '/placeholder-cover.png',
    title: item.title,
    author: item.author ?? 'Unknown Author',
    price: item.price,
    rating: item.ratingAverage ?? 0,
    inStock: (item.stock ?? 0) > 0,
  };
}

export async function getBooks(): Promise<Book[]> {
  // Fetch from /api/products endpoint
  try {
    const res = await api.get('/books');
    if (res?.data) {
      const items: BookApiItem[] = Array.isArray(res.data) ? res.data : res.data.items ?? [];
      if (items.length > 0) return items.map((it, i) => mapToBook(it, i));
    }
  } catch {
    // Fall back to mock data on API failure
  }

  return SAMPLE_BOOKS;
}

export async function getBookById(id: string | number): Promise<Book | null> {
  try {
    const res = await api.get(`/books/${id}`);
    if (res?.data) {
      return mapToBook(res.data);
    }
  } catch {
    // Fall back to mock data on API failure
  }

  // Try mock data as fallback
  const found = SAMPLE_BOOKS.find((b) => String(b.id) === String(id));
  if (found) return found;

  // Return null to indicate book not found
  return null;
}

export default { getBooks, getBookById };
