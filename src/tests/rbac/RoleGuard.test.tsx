import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RoleGuard } from '../../components/common/RoleGuard';
import * as AuthContextModule from '../../context/AuthContext';
import { User } from '../../types';

// Mock useAuth hook from AuthContext
vi.mock('../../context/AuthContext', async () => {
  const actual = await vi.importActual('../../context/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

describe('RBAC & Guard Isolation Suite (RoleGuard)', () => {
  it('redirects unauthenticated users to /login', () => {
    vi.mocked(AuthContextModule.useAuth).mockReturnValue({
      user: null,
      token: null,
      permissions: [],
      isAuthenticated: false,
      isLoading: false,
      demoAccounts: [],
      login: vi.fn(),
      logout: vi.fn(),
      hasPermission: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/dashboard"
            element={
              <RoleGuard allowedRoles={['CENTRAL_MINISTRY']}>
                <div>Dashboard Content</div>
              </RoleGuard>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard Content')).not.toBeInTheDocument();
  });

  it('restricts CITIZEN user strictly to /citizen when attempting internal routes', () => {
    const mockCitizen: User = {
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
    };

    vi.mocked(AuthContextModule.useAuth).mockReturnValue({
      user: mockCitizen,
      token: 'mock-token',
      permissions: [],
      isAuthenticated: true,
      isLoading: false,
      demoAccounts: [],
      login: vi.fn(),
      logout: vi.fn(),
      hasPermission: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/citizen" element={<div>Citizen Portal Home</div>} />
          <Route
            path="/dashboard"
            element={
              <RoleGuard allowedRoles={['CENTRAL_MINISTRY']}>
                <div>Dashboard Content</div>
              </RoleGuard>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Citizen Portal Home')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard Content')).not.toBeInTheDocument();
  });

  it('grants access to allowed routes for authorized roles (CENTRAL_MINISTRY)', () => {
    const mockMinistryUser: User = {
      id: 1,
      username: 'ministry@nic.in',
      fullName: 'Shri Rajesh Kumar',
      email: 'ministry@nic.in',
      role: 'CENTRAL_MINISTRY',
      roleDisplayName: 'Central Ministry',
      designation: 'Joint Secretary',
      department: 'MoRTH',
      state: 'All India',
      district: 'N/A',
      acquiringAuthority: 'N/A',
    };

    vi.mocked(AuthContextModule.useAuth).mockReturnValue({
      user: mockMinistryUser,
      token: 'mock-token',
      permissions: [],
      isAuthenticated: true,
      isLoading: false,
      demoAccounts: [],
      login: vi.fn(),
      logout: vi.fn(),
      hasPermission: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <RoleGuard allowedRoles={['CENTRAL_MINISTRY']}>
                <div>Central Ministry Dashboard</div>
              </RoleGuard>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Central Ministry Dashboard')).toBeInTheDocument();
  });
});
