import { Alert, Button, Divider } from '@mantine/core';
import { useCart } from '../../context/useCart';
import * as S from './CheckoutSteps.styled';
import * as PageS from '../../pages/Checkout.styled';

interface CartReviewStepProps {
  onContinue: () => void;
  loading: boolean;
  error: string | null;
}

function CartReviewStep({ onContinue, loading, error }: CartReviewStepProps) {
  const { cartItems, totalPrice } = useCart();

  return (
    <S.StepCard initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <h1>Review Your Order</h1>

      {error && (
        <Alert title="Unable to reserve items" color="red">
          {error}
        </Alert>
      )}

      <S.ReviewList>
        {cartItems.map((item) => (
          <S.ReviewItem key={item.id}>
            <S.ReviewCover src={item.cover} alt={item.title} />
            <S.ReviewInfo>
              <strong>{item.title}</strong>
              <span>Qty: {item.quantity}</span>
            </S.ReviewInfo>
            <div>${(item.price * item.quantity).toFixed(2)}</div>
          </S.ReviewItem>
        ))}
      </S.ReviewList>

      <Divider my="sm" />

      <PageS.SummaryRow>
        <div>Subtotal</div>
        <div>${totalPrice.toFixed(2)}</div>
      </PageS.SummaryRow>

      <S.Actions>
        <div />
        <Button onClick={onContinue} loading={loading} disabled={loading}>
          Reserve Items &amp; Continue
        </Button>
      </S.Actions>
    </S.StepCard>
  );
}

export default CartReviewStep;
