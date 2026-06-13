import api from '../api/axios';

export interface ShippingInfo {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postal: string;
  country: string;
}

export interface CreateOrderPayload {
  cartItems: { id: string; quantity: number }[];
  shippingInfo: ShippingInfo;
  paymentMethod: string;
}

export interface OrderItem {
  product: string;
  title: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  orderItems: OrderItem[];
  totalPrice: number;
  itemsPrice: number;
  shippingPrice: number;
  status: string;
  createdAt: string;
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const res = await api.post('/orders', payload);
  return res.data;
}

export async function getMyOrders(): Promise<Order[]> {
  const res = await api.get('/orders');
  return res.data;
}

export default { createOrder, getMyOrders };
