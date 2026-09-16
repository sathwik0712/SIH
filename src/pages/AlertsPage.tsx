import React from 'react';
import { Bell, AlertTriangle, Clock, Info, CheckCircle2, Search, Filter } from 'lucide-react';

interface Alert {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS';
  title: string;
  description: string;
  projectCode: string;
  date: string;
  statutoryDeadline?: string;
  daysRemaining?: number;
}

const ALERTS: Alert[] = [
  { id: 'ALT-1', type: 'CRITICAL', title: 'Sec 19 Declaration Overdue', description: 'Final declaration for Survey 15/1 is pending beyond 12 months from Sec 11 notification. Risk of acquisition lapsing.', projectCode: 'LA-NH48-PNQ', date: 'Today, 09:15 AM', statutoryDeadline: '14 Jun 2025', daysRemaining: -2 },
  { id: 'ALT-2', type: 'WARNING', title: 'SIA Report Submission Due', description: 'Social Impact Assessment report for Phase 2 must be submitted within 15 days.', projectCode: 'LA-MTHL-BOM', date: 'Yesterday, 14:30', statutoryDeadline: '30 Jun 2025', daysRemaining: 14 },
  { id: 'ALT-3', type: 'CRITICAL', title: 'Possession Delay - Sec 38', description: 'Compensation disbursed but physical possession pending for 5 parcels in Moshi village.', projectCode: 'LA-NH48-PNQ', date: '14 Jun 2025', statutoryDeadline: '20 Jun 2025', daysRemaining: 4 },
  { id: 'ALT-4', type: 'INFO', title: 'PFMS Disbursal Batch Scheduled', description: 'Batch #421 for ₹14.5 Cr has been queued for DBT transfer tonight.', projectCode: 'LA-NH48-PNQ', date: '14 Jun 2025' },
  { id: 'ALT-5', type: 'SUCCESS', title: 'Objection Hearing Completed', description: 'Sec 15 hearings for 12 objections in Chikhali successfully concluded.', projectCode: 'LA-NH48-PNQ', date: '12 Jun 2025' },
  { id: 'ALT-6', type: 'WARNING', title: 'R&R Plot Allotment Pending', description: '15 families in Alandi awaiting house plot allocation in resettlement colony.', projectCode: 'LA-NH48-PNQ', date: '10 Jun 2025', statutoryDeadline: '15 Jul 2025', daysRemaining: 29 },
];

const alertStyle = {
  CRITICAL: { border: 'border-red-200', bg: 'bg-red-50', text: 'text-red-800', icon: AlertTriangle, iconColor: 'text-red-600' },
  WARNING:  { border: 'border-amber-200', bg: 'bg-amber-50', text: 'text-amber-800', icon: Clock, iconColor: 'text-amber-600' },
  INFO:     { border: 'border-blue-200', bg: 'bg-blue-50', text: 'text-blue-800', icon: Info, iconColor: 'text-blue-600' },
  SUCCESS:  { border: 'border-emerald-200', bg: 'bg-emerald-50', text: 'text-emerald-800', icon: CheckCircle2, iconColor: 'text-emerald-600' },
};

export const AlertsPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-600 rounded flex items-center justify-center">
            <Bell className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#0B3559]">Statutory Alerts & Notifications</h1>
            <p className="text-xs text-slate-500">Automated deadline warnings and workflow escalations</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 space-y-3">
          {ALERTS.map(alert => {
            const style = alertStyle[alert.type];
            const Icon = style.icon;
            return (
              <div key={alert.id} className={`border rounded-lg p-4 shadow-sm ${style.bg} ${style.border} flex items-start gap-4`}>
                <div className={`mt-0.5 ${style.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className={`text-sm font-bold ${style.text}`}>{alert.title}</h3>
                    <span className="text-[11px] font-mono text-slate-500 bg-white/50 px-2 py-0.5 rounded border border-white/40">{alert.date}</span>
                  </div>
                  <p className="text-xs mt-1 text-slate-700 font-medium">{alert.description}</p>
                  
                  <div className="flex flex-wrap gap-3 mt-3 pt-2 border-t border-black/5">
                    <div className="text-[11px]">
                      <span className="text-slate-500">Project: </span>
                      <span className="font-semibold font-mono text-slate-800">{alert.projectCode}</span>
                    </div>
                    {alert.statutoryDeadline && (
                      <div className="text-[11px]">
                        <span className="text-slate-500">Statutory Deadline: </span>
                        <span className="font-semibold text-slate-800">{alert.statutoryDeadline}</span>
                      </div>
                    )}
                    {alert.daysRemaining !== undefined && (
                      <div className={`text-[11px] font-bold px-2 py-0.5 rounded ${alert.daysRemaining < 0 ? 'bg-red-200 text-red-900' : 'bg-amber-200 text-amber-900'}`}>
                        {alert.daysRemaining < 0 ? `Overdue by ${Math.abs(alert.daysRemaining)} days` : `${alert.daysRemaining} days remaining`}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="hidden lg:block w-72 space-y-4">
          <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Alert Summary</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 bg-red-50 text-red-800 rounded">
                <span>Critical Escalations</span>
                <span className="font-bold font-mono">2</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-amber-50 text-amber-800 rounded">
                <span>Deadline Warnings</span>
                <span className="font-bold font-mono">2</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-blue-50 text-blue-800 rounded">
                <span>Info / System</span>
                <span className="font-bold font-mono">1</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-emerald-50 text-emerald-800 rounded">
                <span>Success / Resolved</span>
                <span className="font-bold font-mono">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
