import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertNotification } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { 
  BellRing, AlertCircle, AlertTriangle, Info, 
  CheckCircle2, ArrowRight, Check 
} from 'lucide-react';

interface AlertsPageProps {
  onNavigate: (module: string, projectId?: string) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({ onNavigate }) => {
  const { alerts, markAlertRead } = useApp();

  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  const filteredAlerts = alerts.filter((a) => {
    if (selectedSeverity !== 'ALL' && a.severity !== selectedSeverity) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Alerts & Action Center' }]} />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gov-gray-300 pb-3">
        <div>
          <h2 className="text-xl font-bold text-gov-navy font-serif flex items-center gap-2">
            <BellRing className="w-5 h-5 text-amber-500" />
            <span>Statutory Compliance Alerts & Action Center</span>
          </h2>
          <p className="text-xs text-gov-gray-600">
            Real-time escalation alerts for 12-month statutory lapsing deadlines, pending Collector e-signs, and field verification backlogs
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="font-bold text-gov-navy">Severity:</span>
          {['ALL', 'Critical', 'Warning', 'Information'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-2.5 py-1 rounded border text-xs font-semibold transition-colors ${
                selectedSeverity === sev
                  ? 'bg-gov-navy text-white border-gov-navy'
                  : 'bg-white text-gov-gray-700 border-gov-gray-300 hover:bg-gov-gray-100'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((a) => {
            let bgClass = 'bg-blue-50/60 border-blue-300 text-blue-950';
            let Icon = Info;
            let iconClass = 'text-blue-700';

            if (a.severity === 'Warning') {
              bgClass = 'bg-amber-50/70 border-amber-300 text-amber-950';
              Icon = AlertTriangle;
              iconClass = 'text-amber-700';
            } else if (a.severity === 'Critical') {
              bgClass = 'bg-red-50/80 border-red-300 text-red-950';
              Icon = AlertCircle;
              iconClass = 'text-red-700';
            }

            return (
              <div
                key={a.id}
                className={`p-4 rounded border ${bgClass} shadow-2xs flex flex-wrap items-start justify-between gap-4 transition-all`}
              >
                <div className="flex items-start gap-3 max-w-3xl">
                  <div className={`p-1.5 rounded-full bg-white shadow-2xs ${iconClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-current">
                        {a.severity}
                      </span>
                      <span className="font-semibold text-gov-navy">{a.category}</span>
                      {a.projectName && (
                        <span className="text-gov-gray-600 font-medium">&bull; {a.projectName}</span>
                      )}
                      <span className="text-[10px] text-gov-gray-500 font-mono">
                        {new Date(a.createdAt).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold font-serif leading-snug">{a.title}</h4>
                    <p className="text-gov-gray-800 leading-relaxed text-xs">{a.message}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-center">
                  {!a.isRead && (
                    <button
                      onClick={() => markAlertRead(a.id)}
                      className="px-2.5 py-1 bg-white text-gov-gray-700 border border-gov-gray-300 text-xs rounded hover:bg-gov-gray-100 flex items-center gap-1 font-medium"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Acknowledged</span>
                    </button>
                  )}
                  {a.actionLink && (
                    <button
                      onClick={() => {
                        markAlertRead(a.id);
                        if (a.actionLink?.includes('workflow')) onNavigate('workflow');
                        else if (a.actionLink?.includes('compensation')) onNavigate('compensation');
                        else if (a.actionLink?.includes('randr')) onNavigate('randr');
                        else if (a.actionLink?.includes('parcels')) onNavigate('parcels');
                        else onNavigate('dashboard');
                      }}
                      className="px-3 py-1 bg-gov-navy text-white text-xs font-semibold rounded hover:bg-gov-navy-hover flex items-center gap-1"
                    >
                      <span>Take Action</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center bg-white border border-gov-gray-300 rounded text-gov-gray-500 text-xs">
            <p className="font-bold text-sm text-gov-gray-700 font-serif">No Operational Alerts Found</p>
            <p className="mt-1">All statutory timelines and verification workflows are currently within designated thresholds.</p>
          </div>
        )}
      </div>
    </div>
  );
};
