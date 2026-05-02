import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';
import api from '../api/axios';

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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/products')
      .then((res) => setProducts(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Products</h1>

      <Grid>
        {products.map((product) => (
          <Card key={product._id}>
            {product.imageUrl && <img src={product.imageUrl} alt={product.name} style={{ width: '100%', borderRadius: '8px' }} />}
            <h3>{product.name}</h3>
            <p>€{product.price.toFixed(2)}</p>
            <Link to={`/products/${product._id}`}>View details</Link>
            <Button onClick={() => addToCart(product)}>Add to cart</Button>
          </Card>
        ))}
      </Grid>
    </div>
  );
}

export default Products;