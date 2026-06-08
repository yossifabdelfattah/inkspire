import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const Page = styled.main`
  padding: ${({ theme }) => theme.spacing.lg} 0;
`;

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}px) {
    grid-template-columns: 1fr;
  }
`;

export const Sidebar = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.sm};
  height: fit-content;
`;

export const SidebarLink = styled(NavLink)`
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-weight: 500;

  &.active {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }

  &:hover:not(.active) {
    background: ${({ theme }) => theme.colors.muted};
  }
`;

export const Content = styled.section`
  min-width: 0;
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.md};
`;

export const CardLabel = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 4px;
`;

export const CardValue = styled.div`
  font-size: 1.6rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const SectionTitle = styled.h2`
  margin: ${({ theme }) => theme.spacing.lg} 0 ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};

  &:first-child {
    margin-top: 0;
  }
`;

export const ChartCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const ToolbarRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  gap: ${({ theme }) => theme.spacing.sm};
`;
