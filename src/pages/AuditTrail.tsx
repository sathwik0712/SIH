import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import type { AuditLog } from '../types';
import type { Column } from '../components/common/DataTable';
import { DataTable } from '../components/common/DataTable';
import { ShieldCheck } from 'lucide-react';

export const AuditTrail: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiFetch<AuditLog[]>('/audit-logs')
      .then(res => {
        if (res.success && res.data) {
          setLogs(res.data);
        }
      })
      .catch(err => console.error('Failed to load audit logs:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const columns: Column<AuditLog>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      sortable: true,
      render: item => (
        <span className="font-mono text-[11px] text-slate-700">
          {item.timestamp ? new Date(item.timestamp).toLocaleString('en-IN') : '—'}
        </span>
      ),
    },
    {
      key: 'username',
      header: 'Official / Role',
      sortable: true,
      render: item => (
        <div>
          <span className="font-semibold text-slate-900">{item.username}</span>
          <span className="text-[10px] text-slate-500 block font-mono">{item.role}</span>
        </div>
      ),
    },
    {
      key: 'module',
      header: 'Module',
      sortable: true,
      render: item => (
        <span className="px-2 py-0.5 bg-gov-navy-50 text-gov-navy-800 border border-gov-navy-200 rounded text-[11px] font-mono">
          {item.module}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      sortable: true,
      render: item => (
        <span className="font-bold text-slate-800 text-xs font-mono">{item.action}</span>
      ),
    },
    {
      key: 'entityId',
      header: 'Entity Ref',
      sortable: true,
      render: item => (
        <span className="font-mono text-slate-600 text-[11px]">{item.entityId || '—'}</span>
      ),
    },
    {
      key: 'details',
      header: 'Audit Trail Remarks & Verification Record',
      render: item => (
        <div className="text-slate-700 text-xs leading-relaxed max-w-md">
          {item.details}
          {item.previousStatus && item.newStatus && (
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
              Transition: <span className="line-through">{item.previousStatus}</span> → <strong className="text-emerald-700">{item.newStatus}</strong>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'ipAddress',
      header: 'IP Address',
      render: item => (
        <span className="font-mono text-[10px] text-slate-400">{item.ipAddress || '127.0.0.1'}</span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-gov-navy-900">National Compliance Audit Trail</h2>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded text-[10px] font-semibold flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Tamper-Evident Single Source of Truth</span>
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Immutable statutory event log capturing all state changes, field verifications, awards, and compensation disbursals.
          </p>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={logs}
        isLoading={isLoading}
        searchPlaceholder="Search audit trail by official, role, action, or module..."
        searchField={l => `${l.username} ${l.role} ${l.module} ${l.action} ${l.details} ${l.entityId}`}
      />
    </div>
  );
};
