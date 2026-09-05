import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PlaceholderModuleProps {
  title: string;
  subtitle: string;
  actSection?: string;
  targetPhase: string;
  icon: LucideIcon;
  keyFeatures: string[];
}

export const PlaceholderModule: React.FC<PlaceholderModuleProps> = ({
  title,
  subtitle,
  actSection,
  targetPhase,
  icon: Icon,
  keyFeatures,
}) => {
  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-gov-navy-900">{title}</h2>
            {actSection && (
              <span className="text-[11px] font-mono px-2 py-0.5 bg-gov-navy-50 text-gov-navy-800 border border-gov-navy-200 rounded">
                {actSection}
              </span>
            )}
            <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 rounded font-semibold">
              {targetPhase}
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">{subtitle}</p>
        </div>

        <Link
          to="/dashboard"
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-gov-navy-800 hover:bg-gov-navy-900 text-white rounded text-xs font-semibold shadow-sm transition-colors"
        >
          <span>Return to Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Module Scaffolding Card */}
      <div className="bg-white border border-slate-200 rounded p-6 shadow-sm">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-200">
          <div className="p-3 bg-gov-navy-50 rounded text-gov-navy-800 border border-gov-navy-200">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{title} — Module Ready</h3>
            <p className="text-xs text-slate-500">
              Scaffolding established in Phase 0. Feature components, specific workflows, and API mutations will be implemented in subsequent phases.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Planned Statutory Features for this Module:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {keyFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-2 p-2.5 rounded bg-slate-50 border border-slate-200 text-xs text-slate-700"
              >
                <FileText className="w-4 h-4 text-gov-navy-800 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
