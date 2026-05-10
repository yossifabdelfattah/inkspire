import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Page = styled(motion.main)`
  padding: ${({ theme }) => theme.spacing.lg} 0;
`;

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}px) {
    grid-template-columns: 1fr;
  }
`;

export const FormCard = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
`;

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}px) {
    grid-template-columns: 1fr;
  }
`;

export const PaymentCard = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

export const SubmitRow = styled.div`
  margin-top: 16px;
`;

export const Summary = styled.aside`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  height: fit-content;
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  align-items: center;
`;

export const Empty = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
`;
