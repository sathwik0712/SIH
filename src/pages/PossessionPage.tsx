import React, { useState } from 'react';
import { Key, CheckCircle2, Clock, AlertTriangle, MapPin, FileText, Download, Filter, Search, Calendar } from 'lucide-react';

interface PossessionRecord {
  id: string;
  surveyNo: string;
  owner: string;
  village: string;
  area: number;
  possessionType: 'VOLUNTARY' | 'COURT_ORDER' | 'GAZETTE';
  compensationStatus: 'PAID' | 'PENDING' | 'DISPUTED';
  panchnama: boolean;
  panchnamaDate?: string;
  fencing: boolean;
  mutationStatus: 'COMPLETED' | 'INITIATED' | 'PENDING';
  overallStatus: 'POSSESSION_TAKEN' | 'IN_PROGRESS' | 'PENDING' | 'DELAYED';
  targetDate: string;
  remarks?: string;
}

const MOCK_POSSESSION: PossessionRecord[] = [
  { id: 'POS001', surveyNo: '14/2A', owner: 'Ramesh Patil', village: 'Bhosari', area: 1.2, possessionType: 'VOLUNTARY', compensationStatus: 'PAID', panchnama: true, panchnamaDate: '20 May 2025', fencing: true, mutationStatus: 'COMPLETED', overallStatus: 'POSSESSION_TAKEN', targetDate: '01 Jun 2025' },
  { id: 'POS002', surveyNo: '14/2B', owner: 'Sunita Deshpande', village: 'Bhosari', area: 0.8, possessionType: 'VOLUNTARY', compensationStatus: 'PAID', panchnama: true, panchnamaDate: '22 May 2025', fencing: false, mutationStatus: 'INITIATED', overallStatus: 'IN_PROGRESS', targetDate: '15 Jun 2025', remarks: 'Fencing pending — contractor mobilising' },
  { id: 'POS003', surveyNo: '15/1', owner: 'Govind Shinde', village: 'Bhosari', area: 2.5, possessionType: 'GAZETTE', compensationStatus: 'DISPUTED', panchnama: false, fencing: false, mutationStatus: 'PENDING', overallStatus: 'DELAYED', targetDate: '01 Jun 2025', remarks: 'Court stay order filed — HC petition no. HC/2025/0432' },
  { id: 'POS004', surveyNo: '16/3', owner: 'Lata Kulkarni', village: 'Chikhali', area: 1.8, possessionType: 'VOLUNTARY', compensationStatus: 'PAID', panchnama: true, panchnamaDate: '25 May 2025', fencing: true, mutationStatus: 'COMPLETED', overallStatus: 'POSSESSION_TAKEN', targetDate: '01 Jun 2025' },
  { id: 'POS005', surveyNo: '16/4', owner: 'Vijay More', village: 'Chikhali', area: 0.6, possessionType: 'VOLUNTARY', compensationStatus: 'PENDING', panchnama: false, fencing: false, mutationStatus: 'PENDING', overallStatus: 'PENDING', targetDate: '30 Jun 2025', remarks: 'Awaiting compensation clearance from PFMS' },
  { id: 'POS006', surveyNo: '17/1', owner: 'Anita Jadhav', village: 'Moshi', area: 3.1, possessionType: 'VOLUNTARY', compensationStatus: 'PAID', panchnama: true, panchnamaDate: '01 Jun 2025', fencing: true, mutationStatus: 'INITIATED', overallStatus: 'IN_PROGRESS', targetDate: '20 Jun 2025' },
  { id: 'POS007', surveyNo: '17/2', owner: 'Suresh Kale', village: 'Moshi', area: 1.4, possessionType: 'GAZETTE', compensationStatus: 'PENDING', panchnama: false, fencing: false, mutationStatus: 'PENDING', overallStatus: 'PENDING', targetDate: '30 Jun 2025' },
  { id: 'POS008', surveyNo: '18/1', owner: 'Priya Gaikwad', village: 'Moshi', area: 2.2, possessionType: 'GAZETTE', compensationStatus: 'DISPUTED', panchnama: false, fencing: false, mutationStatus: 'PENDING', overallStatus: 'DELAYED', targetDate: '15 Jun 2025', remarks: 'Objection under Sec 64 filed — hearing on 10 Jul 2025' },
];

