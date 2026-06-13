import { Navigate, Route, Routes } from 'react-router-dom';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import Profile from '../pages/Profile';
import ProductDetails from '../pages/ProductDetails';
import Products from '../pages/Products';
import Register from '../pages/Register';
import RequestBook from '../pages/RequestBook';
import AdminOverview from '../pages/admin/AdminOverview';
import AdminBooks from '../pages/admin/AdminBooks';
import AdminRequests from '../pages/admin/AdminRequests';
import AdminAnalytics from '../pages/admin/AdminAnalytics';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AdminRoute from '../components/auth/AdminRoute';

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
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminOverview /></AdminRoute>} />
      <Route path="/admin/books" element={<AdminRoute><AdminBooks /></AdminRoute>} />
      <Route path="/admin/requests" element={<AdminRoute><AdminRequests /></AdminRoute>} />
      <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;