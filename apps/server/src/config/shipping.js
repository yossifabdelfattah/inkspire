const FREE_SHIPPING_THRESHOLD = 50;
const STANDARD_SHIPPING_COST = 4.99;
const EXPRESS_SHIPPING_COST = 14.99;

const getShippingPrice = (deliveryMethod, itemsPrice) => {
  if (deliveryMethod === 'express') return EXPRESS_SHIPPING_COST;
  if (deliveryMethod === 'pickup') return 0;
  return itemsPrice >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
};

module.exports = { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_COST, EXPRESS_SHIPPING_COST, getShippingPrice };
