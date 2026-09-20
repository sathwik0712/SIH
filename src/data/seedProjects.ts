import { AuthenticProject } from '../types/project';

export const SEED_PROJECTS: AuthenticProject[] = [
  {
    id: 101,
    projectCode: 'NHAI-DME-PKG-14',
    projectName: 'Delhi-Mumbai Expressway (Package 14 - Vadodara to Ankleshwar Spur)',
    ministryAgency: 'NHAI / Ministry of Road Transport & Highways',
    acquiringAuthority: 'NHAI CALA Vadodara & Bharuch',
    state: 'Gujarat',
    districts: ['Vadodara', 'Bharuch'],
    taluksCount: 6,
    villagesCount: 42,
    landExtent: { privatePattaHa: 1080.0, govtLandHa: 260.0, forestProtectedHa: 80.0, totalHa: 1420.0 },
    totalBudgetCr: 3850.0,
    disbursedBudgetCr: 3542.0,
    acquisitionStage: 'Possession (Sec 38)',
    status: 'ON_TRACK',
    progressPercentage: 92,
    totalParcels: 1450,
    verifiedParcels: 1390,
    targetCompletionDate: '2026-12-31',
    overallVarianceDays: -12,
    slaCountdownDays: 102,
    description: '8-lane access-controlled greenfield expressway connecting Vadodara to Ankleshwar industrial hub under Bharatmala Pariyojana Phase-I.',
    notificationDate: '2025-01-15',
    totalAffectedFamilies: 1240,
    rehabilitatedFamilies: 1180,
    milestones: [
      {
        stage: 'SEC_4_NOTIFICATION',
        name: 'Section 4(1) Preliminary Requisition',
        statutorySlaDays: 60,
        targetDate: '2025-01-15',
        actualDate: '2025-01-10',
        status: 'COMPLETED',
        varianceDays: -5,
        responsibleOfficer: 'CALA Vadodara'
      },
      {
        stage: 'SEC_15_OBJECTIONS',
        name: 'Section 15 Hearing of Objections',
        statutorySlaDays: 60,
        targetDate: '2025-03-15',
        actualDate: '2025-03-12',
        status: 'COMPLETED',
        varianceDays: -3,
        responsibleOfficer: 'District Collector Vadodara'
      },
      {
        stage: 'SEC_19_DECLARATION',
        name: 'Section 19 Gazette Declaration',
        statutorySlaDays: 365,
        targetDate: '2025-07-01',
        actualDate: '2025-06-25',
        status: 'COMPLETED',
        varianceDays: -6,
        gazetteNoticeNo: 'S.O. 1892(E)'
      },
      {
        stage: 'SEC_23_INQUIRY',
        name: 'Section 23 Award Formulation',
        statutorySlaDays: 180,
        targetDate: '2025-11-01',
        actualDate: '2025-10-28',
        status: 'COMPLETED',
        varianceDays: -4,
        responsibleOfficer: 'CALA Bharuch'
      },
      {
        stage: 'SEC_30_COMPENSATION',
        name: 'Section 30 PFMS Compensation Disbursal',
        statutorySlaDays: 90,
        targetDate: '2026-03-01',
        actualDate: '2026-02-20',
        status: 'COMPLETED',
        varianceDays: -9
      },
      {
        stage: 'SEC_38_POSSESSION',
        name: 'Section 38 Physical Possession Handover',
        statutorySlaDays: 60,
        targetDate: '2026-12-31',
        actualDate: null,
        status: 'ON_TRACK',
        varianceDays: 0,
        responsibleOfficer: 'District Magistrate Bharuch'
      }
    ]
  },
  {
    id: 102,
    projectCode: 'MAHSR-BULLET-C4',
    projectName: 'Mumbai-Ahmedabad High-Speed Rail (Bullet Train Package C4)',
    ministryAgency: 'NHSRCL / Ministry of Railways',
    acquiringAuthority: 'NHSRCL CALA Palghar & Surat',
    state: 'Maharashtra',
    districts: ['Palghar', 'Thane', 'Surat'],
    taluksCount: 8,
    villagesCount: 68,
    landExtent: { privatePattaHa: 580.0, govtLandHa: 190.0, forestProtectedHa: 90.0, totalHa: 860.0 },
    totalBudgetCr: 6200.0,
    disbursedBudgetCr: 4850.0,
    acquisitionStage: 'Award Formulation (Sec 25)',
    status: 'ON_TRACK',
    progressPercentage: 78,
    totalParcels: 980,
    verifiedParcels: 890,
    targetCompletionDate: '2027-03-31',
    overallVarianceDays: +4,
    slaCountdownDays: 142,
    description: 'High-speed Japanese Shinkansen E5 corridor passing through Palghar and Thane districts in Maharashtra and Surat in Gujarat.',
    notificationDate: '2025-03-10',
    totalAffectedFamilies: 950,
    rehabilitatedFamilies: 720,
    milestones: [
      {
        stage: 'SEC_4_NOTIFICATION',
        name: 'Section 4(1) Preliminary Requisition',
        statutorySlaDays: 60,
        targetDate: '2025-03-10',
        actualDate: '2025-03-10',
        status: 'COMPLETED',
        varianceDays: 0
      },
      {
        stage: 'SEC_15_OBJECTIONS',
        name: 'Section 15 Hearing of Objections',
        statutorySlaDays: 60,
        targetDate: '2025-05-10',
        actualDate: '2025-05-20',
        status: 'COMPLETED',
        varianceDays: +10,
        bottleneckReason: 'High volume of joint ownership objections resolved in Palghar Collectorate.'
      },
      {
        stage: 'SEC_19_DECLARATION',
        name: 'Section 19 Gazette Declaration',
        statutorySlaDays: 365,
        targetDate: '2025-10-15',
        actualDate: '2025-10-12',
        status: 'COMPLETED',
        varianceDays: -3
      },
      {
        stage: 'SEC_23_INQUIRY',
        name: 'Section 23 Award Inquiry & Solatium',
        statutorySlaDays: 180,
        targetDate: '2026-04-01',
        actualDate: '2026-03-28',
        status: 'COMPLETED',
        varianceDays: -4
      },
      {
        stage: 'SEC_25_AWARD',
        name: 'Section 25 Award Declaration',
        statutorySlaDays: 60,
        targetDate: '2026-09-30',
        actualDate: null,
        status: 'ON_TRACK',
        varianceDays: 0
      },
      {
        stage: 'SEC_38_POSSESSION',
        name: 'Section 38 Land Possession',
        statutorySlaDays: 90,
        targetDate: '2027-03-31',
        actualDate: null,
        status: 'PENDING',
        varianceDays: 0
      }
    ]
  },
  {
    id: 103,
    projectCode: 'WDFC-JNPT-REWARI',
    projectName: 'Western Dedicated Freight Corridor (Rewari-Palanpur Section)',
    ministryAgency: 'DFCCIL / Ministry of Railways',
    acquiringAuthority: 'DFCCIL CALA Alwar & Jaipur',
    state: 'Rajasthan',
    districts: ['Alwar', 'Jaipur', 'Sirohi'],
    taluksCount: 11,
    villagesCount: 94,
    landExtent: { privatePattaHa: 1650.0, govtLandHa: 500.0, forestProtectedHa: 0.0, totalHa: 2150.0 },
    totalBudgetCr: 4100.0,
    disbursedBudgetCr: 4100.0,
    acquisitionStage: 'Completed & Commissioned',
    status: 'COMPLETED',
    progressPercentage: 100,
    totalParcels: 2200,
    verifiedParcels: 2200,
    targetCompletionDate: '2026-01-31',
    overallVarianceDays: -18,
    slaCountdownDays: 0,
    description: 'Electrified double-line heavy haul freight corridor connecting Dadri to JNPT Port.',
    notificationDate: '2024-06-01',
    totalAffectedFamilies: 1850,
    rehabilitatedFamilies: 1850,
    milestones: [
      {
        stage: 'SEC_4_NOTIFICATION',
        name: 'Section 4(1) Requisition',
        statutorySlaDays: 60,
        targetDate: '2024-06-01',
        actualDate: '2024-05-25',
        status: 'COMPLETED',
        varianceDays: -7
      },
      {
        stage: 'SEC_19_DECLARATION',
        name: 'Section 19 Final Gazette Notice',
        statutorySlaDays: 365,
        targetDate: '2024-11-01',
        actualDate: '2024-10-20',
        status: 'COMPLETED',
        varianceDays: -11
      },
      {
        stage: 'SEC_25_AWARD',
        name: 'Section 25 Award Declaration',
        statutorySlaDays: 180,
        targetDate: '2025-04-01',
        actualDate: '2025-03-15',
        status: 'COMPLETED',
        varianceDays: -16
      },
      {
        stage: 'SEC_38_POSSESSION',
        name: 'Section 38 Final Possession Handover',
        statutorySlaDays: 60,
        targetDate: '2026-01-31',
        actualDate: '2026-01-15',
        status: 'COMPLETED',
        varianceDays: -16
      }
    ]
  },
  {
    id: 104,
    projectCode: 'NWDA-KEN-BETWA-01',
    projectName: 'Ken-Betwa River Interlinking Project (Daudhan Dam Submergence Zone)',
    ministryAgency: 'NWDA / Ministry of Jal Shakti',
    acquiringAuthority: 'NWDA CALA Chhatarpur & Panna',
    state: 'Madhya Pradesh',
    districts: ['Chhatarpur', 'Panna'],
    taluksCount: 7,
    villagesCount: 54,
    landExtent: { privatePattaHa: 3200.0, govtLandHa: 1800.0, forestProtectedHa: 4000.0, totalHa: 9000.0 },
    totalBudgetCr: 8400.0,
    disbursedBudgetCr: 1850.0,
    acquisitionStage: 'Objection Hearing (Sec 15)',
    status: 'DELAYED',
    progressPercentage: 34,
    totalParcels: 3400,
    verifiedParcels: 1150,
    targetCompletionDate: '2028-06-30',
    overallVarianceDays: +64,
    slaCountdownDays: 18,
    description: 'National river interlinking flagship project transferring surplus water from Ken river to Betwa basin in drought-prone Bundelkhand region.',
    notificationDate: '2025-02-01',
    totalAffectedFamilies: 4200,
    rehabilitatedFamilies: 850,
    milestones: [
      {
        stage: 'SEC_4_NOTIFICATION',
        name: 'Section 4(1) Preliminary Requisition',
        statutorySlaDays: 60,
        targetDate: '2025-02-01',
        actualDate: '2025-02-01',
        status: 'COMPLETED',
        varianceDays: 0
      },
      {
        stage: 'SEC_15_OBJECTIONS',
        name: 'Section 15 Objection Hearings & Forest Clearance',
        statutorySlaDays: 60,
        targetDate: '2025-04-01',
        actualDate: null,
        status: 'CRITICAL_SLA_BREACH',
        varianceDays: +64,
        bottleneckReason: 'Panna Tiger Reserve core forest clearance delay & high volume of Sec 15 tribal R&R land claim hearings.',
        responsibleOfficer: 'District Magistrate Chhatarpur & NGT Committee'
      },
      {
        stage: 'SEC_19_DECLARATION',
        name: 'Section 19 Final Gazette Notice',
        statutorySlaDays: 365,
        targetDate: '2026-02-01',
        actualDate: null,
        status: 'DELAYED',
        varianceDays: +64,
        bottleneckReason: 'Pending resolution of Sec 15 hearings.'
      },
      {
        stage: 'SEC_23_INQUIRY',
        name: 'Section 23 Land Valuation & Solatium Inquiry',
        statutorySlaDays: 180,
        targetDate: '2026-08-01',
        actualDate: null,
        status: 'PENDING',
        varianceDays: 0
      }
    ]
  },
  {
    id: 105,
    projectCode: 'SECI-KHAVDA-SOLAR-02',
    projectName: 'Khavda Ultra Mega Renewable Energy Park (Phase II Grid Connector)',
    ministryAgency: 'SECI / GIPCL / Ministry of New & Renewable Energy',
    acquiringAuthority: 'SECI CALA Kutch',
    state: 'Gujarat',
    districts: ['Kutch'],
    taluksCount: 3,
    villagesCount: 16,
    landExtent: { privatePattaHa: 0.0, govtLandHa: 4500.0, forestProtectedHa: 0.0, totalHa: 4500.0 },
    totalBudgetCr: 1950.0,
    disbursedBudgetCr: 1620.0,
    acquisitionStage: 'Gazette Notice (Sec 19)',
    status: 'ON_TRACK',
    progressPercentage: 84,
    totalParcels: 620,
    verifiedParcels: 600,
    targetCompletionDate: '2026-09-30',
    overallVarianceDays: -8,
    slaCountdownDays: 110,
    description: 'World’s largest 30 GW solar & wind renewable energy hybrid park in Rann of Kutch wasteland.',
    notificationDate: '2025-04-10',
    totalAffectedFamilies: 0,
    rehabilitatedFamilies: 0,
    milestones: [
      {
        stage: 'SEC_4_NOTIFICATION',
        name: 'Section 4(1) Govt Wasteland Requisition',
        statutorySlaDays: 60,
        targetDate: '2025-04-10',
        actualDate: '2025-04-05',
        status: 'COMPLETED',
        varianceDays: -5
      },
      {
        stage: 'SEC_19_DECLARATION',
        name: 'Section 19 Final Gazette Notice',
        statutorySlaDays: 180,
        targetDate: '2025-10-10',
        actualDate: '2025-10-02',
        status: 'COMPLETED',
        varianceDays: -8
      },
      {
        stage: 'SEC_38_POSSESSION',
        name: 'Section 38 Fast-Track Possession',
        statutorySlaDays: 60,
        targetDate: '2026-09-30',
        actualDate: null,
        status: 'ON_TRACK',
        varianceDays: 0
      }
    ]
  },
  {
    id: 106,
    projectCode: 'UPEIDA-GORAKHPUR-LINK',
    projectName: 'Purvanchal Industrial Corridor Feeder Expressway (Gorakhpur Link)',
    ministryAgency: 'UPEIDA / Govt of Uttar Pradesh',
    acquiringAuthority: 'UPEIDA CALA Gorakhpur & Azamgarh',
    state: 'Uttar Pradesh',
    districts: ['Gorakhpur', 'Azamgarh'],
    taluksCount: 5,
    villagesCount: 38,
    landExtent: { privatePattaHa: 980.0, govtLandHa: 140.0, forestProtectedHa: 0.0, totalHa: 1120.0 },
    totalBudgetCr: 2300.0,
    disbursedBudgetCr: 450.0,
    acquisitionStage: 'Proposal (Sec 4)',
    status: 'ON_TRACK',
    progressPercentage: 20,
    totalParcels: 1100,
    verifiedParcels: 350,
    targetCompletionDate: '2027-11-30',
    overallVarianceDays: 0,
    slaCountdownDays: 320,
    description: '4-lane industrial feeder expressway connecting Gorakhpur region to Purvanchal Expressway in Azamgarh district.',
    notificationDate: '2026-02-01',
    totalAffectedFamilies: 880,
    rehabilitatedFamilies: 120,
    milestones: [
      {
        stage: 'SEC_4_NOTIFICATION',
        name: 'Section 4(1) Preliminary Gazette Notification',
        statutorySlaDays: 60,
        targetDate: '2026-02-01',
        actualDate: '2026-02-01',
        status: 'COMPLETED',
        varianceDays: 0,
        gazetteNoticeNo: 'UP-GAZ-2026-0811'
      },
      {
        stage: 'SEC_15_OBJECTIONS',
        name: 'Section 15 Hearing of Objections',
        statutorySlaDays: 60,
        targetDate: '2026-04-01',
        actualDate: null,
        status: 'ON_TRACK',
        varianceDays: 0,
        responsibleOfficer: 'District Magistrate Gorakhpur'
      },
      {
        stage: 'SEC_19_DECLARATION',
        name: 'Section 19 Final Gazette Declaration',
        statutorySlaDays: 365,
        targetDate: '2027-02-01',
        actualDate: null,
        status: 'PENDING',
        varianceDays: 0
      }
    ]
  }
];

export function getAuthenticProjects(): AuthenticProject[] {
  return SEED_PROJECTS;
}

export function getAuthenticProjectById(id: number | string): AuthenticProject | undefined {
  const numId = Number(id);
  return SEED_PROJECTS.find(p => p.id === numId || p.projectCode === id);
}
