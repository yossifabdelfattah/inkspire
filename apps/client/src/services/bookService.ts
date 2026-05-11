import api from '../api/axios';
import type { Book } from '../types/product';
import SAMPLE_BOOKS from '../mocks/books';

type BackendProduct = Record<string, any>;

function mapToBook(item: BackendProduct, index = 0): Book {
  const idCandidate = item.id ?? item._id ?? index + 1;
  const id = typeof idCandidate === 'number' ? idCandidate : Number(idCandidate) || index + 1;

  return {
    id,
    cover: item.cover ?? item.image ?? item.thumbnail ?? '/placeholder-cover.png',
    title: item.title ?? item.name ?? 'Untitled',
    author: item.author ?? item.writer ?? 'Unknown',
    price: Number(item.price ?? 0),
    rating: Number(item.rating ?? 0),
    inStock: Boolean(item.inStock ?? item.stock ?? item.available ?? false),
  };
}

export async function getBooks(): Promise<Book[]> {
  // Try common endpoints on server, fall back to SAMPLE_BOOKS on any failure
  const endpoints = ['books', 'products'];

  for (const ep of endpoints) {
    try {
      const res = await api.get(`/${ep}`);
      if (res?.data) {
        const items: BackendProduct[] = Array.isArray(res.data) ? res.data : res.data.items ?? [];
        if (items.length > 0) return items.map((it, i) => mapToBook(it, i));
      }
    } catch (err) {
      // ignore and try next
    }
  }

  // fallback to local mock
  return SAMPLE_BOOKS;
}

export async function getBookById(id: string | number): Promise<Book> {
  const endpoints = ['books', 'products'];
  for (const ep of endpoints) {
    try {
      const res = await api.get(`/${ep}/${id}`);
      if (res?.data) {
        const item = res.data;
        return mapToBook(item);
      }
    } catch (err) {
      // try next
    }
  }

  // fallback to mock
  const found = SAMPLE_BOOKS.find((b) => String(b.id) === String(id));
  if (found) return found;

  throw new Error('Book not found');
}

export default { getBooks, getBookById };
