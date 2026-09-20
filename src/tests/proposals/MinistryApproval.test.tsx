import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MinistryProposalApproval } from '../../components/proposals/MinistryProposalApproval';
import * as AuthContextModule from '../../context/AuthContext';
import { User } from '../../types';
import { Proposal } from '../../types/proposal';

vi.mock('../../context/AuthContext', async () => {
  const actual = await vi.importActual('../../context/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

const mockProposal: Proposal = {
  id: 'prop-101',
  proposalNumber: 'REQ-2026-MH-001',
  title: 'Pune Ring Road Southern Arc Acquisition',
  projectCategory: 'Highways',
  requiringBody: 'NHAI',
  nodalOfficerName: 'Shri V. K. Sharma',
  nodalOfficerContact: 'nodal@nic.in',
  state: 'Maharashtra',
  districts: ['Pune'],
  villagesCount: 5,
  status: 'STATE_RECOMMENDED',
  createdDate: '10 Jan 2026',
  lastUpdated: '15 Jan 2026',
  adminSanctionNo: 'SANCTION/2026/REQ/101',
  adminSanctionDate: '2026-01-10',
  landExtent: {
    totalHa: 145.5,
    privateHa: 100.0,
    govtHa: 30.0,
    forestHa: 15.5,
  },
  budget: {
    totalCostCr: 450.0,
    landCostCr: 350.0,
    rrCostCr: 100.0,
    contingencyCr: 0.0,
  },
  documents: [],
  scrutinyChecklist: {
    sanctionVerified: true,
    landScheduleVerified: true,
    siaApplicabilityDetermined: true,
    forestClearanceNoted: true,
  },
  history: [],
};

describe('Permission Enforcement Suite (MinistryProposalApproval)', () => {
  it('enables "Grant Final Central Sanction" button for roles with canApproveProposals: true (CENTRAL_MINISTRY)', () => {
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
      <MemoryRouter>
        <MinistryProposalApproval proposal={mockProposal} onRefresh={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText('Grant Final Central Sanction')).toBeInTheDocument();
    expect(screen.getByText('Reject / Return Proposal')).toBeInTheDocument();
  });

  it('renders read-only view indicator and hides sanction buttons for unauthorized roles (e.g., FIELD_OFFICER)', () => {
    const mockFieldUser: User = {
      id: 4,
      username: 'field@nic.in',
      fullName: 'Shri Suresh Patil',
      email: 'field@nic.in',
      role: 'FIELD_OFFICER',
      roleDisplayName: 'Field Survey Officer',
      designation: 'Revenue Inspector',
      department: 'Revenue Dept',
      state: 'Maharashtra',
      district: 'Pune',
      acquiringAuthority: 'N/A',
    };

    vi.mocked(AuthContextModule.useAuth).mockReturnValue({
      user: mockFieldUser,
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
        <MinistryProposalApproval proposal={mockProposal} onRefresh={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText('View Only')).toBeInTheDocument();
    expect(screen.queryByText('Grant Final Central Sanction')).not.toBeInTheDocument();
    expect(screen.queryByText('Reject / Return Proposal')).not.toBeInTheDocument();
  });
});
