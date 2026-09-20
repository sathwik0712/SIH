export type StatutoryStage =
  | 'SEC_4_NOTIFICATION'
  | 'SEC_15_OBJECTIONS'
  | 'SEC_19_DECLARATION'
  | 'SEC_23_INQUIRY'
  | 'SEC_25_AWARD'
  | 'SEC_30_COMPENSATION'
  | 'SEC_38_POSSESSION';

export type MilestoneStatus =
  | 'COMPLETED'
  | 'ON_TRACK'
  | 'DELAYED'
  | 'CRITICAL_SLA_BREACH'
  | 'PENDING';

export interface StatutoryMilestone {
  stage: StatutoryStage;
  name: string;
  statutorySlaDays: number; // Max statutory window under RFCTLARR (e.g. 365 days from Sec 4 to Sec 19)
  targetDate: string;
  actualDate?: string | null;
  status: MilestoneStatus;
  varianceDays: number; // + days delayed, - days ahead, 0 on track
  bottleneckReason?: string;
  responsibleOfficer?: string;
  gazetteNoticeNo?: string;
}

export interface LandExtentBreakdown {
  privatePattaHa: number;
  govtLandHa: number;
  forestProtectedHa: number;
  totalHa: number;
}

export interface AuthenticProject {
  id: number;
  projectCode: string;
  projectName: string;
  ministryAgency: string;
  acquiringAuthority: string;
  state: string;
  districts: string[];
  taluksCount: number;
  villagesCount: number;
  landExtent: LandExtentBreakdown;
  totalBudgetCr: number;
  disbursedBudgetCr: number;
  acquisitionStage: string;
  status: 'ON_TRACK' | 'AT_RISK' | 'DELAYED' | 'COMPLETED';
  progressPercentage: number;
  totalParcels: number;
  verifiedParcels: number;
  targetCompletionDate: string;
  overallVarianceDays: number;
  slaCountdownDays?: number;
  milestones: StatutoryMilestone[];
  description: string;
  notificationDate?: string;
  totalAffectedFamilies: number;
  rehabilitatedFamilies: number;
}
