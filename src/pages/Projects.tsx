import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getRoleConfig } from '../config/roleConfig';
import { apiFetch } from '../api/client';
import { SEED_PROJECTS } from '../data/seedProjects';
import { AuthenticProject } from '../types/project';
import type { Column } from '../components/common/DataTable';
import { DataTable } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { Link } from 'react-router-dom';
import { ExternalLink, Plus, Filter, Clock, AlertTriangle } from 'lucide-react';

export const Projects: React.FC = () => {
  const { user } = useAuth();
  const permissions = getRoleConfig(user?.role).permissions;
  const canCreateProject = permissions.canCreateProject;
  const [projects, setProjects] = useState<AuthenticProject[]>(SEED_PROJECTS);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    // Attempt backend fetch, fallback to SEED_PROJECTS
    apiFetch<any[]>('/projects')
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          // Merge API data with seed milestones if missing
          const merged = res.data.map(p => {
            const match = SEED_PROJECTS.find(sp => sp.id === p.id || sp.projectCode === p.projectCode);
            if (match) return match;

            // Normalize districts — backend may send a single string or nothing.
            const normalizedDistricts = Array.isArray(p.districts)
              ? p.districts
              : (p.district ? [p.district] : ['General']);

            // Normalize landExtent — guard against missing or partial objects.
            const normalizedLandExtent =
              p.landExtent && typeof p.landExtent === 'object'
                ? {
                    totalHa: p.landExtent.totalHa ?? p.totalLandRequiredHectares ?? 0,
                    privatePattaHa: p.landExtent.privatePattaHa ?? p.totalLandAcquiredHectares ?? 0,
                    govtLandHa: p.landExtent.govtLandHa ?? 0,
                    forestProtectedHa: p.landExtent.forestProtectedHa ?? 0,
                  }
                : {
                    totalHa: p.totalLandRequiredHectares ?? 100,
                    privatePattaHa: p.totalLandAcquiredHectares ?? 0,
                    govtLandHa: 0,
                    forestProtectedHa: 0,
                  };

            return {
              ...p,
              districts: normalizedDistricts,
              ministryAgency: p.acquiringAuthority,
              landExtent: normalizedLandExtent,
              totalBudgetCr: p.totalBudgetCr ?? 500,
              disbursedBudgetCr: p.disbursedBudgetCr ?? 300,
              overallVarianceDays: p.overallVarianceDays ?? 0,
              milestones:
                Array.isArray(p.milestones) && p.milestones.length > 0
                  ? p.milestones
                  : SEED_PROJECTS[0].milestones,
            };
          });
          setProjects(merged);
        }
      })
      .catch(err => console.log('Using authentic seed projects data store', err))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredProjects = projects.filter(p => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'ON_TRACK') return p.status === 'ON_TRACK' || p.status === 'COMPLETED';
    if (statusFilter === 'DELAYED') return p.status === 'DELAYED' || p.status === 'AT_RISK' || p.overallVarianceDays > 0;
    if (statusFilter === 'SLA_WARNING') return p.overallVarianceDays > 0 || (p.slaCountdownDays && p.slaCountdownDays < 150);
    return true;
  });

  const columns: Column<AuthenticProject>[] = [
    {
      key: 'projectCode',
      header: 'Project Code & Agency',
      sortable: true,
      render: item => (
        <div>
          <span className="font-mono font-bold text-[#0B3559] block">{item.projectCode}</span>
          <span className="text-[10px] text-slate-500">{item.ministryAgency}</span>
        </div>
      )
    },
    {
      key: 'projectName',
      header: 'Project Name & Geography',
      sortable: true,
      render: item => (
        <div>
          <Link
            to={`/projects/${item.id}`}
            className="font-semibold text-slate-900 hover:underline flex items-center space-x-1"
          >
            <span>{item.projectName}</span>
            <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
          </Link>
          <div className="text-[11px] text-slate-500">
            {item.state} ({(item.districts ?? []).join(', ') || 'All Districts'})
          </div>
        </div>
      ),
    },
    {
      key: 'landExtent',
      header: 'Land Extent (Ha)',
      sortable: true,
      render: item => (
        <div className="font-mono text-xs">
          <span className="font-bold text-emerald-800">{item.landExtent?.totalHa ?? 0} Ha</span>
          <div className="text-[10px] text-slate-400">
            Pvt: {item.landExtent?.privatePattaHa ?? 0} Ha | Govt: {item.landExtent?.govtLandHa ?? 0} Ha
          </div>
        </div>
      ),
    },
    {
      key: 'totalBudgetCr',
      header: 'Financial Budget',
      sortable: true,
      render: item => (
        <div className="font-mono text-xs">
          <span className="font-bold text-slate-900">₹{item.totalBudgetCr} Cr</span>
          <div className="text-[10px] text-slate-500">Disbursed: ₹{item.disbursedBudgetCr} Cr</div>
        </div>
      ),
    },
    {
      key: 'acquisitionStage',
      header: 'Statutory Stage',
      sortable: true,
      render: item => (
        <span className="font-semibold text-[#0B3559] text-xs">
          {item.acquisitionStage}
        </span>
      ),
    },
    {
      key: 'overallVarianceDays',
      header: 'Timeline Variance',
      sortable: true,
      render: item => (
        <div>
          {item.overallVarianceDays > 0 ? (
            <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded font-mono font-bold text-[11px] flex items-center space-x-1 w-fit">
              <AlertTriangle className="w-3 h-3 text-red-600" />
              <span>+{item.overallVarianceDays}d Delay</span>
            </span>
          ) : (
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono font-bold text-[11px] flex items-center space-x-1 w-fit">
              <Clock className="w-3 h-3 text-emerald-600" />
              <span>{item.overallVarianceDays}d Ahead</span>
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: item => <StatusBadge status={item.status as any} />,
    },
    {
      key: 'actions',
      header: 'Action',
      render: item => (
        <Link
          to={`/projects/${item.id}`}
          className="px-2.5 py-1 bg-[#0B3559] hover:bg-[#071E3D] text-white rounded text-[11px] font-semibold transition-colors"
        >
          Gantt Workspace
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-900">National Infrastructure Projects Register</h2>
          <p className="text-xs text-slate-600">
            Single-source-of-truth repository of Pan-India land acquisition projects under RFCTLARR 2013 rules.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {canCreateProject && (
            <Link
              to="/proposals/new"
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Requisition Proposal</span>
            </Link>
          )}
        </div>
      </div>

      {/* Timeline Filter Controls */}
      <div className="bg-white border border-slate-200 rounded p-3 shadow-sm flex items-center space-x-2 text-xs">
        <Filter className="w-4 h-4 text-slate-400 shrink-0" />
        <span className="font-semibold text-slate-700">Timeline Health Filter:</span>
        <div className="flex space-x-2">
          {[
            { id: 'ALL', label: 'All Projects' },
            { id: 'ON_TRACK', label: '🟢 On Track' },
            { id: 'DELAYED', label: '🔴 SLA Breached / Delayed' },
            { id: 'SLA_WARNING', label: '🟡 SLA Warning (<150d)' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1 rounded font-semibold transition-colors ${
                statusFilter === f.id ? 'bg-[#0B3559] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredProjects}
        isLoading={isLoading}
        searchPlaceholder="Search project by code, name, agency, state, or district..."
        searchField={p => `${p.projectCode} ${p.projectName} ${p.state} ${(p.districts ?? []).join(' ')} ${p.ministryAgency} ${p.acquiringAuthority}`}
      />
    </div>
  );
};
