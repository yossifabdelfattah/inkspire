import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { media } from '../../styles/breakpoints';

export const Nav = styled(motion.nav)`
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  box-shadow: ${({ theme }) => theme.shadow.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background 0.2s, box-shadow 0.2s;
  ${media.mobile`
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  `}
`;

export const Brand = styled(Link)`
  font-family: ${({ theme }) => theme.font.family};
  font-size: 1.5rem;
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: 0.02em;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

export const NavLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;

  ${media.mobile`
    display: none;
  `}
`;

export const NavLink = styled(Link)`
  font-size: ${({ theme }) => theme.font.size.md};
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  padding: 0.25em 0.5em;
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  position: relative;

  &:hover,
  &:focus {
    background: ${({ theme }) => theme.colors.muted};
    color: ${({ theme }) => theme.colors.secondary};
    outline: none;
  }
`;

export const NavButton = styled.button`
  font-size: ${({ theme }) => theme.font.size.md};
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  padding: 0.25em 0.5em;
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;

  &:hover,
  &:focus {
    background: ${({ theme }) => theme.colors.muted};
    color: ${({ theme }) => theme.colors.error};
    outline: none;
  }
`;

export const Hamburger = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 2rem;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  padding: 0.25em 0.5em;
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: background 0.18s;
  z-index: 101;

  ${media.mobile`
    display: flex;
  `}

  &:hover,
  &:focus {
    background: ${({ theme }) => theme.colors.muted};
    outline: none;
  }
`;
