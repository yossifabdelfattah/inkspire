import { useCallback, useReducer, useState } from 'react';
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
import { getShippingPrice } from '../constants/shipping';

const STEP_LABELS = ['Cart Review', 'Shipping', 'Delivery', 'Payment', 'Confirmation'];

const EMPTY_SHIPPING: ShippingInfo = { fullName: '', email: '', address: '', city: '', postal: '', country: '' };

function getApiErrorMessage(err: unknown, fallback: string) {
  const response = (err as { response?: { data?: { message?: string } } })?.response;
  return response?.data?.message ?? fallback;
}

interface CheckoutState {
  step: number;
  reservation: Reservation | null;
  reservationLoading: boolean;
  reservationError: string | null;
  expired: boolean;
  checkoutResult: CheckoutResult | null;
  checkoutLoading: boolean;
  checkoutError: string | null;
}

type CheckoutAction =
  | { type: 'GOTO_STEP'; step: number }
  | { type: 'RESERVE_START' }
  | { type: 'RESERVE_SUCCESS'; reservation: Reservation }
  | { type: 'RESERVE_ERROR'; error: string }
  | { type: 'CHECKOUT_START' }
  | { type: 'CHECKOUT_SUCCESS'; result: CheckoutResult }
  | { type: 'CHECKOUT_ERROR'; error: string }
  | { type: 'EXPIRE' };

const initialCheckoutState: CheckoutState = {
  step: 0,
  reservation: null,
  reservationLoading: false,
  reservationError: null,
  expired: false,
  checkoutResult: null,
  checkoutLoading: false,
  checkoutError: null,
};

function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case 'GOTO_STEP':
      return { ...state, step: action.step };
    case 'RESERVE_START':
      return { ...state, reservationLoading: true, reservationError: null };
    case 'RESERVE_SUCCESS':
      return { ...state, reservationLoading: false, reservation: action.reservation, step: 1 };
    case 'RESERVE_ERROR':
      return { ...state, reservationLoading: false, reservationError: action.error };
    case 'CHECKOUT_START':
      return { ...state, checkoutLoading: true, checkoutError: null };
    case 'CHECKOUT_SUCCESS':
      return { ...state, checkoutLoading: false, checkoutResult: action.result, step: 4 };
    case 'CHECKOUT_ERROR':
      return { ...state, checkoutLoading: false, checkoutError: action.error };
    case 'EXPIRE':
      return { ...state, expired: true };
    default:
      return state;
  }
}

function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(checkoutReducer, initialCheckoutState);
  const {
    step,
    reservation,
    reservationLoading,
    reservationError,
    expired,
    checkoutResult,
    checkoutLoading,
    checkoutError,
  } = state;

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>(EMPTY_SHIPPING);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleExpire = useCallback(() => {
    dispatch({ type: 'EXPIRE' });
  }, []);

  const handleReserve = async () => {
    dispatch({ type: 'RESERVE_START' });

    try {
      const res = await createReservation(cartItems.map((item) => ({ id: item.id, quantity: item.quantity })));
      dispatch({ type: 'RESERVE_SUCCESS', reservation: res });
    } catch (err) {
      dispatch({ type: 'RESERVE_ERROR', error: getApiErrorMessage(err, 'Unable to reserve your items. Please try again.') });
    }
  };

  const handleCheckout = async () => {
    if (!reservation) return;

    dispatch({ type: 'CHECKOUT_START' });

    try {
      const result = await checkout({
        reservationId: reservation._id,
        shippingInfo,
        paymentMethod,
        deliveryMethod,
      });
      clearCart();
      dispatch({ type: 'CHECKOUT_SUCCESS', result });
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 410) {
        dispatch({ type: 'EXPIRE' });
      } else {
        dispatch({ type: 'CHECKOUT_ERROR', error: getApiErrorMessage(err, 'Something went wrong while placing your order. Please try again.') });
      }
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
            onNext={() => dispatch({ type: 'GOTO_STEP', step: 2 })}
            expiresAt={reservation.expiresAt}
            onExpire={handleExpire}
          />
        )}

        {step === 2 && reservation && (
          <DeliveryStep
            value={deliveryMethod}
            onChange={setDeliveryMethod}
            itemsPrice={itemsPrice}
            onBack={() => dispatch({ type: 'GOTO_STEP', step: 1 })}
            onNext={() => dispatch({ type: 'GOTO_STEP', step: 3 })}
            expiresAt={reservation.expiresAt}
            onExpire={handleExpire}
          />
        )}

        {step === 3 && reservation && (
          <PaymentStep
            value={paymentMethod}
            onChange={setPaymentMethod}
            onBack={() => dispatch({ type: 'GOTO_STEP', step: 2 })}
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
