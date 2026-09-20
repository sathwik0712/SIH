import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../api/client';
import type { DashboardStats, ProjectSummary } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  FolderGit2,
  MapPin,
  IndianRupee,
  Users,
  ShieldCheck,
  BarChart3,
  Globe,
  Lock,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { TimelineDelayRadar } from './TimelineDelayRadar';
import { SEED_PROJECTS } from '../../data/seedProjects';

export const MinistryDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      apiFetch<DashboardStats>('/dashboard'),
      apiFetch<ProjectSummary[]>('/projects'),
    ])
      .then(([statsRes, projectsRes]) => {
        if (statsRes.success && statsRes.data) setStats(statsRes.data);
        if (projectsRes.success && projectsRes.data) setProjects(projectsRes.data);
      })
      .catch(err => console.error('Failed to load ministry dashboard:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const stateComparison = [
    { state: 'Maharashtra', projects: 3, totalHa: 1280.5, acquiredHa: 695.2, compensationCr: 450.0, pct: 54 },
    { state: 'Karnataka', projects: 2, totalHa: 1295.0, acquiredHa: 1165.0, compensationCr: 380.0, pct: 90 },
    { state: 'Gujarat', projects: 2, totalHa: 1210.0, acquiredHa: 950.0, compensationCr: 310.0, pct: 78 },
    { state: 'Uttar Pradesh', projects: 2, totalHa: 860.0, acquiredHa: 405.4, compensationCr: 210.0, pct: 47 },
    { state: 'Telangana', projects: 1, totalHa: 740.0, acquiredHa: 180.0, compensationCr: 95.0, pct: 24 },
  ];

  return (
    <div className="space-y-4">
      {/* Ministry Header Banner */}
      <div className="bg-slate-900 text-white p-4 rounded shadow-md border-l-4 border-l-amber-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-amber-400" />
            <h1 className="text-base font-bold text-white tracking-tight">
              Central Ministry — Pan-India Oversight Dashboard
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded font-semibold uppercase">
              READ-ONLY ANALYTICS
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Ministry of Road Transport & Highways / Railways / Infrastructure • Logged in as <strong className="text-white">{user?.fullName}</strong>
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded border border-slate-700 text-xs text-slate-300">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Restricted Mode: Edit &amp; Workflow Controls Disabled</span>
        </div>
      </div>

      {/* National Aggregate Cards (Read-only) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Projects Across India */}
        <div className="bg-white border-l-4 border-l-[#0B3559] border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total National Projects</span>
            <FolderGit2 className="w-4 h-4 text-[#0B3559]" />
          </div>
          <div className="text-3xl font-bold text-slate-900 mt-1 font-mono">
            {isLoading ? '...' : stats?.totalProjects || 10}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across 5 States &amp; UTs</div>
        </div>

        {/* Total Area Notified vs Acquired */}
        <div className="bg-white border-l-4 border-l-emerald-600 border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Area Acquired / Notified</span>
            <MapPin className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-3xl font-bold text-emerald-800 mt-1 font-mono">
            {isLoading ? '...' : `${stats?.totalLandAcquiredHectares?.toFixed(1) || '3395.6'} Ha`}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            of {stats?.totalLandRequiredHectares?.toFixed(1) || '5385.5'} Ha Total (63%)
          </div>
        </div>

        {/* Total Compensation Disbursed */}
        <div className="bg-white border-l-4 border-l-cyan-600 border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Compensation Disbursed (PFMS)</span>
            <IndianRupee className="w-4 h-4 text-cyan-700" />
          </div>
          <div className="text-3xl font-bold text-slate-900 mt-1 font-mono">
            {isLoading ? '...' : `₹${stats?.compensationDisbursedCr?.toFixed(1) || '1445.0'} Cr`}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Assessed: ₹{stats?.compensationAssessedCr?.toFixed(1) || '1850.0'} Cr
          </div>
        </div>

        {/* Total Affected Families */}
        <div className="bg-white border-l-4 border-l-purple-600 border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Affected Families</span>
            <Users className="w-4 h-4 text-purple-700" />
          </div>
          <div className="text-3xl font-bold text-purple-900 mt-1 font-mono">
            {isLoading ? '...' : stats?.totalAffectedFamilies || 4280}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Rehabilitated: {stats?.rehabilitatedFamilies || 3120} (73%)
          </div>
        </div>
      </div>

      {/* State-wise Heatmap / Summary Table */}
      <div className="bg-white border border-slate-200 rounded shadow-sm p-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#0B3559]" />
              State-wise Acquisition Progress &amp; Financial Summary
            </h3>
            <p className="text-[11px] text-slate-500">Aggregate statistics grouped by State Jurisdiction</p>
          </div>
          <Link to="/reports" className="text-xs font-semibold text-[#0B3559] hover:underline flex items-center gap-1">
            <span>Export MIS Report</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="p-2.5 font-semibold text-slate-700">State / UT</th>
                <th className="p-2.5 font-semibold text-slate-700">Projects</th>
                <th className="p-2.5 font-semibold text-slate-700">Required Land (Ha)</th>
                <th className="p-2.5 font-semibold text-slate-700">Acquired Land (Ha)</th>
                <th className="p-2.5 font-semibold text-slate-700">Progress (%)</th>
                <th className="p-2.5 font-semibold text-slate-700">Disbursed (₹ Cr)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {stateComparison.map(s => (
                <tr key={s.state} className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-slate-900">{s.state}</td>
                  <td className="p-2.5 font-mono">{s.projects}</td>
                  <td className="p-2.5 font-mono text-slate-600">{s.totalHa.toFixed(1)}</td>
                  <td className="p-2.5 font-mono font-semibold text-emerald-700">{s.acquiredHa.toFixed(1)}</td>
                  <td className="p-2.5">
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-2" style={{ width: `${s.pct}%` }} />
                      </div>
                      <span className="font-mono text-[11px] font-bold text-slate-700">{s.pct}%</span>
                    </div>
                  </td>
                  <td className="p-2.5 font-mono font-semibold text-slate-900">₹{s.compensationCr.toFixed(1)} Cr</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* National Timeline Health & Delay Radar Widget */}
      <TimelineDelayRadar projects={SEED_PROJECTS} />

      {/* Read-Only Project Register */}
      <div className="bg-white border border-slate-200 rounded shadow-sm p-4">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            National Infrastructure Project Register (Read-Only View)
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">10 Projects Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="p-2.5 font-semibold text-slate-700">Code</th>
                <th className="p-2.5 font-semibold text-slate-700">Project Name</th>
                <th className="p-2.5 font-semibold text-slate-700">State / District</th>
                <th className="p-2.5 font-semibold text-slate-700">Authority</th>
                <th className="p-2.5 font-semibold text-slate-700">Stage</th>
                <th className="p-2.5 font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {projects.slice(0, 5).map(p => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="p-2.5 font-mono font-bold text-[#0B3559]">{p.projectCode}</td>
                  <td className="p-2.5 font-semibold text-slate-900">{p.projectName}</td>
                  <td className="p-2.5 text-slate-600">{p.state}, {p.district}</td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-medium text-[11px]">
                      {p.acquiringAuthority}
                    </span>
                  </td>
                  <td className="p-2.5 font-medium text-slate-700">{p.acquisitionStage}</td>
                  <td className="p-2.5"><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
