import styled from 'styled-components';
import { media } from './breakpoints';

export const AppShell = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  background: ${({ theme }) => theme.colors.background};
`;

export const MainContent = styled.main`
  padding: ${({ theme }) => theme.spacing.md};
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.md};
  background: ${({ theme }) => theme.colors.surface};
  ${media.tablet`
    padding: ${({ theme }) => theme.spacing.sm};
    max-width: 100%;
    border-radius: ${({ theme }) => theme.radius.sm};
    box-shadow: ${({ theme }) => theme.shadow.sm};
  `}
  ${media.mobile`
    padding: ${({ theme }) => theme.spacing.xs};
    border-radius: 0;
    box-shadow: none;
  `}
`;
