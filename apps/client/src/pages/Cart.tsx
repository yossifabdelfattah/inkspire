import { Button, NumberInput, Divider, Alert } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_COST } from '../constants/shipping';
import * as S from './Cart.styled';

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();

  const shippingCost = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice);

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
                <S.ItemCard key={item.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <S.Cover src={item.cover} alt={item.title} loading="lazy" />

                  <S.Info>
                    <S.Title>{item.title}</S.Title>
                    <S.Author>{item.author}</S.Author>
                    <S.Price>${item.price.toFixed(2)}</S.Price>
                  </S.Info>

                  <S.Controls>
                    <NumberInput
                      value={item.quantity}
                      min={1}
                      onChange={(v) => updateQuantity(item.id, Number(v ?? 1))}
                      aria-label={`Quantity for ${item.title}`}
                      size="sm"
                    />
                    <S.RemoveRow>
                      <Button color="red" size="sm" onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.title} from cart`}>
                        Remove
                      </Button>
                    </S.RemoveRow>
                  </S.Controls>
                </S.ItemCard>
              ))}

              <Button variant="subtle" color="red" onClick={clearCart}>
                Clear cart
              </Button>
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

          <S.SummaryAction>
            <Button fullWidth size="md" color="indigo" component={Link} to="/checkout" aria-label="Proceed to checkout">
              Checkout
            </Button>
          </S.SummaryAction>
        </S.Summary>
      </S.Container>
    </S.Page>
  );
}

export default Cart;