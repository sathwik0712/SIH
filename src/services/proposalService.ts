import { Proposal, ProposalStatus, ScrutinyChecklist, ProposalAuditLog } from '../types/proposal';
import { apiFetch } from '../api/client';

const STORAGE_KEY = 'bhoomisetu_proposals_store_v1';

const initialSeedProposals: Proposal[] = [
  {
    id: 'prop-001',
    proposalNumber: 'REQ/2026/NHAI/089',
    title: 'Delhi-Mumbai Expressway Spur (Gurugram to Dausa Section)',
    projectCategory: 'Highways',
    requiringBody: 'National Highways Authority of India (NHAI)',
    nodalOfficerName: 'Shri Rajesh Sharma, Chief Engineer',
    nodalOfficerContact: 'r.sharma@nhai.org | +91 9876543210',
    state: 'Maharashtra',
    districts: ['Pune', 'Solapur'],
    villagesCount: 14,
    landExtent: { privateHa: 450.0, govtHa: 120.0, forestHa: 30.5, totalHa: 600.5 },
    budget: { landCostCr: 380.0, rrCostCr: 95.0, contingencyCr: 25.0, totalCostCr: 500.0 },
    adminSanctionNo: 'NHAI/HQ/2026/SEC-4/089',
    adminSanctionDate: '2026-02-15',
    status: 'STATE_SCRUTINY',
    documents: [
      { id: 'doc-1', name: 'Detailed_Project_Report_DPR.pdf', type: 'DPR', uploadedAt: '2026-03-01', sizeMb: 14.2, url: '#' },
      { id: 'doc-2', name: 'Preliminary_Alignment_Cadastral_Map.pdf', type: 'ALIGNMENT_MAP', uploadedAt: '2026-03-01', sizeMb: 8.5, url: '#' },
      { id: 'doc-3', name: 'Tentative_Land_Schedule_Villagewise.pdf', type: 'LAND_SCHEDULE', uploadedAt: '2026-03-02', sizeMb: 4.1, url: '#' },
    ],
    scrutinyChecklist: {
      sanctionVerified: true,
      landScheduleVerified: true,
      siaApplicabilityDetermined: false,
      forestClearanceNoted: true,
      remarks: 'Under technical scrutiny by District Collectorate Pune.',
    },
    history: [
      {
        id: 'h-1',
        timestamp: '2026-03-02 10:30 AM',
        actorName: 'Shri Rajesh Sharma',
        actorRole: 'NHAI Nodal Officer',
        action: 'Submitted Requisition Proposal',
        newStatus: 'SUBMITTED',
        remarks: 'Submitted for State Govt Scrutiny under RFCTLARR Section 4.'
      },
      {
        id: 'h-2',
        timestamp: '2026-03-04 02:15 PM',
        actorName: 'State Revenue Department',
        actorRole: 'State Authority',
        action: 'Initiated State Scrutiny & Feasibility Check',
        previousStatus: 'SUBMITTED',
        newStatus: 'STATE_SCRUTINY',
        remarks: 'Assigned to Pune Collectorate for Cadastral verification.'
      }
    ],
    createdDate: '2026-03-02',
    lastUpdated: '2026-03-04',
  },
  {
    id: 'prop-002',
    proposalNumber: 'REQ/2026/DFCCIL/042',
    title: 'Eastern Dedicated Freight Corridor (Varanasi Freight Bypass Section)',
    projectCategory: 'Railways',
    requiringBody: 'Dedicated Freight Corridor Corp. of India (DFCCIL)',
    nodalOfficerName: 'Smt. Ananya Sen, CPM',
    nodalOfficerContact: 'a.sen@dfccil.gov.in | +91 9988776655',
    state: 'Uttar Pradesh',
    districts: ['Varanasi', 'Prayagraj'],
    villagesCount: 22,
    landExtent: { privateHa: 320.0, govtHa: 80.0, forestHa: 0.0, totalHa: 400.0 },
    budget: { landCostCr: 290.0, rrCostCr: 60.0, contingencyCr: 15.0, totalCostCr: 365.0 },
    adminSanctionNo: 'RAIL/DFCCIL/UP/2026/42',
    adminSanctionDate: '2026-01-20',
    status: 'STATE_RECOMMENDED',
    documents: [
      { id: 'doc-4', name: 'DFCCIL_Varanasi_DPR_Final.pdf', type: 'DPR', uploadedAt: '2026-02-10', sizeMb: 18.0, url: '#' },
      { id: 'doc-5', name: 'State_Feasibility_Clearance_UP.pdf', type: 'FEASIBILITY', uploadedAt: '2026-02-28', sizeMb: 2.3, url: '#' },
    ],
    scrutinyChecklist: {
      sanctionVerified: true,
      landScheduleVerified: true,
      siaApplicabilityDetermined: true,
      forestClearanceNoted: true,
      remarks: 'State Govt has completed scrutiny and recommended proposal to Central Ministry.',
      verifiedBy: 'Revenue Commissioner, UP',
      verifiedAt: '2026-03-01'
    },
    history: [
      {
        id: 'h-3',
        timestamp: '2026-02-10 11:00 AM',
        actorName: 'Smt. Ananya Sen',
        actorRole: 'DFCCIL Nodal Officer',
        action: 'Proposal Submitted',
        newStatus: 'SUBMITTED',
      },
      {
        id: 'h-4',
        timestamp: '2026-03-01 04:30 PM',
        actorName: 'Revenue Commissioner, UP',
        actorRole: 'State Authority',
        action: 'Recommended to Central Ministry',
        previousStatus: 'STATE_SCRUTINY',
        newStatus: 'STATE_RECOMMENDED',
        remarks: 'Land schedule and administrative sanction verified. Recommended for final central sanction.'
      }
    ],
    createdDate: '2026-02-10',
    lastUpdated: '2026-03-01',
  },
  {
    id: 'prop-003',
    proposalNumber: 'REQ/2026/SECI/104',
    title: 'Ultra Mega Solar Park Green Energy Corridor',
    projectCategory: 'Energy',
    requiringBody: 'Solar Energy Corporation of India (SECI)',
    nodalOfficerName: 'Dr. K. V. Raman, GM Projects',
    nodalOfficerContact: 'kv.raman@seci.co.in | +91 9443322110',
    state: 'Karnataka',
    districts: ['Tumakuru'],
    villagesCount: 8,
    landExtent: { privateHa: 800.0, govtHa: 400.0, forestHa: 0.0, totalHa: 1200.0 },
    budget: { landCostCr: 450.0, rrCostCr: 40.0, contingencyCr: 20.0, totalCostCr: 510.0 },
    adminSanctionNo: 'MNRE/SECI/KA/2026/104',
    adminSanctionDate: '2026-01-10',
    status: 'CENTRAL_APPROVED',
    documents: [
      { id: 'doc-6', name: 'Solar_Park_DPR_MNRE.pdf', type: 'DPR', uploadedAt: '2026-01-15', sizeMb: 12.0, url: '#' },
      { id: 'doc-7', name: 'Central_Sanction_Letter.pdf', type: 'SANCTION_ORDER', uploadedAt: '2026-02-20', sizeMb: 1.5, url: '#' },
    ],
    scrutinyChecklist: {
      sanctionVerified: true,
      landScheduleVerified: true,
      siaApplicabilityDetermined: true,
      forestClearanceNoted: true,
      remarks: 'Central Ministry has granted Final Sanction. Ready for live project conversion.',
      verifiedBy: 'Joint Secretary, Ministry of Power',
      verifiedAt: '2026-02-20'
    },
    history: [
      {
        id: 'h-5',
        timestamp: '2026-02-20 03:00 PM',
        actorName: 'Joint Secretary, Ministry of New & Renewable Energy',
        actorRole: 'Central Ministry',
        action: 'Granted Central Approval & In-Principle Sanction',
        previousStatus: 'STATE_RECOMMENDED',
        newStatus: 'CENTRAL_APPROVED',
        remarks: 'Sanction ID: MNRE-SANCTION-2026-104 issued. Authorized CALA Tumakuru to proceed.'
      }
    ],
    createdDate: '2026-01-15',
    lastUpdated: '2026-02-20',
  },
  {
    id: 'prop-004',
    proposalNumber: 'REQ/2026/MIDC/015',
    title: 'Pune Ring Road Industrial Logistics Connector',
    projectCategory: 'Industrial',
    requiringBody: 'Maharashtra Industrial Development Corp. (MIDC)',
    nodalOfficerName: 'Shri Vikram Deshmukh, RO Pune',
    nodalOfficerContact: 'v.deshmukh@midc.gov.in | +91 9822110099',
    state: 'Maharashtra',
    districts: ['Pune'],
    villagesCount: 6,
    landExtent: { privateHa: 210.0, govtHa: 40.0, forestHa: 0.0, totalHa: 250.0 },
    budget: { landCostCr: 180.0, rrCostCr: 35.0, contingencyCr: 10.0, totalCostCr: 225.0 },
    adminSanctionNo: 'MIDC/PUNE/2026/015',
    adminSanctionDate: '2026-02-01',
    status: 'QUERY_RAISED',
    documents: [
      { id: 'doc-8', name: 'MIDC_Logistics_DPR.pdf', type: 'DPR', uploadedAt: '2026-02-05', sizeMb: 9.4, url: '#' },
    ],
    scrutinyChecklist: {
      sanctionVerified: true,
      landScheduleVerified: false,
      siaApplicabilityDetermined: false,
      forestClearanceNoted: false,
      remarks: 'Query raised regarding land overlap with State Highway 27 expansion zone.',
    },
    history: [
      {
        id: 'h-6',
        timestamp: '2026-02-25 11:30 AM',
        actorName: 'State Revenue Scrutiny Officer',
        actorRole: 'State Authority',
        action: 'Raised Technical Query',
        previousStatus: 'STATE_SCRUTINY',
        newStatus: 'QUERY_RAISED',
        remarks: 'Cadastral alignment shows overlap with proposed State Highway expansion. Please submit revised alignment map.'
      }
    ],
    createdDate: '2026-02-05',
    lastUpdated: '2026-02-25',
  },
  {
    id: 'prop-005',
    proposalNumber: 'REQ/2026/NHSRCL/007',
    title: 'Mumbai-Ahmedabad High Speed Rail Corridor (Palghar Section)',
    projectCategory: 'Railways',
    requiringBody: 'National High Speed Rail Corp. Ltd. (NHSRCL)',
    nodalOfficerName: 'Shri S. K. Mehta, Project Director',
    nodalOfficerContact: 'sk.mehta@nhsrcl.in | +91 9112233445',
    state: 'Maharashtra',
    districts: ['Thane', 'Palghar'],
    villagesCount: 18,
    landExtent: { privateHa: 310.0, govtHa: 90.0, forestHa: 50.0, totalHa: 450.0 },
    budget: { landCostCr: 650.0, rrCostCr: 120.0, contingencyCr: 40.0, totalCostCr: 810.0 },
    adminSanctionNo: 'NHSRCL/MAH/HSR/2026/07',
    adminSanctionDate: '2025-12-10',
    status: 'CONVERTED_TO_PROJECT',
    documents: [
      { id: 'doc-9', name: 'Bullet_Train_DPR_Palghar.pdf', type: 'DPR', uploadedAt: '2025-12-15', sizeMb: 24.0, url: '#' },
    ],
    scrutinyChecklist: {
      sanctionVerified: true,
      landScheduleVerified: true,
      siaApplicabilityDetermined: true,
      forestClearanceNoted: true,
      remarks: 'Fully approved and inducted as active project in Project Register.',
    },
    history: [
      {
        id: 'h-7',
        timestamp: '2026-01-15 05:00 PM',
        actorName: 'Central Ministry Approval Desk',
        actorRole: 'Central Ministry',
        action: 'Converted to Live Acquisition Project',
        previousStatus: 'CENTRAL_APPROVED',
        newStatus: 'CONVERTED_TO_PROJECT',
        remarks: 'Inducted into Live Project Register. Section 4 Gazette notification ready.'
      }
    ],
    createdDate: '2025-12-15',
    lastUpdated: '2026-01-15',
    convertedProjectId: 101,
  }
];

