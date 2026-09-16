import React, { useState } from 'react';
import { Home, CheckCircle2, Clock, AlertTriangle, Users, Building, Briefcase, BookOpen, Download, Filter, Search } from 'lucide-react';

interface RRBenefit {
  id: string;
  familyHead: string;
  village: string;
  category: string;
  plotAllotted: boolean;
  housePlotNo: string;
  housePlotArea: string;
  employmentStatus: 'PROVIDED' | 'PENDING' | 'OPTED_ANNUITY' | 'NOT_ELIGIBLE';
  annuityMonthly: number;
  skillTraining: boolean;
  schoolProvided: boolean;
  hospitalNearby: boolean;
  waterConnection: boolean;
  electricityConnection: boolean;
  overallStatus: 'COMPLETE' | 'IN_PROGRESS' | 'PENDING';
  completedDate?: string;
}

const MOCK_RR: RRBenefit[] = [
  { id: 'RR001', familyHead: 'Ramesh Patil', village: 'Bhosari', category: 'GENERAL', plotAllotted: true, housePlotNo: 'RSS-A-012', housePlotArea: '200 sq.m', employmentStatus: 'PROVIDED', annuityMonthly: 0, skillTraining: true, schoolProvided: true, hospitalNearby: true, waterConnection: true, electricityConnection: true, overallStatus: 'COMPLETE', completedDate: '15 May 2025' },
  { id: 'RR002', familyHead: 'Sunita Deshpande', village: 'Bhosari', category: 'OBC', plotAllotted: true, housePlotNo: 'RSS-A-013', housePlotArea: '180 sq.m', employmentStatus: 'OPTED_ANNUITY', annuityMonthly: 3000, skillTraining: false, schoolProvided: true, hospitalNearby: true, waterConnection: true, electricityConnection: false, overallStatus: 'IN_PROGRESS', },
  { id: 'RR003', familyHead: 'Govind Shinde', village: 'Bhosari', category: 'ST', plotAllotted: false, housePlotNo: '—', housePlotArea: '—', employmentStatus: 'PENDING', annuityMonthly: 0, skillTraining: false, schoolProvided: false, hospitalNearby: false, waterConnection: false, electricityConnection: false, overallStatus: 'PENDING' },
  { id: 'RR004', familyHead: 'Lata Kulkarni', village: 'Chikhali', category: 'GENERAL', plotAllotted: true, housePlotNo: 'RSS-B-004', housePlotArea: '150 sq.m', employmentStatus: 'PROVIDED', annuityMonthly: 0, skillTraining: true, schoolProvided: true, hospitalNearby: true, waterConnection: true, electricityConnection: true, overallStatus: 'COMPLETE', completedDate: '22 May 2025' },
  { id: 'RR005', familyHead: 'Vijay More', village: 'Chikhali', category: 'SC', plotAllotted: true, housePlotNo: 'RSS-B-005', housePlotArea: '200 sq.m', employmentStatus: 'PENDING', annuityMonthly: 0, skillTraining: true, schoolProvided: true, hospitalNearby: true, waterConnection: true, electricityConnection: true, overallStatus: 'IN_PROGRESS' },
  { id: 'RR006', familyHead: 'Anita Jadhav', village: 'Moshi', category: 'OBC', plotAllotted: true, housePlotNo: 'RSS-C-009', housePlotArea: '220 sq.m', employmentStatus: 'PROVIDED', annuityMonthly: 0, skillTraining: true, schoolProvided: true, hospitalNearby: true, waterConnection: true, electricityConnection: true, overallStatus: 'COMPLETE', completedDate: '01 Jun 2025' },
  { id: 'RR007', familyHead: 'Suresh Kale', village: 'Moshi', category: 'ST', plotAllotted: false, housePlotNo: '—', housePlotArea: '—', employmentStatus: 'PENDING', annuityMonthly: 0, skillTraining: false, schoolProvided: false, hospitalNearby: false, waterConnection: false, electricityConnection: false, overallStatus: 'PENDING' },
  { id: 'RR008', familyHead: 'Deepak Nair', village: 'Alandi', category: 'OBC', plotAllotted: true, housePlotNo: 'RSS-D-002', housePlotArea: '180 sq.m', employmentStatus: 'OPTED_ANNUITY', annuityMonthly: 3000, skillTraining: false, schoolProvided: true, hospitalNearby: true, waterConnection: true, electricityConnection: true, overallStatus: 'COMPLETE', completedDate: '10 Jun 2025' },
];

