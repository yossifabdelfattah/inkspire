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

export async function getBookStores(bookId: string | number): Promise<StoreAvailability[]> {
  const res = await api.get(`/books/${bookId}/stores`);

  return Array.isArray(res.data) ? res.data : [];
}

export default { getBookStores };
