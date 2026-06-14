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
import { getMyProfile, updateMyProfile } from '../services/userService';
import type { UserProfile } from '../types/auth';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        getMyProfile()
          .then((profile) => {
            setUser((prev) => (prev ? { ...prev, role: profile.role } : prev));
          })
          .catch(() => {
            // Role stays undefined if the backend profile can't be fetched
          })
          .finally(() => {
            setAuthLoading(false);
          });
      } else {
        setAuthLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setActionLoading(true);
    try {
      await loginWithEmailPassword(email, password);
    } finally {
      setActionLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name?: string) => {
    setActionLoading(true);
    try {
      await registerWithEmailPassword(email, password, name);

      if (name) {
        try {
          await updateMyProfile({ name });
        } catch {
          // The Mongo profile will still be created with a fallback name on
          // the next authenticated request; non-fatal if this sync fails.
        }
      }
    } finally {
      setActionLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setActionLoading(true);
    try {
      await logoutUser();
    } finally {
      setActionLoading(false);
    }
  }, []);

  const googleSignIn = useCallback(async () => {
    setActionLoading(true);
    try {
      await signInWithGoogle();
    } finally {
      setActionLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (name: string) => {
    const profile = await updateMyProfile({ name });
    setUser((prev) => (prev ? { ...prev, name: profile.name } : prev));
  }, []);

  const value = useMemo(
    () => ({ user, authLoading, actionLoading, login, register, logout, signInWithGoogle: googleSignIn, updateProfile }),
    [user, authLoading, actionLoading, login, register, logout, googleSignIn, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
