import React, { useState } from 'react';
import {
  GitMerge, FileText, Search, Megaphone, MessageSquare,
  Scale, IndianRupee, Home, Key, CheckCircle2,
  Clock, AlertTriangle, ChevronRight, Info
} from 'lucide-react';

interface WorkflowStep {
  id: number;
  stage: string;
  section: string;
  title: string;
  description: string;
  deadline: string;
  status: 'COMPLETED' | 'ACTIVE' | 'PENDING' | 'BLOCKED';
  icon: React.ElementType;
  substeps: string[];
  completedOn?: string;
  remarks?: string;
}

const steps: WorkflowStep[] = [
  {
    id: 1,
    stage: 'Stage 1',
    section: 'Sec 4 Requisition',
    title: 'Preliminary Notification & SIA',
    description: 'Acquiring authority submits formal requisition. Government issues preliminary notification. Social Impact Assessment (SIA) study commissioned.',
    deadline: '6 months from notification',
    status: 'COMPLETED',
    icon: FileText,
    substeps: [
      'Requisition letter from acquiring body',
      'Preliminary notification published in Official Gazette',
      'SIA study commissioned (max 6 months)',
      'Gram Sabha / public consultation conducted',
    ],
    completedOn: '14 Nov 2024',
    remarks: 'SIA report submitted. Gram Sabha conducted on 10 Nov 2024.',
  },
  {
    id: 2,
    stage: 'Stage 2',
    section: 'Joint Measurement Survey',
    title: 'Field Survey & Verification',
    description: 'Revenue Inspector and field teams conduct joint measurement. All affected plots surveyed and marked on cadastral maps.',
    deadline: '30 days from Stage 1',
    status: 'COMPLETED',
    icon: Search,
    substeps: [
      'Tehsildar issues field survey notification',
      'Joint measurement survey by Revenue Inspector',
      'Cadastral map update and plot marking',
      'Survey number-wise affected family enumeration',
    ],
    completedOn: '28 Jan 2025',
    remarks: '143 parcels surveyed across 3 villages.',
  },
  {
    id: 3,
    stage: 'Stage 3',
    section: 'Sec 11(1) Gazette',
    title: 'Gazette Notification (Sec 11)',
    description: 'Collector publishes Gazette notification declaring land intended for acquisition. All landowners notified individually.',
    deadline: 'Post SIA Approval',
    status: 'COMPLETED',
    icon: Megaphone,
    substeps: [
      'Draft notification prepared by Collector',
      'State Government approval obtained',
      'Publication in Official Gazette (Sec 11)',
      'Individual notices served to all landowners',
    ],
    completedOn: '15 Mar 2025',
    remarks: 'Gazette No. MH/2025/0342. 218 notices served.',
  },
  {
    id: 4,
    stage: 'Stage 4',
    section: 'Sec 15 Hearing',
    title: 'Objection Filing & Hearing',
    description: 'Affected persons may file objections before Collector within 60 days. SLEC Collector conducts formal hearing.',
    deadline: '60 days from Sec 11 notice',
    status: 'ACTIVE',
    icon: MessageSquare,
    substeps: [
      'Objection window opens (60-day period)',
      'Collection and registration of written objections',
      'Hearing conducted by Collector (Sec 15)',
      "Collector's report submitted to Government",
    ],
    remarks: '12 objections filed. 3 hearings scheduled.',
  },
  {
    id: 5,
    stage: 'Stage 5',
    section: 'Sec 19 Declaration',
    title: 'Final Declaration (Sec 19)',
    description: 'Government issues final declaration after considering objections and SLEC report. This is conclusive.',
    deadline: '12 months from Sec 11',
    status: 'PENDING',
    icon: Scale,
    substeps: [
      'SLEC report reviewed by Government',
      'Final declaration under Sec 19 published',
      'No challenge to final declaration in court during acquisition',
    ],
  },
  {
    id: 6,
    stage: 'Stage 6',
    section: 'Sec 23/30 Award',
    title: 'Award Inquiry & Determination',
    description: 'Collector conducts Award Inquiry. Market value determined as per Sec 26. Solatium (100%) added. Award declared.',
    deadline: '12 months from Sec 19',
    status: 'PENDING',
    icon: Scale,
    substeps: [
      'Award Inquiry notice issued to affected persons',
      'Market value determined (Sec 26)',
      '100% solatium added (Sec 30)',
      'Annuity component (12% for 20 years) applied if applicable',
      'Award declared and communicated',
    ],
  },
  {
    id: 7,
    stage: 'Stage 7',
    section: 'PFMS Disbursal',
    title: 'Compensation Disbursal via PFMS',
    description: 'Compensation amount transferred directly to beneficiary bank accounts via Public Financial Management System (PFMS).',
    deadline: '3 months from Award',
    status: 'PENDING',
    icon: IndianRupee,
    substeps: [
      'Beneficiary bank account validation (Sec 77)',
      'PFMS payment order initiated',
      'DBT transfer executed',
      'UTR receipt and payment confirmation',
    ],
  },
  {
    id: 8,
    stage: 'Stage 8',
    section: 'Sec 31 R&R',
    title: 'R&R Benefits Execution',
    description: 'Rehabilitation & Resettlement benefits provided as per Third Schedule. Includes house plots, employment, and training.',
    deadline: 'Before possession',
    status: 'PENDING',
    icon: Home,
    substeps: [
      'R&R plan approved and R&R Committee constituted',
      'House plots allotted in resettlement colony',
      'Employment or one-time annuity provided',
      'School, hospital, road in resettlement site verified',
    ],
  },
  {
    id: 9,
    stage: 'Stage 9',
    section: 'Sec 38 Possession',
    title: 'Physical Possession Handover',
    description: 'Collector takes physical possession of land after compensation and R&R are completed. Panchnama executed.',
    deadline: 'After R&R completion',
    status: 'PENDING',
    icon: Key,
    substeps: [
      'Panchnama drawn in presence of two witnesses',
      'Physical demarcation and fencing',
      'Possession certificate issued to acquiring body',
      'Revenue records mutation initiated',
    ],
  },
  {
    id: 10,
    stage: 'Stage 10',
    section: 'Revenue Mutation',
    title: 'Revenue Mutation & Closure',
    description: 'Revenue records updated. Land transferred in Government name. Project closure report submitted.',
    deadline: '90 days from possession',
    status: 'PENDING',
    icon: CheckCircle2,
    substeps: [
      'Application for mutation filed with Revenue Office',
      '7/12 extract updated with new land holder',
      'Project closure MIS report generated',
      'Records archived in NIC repository',
    ],
  },
];

