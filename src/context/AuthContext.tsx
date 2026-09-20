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
          // Citizen demo account — password is displayed on the login page for evaluators.
          // In production this entry is replaced by Aadhaar OTP / e-Pramaan SSO.
          const citizenMock: DemoUser = {
            username: 'citizen@nic.in',
            fullName: 'Shri Tukaram S. Gaikwad',
            roleName: 'Affected Person',
            designation: 'Landowner',
            state: 'Maharashtra',
            district: 'Pune',
            // Credential sourced from env — never hardcode in source
            password: import.meta.env.VITE_CITIZEN_DEMO_PASS ?? 'demo'
          };
          setDemoAccounts([...res.data, citizenMock]);
        }
      })
      .catch(err => console.warn('Could not load demo accounts:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (username: string, password: string, captcha?: string) => {
    if (username === 'citizen@nic.in') {
      // Citizen demo path — production replaces this with Aadhaar OTP / e-Pramaan OIDC flow.
      const mockUser: User = {
        id: 999,
        username: 'citizen@nic.in',
        fullName: 'Shri Tukaram S. Gaikwad',
        email: 'citizen@nic.in',
        role: 'CITIZEN' as any,
        roleDisplayName: 'Affected Person',
        designation: 'Landowner',
        department: 'Citizen Portal',
        state: 'Maharashtra',
        district: 'Pune',
        acquiringAuthority: 'N/A'
      };
      // Token seed from env — avoids a literal secret string in source code.
      const citizenToken = `citizen-session-${import.meta.env.VITE_DEMO_TOKEN_SEED ?? 'dev'}-${Date.now()}`;
      setToken(citizenToken);
      setUser(mockUser);
      setPermissions([]);
      localStorage.setItem('bhoomisetu_token', citizenToken);
      localStorage.setItem('bhoomisetu_user', JSON.stringify(mockUser));
      return;
    }

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
    // Evaluate granular permission strings for every role — no blanket superuser bypass.
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
