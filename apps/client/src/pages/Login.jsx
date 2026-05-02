import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginRequest } from '../services/authService';
import {
  AuthWrapper,
  AuthTitle,
  AuthForm,
  AuthInput,
  AuthButton,
  AuthError,
  AuthLink
} from '../styles/AuthStyles';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginRequest(email, password);
      login(res.data);
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message ?? 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
      <AuthTitle>Login</AuthTitle>
      <AuthForm onSubmit={handleSubmit}>
        {error && <AuthError>{error}</AuthError>}
        <AuthInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AuthInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <AuthButton type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </AuthButton>
        <AuthLink>
          <Link to="/forgot-password">Forgot your password?</Link>
        </AuthLink>
      </AuthForm>
      <AuthLink>
        No account? <Link to="/register">Register</Link>
      </AuthLink>
    </AuthWrapper>
  );
}

export default Login;