import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/useCart';
import { useAuth } from '../../context/useAuth';
import NavbarMenu from './NavbarMenu';
import * as S from './Navbar.styled';

function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <S.Nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 80, damping: 18 }}
        role="navigation"
        aria-label="Main navigation"
      >
        <S.Brand to="/">InkSpire</S.Brand>
        <S.NavLinks>
          <S.NavLink to="/">Home</S.NavLink>
          <S.NavLink to="/books">Books</S.NavLink>
          <S.NavLink to="/request-a-book">Request a Book</S.NavLink>
          <S.NavLink to="/cart">Cart ({totalItems})</S.NavLink>
          {user ? (
            <>
              <S.NavLink to="/profile">Profile</S.NavLink>
              {user.role === 'admin' && <S.NavLink to="/admin">Admin</S.NavLink>}
              <S.NavButton type="button" onClick={handleLogout} aria-label="Log out">Logout</S.NavButton>
            </>
          ) : (
            <>
              <S.NavLink to="/login">Login</S.NavLink>
              <S.NavLink to="/register">Register</S.NavLink>
            </>
          )}
        </S.NavLinks>
        <S.Hamburger
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? '×' : <span aria-hidden="true">☰</span>}
        </S.Hamburger>
      </S.Nav>
      <NavbarMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

export default Navbar;
