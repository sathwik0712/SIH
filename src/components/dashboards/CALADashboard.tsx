import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../api/client';
import { SEED_PROJECTS } from '../../data/seedProjects';
import { AuthenticProject } from '../../types/project';
import { StatusBadge } from '../common/StatusBadge';
import {
  Briefcase,
  MapPin,
  FileText,
  Award,
  DollarSign,
  Gavel,
  ArrowRight,
  PlayCircle,
  FilePlus,
  Layers,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ── Contextual mock fallbacks (used when API returns empty data) ──────────────
const MOCK_STATS = {
  parcelsPendingSurvey: 18,
  hearingsThisWeek: 4,
  gazetteDraftsPending: 2,
  awardsPending: 3,
  pfmsQueueCr: 24.8,
};

export const CALADashboard: React.FC = () => {
  const { user } = useAuth();
  const district = user?.district || 'Pune';

  // ── KPI state (derived from API + seed data) ──────────────────────────────
  const [parcelCount, setParcelCount] = useState<number>(MOCK_STATS.parcelsPendingSurvey);
  const [jurisdictionProjects, setJurisdictionProjects] = useState<AuthenticProject[]>([]);
  const [statsLoaded, setStatsLoaded] = useState(false);

  useEffect(() => {
    // 1. Parcels — count unverified parcels from API, fallback to mock.
    apiFetch<any[]>('/parcels')
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          const pending = res.data.filter(
            (p: any) => p.verificationStatus !== 'VERIFIED' && p.verificationStatus !== 'COMPLETED'
          ).length;
          setParcelCount(pending || MOCK_STATS.parcelsPendingSurvey);
        }
      })
      .catch(() => {/* keep mock */});

    // 2. Jurisdiction projects — try API first, fall back to SEED_PROJECTS.
    apiFetch<any[]>('/projects')
      .then(res => {
        const source: AuthenticProject[] =
          res.success && res.data && res.data.length > 0
            ? res.data.map((p: any) => {
                const seed = SEED_PROJECTS.find(s => s.id === p.id || s.projectCode === p.projectCode);
                return seed ?? {
                  ...p,
                  districts: Array.isArray(p.districts) ? p.districts : p.district ? [p.district] : ['General'],
                  landExtent: p.landExtent ?? { totalHa: p.totalLandRequiredHectares ?? 0, privatePattaHa: 0, govtLandHa: 0, forestProtectedHa: 0 },
                  milestones: p.milestones ?? SEED_PROJECTS[0].milestones,
                  overallVarianceDays: p.overallVarianceDays ?? 0,
                };
              })
            : SEED_PROJECTS;

        // Filter to projects in CALA's district, fallback to all seed projects.
        const filtered = source.filter(p =>
          (p.districts ?? []).some((d: string) => d.toLowerCase() === district.toLowerCase())
        );
        setJurisdictionProjects(filtered.length > 0 ? filtered : SEED_PROJECTS.slice(0, 3));
      })
      .catch(() => setJurisdictionProjects(SEED_PROJECTS.slice(0, 3)))
      .finally(() => setStatsLoaded(true));
  }, [district]);

  return (
    <div className="space-y-4">
      {/* ── CALA Workstation Header ────────────────────────────────────────── */}
      <div className="bg-[#0B3559] text-white p-4 rounded shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-amber-400" />
            <h1 className="text-base font-bold text-white tracking-tight">
              CALA Operational Workstation — {district} District
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded font-semibold uppercase">
              WORKFLOW OPERATOR
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Logged in as <strong className="text-white">{user?.fullName}</strong> ({user?.designation}) • Statutory Acquisition Execution Authority
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/workflow"
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold shadow-sm transition-colors"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Advance Acquisition Workflow</span>
          </Link>
          <Link
            to="/proposals/new"
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded text-xs font-bold shadow-sm transition-colors"
          >
            <FilePlus className="w-4 h-4" />
            <span>Submit Requisition (Sec 4)</span>
          </Link>
          <Link
            to="/parcels"
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-bold shadow-sm transition-colors"
          >
            <Layers className="w-4 h-4" />
            <span>Cadastral Parcels</span>
          </Link>
        </div>
      </div>

      {/* ── CALA Operational KPI Cards ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Parcels Pending Survey — live from /parcels */}
        <div className="bg-white border-l-4 border-l-amber-500 border border-slate-200 rounded p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
            <span>Parcels Pending Survey</span>
            <MapPin className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-1 font-mono">
            {statsLoaded ? `${parcelCount} Parcels` : '— Parcels'}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Assigned to Field Officers</div>
        </div>

        {/* Hearings This Week */}
        <div className="bg-white border-l-4 border-l-indigo-600 border border-slate-200 rounded p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
            <span>Hearings This Week</span>
            <Gavel className="w-4 h-4 text-indigo-700" />
          </div>
          <div className="text-2xl font-bold text-indigo-900 mt-1 font-mono">
            {MOCK_STATS.hearingsThisWeek} Scheduled
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Sec 15 Objections Desk</div>
        </div>

        {/* Gazette Drafts Pending */}
        <div className="bg-white border-l-4 border-l-cyan-600 border border-slate-200 rounded p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
            <span>Gazette Drafts Pending</span>
            <FileText className="w-4 h-4 text-cyan-700" />
          </div>
          <div className="text-2xl font-bold text-cyan-900 mt-1 font-mono">
            {MOCK_STATS.gazetteDraftsPending} Drafts
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Sec 11 &amp; Sec 19 Drafts</div>
        </div>

        {/* Awards Pending — live count from jurisdiction projects */}
        <div className="bg-white border-l-4 border-l-purple-600 border border-slate-200 rounded p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
            <span>Awards Pending Decl.</span>
            <Award className="w-4 h-4 text-purple-700" />
          </div>
          <div className="text-2xl font-bold text-purple-900 mt-1 font-mono">
            {statsLoaded
              ? `${jurisdictionProjects.filter(p => p.acquisitionStage?.includes('Award') || p.acquisitionStage?.includes('Sec 23') || p.acquisitionStage?.includes('Sec 25')).length || MOCK_STATS.awardsPending} Awards`
              : '— Awards'}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Sec 23 Inquiry Complete</div>
        </div>

        {/* PFMS Disbursal Queue */}
        <div className="bg-white border-l-4 border-l-emerald-600 border border-slate-200 rounded p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
            <span>PFMS Disbursal Queue</span>
            <DollarSign className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-emerald-800 mt-1 font-mono">
            ₹{statsLoaded
              ? (jurisdictionProjects.reduce((sum, p) => sum + ((p.totalBudgetCr ?? 0) - (p.disbursedBudgetCr ?? 0)), 0) || MOCK_STATS.pfmsQueueCr).toFixed(1)
              : MOCK_STATS.pfmsQueueCr} Cr
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Ready for Direct Benefit Transfer</div>
        </div>
      </div>

      {/* ── Statutory Acquisition Stepper Matrix ──────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded shadow-sm p-4">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#0B3559]" />
              RFCTLARR 2013 Statutory Lifecycle Progression (CALA Active Projects)
            </h3>
            <p className="text-[11px] text-slate-500">Track and advance project stages sequentially</p>
          </div>
          <Link to="/workflow" className="text-xs font-semibold text-[#0B3559] hover:underline flex items-center gap-1">
            <span>Full Workflow Stepper</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded flex flex-col justify-between space-y-2">
            <div>
              <span className="text-[10px] font-bold text-[#0B3559] uppercase">Stage 1: Requisition (Sec 4)</span>
              <h4 className="text-xs font-bold text-slate-900 mt-1">Proposal Scrutiny</h4>
              <p className="text-[11px] text-slate-600 mt-0.5">1 Proposal in State Review</p>
            </div>
            <Link to="/workflow" className="text-[11px] text-[#0B3559] font-bold hover:underline">Track Proposal →</Link>
          </div>

          <div className="p-3 bg-amber-50/50 border border-amber-200 rounded flex flex-col justify-between space-y-2">
            <div>
              <span className="text-[10px] font-bold text-amber-800 uppercase">Stage 2: Notification (Sec 11)</span>
              <h4 className="text-xs font-bold text-slate-900 mt-1">Preliminary Gazette</h4>
              <p className="text-[11px] text-slate-600 mt-0.5">2 Notifications Published</p>
            </div>
            <Link to="/notifications" className="text-[11px] text-amber-800 font-bold hover:underline">Generate Gazette →</Link>
          </div>

          <div className="p-3 bg-blue-50/50 border border-blue-200 rounded flex flex-col justify-between space-y-2">
            <div>
              <span className="text-[10px] font-bold text-blue-800 uppercase">Stage 3: Award Inquiry (Sec 23)</span>
              <h4 className="text-xs font-bold text-slate-900 mt-1">Land Valuation &amp; Solatium</h4>
              <p className="text-[11px] text-slate-600 mt-0.5">3 Draft Awards Pending</p>
            </div>
            <Link to="/awards" className="text-[11px] text-blue-800 font-bold hover:underline">Declare Award →</Link>
          </div>

          <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded flex flex-col justify-between space-y-2">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase">Stage 4: Possession (Sec 38)</span>
              <h4 className="text-xs font-bold text-slate-900 mt-1">Compensation &amp; Handover</h4>
              <p className="text-[11px] text-slate-600 mt-0.5">PFMS Batch Ready</p>
            </div>
            <Link to="/possession" className="text-[11px] text-emerald-800 font-bold hover:underline">Issue Possession →</Link>
          </div>
        </div>
      </div>

      {/* ── Active Projects in Jurisdiction ───────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0B3559]" />
              Active Acquisition Projects in Jurisdiction
              <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                {district}
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {statsLoaded
                ? `${jurisdictionProjects.length} project(s) assigned to your acquiring authority`
                : 'Loading projects…'}
            </p>
          </div>
          <Link to="/projects" className="text-xs font-semibold text-[#0B3559] hover:underline flex items-center gap-1">
            <span>View Full Register</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-2.5 font-semibold text-slate-600 uppercase text-[10px] tracking-wider">Project Code &amp; Agency</th>
                <th className="text-left px-4 py-2.5 font-semibold text-slate-600 uppercase text-[10px] tracking-wider">Project Name</th>
                <th className="text-left px-4 py-2.5 font-semibold text-slate-600 uppercase text-[10px] tracking-wider">Statutory Stage</th>
                <th className="text-left px-4 py-2.5 font-semibold text-slate-600 uppercase text-[10px] tracking-wider">SLA Variance</th>
                <th className="text-left px-4 py-2.5 font-semibold text-slate-600 uppercase text-[10px] tracking-wider">Status</th>
                <th className="text-left px-4 py-2.5 font-semibold text-slate-600 uppercase text-[10px] tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!statsLoaded ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                    <div className="inline-block w-4 h-4 border-2 border-[#0B3559] border-t-transparent rounded-full animate-spin mr-2 align-middle" />
                    Loading jurisdiction projects…
                  </td>
                </tr>
              ) : jurisdictionProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                    No active projects found for {district} district.
                  </td>
                </tr>
              ) : (
                jurisdictionProjects.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-[#0B3559] block">{p.projectCode}</span>
                      <span className="text-[10px] text-slate-500">{p.ministryAgency}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-900">{p.projectName}</span>
                      <span className="text-[10px] text-slate-500 block">{p.state} · {(p.districts ?? []).join(', ')}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-[#0B3559]">{p.acquisitionStage}</span>
                    </td>
                    <td className="px-4 py-3">
                      {(p.overallVarianceDays ?? 0) > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-800 rounded font-mono font-bold text-[10px]">
                          <AlertTriangle className="w-3 h-3 text-red-600" />
                          +{p.overallVarianceDays}d Delay
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono font-bold text-[10px]">
                          {p.overallVarianceDays}d Ahead
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={p.status as any} />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/projects/${p.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#0B3559] hover:bg-[#071E3D] text-white rounded text-[10px] font-bold transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Open Workstation
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
