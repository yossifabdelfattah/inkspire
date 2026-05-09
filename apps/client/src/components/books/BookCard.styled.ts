import { Badge } from '@mantine/core';
import { motion } from 'framer-motion';
import styled from 'styled-components';

export const Card = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  transition: box-shadow 0.18s, transform 0.18s;
  cursor: pointer;
  min-width: 0;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadow.md};
    transform: translateY(-4px) scale(1.02);
  }
`;

export const Cover = styled.img`
  width: 100%;
  max-width: 140px;
  height: 200px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius.sm};
  align-self: center;
  background: ${({ theme }) => theme.colors.muted};
`;

export const Title = styled.h3`
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
`;

export const Author = styled.p`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0 0 2px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
`;

export const Price = styled.span`
  font-size: 1.1rem;
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.colors.secondary};
`;

export const Stock = styled(Badge)`
  margin-left: auto;
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.xs};
`;
