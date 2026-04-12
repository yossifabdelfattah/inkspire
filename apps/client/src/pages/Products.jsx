import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';

const sampleProducts = [
  { _id: '1', name: 'Wireless Headphones', price: 99.99 },
  { _id: '2', name: 'Mechanical Keyboard', price: 79.99 },
  { _id: '3', name: 'Gaming Mouse', price: 49.99 }
];

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
  display: grid;
  gap: 0.75rem;
`;

function Products() {
  const { addToCart } = useCart();

  return (
    <div>
      <h1>Products</h1>
      <p>Replace these sample products with API data later.</p>

      <Grid>
        {sampleProducts.map((product) => (
          <Card key={product._id}>
            <h3>{product.name}</h3>
            <p>${product.price.toFixed(2)}</p>
            <Link to={`/products/${product._id}`}>View details</Link>
            <Button onClick={() => addToCart(product)}>Add to cart</Button>
          </Card>
        ))}
      </Grid>
    </div>
  );
}

export default Products;
