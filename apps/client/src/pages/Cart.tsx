import type { Product } from '../types/product';
import { Button, NumberInput, Divider, Alert } from '@mantine/core';
import { } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import * as S from './Cart.styled';

interface CartItem extends Product {
  quantity: number;
  cover?: string;
  author?: string;
}

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, totalPrice } = useCart() as {
    cartItems: CartItem[];
    updateQuantity: (id: string, qty: number) => void;
    removeFromCart: (id: string) => void;
    totalPrice: number;
  };

  const freeShippingThreshold = 50;
  const shippingCost = totalPrice >= freeShippingThreshold ? 0 : 4.99;
  const remainingForFree = Math.max(0, freeShippingThreshold - totalPrice);

  return (
    <S.Page initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <S.Container>
        <section>
          <h1>Cart</h1>

          {cartItems.length === 0 ? (
            <S.Empty>
              <Alert title="Your cart is empty" color="blue">
                There are no items in your cart. <Link to="/books">Browse Books</Link> to add items.
              </Alert>
            </S.Empty>
          ) : (
            <S.Items aria-live="polite">
              {cartItems.map((item) => (
                <S.ItemCard key={item._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <S.Cover src={item.cover ?? '/placeholder-cover.png'} alt={item.name} loading="lazy" />

                  <S.Info>
                    <S.Title>{item.name}</S.Title>
                    <S.Author>{item.author ?? ''}</S.Author>
                    <S.Price>${item.price.toFixed(2)}</S.Price>
                  </S.Info>

                  <S.Controls>
                    <NumberInput
                      value={item.quantity}
                      min={1}
                      onChange={(v) => updateQuantity(item._id, Number(v ?? 1))}
                      aria-label={`Quantity for ${item.name}`}
                      size="sm"
                    />

                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <Button color="red" size="sm" onClick={() => removeFromCart(item._id)} aria-label={`Remove ${item.name} from cart`}>
                        Remove
                      </Button>
                    </div>
                  </S.Controls>
                </S.ItemCard>
              ))}
            </S.Items>
          )}
        </section>

        <S.Summary aria-live="polite">
          <h2>Order Summary</h2>
          <Divider my="sm" />

          <S.SummaryRow>
            <div>Subtotal</div>
            <div>${totalPrice.toFixed(2)}</div>
          </S.SummaryRow>

          <S.SummaryRow>
            <div>Estimated delivery</div>
            <div>${shippingCost === 0 ? 'Free' : shippingCost.toFixed(2)}</div>
          </S.SummaryRow>

          <Divider my="sm" />

          {remainingForFree > 0 ? (
            <Alert color="yellow">Spend ${remainingForFree.toFixed(2)} more to get free shipping</Alert>
          ) : (
            <Alert color="green">You qualify for free shipping</Alert>
          )}

          <div style={{ marginTop: 16 }}>
            <Button fullWidth size="md" color="indigo" component={Link} to="/checkout" aria-label="Proceed to checkout">
              Checkout
            </Button>
          </div>
        </S.Summary>
      </S.Container>
    </S.Page>
  );
}

export default Cart;
