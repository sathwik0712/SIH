import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Proposal } from '../../types/proposal';
import { updateProposalStatus } from '../../services/proposalService';
import { apiFetch } from '../../api/client';
import { getRoleConfig } from '../../config/roleConfig';
import {
  Globe,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  proposal: Proposal;
  onRefresh: () => void;
}

export const MinistryProposalApproval: React.FC<Props> = ({ proposal, onRefresh }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [remarks, setRemarks] = useState('');
  const [isConverting, setIsConverting] = useState(false);

  // Derive granular permissions from role config — no blanket superuser checks here.
  const roleConfig = getRoleConfig(user?.role);
  const canApprove = roleConfig.permissions.canApproveProposals;
  const canCreateProject = roleConfig.permissions.canCreateProject;

  const handleApproveCentralSanction = () => {
    if (!canApprove) return;
    updateProposalStatus(
      proposal.id,
      'CENTRAL_APPROVED',
      user?.fullName || 'Joint Secretary, Central Ministry',
      'Central Ministry',
      'Granted Central Approval & In-Principle Sanction',
      remarks || 'State scrutiny recommendations verified. In-Principle National Sanction Granted.'
    );
    onRefresh();
  };

  const handleRejectCentral = () => {
    if (!canApprove) return;
    if (!remarks) {
      alert('Please provide official rejection remarks.');
      return;
    }
    updateProposalStatus(
      proposal.id,
      'REJECTED',
      user?.fullName || 'Central Ministry',
      'Central Ministry',
      'Rejected Requisition Proposal',
      remarks
    );
    onRefresh();
  };

  const handleConvertToLiveProject = () => {
    // Guard: only roles with canCreateProject can induct a proposal as a live project.
    if (!canCreateProject) return;

    setIsConverting(true);

    // Call API or create new project
    apiFetch('/projects', {
      method: 'POST',
      body: JSON.stringify({
        projectCode: `PRJ-${proposal.proposalNumber.replace(/[^A-Z0-9]/g, '').slice(-6)}`,
        projectName: proposal.title,
        state: proposal.state,
        district: proposal.districts[0] || 'Pune',
        acquiringAuthority: proposal.requiringBody,
        totalLandRequiredHectares: proposal.landExtent.totalHa,
        acquisitionStage: 'Proposal (Sec 4)',
        status: 'ON_TRACK'
      })
    })
      .then(() => {
        updateProposalStatus(
          proposal.id,
          'CONVERTED_TO_PROJECT',
          user?.fullName || 'Central Ministry',
          'Central Ministry',
          'Initialized as Live Acquisition Project',
          'Project inducted into Project Register. CALA assigned for Section 4 Gazette Notice.'
        );
        setIsConverting(false);
        onRefresh();
        navigate('/projects');
      })
      .catch(err => {
        console.warn('Backend server project creation fallback:', err);
        updateProposalStatus(
          proposal.id,
          'CONVERTED_TO_PROJECT',
          user?.fullName || 'Central Ministry',
          'Central Ministry',
          'Initialized as Live Acquisition Project',
          'Project inducted into Project Register. CALA assigned for Section 4 Gazette Notice.'
        );
        setIsConverting(false);
        onRefresh();
        navigate('/projects');
      });
  };

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
            Requiring Agency: <strong>{proposal.requiringBody}</strong> • Recommended by: <strong className="text-emerald-800">{proposal.scrutinyChecklist?.verifiedBy || proposal.state + ' State Revenue Authority'}</strong>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {proposal.status === 'STATE_RECOMMENDED' && (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded border border-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              State Recommended
            </span>
          )}

          {proposal.status === 'CENTRAL_APPROVED' && (
            <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs font-bold rounded border border-purple-300">
              Central Sanction Granted
            </span>
          )}
        </div>
      </div>

      {/* Grid: Details vs Ministry Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 cols: Proposal Overview */}
        <div className="lg:col-span-7 space-y-3 text-xs">
          <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded space-y-2">
            <h3 className="font-bold text-emerald-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              State Revenue Authority Scrutiny Clearance
            </h3>
            <p className="text-slate-700">
              State Recommendation Remarks: <strong className="text-slate-900">"{proposal.scrutinyChecklist?.remarks || 'All administrative sanctions and land schedule verified.'}"</strong>
            </p>
            <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600 font-medium">
              <div>✓ Admin Sanction Verified</div>
              <div>✓ Cadastral Schedule Verified</div>
              <div>✓ SIA Applicability Clearance</div>
              <div>✓ Forest Clearance Evaluated</div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Financial &amp; Extent Summary
            </h3>
            <div className="grid grid-cols-2 gap-2 text-slate-700">
              <div>State &amp; Districts: <strong className="text-slate-900">{proposal.state} ({proposal.districts.join(', ')})</strong></div>
              <div>Total Land Extent: <strong className="font-mono text-emerald-700 font-bold">{proposal.landExtent.totalHa} Hectares</strong></div>
              <div>Sanction Order: <strong className="font-mono text-slate-900">{proposal.adminSanctionNo}</strong></div>
              <div>Total Cost Estimate: <strong className="font-mono text-slate-900">₹{proposal.budget.totalCostCr} Cr</strong></div>
            </div>
          </div>
        </div>

        {/* Right 5 cols: Central Sanction & Project Induction Panel */}
        <div className="lg:col-span-5 bg-slate-900 text-white rounded-lg p-4 space-y-4 shadow-md">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
            <Globe className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Central Ministry Sanction Desk
            </h3>
          </div>

          {/* ── Authorized: full sanction controls ── */}
          {canApprove ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Central Sanction Remarks</label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  placeholder="Enter formal sanction remarks or inter-state alignment notes..."
                  className="w-full text-xs p-2.5 bg-slate-800 text-white border border-slate-700 rounded focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              {/* Action 1: Grant In-Principle Sanction */}
              {proposal.status === 'STATE_RECOMMENDED' && (
                <div className="space-y-2">
                  <button
                    onClick={handleApproveCentralSanction}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs rounded shadow transition-colors flex items-center justify-center space-x-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-slate-900" />
                    <span>Grant Final Central Sanction</span>
                  </button>

                  <button
                    onClick={handleRejectCentral}
                    className="w-full py-1.5 bg-red-800 hover:bg-red-900 text-white font-semibold text-xs rounded transition-colors"
                  >
                    Reject / Return Proposal
                  </button>
                </div>
              )}

              {/* Action 2: Convert to Live Project — only if role can also create projects */}
              {(proposal.status === 'CENTRAL_APPROVED' || proposal.status === 'STATE_RECOMMENDED') && (
                <div className="p-3 bg-slate-800/90 border border-slate-700 rounded space-y-2">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                    Phase 2 Core Integration Trigger
                  </span>
                  <p className="text-[11px] text-slate-300">
                    Instantiate proposal as an active acquisition project in the single-source-of-truth Project Register.
                  </p>

                  {canCreateProject ? (
                    <button
                      onClick={handleConvertToLiveProject}
                      disabled={isConverting}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs rounded shadow transition-colors flex items-center justify-center space-x-2"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>{isConverting ? 'Initializing Project...' : 'Initialize as Live Acquisition Project'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 py-2 px-3 bg-slate-700/60 border border-slate-600 rounded text-[11px] text-slate-400">
                      <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Project induction requires CALA (LAND_ACQUIRING_AUTHORITY) credentials.</span>
                    </div>
                  )}
                </div>
              )}

              {proposal.status === 'CONVERTED_TO_PROJECT' && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-700/50 rounded text-center space-y-1">
                  <span className="text-xs font-bold text-emerald-400">✓ Inducted as Active Acquisition Project</span>
                  <p className="text-[10px] text-slate-300">CALA assigned &amp; Section 4 Gazette Notice Ready.</p>
                </div>
              )}
            </div>
          ) : (
            /* ── Unauthorized: read-only notice ── */
            <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <Lock className="w-5 h-5 text-amber-400" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">View Only</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Central Ministry credentials are required to grant sanctions or induct proposals as live projects.
                </p>
                <p className="text-[10px] text-slate-500 font-mono mt-1">
                  Your role: <span className="text-slate-300">{roleConfig.displayName}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
