import { useState } from 'react';
import { Alert, Button, Radio, RadioGroup, TextInput } from '@mantine/core';
import ReservationTimer from './ReservationTimer';
import * as S from './CheckoutSteps.styled';
import * as PageS from '../../pages/Checkout.styled';

interface PaymentStepProps {
  value: string;
  onChange: (value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
  expiresAt: string;
  onExpire: () => void;
}

function PaymentStep({ value, onChange, onBack, onSubmit, loading, error, expiresAt, onExpire }: PaymentStepProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const cardValid =
    value !== 'card' ||
    (cardNumber.replace(/\s/g, '').length === 16 && /^\d{2}\/\d{2}$/.test(expiry) && /^\d{3,4}$/.test(cvc));

  return (
    <S.StepCard initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <h1>Payment</h1>

      <ReservationTimer expiresAt={expiresAt} onExpire={onExpire} />

      {error && (
        <Alert title="Payment failed" color="red">
          {error}
        </Alert>
      )}

      <PageS.PaymentCard>
        <h3>Payment method</h3>
        <RadioGroup value={value} onChange={onChange} name="payment" aria-label="Payment method">
          <Radio value="card" label="Credit / Debit card" />
          <Radio value="paypal" label="PayPal (mock)" />
          <Radio value="cod" label="Cash on delivery" />
        </RadioGroup>
      </PageS.PaymentCard>

      {value === 'card' && (
        <div>
          <label htmlFor="cardNumber">Card number</label>
          <TextInput
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.currentTarget.value)}
            maxLength={19}
          />

          <S.CardFieldsGrid>
            <div>
              <label htmlFor="expiry">Expiry (MM/YY)</label>
              <TextInput id="expiry" placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(e.currentTarget.value)} maxLength={5} />
            </div>

            <div>
              <label htmlFor="cvc">CVC</label>
              <TextInput id="cvc" placeholder="123" value={cvc} onChange={(e) => setCvc(e.currentTarget.value)} maxLength={4} />
            </div>
          </S.CardFieldsGrid>
        </div>
      )}

      <S.Actions>
        <Button variant="default" onClick={onBack} disabled={loading}>
          Back
        </Button>
        <Button onClick={onSubmit} loading={loading} disabled={loading || !cardValid}>
          Place Order
        </Button>
      </S.Actions>
    </S.StepCard>
  );
}

export default PaymentStep;
