export type UserRole = 
  | 'CENTRAL_MINISTRY'
  | 'STATE_AUTHORITY'
  | 'DISTRICT_AUTHORITY'
  | 'LAND_ACQUIRING_AUTHORITY'
  | 'FIELD_OFFICER'
  | 'EXECUTIVE_VIEWER';

export interface User {
  id: string;
  name: string;
  designation: string;
  role: UserRole;
  department: string;
  state?: string;
  district?: string;
  email: string;
  avatarUrl?: string;
}

export type AcquisitionStage = 
  | 1 // Project Proposal & SIA
  | 2 // Land Identification
  | 3 // Field Verification
  | 4 // Statutory Notification (Sec 4/6/11)
  | 5 // Objections & Hearing (Sec 15)
  | 6 // Award Enquiry (Sec 23/30)
  | 7 // Compensation Disbursement
  | 8 // Resettlement & Rehabilitation (Sec 31)
  | 9 // Physical Possession (Sec 16/17)
  | 10; // Project Closure

export interface Project {
  id: string;
  code: string;
  name: string;
  sector: 'Highways' | 'Railways' | 'Renewable Energy' | 'Industrial Corridors' | 'Urban Transit' | 'Irrigation';
  state: string;
  district: string;
  acquiringAuthority: string; // e.g. NHAI, DFCCIL, SECI, State PWD
  landRequiredHa: number;
  landAcquiredHa: number;
  totalParcelsCount: number;
  estimatedCostCr: number;
  compensationDisbursedCr: number;
  startDate: string;
  targetDate: string;
  currentStage: AcquisitionStage;
  status: 'On Track' | 'At Risk' | 'Delayed' | 'Completed';
  riskScore: number; // 0-100
  delayDays: number;
  description: string;
  nodalOfficer: string;
}

export type LandType = 
  | 'Agricultural (Wet/Irrigated)'
  | 'Agricultural (Dry/Rainfed)'
  | 'Government / Revenue Land'
  | 'Forest / Protected'
  | 'Residential Settlement'
  | 'Commercial / Industrial'
  | 'Gram Kantham (Abadi)';

export type OwnershipStatus = 'Clear Title' | 'Disputed' | 'Government' | 'Inam / Trust' | 'Tenancy / Lease';

export type VerificationStatus = 'Pending' | 'In Progress' | 'Verified' | 'Discrepancy Found';

export type ParcelAcquisitionStatus = 
  | 'Identified' 
  | 'Under Verification' 
  | 'Notified (Sec 11)' 
  | 'Award Declared' 
  | 'Compensation Disbursed' 
  | 'Possession Taken';

export type CompensationStatus = 
  | 'Not Assessed' 
  | 'Assessed' 
  | 'Approved' 
  | 'Disbursed' 
  | 'In Escrow / Disputed';

export interface GeoCoordinate {
  lat: number;
  lng: number;
}

export interface LandParcel {
  id: string;
  projectId: string;
  surveyNumber: string;
  khasraNumber: string;
  village: string;
  mandalTaluk: string;
  district: string;
  state: string;
  areaHa: number;
  areaAcres: number;
  landType: LandType;
  ownershipStatus: OwnershipStatus;
  verificationStatus: VerificationStatus;
  acquisitionStatus: ParcelAcquisitionStatus;
  compensationStatus: CompensationStatus;
  ownerName: string;
  ownerFatherName: string;
  ownerAadhaarMasked: string;
  ownerContact: string;
  marketRatePerAcre: number;
  totalCompensationEstimated: number;
  verifiedByOfficer?: string;
  verificationDate?: string;
  gpsCoordinates: GeoCoordinate[];
  centerCoordinate: GeoCoordinate;
  remarks?: string;
  photographUrl?: string;
}

export interface StatutoryNotification {
  id: string;
  projectId: string;
  sectionType: 'Section 4(1) - Preliminary' | 'Section 6(1) - Declaration' | 'Section 9(1) - Notice' | 'Section 11(1) - SIA' | 'Section 19(1) - Final Declaration';
  gazetteNumber: string;
  publicationDate: string;
  expiryDate: string;
  status: 'Published' | 'Hearing Period Open' | 'Lapsed' | 'Finalized';
  issuingAuthority: string;
  parcelsAffectedCount: number;
  gazettePdfUrl: string;
  summary: string;
}

export interface Objection {
  id: string;
  projectId: string;
  parcelId: string;
  surveyNumber: string;
  applicantName: string;
  applicantContact: string;
  dateFiled: string;
  grounds: 'Area Measurement Mismatch' | 'Inadequate Compensation Rate' | 'Religious / Heritage Structure' | 'Multiple Ownership Claim' | 'Exclusion of Agricultural Land';
  description: string;
  hearingDate: string;
  hearingOfficer: string;
  decision: 'Pending' | 'Rejected - Lawful Public Purpose' | 'Partially Upheld - Area Re-surveyed' | 'Rate Revision Recommended';
  decisionDate?: string;
  status: 'Hearing Scheduled' | 'Disposed' | 'Pending Review';
  orderDocumentUrl?: string;
}

