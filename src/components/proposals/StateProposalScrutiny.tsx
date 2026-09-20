import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Proposal, ScrutinyChecklist } from '../../types/proposal';
import { updateProposalStatus } from '../../services/proposalService';
import {
  CheckSquare,
  Send,
  HelpCircle,
  XCircle,
  FileText,
  MapPin,
  IndianRupee
} from 'lucide-react';

interface Props {
  proposal: Proposal;
  onRefresh: () => void;
}

export const StateProposalScrutiny: React.FC<Props> = ({ proposal, onRefresh }) => {
  const { user } = useAuth();
  const [checklist, setChecklist] = useState<ScrutinyChecklist>(proposal.scrutinyChecklist || {
    sanctionVerified: false,
    landScheduleVerified: false,
    siaApplicabilityDetermined: false,
    forestClearanceNoted: false,
    remarks: '',
  });

  const [remarks, setRemarks] = useState('');

  const handleToggleChecklist = (key: keyof ScrutinyChecklist) => {
    setChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleActionExecute = (statusAction: 'RECOMMEND' | 'QUERY' | 'REJECT') => {
    if (!remarks && statusAction !== 'RECOMMEND') {
      alert('Please enter statutory remarks/justification before proceeding.');
      return;
    }

    if (statusAction === 'RECOMMEND') {
      updateProposalStatus(
        proposal.id,
        'STATE_RECOMMENDED',
        user?.fullName || 'State Revenue Commissioner',
        'State Revenue Authority',
        'Scrutinized & Recommended to Central Ministry',
        remarks || 'All administrative sanctions and cadastral schedules verified by State Authority.',
        checklist
      );
    } else if (statusAction === 'QUERY') {
      updateProposalStatus(
        proposal.id,
        'QUERY_RAISED',
        user?.fullName || 'State Revenue Scrutiny Officer',
        'State Revenue Authority',
        'Raised Technical Query / Clarification',
        remarks,
        checklist
      );
    } else if (statusAction === 'REJECT') {
      updateProposalStatus(
        proposal.id,
        'REJECTED',
        user?.fullName || 'State Revenue Authority',
        'State Revenue Authority',
        'Rejected Requisition Proposal',
        remarks,
        checklist
      );
    }

    onRefresh();
  };

  const allChecked = checklist.sanctionVerified && checklist.landScheduleVerified && checklist.siaApplicabilityDetermined && checklist.forestClearanceNoted;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-3 border-b border-slate-200 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold text-[#0B3559] bg-blue-50 px-2 py-0.5 border border-blue-200 rounded">
              {proposal.proposalNumber}
            </span>
            <h2 className="text-sm font-bold text-slate-900">{proposal.title}</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Requiring Agency: <strong>{proposal.requiringBody}</strong> • Submitted: {proposal.createdDate}
          </p>
        </div>

        <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded border border-amber-300">
          State Scrutiny Active
        </span>
      </div>

      {/* Grid: Details vs Digital Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 cols: Proposal Details */}
        <div className="lg:col-span-7 space-y-3 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#0B3559]" />
              Land Extent &amp; Geographic Schedule
            </h3>
            <div className="grid grid-cols-2 gap-2 text-slate-700">
              <div>State &amp; Districts: <strong className="text-slate-900">{proposal.state} ({proposal.districts.join(', ')})</strong></div>
              <div>Villages Impacted: <strong className="text-slate-900">{proposal.villagesCount} Villages</strong></div>
              <div>Private Land Extent: <strong className="font-mono text-slate-900">{proposal.landExtent.privateHa} Ha</strong></div>
              <div>Govt / Forest Extent: <strong className="font-mono text-slate-900">{proposal.landExtent.govtHa + proposal.landExtent.forestHa} Ha</strong></div>
              <div className="col-span-2 text-emerald-800 font-bold font-mono">
                Total Land Extent: {proposal.landExtent.totalHa} Hectares
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-[#0B3559]" />
              Financial &amp; Administrative Sanction
            </h3>
            <div className="grid grid-cols-2 gap-2 text-slate-700">
              <div>Sanction Order No: <strong className="font-mono text-slate-900">{proposal.adminSanctionNo}</strong></div>
              <div>Sanction Date: <strong className="font-mono text-slate-900">{proposal.adminSanctionDate}</strong></div>
              <div className="col-span-2 text-slate-900 font-bold font-mono">
                Estimated Compensation Budget: ₹{proposal.budget.totalCostCr} Cr (Land: ₹{proposal.budget.landCostCr} Cr, R&amp;R: ₹{proposal.budget.rrCostCr} Cr)
              </div>
            </div>
          </div>

          {/* Uploaded Documents List */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#0B3559]" />
              Statutory Documents Uploaded
            </h3>
            <div className="space-y-1.5">
              {proposal.documents.map(doc => (
                <div key={doc.id} className="p-2 bg-white border border-slate-200 rounded flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800">{doc.name}</span>
                  <button 
                    onClick={() => alert(`Opening statutory document preview: ${doc.name}`)}
                    className="text-[11px] text-[#0B3559] font-bold hover:underline"
                  >
                    View Document →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 cols: State Digital Scrutiny Checklist */}
        <div className="lg:col-span-5 bg-amber-50/40 border border-amber-200 rounded-lg p-4 space-y-3">
          <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-amber-700" />
            Digital Statutory Scrutiny Checklist
          </h3>
          <p className="text-[11px] text-slate-600">
            Verify parameters under RFCTLARR 2013 rules prior to state recommendation.
          </p>

          <div className="space-y-2 text-xs">
            <label className="flex items-start space-x-2 cursor-pointer p-2 bg-white border border-slate-200 rounded hover:bg-amber-50/50">
              <input
                type="checkbox"
                checked={checklist.sanctionVerified}
                onChange={() => handleToggleChecklist('sanctionVerified')}
                className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="font-bold text-slate-900">Administrative Sanction Verified</span>
                <p className="text-[11px] text-slate-500">Order No &amp; Competent Authority Budget Sanction confirmed</p>
              </div>
            </label>

            <label className="flex items-start space-x-2 cursor-pointer p-2 bg-white border border-slate-200 rounded hover:bg-amber-50/50">
              <input
                type="checkbox"
                checked={checklist.landScheduleVerified}
                onChange={() => handleToggleChecklist('landScheduleVerified')}
                className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="font-bold text-slate-900">Cadastral Land Schedule Verified</span>
                <p className="text-[11px] text-slate-500">Cross-referenced with State Bhulekh / Land Records</p>
              </div>
            </label>

            <label className="flex items-start space-x-2 cursor-pointer p-2 bg-white border border-slate-200 rounded hover:bg-amber-50/50">
              <input
                type="checkbox"
                checked={checklist.siaApplicabilityDetermined}
                onChange={() => handleToggleChecklist('siaApplicabilityDetermined')}
                className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="font-bold text-slate-900">SIA Applicability Determined</span>
                <p className="text-[11px] text-slate-500">Sec 2 Social Impact Assessment / Sec 40 urgency check done</p>
              </div>
            </label>

            <label className="flex items-start space-x-2 cursor-pointer p-2 bg-white border border-slate-200 rounded hover:bg-amber-50/50">
              <input
                type="checkbox"
                checked={checklist.forestClearanceNoted}
                onChange={() => handleToggleChecklist('forestClearanceNoted')}
                className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="font-bold text-slate-900">Forest / Env Clearance Status Noted</span>
                <p className="text-[11px] text-slate-500">{proposal.landExtent.forestHa} Ha Forest Land clearance status evaluated</p>
              </div>
            </label>
          </div>

          <div className="pt-2 border-t border-amber-200">
            <label className="block text-xs font-semibold text-slate-800 mb-1">State Statutory Remarks</label>
            <textarea
              rows={2}
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder="Enter official remarks or recommendations for Central Ministry..."
              className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Action Trigger Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => handleActionExecute('RECOMMEND')}
              disabled={!allChecked}
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-bold text-xs rounded shadow-sm flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Recommend to Central Ministry</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleActionExecute('QUERY')}
                className="py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded transition-colors flex items-center justify-center space-x-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Raise Query</span>
              </button>

              <button
                onClick={() => handleActionExecute('REJECT')}
                className="py-1.5 bg-red-700 hover:bg-red-800 text-white font-semibold text-xs rounded transition-colors flex items-center justify-center space-x-1"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject Requisition</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
