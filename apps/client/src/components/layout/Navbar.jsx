import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { media } from '../../styles/breakpoints';
import { motion } from 'framer-motion';
import NavbarMenu from './NavbarMenu';

const Nav = styled(motion.nav)`
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(8px);
  box-shadow: ${({ theme }) => theme.shadow.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background 0.2s, box-shadow 0.2s;
  ${media.mobile`
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  `}
`;

const Brand = styled(Link)`
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

const NavLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  ${media.mobile`
    display: none;
  `}
`;

const NavLink = styled(Link)`
  font-size: ${({ theme }) => theme.font.size.md};
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  padding: 0.25em 0.5em;
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  position: relative;
  &:hover, &:focus {
    background: ${({ theme }) => theme.colors.muted};
    color: ${({ theme }) => theme.colors.secondary};
    outline: none;
  }
`;

const Hamburger = styled.button`
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
  &:hover, &:focus {
    background: ${({ theme }) => theme.colors.muted};
    outline: none;
  }
`;

function Navbar() {
  const { totalItems } = useCart();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 80, damping: 18 }}
        role="navigation"
        aria-label="Main navigation"
      >
        <Brand to="/">InkSpire</Brand>
        <NavLinks>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Books</NavLink>
          <NavLink to="/cart">Cart ({totalItems})</NavLink>
          {user ? (
            <NavLink to="/profile">Profile</NavLink>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </NavLinks>
        <Hamburger
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? '×' : <span aria-hidden="true">☰</span>}
        </Hamburger>
      </Nav>
      <NavbarMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

export default Navbar;
