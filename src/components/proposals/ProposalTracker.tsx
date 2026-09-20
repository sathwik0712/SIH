import React, { useState } from 'react';
import { Proposal, ProposalStatus } from '../../types/proposal';
import {
  Download,
  History,
  X
} from 'lucide-react';

interface Props {
  proposal: Proposal;
}

export const ProposalTracker: React.FC<Props> = ({ proposal }) => {
  const [showAuditModal, setShowAuditModal] = useState(false);

  const getStageIndex = (status: ProposalStatus): number => {
    switch (status) {
      case 'DRAFT': return 0;
      case 'SUBMITTED': return 1;
      case 'STATE_SCRUTINY': return 2;
      case 'QUERY_RAISED': return 2;
      case 'STATE_RECOMMENDED': return 3;
      case 'CENTRAL_APPROVED': return 4;
      case 'CONVERTED_TO_PROJECT': return 5;
      case 'REJECTED': return -1;
      default: return 1;
    }
  };

  const currentIndex = getStageIndex(proposal.status);

  const timelineSteps = [
    { label: 'Requisition Drafted', sub: 'Requiring Body' },
    { label: 'Submitted (Form A)', sub: 'Statutory Portal' },
    { label: 'State Scrutiny', sub: 'Revenue Dept' },
    { label: 'State Recommended', sub: 'State Govt Sign-off' },
    { label: 'Central Sanction', sub: 'Ministry In-Principle' },
    { label: 'Project Inducted', sub: 'Sec 4 Gazette Ready' },
  ];

  const handleDownloadAckSlip = () => {
    alert(`Downloading Requisition Acknowledgment Slip (PDF) for Tracking No: ${proposal.proposalNumber}`);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-3 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold text-[#0B3559] bg-blue-50 px-2.5 py-0.5 border border-blue-200 rounded">
              {proposal.proposalNumber}
            </span>
            <h2 className="text-sm font-bold text-slate-900">{proposal.title}</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Requiring Body: <strong>{proposal.requiringBody}</strong> • Submitted Date: {proposal.createdDate}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAuditModal(true)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded flex items-center space-x-1.5 transition-colors"
          >
            <History className="w-3.5 h-3.5 text-slate-600" />
            <span>Audit Trail ({proposal.history.length})</span>
          </button>

          <button
            onClick={handleDownloadAckSlip}
            className="px-3 py-1.5 bg-[#0B3559] hover:bg-[#071E3D] text-white text-xs font-semibold rounded flex items-center space-x-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Acknowledgment Slip PDF</span>
          </button>
        </div>
      </div>

      {/* Horizontal Lifecycle Stepper */}
      <div className="py-2">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
          Statutory Lifecycle Progression
        </h3>

        <div className="relative flex justify-between items-center">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -z-0 transform -translate-y-1/2" />
          {timelineSteps.map((step, idx) => {
            const isCompleted = currentIndex >= idx;
            const isCurrent = currentIndex === idx;

            return (
              <div key={step.label} className="relative z-10 flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                  proposal.status === 'REJECTED' ? 'bg-red-600 text-white' :
                  isCurrent ? 'bg-amber-500 text-slate-900 ring-4 ring-amber-100' :
                  isCompleted ? 'bg-emerald-600 text-white' :
                  'bg-slate-200 text-slate-500'
                }`}>
                  {isCompleted ? '✓' : idx + 1}
                </div>

                <div className="text-center mt-2">
                  <span className={`block text-xs font-bold ${isCurrent ? 'text-[#0B3559]' : 'text-slate-800'}`}>
                    {step.label}
                  </span>
                  <span className="block text-[10px] text-slate-500">
                    {step.sub}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-2">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
          <span className="text-slate-500 font-semibold block text-[11px]">Land Schedule Breakdown</span>
          <div className="font-mono text-slate-900 font-bold">
            Total: {proposal.landExtent.totalHa} Ha
          </div>
          <p className="text-[11px] text-slate-600">
            Private: {proposal.landExtent.privateHa} Ha • Govt: {proposal.landExtent.govtHa} Ha • Forest: {proposal.landExtent.forestHa} Ha
          </p>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
          <span className="text-slate-500 font-semibold block text-[11px]">Financial Sanction Budget</span>
          <div className="font-mono text-slate-900 font-bold">
            Total Cost: ₹{proposal.budget.totalCostCr} Cr
          </div>
          <p className="text-[11px] text-slate-600">
            Land Cost: ₹{proposal.budget.landCostCr} Cr • R&amp;R: ₹{proposal.budget.rrCostCr} Cr
          </p>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
          <span className="text-slate-500 font-semibold block text-[11px]">Administrative Sanction</span>
          <div className="font-mono text-slate-900 font-bold">
            {proposal.adminSanctionNo}
          </div>
          <p className="text-[11px] text-slate-600">
            Dated: {proposal.adminSanctionDate}
          </p>
        </div>
      </div>

      {/* AUDIT TRAIL MODAL */}
      {showAuditModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-[#0B3559]" />
                <h3 className="text-sm font-bold text-slate-900">
                  Proposal Audit Trail History ({proposal.proposalNumber})
                </h3>
              </div>
              <button 
                onClick={() => setShowAuditModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1 text-xs">
              {proposal.history.map(item => (
                <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{item.action}</span>
                    <span className="font-mono text-[11px] text-slate-500">{item.timestamp}</span>
                  </div>
                  <div className="text-slate-600">
                    Actor: <strong className="text-slate-800">{item.actorName}</strong> ({item.actorRole})
                  </div>
                  {item.remarks && (
                    <p className="text-slate-700 italic bg-white p-2 border border-slate-200 rounded mt-1">
                      "{item.remarks}"
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowAuditModal(false)}
                className="px-4 py-2 bg-slate-800 text-white font-semibold text-xs rounded hover:bg-slate-900"
              >
                Close Audit Trail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
