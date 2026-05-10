import { useParams } from 'react-router-dom';
import type { ProductDetailsRouteParamKey } from '../types';

function ProductDetails() {
  const { id } = useParams<ProductDetailsRouteParamKey>();

  return (
    <div>
      <h1>Product Details</h1>
      <p>Selected product ID: {id ?? 'Unknown'}</p>
    </div>
  );
}

export default ProductDetails;