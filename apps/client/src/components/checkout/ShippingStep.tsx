import { TextInput, Button } from '@mantine/core';
import type { ShippingInfo } from '../../services/orderService';
import ReservationTimer from './ReservationTimer';
import * as S from './CheckoutSteps.styled';
import * as PageS from '../../pages/Checkout.styled';

interface ShippingStepProps {
  value: ShippingInfo;
  onChange: (value: ShippingInfo) => void;
  onNext: () => void;
  expiresAt: string;
  onExpire: () => void;
}

function ShippingStep({ value, onChange, onNext, expiresAt, onExpire }: ShippingStepProps) {
  const handleChange = (key: keyof ShippingInfo, fieldValue: string) => {
    onChange({ ...value, [key]: fieldValue });
  };

  const isValid = Object.values(value).every((field) => field.trim().length > 0);

  return (
    <S.StepCard initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <h1>Shipping Information</h1>

      <ReservationTimer expiresAt={expiresAt} onExpire={onExpire} />

      <label htmlFor="fullName">Full name</label>
      <TextInput id="fullName" placeholder="Full name" value={value.fullName} onChange={(e) => handleChange('fullName', e.currentTarget.value)} required aria-required />

      <label htmlFor="email">Email</label>
      <TextInput id="email" placeholder="you@example.com" value={value.email} onChange={(e) => handleChange('email', e.currentTarget.value)} required aria-required type="email" />

      <label htmlFor="address">Address</label>
      <TextInput id="address" placeholder="Street address" value={value.address} onChange={(e) => handleChange('address', e.currentTarget.value)} required aria-required />

      <PageS.FieldGrid>
        <div>
          <label htmlFor="city">City</label>
          <TextInput id="city" placeholder="City" value={value.city} onChange={(e) => handleChange('city', e.currentTarget.value)} required aria-required />
        </div>

        <div>
          <label htmlFor="postal">Postal Code</label>
          <TextInput id="postal" placeholder="Postal code" value={value.postal} onChange={(e) => handleChange('postal', e.currentTarget.value)} required aria-required />
        </div>
      </PageS.FieldGrid>

      <label htmlFor="country">Country</label>
      <TextInput id="country" placeholder="Country" value={value.country} onChange={(e) => handleChange('country', e.currentTarget.value)} required aria-required />

      <S.Actions>
        <div />
        <Button onClick={onNext} disabled={!isValid}>
          Continue to Delivery
        </Button>
      </S.Actions>
    </S.StepCard>
  );
}

export default ShippingStep;