const statusConfig = {
  COMPLETED: { bg: 'bg-emerald-600', text: 'text-emerald-700', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', label: 'Completed' },
  ACTIVE:    { bg: 'bg-amber-500',   text: 'text-amber-700',   badge: 'bg-amber-50 text-amber-800 border-amber-300',   label: 'In Progress' },
  PENDING:   { bg: 'bg-slate-300',   text: 'text-slate-500',   badge: 'bg-slate-50 text-slate-600 border-slate-200',   label: 'Upcoming' },
  BLOCKED:   { bg: 'bg-red-500',     text: 'text-red-700',     badge: 'bg-red-50 text-red-800 border-red-200',         label: 'Blocked' },
};

export const AcquisitionWorkflowPage: React.FC = () => {
  const [expanded, setExpanded] = useState<number | null>(4);
  const [showObjectionModal, setShowObjectionModal] = useState(false);
  const [objectionStatus, setObjectionStatus] = useState<'IDLE' | 'SUBMITTING' | 'SUCCESS'>('IDLE');
  const [objectionRef, setObjectionRef] = useState('');

  const completedCount = steps.filter(s => s.status === 'COMPLETED').length;
  const activeStep = steps.find(s => s.status === 'ACTIVE');

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#0B3559] rounded flex items-center justify-center">
              <GitMerge className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-[#0B3559]">Acquisition Workflow — RFCTLARR Act, 2013</h1>
              <p className="text-xs text-slate-500">Step-by-step statutory process from Sec 4 Requisition to Revenue Mutation</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-1 rounded">
              {completedCount} / {steps.length} Stages Complete
            </span>
            {activeStep && (
              <span className="text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300 px-2 py-1 rounded flex items-center gap-1">
                <Clock className="w-3 h-3" /> Active: {activeStep.title}
              </span>
            )}
            <button
              onClick={() => setShowObjectionModal(true)}
              className="px-3 py-1.5 bg-[#0B3559] hover:bg-[#071E3D] text-white rounded text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 ml-2"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              File Sec 15 Objection
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-[11px] text-slate-500 mb-1">
            <span>Overall Progress</span>
            <span className="font-mono font-bold">{Math.round((completedCount / steps.length) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-2 bg-gradient-to-r from-[#0B3559] to-emerald-600 rounded-full transition-all"
              style={{ width: `${(completedCount / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Stages Completed', val: `${completedCount}`, sub: 'of 10 total', color: 'border-l-emerald-600' },
          { label: 'Active Stage', val: 'Stage 4', sub: 'Sec 15 Hearing', color: 'border-l-amber-500' },
          { label: 'Days Elapsed', val: '312', sub: 'Since Sec 4 notification', color: 'border-l-[#0B3559]' },
          { label: 'Objections Pending', val: '12', sub: '3 hearings due', color: 'border-l-red-500' },
        ].map(k => (
          <div key={k.label} className={`bg-white border border-slate-200 border-l-4 ${k.color} rounded p-3 shadow-sm`}>
            <div className="text-[11px] text-slate-500 font-medium">{k.label}</div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">{k.val}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {steps.map((step, idx) => {
          const cfg = statusConfig[step.status];
          const Icon = step.icon;
          const isExpanded = expanded === step.id;
          const isLast = idx === steps.length - 1;

          return (
            <div key={step.id} className="flex gap-3">
              {/* Timeline column */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                  step.status === 'COMPLETED' ? 'bg-emerald-600 border-emerald-600' :
                  step.status === 'ACTIVE'    ? 'bg-amber-500 border-amber-500 ring-4 ring-amber-100' :
                  'bg-white border-slate-300'
                }`}>
                  {step.status === 'COMPLETED' ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : step.status === 'ACTIVE' ? (
                    <Clock className="w-4 h-4 text-white" />
                  ) : (
                    <span className="text-xs font-bold text-slate-400">{step.id}</span>
                  )}
                </div>
                {!isLast && <div className="w-0.5 flex-1 bg-slate-200 mt-1 min-h-[12px]" />}
              </div>

              {/* Card */}
              <div className="flex-1 mb-2">
                <button
                  onClick={() => setExpanded(isExpanded ? null : step.id)}
                  className="w-full text-left bg-white border border-slate-200 rounded shadow-sm hover:border-slate-300 transition-colors"
                >
                  <div className="p-3.5 flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded flex items-center justify-center flex-shrink-0 ${
                        step.status === 'COMPLETED' ? 'bg-emerald-50' :
                        step.status === 'ACTIVE'    ? 'bg-amber-50' : 'bg-slate-100'
                      }`}>
                        <Icon className={`w-3.5 h-3.5 ${cfg.text}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-mono text-slate-500">{step.stage} · {step.section}</span>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${cfg.badge}`}>
                            {cfg.label}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mt-0.5">{step.title}</h3>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">{step.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[11px] text-slate-400 hidden sm:block">{step.deadline}</span>
                      <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="bg-slate-50 border border-t-0 border-slate-200 rounded-b p-4 space-y-3">
                    <p className="text-xs text-slate-700">{step.description}</p>

                    <div>
                      <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Sub-Steps</h4>
                      <div className="space-y-1.5">
                        {step.substeps.map((sub, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              step.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                              step.status === 'ACTIVE' && i <= 1 ? 'bg-amber-100 text-amber-700' :
                              'bg-slate-200 text-slate-400'
                            }`}>
                              {step.status === 'COMPLETED' ? (
                                <CheckCircle2 className="w-2.5 h-2.5" />
                              ) : (
                                <span className="text-[10px] font-bold">{i + 1}</span>
                              )}
                            </div>
                            <span>{sub}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                      <div>
                        <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Statutory Deadline</span>
                        <p className="text-xs text-slate-800 mt-0.5 font-medium">{step.deadline}</p>
                      </div>
                      {step.completedOn && (
                        <div>
                          <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">Completed On</span>
                          <p className="text-xs text-slate-800 mt-0.5 font-medium">{step.completedOn}</p>
                        </div>
                      )}
                      {step.remarks && (
                        <div className="sm:col-span-2">
                          <div className="flex items-center gap-1 mb-1">
                            <Info className="w-3 h-3 text-blue-600" />
                            <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">Remarks</span>
                          </div>
                          <p className="text-xs text-slate-700 bg-blue-50 border border-blue-100 rounded px-2 py-1.5">{step.remarks}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Statutory note */}
      <div className="bg-amber-50 border border-amber-200 rounded p-3 flex items-start gap-2 text-xs text-amber-800">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
        <span>
          <strong>Statutory Note:</strong> As per RFCTLARR Act 2013, if the acquiring authority fails to take possession within 5 years from the date of award, the acquisition lapses. Physical possession should be completed before the limitation period expires.
        </span>
      </div>

      {/* Objection Modal */}
      {showObjectionModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            {objectionStatus === 'SUCCESS' ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800 mb-1">Objection Submitted</h3>
                <p className="text-sm text-slate-600 mb-4">Your objection has been filed successfully.</p>
                <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-6 inline-block">
                  <span className="text-xs text-slate-500 block">Reference ID</span>
                  <span className="font-mono font-bold text-lg text-[#0B3559]">{objectionRef}</span>
                </div>
                <button onClick={() => { setShowObjectionModal(false); setObjectionStatus('IDLE'); }} className="w-full px-4 py-2 bg-[#0B3559] text-white rounded text-sm font-semibold">Done</button>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-[#0B3559] mb-4">File Section 15 Objection</h3>
                <form onSubmit={e => {
                  e.preventDefault();
                  setObjectionStatus('SUBMITTING');
                  setTimeout(() => {
                    setObjectionRef('OBJ-' + Math.floor(1000 + Math.random() * 9000));
                    setObjectionStatus('SUCCESS');
                  }, 1500);
                }} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Project Requisition / Notice No.</label>
                    <input required className="w-full px-3 py-2 border border-slate-300 rounded text-xs" placeholder="e.g. NH65-HYD-PUN-01" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Survey / Gat Number</label>
                    <input required className="w-full px-3 py-2 border border-slate-300 rounded text-xs" placeholder="e.g. 142/1A" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Grounds of Objection</label>
                    <textarea required rows={4} className="w-full px-3 py-2 border border-slate-300 rounded text-xs" placeholder="Describe your objection clearly..." />
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                    <button type="button" onClick={() => setShowObjectionModal(false)} className="px-4 py-2 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
                    <button type="submit" disabled={objectionStatus === 'SUBMITTING'} className="px-4 py-2 bg-[#0B3559] hover:bg-[#071E3D] text-white rounded text-xs font-semibold shadow-sm flex items-center justify-center w-32">
                      {objectionStatus === 'SUBMITTING' ? 'Submitting...' : 'Submit'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AcquisitionWorkflowPage;
