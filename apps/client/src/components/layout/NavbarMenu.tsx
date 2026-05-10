import { AnimatePresence } from 'framer-motion';
import type { FC } from 'react';
import { useCart } from '../../context/useCart';
import { useAuth } from '../../context/useAuth';
import * as S from './NavbarMenu.styled';

interface NavbarMenuProps {
  open: boolean;
  onClose: () => void;
}

const NavbarMenu: FC<NavbarMenuProps> = ({ open, onClose }) => {
  const { totalItems } = useCart();
  const { user } = useAuth();

  return (
    <AnimatePresence>
      {open && (
        <S.MenuOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <S.Drawer
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={e => e.stopPropagation()}
            aria-label="Mobile menu"
          >
            <S.CloseButton onClick={onClose} aria-label="Close menu">×</S.CloseButton>
            <S.MenuLink to="/" onClick={onClose}>Home</S.MenuLink>
            <S.MenuLink to="/books" onClick={onClose}>Books</S.MenuLink>
            <S.MenuLink to="/cart" onClick={onClose}>Cart ({totalItems})</S.MenuLink>
            {user ? (
              <S.MenuLink to="/profile" onClick={onClose}>Profile</S.MenuLink>
            ) : (
              <>
                <S.MenuLink to="/login" onClick={onClose}>Login</S.MenuLink>
                <S.MenuLink to="/register" onClick={onClose}>Register</S.MenuLink>
              </>
            )}
          </S.Drawer>
        </S.MenuOverlay>
      )}
    </AnimatePresence>
  );
};

export default NavbarMenu;
