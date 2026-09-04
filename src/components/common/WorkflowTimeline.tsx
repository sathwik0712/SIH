import React from 'react';
import { AcquisitionStage } from '../../types';
import { Check, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

interface WorkflowTimelineProps {
  currentStage: AcquisitionStage;
  onSelectStage?: (stage: AcquisitionStage) => void;
  activeSelectedStage?: AcquisitionStage;
}

export const STAGES_CONFIG: { stage: AcquisitionStage; label: string; short: string; actRef: string }[] = [
  { stage: 1, label: 'Proposal & SIA', short: '1. Proposal', actRef: 'Sec 4(1) SIA' },
  { stage: 2, label: 'Land Identification', short: '2. Identification', actRef: 'Cadastral GIS' },
  { stage: 3, label: 'Field Verification', short: '3. Verification', actRef: 'DGPS & RoR 7/12' },
  { stage: 4, label: 'Statutory Notification', short: '4. Notification', actRef: 'Sec 11(1) Gazette' },
  { stage: 5, label: 'Claims & Objections', short: '5. Objections', actRef: 'Sec 15 Hearings' },
  { stage: 6, label: 'Statutory Award', short: '6. Award', actRef: 'Sec 23/30 Valuation' },
  { stage: 7, label: 'Compensation & DBT', short: '7. Compensation', actRef: 'PFMS e-Kuber' },
  { stage: 8, label: 'Resettlement & Rehab', short: '8. R&R', actRef: 'Sec 31 Entitlements' },
  { stage: 9, label: 'Physical Possession', short: '9. Possession', actRef: 'Sec 16 Panchnama' },
  { stage: 10, label: 'Project Closure', short: '10. Closure', actRef: 'Handover & Audit' },
];

export const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({
  currentStage,
  onSelectStage,
  activeSelectedStage,
}) => {
  return (
    <div className="bg-white border border-gov-gray-300 rounded p-4 shadow-sm select-none">
      <div className="flex items-center justify-between mb-3 border-b border-gov-gray-200 pb-2">
        <div>
          <h4 className="text-xs font-bold text-gov-navy uppercase tracking-wider font-serif">
            RFCTLARR Statutory Acquisition Lifecycle (10 Stages)
          </h4>
          <p className="text-[11px] text-gov-gray-600">
            Interactive stage progression from initial SIA proposal to final possession & project closure
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Completed
          </span>
          <span className="flex items-center gap-1 text-amber-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span> Current Stage
          </span>
          <span className="flex items-center gap-1 text-gov-gray-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-gov-gray-300"></span> Upcoming
          </span>
        </div>
      </div>

      {/* Horizontal Steps Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-1.5 pt-1">
        {STAGES_CONFIG.map((s) => {
          const isPassed = s.stage < currentStage;
          const isCurrent = s.stage === currentStage;
          const isSelected = activeSelectedStage === s.stage;

          let stepBg = 'bg-gov-gray-100 text-gov-gray-600 border-gov-gray-200';
          let icon = <span className="text-[10px] font-bold">{s.stage}</span>;

          if (isPassed) {
            stepBg = 'bg-emerald-50 text-emerald-900 border-emerald-300';
            icon = <Check className="w-3 h-3 text-emerald-700" />;
          } else if (isCurrent) {
            stepBg = 'bg-amber-100 text-amber-950 border-amber-400 ring-2 ring-amber-300/60 font-semibold';
            icon = <Clock className="w-3 h-3 text-amber-800" />;
          }

          if (isSelected) {
            stepBg += ' ring-2 ring-gov-navy';
          }

          return (
            <button
              key={s.stage}
              onClick={() => onSelectStage && onSelectStage(s.stage)}
              className={`p-2 rounded border text-left flex flex-col justify-between transition-all hover:shadow-xs ${stepBg} ${
                onSelectStage ? 'cursor-pointer hover:border-gov-navy' : 'cursor-default'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="w-4 h-4 rounded-full bg-white/90 border border-current flex items-center justify-center flex-shrink-0">
                  {icon}
                </span>
                <span className="text-[9px] font-mono text-gov-gray-500">{s.actRef}</span>
              </div>
              <div className="text-[11px] font-bold leading-tight line-clamp-2">
                {s.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
