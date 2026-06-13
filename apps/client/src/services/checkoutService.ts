import api from '../api/axios';
import type { ShippingInfo, Order } from './orderService';

export type DeliveryMethod = 'standard' | 'express' | 'pickup';

export interface MockPayment {
  status: string;
  transactionId: string;
  paidAt: string;
}

export interface CheckoutPayload {
  reservationId: string;
  shippingInfo: ShippingInfo;
  paymentMethod: string;
  deliveryMethod: DeliveryMethod;
}

export interface CheckoutResult {
  order: Order;
  payment: MockPayment;
}

export async function checkout(payload: CheckoutPayload): Promise<CheckoutResult> {
  const res = await api.post('/checkout', payload);
  return res.data;
}