const statusCfg: Record<string, { badge: string; label: string; dot: string }> = {
  COMPLETE:    { badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', label: 'Complete',     dot: 'bg-emerald-500' },
  IN_PROGRESS: { badge: 'bg-amber-50 text-amber-800 border-amber-300',      label: 'In Progress',  dot: 'bg-amber-500' },
  PENDING:     { badge: 'bg-red-50 text-red-800 border-red-200',            label: 'Pending',      dot: 'bg-red-500' },
};

const empCfg: Record<string, { label: string; color: string }> = {
  PROVIDED:      { label: 'Employment Provided', color: 'text-emerald-700' },
  PENDING:       { label: 'Employment Pending',  color: 'text-amber-700'   },
  OPTED_ANNUITY: { label: 'Opted for Annuity',   color: 'text-blue-700'    },
  NOT_ELIGIBLE:  { label: 'Not Eligible',         color: 'text-slate-500'   },
};

function BoolCell({ val }: { val: boolean }) {
  return val
    ? <CheckCircle2 className="w-4 h-4 text-emerald-600" />
    : <Clock className="w-4 h-4 text-slate-300" />;
}

export const RRBenefitsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filtered = MOCK_RR.filter(r => {
    const matchSearch = search === '' || r.familyHead.toLowerCase().includes(search.toLowerCase()) || r.village.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || r.overallStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const complete    = MOCK_RR.filter(r => r.overallStatus === 'COMPLETE').length;
  const inProgress  = MOCK_RR.filter(r => r.overallStatus === 'IN_PROGRESS').length;
  const pending     = MOCK_RR.filter(r => r.overallStatus === 'PENDING').length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-teal-700 rounded flex items-center justify-center">
            <Home className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#0B3559]">R&R Benefits — Rehabilitation & Resettlement (Sec 31 / Third Schedule)</h1>
            <p className="text-xs text-slate-500">Family-wise R&R entitlement fulfillment tracking per RFCTLARR Act 2013</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-[#0B3559] text-white rounded hover:bg-[#071E3D] transition-colors">
          <Download className="w-3.5 h-3.5" /> Export R&R Report
        </button>
      </div>

      {/* Progress cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Fully Resettled', val: complete, total: MOCK_RR.length, color: 'border-l-emerald-600', bg: 'bg-emerald-600', icon: CheckCircle2 },
          { label: 'In Progress', val: inProgress, total: MOCK_RR.length, color: 'border-l-amber-500', bg: 'bg-amber-500', icon: Clock },
          { label: 'Pending', val: pending, total: MOCK_RR.length, color: 'border-l-red-500', bg: 'bg-red-500', icon: AlertTriangle },
        ].map(k => {
          const Icon = k.icon;
          const pct = Math.round((k.val / k.total) * 100);
          return (
            <div key={k.label} className={`bg-white border border-slate-200 border-l-4 ${k.color} rounded p-4 shadow-sm`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">{k.label}</span>
                <Icon className={`w-4 h-4 ${k.color.replace('border-l-','text-')}`} />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900">{k.val} <span className="text-sm font-normal text-slate-500">/ {k.total} families</span></div>
              <div className="mt-2 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-1.5 ${k.bg} rounded-full transition-all`} style={{ width: `${pct}%` }} />
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-mono">{pct}% of total</div>
            </div>
          );
        })}
      </div>

      {/* Benefit checkpoints overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'House Plots Allotted', val: MOCK_RR.filter(r => r.plotAllotted).length, icon: Building, total: MOCK_RR.length },
          { label: 'Employment Provided', val: MOCK_RR.filter(r => r.employmentStatus === 'PROVIDED').length, icon: Briefcase, total: MOCK_RR.length },
          { label: 'Skill Training Done', val: MOCK_RR.filter(r => r.skillTraining).length, icon: BookOpen, total: MOCK_RR.length },
          { label: 'Annuity (₹3000/mo)', val: MOCK_RR.filter(r => r.employmentStatus === 'OPTED_ANNUITY').length, icon: Users, total: MOCK_RR.length },
        ].map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white border border-slate-200 rounded p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-3.5 h-3.5 text-teal-700" />
                <span className="text-[11px] font-semibold text-slate-600">{k.label}</span>
              </div>
              <div className="text-xl font-bold font-mono text-slate-900">{k.val} <span className="text-xs font-normal text-slate-400">/ {k.total}</span></div>
              <div className="mt-1.5 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-1 bg-teal-600 rounded-full" style={{ width: `${(k.val / k.total) * 100}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded p-3 shadow-sm flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input type="text" placeholder="Search by name or village…" value={search} onChange={e => setSearch(e.target.value)} className="flex-1 text-xs border-none outline-none text-slate-700 placeholder-slate-400" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white text-slate-700">
            <option value="ALL">All Status</option>
            <option value="COMPLETE">Complete</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">{filtered.length} families</span>
      </div>

      {/* R&R Detail Table */}
      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100">
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Family Head</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Village</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Plot No.</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Employment</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700 text-center">Training</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700 text-center">Water</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700 text-center">Electricity</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700 text-center">Hospital</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Overall</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(r => {
                const cfg = statusCfg[r.overallStatus];
                const emp = empCfg[r.employmentStatus];
                return (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-3.5 py-2.5 font-semibold text-slate-900">{r.familyHead}</td>
                    <td className="px-3.5 py-2.5 text-slate-600">{r.village}</td>
                    <td className="px-3.5 py-2.5 font-mono text-[11px] text-[#0B3559] font-bold">
                      {r.housePlotNo !== '—' ? r.housePlotNo : <span className="text-slate-400">Not allotted</span>}
                      {r.housePlotArea !== '—' && <div className="text-[10px] text-slate-400">{r.housePlotArea}</div>}
                    </td>
                    <td className={`px-3.5 py-2.5 text-xs font-medium ${emp.color}`}>{emp.label}</td>
                    <td className="px-3.5 py-2.5 text-center"><BoolCell val={r.skillTraining} /></td>
                    <td className="px-3.5 py-2.5 text-center"><BoolCell val={r.waterConnection} /></td>
                    <td className="px-3.5 py-2.5 text-center"><BoolCell val={r.electricityConnection} /></td>
                    <td className="px-3.5 py-2.5 text-center"><BoolCell val={r.hospitalNearby} /></td>
                    <td className="px-3.5 py-2.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-medium ${cfg.badge}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                      {r.completedDate && <div className="text-[10px] text-slate-400 mt-0.5">{r.completedDate}</div>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RRBenefitsPage;
