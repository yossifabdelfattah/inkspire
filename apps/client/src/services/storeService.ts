import api from '../api/axios';

export interface StoreAvailability {
  _id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  stock: number;
}

export async function getBookStores(bookId: string | number, signal?: AbortSignal): Promise<StoreAvailability[]> {
  const res = await api.get(`/books/${bookId}/stores`, { signal });

  return Array.isArray(res.data) ? res.data : [];
}