const statusCfg: Record<string, { badge: string; dot: string; label: string; icon: React.ElementType }> = {
  POSSESSION_TAKEN: { badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500', label: 'Possession Taken', icon: CheckCircle2 },
  IN_PROGRESS:      { badge: 'bg-blue-50 text-blue-800 border-blue-200',          dot: 'bg-blue-500',   label: 'In Progress',     icon: Clock },
  PENDING:          { badge: 'bg-amber-50 text-amber-800 border-amber-300',        dot: 'bg-amber-500',  label: 'Pending',         icon: Clock },
  DELAYED:          { badge: 'bg-red-50 text-red-800 border-red-200',              dot: 'bg-red-500',    label: 'Delayed',         icon: AlertTriangle },
};

const mutationCfg: Record<string, string> = {
  COMPLETED: 'text-emerald-700 font-semibold',
  INITIATED: 'text-blue-700 font-semibold',
  PENDING:   'text-slate-400',
};

const compensationCfg: Record<string, string> = {
  PAID:     'bg-emerald-50 text-emerald-800 border-emerald-200',
  PENDING:  'bg-amber-50 text-amber-800 border-amber-300',
  DISPUTED: 'bg-red-50 text-red-800 border-red-200',
};

export const PossessionPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filtered = MOCK_POSSESSION.filter(p => {
    const matchSearch = search === '' || p.owner.toLowerCase().includes(search.toLowerCase()) || p.surveyNo.includes(search) || p.village.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || p.overallStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const taken     = MOCK_POSSESSION.filter(p => p.overallStatus === 'POSSESSION_TAKEN').length;
  const inProg    = MOCK_POSSESSION.filter(p => p.overallStatus === 'IN_PROGRESS').length;
  const pending   = MOCK_POSSESSION.filter(p => p.overallStatus === 'PENDING').length;
  const delayed   = MOCK_POSSESSION.filter(p => p.overallStatus === 'DELAYED').length;
  const totalArea = MOCK_POSSESSION.reduce((acc, p) => acc + p.area, 0);
  const takenArea = MOCK_POSSESSION.filter(p => p.overallStatus === 'POSSESSION_TAKEN').reduce((acc, p) => acc + p.area, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-700 rounded flex items-center justify-center">
            <Key className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#0B3559]">Possession Status Tracker — Sec 38 Handover</h1>
            <p className="text-xs text-slate-500">Parcel-wise physical possession, panchnama, and revenue mutation tracking</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-[#0B3559] text-white rounded hover:bg-[#071E3D] transition-colors">
          <Download className="w-3.5 h-3.5" /> Export Possession Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Possession Taken', val: taken, sub: `${takenArea.toFixed(1)} Ha secured`, color: 'border-l-emerald-600' },
          { label: 'In Progress', val: inProg, sub: 'Panchnama drawn', color: 'border-l-blue-600' },
          { label: 'Pending', val: pending, sub: 'Awaiting clearance', color: 'border-l-amber-500' },
          { label: 'Delayed', val: delayed, sub: 'Court stays / disputes', color: 'border-l-red-600' },
        ].map(k => (
          <div key={k.label} className={`bg-white border border-slate-200 border-l-4 ${k.color} rounded p-3 shadow-sm`}>
            <div className="text-[11px] text-slate-500 font-medium">{k.label}</div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-0.5">{k.val}</div>
            <div className="text-[10px] text-slate-400">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Area progress */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Overall Possession Progress (Hectares)</h3>
          <span className="text-[11px] font-mono text-slate-500">{takenArea.toFixed(1)} Ha / {totalArea.toFixed(1)} Ha ({Math.round((takenArea / totalArea) * 100)}%)</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
          <div className="bg-emerald-600 h-3 transition-all" style={{ width: `${(takenArea / totalArea) * 100}%` }} />
          <div className="bg-blue-400 h-3 transition-all" style={{ width: `${(MOCK_POSSESSION.filter(p => p.overallStatus === 'IN_PROGRESS').reduce((acc, p) => acc + p.area, 0) / totalArea) * 100}%` }} />
          <div className="bg-amber-400 h-3 transition-all" style={{ width: `${(MOCK_POSSESSION.filter(p => p.overallStatus === 'PENDING').reduce((acc, p) => acc + p.area, 0) / totalArea) * 100}%` }} />
          <div className="bg-red-400 h-3 transition-all" style={{ width: `${(MOCK_POSSESSION.filter(p => p.overallStatus === 'DELAYED').reduce((acc, p) => acc + p.area, 0) / totalArea) * 100}%` }} />
        </div>
        <div className="flex flex-wrap gap-4 mt-2 text-[11px]">
          {[['bg-emerald-500', 'Possession Taken'], ['bg-blue-400', 'In Progress'], ['bg-amber-400', 'Pending'], ['bg-red-400', 'Delayed']].map(([color, label]) => (
            <div key={label} className="flex items-center gap-1">
              <div className={`w-2.5 h-2.5 rounded-sm ${color}`} />
              <span className="text-slate-600">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded p-3 shadow-sm flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[180px]">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input type="text" placeholder="Search by owner, survey no, or village…" value={search} onChange={e => setSearch(e.target.value)} className="flex-1 text-xs border-none outline-none text-slate-700 placeholder-slate-400" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white text-slate-700">
            <option value="ALL">All Status</option>
            <option value="POSSESSION_TAKEN">Possession Taken</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="PENDING">Pending</option>
            <option value="DELAYED">Delayed</option>
          </select>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">{filtered.length} parcels</span>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100">
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Survey No.</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Owner / Village</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700 text-right">Area (Ha)</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Possession Type</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Compensation</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700 text-center">Panchnama</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700 text-center">Fencing</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Mutation</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Target Date</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(p => {
                const cfg = statusCfg[p.overallStatus];
                const StatusIcon = cfg.icon;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-3.5 py-2.5 font-mono font-bold text-[#0B3559]">{p.surveyNo}</td>
                    <td className="px-3.5 py-2.5">
                      <div className="font-semibold text-slate-900">{p.owner}</div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <MapPin className="w-3 h-3" />{p.village}
                      </div>
                    </td>
                    <td className="px-3.5 py-2.5 font-mono text-right font-bold text-slate-900">{p.area.toFixed(1)}</td>
                    <td className="px-3.5 py-2.5 text-slate-600 text-[11px]">{p.possessionType.replace('_', ' ')}</td>
                    <td className="px-3.5 py-2.5">
                      <span className={`px-1.5 py-0.5 rounded border text-[11px] font-medium ${compensationCfg[p.compensationStatus]}`}>{p.compensationStatus}</span>
                    </td>
                    <td className="px-3.5 py-2.5 text-center">
                      {p.panchnama ? (
                        <div className="flex flex-col items-center">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-[10px] text-slate-500">{p.panchnamaDate}</span>
                        </div>
                      ) : <Clock className="w-4 h-4 text-slate-300 mx-auto" />}
                    </td>
                    <td className="px-3.5 py-2.5 text-center">
                      {p.fencing ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <Clock className="w-4 h-4 text-slate-300 mx-auto" />}
                    </td>
                    <td className={`px-3.5 py-2.5 text-[11px] ${mutationCfg[p.mutationStatus]}`}>{p.mutationStatus}</td>
                    <td className="px-3.5 py-2.5">
                      <div className="flex items-center gap-1 text-[11px] text-slate-600">
                        <Calendar className="w-3 h-3 text-slate-400" />{p.targetDate}
                      </div>
                      {p.remarks && (
                        <div className="text-[10px] text-red-600 mt-0.5 max-w-[160px] truncate" title={p.remarks}>⚠ {p.remarks}</div>
                      )}
                    </td>
                    <td className="px-3.5 py-2.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border font-medium ${cfg.badge}`}>
                        <StatusIcon className="w-3 h-3" />{cfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 font-mono">
          {filtered.length} parcels · Total Area: {filtered.reduce((a, p) => a + p.area, 0).toFixed(1)} Ha · Panchnama drawn: {filtered.filter(p => p.panchnama).length}
        </div>
      </div>

      {/* Statutory warning */}
      <div className="bg-amber-50 border border-amber-200 rounded p-3 flex items-start gap-2 text-xs text-amber-800">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
        <span>
          <strong>Sec 38 Reminder:</strong> Physical possession can only be taken after full compensation disbursal to all affected persons. Disputed parcels (Govind Shinde, Priya Gaikwad) require court orders before any possession action.
        </span>
      </div>
    </div>
  );
};

export default PossessionPage;
