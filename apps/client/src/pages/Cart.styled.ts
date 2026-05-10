import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Page = styled(motion.main)`
  padding: ${({ theme }) => theme.spacing.lg} 0;
`;

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}px) {
    grid-template-columns: 1fr;
  }
`;

export const Items = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const ItemCard = styled(motion.article)`
  display: grid;
  grid-template-columns: 96px 1fr auto;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.md};
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}px) {
    grid-template-columns: 80px 1fr;
    grid-template-rows: auto auto;
  }
`;

export const Cover = styled.img`
  width: 96px;
  height: 128px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.muted};
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Title = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.md};
  color: ${({ theme }) => theme.colors.primary};
`;

export const Author = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.size.sm};
`;

export const Price = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

export const Controls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}px) {
    align-items: flex-start;
    width: 100%;
  }
`;

export const RemoveRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const Summary = styled.aside`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  height: fit-content;
`;

export const SummaryAction = styled.div`
  margin-top: 16px;
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
