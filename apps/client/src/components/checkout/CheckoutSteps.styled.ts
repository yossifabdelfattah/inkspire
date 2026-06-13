import styled from 'styled-components';
import { motion } from 'framer-motion';

export const StepCard = styled(motion.section)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

export const Timer = styled.div<{ $low?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  padding: 0.5em 1em;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme, $low }) => ($low ? 'rgba(239, 68, 68, 0.1)' : theme.colors.muted)};
  color: ${({ theme, $low }) => ($low ? theme.colors.error : theme.colors.text)};
  font-size: ${({ theme }) => theme.font.size.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  strong {
    font-size: ${({ theme }) => theme.font.size.md};
    font-variant-numeric: tabular-nums;
  }
`;

export const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const ReviewItem = styled.div`
  display: grid;
  grid-template-columns: 56px 1fr auto;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

export const ReviewCover = styled.img`
  width: 56px;
  height: 76px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.muted};
`;

export const ReviewInfo = styled.div`
  display: flex;
  flex-direction: column;

  span {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: ${({ theme }) => theme.font.size.sm};
  }
`;

export const OptionGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const OptionCard = styled.label<{ $selected?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme, $selected }) => ($selected ? theme.colors.secondary : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  background: ${({ theme, $selected }) => ($selected ? theme.colors.muted : theme.colors.surface)};
  transition: border-color 0.15s, background 0.15s;
`;

export const OptionTitle = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: ${({ theme }) => theme.font.weight.bold};
`;

export const OptionDesc = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.size.sm};
`;

export const CardFieldsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}px) {
    grid-template-columns: 1fr;
  }
`;

export const ExpiredCard = styled(motion.div)`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

export const ConfirmationHeader = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
`;

export const OrderNumber = styled.div`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.colors.secondary};
`;

export const OrderItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const OrderItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${({ theme }) => theme.font.size.sm};
`;
