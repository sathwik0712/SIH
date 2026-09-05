import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface MetricItem {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  onClick?: () => void;
}

interface StatisticsPanelProps {
  metrics: MetricItem[];
}

export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {metrics.map((m, idx) => {
        let leftBorder = 'border-l-gov-navy-800';
        let valColor = 'text-gov-navy-900';
        let bg = 'bg-white';

        if (m.variant === 'success') {
          leftBorder = 'border-l-emerald-600';
          valColor = 'text-emerald-800';
        } else if (m.variant === 'warning') {
          leftBorder = 'border-l-amber-500';
          valColor = 'text-amber-800';
        } else if (m.variant === 'danger') {
          leftBorder = 'border-l-red-600';
          valColor = 'text-red-700';
        } else if (m.variant === 'info') {
          leftBorder = 'border-l-blue-600';
          valColor = 'text-blue-800';
        }

        const IconComponent = m.icon;

        return (
          <div
            key={idx}
            onClick={m.onClick}
            className={`${bg} border border-slate-200 border-l-4 ${leftBorder} rounded p-3 shadow-sm hover:border-slate-300 transition-all ${
              m.onClick ? 'cursor-pointer hover:bg-slate-50' : ''
            }`}
          >
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
              <span className="uppercase tracking-wider">{m.label}</span>
              {IconComponent && <IconComponent className="w-4 h-4 text-slate-400" />}
            </div>
            <div className={`text-xl font-bold ${valColor} mt-1 font-mono`}>
              {m.value}
            </div>
            {m.subtext && (
              <div className="text-[10px] text-slate-500 mt-0.5">{m.subtext}</div>
            )}
          </div>
        );
      })}
    </div>
  );
};
