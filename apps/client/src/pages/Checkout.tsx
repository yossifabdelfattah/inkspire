import { useState } from 'react';
import { TextInput, Button, Radio, RadioGroup, Divider, Alert } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useCart } from '../context/useCart';
import * as S from './Checkout.styled';

function Checkout() {
  const { cartItems, totalPrice } = useCart();
  const [form, setForm] = useState({ fullName: '', email: '', address: '', city: '', postal: '', country: '' });
  const [payment, setPayment] = useState('card');
  

  const freeShippingThreshold = 50;
  const shippingCost = totalPrice >= freeShippingThreshold ? 0 : 4.99;

  const handleChange = (key: string, value: string) => {
    setForm((s) => ({ ...s, [key]: value }));
  };

  const validate = () => {
    const required = ['fullName', 'email', 'address', 'city', 'postal', 'country'];
    return required.every((k) => form[k as keyof typeof form].trim().length > 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    // No backend yet — show a friendly placeholder
    alert('Checkout flow completed (mock).');
  };

  if (cartItems.length === 0) {
    return (
      <S.Page>
        <S.Container>
          <S.FormCard>
            <S.Empty>
              <Alert title="Your cart is empty" color="blue">
                Add some books to your cart before checking out. <Link to="/books">Browse Books</Link>
              </Alert>
            </S.Empty>
          </S.FormCard>

          <S.Summary>
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
            <Button fullWidth size="md" component={Link} to="/books">
              Browse Books
            </Button>
          </S.Summary>
        </S.Container>
      </S.Page>
    );
  }

  return (
    <S.Page>
      <S.Container>
        <S.FormCard as="form" onSubmit={handleSubmit} aria-labelledby="checkout-heading">
          <h1 id="checkout-heading">Checkout</h1>

          <label htmlFor="fullName">Full name</label>
          <TextInput id="fullName" placeholder="Full name" value={form.fullName} onChange={(e) => handleChange('fullName', e.currentTarget.value)} required aria-required />

          <label htmlFor="email">Email</label>
          <TextInput id="email" placeholder="you@example.com" value={form.email} onChange={(e) => handleChange('email', e.currentTarget.value)} required aria-required type="email" />

          <label htmlFor="address">Address</label>
          <TextInput id="address" placeholder="Street address" value={form.address} onChange={(e) => handleChange('address', e.currentTarget.value)} required aria-required />

          <S.FieldGrid>
            <div>
              <label htmlFor="city">City</label>
              <TextInput id="city" placeholder="City" value={form.city} onChange={(e) => handleChange('city', e.currentTarget.value)} required aria-required />
            </div>

            <div>
              <label htmlFor="postal">Postal Code</label>
              <TextInput id="postal" placeholder="Postal code" value={form.postal} onChange={(e) => handleChange('postal', e.currentTarget.value)} required aria-required />
            </div>
          </S.FieldGrid>

          <label htmlFor="country">Country</label>
          <TextInput id="country" placeholder="Country" value={form.country} onChange={(e) => handleChange('country', e.currentTarget.value)} required aria-required />

          <S.PaymentCard>
            <h3>Payment method</h3>
            <RadioGroup value={payment} onChange={setPayment} name="payment" aria-label="Payment method">
              <Radio value="card" label="Credit / Debit card" />
              <Radio value="paypal" label="PayPal (mock)" />
              <Radio value="cod" label="Cash on delivery" />
            </RadioGroup>
          </S.PaymentCard>

          <div style={{ marginTop: 16 }}>
            <Button type="submit" size="md" color="indigo" aria-label="Place order">Place Order</Button>
          </div>
        </S.FormCard>

        <S.Summary aria-live="polite">
          <h2>Order Summary</h2>
          <Divider my="sm" />
          <div>
            {cartItems.map((it) => (
              <S.SummaryRow key={it._id}>
                <div>{it.name}</div>
                <div>${(it.price * it.quantity).toFixed(2)}</div>
              </S.SummaryRow>
            ))}
          </div>

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

          <Button fullWidth size="md" color="indigo" component={Link} to="/checkout/confirm" aria-disabled={!validate()} disabled={!validate()} aria-label="Proceed to confirm">
            Continue
          </Button>
        </S.Summary>
      </S.Container>
    </S.Page>
  );
}

export default Checkout;
