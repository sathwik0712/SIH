import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_USERS } from '../data/seedData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { 
  Settings2, ShieldCheck, RefreshCw, Server, 
  Users, Database, CheckCircle2, RotateCcw, Lock 
} from 'lucide-react';

interface AdminPageProps {
  onNavigate: (module: string, projectId?: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const { currentUser, switchRole, integrations, syncIntegration, resetAllDemoData } = useApp();

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [syncingIndex, setSyncingIndex] = useState<number | null>(null);

  const handleSyncClick = (idx: number) => {
    setSyncingIndex(idx);
    setTimeout(() => {
      syncIntegration(idx);
      setSyncingIndex(null);
    }, 600);
  };

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Administration & Gateway Integrations' }]} />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gov-gray-300 pb-3">
        <div>
          <h2 className="text-xl font-bold text-gov-navy font-serif flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-amber-500" />
            <span>Administration, RBAC & National Gateway Integrations</span>
          </h2>
          <p className="text-xs text-gov-gray-600">
            Role-Based Access Control (RBAC), simulated external government APIs, and database lifecycle management
          </p>
        </div>

        <button
          onClick={() => setIsResetConfirmOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold rounded transition-colors shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Factory Demo Seed</span>
        </button>
      </div>

      {/* 1. External Integration Status Panel (§9 of Spec) */}
      <div className="bg-white border border-gov-gray-300 rounded p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-gov-gray-200 pb-2">
          <div>
            <h3 className="text-sm font-bold text-gov-navy font-serif flex items-center gap-1.5">
              <Server className="w-4 h-4 text-amber-500" />
              <span>National External System Integration Gateways (Mock Abstraction Layer)</span>
            </h3>
            <p className="text-xs text-gov-gray-600">
              Pluggable service layer structured for seamless integration with real government APIs
            </p>
          </div>
          <span className="text-[11px] bg-emerald-100 text-emerald-950 font-bold px-2 py-0.5 rounded border border-emerald-300">
            4 / 4 Gateways Connected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {integrations.map((item, idx) => (
            <div
              key={idx}
              className="p-3 bg-gov-gray-50 rounded border border-gov-gray-200 text-xs space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-gov-navy text-xs leading-tight">
                    {item.name}
                  </h4>
                  <StatusBadge status={item.status} size="sm" />
                </div>
                <p className="text-[11px] text-gov-gray-600 mt-1">
                  Provider: <strong>{item.provider}</strong>
                </p>
              </div>

              <div className="pt-2 border-t border-gov-gray-200 flex items-center justify-between text-[11px] text-gov-gray-500">
                <div>
                  Latency: <strong>{item.latencyMs} ms</strong> &bull; Records Synced: <strong>{item.recordsSyncedCount}</strong>
                </div>
                <button
                  onClick={() => handleSyncClick(idx)}
                  disabled={syncingIndex === idx}
                  className="px-2 py-0.5 bg-white border border-gov-gray-300 rounded hover:bg-gov-gray-100 text-gov-navy font-medium flex items-center gap-1 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${syncingIndex === idx ? 'animate-spin' : ''}`} />
                  <span>Sync</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. RBAC User Accounts Registry */}
      <div className="bg-white border border-gov-gray-300 rounded p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-gov-gray-200 pb-2">
          <div>
            <h3 className="text-sm font-bold text-gov-navy font-serif flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-500" />
              <span>Role-Based Access Control (RBAC) Demo User Personas</span>
            </h3>
            <p className="text-xs text-gov-gray-600">
              Select persona to test granular permission scopes and jurisdictional views
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {DEMO_USERS.map((user) => {
            const isActive = currentUser.id === user.id;
            return (
              <div
                key={user.id}
                className={`p-3 rounded border transition-all ${
                  isActive
                    ? 'bg-blue-50/80 border-gov-navy shadow-xs ring-1 ring-gov-navy'
                    : 'bg-gov-gray-50 border-gov-gray-200 hover:border-gov-navy/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <span className="font-mono text-[10px] text-gov-gray-500">{user.id}</span>
                    <h4 className="font-bold text-gov-navy text-xs">{user.name}</h4>
                  </div>
                  {isActive ? (
                    <span className="bg-gov-navy text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      ACTIVE
                    </span>
                  ) : (
                    <button
                      onClick={() => switchRole(user.role)}
                      className="px-2 py-0.5 bg-white border border-gov-gray-300 rounded text-[11px] font-semibold text-gov-navy hover:bg-gov-gray-100"
                    >
                      Switch
                    </button>
                  )}
                </div>

                <p className="text-[11px] font-medium text-gov-gray-800">{user.designation}</p>
                <p className="text-[10px] text-gov-gray-500 mt-0.5">{user.department}</p>
                <div className="mt-2 pt-1 border-t border-gov-gray-200 text-[10px] text-amber-800 font-mono">
                  Role: <strong>{user.role}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsResetConfirmOpen(false)}
          title="Confirm System Factory Reset"
          subtitle="Reverts all land parcels, compensation disbursements, awards, and audit logs to SIH seed defaults"
          maxWidth="md"
          actions={
            <>
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3 py-1.5 border border-gov-gray-300 rounded bg-white text-gov-gray-700 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetAllDemoData();
                  setIsResetConfirmOpen(false);
                }}
                className="px-4 py-1.5 bg-red-700 text-white text-xs font-bold rounded hover:bg-red-800"
              >
                Execute Factory Reset
              </button>
            </>
          }
        >
          <div className="space-y-2 text-xs text-gov-gray-800">
            <p>
              This action will reset your browser's local storage data and re-initialize the standard SIH 2026 evaluation dataset (10 projects, 100+ parcels, 50+ families, PFMS records).
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};
