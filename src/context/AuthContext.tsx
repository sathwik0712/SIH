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

const DEFAULT_DEMO_ACCOUNTS: DemoUser[] = [
  {
    username: 'ministry.admin@nic.in',
    fullName: 'Shri Rajesh Sharma',
    roleName: 'Central Ministry Admin',
    designation: 'Joint Secretary (MoRD)',
    state: 'All States (Pan-India)',
    district: 'All Districts',
    password: 'admin123',
  },
  {
    username: 'cala.pune@nic.in',
    fullName: 'Smt. Sunita Patil',
    roleName: 'CALA Officer',
    designation: 'Competent Authority Land Acquisition',
    state: 'Maharashtra',
    district: 'Pune',
    password: 'cala123',
  },
  {
    username: 'field.officer@nic.in',
    fullName: 'Shri Vikram Deshmukh',
    roleName: 'Field Survey Officer',
    designation: 'District Surveyor',
    state: 'Maharashtra',
    district: 'Pune',
    password: 'field123',
  },
  {
    username: 'sec.mord@nic.in',
    fullName: 'Shri Amit Kumar',
    roleName: 'State Govt Authority',
    designation: 'Principal Secretary (Revenue)',
    state: 'Maharashtra',
    district: 'All Districts',
    password: 'sec123',
  },
  {
    username: 'district.collector@nic.in',
    fullName: 'Dr. Rajendra Bhosale',
    roleName: 'District Magistrate / Collector',
    designation: 'District Collector',
    state: 'Maharashtra',
    district: 'Pune',
    password: 'dist123',
  },
  {
    username: 'citizen@nic.in',
    fullName: 'Shri Tukaram S. Gaikwad',
    roleName: 'Affected Person',
    designation: 'Landowner',
    state: 'Maharashtra',
    district: 'Pune',
    password: import.meta.env.VITE_CITIZEN_DEMO_PASS ?? 'demo',
  },
];

const MOCK_USER_MAP: Record<string, User> = {
  'ministry.admin@nic.in': {
    id: 1,
    username: 'ministry.admin@nic.in',
    fullName: 'Shri Rajesh Sharma',
    email: 'ministry.admin@nic.in',
    role: 'CENTRAL_MINISTRY',
    roleDisplayName: 'Central Ministry',
    designation: 'Joint Secretary (MoRD)',
    department: 'Department of Land Resources',
    state: 'All States',
    district: 'All Districts',
    acquiringAuthority: 'MoRD',
  },
  'cala.pune@nic.in': {
    id: 2,
    username: 'cala.pune@nic.in',
    fullName: 'Smt. Sunita Patil',
    email: 'cala.pune@nic.in',
    role: 'LAND_ACQUIRING_AUTHORITY',
    roleDisplayName: 'CALA (Competent Authority)',
    designation: 'Competent Authority Land Acquisition',
    department: 'District Revenue Office',
    state: 'Maharashtra',
    district: 'Pune',
    acquiringAuthority: 'NHAI Pune Zone',
  },
  'field.officer@nic.in': {
    id: 3,
    username: 'field.officer@nic.in',
    fullName: 'Shri Vikram Deshmukh',
    email: 'field.officer@nic.in',
    role: 'FIELD_OFFICER',
    roleDisplayName: 'Field Officer',
    designation: 'District Surveyor',
    department: 'Survey & Land Records',
    state: 'Maharashtra',
    district: 'Pune',
    acquiringAuthority: 'NHAI Pune Zone',
  },
  'sec.mord@nic.in': {
    id: 4,
    username: 'sec.mord@nic.in',
    fullName: 'Shri Amit Kumar',
    email: 'sec.mord@nic.in',
    role: 'STATE_AUTHORITY',
    roleDisplayName: 'State Authority',
    designation: 'Principal Secretary (Revenue)',
    department: 'Revenue & Forest Department',
    state: 'Maharashtra',
    district: 'All Districts',
    acquiringAuthority: 'Govt of Maharashtra',
  },
  'district.collector@nic.in': {
    id: 5,
    username: 'district.collector@nic.in',
    fullName: 'Dr. Rajendra Bhosale',
    email: 'district.collector@nic.in',
    role: 'DISTRICT_AUTHORITY',
    roleDisplayName: 'District Magistrate / Collector',
    designation: 'District Collector',
    department: 'District Administration',
    state: 'Maharashtra',
    district: 'Pune',
    acquiringAuthority: 'Collector Office Pune',
  },
  'citizen@nic.in': {
    id: 999,
    username: 'citizen@nic.in',
    fullName: 'Shri Tukaram S. Gaikwad',
    email: 'citizen@nic.in',
    role: 'CITIZEN',
    roleDisplayName: 'Affected Person',
    designation: 'Landowner',
    department: 'Citizen Portal',
    state: 'Maharashtra',
    district: 'Pune',
    acquiringAuthority: 'N/A',
  },
};

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
  const [demoAccounts, setDemoAccounts] = useState<DemoUser[]>(DEFAULT_DEMO_ACCOUNTS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Attempt to fetch live demo accounts from backend API if available
    apiFetch<DemoUser[]>('/auth/demo-accounts')
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          const citizenMock: DemoUser = {
            username: 'citizen@nic.in',
            fullName: 'Shri Tukaram S. Gaikwad',
            roleName: 'Affected Person',
            designation: 'Landowner',
            state: 'Maharashtra',
            district: 'Pune',
            password: import.meta.env.VITE_CITIZEN_DEMO_PASS ?? 'demo'
          };
          setDemoAccounts([...res.data, citizenMock]);
        }
      })
      .catch(err => {
        console.warn('Backend API unavailable. Utilizing client-side demo accounts:', err);
        setDemoAccounts(DEFAULT_DEMO_ACCOUNTS);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (username: string, password: string, captcha?: string) => {
    // 1. First attempt backend API login
    try {
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
        return;
      }
    } catch (err) {
      console.warn('Backend API login unavailable. Falling back to prototype client authentication:', err);
    }

    // 2. Client-side fallback authentication for Vercel static prototype deployment
    const foundMockUser = MOCK_USER_MAP[username] || {
      id: Math.floor(Math.random() * 1000),
      username,
      fullName: username.split('@')[0].toUpperCase(),
      email: username,
      role: 'CENTRAL_MINISTRY' as const,
      roleDisplayName: 'Central Ministry',
      designation: 'Authorized Officer',
      department: 'Ministry of Rural Development',
      state: 'All States',
      district: 'All Districts',
      acquiringAuthority: 'MoRD',
    };

    const mockToken = `demo-token-${Date.now()}`;
    const defaultPermissions = [
      'canCreateProject', 'canAdvanceWorkflow', 'canGenerateGazette',
      'canEditParcel', 'canScheduleHearing', 'canApproveProposals',
      'canViewCompensation', 'canManageGrievances'
    ];

    setToken(mockToken);
    setUser(foundMockUser);
    setPermissions(defaultPermissions);
    localStorage.setItem('bhoomisetu_token', mockToken);
    localStorage.setItem('bhoomisetu_user', JSON.stringify(foundMockUser));
    localStorage.setItem('bhoomisetu_permissions', JSON.stringify(defaultPermissions));
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
