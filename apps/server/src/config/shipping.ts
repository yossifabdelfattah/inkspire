export const FREE_SHIPPING_THRESHOLD = 50;
export const STANDARD_SHIPPING_COST = 4.99;
export const EXPRESS_SHIPPING_COST = 14.99;

export type DeliveryMethod = 'standard' | 'express' | 'pickup';

export const getShippingPrice = (deliveryMethod: string, itemsPrice: number): number => {
  if (deliveryMethod === 'express') return EXPRESS_SHIPPING_COST;
  if (deliveryMethod === 'pickup') return 0;
  return itemsPrice >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
};
