import { isAxiosError } from 'axios';
import api from '../api/axios';
import type { Book } from '../types/product';
import type { BookApiItem } from '../types/backend';

interface GetBooksParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

function mapToBook(item: BookApiItem, index = 0): Book {
  // Always use the MongoDB _id as a string; fall back to index-based string
  const id: string = item._id ? String(item._id) : String(index + 1);
  const availableStock = Math.max(0, (item.stock ?? 0) - (item.reservedStock ?? 0));

  return {
    id,
    cover: item.image && item.image.length > 0 ? item.image : '/placeholder-cover.png',
    title: item.title,
    author: item.author ?? 'Unknown Author',
    price: item.price,
    rating: item.ratingAverage ?? 0,
    ratingCount: item.ratingCount ?? 0,
    inStock: availableStock > 0,
    availableStock,
  };
}

export async function getBooks(params?: GetBooksParams, signal?: AbortSignal): Promise<Book[]> {
  // Build query string from params
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append('search', params.search);
  if (params?.category && params.category !== 'All') queryParams.append('category', params.category);
  if (params?.minPrice) queryParams.append('minPrice', String(params.minPrice));
  if (params?.maxPrice) queryParams.append('maxPrice', String(params.maxPrice));
  if (params?.sort) queryParams.append('sort', params.sort);

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/books?${queryString}` : '/books';

  const res = await api.get(endpoint, { signal });
  const items: BookApiItem[] = Array.isArray(res.data) ? res.data : res.data?.items ?? [];

  return items.map((it, i) => mapToBook(it, i));
}

export async function getBookById(id: string | number, signal?: AbortSignal): Promise<Book | null> {
  try {
    const res = await api.get(`/books/${id}`, { signal });
    return mapToBook(res.data);
  } catch (err) {
    // A 404 means the book genuinely doesn't exist — a valid "not found" result.
    if (isAxiosError(err) && err.response?.status === 404) {
      return null;
    }

    throw err;
  }
}

export async function getRecommendations(limit = 8, signal?: AbortSignal): Promise<Book[]> {
  const res = await api.get(`/books/recommendations?limit=${limit}`, { signal });
  const items: BookApiItem[] = Array.isArray(res.data) ? res.data : [];

  return items.map((it, i) => mapToBook(it, i));
}

export async function getRelatedBooks(id: string | number, limit = 6, signal?: AbortSignal): Promise<Book[]> {
  const res = await api.get(`/books/${id}/related?limit=${limit}`, { signal });
  const items: BookApiItem[] = Array.isArray(res.data) ? res.data : [];

  return items.map((it, i) => mapToBook(it, i));
}

export default { getBooks, getBookById, getRecommendations, getRelatedBooks };
