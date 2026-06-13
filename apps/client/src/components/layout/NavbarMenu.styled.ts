import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

export const MenuOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(30, 41, 59, 0.6);
  z-index: 100;
  display: flex;
  justify-content: flex-end;
`;

export const Drawer = styled(motion.nav)`
  background: ${({ theme }) => theme.colors.surface};
  width: 80vw;
  max-width: 320px;
  height: 100vh;
  box-shadow: ${({ theme }) => theme.shadow.lg};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const MenuLink = styled(Link)`
  font-size: ${({ theme }) => theme.font.size.lg};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

export const MenuButton = styled.button`
  font-size: ${({ theme }) => theme.font.size.lg};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  transition: color 0.2s;
  background: none;
  border: none;
  text-align: left;
  padding: 0;
  cursor: pointer;
  font-family: inherit;

  &:hover {
    color: ${({ theme }) => theme.colors.error};
  }
`;

export const CloseButton = styled.button`
  align-self: flex-end;
  background: none;
  border: none;
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
`;
