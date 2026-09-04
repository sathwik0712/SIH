import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AuditLogEntry } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { DataTable, Column } from '../components/common/DataTable';
import { 
  History, ShieldCheck, FileCheck, Lock, 
  Search, Filter, Download 
} from 'lucide-react';

interface AuditPageProps {
  onNavigate: (module: string, projectId?: string) => void;
}

export const AuditPage: React.FC<AuditPageProps> = ({ onNavigate }) => {
  const { auditLogs } = useApp();

  const [filterModule, setFilterModule] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter((a) => {
    if (filterModule !== 'ALL' && a.module !== filterModule) return false;
    return true;
  });

  const columns: Column<AuditLogEntry>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp (IST)',
      sortable: true,
      render: (a) => (
        <div>
          <span className="font-mono text-xs font-semibold text-gov-gray-900">{a.timestamp}</span>
          <div className="text-[10px] text-gov-gray-500 font-mono">{a.ipAddress}</div>
        </div>
      ),
      width: '160px',
    },
    {
      key: 'user',
      header: 'Officer / User Persona',
      sortable: true,
      render: (a) => (
        <div>
          <div className="font-bold text-gov-navy text-xs">{a.user}</div>
          <div className="text-[10px] text-amber-800 font-mono">{a.role}</div>
        </div>
      ),
      width: '180px',
    },
    {
      key: 'module',
      header: 'Statutory Module',
      sortable: true,
      render: (a) => (
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
          {a.module}
        </span>
      ),
      width: '140px',
    },
    {
      key: 'action',
      header: 'Statutory Action Executed',
      sortable: true,
      render: (a) => (
        <div>
          <div className="font-semibold text-gov-gray-900 text-xs">{a.action}</div>
          <div className="text-[10px] text-gov-gray-500 font-mono">Entity: {a.entityId}</div>
        </div>
      ),
    },
    {
      key: 'details',
      header: 'Audit Particulars & Status Transition',
      sortable: true,
      render: (a) => (
        <div className="text-xs text-gov-gray-700 leading-snug">
          {a.details}
          {a.previousStatus && a.newStatus && (
            <div className="text-[10px] font-mono text-emerald-800 mt-0.5">
              [{a.previousStatus} &rarr; {a.newStatus}]
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Statutory Audit Trail' }]} />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gov-gray-300 pb-3">
        <div>
          <h2 className="text-xl font-bold text-gov-navy font-serif flex items-center gap-2">
            <History className="w-5 h-5 text-amber-500" />
            <span>Immutable Statutory Compliance Audit Trail</span>
          </h2>
          <p className="text-xs text-gov-gray-600">
            Cryptographically sealed immutable log of all state-changing administrative actions, compensation transfers, and award sign-offs
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="bg-emerald-100 text-emerald-950 px-2.5 py-1 rounded font-medium border border-emerald-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>IT Act 2000 Statutory Non-Repudiation Seal</span>
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-3 bg-gov-gray-100 border border-gov-gray-300 rounded flex flex-wrap items-center gap-3 text-xs">
        <span className="font-bold text-gov-navy uppercase tracking-wider">Filters:</span>

        <label className="flex items-center gap-1">
          <span className="text-gov-gray-700">Module:</span>
          <select
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
            className="px-2 py-1 text-xs border border-gov-gray-300 rounded bg-white"
          >
            <option value="ALL">All Modules</option>
            <option value="Projects">Projects</option>
            <option value="Land Parcels">Land Parcels</option>
            <option value="Field Revenue Officer">Field Operations</option>
            <option value="Notifications">Notifications</option>
            <option value="Claims & Objections">Objections</option>
            <option value="Awards">Awards</option>
            <option value="Compensation">Compensation & DBT</option>
            <option value="Physical Possession">Physical Possession</option>
          </select>
        </label>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredLogs}
        searchPlaceholder="Search audit log by officer, entity ID, action, or keyword..."
        title={`Audit Trail System Records (${filteredLogs.length} events)`}
        subtitle="Chronological sequence of all system transactions and administrative updates"
        exportFileName="bhoomisetu_audit_trail"
      />
    </div>
  );
};
