import React, { useState } from 'react';
import { AuthenticProject, StatutoryMilestone } from '../../types/project';
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Info,
  UserCheck,
  FileText,
  X
} from 'lucide-react';

interface Props {
  project: AuthenticProject;
}

export const ProjectTimelineGantt: React.FC<Props> = ({ project }) => {
  const [selectedMilestone, setSelectedMilestone] = useState<StatutoryMilestone | null>(null);

  // Safely normalise milestones — guard against undefined/null from API-sourced projects.
  const milestones = Array.isArray(project.milestones) ? project.milestones : [];
  const totalMilestones = milestones.length || 1; // avoid division by zero
  const completedMilestones = milestones.filter(m => m.status === 'COMPLETED').length;
  const progressPct = Math.round((completedMilestones / totalMilestones) * 100);

  const getStatusBadge = (milestone: StatutoryMilestone) => {
    switch (milestone.status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[11px]">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Completed</span>
          </span>
        );
      case 'ON_TRACK':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold text-[11px]">
            <Clock className="w-3 h-3 text-blue-600" />
            <span>On Track</span>
          </span>
        );
      case 'CRITICAL_SLA_BREACH':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-red-100 text-red-800 rounded font-bold text-[11px] animate-pulse">
            <AlertTriangle className="w-3 h-3 text-red-600" />
            <span>SLA Breach (+{milestone.varianceDays}d)</span>
          </span>
        );
      case 'DELAYED':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-semibold text-[11px]">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            <span>Delayed (+{milestone.varianceDays}d)</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px]">
            <span>Pending</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
      {/* Header & KPI Summary */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-3 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-[#0B3559]" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              RFCTLARR 2013 Statutory Gantt Timeline &amp; SLA Tracking Engine
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Single-source-of-truth dual-bar milestone comparison for <strong className="text-slate-900">{project.projectCode}</strong>
          </p>
        </div>

        {/* 3 Key KPI Badges */}
        <div className="flex flex-wrap gap-2 text-xs">
          {/* Statutory Expiry Countdown */}
          <div className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>
              Sec 19 Statutory SLA Limit: <strong className="font-mono text-amber-900 font-bold">{project.slaCountdownDays} Days Remaining</strong>
            </span>
          </div>

          {/* Time Variance */}
          <div className={`px-3 py-1.5 rounded border flex items-center space-x-1.5 ${
            project.overallVarianceDays > 0 ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>
              Overall Schedule Variance:{' '}
              <strong className="font-mono font-bold">
                {project.overallVarianceDays > 0 ? `+${project.overallVarianceDays} Days Delay` : `${project.overallVarianceDays} Days Ahead`}
              </strong>
            </span>
          </div>

          {/* Progress Percentage */}
          <div className="px-3 py-1.5 bg-slate-900 text-white rounded font-mono font-bold flex items-center gap-1.5">
            <span>Lifecycle: {progressPct}% Done</span>
          </div>
        </div>
      </div>

      {/* Dual-Bar Visual Gantt Chart */}
      <div className="space-y-4 pt-1">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-2">
          <span>STATUTORY STAGE</span>
          <div className="flex items-center space-x-4 font-mono">
            <span className="flex items-center gap-1"><span className="w-3 h-2 bg-slate-300 rounded-xs inline-block" /> Planned Statutory Window</span>
            <span className="flex items-center gap-1"><span className="w-3 h-2 bg-emerald-600 rounded-xs inline-block" /> Completed / On Track</span>
            <span className="flex items-center gap-1"><span className="w-3 h-2 bg-red-600 rounded-xs inline-block" /> SLA Breach</span>
          </div>
        </div>

        <div className="space-y-3">
          {milestones.map((m, idx) => {
            const isBreached = m.status === 'CRITICAL_SLA_BREACH';
            const isDelayed = m.status === 'DELAYED';
            const isCompleted = m.status === 'COMPLETED';

            // Calculate percentage width for visual Gantt representation
            const plannedWidth = Math.min(100, Math.max(25, (m.statutorySlaDays / 365) * 100));

            return (
              <div
                key={m.stage}
                onClick={() => setSelectedMilestone(m)}
                className={`p-3 rounded border transition-all cursor-pointer ${
                  isBreached ? 'bg-red-50/70 border-red-300 hover:border-red-400' :
                  isDelayed ? 'bg-amber-50/70 border-amber-300 hover:border-amber-400' :
                  'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[11px] font-bold text-[#0B3559] bg-blue-50 px-2 py-0.5 border border-blue-200 rounded">
                      {idx + 1}. {m.stage.replace('SEC_', 'Sec ')}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{m.name}</span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    {getStatusBadge(m)}
                    <span className="font-mono text-[11px] text-slate-500">
                      Tgt: {m.targetDate} {m.actualDate ? `| Act: ${m.actualDate}` : ''}
                    </span>
                  </div>
                </div>

                {/* Dual Bars */}
                <div className="space-y-1">
                  {/* Top Bar: Target Statutory Window */}
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-slate-400 h-1.5 rounded-full" style={{ width: `${plannedWidth}%` }} />
                  </div>

                  {/* Bottom Bar: Actual Execution & Variance */}
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden flex">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        isBreached ? 'bg-red-600' :
                        isDelayed ? 'bg-amber-500' :
                        isCompleted ? 'bg-emerald-600' :
                        'bg-blue-600'
                      }`}
                      style={{ width: isCompleted ? '100%' : isBreached ? '85%' : `${plannedWidth}%` }}
                    />
                  </div>
                </div>

                {/* Bottleneck Warning Banner */}
                {m.bottleneckReason && (
                  <div className="mt-2 text-[11px] text-red-800 bg-red-100/80 p-2 rounded border border-red-200 flex items-start space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                    <span><strong>SLA Bottleneck Cause:</strong> {m.bottleneckReason}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* STAGE DETAIL DRAWER MODAL */}
      {selectedMilestone && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <Info className="w-5 h-5 text-[#0B3559]" />
                <h3 className="text-sm font-bold text-slate-900">
                  Statutory Milestone Detail ({selectedMilestone.stage})
                </h3>
              </div>
              <button onClick={() => setSelectedMilestone(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2">
                <div className="flex justify-between font-bold">
                  <span>{selectedMilestone.name}</span>
                  {getStatusBadge(selectedMilestone)}
                </div>
                <div className="text-slate-600">Statutory SLA Window: <strong className="font-mono text-slate-900">{selectedMilestone.statutorySlaDays} Days Maximum</strong></div>
                <div className="text-slate-600">Target Baseline Date: <strong className="font-mono text-slate-900">{selectedMilestone.targetDate}</strong></div>
                {selectedMilestone.actualDate && (
                  <div className="text-slate-600">Actual Execution Date: <strong className="font-mono text-emerald-700">{selectedMilestone.actualDate}</strong></div>
                )}
              </div>

              {selectedMilestone.responsibleOfficer && (
                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded flex items-center space-x-2 text-blue-900">
                  <UserCheck className="w-4 h-4 text-blue-700" />
                  <span>Responsible Nodal Authority: <strong>{selectedMilestone.responsibleOfficer}</strong></span>
                </div>
              )}

              {selectedMilestone.gazetteNoticeNo && (
                <div className="p-2.5 bg-slate-100 border border-slate-200 rounded flex items-center space-x-2 text-slate-800">
                  <FileText className="w-4 h-4 text-[#0B3559]" />
                  <span>Gazette Publication No: <strong className="font-mono">{selectedMilestone.gazetteNoticeNo}</strong></span>
                </div>
              )}

              {selectedMilestone.bottleneckReason && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-900 space-y-1">
                  <strong className="block text-red-800 font-bold">Flagged Statutory Delay Reason:</strong>
                  <p>{selectedMilestone.bottleneckReason}</p>
                </div>
              )}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedMilestone(null)}
                className="px-4 py-2 bg-[#0B3559] text-white text-xs font-bold rounded shadow-sm hover:bg-[#071E3D]"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
