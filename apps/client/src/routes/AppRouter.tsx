import { Navigate, Route, Routes } from "react-router-dom";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import ProductDetails from "../pages/ProductDetails";
import Products from "../pages/Products";
import Register from "../pages/Register";
import Orders from "../pages/Orders";
import Profile from "../pages/Profile";

import ProtectedRoute from "../components/auth/ProtectedRoute";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/books" element={<Products />} />
      <Route path="/books/:id" element={<ProductDetails />} />
      <Route path="/products" element={<Navigate to="/books" replace />} />
      <Route path="/products/:id" element={<Navigate to="/books" replace />} />
      <Route path="/cart" element={<Cart />} />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;
