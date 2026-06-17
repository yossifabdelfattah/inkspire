import { IShippingInfo } from './order.model';

export interface CartItemInput {
  id: string;
  quantity: number | string;
}

export interface CreateOrderInput {
  cartItems: CartItemInput[];
  shippingInfo: IShippingInfo;
  paymentMethod?: 'card' | 'paypal' | 'cod';
}

export const requiredShippingFields: (keyof IShippingInfo)[] = [
  'fullName',
  'email',
  'address',
  'city',
  'postal',
  'country',
];
