import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import type { ProjectSummary } from '../types';
import type { Column } from '../components/common/DataTable';
import { DataTable } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { Link } from 'react-router-dom';
import { ExternalLink, Plus } from 'lucide-react';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiFetch<ProjectSummary[]>('/projects')
      .then(res => {
        if (res.success && res.data) {
          setProjects(res.data);
        }
      })
      .catch(err => console.error('Failed to load projects:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const columns: Column<ProjectSummary>[] = [
    {
      key: 'projectCode',
      header: 'Project Code',
      sortable: true,
      className: 'font-mono font-semibold text-gov-navy-800',
    },
    {
      key: 'projectName',
      header: 'Project Name & Description',
      sortable: true,
      render: item => (
        <div>
          <Link
            to={`/projects/${item.id}`}
            className="font-semibold text-gov-navy-900 hover:underline flex items-center space-x-1"
          >
            <span>{item.projectName}</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>
          <div className="text-[11px] text-slate-500">
            {item.state} • {item.district}
          </div>
        </div>
      ),
    },
    {
      key: 'acquiringAuthority',
      header: 'Authority',
      sortable: true,
      render: item => (
        <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-medium text-slate-700">
          {item.acquiringAuthority}
        </span>
      ),
    },
    {
      key: 'totalLandRequiredHectares',
      header: 'Land (Ha)',
      sortable: true,
      render: item => (
        <div className="font-mono">
          <span className="font-bold">{item.totalLandAcquiredHectares?.toFixed(1) || '0'}</span>
          <span className="text-slate-400"> / {item.totalLandRequiredHectares?.toFixed(1) || '0'}</span>
        </div>
      ),
    },
    {
      key: 'acquisitionStage',
      header: 'Acquisition Stage',
      sortable: true,
      render: item => (
        <span className="font-medium text-gov-navy-800 text-xs">
          {item.acquisitionStage}
        </span>
      ),
    },
    {
      key: 'progressPercentage',
      header: 'Progress',
      sortable: true,
      render: item => (
        <div className="w-24">
          <div className="flex justify-between text-[10px] text-slate-600 mb-0.5">
            <span>{item.progressPercentage}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gov-navy-800 h-1.5 rounded-full"
              style={{ width: `${item.progressPercentage}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: item => <StatusBadge status={item.status} />,
    },
    {
      key: 'actions',
      header: 'Action',
      render: item => (
        <Link
          to={`/projects/${item.id}`}
          className="px-2.5 py-1 bg-gov-navy-800 hover:bg-gov-navy-900 text-white rounded text-[11px] font-medium transition-colors"
        >
          Open Workspace
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-gov-navy-900">National Project Register</h2>
          <p className="text-xs text-slate-600">
            Official repository of all requisitioned land acquisition projects across Indian States & UTs.
          </p>
        </div>
        <button
          onClick={() => alert('Add Project Requisition modal will be available in Phase 1.')}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Land Requisition</span>
        </button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={projects}
        isLoading={isLoading}
        searchPlaceholder="Search project by code, name, state, or authority..."
        searchField={p => `${p.projectCode} ${p.projectName} ${p.state} ${p.district} ${p.acquiringAuthority}`}
      />
    </div>
  );
};
