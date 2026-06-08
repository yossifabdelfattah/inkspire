import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Page = styled(motion.main)`
  padding: ${({ theme }) => theme.spacing.lg} 0;
`;

export const Container = styled.div`
  max-width: 640px;
  margin: 0 auto;
`;

export const FormCard = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};

  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const SubmitRow = styled.div`
  margin-top: 16px;
`;