export function getStoredProposals(): Proposal[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSeedProposals));
    return initialSeedProposals;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse proposals store', e);
    return initialSeedProposals;
  }
}

export function saveStoredProposals(proposals: Proposal[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(proposals));
}

export function getProposalById(id: string): Proposal | undefined {
  const proposals = getStoredProposals();
  return proposals.find(p => p.id === id || p.proposalNumber === id);
}

export function saveNewProposal(newProposalData: Partial<Proposal>, actorName: string, actorRole: string): Proposal {
  const proposals = getStoredProposals();
  const count = proposals.length + 1;
  const proposalNumber = `REQ/2026/${newProposalData.projectCategory?.substring(0, 4).toUpperCase() || 'MISC'}/${String(count).padStart(3, '0')}`;
  
  const created: Proposal = {
    id: `prop-${Date.now()}`,
    proposalNumber,
    title: newProposalData.title || 'Untitled Proposal',
    projectCategory: newProposalData.projectCategory || 'Highways',
    requiringBody: newProposalData.requiringBody || 'Requiring Body',
    nodalOfficerName: newProposalData.nodalOfficerName || actorName,
    nodalOfficerContact: newProposalData.nodalOfficerContact || '',
    state: newProposalData.state || 'Maharashtra',
    districts: newProposalData.districts || ['Pune'],
    villagesCount: newProposalData.villagesCount || 5,
    landExtent: newProposalData.landExtent || { privateHa: 100, govtHa: 20, forestHa: 0, totalHa: 120 },
    budget: newProposalData.budget || { landCostCr: 100, rrCostCr: 20, contingencyCr: 5, totalCostCr: 125 },
    adminSanctionNo: newProposalData.adminSanctionNo || `SANCTION-2026-${count}`,
    adminSanctionDate: newProposalData.adminSanctionDate || new Date().toISOString().split('T')[0],
    status: 'SUBMITTED',
    documents: newProposalData.documents || [
      { id: `doc-${Date.now()}`, name: 'DPR_Submitted.pdf', type: 'DPR', uploadedAt: new Date().toISOString().split('T')[0], sizeMb: 5.0, url: '#' }
    ],
    scrutinyChecklist: {
      sanctionVerified: false,
      landScheduleVerified: false,
      siaApplicabilityDetermined: false,
      forestClearanceNoted: false,
    },
    history: [
      {
        id: `h-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        actorName,
        actorRole,
        action: 'Created & Submitted Requisition Proposal',
        newStatus: 'SUBMITTED',
        remarks: 'Initial requisition submitted with statutory documents.'
      }
    ],
    createdDate: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
  };

  proposals.unshift(created);
  saveStoredProposals(proposals);
  return created;
}

export function updateProposalStatus(
  id: string,
  newStatus: ProposalStatus,
  actorName: string,
  actorRole: string,
  actionText: string,
  remarks?: string,
  checklistUpdates?: Partial<ScrutinyChecklist>
): Proposal | null {
  const proposals = getStoredProposals();
  const idx = proposals.findIndex(p => p.id === id);
  if (idx === -1) return null;

  const target = proposals[idx];
  const previousStatus = target.status;
  target.status = newStatus;
  target.lastUpdated = new Date().toISOString().split('T')[0];

  if (checklistUpdates) {
    target.scrutinyChecklist = {
      ...target.scrutinyChecklist,
      ...checklistUpdates,
      verifiedBy: actorName,
      verifiedAt: new Date().toLocaleDateString(),
    };
  }

  target.history.unshift({
    id: `h-${Date.now()}`,
    timestamp: new Date().toLocaleString(),
    actorName,
    actorRole,
    action: actionText,
    previousStatus,
    newStatus,
    remarks,
  });

  proposals[idx] = target;
  saveStoredProposals(proposals);
  return target;
}
