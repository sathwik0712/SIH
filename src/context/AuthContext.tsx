import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, DemoUser } from '../types';
import { apiFetch } from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  demoAccounts: DemoUser[];
  login: (username: string, password: string, captcha?: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bhoomisetu_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('bhoomisetu_token'));
  const [permissions, setPermissions] = useState<string[]>(() => {
    const saved = localStorage.getItem('bhoomisetu_permissions');
    return saved ? JSON.parse(saved) : [];
  });
  const [demoAccounts, setDemoAccounts] = useState<DemoUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch demo accounts
    apiFetch<DemoUser[]>('/auth/demo-accounts')
      .then(res => {
        if (res.success && res.data) {
          setDemoAccounts(res.data);
        }
      })
      .catch(err => console.warn('Could not load demo accounts:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (username: string, password: string, captcha?: string) => {
    const res = await apiFetch<{ token: string; user: User; permissions: string[] }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, captcha }),
    });

    if (res.success && res.data) {
      const { token, user, permissions } = res.data;
      setToken(token);
      setUser(user);
      setPermissions(permissions || []);
      localStorage.setItem('bhoomisetu_token', token);
      localStorage.setItem('bhoomisetu_user', JSON.stringify(user));
      localStorage.setItem('bhoomisetu_permissions', JSON.stringify(permissions || []));
    } else {
      throw new Error(res.message || 'Authentication failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setPermissions([]);
    localStorage.removeItem('bhoomisetu_token');
    localStorage.removeItem('bhoomisetu_user');
    localStorage.removeItem('bhoomisetu_permissions');
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    if (user.role === 'CENTRAL_MINISTRY') return true;
    return permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        permissions,
        isAuthenticated: !!token && !!user,
        isLoading,
        demoAccounts,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
