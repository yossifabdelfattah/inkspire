import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Page = styled(motion.main)`
  padding: ${({ theme }) => theme.spacing.lg} 0;
`;

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}px) {
    grid-template-columns: 1fr;
    align-items: start;
  }
`;

export const Cover = styled.img`
  width: 100%;
  height: 420px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.md};
  background: ${({ theme }) => theme.colors.muted};
`;

export const Meta = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const Title = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.h2};
  color: ${({ theme }) => theme.colors.primary};
`;

export const Author = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const Price = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

export const Stock = styled.div<{ $inStock?: boolean }>`
  margin-left: auto;
  color: ${({ theme, $inStock }) => ($inStock ? theme.colors.success : theme.colors.error)};
  font-weight: 600;
`;

export const ControlsRow = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  display: flex;
  gap: 0.75rem;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const Description = styled.section`
  margin-top: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;
`;

export const Section = styled.section`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

export const SectionTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  color: ${({ theme }) => theme.colors.primary};
`;

export const Placeholder = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;
