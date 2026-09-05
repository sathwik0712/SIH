import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api/client';
import type { DashboardStats, ProjectSummary } from '../types';
import { FilterPanel } from '../components/common/FilterPanel';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  FolderGit2,
  MapPin,
  AlertTriangle,
  Clock,
  IndianRupee,
  Users,
  Home,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Building,
  Calendar,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [selectedAuthority, setSelectedAuthority] = useState('ALL');
  const [selectedStage, setSelectedStage] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const query = new URLSearchParams();
    if (selectedState !== 'ALL') query.append('state', selectedState);
    if (selectedDistrict !== 'ALL') query.append('district', selectedDistrict);

    Promise.all([
      apiFetch<DashboardStats>(`/dashboard?${query.toString()}`),
      apiFetch<ProjectSummary[]>('/projects'),
    ])
      .then(([statsRes, projectsRes]) => {
        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        }
        if (projectsRes.success && projectsRes.data) {
          setProjects(projectsRes.data);
        }
      })
      .catch(err => console.error('Failed to load dashboard data:', err))
      .finally(() => setIsLoading(false));
  }, [selectedState, selectedDistrict]);

  const filterFields = [
    {
      id: 'state-filter',
      label: 'State / UT',
      value: selectedState,
      onChange: (val: string) => {
        setSelectedState(val);
        setSelectedDistrict('ALL');
      },
      options: [
        { value: 'ALL', label: 'All States (National)' },
        { value: 'Maharashtra', label: 'Maharashtra' },
        { value: 'Telangana', label: 'Telangana' },
        { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
        { value: 'Gujarat', label: 'Gujarat' },
        { value: 'Karnataka', label: 'Karnataka' },
      ],
    },
    {
      id: 'district-filter',
      label: 'District',
      value: selectedDistrict,
      onChange: setSelectedDistrict,
      options: [
        { value: 'ALL', label: 'All Districts' },
        { value: 'Pune', label: 'Pune (MH)' },
        { value: 'Solapur', label: 'Solapur (MH)' },
        { value: 'Hyderabad', label: 'Hyderabad (TS)' },
        { value: 'Rangareddy', label: 'Rangareddy (TS)' },
        { value: 'Varanasi', label: 'Varanasi (UP)' },
        { value: 'Prayagraj', label: 'Prayagraj (UP)' },
        { value: 'Ahmedabad', label: 'Ahmedabad (GJ)' },
        { value: 'Surat', label: 'Surat (GJ)' },
        { value: 'Bengaluru Urban', label: 'Bengaluru Urban (KA)' },
        { value: 'Tumakuru', label: 'Tumakuru (KA)' },
      ],
    },
    {
      id: 'authority-filter',
      label: 'Acquiring Authority',
      value: selectedAuthority,
      onChange: setSelectedAuthority,
      options: [
        { value: 'ALL', label: 'All Authorities' },
        { value: 'NHAI', label: 'NHAI' },
        { value: 'DFCCIL', label: 'DFCCIL' },
        { value: 'SECI', label: 'SECI' },
        { value: 'NICDC', label: 'NICDC' },
        { value: 'MIDC', label: 'MIDC / State Ind.' },
      ],
    },
    {
      id: 'stage-filter',
      label: 'Acquisition Stage',
      value: selectedStage,
      onChange: setSelectedStage,
      options: [
        { value: 'ALL', label: 'All Statutory Stages' },
        { value: 'PROPOSAL', label: 'Proposal (Sec 4)' },
        { value: 'VERIFICATION', label: 'Field Verification' },
        { value: 'NOTIFICATION', label: 'Notification (Sec 11)' },
        { value: 'OBJECTION', label: 'Objection (Sec 15)' },
        { value: 'AWARD', label: 'Award (Sec 23/30)' },
        { value: 'COMPENSATION', label: 'Compensation Disbursal' },
        { value: 'RANDR', label: 'R&R Execution' },
        { value: 'POSSESSION', label: 'Possession Handover' },
      ],
    },
    {
      id: 'fy-filter',
      label: 'Financial Year',
      value: '2026-27',
      onChange: () => {},
      options: [
        { value: '2026-27', label: 'FY 2026–27 (Current)' },
        { value: '2025-26', label: 'FY 2025–26' },
      ],
    },
  ];

  // Stage distribution
  const stages = [
    { key: 'PROPOSAL', label: 'Proposal (Sec 4)', count: 1, color: 'bg-blue-600' },
    { key: 'VERIFICATION', label: 'Field Verification', count: 1, color: 'bg-amber-500' },
    { key: 'NOTIFICATION', label: 'Gazette Notice (Sec 11)', count: 2, color: 'bg-indigo-600' },
    { key: 'OBJECTION', label: 'Objections (Sec 15)', count: 1, color: 'bg-red-500' },
    { key: 'AWARD', label: 'Award Inquiry (Sec 23)', count: 1, color: 'bg-purple-600' },
    { key: 'COMPENSATION', label: 'Compensation (PFMS)', count: 2, color: 'bg-cyan-600' },
    { key: 'RANDR', label: 'R&R Benefits (Sec 31)', count: 1, color: 'bg-teal-600' },
    { key: 'POSSESSION', label: 'Possession (Sec 38)', count: 2, color: 'bg-emerald-600' },
  ];

  // State-wise Land Comparison Data
  const stateData = [
    { state: 'Maharashtra', required: 1280.5, acquired: 695.2, pct: 54 },
    { state: 'Karnataka', required: 1295.0, acquired: 1165.0, pct: 90 },
    { state: 'Gujarat', required: 1210.0, acquired: 950.0, pct: 78 },
    { state: 'Uttar Pradesh', required: 860.0, acquired: 405.4, pct: 47 },
    { state: 'Telangana', required: 740.0, acquired: 180.0, pct: 24 },
  ];

  return (
    <div className="space-y-4">
      {/* Official Greeting & Context Banner */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base font-bold text-[#0B3559] tracking-tight">
              National Land Acquisition &amp; Resettlement Dashboard
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-[#0B3559]/10 text-[#0B3559] border border-[#0B3559]/20 rounded font-semibold">
              RFCTLARR 2013 Single Repository
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Logged in as <strong className="text-slate-900">{user?.fullName}</strong> ({user?.designation}) •{' '}
            <span className="text-amber-800 font-semibold">Jurisdiction: {user?.district || user?.state || 'All India'}</span>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/projects"
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#0B3559] hover:bg-[#071E3D] text-white rounded text-xs font-semibold shadow-sm transition-colors"
          >
            <span>Open Project Register</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/gis-map"
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold shadow-sm transition-colors"
          >
            <span>GIS Map View</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        fields={filterFields}
        onReset={() => {
          setSelectedState('ALL');
          setSelectedDistrict('ALL');
          setSelectedAuthority('ALL');
          setSelectedStage('ALL');
        }}
      />

      {/* Top 7 Core KPI Metric Cards (Dense, formal NIC styling) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Projects */}
        <div className="bg-white border-l-4 border-l-[#0B3559] border border-slate-200 rounded p-3 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
            <span>Total Projects</span>
            <FolderGit2 className="w-4 h-4 text-[#0B3559]" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
            {isLoading ? '...' : stats?.totalProjects ?? 10}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">National &amp; State Requisitions</div>
        </div>

        {/* Land Proposed vs Acquired */}
        <div className="bg-white border-l-4 border-l-emerald-600 border border-slate-200 rounded p-3 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
            <span>Land Acquired / Req</span>
            <MapPin className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-emerald-800 mt-1 font-mono">
            {isLoading ? '...' : `${stats?.totalLandAcquiredHectares?.toFixed(1) ?? '3,395.6'} Ha`}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            of {stats?.totalLandRequiredHectares?.toFixed(1) ?? '4,985.5'} Ha Total (68.1%)
          </div>
        </div>

        {/* Parcels Pending Verification */}
        <div className="bg-white border-l-4 border-l-amber-500 border border-slate-200 rounded p-3 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
            <span>Pending Survey</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-1 font-mono">
            {isLoading ? '...' : stats?.parcelsPendingVerification ?? 143}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Field Inspection Due</div>
        </div>

        {/* Compensation Disbursed */}
        <div className="bg-white border-l-4 border-l-cyan-600 border border-slate-200 rounded p-3 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
            <span>PFMS Disbursal</span>
            <IndianRupee className="w-4 h-4 text-cyan-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
            {isLoading ? '...' : `₹${stats?.compensationDisbursedCr?.toFixed(1) ?? '1,950.6'} Cr`}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            of ₹{stats?.compensationAssessedCr?.toFixed(1) ?? '3,136.4'} Cr Assessed
          </div>
        </div>

        {/* Affected & Rehabilitated Families */}
        <div className="bg-white border-l-4 border-l-purple-600 border border-slate-200 rounded p-3 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
            <span>R&amp;R Resettled</span>
            <Users className="w-4 h-4 text-purple-700" />
          </div>
          <div className="text-2xl font-bold text-purple-900 mt-1 font-mono">
            {isLoading ? '...' : `${stats?.rehabilitatedFamilies ?? 1672}`}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            of {stats?.totalAffectedFamilies ?? 2450} Families (68.2%)
          </div>
        </div>

        {/* Delayed / At Risk Escalations */}
        <div className="bg-white border-l-4 border-l-red-600 border border-slate-200 rounded p-3 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
            <span>Delayed / At Risk</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-700 mt-1 font-mono">
            {isLoading ? '...' : `${(stats?.delayedCases ?? 1) + (stats?.atRiskCases ?? 2)} Cases`}
          </div>
          <div className="text-[10px] text-red-600 mt-0.5">Statutory Delay Flagged</div>
        </div>
      </div>

      {/* Row 2: Visual Charts & Analytics (No 3D, Dense Govt MIS Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Funnel & Stage Progression (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Land Acquisition Lifecycle Stage Distribution
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">10 Active Requisitions</span>
          </div>

          <div className="space-y-2.5">
            {stages.map(st => (
              <div key={st.key} className="flex items-center justify-between text-xs">
                <span className="w-48 truncate text-slate-700 font-medium">{st.label}</span>
                <div className="flex-1 mx-3 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`${st.color} h-2.5 rounded-full transition-all duration-300`}
                    style={{ width: `${(st.count / 10) * 100}%` }}
                  />
                </div>
                <span className="font-mono font-bold text-slate-900 w-16 text-right">
                  {st.count} {st.count === 1 ? 'Proj' : 'Projs'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* State-wise Land Comparison (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              State-wise Acquisition Progress (Ha)
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">Target vs Acquired</span>
          </div>

          <div className="space-y-3">
            {stateData.map(sd => (
              <div key={sd.state} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-800">{sd.state}</span>
                  <span className="font-mono text-[11px] text-slate-600">
                    <strong className="text-emerald-700">{sd.acquired}</strong> / {sd.required} Ha ({sd.pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden flex">
                  <div
                    className="bg-emerald-600 h-2"
                    style={{ width: `${sd.pct}%` }}
                  />
                  <div
                    className="bg-slate-300 h-2"
                    style={{ width: `${100 - sd.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 3: Priority Project Register Table */}
      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Priority National &amp; State Project Register (10 Requisitions)
            </h3>
            <p className="text-[11px] text-slate-500">Live single-source-of-truth status tracking</p>
          </div>
          <Link
            to="/projects"
            className="text-xs font-semibold text-[#0B3559] hover:underline flex items-center space-x-1"
          >
            <span>View Full Table</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100">
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Project Code</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Project Name</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">State / District</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Authority</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Land (Ha)</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Stage</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Status</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {projects.slice(0, 5).map(p => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-3.5 py-2.5 font-mono font-bold text-[#0B3559]">
                    {p.projectCode}
                  </td>
                  <td className="px-3.5 py-2.5 font-semibold text-slate-900">
                    <Link to={`/projects/${p.id}`} className="hover:underline">
                      {p.projectName}
                    </Link>
                  </td>
                  <td className="px-3.5 py-2.5 text-slate-600">
                    {p.state}, {p.district}
                  </td>
                  <td className="px-3.5 py-2.5">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-medium text-[11px]">
                      {p.acquiringAuthority}
                    </span>
                  </td>
                  <td className="px-3.5 py-2.5 font-mono">
                    <span className="font-bold text-emerald-700">{p.totalLandAcquiredHectares?.toFixed(1)}</span>
                    <span className="text-slate-400"> / {p.totalLandRequiredHectares?.toFixed(1)}</span>
                  </td>
                  <td className="px-3.5 py-2.5 font-medium text-slate-800 text-[11px]">
                    {p.acquisitionStage}
                  </td>
                  <td className="px-3.5 py-2.5">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-3.5 py-2.5 text-right">
                    <Link
                      to={`/projects/${p.id}`}
                      className="px-2.5 py-1 bg-[#0B3559] hover:bg-[#071E3D] text-white rounded text-[11px] font-semibold transition-colors"
                    >
                      Workspace
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
