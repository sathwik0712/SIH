import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  GrievancePortal,
  generateGrievanceTrackingCode,
  isValidGrievanceTransition,
  transitionGrievanceStatus,
  type GrievanceRecord,
} from '../../components/grievances/GrievancePortal';
import * as AuthContextModule from '../../context/AuthContext';
import { User } from '../../types';

vi.mock('../../context/AuthContext', async () => {
  const actual = await vi.importActual('../../context/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

describe('GrievancePortal Unit Test Suite', () => {
  const mockCitizenUser: User = {
    id: 101,
    username: 'citizen@example.com',
    fullName: 'Ramesh Patil',
    email: 'citizen@example.com',
    role: 'CITIZEN',
    roleDisplayName: 'Landowner Citizen',
    designation: 'Landowner',
    department: 'N/A',
    state: 'Maharashtra',
    district: 'Pune',
    acquiringAuthority: 'N/A',
  };

  const mockDistrictUser: User = {
    id: 102,
    username: 'dm_pune@nic.in',
    fullName: 'Dr. Rajesh Deshmukh',
    email: 'dm_pune@nic.in',
    role: 'DISTRICT_AUTHORITY',
    roleDisplayName: 'District Magistrate & Collector',
    designation: 'District Collector',
    department: 'Revenue & Land Records',
    state: 'Maharashtra',
    district: 'Pune',
    acquiringAuthority: 'NHAI',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(AuthContextModule.useAuth).mockReturnValue({
      user: mockCitizenUser,
      token: 'mock-token',
      permissions: [],
      isAuthenticated: true,
      isLoading: false,
      demoAccounts: [],
      login: vi.fn(),
      logout: vi.fn(),
      hasPermission: vi.fn(),
    });
  });

  // =========================================================================
  // 1. Form Validation Tests
  // =========================================================================
  describe('Citizen Grievance Form Validation', () => {
    it('displays error messages when submitting an empty form', () => {
      render(
        <MemoryRouter>
          <GrievancePortal />
        </MemoryRouter>,
      );

      const submitBtn = screen.getByRole('button', { name: /submit grievance/i });
      fireEvent.click(submitBtn);

      expect(screen.getByText('Parcel ID is required')).toBeInTheDocument();
      expect(screen.getByText('Complaint type is required')).toBeInTheDocument();
      expect(screen.getByText('Description is required')).toBeInTheDocument();
    });

    it('displays validation error if parcel ID is omitted', () => {
      render(
        <MemoryRouter>
          <GrievancePortal />
        </MemoryRouter>,
      );

      fireEvent.change(screen.getByLabelText(/complaint type/i), {
        target: { value: 'COMPENSATION' },
      });
      fireEvent.change(screen.getByLabelText(/description/i), {
        target: { value: 'Compensation is below market value' },
      });

      fireEvent.click(screen.getByRole('button', { name: /submit grievance/i }));

      expect(screen.getByText('Parcel ID is required')).toBeInTheDocument();
      expect(screen.queryByText('Complaint type is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Description is required')).not.toBeInTheDocument();
    });

    it('displays validation error if complaint type is omitted', () => {
      render(
        <MemoryRouter>
          <GrievancePortal />
        </MemoryRouter>,
      );

      fireEvent.change(screen.getByLabelText(/parcel id/i), {
        target: { value: 'LP-PUN-001' },
      });
      fireEvent.change(screen.getByLabelText(/description/i), {
        target: { value: 'Survey overlap dispute' },
      });

      fireEvent.click(screen.getByRole('button', { name: /submit grievance/i }));

      expect(screen.getByText('Complaint type is required')).toBeInTheDocument();
      expect(screen.queryByText('Parcel ID is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Description is required')).not.toBeInTheDocument();
    });

    it('displays validation error if description is omitted', () => {
      render(
        <MemoryRouter>
          <GrievancePortal />
        </MemoryRouter>,
      );

      fireEvent.change(screen.getByLabelText(/parcel id/i), {
        target: { value: 'LP-PUN-005' },
      });
      fireEvent.change(screen.getByLabelText(/complaint type/i), {
        target: { value: 'R_AND_R' },
      });

      fireEvent.click(screen.getByRole('button', { name: /submit grievance/i }));

      expect(screen.getByText('Description is required')).toBeInTheDocument();
      expect(screen.queryByText('Parcel ID is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Complaint type is required')).not.toBeInTheDocument();
    });

    it('submits successfully when all required fields are provided', () => {
      render(
        <MemoryRouter>
          <GrievancePortal />
        </MemoryRouter>,
      );

      fireEvent.change(screen.getByLabelText(/parcel id/i), {
        target: { value: 'LP-MH-2026-99' },
      });
      fireEvent.change(screen.getByLabelText(/complaint type/i), {
        target: { value: 'COMPENSATION' },
      });
      fireEvent.change(screen.getByLabelText(/description/i), {
        target: { value: 'Discrepancy in valuation factor' },
      });

      fireEvent.click(screen.getByRole('button', { name: /submit grievance/i }));

      expect(screen.queryByText('Parcel ID is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Complaint type is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Description is required')).not.toBeInTheDocument();
      expect(screen.getByText(/grievance submitted successfully/i)).toBeInTheDocument();
    });
  });

  // =========================================================================
  // 2. Tracking Code Generation Format (GRV-2026-XXXX)
  // =========================================================================
  describe('Tracking Code Generation Format (GRV-2026-XXXX)', () => {
    it('generates tracking code matching GRV-2026-XXXX pattern when calling generateGrievanceTrackingCode()', () => {
      const code = generateGrievanceTrackingCode();
      expect(code).toMatch(/^GRV-2026-\d{4}$/);
    });

    it('pads single-digit and double-digit sequence numbers to 4 digits', () => {
      expect(generateGrievanceTrackingCode(1)).toBe('GRV-2026-0001');
      expect(generateGrievanceTrackingCode(42)).toBe('GRV-2026-0042');
      expect(generateGrievanceTrackingCode(789)).toBe('GRV-2026-0789');
      expect(generateGrievanceTrackingCode(1234)).toBe('GRV-2026-1234');
    });

    it('renders generated tracking code in GRV-2026-XXXX format upon form submission', () => {
      render(
        <MemoryRouter>
          <GrievancePortal />
        </MemoryRouter>,
      );

      fireEvent.change(screen.getByLabelText(/parcel id/i), {
        target: { value: 'LP-TEST-100' },
      });
      fireEvent.change(screen.getByLabelText(/complaint type/i), {
        target: { value: 'MEASUREMENT' },
      });
      fireEvent.change(screen.getByLabelText(/description/i), {
        target: { value: 'Boundary line dispute on western edge' },
      });

      fireEvent.click(screen.getByRole('button', { name: /submit grievance/i }));

      const submittedCode = screen.getByTestId('submitted-tracking-code');
      expect(submittedCode).toBeInTheDocument();
      expect(submittedCode.textContent).toMatch(/^GRV-2026-\d{4}$/);
    });
  });

  // =========================================================================
  // 3. Status Transition Tests (FILED -> UNDER_HEARING -> RESOLVED)
  // =========================================================================
  describe('Status State Transitions (FILED -> UNDER_HEARING -> RESOLVED)', () => {
    it('allows valid transition FILED -> UNDER_HEARING', () => {
      expect(isValidGrievanceTransition('FILED', 'UNDER_HEARING')).toBe(true);
    });

    it('allows valid transition UNDER_HEARING -> RESOLVED', () => {
      expect(isValidGrievanceTransition('UNDER_HEARING', 'RESOLVED')).toBe(true);
    });

    it('disallows direct transition FILED -> RESOLVED', () => {
      expect(isValidGrievanceTransition('FILED', 'RESOLVED')).toBe(false);
    });

    it('disallows backward transition RESOLVED -> UNDER_HEARING or RESOLVED -> FILED', () => {
      expect(isValidGrievanceTransition('RESOLVED', 'UNDER_HEARING')).toBe(false);
      expect(isValidGrievanceTransition('RESOLVED', 'FILED')).toBe(false);
    });

    it('transitionGrievanceStatus updates record when transition is valid', () => {
      const record: GrievanceRecord = {
        id: 'GRV-2026-0005',
        parcelId: 'LP-PUN-005',
        complaintType: 'COMPENSATION',
        description: 'Incorrect market rate applied',
        claimantName: 'Vijay More',
        filedDate: '2026-05-22',
        status: 'FILED',
      };

      const step1 = transitionGrievanceStatus(record, 'UNDER_HEARING');
      expect(step1.status).toBe('UNDER_HEARING');

      const step2 = transitionGrievanceStatus(
        step1,
        'RESOLVED',
        'Award recalculated per Sec 26',
      );
      expect(step2.status).toBe('RESOLVED');
      expect(step2.resolutionNotes).toBe('Award recalculated per Sec 26');
    });

    it('transitionGrievanceStatus throws error on invalid transition attempt', () => {
      const record: GrievanceRecord = {
        id: 'GRV-2026-0006',
        parcelId: 'LP-PUN-006',
        complaintType: 'POSSESSION',
        description: 'Premature eviction notice',
        claimantName: 'Lata Kulkarni',
        filedDate: '2026-05-23',
        status: 'FILED',
      };

      expect(() => transitionGrievanceStatus(record, 'RESOLVED')).toThrow(
        'Invalid status transition from FILED to RESOLVED',
      );
    });

    it('District Authority can transition grievance from FILED to UNDER_HEARING and then to RESOLVED in UI', () => {
      vi.mocked(AuthContextModule.useAuth).mockReturnValue({
        user: mockDistrictUser,
        token: 'mock-token',
        permissions: [],
        isAuthenticated: true,
        isLoading: false,
        demoAccounts: [],
        login: vi.fn(),
        logout: vi.fn(),
        hasPermission: vi.fn(),
      });

      const initialGrievance: GrievanceRecord = {
        id: 'GRV-2026-9999',
        parcelId: 'LP-PUN-999',
        complaintType: 'COMPENSATION',
        description: 'Under-assessment of solatium component',
        claimantName: 'Ganesh Shinde',
        filedDate: '2026-05-25',
        status: 'FILED',
      };

      render(
        <MemoryRouter>
          <GrievancePortal initialGrievances={[initialGrievance]} />
        </MemoryRouter>,
      );

      // Verify initial status is FILED
      const statusCell = screen.getByTestId('status-GRV-2026-9999');
      expect(statusCell).toHaveTextContent('FILED');

      // Click Start Hearing -> transition to UNDER_HEARING
      const startHearingBtn = screen.getByRole('button', {
        name: /start hearing \(under_hearing\)/i,
      });
      fireEvent.click(startHearingBtn);

      expect(statusCell).toHaveTextContent('UNDER_HEARING');

      // Fill resolution notes and click Resolve -> transition to RESOLVED
      const resolutionInput = screen.getByPlaceholderText(/resolution remarks/i);
      fireEvent.change(resolutionInput, {
        target: { value: 'Objection heard. Solatium set to 100% per Section 30.' },
      });

      const resolveBtn = screen.getByRole('button', { name: /resolve \(resolved\)/i });
      fireEvent.click(resolveBtn);

      expect(statusCell).toHaveTextContent('RESOLVED');
      expect(screen.getByText(/Objection heard. Solatium set to 100% per Section 30/i)).toBeInTheDocument();
    });
  });
});
