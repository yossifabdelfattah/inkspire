import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { media } from '../../styles/breakpoints';

const MenuOverlay = styled(motion.div)`
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

const Drawer = styled(motion.nav)`
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

const MenuLink = styled(Link)`
  font-size: ${({ theme }) => theme.font.size.lg};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  transition: color 0.2s;
  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const CloseButton = styled.button`
  align-self: flex-end;
  background: none;
  border: none;
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
`;

export default function NavbarMenu({ open, onClose }) {
  const { totalItems } = useCart();
  const { user } = useAuth();

  return (
    <AnimatePresence>
      {open && (
        <MenuOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Drawer
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={e => e.stopPropagation()}
            aria-label="Mobile menu"
          >
            <CloseButton onClick={onClose} aria-label="Close menu">×</CloseButton>
            <MenuLink to="/" onClick={onClose}>Home</MenuLink>
            <MenuLink to="/products" onClick={onClose}>Books</MenuLink>
            <MenuLink to="/cart" onClick={onClose}>Cart ({totalItems})</MenuLink>
            {user ? (
              <MenuLink to="/profile" onClick={onClose}>Profile</MenuLink>
            ) : (
              <>
                <MenuLink to="/login" onClick={onClose}>Login</MenuLink>
                <MenuLink to="/register" onClick={onClose}>Register</MenuLink>
              </>
            )}
          </Drawer>
        </MenuOverlay>
      )}
    </AnimatePresence>
  );
}
