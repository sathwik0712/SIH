import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../api/client';
import type { ProjectSummary } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  Building2,
  FolderGit2,
  MapPin,
  CheckSquare,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { TimelineDelayRadar } from './TimelineDelayRadar';
import { SEED_PROJECTS } from '../../data/seedProjects';

export const StateDashboard: React.FC = () => {
  const { user } = useAuth();
  const userState = user?.state || 'Maharashtra';
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    apiFetch<ProjectSummary[]>('/projects')
      .then(res => {
        if (res.success && res.data) {
          const stateProjects = res.data.filter(p => p.state.toLowerCase() === userState.toLowerCase() || p.state === 'Maharashtra');
          setProjects(stateProjects);
        }
      })
      .catch(err => console.error('Failed to load state projects:', err))
      .finally(() => setIsLoading(false));
  }, [userState]);

  const districtBreakdown = [
    { district: 'Pune', projects: 2, totalHa: 680.5, acquiredHa: 410.2, pendingProposals: 1, status: 'ON_TRACK' },
    { district: 'Solapur', projects: 1, totalHa: 600.0, acquiredHa: 285.0, pendingProposals: 2, status: 'AT_RISK' },
    { district: 'Thane', projects: 1, totalHa: 450.0, acquiredHa: 320.0, pendingProposals: 0, status: 'ON_TRACK' },
    { district: 'Nagpur', projects: 1, totalHa: 520.0, acquiredHa: 210.0, pendingProposals: 1, status: 'DELAYED' },
  ];

  const pendingProposalsList = [
    { id: 'PROP-MH-2026-08', project: 'Pune Ring Road Southern Arc', district: 'Pune', type: 'Section 4 Land Acquisition Proposal', submittedBy: 'CALA Pune District', date: '12 Sep 2026' },
    { id: 'PROP-MH-2026-11', project: 'Solapur Industrial Park Phase II', district: 'Solapur', type: 'Section 11 Gazette Approval Requisition', submittedBy: 'CALA Solapur', date: '15 Sep 2026' },
  ];

  return (
    <div className="space-y-4">
      {/* State Authority Header */}
      <div className="bg-[#0B3559] text-white p-4 rounded shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <h1 className="text-base font-bold text-white tracking-tight">
              State Revenue &amp; Land Reforms Authority — {userState}
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded font-semibold uppercase">
              STATE JURISDICTION
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Logged in as <strong className="text-white">{user?.fullName}</strong> ({user?.designation}) • Land Requisition &amp; Statutory Approval Authority
          </p>
        </div>

        <Link
          to="/workflow"
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded text-xs font-bold shadow-sm transition-colors"
        >
          <CheckSquare className="w-4 h-4" />
          <span>Review Proposal Approvals (2 Pending)</span>
        </Link>
      </div>

      {/* State Aggregate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border-l-4 border-l-[#0B3559] border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>State Active Projects</span>
            <FolderGit2 className="w-4 h-4 text-[#0B3559]" />
          </div>
          <div className="text-3xl font-bold text-slate-900 mt-1 font-mono">
            {isLoading ? '...' : projects.length || 5}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Within {userState} State</div>
        </div>

        <div className="bg-white border-l-4 border-l-emerald-600 border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>State Land Acquired</span>
            <MapPin className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-3xl font-bold text-emerald-800 mt-1 font-mono">
            1225.2 Ha
          </div>
          <div className="text-[11px] text-slate-500 mt-1">of 2250.5 Ha Total Required</div>
        </div>

        <div className="bg-white border-l-4 border-l-amber-500 border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Pending Proposal Approvals</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-bold text-amber-700 mt-1 font-mono">
            2 Queue
          </div>
          <div className="text-[11px] text-amber-700 mt-1">Escalated from District CALAs</div>
        </div>

        <div className="bg-white border-l-4 border-l-red-600 border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Statutory Delay Alerts</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-red-700 mt-1 font-mono">
            1 District
          </div>
          <div className="text-[11px] text-red-600 mt-1">Solapur Sec 15 Hearing Delay</div>
        </div>
      </div>

      {/* Pending Proposals Queue */}
      <div className="bg-white border border-slate-200 rounded shadow-sm p-4">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-amber-600" />
              Proposals Escalated for State Scrutiny &amp; Approval
            </h3>
            <p className="text-[11px] text-slate-500">Requires State Government sign-off before proceeding to Central Ministry / Project Declaration</p>
          </div>
        </div>

        <div className="space-y-2">
          {pendingProposalsList.map(prop => (
            <div key={prop.id} className="p-3 bg-slate-50 border border-slate-200 rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-[#0B3559]">{prop.id}</span>
                  <span className="text-xs font-bold text-slate-900">{prop.project}</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium">{prop.district} District</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {prop.type} • Submitted by <span className="font-medium text-slate-800">{prop.submittedBy}</span> on {prop.date}
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <Link
                  to="/workflow"
                  className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded shadow-sm transition-colors"
                >
                  Scrutinize &amp; Approve
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Delay Radar */}
      <TimelineDelayRadar projects={SEED_PROJECTS.filter(p => p.state.toLowerCase() === userState.toLowerCase() || p.state === 'Maharashtra')} />

      {/* District-wise Breakdown Table */}
      <div className="bg-white border border-slate-200 rounded shadow-sm p-4">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            District-wise Acquisition Breakdown ({userState})
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">4 Active Districts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="p-2.5 font-semibold text-slate-700">District</th>
                <th className="p-2.5 font-semibold text-slate-700">Projects Count</th>
                <th className="p-2.5 font-semibold text-slate-700">Required Land (Ha)</th>
                <th className="p-2.5 font-semibold text-slate-700">Acquired Land (Ha)</th>
                <th className="p-2.5 font-semibold text-slate-700">Pending Proposals</th>
                <th className="p-2.5 font-semibold text-slate-700">District Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {districtBreakdown.map(d => (
                <tr key={d.district} className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-slate-900">{d.district}</td>
                  <td className="p-2.5 font-mono">{d.projects}</td>
                  <td className="p-2.5 font-mono text-slate-600">{d.totalHa.toFixed(1)}</td>
                  <td className="p-2.5 font-mono font-semibold text-emerald-700">{d.acquiredHa.toFixed(1)}</td>
                  <td className="p-2.5 font-mono text-amber-700 font-bold">{d.pendingProposals}</td>
                  <td className="p-2.5"><StatusBadge status={d.status as any} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