export interface AwardRecord {
  id: string;
  projectId: string;
  parcelId: string;
  awardNumber: string;
  surveyNumber: string;
  ownerName: string;
  dateOfAward: string;
  marketValue: number; // in INR Lakhs
  solatium100Percent: number; // 100% of market value
  additionalInterest12Percent: number; // 12% p.a.
  assetsValuation: number; // trees, structures, tubewells
  totalAwardAmount: number; // total in Lakhs
  collectorApprovalStatus: 'Drafted' | 'Recommended by CALA' | 'Approved by Collector' | 'Stayed by Court';
  approvalDate?: string;
  beneficiariesCount: number;
}

export interface CompensationDisbursement {
  id: string;
  projectId: string;
  parcelId: string;
  surveyNumber: string;
  beneficiaryId: string;
  beneficiaryName: string;
  bankName: string;
  accountNumberMasked: string;
  ifscCode: string;
  amountAssessed: number; // Lakhs
  amountApproved: number; // Lakhs
  amountDisbursed: number; // Lakhs
  pendingAmount: number; // Lakhs
  disbursementMode: 'Direct Benefit Transfer (PFMS)' | 'RTGS/NEFT' | 'Civil Court Escrow (Sec 64/76)';
  paymentDate?: string;
  utrTransactionNumber?: string;
  status: 'Paid' | 'Pending Approval' | 'Under PFMS Verification' | 'Disputed Escrow';
  remarks?: string;
}

export interface AffectedFamily {
  id: string;
  projectId: string;
  village: string;
  headOfFamily: string;
  fatherOrHusbandName: string;
  familyMembersCount: number;
  socialCategory: 'SC' | 'ST' | 'OBC' | 'General';
  vulnerabilityStatus: 'BPL Card Holder' | 'Female Headed' | 'Disabled / Elderly' | 'Standard';
  isDisplaced: boolean;
  occupationalStatus: 'Agricultural Cultivator' | 'Agricultural Labourer' | 'Artisan / Small Business' | 'Tenant / Sharecropper';
  titleHolder: boolean;
  surveyNumberAffected: string;
  eligibilityStatus: 'Eligible for Comprehensive R&R' | 'Eligible for One-time Grant' | 'Under Verification';
}

export interface RRBenefit {
  id: string;
  familyId: string;
  projectId: string;
  headOfFamily: string;
  village: string;
  housingOption: 'Constructed House in Resettlement Colony' | 'One-Time Cash Grant ₹5.00 Lakhs' | 'Not Applicable (Non-Displaced)';
  housingStatus: 'Allotted' | 'Sanctioned' | 'Disbursed' | 'Pending';
  subsistenceGrantPaid: boolean; // ₹50,000 one time
  annuityOrJobOption: 'Mandatory Employment in Project' | 'Monthly Annuity ₹3,000 for 20 Yrs' | 'One-Time Cash Grant ₹5.00 Lakhs';
  vocationalTrainingProvided: boolean;
  relocationStatus: 'Relocation Completed' | 'In Progress' | 'Colony Construction Underway' | 'Pending Land Allotment';
  allotmentDate?: string;
  colonyName?: string;
  plotNumber?: string;
}

export interface PossessionRecord {
  id: string;
  projectId: string;
  parcelId: string;
  surveyNumber: string;
  village: string;
  areaPossessedHa: number;
  possessionDate: string;
  panchnamaNumber: string;
  handoverOfficer: string;
  handoverOfficerDesignation: string;
  acquiringRepresentative: string;
  panchWitness1: string;
  panchWitness2: string;
  isUrgencyClauseSec40Applied: boolean;
  policeAssistanceRequired: boolean;
  status: 'Possession Completed' | 'Partial Possession' | 'Law & Order Enforced' | 'Pending Handover';
  photographUrl: string;
  panchnamaDocumentUrl: string;
  remarks: string;
}

export interface DMSDocument {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  category: 'Project Proposal & SIA' | 'Land Records & Cadastral' | 'Statutory Notifications' | 'Claims & Objections' | 'Valuation & Awards' | 'Compensation & DBT' | 'R&R Records' | 'Possession Panchnama';
  fileType: 'PDF' | 'DWG' | 'GeoJSON' | 'XLSX' | 'JPG';
  fileSizeMb: number;
  version: string;
  uploadedBy: string;
  uploadedRole: string;
  uploadDate: string;
  verificationStatus: 'Verified Official' | 'Draft Pending Review' | 'Archived';
  fileUrl: string;
}

export interface AlertNotification {
  id: string;
  projectId?: string;
  projectName?: string;
  title: string;
  message: string;
  severity: 'Critical' | 'Warning' | 'Information';
  category: 'Statutory Deadline' | 'Compensation' | 'Dispute' | 'R&R Compliance' | 'Field Verification';
  createdAt: string;
  isRead: boolean;
  actionLink?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  module: string;
  entityId: string;
  previousStatus?: string;
  newStatus?: string;
  ipAddress: string;
  details: string;
}

export interface ExternalServiceIntegration {
  name: string;
  provider: string;
  type: 'Cadastral GIS' | 'Land Records (Bhulekh)' | 'e-Gazette' | 'PFMS DBT Banking';
  status: 'Connected (Simulated API)' | 'Healthy' | 'Degraded' | 'Offline';
  latencyMs: number;
  lastSyncTime: string;
  recordsSyncedCount: number;
}
