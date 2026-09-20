import React, { useState, useEffect } from 'react';
import { Proposal, ProposalStatus } from '../types/proposal';
import { getStoredProposals } from '../services/proposalService';
import { StateProposalScrutiny } from '../components/proposals/StateProposalScrutiny';
import { MinistryProposalApproval } from '../components/proposals/MinistryProposalApproval';
import { ProposalTracker } from '../components/proposals/ProposalTracker';
import {
  FileCheck,
  Plus,
  Search,
  Filter,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProposalsPage: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProposal, setActiveProposal] = useState<Proposal | null>(null);

  const loadProposals = () => {
    const list = getStoredProposals();
    setProposals(list);
    if (activeProposal) {
      const updated = list.find(p => p.id === activeProposal.id);
      if (updated) setActiveProposal(updated);
    }
  };

  useEffect(() => {
    loadProposals();
  }, []);

  const filteredProposals = proposals.filter(p => {
    const matchesStatus = selectedStatus === 'ALL' || p.status === selectedStatus;
    const matchesSearch =
      p.proposalNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.requiringBody.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: ProposalStatus) => {
    switch (status) {
      case 'DRAFT': return <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-semibold">Draft</span>;
      case 'SUBMITTED': return <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-[11px] font-semibold">Submitted</span>;
      case 'STATE_SCRUTINY': return <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded text-[11px] font-semibold">State Scrutiny</span>;
      case 'QUERY_RAISED': return <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-[11px] font-semibold">Query Raised</span>;
      case 'STATE_RECOMMENDED': return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded text-[11px] font-semibold">State Recommended</span>;
      case 'CENTRAL_APPROVED': return <span className="px-2 py-0.5 bg-purple-100 text-purple-900 rounded text-[11px] font-semibold">Central Approved</span>;
      case 'CONVERTED_TO_PROJECT': return <span className="px-2 py-0.5 bg-emerald-700 text-white rounded text-[11px] font-bold">Live Project</span>;
      case 'REJECTED': return <span className="px-2 py-0.5 bg-slate-800 text-white rounded text-[11px] font-semibold">Rejected</span>;
      default: return <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px]">Pending</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <FileCheck className="w-5 h-5 text-[#0B3559]" />
            <h1 className="text-base font-bold text-slate-900">
              Land Requisition Proposal &amp; Approval Register (RFCTLARR Sec 4)
            </h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            End-to-end statutory workflow: Requiring Body Submission → State Scrutiny → Central Ministry Sanction → Live Project Induction.
          </p>
        </div>

        <Link
          to="/proposals/new"
          className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Land Requisition Proposal</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded p-3 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search proposal by tracking ID, title, state..."
            className="text-xs p-2 border border-slate-300 rounded w-full sm:w-64 focus:ring-1 focus:ring-[#0B3559]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {['ALL', 'STATE_SCRUTINY', 'STATE_RECOMMENDED', 'CENTRAL_APPROVED', 'CONVERTED_TO_PROJECT'].map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`text-[11px] px-2.5 py-1 rounded font-semibold whitespace-nowrap transition-colors ${
                selectedStatus === status
                  ? 'bg-[#0B3559] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {status === 'ALL' ? 'All Proposals' : status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Proposals List Table */}
      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="p-3 font-semibold text-slate-700">Requisition ID</th>
                <th className="p-3 font-semibold text-slate-700">Project Title</th>
                <th className="p-3 font-semibold text-slate-700">Requiring Agency</th>
                <th className="p-3 font-semibold text-slate-700">State / Districts</th>
                <th className="p-3 font-semibold text-slate-700">Land Extent</th>
                <th className="p-3 font-semibold text-slate-700">Est. Budget</th>
                <th className="p-3 font-semibold text-slate-700">Workflow Stage</th>
                <th className="p-3 font-semibold text-slate-700 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProposals.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-mono font-bold text-[#0B3559]">{p.proposalNumber}</td>
                  <td className="p-3 font-semibold text-slate-900 max-w-xs">{p.title}</td>
                  <td className="p-3 text-slate-700">{p.requiringBody}</td>
                  <td className="p-3 text-slate-600">{p.state} ({p.districts.join(', ')})</td>
                  <td className="p-3 font-mono font-bold text-emerald-800">{p.landExtent.totalHa} Ha</td>
                  <td className="p-3 font-mono font-semibold text-slate-900">₹{p.budget.totalCostCr} Cr</td>
                  <td className="p-3">{getStatusBadge(p.status)}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setActiveProposal(p)}
                      className="px-2.5 py-1 bg-[#0B3559] hover:bg-[#071E3D] text-white rounded text-[11px] font-semibold transition-colors flex items-center space-x-1 ml-auto"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Desk</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Proposal Inspection Workspace Section */}
      {activeProposal && (
        <div className="space-y-4 pt-4 border-t border-slate-300">
          <div className="flex justify-between items-center bg-slate-900 text-white p-3 rounded">
            <span className="text-xs font-bold uppercase tracking-wider">
              Active Proposal Inspection Workspace ({activeProposal.proposalNumber})
            </span>
            <button
              onClick={() => setActiveProposal(null)}
              className="text-xs text-amber-400 hover:underline font-bold"
            >
              Close Workspace ✕
            </button>
          </div>

          <ProposalTracker proposal={activeProposal} />

          {/* Conditional Role Action Workspace */}
          {activeProposal.status === 'STATE_SCRUTINY' && (
            <StateProposalScrutiny proposal={activeProposal} onRefresh={loadProposals} />
          )}

          {(activeProposal.status === 'STATE_RECOMMENDED' || activeProposal.status === 'CENTRAL_APPROVED' || activeProposal.status === 'CONVERTED_TO_PROJECT') && (
            <MinistryProposalApproval proposal={activeProposal} onRefresh={loadProposals} />
          )}
        </div>
      )}
    </div>
  );
};
