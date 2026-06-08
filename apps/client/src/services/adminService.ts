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

export async function getOverview(): Promise<OverviewStats> {
  const res = await api.get('/admin/analytics/overview');
  return res.data;
}

export async function getSalesOverTime(): Promise<SalesPoint[]> {
  const res = await api.get('/admin/analytics/sales');
  return res.data.sales;
}

export async function getTopSearches(): Promise<TopSearchTerm[]> {
  const res = await api.get('/admin/analytics/searches');
  return res.data.searches;
}

export async function getMostRequestedBooks(): Promise<MostRequestedBook[]> {
  const res = await api.get('/admin/analytics/requests');
  return res.data.requests;
}

export async function getTopPurchasedBooks(): Promise<TopPurchasedBook[]> {
  const res = await api.get('/admin/analytics/purchases');
  return res.data.purchases;
}

export async function getBookRequests(): Promise<BookRequestItem[]> {
  const res = await api.get('/book-requests');
  return res.data;
}

export async function updateBookRequestStatus(id: string, status: 'approved' | 'rejected' | 'pending'): Promise<BookRequestItem> {
  const res = await api.patch(`/book-requests/${id}`, { status });
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
