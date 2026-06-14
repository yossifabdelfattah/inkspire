import { Button } from '@mantine/core';
import type { DeliveryMethod } from '../../services/checkoutService';
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_COST, EXPRESS_SHIPPING_COST } from '../../constants/shipping';
import ReservationTimer from './ReservationTimer';
import * as S from './CheckoutSteps.styled';

interface DeliveryStepProps {
  value: DeliveryMethod;
  onChange: (value: DeliveryMethod) => void;
  itemsPrice: number;
  onBack: () => void;
  onNext: () => void;
  expiresAt: string;
  onExpire: () => void;
}

function DeliveryStep({ value, onChange, itemsPrice, onBack, onNext, expiresAt, onExpire }: DeliveryStepProps) {
  const standardCost = itemsPrice >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;

  return (
    <S.StepCard initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <h1>Delivery Method</h1>

      <ReservationTimer expiresAt={expiresAt} onExpire={onExpire} />

      <S.OptionGrid role="radiogroup" aria-label="Delivery method">
        <S.OptionCard $selected={value === 'standard'}>
          <input type="radio" name="delivery" value="standard" checked={value === 'standard'} onChange={() => onChange('standard')} style={{ display: 'none' }} />
          <S.OptionTitle>
            <span>Standard Delivery</span>
            <span>{standardCost === 0 ? 'Free' : `$${standardCost.toFixed(2)}`}</span>
          </S.OptionTitle>
          <S.OptionDesc>Estimated delivery: 5-7 business days</S.OptionDesc>
        </S.OptionCard>

        <S.OptionCard $selected={value === 'express'}>
          <input type="radio" name="delivery" value="express" checked={value === 'express'} onChange={() => onChange('express')} style={{ display: 'none' }} />
          <S.OptionTitle>
            <span>Express Delivery</span>
            <span>${EXPRESS_SHIPPING_COST.toFixed(2)}</span>
          </S.OptionTitle>
          <S.OptionDesc>Estimated delivery: 1-2 business days</S.OptionDesc>
        </S.OptionCard>

        <S.OptionCard $selected={value === 'pickup'}>
          <input type="radio" name="delivery" value="pickup" checked={value === 'pickup'} onChange={() => onChange('pickup')} style={{ display: 'none' }} />
          <S.OptionTitle>
            <span>Store Pickup</span>
            <span>Free</span>
          </S.OptionTitle>
          <S.OptionDesc>Ready for pickup within 24 hours</S.OptionDesc>
        </S.OptionCard>
      </S.OptionGrid>

      <S.Actions>
        <Button variant="default" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>Continue to Payment</Button>
      </S.Actions>
    </S.StepCard>
  );
}

export default DeliveryStep;
