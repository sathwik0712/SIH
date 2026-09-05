export type RoleType =
  | 'CENTRAL_MINISTRY'
  | 'STATE_AUTHORITY'
  | 'DISTRICT_AUTHORITY'
  | 'LAND_ACQUIRING_AUTHORITY'
  | 'FIELD_OFFICER'
  | 'EXECUTIVE_VIEWER';

export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: RoleType;
  roleDisplayName: string;
  designation: string;
  department: string;
  state: string;
  district: string;
  acquiringAuthority: string;
}

export interface DemoUser {
  username: string;
  fullName: string;
  roleName: string;
  designation: string;
  state: string;
  district: string;
  password: string;
}

export interface ProjectSummary {
  id: number;
  projectCode: string;
  projectName: string;
  state: string;
  district: string;
  acquiringAuthority: string;
  acquisitionStage: string;
  status: 'ON_TRACK' | 'AT_RISK' | 'DELAYED' | 'COMPLETED';
  totalLandRequiredHectares: number;
  totalLandAcquiredHectares: number;
  progressPercentage: number;
  totalParcels: number;
  verifiedParcels: number;
  targetCompletionDate: string;
}

export interface LandParcel {
  id: number;
  parcelCode: string;
  surveyNumber: string;
  khasraNumber: string;
  village: string;
  mandalOrTehsil: string;
  district: string;
  state: string;
  areaHectares: number;
  landType: string;
  ownershipType: string;
  ownerName: string;
  ownerContact: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'FIELD_VISIT_SCHEDULED';
  acquisitionStatus: 'IDENTIFIED' | 'NOTIFIED' | 'OBJECTION_RAISED' | 'AWARD_DECLARED' | 'COMPENSATION_PAID' | 'POSSESSION_TAKEN';
  compensationStatus: 'PENDING' | 'ASSESSED' | 'APPROVED' | 'DISBURSED' | 'DISPUTED';
  compensationAmountInr: number;
  latitude: number;
  longitude: number;
  fieldRemarks: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface AuditLog {
  id: number;
  timestamp: string;
  username: string;
  role: string;
  action: string;
  module: string;
  entityId: string;
  previousStatus?: string;
  newStatus?: string;
  details: string;
  ipAddress: string;
}

export interface DashboardStats {
  totalProjects: number;
  totalLandRequiredHectares: number;
  totalLandAcquiredHectares: number;
  totalParcels: number;
  verifiedParcels: number;
  parcelsPendingVerification: number;
  compensationAssessedCr: number;
  compensationDisbursedCr: number;
  totalAffectedFamilies: number;
  rehabilitatedFamilies: number;
  possessionCompletedHectares: number;
  delayedCases: number;
  atRiskCases: number;
  onTrackCases: number;
}
