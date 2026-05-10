import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode, FC } from 'react';
import { AuthContext } from './authContext';

export type { AuthContextType } from './authContext';
import {
  loginWithEmailPassword,
  logoutUser,
  registerWithEmailPassword,
  signInWithGoogle,
  subscribeToAuthState,
} from '../services/authService';
import type { UserProfile } from '../types/auth';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      await loginWithEmailPassword(email, password);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      await registerWithEmailPassword(email, password);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await logoutUser();
    } finally {
      setLoading(false);
    }
  }, []);

  const googleSignIn = useCallback(async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, signInWithGoogle: googleSignIn }),
    [user, loading, login, register, logout, googleSignIn]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
