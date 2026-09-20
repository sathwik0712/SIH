import React, { useState } from 'react';
import { AuthenticProject } from '../../types/project';
import { WhatIfMitigationOption } from '../../types/analytics';
import {
  TrendingUp,
  ShieldAlert,
  Sparkles,
  Sliders,
  Check
} from 'lucide-react';

interface Props {
  project: AuthenticProject;
}

export const PredictiveAnalyticsCard: React.FC<Props> = ({ project }) => {
  // Mitigation Simulator Toggles
  const [mitigations, setMitigations] = useState<WhatIfMitigationOption[]>([
    {
      id: 'm1',
      label: 'Deploy Additional Cadastral Survey Team',
      description: 'Increases field survey output by 2.5x to clear pending land parcel verification.',
      delayReductionDays: 14,
      costImpactCr: 0.8,
      enabled: false,
    },
    {
      id: 'm2',
      label: 'Fast-Track Sec 15 Conciliation Bench',
      description: 'Convenes daily hearing benches under Sub-Divisional Magistrate to resolve land valuation objections.',
      delayReductionDays: 22,
      costImpactCr: 0.3,
      enabled: false,
    },
    {
      id: 'm3',
      label: 'Disburse 100% Solatium Advance via PFMS',
      description: 'Accelerates Direct Benefit Transfer to landowners upon Section 23 award formulation.',
      delayReductionDays: 12,
      costImpactCr: 0.0,
      enabled: false,
    },
  ]);

  // Dynamic Base Calculation
  const isDelayed = project.overallVarianceDays > 0;
  const baseRiskScore = isDelayed ? Math.min(95, 60 + project.overallVarianceDays * 0.5) : Math.max(15, 30 + project.overallVarianceDays);
  const baseDelayDays = Math.max(0, project.overallVarianceDays);

  // Recalculate based on enabled mitigations
  const totalReductionDays = mitigations.filter(m => m.enabled).reduce((sum, m) => sum + m.delayReductionDays, 0);
  const _totalMitigationCost = mitigations.filter(m => m.enabled).reduce((sum, m) => sum + m.costImpactCr, 0);

  const activeDelayDays = Math.max(0, baseDelayDays - totalReductionDays);
  const activeRiskScore = Math.max(10, Math.round(baseRiskScore - totalReductionDays * 0.8));

  const toggleMitigation = (id: string) => {
    setMitigations(prev =>
      prev.map(m => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return { badge: 'bg-red-100 text-red-900 border-red-300', bar: 'bg-red-600', label: 'CRITICAL / HIGH RISK' };
    if (score >= 40) return { badge: 'bg-amber-100 text-amber-900 border-amber-300', bar: 'bg-amber-500', label: 'MEDIUM RISK' };
    return { badge: 'bg-emerald-100 text-emerald-900 border-emerald-300', bar: 'bg-emerald-600', label: 'LOW RISK / ON TRACK' };
  };

  const riskCfg = getRiskColor(activeRiskScore);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-3 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Predictive Risk Engine &amp; "What-If" Fast-Track Simulator
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Rule-based smart analytics forecasting stage dwell times &amp; statutory slippage for <strong className="text-slate-900">{project.projectCode}</strong>
          </p>
        </div>

        <div className={`px-3 py-1.5 rounded-full border text-xs font-bold font-mono flex items-center space-x-1.5 ${riskCfg.badge}`}>
          <ShieldAlert className="w-4 h-4" />
          <span>PROJECT RISK INDEX: {activeRiskScore} / 100 ({riskCfg.label})</span>
        </div>
      </div>

      {/* Grid: Predictive Delay Forecaster vs What-If Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 6 cols: AI Delay Forecaster Card */}
        <div className="lg:col-span-6 space-y-3">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#0B3559]" />
              Stage Dwell Velocity vs National Benchmark
            </h4>

            {/* Velocity Bar */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-600">Active Stage: <strong>{project.acquisitionStage}</strong></span>
                <span className="font-mono text-slate-800">
                  Current Dwell: <strong className="text-amber-800">{isDelayed ? '58 Days' : '22 Days'}</strong> / National Avg: 35 Days
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                <div className="bg-blue-600 h-2.5" style={{ width: '45%' }} />
                <div className={`${isDelayed ? 'bg-red-600' : 'bg-emerald-600'} h-2.5`} style={{ width: isDelayed ? '40%' : '20%' }} />
              </div>
            </div>

            {/* Predicted Completion Banner */}
            <div className={`p-3 rounded border text-xs ${
              activeDelayDays > 0 ? 'bg-red-50 border-red-200 text-red-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              <div className="flex justify-between items-center font-bold">
                <span>Predicted Possession Slippage:</span>
                <span className="font-mono text-sm">
                  {activeDelayDays > 0 ? `+${activeDelayDays} Days Delay` : 'On Schedule (0 Days Delay)'}
                </span>
              </div>
              <p className="text-[11px] mt-1 text-slate-600">
                Forecasted Statutory Completion: <strong>{activeDelayDays > 0 ? 'Revised Est. Nov 2026' : project.targetCompletionDate}</strong>
              </p>
            </div>

            {/* Primary Risk Drivers */}
            <div className="space-y-1.5 text-xs pt-1">
              <span className="font-bold text-slate-800 text-[11px] block uppercase">Primary Identified Risk Drivers:</span>
              <ul className="space-y-1 text-slate-700 text-[11px]">
                <li className="flex items-start gap-1.5">
                  <span className="text-red-500 font-bold">•</span>
                  <span>{project.milestones.find(m => m.bottleneckReason)?.bottleneckReason || 'High volume of Section 15 landowner valuation claims'}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{project.landExtent.forestProtectedHa > 0 ? `${project.landExtent.forestProtectedHa} Ha Forest land environmental clearance requirement` : 'PFMS bank account verification backlog'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right 6 cols: Interactive "What-If" Fast-Track Simulator */}
        <div className="lg:col-span-6 bg-slate-900 text-white rounded-lg p-4 space-y-4 shadow-md">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Interactive "What-If" Mitigation Simulator
              </h4>
            </div>
            <span className="text-[10px] font-mono bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded font-bold">
              REAL-TIME RECALCULATION
            </span>
          </div>

          <p className="text-[11px] text-slate-300">
            Toggle statutory intervention strategies below to evaluate real-time delay reduction and risk score impact:
          </p>

          <div className="space-y-2.5">
            {mitigations.map(m => (
              <div
                key={m.id}
                onClick={() => toggleMitigation(m.id)}
                className={`p-3 rounded border cursor-pointer transition-all ${
                  m.enabled
                    ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-sm'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${
                      m.enabled ? 'bg-emerald-500 border-emerald-400 text-slate-900 font-bold' : 'border-slate-500'
                    }`}>
                      {m.enabled && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-bold">{m.label}</span>
                  </div>

                  <span className="font-mono text-xs font-bold text-emerald-400 shrink-0">
                    -{m.delayReductionDays} Days
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 pl-6">
                  {m.description} {m.costImpactCr > 0 && `(Est. Budget: ₹${m.costImpactCr} Cr)`}
                </p>
              </div>
            ))}
          </div>

          {/* Real-time Recalculated Summary Footer */}
          <div className="p-3 bg-slate-800 rounded border border-slate-700 flex justify-between items-center text-xs">
            <div>
              <span className="text-slate-400 text-[11px] block">Total Delay Reduction:</span>
              <span className="font-mono text-emerald-400 font-bold text-sm">-{totalReductionDays} Days Saved</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-[11px] block">Revised Risk Index:</span>
              <span className="font-mono text-amber-400 font-bold text-sm">{activeRiskScore} / 100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
