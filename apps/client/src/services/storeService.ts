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
  try {
    const res = await api.get(`/books/${bookId}/stores`);
    if (Array.isArray(res?.data)) {
      return res.data;
    }
  } catch {
    // No store availability data — caller should show the empty state
  }

  return [];
}

export default { getBookStores };
