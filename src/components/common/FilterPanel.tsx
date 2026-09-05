import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterField {
  id: string;
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

interface FilterPanelProps {
  fields: FilterField[];
  onReset?: () => void;
  className?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ fields, onReset, className = '' }) => {
  return (
    <div className={`bg-white border border-slate-200 rounded p-3 mb-4 shadow-sm ${className}`}>
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-gov-navy-800" />
          <span>Statutory & Territorial Filters</span>
        </div>
        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center space-x-1 text-[11px] text-slate-500 hover:text-slate-800 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {fields.map(field => (
          <div key={field.id} className="flex flex-col space-y-1">
            <label htmlFor={field.id} className="text-[11px] font-medium text-slate-600">
              {field.label}
            </label>
            <select
              id={field.id}
              value={field.value}
              onChange={e => field.onChange(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gov-navy-800 focus:border-gov-navy-800"
            >
              {field.options.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};
