export type ProposalStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'STATE_SCRUTINY'
  | 'QUERY_RAISED'
  | 'STATE_RECOMMENDED'
  | 'CENTRAL_APPROVED'
  | 'REJECTED'
  | 'CONVERTED_TO_PROJECT';

export type ProjectCategory =
  | 'Highways'
  | 'Railways'
  | 'Energy'
  | 'Industrial'
  | 'Urban Infrastructure';

export interface LandExtentBreakdown {
  privateHa: number;
  govtHa: number;
  forestHa: number;
  totalHa: number;
}

export interface ProposalBudget {
  landCostCr: number;
  rrCostCr: number;
  contingencyCr: number;
  totalCostCr: number;
}

export interface ScrutinyChecklist {
  sanctionVerified: boolean;
  landScheduleVerified: boolean;
  siaApplicabilityDetermined: boolean;
  forestClearanceNoted: boolean;
  remarks?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface ProposalDocument {
  id: string;
  name: string;
  type: 'DPR' | 'FEASIBILITY' | 'ALIGNMENT_MAP' | 'LAND_SCHEDULE' | 'SANCTION_ORDER';
  uploadedAt: string;
  sizeMb: number;
  url: string;
}

export interface ProposalAuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  previousStatus?: ProposalStatus;
  newStatus: ProposalStatus;
  remarks?: string;
}

export interface Proposal {
  id: string;
  proposalNumber: string;
  title: string;
  projectCategory: ProjectCategory;
  requiringBody: string;
  nodalOfficerName: string;
  nodalOfficerContact: string;
  state: string;
  districts: string[];
  villagesCount: number;
  landExtent: LandExtentBreakdown;
  budget: ProposalBudget;
  adminSanctionNo: string;
  adminSanctionDate: string;
  status: ProposalStatus;
  documents: ProposalDocument[];
  scrutinyChecklist: ScrutinyChecklist;
  history: ProposalAuditLog[];
  createdDate: string;
  lastUpdated: string;
  convertedProjectId?: number;
}
