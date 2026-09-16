import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Download, PieChart, Activity, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart as RechartsPie, Pie, Cell } from 'recharts';
import { apiFetch } from '../api/client';
import type { ProjectSummary } from '../types';

const progressData = [
  { month: 'Jan', required: 1500, acquired: 200, compensation: 45 },
  { month: 'Feb', required: 1500, acquired: 450, compensation: 120 },
  { month: 'Mar', required: 1500, acquired: 800, compensation: 350 },
  { month: 'Apr', required: 1500, acquired: 1100, compensation: 680 },
  { month: 'May', required: 1500, acquired: 1250, compensation: 920 },
  { month: 'Jun', required: 1500, acquired: 1380, compensation: 1150 },
];

const stageData = [
  { name: 'Sec 4', count: 120 },
  { name: 'Sec 11', count: 98 },
  { name: 'Sec 15', count: 85 },
  { name: 'Sec 19', count: 70 },
  { name: 'Award', count: 62 },
  { name: 'Possession', count: 45 },
];

const categoryData = [
  { name: 'Agricultural', value: 850 },
  { name: 'Residential', value: 320 },
  { name: 'Commercial', value: 150 },
  { name: 'Barren', value: 180 },
];

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#64748b'];

const STAGE_DURATION_DAYS: Record<string, number> = {
  'PROPOSAL': 30,
  'VERIFICATION': 45,
  'NOTIFICATION': 60,
  'OBJECTION': 30,
  'AWARD': 90,
  'COMPENSATION': 60,
  'RANDR': 120,
  'POSSESSION': 30,
  'COMPLETED': 0,
};

const STAGES_ORDER = ['PROPOSAL', 'VERIFICATION', 'NOTIFICATION', 'OBJECTION', 'AWARD', 'COMPENSATION', 'RANDR', 'POSSESSION', 'COMPLETED'];

export const AnalyticsPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);

  useEffect(() => {
    apiFetch<ProjectSummary[]>('/projects').then(res => {
      if (res.success && res.data) {
        setProjects(res.data.filter(p => p.status !== 'COMPLETED'));
      }
    });
  }, []);

  const calculatePrediction = (project: ProjectSummary) => {
    const currentIdx = STAGES_ORDER.indexOf(project.acquisitionStage || 'PROPOSAL');
    let remainingDays = 0;
    for (let i = currentIdx; i < STAGES_ORDER.length - 1; i++) {
      remainingDays += STAGE_DURATION_DAYS[STAGES_ORDER[i]];
    }
    
    const today = new Date();
    const expectedCompletion = new Date(today.getTime() + remainingDays * 24 * 60 * 60 * 1000);
    
    // Default target: 12 months from now if not specified (for demo)
    const targetDate = project.targetCompletionDate ? new Date(project.targetCompletionDate) : new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000);
    
    const diffDays = Math.round((expectedCompletion.getTime() - targetDate.getTime()) / (1000 * 3600 * 24));
    
    let status = 'ON_TRACK';
    let icon = <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    let textClass = 'text-emerald-700';
    let bgClass = 'bg-emerald-50 border-emerald-200';
    
    if (diffDays > 30) {
      status = 'DELAYED';
      icon = <AlertTriangle className="w-4 h-4 text-red-600" />;
      textClass = 'text-red-700';
      bgClass = 'bg-red-50 border-red-200';
    } else if (diffDays > 0) {
      status = 'AT_RISK';
      icon = <Clock className="w-4 h-4 text-amber-600" />;
      textClass = 'text-amber-700';
      bgClass = 'bg-amber-50 border-amber-200';
    }
    
    return { expectedCompletion, status, icon, textClass, bgClass, diffDays };
  };
  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-700 rounded flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#0B3559]">Analytics & Performance Dashboard</h1>
            <p className="text-xs text-slate-500">Macro-level acquisition trends and financial forecasting</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-[#0B3559] text-white rounded hover:bg-[#071E3D] transition-colors">
          <Download className="w-3.5 h-3.5" /> Export PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Area Chart */}
        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-slate-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Acquisition vs Target (Ha)</h3>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAcq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <RechartsTooltip contentStyle={{ fontSize: '12px', borderRadius: '4px', border: '1px solid #e2e8f0' }} />
                <Area type="monotone" dataKey="required" stroke="#94a3b8" strokeDasharray="5 5" fill="none" name="Required" />
                <Area type="monotone" dataKey="acquired" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorAcq)" name="Acquired" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-slate-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Parcel Funnel by Stage</h3>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ fontSize: '12px', borderRadius: '4px' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Parcels" barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Chart */}
        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm lg:col-span-2 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-4 h-4 text-slate-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Land Type Distribution</h3>
            </div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ fontSize: '12px', borderRadius: '4px' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center space-y-4">
            <div>
              <h4 className="text-[11px] font-bold text-slate-500 uppercase">Cumulative Compensation Disbursed</h4>
              <div className="text-3xl font-mono font-bold text-slate-900 mt-1">₹ 1,150.00 <span className="text-lg text-slate-500 font-normal">Cr</span></div>
              <div className="w-full h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div className="h-2 bg-emerald-500 rounded-full" style={{ width: '76%' }} />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">76% of assessed budget (₹ 1,510 Cr)</p>
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-slate-500 uppercase">Average Time to Award</h4>
              <div className="text-3xl font-mono font-bold text-slate-900 mt-1">214 <span className="text-lg text-slate-500 font-normal">Days</span></div>
              <p className="text-[10px] text-emerald-600 font-medium mt-1">↓ 12% faster than national average</p>
            </div>
          </div>
        </div>
      </div>

      {/* Predictive Forecasting Section */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
          <Clock className="w-4 h-4 text-[#0B3559]" />
          <h3 className="text-xs font-bold text-[#0B3559] uppercase tracking-wider">Predictive Delay Forecasting</h3>
          <span className="ml-auto text-[10px] text-slate-500 font-mono">Calculated via stage duration arithmetic</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {projects.slice(0, 6).map(p => {
            const pred = calculatePrediction(p);
            return (
              <div key={p.id} className={`p-3 rounded border ${pred.bgClass}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-mono font-bold text-xs text-slate-800">{p.projectCode}</div>
                    <div className="text-[11px] text-slate-600 truncate max-w-[150px]">{p.projectName}</div>
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border ${pred.textClass}`}>
                    {pred.icon} {pred.status.replace('_', ' ')}
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span>Current Stage:</span>
                    <span className="font-semibold text-slate-700">{p.acquisitionStage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expected Completion:</span>
                    <span className="font-semibold text-slate-700 font-mono">{pred.expectedCompletion.toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Variance from Target:</span>
                    <span className={`font-semibold ${pred.diffDays > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {pred.diffDays > 0 ? `+${pred.diffDays} Days` : `${pred.diffDays} Days`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
