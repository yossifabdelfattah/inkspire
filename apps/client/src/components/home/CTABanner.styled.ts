import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Banner = styled(motion.section)`
  margin: ${({ theme }) => theme.spacing.lg} 0;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.secondary} 0%, #6d28d9 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

export const BannerContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const BannerTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.bold};
`;

export const BannerDesc = styled.p`
  margin: 0;
  color: rgba(255,255,255,0.9);
`;
