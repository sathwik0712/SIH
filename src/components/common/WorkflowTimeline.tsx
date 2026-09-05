import React from 'react';
import { Check } from 'lucide-react';

export interface WorkflowStage {
  key: string;
  name: string;
  statutoryRef: string;
}

export const WORKFLOW_STAGES: WorkflowStage[] = [
  { key: 'PROPOSAL', name: 'Proposal', statutoryRef: 'Sec 4 Requisition' },
  { key: 'VERIFICATION', name: 'Field Survey', statutoryRef: 'Joint Measurement' },
  { key: 'NOTIFICATION', name: 'Notification', statutoryRef: 'Sec 11(1) Gazette' },
  { key: 'OBJECTION', name: 'Objections', statutoryRef: 'Sec 15 Hearing' },
  { key: 'AWARD', name: 'Award Inquiry', statutoryRef: 'Sec 23/30 Award' },
  { key: 'COMPENSATION', name: 'Compensation', statutoryRef: 'PFMS Disbursal' },
  { key: 'RANDR', name: 'R&R Execution', statutoryRef: 'Sec 31 Benefits' },
  { key: 'POSSESSION', name: 'Possession', statutoryRef: 'Sec 38 Handover' },
  { key: 'COMPLETED', name: 'Closure', statutoryRef: 'Revenue Mutation' },
];

interface WorkflowTimelineProps {
  currentStage: string;
  className?: string;
}

export const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({ currentStage, className = '' }) => {
  const currentIndex = WORKFLOW_STAGES.findIndex(
    s => s.key.toUpperCase() === (currentStage || '').toUpperCase()
  );

  const activeIndex = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div className={`w-full bg-white p-4 border border-slate-200 rounded ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Statutory Land Acquisition Lifecycle (RFCTLARR Act, 2013)
        </h4>
        <span className="text-[11px] text-slate-500 font-mono">
          Current Stage: <span className="font-semibold text-gov-navy-800">{WORKFLOW_STAGES[activeIndex]?.name}</span>
        </span>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex items-center min-w-[720px] justify-between relative">
          {/* Connecting Line */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />
          <div
            className="absolute top-4 left-6 h-0.5 bg-gov-navy-800 -z-0 transition-all duration-300"
            style={{ width: `${(activeIndex / (WORKFLOW_STAGES.length - 1)) * 90}%` }}
          />

          {WORKFLOW_STAGES.map((stage, idx) => {
            const isCompleted = idx < activeIndex;
            const isCurrent = idx === activeIndex;

            return (
              <div key={stage.key} className="flex flex-col items-center relative z-10 text-center px-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2 ${
                    isCompleted
                      ? 'bg-gov-navy-800 text-white border-gov-navy-800'
                      : isCurrent
                      ? 'bg-amber-500 text-slate-900 border-amber-600 ring-4 ring-amber-100'
                      : 'bg-white text-slate-400 border-slate-300'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                <span
                  className={`text-xs mt-2 font-medium ${
                    isCurrent
                      ? 'text-gov-navy-900 font-bold'
                      : isCompleted
                      ? 'text-slate-700'
                      : 'text-slate-400'
                  }`}
                >
                  {stage.name}
                </span>
                <span className="text-[10px] text-slate-500 font-mono scale-90">
                  {stage.statutoryRef}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
