import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AcquisitionStage } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { WorkflowTimeline, STAGES_CONFIG } from '../components/common/WorkflowTimeline';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  GitMerge, CheckCircle2, Clock, AlertTriangle, 
  ArrowRight, ShieldCheck, FileCheck, ExternalLink, Award, Banknote 
} from 'lucide-react';

interface WorkflowPageProps {
  onNavigate: (module: string, projectId?: string) => void;
}

export const WorkflowPage: React.FC<WorkflowPageProps> = ({ onNavigate }) => {
  const { projects, selectedProject, setSelectedProjectId, advanceProjectStage } = useApp();

  const activeProject = selectedProject || projects[0];
  const [activeStage, setActiveStage] = useState<AcquisitionStage>(activeProject.currentStage);

  const stageData = [
    {
      stage: 1,
      title: 'Project Proposal & Social Impact Assessment (SIA)',
      actSection: 'Section 4(1) & 7(1) RFCTLARR Act, 2013',
      description: 'Acquiring body submits detailed project proposal and Social Impact Assessment (SIA) study. Multi-disciplinary expert committee reviews public purpose, environmental impact, and livelihood displacement.',
      mandatoryChecklist: [
        { label: 'Detailed Project Report (DPR) approved by Competent Authority', done: activeStage >= 1 },
        { label: 'Social Impact Assessment (SIA) agency appointed via tender', done: activeStage >= 1 },
        { label: 'Public hearing conducted in all affected Gram Panchayats', done: activeStage >= 1 },
        { label: 'Independent Expert Group clearance report submitted to State Government', done: activeStage >= 1 },
      ],
      responsibleOfficer: 'SIA Commissioner & Acquiring Authority',
    },
    {
      stage: 2,
      title: 'Land Identification & Cadastral Mapping',
      actSection: 'Cadastral GIS Integration',
      description: 'Identification of exact survey numbers, khasra numbers, and land parcels required for project footprint. Cross-matching with digital state land records (Bhulekh / Dharani).',
      mandatoryChecklist: [
        { label: 'Cadastral overlay created on GIS Bhuvan portal', done: activeStage >= 2 },
        { label: 'Survey numbers and land area verified with Tehsil Record of Rights (RoR)', done: activeStage >= 2 },
        { label: 'Government revenue land vs private freehold land demarcated', done: activeStage >= 2 },
        { label: 'No-objection certificate obtained for forest / tribal / sensitive lands', done: activeStage >= 2 },
      ],
      responsibleOfficer: 'Superintendent of Land Records (SLR) & CALA',
    },
    {
      stage: 3,
      title: 'Ground Field Verification & DGPS Survey',
      actSection: 'Field Revenue Inspection',
      description: 'Revenue Inspector / Talathi conducts physical on-ground survey with DGPS instruments, confirms actual boundaries, verifies landowner identity, and enumerates trees, structures, and tubewells.',
      mandatoryChecklist: [
        { label: 'On-site DGPS ground survey completed for 100% of affected parcels', done: activeStage >= 3 },
        { label: 'Asset census: Valuation of standing trees, crops, and built structures', done: activeStage >= 3 },
        { label: 'Aadhaar and bank account passbook details collected for landowners', done: activeStage >= 3 },
        { label: 'Joint Field Verification Report signed by Circle Inspector & CALA', done: activeStage >= 3 },
      ],
      responsibleOfficer: 'Circle Revenue Inspector & Naib Tehsildar',
    },
    {
      stage: 4,
      title: 'Statutory Preliminary Notification',
      actSection: 'Section 11(1) RFCTLARR Act',
      description: 'State / Central Government publishes preliminary notification in Official Gazette, two daily newspapers, and local Gram Panchayat offices declaring intention to acquire specified land.',
      mandatoryChecklist: [
        { label: 'Gazette Extra-Ordinary publication reference generated', done: activeStage >= 4 },
        { label: 'Publication in two daily newspapers (one in local regional language)', done: activeStage >= 4 },
        { label: 'Public notice affixed at Gram Panchayat and Collectorate notice boards', done: activeStage >= 4 },
        { label: 'Bar on transaction / sale / encumbrance activated on land records', done: activeStage >= 4 },
      ],
      responsibleOfficer: 'District Collector & Competent Authority (CALA)',
    },
    {
      stage: 5,
      title: 'Hearing of Claims & Objections',
      actSection: 'Section 15 RFCTLARR Act',
      description: '60-day statutory window for interested persons to submit objections regarding public purpose, area measurements, or circle rates. Formal hearing before Collector with reasoned orders.',
      mandatoryChecklist: [
        { label: '60-day objection window opened from date of Section 11 publication', done: activeStage >= 5 },
        { label: 'Personal hearing notices served to all objecting landowners', done: activeStage >= 5 },
        { label: 'Collector / CALA passed written speaking orders on each objection', done: activeStage >= 5 },
        { label: 'Report on objections submitted to State Government for final declaration', done: activeStage >= 5 },
      ],
      responsibleOfficer: 'Collector & District Magistrate / CALA',
    },
    {
      stage: 6,
      title: 'Statutory Award Enquiry & Determination',
      actSection: 'Section 23 & 30 RFCTLARR Act',
      description: 'Determination of market value based on higher of circle rate or registered sale deeds. Statutory addition of 100% Solatium and 12% additional interest per annum.',
      mandatoryChecklist: [
        { label: 'Section 19(1) Final Declaration published within 12 months of Section 11', done: activeStage >= 6 },
        { label: 'Basic market value computed as per Section 26 rules', done: activeStage >= 6 },
        { label: '100% Solatium added to determined market value (Section 30(1))', done: activeStage >= 6 },
        { label: '12% p.a. additional interest computed from Sec 11 notification date', done: activeStage >= 6 },
        { label: 'Final Award Order signed and sealed by District Collector', done: activeStage >= 6 },
      ],
      responsibleOfficer: 'Collector & Competent Authority (CALA)',
    },
    {
      stage: 7,
      title: 'Compensation Disbursement via PFMS DBT',
      actSection: 'PFMS Direct Benefit Transfer & Section 76 Escrow',
      description: 'Full statutory compensation credited directly into verified bank accounts of beneficiaries via PFMS e-Kuber gateway. Disputed/litigated shares deposited into Civil Court Escrow.',
      mandatoryChecklist: [
        { label: 'Electronic Payment Advice (EPA) generated on PFMS portal', done: activeStage >= 7 },
        { label: 'Aadhaar-linked DBT credit confirmed with bank transaction UTR numbers', done: activeStage >= 7 },
        { label: 'Court escrow deposit receipts obtained for litigated parcels (Sec 76)', done: activeStage >= 7 },
        { label: '100% compensation deposited prior to taking physical possession', done: activeStage >= 7 },
      ],
      responsibleOfficer: 'Treasury Officer & Project Director',
    },
    {
      stage: 8,
      title: 'Resettlement & Rehabilitation (R&R) Implementation',
      actSection: 'Section 31 & Second Schedule RFCTLARR Act',
      description: 'Execution of R&R scheme: Allotment of constructed housing units in resettlement colonies, ₹50,000 subsistence allowance, mandatory annuity/employment options, and skill grants.',
      mandatoryChecklist: [
        { label: 'R&R Administrator appointed and baseline family census finalized', done: activeStage >= 8 },
        { label: 'Housing plots/units constructed and allotted in R&R township', done: activeStage >= 8 },
        { label: 'One-time resettlement subsistence allowance disbursed', done: activeStage >= 8 },
        { label: 'Annuity / Livelihood employment orders issued to eligible families', done: activeStage >= 8 },
      ],
      responsibleOfficer: 'Commissioner for Resettlement & Rehabilitation (R&R)',
    },
    {
      stage: 9,
      title: 'Physical Possession & Panchnama Handover',
      actSection: 'Section 16 & 17 (Urgency Clause)',
      description: 'Formal physical possession executed on site in presence of Panch witnesses. Panchnama drawn up, geo-tagged photos captured, and land handed over encumbrance-free to acquiring agency.',
      mandatoryChecklist: [
        { label: 'Formal possession date scheduled with public intimation', done: activeStage >= 9 },
        { label: 'Joint site inspection by Revenue Officer and Acquiring Agency Engineer', done: activeStage >= 9 },
        { label: 'Panchnama executed in presence of 2 independent local witnesses', done: activeStage >= 9 },
        { label: 'Geo-tagged boundary stones installed and handed over to Agency', done: activeStage >= 9 },
      ],
      responsibleOfficer: 'Tehsildar & Project Director (NHAI/DFCCIL)',
    },
    {
      stage: 10,
      title: 'Project Closure & Mutation in Revenue Records',
      actSection: 'Mutation & Encumbrance-Free Certificate',
      description: 'Final statutory audit, updating of government Record of Rights (RoR) in favor of the acquiring department, issuance of Encumbrance-Free Certificate, and project closure.',
      mandatoryChecklist: [
        { label: 'Revenue mutation entry (Ferfar / Namantaran) updated in Land Records', done: activeStage >= 10 },
        { label: 'Final financial audit of compensation and R&R expenditures completed', done: activeStage >= 10 },
        { label: 'Encumbrance-Free Certificate issued by District Collector', done: activeStage >= 10 },
        { label: 'Project archived in National Land Acquisition Repository', done: activeStage >= 10 },
      ],
      responsibleOfficer: 'District Collector & Ministry Joint Secretary',
    },
  ];

  const currentStageInfo = stageData[activeStage - 1];

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Statutory Acquisition Lifecycle' }]} />

      {/* Header & Project Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gov-gray-300 pb-3">
        <div>
          <h2 className="text-xl font-bold text-gov-navy font-serif flex items-center gap-2">
            <GitMerge className="w-5 h-5 text-amber-500" />
            <span>RFCTLARR 10-Stage Statutory Acquisition Engine</span>
          </h2>
          <p className="text-xs text-gov-gray-600">
            End-to-end statutory stage advancing, mandatory checklists, and milestone sign-offs under RFCTLARR Act, 2013
          </p>
        </div>

        {/* Project Selector */}
        <label className="flex items-center gap-1.5 text-xs text-gov-gray-700 bg-white px-3 py-1.5 border border-gov-gray-300 rounded shadow-2xs">
          <span className="font-bold text-gov-navy">Active Project:</span>
          <select
            value={activeProject.id}
            onChange={(e) => {
              setSelectedProjectId(e.target.value);
              const p = projects.find(proj => proj.id === e.target.value);
              if (p) setActiveStage(p.currentStage);
            }}
            className="text-xs font-semibold text-gov-gray-900 bg-transparent focus:outline-none max-w-sm"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} — {p.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Interactive Horizontal Timeline */}
      <WorkflowTimeline
        currentStage={activeProject.currentStage}
        activeSelectedStage={activeStage}
        onSelectStage={(s) => setActiveStage(s)}
      />

      {/* Stage Detail Workspace */}
      <div className="bg-white border border-gov-gray-300 rounded p-4 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gov-gray-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold text-xs">
                Stage {activeStage} of 10
              </span>
              <span className="font-mono text-xs text-gov-gray-600">
                {currentStageInfo.actSection}
              </span>
            </div>
            <h3 className="text-base font-bold text-gov-navy font-serif">
              {currentStageInfo.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {activeProject.currentStage === activeStage && activeStage < 10 ? (
              <button
                onClick={() => {
                  advanceProjectStage(activeProject.id, (activeStage + 1) as AcquisitionStage);
                  setActiveStage((activeStage + 1) as AcquisitionStage);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-gov-navy text-white text-xs font-bold rounded hover:bg-gov-navy-hover transition-colors shadow-xs"
              >
                <span>Complete Stage {activeStage} & Advance</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            ) : activeStage < activeProject.currentStage ? (
              <span className="px-3 py-1.5 bg-emerald-100 text-emerald-900 rounded font-bold text-xs border border-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Stage Completed & Verified</span>
              </span>
            ) : (
              <span className="px-3 py-1.5 bg-gov-gray-100 text-gov-gray-600 rounded font-medium text-xs border border-gov-gray-300">
                Upcoming Statutory Milestone
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-gov-gray-700 leading-relaxed bg-gov-gray-50 p-3 rounded border border-gov-gray-200">
          {currentStageInfo.description}
        </p>

        {/* Statutory Checklist */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gov-navy uppercase tracking-wider font-serif">
            Mandatory Statutory Compliance Checklist ({currentStageInfo.mandatoryChecklist.filter(c => c.done).length} / {currentStageInfo.mandatoryChecklist.length} Cleared)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
            {currentStageInfo.mandatoryChecklist.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded border flex items-center justify-between gap-3 ${
                  item.done
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                    : 'bg-white border-gov-gray-300 text-gov-gray-700'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="font-bold text-gov-gray-400 text-xs mt-0.5">{idx + 1}.</span>
                  <span className="font-medium">{item.label}</span>
                </div>
                <div className="flex-shrink-0">
                  {item.done ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Complied</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] text-amber-700 font-medium">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Pending</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Responsible Authority Box */}
        <div className="p-3 bg-blue-50/50 rounded border border-blue-200 text-xs flex items-center justify-between text-gov-gray-700">
          <div>
            <span className="font-bold text-gov-navy">Statutory Competent Authority: </span>
            <span>{currentStageInfo.responsibleOfficer}</span>
          </div>
          <div className="text-[11px] text-gov-gray-500">
            Governing Statute: RFCTLARR Act, 2013
          </div>
        </div>
      </div>
    </div>
  );
};
