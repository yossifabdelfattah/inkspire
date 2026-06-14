import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Button, Loader, Alert, Divider } from '@mantine/core';
import * as S from './Login.styled';
import { useAuth } from '../context/useAuth';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signInWithGoogle, authLoading, actionLoading, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    try {
      await login(email, password);
      void navigate(redirectTo, { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    }
  };

  const handleGoogle = async () => {
    setError(null);
    try {
      await signInWithGoogle();
      void navigate(redirectTo, { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed.');
    }
  };

  // Redirect authenticated users away from auth pages
  useEffect(() => {
    if (!authLoading && user) {
      void navigate(redirectTo, { replace: true });
    }
  }, [user, authLoading, navigate, redirectTo]);

  return (
    <S.Page role="main">
      <S.Card aria-labelledby="login-title">
        <S.Header>
          <S.Title id="login-title">Sign in to Inkspire</S.Title>
          <S.Subtitle>Enter your account details to continue.</S.Subtitle>
        </S.Header>

        {error && (
          <Alert title="Authentication error" color="red">
            {error}
          </Alert>
        )}

        <form onSubmit={(e) => { void handleSubmit(e); }} aria-describedby={error ? 'login-error' : undefined}>
          <TextInput
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            required
            aria-required
          />

          <PasswordInput
            id="password"
            name="password"
            label="Password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            required
            aria-required
            mt="sm"
          />

          <S.Actions>
            <Button type="submit" disabled={actionLoading} aria-disabled={actionLoading}>
              {actionLoading ? <Loader size="xs" /> : 'Sign in'}
            </Button>
            <Button type="button" variant="default" onClick={() => { void handleGoogle(); }} disabled={actionLoading} aria-disabled={actionLoading}>
              Sign in with Google
            </Button>
          </S.Actions>
        </form>

        <Divider my="sm" />

        <S.Footer>
          <span>Don't have an account?</span>
          <Link to="/register">Register</Link>
        </S.Footer>
      </S.Card>
    </S.Page>
  );
}

export default Login;

