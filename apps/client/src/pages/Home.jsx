import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/common/Button';

const Wrapper = styled.section`
  display: grid;
  gap: 1rem;
`;

function Home() {
  return (
    <Wrapper>
      <h1>Welcome to InkSpire</h1>
      <p>A starter book e-commerce app.</p>
      <div>
        <Link to="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    </Wrapper>
  );
}

export default Home;
