import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AffectedFamily } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { DataTable, Column } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  Users, UserCheck, AlertTriangle, ShieldCheck, 
  Home, HeartHandshake, FileSpreadsheet 
} from 'lucide-react';

interface AffectedFamiliesPageProps {
  onNavigate: (module: string, projectId?: string) => void;
}

export const AffectedFamiliesPage: React.FC<AffectedFamiliesPageProps> = ({ onNavigate }) => {
  const { families, projects } = useApp();

  const [filterProject, setFilterProject] = useState<string>('ALL');
  const [filterSocialCategory, setFilterSocialCategory] = useState<string>('ALL');
  const [filterDisplaced, setFilterDisplaced] = useState<string>('ALL');

  const filteredFamilies = families.filter((f) => {
    if (filterProject !== 'ALL' && f.projectId !== filterProject) return false;
    if (filterSocialCategory !== 'ALL' && f.socialCategory !== filterSocialCategory) return false;
    if (filterDisplaced !== 'ALL') {
      const isD = filterDisplaced === 'YES';
      if (f.isDisplaced !== isD) return false;
    }
    return true;
  });

  const displacedCount = families.filter(f => f.isDisplaced).length;
  const scStCount = families.filter(f => f.socialCategory === 'SC' || f.socialCategory === 'ST').length;

  const columns: Column<AffectedFamily>[] = [
    {
      key: 'id',
      header: 'Family Census ID',
      sortable: true,
      render: (f) => <span className="font-mono font-bold text-gov-navy text-xs">{f.id}</span>,
      width: '130px',
    },
    {
      key: 'headOfFamily',
      header: 'Head of Affected Family',
      sortable: true,
      render: (f) => (
        <div>
          <div className="font-bold text-gov-gray-900 text-xs">{f.headOfFamily}</div>
          <div className="text-[10px] text-gov-gray-500">Father/Spouse: {f.fatherOrHusbandName}</div>
        </div>
      ),
    },
    {
      key: 'village',
      header: 'Village & Survey No.',
      sortable: true,
      render: (f) => (
        <div>
          <div className="font-medium text-gov-gray-900">{f.village}</div>
          <div className="text-[10px] text-gov-gray-500 font-mono">Survey {f.surveyNumberAffected}</div>
        </div>
      ),
    },
    {
      key: 'socialCategory',
      header: 'Social Category',
      sortable: true,
      align: 'center',
      render: (f) => (
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
          {f.socialCategory}
        </span>
      ),
      width: '110px',
    },
    {
      key: 'vulnerabilityStatus',
      header: 'Vulnerability Class',
      sortable: true,
      render: (f) => (
        <span className={`text-[11px] font-medium ${f.vulnerabilityStatus !== 'Standard' ? 'text-amber-900 font-semibold' : 'text-gov-gray-600'}`}>
          {f.vulnerabilityStatus}
        </span>
      ),
      width: '140px',
    },
    {
      key: 'isDisplaced',
      header: 'Physically Displaced?',
      sortable: true,
      align: 'center',
      render: (f) => (
        f.isDisplaced ? (
          <span className="px-2 py-0.5 rounded bg-red-100 text-red-900 font-semibold text-[10px] border border-red-200">
            YES &mdash; Relocation Req.
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-semibold text-[10px] border border-emerald-200">
            NO &mdash; Land Only
          </span>
        )
      ),
      width: '160px',
    },
    {
      key: 'titleHolder',
      header: 'Tenure Status',
      sortable: true,
      align: 'center',
      render: (f) => (
        <span className="text-[11px] text-gov-gray-700">
          {f.titleHolder ? 'Titleholder' : 'Non-Titleholder / Tenant'}
        </span>
      ),
      width: '160px',
    },
    {
      key: 'eligibilityStatus',
      header: 'Statutory Eligibility',
      sortable: true,
      align: 'center',
      render: (f) => <StatusBadge status={f.eligibilityStatus} size="sm" />,
      width: '180px',
    },
    {
      key: 'actions',
      header: 'R&R Scheme',
      align: 'center',
      render: (f) => (
        <button
          onClick={() => onNavigate('randr')}
          className="px-2 py-1 bg-gov-navy text-white text-[11px] rounded font-medium hover:bg-gov-navy-hover"
        >
          View Benefits &rarr;
        </button>
      ),
      width: '120px',
    },
  ];

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Affected Families (SIA Census)' }]} />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gov-gray-300 pb-3">
        <div>
          <h2 className="text-xl font-bold text-gov-navy font-serif flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            <span>Social Impact Assessment (SIA) Family Census Registry</span>
          </h2>
          <p className="text-xs text-gov-gray-600">
            Baseline demographic and vulnerability survey of all families affected under Section 4(1) of RFCTLARR Act
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-white rounded border border-gov-gray-300">
          <span className="text-gov-gray-600 block">Total Affected Families:</span>
          <span className="text-lg font-bold text-gov-navy font-serif">{families.length} Families</span>
        </div>
        <div className="p-3 bg-amber-50 rounded border border-amber-300">
          <span className="text-amber-900 block font-medium">Physically Displaced:</span>
          <span className="text-lg font-bold text-amber-950 font-serif">{displacedCount} Families</span>
        </div>
        <div className="p-3 bg-blue-50 rounded border border-blue-300">
          <span className="text-blue-900 block font-medium">SC / ST Beneficiary Families:</span>
          <span className="text-lg font-bold text-blue-950 font-serif">{scStCount} Families</span>
        </div>
        <div className="p-3 bg-emerald-50 rounded border border-emerald-300">
          <span className="text-emerald-900 block font-medium">R&R Entitlements Allotted:</span>
          <span className="text-lg font-bold text-emerald-950 font-serif">100% Verified</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-3 bg-gov-gray-100 border border-gov-gray-300 rounded flex flex-wrap items-center gap-3 text-xs">
        <span className="font-bold text-gov-navy uppercase tracking-wider">Filters:</span>

        <label className="flex items-center gap-1">
          <span className="text-gov-gray-700">Project:</span>
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="px-2 py-1 text-xs border border-gov-gray-300 rounded bg-white max-w-xs"
          >
            <option value="ALL">All Projects ({projects.length})</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} — {p.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-1">
          <span className="text-gov-gray-700">Social Category:</span>
          <select
            value={filterSocialCategory}
            onChange={(e) => setFilterSocialCategory(e.target.value)}
            className="px-2 py-1 text-xs border border-gov-gray-300 rounded bg-white"
          >
            <option value="ALL">All Categories</option>
            <option value="SC">Scheduled Caste (SC)</option>
            <option value="ST">Scheduled Tribe (ST)</option>
            <option value="OBC">Other Backward Classes (OBC)</option>
            <option value="General">General</option>
          </select>
        </label>

        <label className="flex items-center gap-1">
          <span className="text-gov-gray-700">Displacement Status:</span>
          <select
            value={filterDisplaced}
            onChange={(e) => setFilterDisplaced(e.target.value)}
            className="px-2 py-1 text-xs border border-gov-gray-300 rounded bg-white"
          >
            <option value="ALL">All Families</option>
            <option value="YES">Displaced (Relocation Required)</option>
            <option value="NO">Non-Displaced (Land Acquired Only)</option>
          </select>
        </label>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredFamilies}
        searchPlaceholder="Search head of family, village, survey, or ID..."
        title={`Social Impact Assessment Family Census (${filteredFamilies.length})`}
        subtitle="Baseline census verified prior to publication of statutory preliminary notification"
        exportFileName="bhoomisetu_affected_families_sia"
      />
    </div>
  );
};
