import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #111827;
  color: white;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  return (
    <Nav>
      <Link to="/">InkSpire</Link>
      <NavLinks>
        <Link to="/products">Products</Link>
        <Link to="/cart">Cart ({totalItems})</Link>
        {user ? (
          <>
            <Link to="/profile"><span>Hello, {user.name}</span></Link>
            <button onClick={logout} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'white' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </NavLinks>
    </Nav>
  );
}

export default Navbar;