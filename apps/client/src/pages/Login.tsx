import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Button, Loader, Alert, Divider } from '@mantine/core';
import * as S from './Login.styled';
import { useAuth } from '../context/useAuth';

function Login() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      // Placeholder: integrate Firebase Auth here
      // await firebaseAuth.signInWithEmailAndPassword(email, password)
      // Simulate async
      await new Promise((res) => setTimeout(res, 700));
      auth?.login?.({ _id: 'demo', email });
      void navigate('/');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : (typeof err === 'string' ? err : 'Login failed.');
      setError(msg ?? 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    // Placeholder for Google OAuth integration
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // after success
      auth?.login?.({ _id: 'google-demo', email: 'google@demo.com' });
      void navigate('/');
    }, 800);
  };

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
            <Button type="submit" disabled={loading} aria-disabled={loading}>
              {loading ? <Loader size="xs" /> : 'Sign in'}
            </Button>
            <Button variant="default" onClick={handleGoogle} disabled={loading} aria-disabled={loading}>
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

