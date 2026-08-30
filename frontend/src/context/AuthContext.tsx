import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserProfile } from '../types';
import * as authApi from '../api/auth';

interface AuthContextValue {
  user: UserProfile | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // saat pertama kali app dibuka, cek apakah ada token tersimpan & masih valid
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    authApi
      .getMe()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('access_token');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    const { access_token } = await authApi.login(username, password);
    localStorage.setItem('access_token', access_token);
    const me = await authApi.getMe();
    setUser(me);
  };

  const register = async (username: string, email: string, password: string) => {
    await authApi.register(username, email, password);
    // setelah register, langsung login otomatis biar UX lebih mulus
    await login(username, password);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return ctx;
}
