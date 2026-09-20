import React from 'react';
import { AuthenticProject } from '../../types/project';
import {
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  projects: AuthenticProject[];
}

export const TimelineDelayRadar: React.FC<Props> = ({ projects }) => {
  const delayedProjects = projects.filter(p => p.status === 'DELAYED' || p.status === 'AT_RISK' || p.overallVarianceDays > 0);
  const onTimeProjects = projects.filter(p => p.status === 'ON_TRACK' || p.status === 'COMPLETED');

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-red-600" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            National Timeline Health &amp; Delay Radar
          </h3>
        </div>
        <span className="text-[11px] font-mono font-bold text-slate-600">
          {delayedProjects.length} Delayed / {projects.length} Total
        </span>
      </div>

      {/* Progress Metric Bar */}
      <div className="space-y-1 text-xs">
        <div className="flex justify-between font-medium text-slate-700 text-[11px]">
          <span>On-Time Ratio ({Math.round((onTimeProjects.length / (projects.length || 1)) * 100)}%)</span>
          <span className="text-red-700 font-bold">{delayedProjects.length} Flagged SLA Delays</span>
        </div>
        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
          <div
            className="bg-emerald-600 h-2.5"
            style={{ width: `${(onTimeProjects.length / (projects.length || 1)) * 100}%` }}
          />
          <div
            className="bg-red-600 h-2.5"
            style={{ width: `${(delayedProjects.length / (projects.length || 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Critical Bottlenecks Queue */}
      <div className="space-y-2 pt-1">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
          Critical SLA Bottlenecks Requiring Intervention
        </span>

        {delayedProjects.length === 0 ? (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded text-center">
            ✓ All projects are operating within statutory SLA limits.
          </div>
        ) : (
          delayedProjects.map(p => {
            const breachMilestone = p.milestones.find(m => m.status === 'CRITICAL_SLA_BREACH' || m.status === 'DELAYED');

            return (
              <div key={p.id} className="p-3 bg-red-50/60 border border-red-200 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-red-900">{p.projectCode}</span>
                    <span className="font-bold text-slate-900">{p.projectName}</span>
                    <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-mono font-bold">
                      +{p.overallVarianceDays} Days Delay
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    {p.state} • Stage: <strong>{p.acquisitionStage}</strong> • Cause: <span className="text-red-800 italic">{breachMilestone?.bottleneckReason || 'Statutory delay'}</span>
                  </p>
                </div>

                <Link
                  to={`/projects/${p.id}`}
                  className="px-2.5 py-1 bg-red-800 hover:bg-red-900 text-white font-semibold text-[11px] rounded transition-colors flex items-center space-x-1 shrink-0"
                >
                  <span>Gantt Radar</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
