import api from "../api/axios";

interface OrderItem {
  product: string;
  name: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postal: string;
  country: string;
}

export interface CreateOrderPayload {
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  totalPrice: number;
}

export interface Order {
  _id: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const res = await api.post("/orders", payload);
  return res.data;
}

export async function getMyOrders(): Promise<Order[]> {
  const res = await api.get("/orders");
  return res.data;
}
