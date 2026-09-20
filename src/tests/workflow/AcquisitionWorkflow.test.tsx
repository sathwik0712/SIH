import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AcquisitionWorkflowPage from '../../pages/AcquisitionWorkflowPage';
import * as AuthContextModule from '../../context/AuthContext';
import { User } from '../../types';

vi.mock('../../context/AuthContext', async () => {
  const actual = await vi.importActual('../../context/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

describe('Statutory Workflow Advancement Suite (AcquisitionWorkflowPage)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders "Advance to Next Statutory Stage" button for CALA role (canAdvanceWorkflow: true)', () => {
    const mockCalaUser: User = {
      id: 2,
      username: 'cala@nic.in',
      fullName: 'Shri A. K. Sharma',
      email: 'cala@nic.in',
      role: 'LAND_ACQUIRING_AUTHORITY',
      roleDisplayName: 'CALA',
      designation: 'Competent Authority',
      department: 'Revenue Dept',
      state: 'Maharashtra',
      district: 'Pune',
      acquiringAuthority: 'NHAI',
    };

    vi.mocked(AuthContextModule.useAuth).mockReturnValue({
      user: mockCalaUser,
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
      <MemoryRouter>
        <AcquisitionWorkflowPage />
      </MemoryRouter>
    );

    expect(screen.getByText('CALA Mode (Can Advance)')).toBeInTheDocument();
    const advanceButtons = screen.getAllByText('Advance to Next Statutory Stage');
    expect(advanceButtons.length).toBeGreaterThan(0);
  });

  it('advances the active stage to COMPLETED, records date, and persists to localStorage on click', () => {
    const mockCalaUser: User = {
      id: 2,
      username: 'cala@nic.in',
      fullName: 'Shri A. K. Sharma',
      email: 'cala@nic.in',
      role: 'LAND_ACQUIRING_AUTHORITY',
      roleDisplayName: 'CALA',
      designation: 'Competent Authority',
      department: 'Revenue Dept',
      state: 'Maharashtra',
      district: 'Pune',
      acquiringAuthority: 'NHAI',
    };

    vi.mocked(AuthContextModule.useAuth).mockReturnValue({
      user: mockCalaUser,
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
      <MemoryRouter>
        <AcquisitionWorkflowPage />
      </MemoryRouter>
    );

    const advanceButtons = screen.getAllByText('Advance to Next Statutory Stage');
    fireEvent.click(advanceButtons[0]);

    // Check localStorage persistence
    const savedData = localStorage.getItem('bhoomisetu_workflow_stages');
    expect(savedData).not.toBeNull();
    const parsed = JSON.parse(savedData!);
    
    // Stage 4 (id: 4) was active, now should be COMPLETED
    const stage4 = parsed.find((s: any) => s.id === 4);
    expect(stage4.status).toBe('COMPLETED');
    expect(stage4.completedOn).toBeDefined();

    // Stage 5 (id: 5) should now be ACTIVE
    const stage5 = parsed.find((s: any) => s.id === 5);
    expect(stage5.status).toBe('ACTIVE');
  });

  it('displays read-only mode and hides advance buttons for roles without canAdvanceWorkflow (e.g., STATE_AUTHORITY)', () => {
    const mockStateUser: User = {
      id: 3,
      username: 'state@nic.in',
      fullName: 'Smt. Priya Sundaram',
      email: 'state@nic.in',
      role: 'STATE_AUTHORITY',
      roleDisplayName: 'State Authority',
      designation: 'Principal Secretary',
      department: 'Revenue & Land Records',
      state: 'Maharashtra',
      district: 'N/A',
      acquiringAuthority: 'N/A',
    };

    vi.mocked(AuthContextModule.useAuth).mockReturnValue({
      user: mockStateUser,
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
      <MemoryRouter>
        <AcquisitionWorkflowPage />
      </MemoryRouter>
    );

    expect(screen.getAllByText('Viewing Statutory Progress (Read-Only)').length).toBeGreaterThan(0);
    expect(screen.queryByText('Advance to Next Statutory Stage')).not.toBeInTheDocument();
  });
});
