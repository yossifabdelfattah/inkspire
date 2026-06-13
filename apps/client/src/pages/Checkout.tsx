import { useCallback, useState } from 'react';
import { Stepper, Alert, Button, Divider } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { createReservation } from '../services/reservationService';
import type { Reservation } from '../services/reservationService';
import { checkout } from '../services/checkoutService';
import type { CheckoutResult, DeliveryMethod } from '../services/checkoutService';
import type { ShippingInfo } from '../services/orderService';
import CartReviewStep from '../components/checkout/CartReviewStep';
import ShippingStep from '../components/checkout/ShippingStep';
import DeliveryStep from '../components/checkout/DeliveryStep';
import PaymentStep from '../components/checkout/PaymentStep';
import ConfirmationStep from '../components/checkout/ConfirmationStep';
import * as S from './Checkout.styled';
import * as StepS from '../components/checkout/CheckoutSteps.styled';

const STEP_LABELS = ['Cart Review', 'Shipping', 'Delivery', 'Payment', 'Confirmation'];

const EMPTY_SHIPPING: ShippingInfo = { fullName: '', email: '', address: '', city: '', postal: '', country: '' };

const FREE_SHIPPING_THRESHOLD = 50;
const EXPRESS_SHIPPING_COST = 14.99;
const STANDARD_SHIPPING_COST = 4.99;

function getShippingPrice(deliveryMethod: DeliveryMethod, itemsPrice: number) {
  if (deliveryMethod === 'express') return EXPRESS_SHIPPING_COST;
  if (deliveryMethod === 'pickup') return 0;
  return itemsPrice >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
}

function getApiErrorMessage(err: unknown, fallback: string) {
  const response = (err as { response?: { data?: { message?: string } } })?.response;
  return response?.data?.message ?? fallback;
}

function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [reservationLoading, setReservationLoading] = useState(false);
  const [reservationError, setReservationError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>(EMPTY_SHIPPING);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const [checkoutResult, setCheckoutResult] = useState<CheckoutResult | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleExpire = useCallback(() => {
    setExpired(true);
  }, []);

  const handleReserve = async () => {
    setReservationLoading(true);
    setReservationError(null);

    try {
      const res = await createReservation(cartItems.map((item) => ({ id: item.id, quantity: item.quantity })));
      setReservation(res);
      setStep(1);
    } catch (err) {
      setReservationError(getApiErrorMessage(err, 'Unable to reserve your items. Please try again.'));
    } finally {
      setReservationLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!reservation) return;

    setCheckoutLoading(true);
    setCheckoutError(null);

    try {
      const result = await checkout({
        reservationId: reservation._id,
        shippingInfo,
        paymentMethod,
        deliveryMethod,
      });
      setCheckoutResult(result);
      clearCart();
      setStep(4);
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 410) {
        setExpired(true);
      } else {
        setCheckoutError(getApiErrorMessage(err, 'Something went wrong while placing your order. Please try again.'));
      }
    } finally {
      setCheckoutLoading(false);
    }
  };

  const itemsPrice = reservation
    ? reservation.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : totalPrice;

  const shippingPrice = getShippingPrice(deliveryMethod, itemsPrice);

  if (expired) {
    return (
      <S.Page>
        <S.Container>
          <StepS.ExpiredCard initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Alert title="Reservation expired" color="red">
              Your item reservation has expired and the stock has been released. Please return to your cart and
              try again.
            </Alert>
            <Button onClick={() => navigate('/cart')}>Return to Cart</Button>
          </StepS.ExpiredCard>
        </S.Container>
      </S.Page>
    );
  }

  if (cartItems.length === 0 && step === 0) {
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
            <Divider my="sm" />
            <Button fullWidth size="md" component={Link} to="/books">
              Browse Books
            </Button>
          </S.Summary>
        </S.Container>
      </S.Page>
    );
  }

  if (step === 4 && checkoutResult) {
    return (
      <S.Page>
        <S.StepperWrap>
          <Stepper active={step}>
            {STEP_LABELS.map((label) => (
              <Stepper.Step key={label} label={label} />
            ))}
          </Stepper>
        </S.StepperWrap>

        <S.Container>
          <ConfirmationStep result={checkoutResult} />
          <div />
        </S.Container>
      </S.Page>
    );
  }

  return (
    <S.Page>
      <S.StepperWrap>
        <Stepper active={step}>
          {STEP_LABELS.map((label) => (
            <Stepper.Step key={label} label={label} />
          ))}
        </Stepper>
      </S.StepperWrap>

      <S.Container>
        {step === 0 && <CartReviewStep onContinue={handleReserve} loading={reservationLoading} error={reservationError} />}

        {step === 1 && reservation && (
          <ShippingStep
            value={shippingInfo}
            onChange={setShippingInfo}
            onNext={() => setStep(2)}
            expiresAt={reservation.expiresAt}
            onExpire={handleExpire}
          />
        )}

        {step === 2 && reservation && (
          <DeliveryStep
            value={deliveryMethod}
            onChange={setDeliveryMethod}
            itemsPrice={itemsPrice}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
            expiresAt={reservation.expiresAt}
            onExpire={handleExpire}
          />
        )}

        {step === 3 && reservation && (
          <PaymentStep
            value={paymentMethod}
            onChange={setPaymentMethod}
            onBack={() => setStep(2)}
            onSubmit={handleCheckout}
            loading={checkoutLoading}
            error={checkoutError}
            expiresAt={reservation.expiresAt}
            onExpire={handleExpire}
          />
        )}

        <S.Summary aria-live="polite">
          <h2>Order Summary</h2>
          <Divider my="sm" />

          <div>
            {(reservation ? reservation.items : cartItems).map((item) => (
              <S.SummaryRow key={'book' in item ? item.book : item.id}>
                <div>
                  {item.title} &times; {item.quantity}
                </div>
                <div>${(item.price * item.quantity).toFixed(2)}</div>
              </S.SummaryRow>
            ))}
          </div>

          <Divider my="sm" />

          <S.SummaryRow>
            <div>Subtotal</div>
            <div>${itemsPrice.toFixed(2)}</div>
          </S.SummaryRow>
          <S.SummaryRow>
            <div>Shipping</div>
            <div>{shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}</div>
          </S.SummaryRow>

          <Divider my="sm" />

          <S.SummaryRow>
            <div>
              <strong>Total</strong>
            </div>
            <div>
              <strong>${(itemsPrice + shippingPrice).toFixed(2)}</strong>
            </div>
          </S.SummaryRow>
        </S.Summary>
      </S.Container>
    </S.Page>
  );
}

export default Checkout;
