import { Navigate, Route, Routes } from 'react-router-dom';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import ProductDetails from '../pages/ProductDetails';
import Products from '../pages/Products';
import Register from '../pages/Register';
import RequestBook from '../pages/RequestBook';
import ProtectedRoute from '../components/auth/ProtectedRoute';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/books" element={<Products />} />
      <Route path="/books/:id" element={<ProductDetails />} />
      <Route path="/request-a-book" element={<RequestBook />} />
      <Route path="/products" element={<Navigate to="/books" replace />} />
      <Route path="/products/:id" element={<Navigate to="/books" replace />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;