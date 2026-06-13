import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const CoverLink = styled(Link)`
  display: block;
`;

export const TitleLink = styled(Link)`
  text-decoration: none;

  &:hover h3 {
    text-decoration: underline;
  }
`;

export const Card = styled.article`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadow.lg};
    border-color: rgba(79, 70, 229, 0.25);
  }
`;

export const CoverWrap = styled.div`
  position: relative;
  width: 100%;
  height: 210px;
  background: ${({ theme }) => theme.colors.muted};
`;

export const Cover = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm};
`;

export const Title = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.md};
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const Author = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.size.sm};
`;

export const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const Price = styled.span`
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.colors.secondary};
`;

export const ActionWrap = styled.div`
  margin-top: auto;
  padding-top: ${({ theme }) => theme.spacing.xs};
`;
