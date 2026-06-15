import api from '../api/axios';
import type { BookApiItem } from '../types/backend';

export interface OverviewStats {
  bookCount: number;
  pendingRequestCount: number;
  orderCount: number;
  userCount: number;
  totalRevenue: number;
}

export interface SalesPoint {
  date: string;
  orders: number;
  revenue: number;
}

export interface TopSearchTerm {
  term: string;
  count: number;
  totalResults: number;
  avgResults: number;
  lastSearchedAt: string;
}

export interface MostRequestedBook {
  _id: string;
  title: string;
  author: string;
  requestCount: number;
  priorityScore: number;
  status: 'pending' | 'approved' | 'rejected';
}

export interface TopPurchasedBook {
  bookId: string;
  title: string;
  quantitySold: number;
  revenue: number;
}

export interface BookRequestItem {
  _id: string;
  title: string;
  author: string;
  note: string;
  requestCount: number;
  priorityScore: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export async function getOverview(signal?: AbortSignal): Promise<OverviewStats> {
  const res = await api.get('/admin/analytics/overview', { signal });
  return res.data;
}

export async function getSalesOverTime(signal?: AbortSignal): Promise<SalesPoint[]> {
  const res = await api.get('/admin/analytics/sales', { signal });
  return res.data.sales;
}

export async function getTopSearches(signal?: AbortSignal): Promise<TopSearchTerm[]> {
  const res = await api.get('/admin/analytics/searches', { signal });
  return res.data.searches;
}

export async function getMostRequestedBooks(signal?: AbortSignal): Promise<MostRequestedBook[]> {
  const res = await api.get('/admin/analytics/requests', { signal });
  return res.data.requests;
}

export async function getTopPurchasedBooks(signal?: AbortSignal): Promise<TopPurchasedBook[]> {
  const res = await api.get('/admin/analytics/purchases', { signal });
  return res.data.purchases;
}

export async function getAllBooks(signal?: AbortSignal): Promise<BookApiItem[]> {
  const res = await api.get('/books', { signal });
  return Array.isArray(res.data) ? res.data : [];
}

export async function getBookRequests(signal?: AbortSignal): Promise<BookRequestItem[]> {
  const res = await api.get('/book-requests', { signal });
  return res.data;
}

export async function updateBookRequestStatus(id: string, status: 'approved' | 'rejected' | 'pending'): Promise<BookRequestItem> {
  const res = await api.patch(`/book-requests/${id}`, { status });
  return res.data;
}

export interface BookCandidate {
  title: string;
  author: string;
  description: string;
  category: string;
  image: string;
}

export interface BookCandidateResult {
  candidates: BookCandidate[];
  message?: string;
}

export async function getBookRequestCandidates(id: string, signal?: AbortSignal): Promise<BookCandidateResult> {
  const res = await api.get(`/book-requests/${id}/candidates`, { signal });
  return res.data;
}

export interface AdminBookPayload {
  title: string;
  author: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
}

export async function createBook(payload: AdminBookPayload): Promise<BookApiItem> {
  const res = await api.post('/books', payload);
  return res.data;
}

export async function updateBook(id: string, payload: Partial<AdminBookPayload>): Promise<BookApiItem> {
  const res = await api.put(`/books/${id}`, payload);
  return res.data;
}

export async function deleteBook(id: string): Promise<void> {
  await api.delete(`/books/${id}`);
}
