import { RoleType } from '../types';
import {
  LayoutDashboard,
  FolderGit2,
  MapPin,
  GitMerge,
  Map,
  FileText,
  Award,
  DollarSign,
  Users,
  Home,
  FileArchive,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Smartphone,
  ClipboardList,
  Briefcase,
  Gavel,
  MessageSquareWarning,
  CheckSquare,
  FileCheck,
  FilePlus
} from 'lucide-react';

export interface NavItemConfig {
  name: string;
  path: string;
  icon: any;
  section: string;
}

export interface RolePermissions {
  canCreateProject: boolean;
  canAdvanceWorkflow: boolean;
  canGenerateGazette: boolean;
  canEditParcel: boolean;
  canScheduleHearing: boolean;
  canApproveProposals: boolean;
  canViewCompensation: boolean;
  canManageGrievances: boolean;
  maskPII: boolean;
  readOnly: boolean;
}

export interface RoleConfig {
  role: RoleType;
  displayName: string;
  description: string;
  defaultRoute: string;
  navItems: NavItemConfig[];
  allowedRoutes: string[];
  permissions: RolePermissions;
}

export const ROLE_CONFIG_MAP: Record<RoleType, RoleConfig> = {
  CENTRAL_MINISTRY: {
    role: 'CENTRAL_MINISTRY',
    displayName: 'Central Ministry',
    description: 'Pan-India oversight. Read-only access across all national projects.',
    defaultRoute: '/dashboard',
    allowedRoutes: ['/dashboard', '/proposals', '/proposals/new', '/proposals/:id', '/projects', '/projects/:id', '/reports', '/audit-trail', '/alerts'],
    permissions: {
      canCreateProject: false,
      canAdvanceWorkflow: false,
      canGenerateGazette: false,
      canEditParcel: false,
      canScheduleHearing: false,
      canApproveProposals: true,
      canViewCompensation: true,
      canManageGrievances: false,
      maskPII: false,
      readOnly: true,
    },
    navItems: [
      { name: 'National Dashboard', path: '/dashboard', icon: LayoutDashboard, section: 'Overview' },
      { name: 'Proposal Sanctions', path: '/proposals', icon: FileCheck, section: 'Requisitions' },
      { name: 'Projects Register', path: '/projects', icon: FolderGit2, section: 'Overview' },
      { name: 'MIS Reports & Exports', path: '/reports', icon: BarChart3, section: 'Compliance & MIS' },
      { name: 'National Audit Trail', path: '/audit-trail', icon: ShieldCheck, section: 'Compliance & MIS' },
      { name: 'Alerts & Escalations', path: '/alerts', icon: AlertTriangle, section: 'Compliance & MIS' },
    ],
  },
  STATE_AUTHORITY: {
    role: 'STATE_AUTHORITY',
    displayName: 'State Government Authority',
    description: 'State-level monitoring and statutory proposal approval authority.',
    defaultRoute: '/dashboard',
    allowedRoutes: ['/dashboard', '/proposals', '/proposals/new', '/proposals/:id', '/projects', '/projects/:id', '/workflow', '/reports', '/audit-trail', '/alerts'],
    permissions: {
      canCreateProject: false,
      canAdvanceWorkflow: false,
      canGenerateGazette: false,
      canEditParcel: false,
      canScheduleHearing: false,
      canApproveProposals: true,
      canViewCompensation: true,
      canManageGrievances: false,
      maskPII: false,
      readOnly: false,
    },
    navItems: [
      { name: 'State Dashboard', path: '/dashboard', icon: LayoutDashboard, section: 'Overview' },
      { name: 'Proposal Scrutiny', path: '/proposals', icon: CheckSquare, section: 'Requisitions' },
      { name: 'State Projects', path: '/projects', icon: FolderGit2, section: 'Overview' },
      { name: 'State Reports', path: '/reports', icon: BarChart3, section: 'Compliance & MIS' },
      { name: 'State Audit Trail', path: '/audit-trail', icon: ShieldCheck, section: 'Compliance & MIS' },
      { name: 'Alerts', path: '/alerts', icon: AlertTriangle, section: 'Compliance & MIS' },
    ],
  },
  DISTRICT_AUTHORITY: {
    role: 'DISTRICT_AUTHORITY',
    displayName: 'District Magistrate / Collector',
    description: 'District-level administration, hearings, and grievance resolution.',
    defaultRoute: '/dashboard',
    allowedRoutes: [
      '/dashboard',
      '/proposals',
      '/proposals/new',
      '/proposals/:id',
      '/projects',
      '/projects/:id',
      '/parcels',
      '/compensation',
      '/affected-families',
      '/hearings',
      '/grievances',
      '/documents',
      '/alerts',
    ],
    permissions: {
      canCreateProject: false,
      canAdvanceWorkflow: false,
      canGenerateGazette: false,
      canEditParcel: true,
      canScheduleHearing: true,
      canApproveProposals: false,
      canViewCompensation: true,
      canManageGrievances: true,
      maskPII: false,
      readOnly: false,
    },
    navItems: [
      { name: 'District Dashboard', path: '/dashboard', icon: LayoutDashboard, section: 'Overview' },
      { name: 'District Requisitions', path: '/proposals', icon: FileCheck, section: 'District Operations' },
      { name: 'District Projects', path: '/projects', icon: ClipboardList, section: 'District Operations' },
      { name: 'Land Parcels', path: '/parcels', icon: MapPin, section: 'District Operations' },
      { name: 'Compensation Tracker', path: '/compensation', icon: DollarSign, section: 'District Operations' },
      { name: 'Affected Families', path: '/affected-families', icon: Users, section: 'District Operations' },
      { name: 'Sec 15 Hearings', path: '/hearings', icon: Gavel, section: 'District Operations' },
      { name: 'Grievances Resolution', path: '/grievances', icon: MessageSquareWarning, section: 'Compliance & MIS' },
      { name: 'Documents Repository', path: '/documents', icon: FileArchive, section: 'Compliance & MIS' },
      { name: 'District Alerts', path: '/alerts', icon: AlertTriangle, section: 'Compliance & MIS' },
    ],
  },
  LAND_ACQUIRING_AUTHORITY: {
    role: 'LAND_ACQUIRING_AUTHORITY',
    displayName: 'CALA (Competent Authority Land Acquisition)',
    description: 'Full operational workhorse. Runs the day-to-day statutory workflow (Sec 4 to Sec 38).',
    defaultRoute: '/dashboard',
    allowedRoutes: [
      '/dashboard',
      '/proposals',
      '/proposals/new',
      '/proposals/:id',
      '/projects',
      '/projects/:id',
      '/parcels',
      '/workflow',
      '/notifications',
      '/awards',
      '/compensation',
      '/affected-families',
      '/randr',
      '/possession',
      '/hearings',
      '/sia',
      '/documents',
      '/grievances',
      '/alerts',
    ],
    permissions: {
      canCreateProject: true,
      canAdvanceWorkflow: true,
      canGenerateGazette: true,
      canEditParcel: true,
      canScheduleHearing: true,
      canApproveProposals: false,
      canViewCompensation: true,
      canManageGrievances: true,
      maskPII: false,
      readOnly: false,
    },
    navItems: [
      { name: 'CALA Workstation', path: '/dashboard', icon: LayoutDashboard, section: 'Overview' },
      { name: 'Submit New Requisition', path: '/proposals/new', icon: FilePlus, section: 'Requisitions' },
      { name: 'Proposals Register', path: '/proposals', icon: FileCheck, section: 'Requisitions' },
      { name: 'Projects Register', path: '/projects', icon: ClipboardList, section: 'Acquisition Workflow' },
      { name: 'Land Parcels (Cadastral)', path: '/parcels', icon: MapPin, section: 'Acquisition Workflow' },
      { name: 'Statutory Workflow (Sec 4-38)', path: '/workflow', icon: Briefcase, section: 'Acquisition Workflow' },
      { name: 'Gazette Generator (Sec 11/19)', path: '/notifications', icon: FileText, section: 'Statutory Stages' },
      { name: 'Award Inquiry (Sec 23)', path: '/awards', icon: Award, section: 'Statutory Stages' },
      { name: 'PFMS Compensation', path: '/compensation', icon: DollarSign, section: 'Statutory Stages' },
      { name: 'Affected Families', path: '/affected-families', icon: Users, section: 'R&R & Possession' },
      { name: 'R&R Entitlements', path: '/randr', icon: Home, section: 'R&R & Possession' },
      { name: 'Possession Handover', path: '/possession', icon: FileCheck, section: 'R&R & Possession' },
      { name: 'Sec 15 Hearings', path: '/hearings', icon: Gavel, section: 'Statutory Stages' },
      { name: 'SIA Module', path: '/sia', icon: Users, section: 'Statutory Stages' },
      { name: 'Documents Repository', path: '/documents', icon: FileArchive, section: 'Compliance & MIS' },
      { name: 'Grievances', path: '/grievances', icon: MessageSquareWarning, section: 'Compliance & MIS' },
      { name: 'Alerts', path: '/alerts', icon: AlertTriangle, section: 'Compliance & MIS' },
    ],
  },
  FIELD_OFFICER: {
    role: 'FIELD_OFFICER',
    displayName: 'Field Survey Officer',
    description: 'On-ground verification and cadastral survey tasks.',
    defaultRoute: '/field-verification',
    allowedRoutes: ['/field-verification', '/dashboard', '/gis-map', '/parcels', '/documents'],
    permissions: {
      canCreateProject: false,
      canAdvanceWorkflow: false,
      canGenerateGazette: false,
      canEditParcel: false, // survey status only
      canScheduleHearing: false,
      canApproveProposals: false,
      canViewCompensation: false,
      canManageGrievances: false,
      maskPII: true,
      readOnly: false,
    },
    navItems: [
      { name: 'My Survey Tasks', path: '/field-verification', icon: Smartphone, section: 'Field Tasks' },
      { name: 'GIS / Cadastral Map', path: '/gis-map', icon: Map, section: 'Field Tasks' },
      { name: 'Land Parcels Verification', path: '/parcels', icon: MapPin, section: 'Field Tasks' },
      { name: 'Upload Field Reports', path: '/documents', icon: FileArchive, section: 'Field Tasks' },
    ],
  },
  EXECUTIVE_VIEWER: {
    role: 'EXECUTIVE_VIEWER',
    displayName: 'Executive Viewer',
    description: 'Read-only view for high-level state/regional stakeholders.',
    defaultRoute: '/dashboard',
    allowedRoutes: ['/dashboard', '/proposals', '/projects', '/projects/:id', '/reports', '/alerts'],
    permissions: {
      canCreateProject: false,
      canAdvanceWorkflow: false,
      canGenerateGazette: false,
      canEditParcel: false,
      canScheduleHearing: false,
      canApproveProposals: false,
      canViewCompensation: true,
      canManageGrievances: false,
      maskPII: false,
      readOnly: true,
    },
    navItems: [
      { name: 'Executive Dashboard', path: '/dashboard', icon: LayoutDashboard, section: 'Overview' },
      { name: 'Proposals List', path: '/proposals', icon: FileCheck, section: 'Overview' },
      { name: 'Projects List', path: '/projects', icon: FolderGit2, section: 'Overview' },
      { name: 'Executive Reports', path: '/reports', icon: BarChart3, section: 'Overview' },
      { name: 'Alerts', path: '/alerts', icon: AlertTriangle, section: 'Overview' },
    ],
  },
  CITIZEN: {
    role: 'CITIZEN',
    displayName: 'Affected Person / Landowner Portal',
    description: 'Citizen transparency portal for land acquisition status and grievances.',
    defaultRoute: '/citizen',
    allowedRoutes: ['/citizen'],
    permissions: {
      canCreateProject: false,
      canAdvanceWorkflow: false,
      canGenerateGazette: false,
      canEditParcel: false,
      canScheduleHearing: false,
      canApproveProposals: false,
      canViewCompensation: false,
      canManageGrievances: false,
      maskPII: false,
      readOnly: true,
    },
    navItems: [
      { name: 'My Land Status', path: '/citizen', icon: MapPin, section: 'Citizen Portal' },
    ],
  },
};

export function getRoleConfig(role?: RoleType | null): RoleConfig {
  if (!role || !ROLE_CONFIG_MAP[role]) {
    return ROLE_CONFIG_MAP.CENTRAL_MINISTRY;
  }
  return ROLE_CONFIG_MAP[role];
}
