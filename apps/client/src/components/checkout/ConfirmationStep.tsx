import { Button, Divider } from '@mantine/core';
import { Link } from 'react-router-dom';
import type { CheckoutResult } from '../../services/checkoutService';
import * as S from './CheckoutSteps.styled';
import * as PageS from '../../pages/Checkout.styled';

interface ConfirmationStepProps {
  result: CheckoutResult;
}

function ConfirmationStep({ result }: ConfirmationStepProps) {
  const { order, payment } = result;

  return (
    <S.StepCard initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <S.ConfirmationHeader>
        <h1>Order Confirmed!</h1>
        <p>Thank you for your order. A confirmation has been recorded.</p>
        <S.OrderNumber>Order #{order._id}</S.OrderNumber>
        <span>Transaction: {payment.transactionId}</span>
      </S.ConfirmationHeader>

      <Divider my="sm" />

      <S.OrderItemsList>
        {order.orderItems.map((item) => (
          <S.OrderItemRow key={item.product}>
            <div>
              {item.title} &times; {item.quantity}
            </div>
            <div>${(item.price * item.quantity).toFixed(2)}</div>
          </S.OrderItemRow>
        ))}
      </S.OrderItemsList>

      <Divider my="sm" />

      <PageS.SummaryRow>
        <div>Subtotal</div>
        <div>${order.itemsPrice.toFixed(2)}</div>
      </PageS.SummaryRow>
      <PageS.SummaryRow>
        <div>Shipping</div>
        <div>{order.shippingPrice === 0 ? 'Free' : `$${order.shippingPrice.toFixed(2)}`}</div>
      </PageS.SummaryRow>
      <PageS.SummaryRow>
        <div>
          <strong>Total</strong>
        </div>
        <div>
          <strong>${order.totalPrice.toFixed(2)}</strong>
        </div>
      </PageS.SummaryRow>

      {order.deliveryEstimate && (
        <PageS.SummaryRow>
          <div>Estimated delivery</div>
          <div>{order.deliveryEstimate}</div>
        </PageS.SummaryRow>
      )}

      <S.Actions>
        <div />
        <Button component={Link} to="/books">
          Continue Shopping
        </Button>
      </S.Actions>
    </S.StepCard>
  );
}

export default ConfirmationStep;
