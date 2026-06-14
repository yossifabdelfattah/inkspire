import { useEffect, useState } from 'react';
import * as S from './CheckoutSteps.styled';

interface ReservationTimerProps {
  expiresAt: string;
  onExpire: () => void;
}

function ReservationTimer({ expiresAt, onExpire }: ReservationTimerProps) {
  const [remainingMs, setRemainingMs] = useState(() => new Date(expiresAt).getTime() - Date.now());

  useEffect(() => {
    const target = new Date(expiresAt).getTime();

    const interval = setInterval(() => {
      const remaining = target - Date.now();
      setRemainingMs(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <S.Timer role="timer" aria-live="polite" $low={totalSeconds <= 60}>
      <span>Reservation expires in</span>
      <strong>{display}</strong>
    </S.Timer>
  );
}

export default ReservationTimer;
