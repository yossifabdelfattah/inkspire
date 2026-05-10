import styled from 'styled-components';

export const Page = styled.main`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: ${({ theme }) => theme.colors.background};
`;

export const Card = styled.section`
  width: 100%;
  max-width: 420px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.font.size.h2};
  margin: 0;
`;

export const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.size.sm};
  margin: 0;
`;

export const Footer = styled.footer`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  gap: 0.5rem;
  > button {
    flex: 1 1 auto;
  }
`;
