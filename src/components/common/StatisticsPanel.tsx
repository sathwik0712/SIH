import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricItem {
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
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        
        let borderClass = 'border-gov-gray-300';
        let valColor = 'text-gov-navy';
        let bgClass = 'bg-white';

        if (m.variant === 'success') {
          borderClass = 'border-emerald-300';
          valColor = 'text-emerald-800';
          bgClass = 'bg-emerald-50/40';
        } else if (m.variant === 'warning') {
          borderClass = 'border-amber-300';
          valColor = 'text-amber-800';
          bgClass = 'bg-amber-50/40';
        } else if (m.variant === 'danger') {
          borderClass = 'border-red-300';
          valColor = 'text-red-800';
          bgClass = 'bg-red-50/40';
        } else if (m.variant === 'info') {
          borderClass = 'border-blue-300';
          valColor = 'text-blue-800';
          bgClass = 'bg-blue-50/40';
        }

        return (
          <div
            key={idx}
            onClick={m.onClick}
            className={`p-2.5 rounded border ${borderClass} ${bgClass} flex flex-col justify-between shadow-2xs ${
              m.onClick ? 'cursor-pointer hover:border-gov-navy hover:shadow-xs transition-all' : ''
            }`}
          >
            <div className="flex items-center justify-between gap-1 text-[11px] text-gov-gray-600 font-medium mb-1">
              <span className="truncate">{m.label}</span>
              {Icon && <Icon className="w-3.5 h-3.5 text-gov-gray-400 flex-shrink-0" />}
            </div>
            <div>
              <div className={`text-base font-bold font-serif ${valColor} tracking-tight`}>
                {m.value}
              </div>
              {m.subtext && (
                <div className="text-[10px] text-gov-gray-500 mt-0.5 truncate">
                  {m.subtext}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
