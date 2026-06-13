import api from '../api/axios';

export interface ReservationItemInput {
  id: string;
  quantity: number;
}

export interface ReservationItem {
  book: string;
  title: string;
  quantity: number;
  price: number;
}

export type ReservationStatus = 'active' | 'completed' | 'expired';

export interface Reservation {
  _id: string;
  userId: string | null;
  items: ReservationItem[];
  status: ReservationStatus;
  expiresAt: string;
  createdAt: string;
}

export async function createReservation(items: ReservationItemInput[]): Promise<Reservation> {
  const res = await api.post('/reservations', { items });
  return res.data;
}

export async function getReservation(id: string): Promise<Reservation> {
  const res = await api.get(`/reservations/${id}`);
  return res.data;
}
