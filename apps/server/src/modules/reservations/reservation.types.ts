export interface ReservationItemInput {
  id: string;
  quantity: number | string;
}

export interface CreateReservationInput {
  items: ReservationItemInput[];
}
