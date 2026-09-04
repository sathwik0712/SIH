import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  BarChart3, AlertTriangle, TrendingDown, Clock, 
  ShieldAlert, CheckCircle2, ArrowRight, Info 
} from 'lucide-react';

interface AnalyticsPageProps {
  onNavigate: (module: string, projectId?: string) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ onNavigate }) => {
  const { projects } = useApp();

  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('ALL');

  const delayedProjects = projects.filter(p => p.delayDays > 0 || p.riskScore > 40);

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Delay & Risk Analytics' }]} />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gov-gray-300 pb-3">
        <div>
          <h2 className="text-xl font-bold text-gov-navy font-serif flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-500" />
            <span>Statutory Timeline Delay & Acquisition Risk Analytics</span>
          </h2>
          <p className="text-xs text-gov-gray-600">
            Explainable quantitative risk index evaluating statutory bottleneck stages under RFCTLARR Act, 2013
          </p>
        </div>

        <div className="p-2 bg-amber-50 rounded border border-amber-300 text-amber-950 text-xs flex items-center gap-1.5">
          <Info className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <span><strong>Prototype Risk Assessment:</strong> Explainable rule-based index for SIH demonstration.</span>
        </div>
      </div>

      {/* Risk Index Methodology Banner */}
      <div className="p-3.5 bg-blue-50/60 rounded border border-blue-200 text-xs text-blue-950 space-y-1">
        <h4 className="font-bold text-gov-navy font-serif uppercase tracking-wider text-[11px]">
          Risk Score Calculation Criteria (Explainable Model):
        </h4>
        <p className="leading-relaxed">
          Risk Index (0-100) is calculated as: <strong>35% Statutory Timeline Slippage + 25% Section 15 Objection Backlog + 20% Pending Compensation Approvals + 20% Resettlement Colony Delay</strong>.
        </p>
      </div>

      {/* Project Risk Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {projects.map((p) => {
          const isHighRisk = p.riskScore >= 50;
          const isMedRisk = p.riskScore >= 25 && p.riskScore < 50;

          let riskPill = 'bg-emerald-100 text-emerald-900 border-emerald-300';
          let riskLabel = 'LOW RISK';

          if (isHighRisk) {
            riskPill = 'bg-red-100 text-red-900 border-red-300';
            riskLabel = 'CRITICAL / DELAYED';
          } else if (isMedRisk) {
            riskPill = 'bg-amber-100 text-amber-900 border-amber-300';
            riskLabel = 'MODERATE RISK';
          }

          return (
            <div
              key={p.id}
              className="bg-white border border-gov-gray-300 rounded p-4 shadow-sm flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between gap-2 border-b border-gov-gray-200 pb-2.5">
                <div>
                  <span className="font-mono text-xs font-bold text-gov-navy">{p.code}</span>
                  <h4 className="text-sm font-bold text-gov-gray-900 font-serif leading-snug mt-0.5">
                    {p.name}
                  </h4>
                  <div className="text-[11px] text-gov-gray-500 mt-0.5">
                    {p.district}, {p.state} &mdash; {p.acquiringAuthority}
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded text-xs font-bold border ${riskPill} select-none flex-shrink-0`}>
                  {riskLabel} ({p.riskScore}/100)
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2 bg-gov-gray-50 rounded border border-gov-gray-200">
                  <span className="text-[10px] text-gov-gray-500 block">Current Stage:</span>
                  <span className="font-bold text-gov-navy">Stage {p.currentStage}/10</span>
                </div>
                <div className="p-2 bg-gov-gray-50 rounded border border-gov-gray-200">
                  <span className="text-[10px] text-gov-gray-500 block">Physical Acquired:</span>
                  <span className="font-bold text-emerald-800">
                    {((p.landAcquiredHa / p.landRequiredHa) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="p-2 bg-gov-gray-50 rounded border border-gov-gray-200">
                  <span className="text-[10px] text-gov-gray-500 block">Schedule Variance:</span>
                  <span className={`font-bold ${p.delayDays > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                    {p.delayDays > 0 ? `+${p.delayDays} Days Delay` : 'On Schedule'}
                  </span>
                </div>
              </div>

              {/* Root Cause Analysis */}
              <div className="p-2.5 bg-gov-gray-50 rounded border border-gov-gray-200 text-xs space-y-1">
                <span className="font-bold text-gov-navy text-[11px] block">Root Cause & Statutory Bottleneck:</span>
                <p className="text-gov-gray-700 leading-relaxed">
                  {p.delayDays > 0
                    ? `Section 15 objection hearing backlog in ${p.district} division. Circle rate revision plea pending before District Valuation Committee.`
                    : `Workflow proceeding smoothly under statutory timelines. Direct Benefit Transfers clearing without escrow disputes.`}
                </p>
              </div>

              <div className="pt-2 border-t border-gov-gray-200 flex items-center justify-between">
                <span className="text-[11px] text-gov-gray-500 font-mono">
                  Target: <strong>{p.targetDate}</strong>
                </span>
                <button
                  onClick={() => onNavigate('project-details', p.id)}
                  className="px-3 py-1 bg-gov-navy text-white text-xs font-semibold rounded hover:bg-gov-navy-hover flex items-center gap-1"
                >
                  <span>Open Deep Dive</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
