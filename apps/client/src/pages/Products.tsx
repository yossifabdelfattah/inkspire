import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type { Product } from '../types/product';
import { Button as MantineButton } from '@mantine/core';
import * as S from './Products.styled';

const sampleProducts: Product[] = [
  { _id: '1', name: 'Wireless Headphones', price: 99.99 },
  { _id: '2', name: 'Mechanical Keyboard', price: 79.99 },
  { _id: '3', name: 'Gaming Mouse', price: 49.99 }
];

function Products() {
  const { addToCart } = useCart();

  return (
    <div>
      <h1>Products</h1>
      <p>Replace these sample products with API data later.</p>

      <S.Grid>
        {sampleProducts.map((product) => (
            <S.Card key={product._id}>
            <h3>{product.name}</h3>
            <p>${product.price.toFixed(2)}</p>
            <Link to={`/products/${product._id}`}>View details</Link>
            <MantineButton size="sm" onClick={() => addToCart(product)}>
              Add to cart
            </MantineButton>
          </S.Card>
        ))}
      </S.Grid>
    </div>
  );
}

export default Products;
