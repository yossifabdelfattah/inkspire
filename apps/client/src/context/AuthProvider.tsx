import { useMemo, useState } from 'react';
import type { ReactNode, FC } from 'react';
import type { UserProfile } from '../types/auth';
import { AuthContext } from './authContext';

export type { AuthContextType } from './authContext';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  const login = (userData: UserProfile) => setUser(userData);
  const logout = () => setUser(null);

  const value = useMemo(() => ({ user, login, logout, setUser }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
