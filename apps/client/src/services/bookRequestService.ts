import api from '../api/axios';

export interface CreateBookRequestPayload {
  title: string;
  author: string;
  note?: string;
}

export async function createBookRequest(payload: CreateBookRequestPayload): Promise<void> {
  await api.post('/book-requests', payload);
}
