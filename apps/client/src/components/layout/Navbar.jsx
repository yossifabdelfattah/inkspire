import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../../context/CartContext';

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

  return (
    <Nav>
      <Link to="/">InkSpire</Link>
      <NavLinks>
        <Link to="/products">Products</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/cart">Cart ({totalItems})</Link>
      </NavLinks>
    </Nav>
  );
}

export default Navbar;
