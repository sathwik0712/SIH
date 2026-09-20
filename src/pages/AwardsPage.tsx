import React, { useEffect, useState } from 'react';
import { Award, FileText, Search, Filter, AlertCircle, Calendar } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { apiFetch } from '../api/client';

interface AwardRecord {
  id: string;
  lacNumber: string;
  projectCode: string;
  parcelId: string;
  ownerName: string;
  awardDate: string;
  baseValue: string;
  solatiumMultiplier: number;
  totalAward: string;
  objectionCount: number;
  status: 'DRAFT' | 'APPROVED' | 'DISPUTED' | 'DISBURSED';
}

const MOCK_AWARDS: AwardRecord[] = [
  { id: 'AWD-001', lacNumber: 'LAC/2025/142', projectCode: 'NH65-HYD-PUN-01', parcelId: 'LP-PUN-001 (142/1A)', ownerName: 'Shri Tukaram S. Gaikwad', awardDate: '10 May 2025', baseValue: '₹74.25L', solatiumMultiplier: 2.0, totalAward: '₹1.48Cr', objectionCount: 0, status: 'APPROVED' },
  { id: 'AWD-002', lacNumber: 'LAC/2025/143', projectCode: 'NH65-HYD-PUN-01', parcelId: 'LP-PUN-002 (142/1B)', ownerName: 'M/s Shinde Agro', awardDate: '12 May 2025', baseValue: '₹1.42Cr', solatiumMultiplier: 2.0, totalAward: '₹2.84Cr', objectionCount: 0, status: 'DISBURSED' },
  { id: 'AWD-003', lacNumber: 'LAC/2025/144', projectCode: 'NH65-HYD-PUN-01', parcelId: 'LP-SOL-047 (104/3B)', ownerName: 'Smt. Rukmini B. Jadhav', awardDate: '-', baseValue: '₹77.50L', solatiumMultiplier: 2.0, totalAward: '₹1.55Cr', objectionCount: 2, status: 'DISPUTED' },
  { id: 'AWD-004', lacNumber: 'LAC/2025/145', projectCode: 'DFCCIL-EDFC-04', parcelId: 'LP-VAR-012 (45/1)', ownerName: 'Ramesh Singh', awardDate: '15 May 2025', baseValue: '₹45.00L', solatiumMultiplier: 1.5, totalAward: '₹67.50L', objectionCount: 0, status: 'DRAFT' },
  { id: 'AWD-005', lacNumber: 'LAC/2025/146', projectCode: 'SECI-SOLAR-TUM-01', parcelId: 'LP-TUM-088 (12/4)', ownerName: 'Anil Gowda', awardDate: '20 May 2025', baseValue: '₹12.00L', solatiumMultiplier: 1.0, totalAward: '₹12.00L', objectionCount: 1, status: 'APPROVED' },
];

export const AwardsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [awards, setAwards] = useState<AwardRecord[]>(MOCK_AWARDS);

  useEffect(() => {
    apiFetch<AwardRecord[]>('/awards')
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          setAwards([...res.data, ...MOCK_AWARDS]);
        }
      })
      .catch(err => console.error('Failed to load awards:', err));
  }, []);

  const filtered = awards.filter(a => {
    const s = search.toLowerCase();
    const matchesSearch = a.lacNumber.toLowerCase().includes(s) || a.ownerName.toLowerCase().includes(s) || a.parcelId.toLowerCase().includes(s);
    const matchesFilter = filter === 'ALL' || a.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-700 rounded flex items-center justify-center">
            <Award className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#0B3559]">Section 23 & 30 Awards Register</h1>
            <p className="text-xs text-slate-500">Manage Land Acquisition Committee (LAC) awards, solatium, and apportionments</p>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Awards Declared', val: '1,432', color: 'border-l-[#0B3559]', sub: 'Across 10 projects' },
          { label: 'Total Value (Cr)', val: '₹ 1,950', color: 'border-l-purple-600', sub: 'Incl. Solatium (100%)' },
          { label: 'Pending Drafts', val: '45', color: 'border-l-amber-500', sub: 'Awaiting Collector Approval' },
          { label: 'Sec 30 Apportionment Disputes', val: '12', color: 'border-l-red-500', sub: 'Referred to Authority' },
        ].map(k => (
          <div key={k.label} className={`bg-white border border-slate-200 border-l-4 ${k.color} rounded p-3 shadow-sm`}>
            <div className="text-[11px] text-slate-500 font-medium">{k.label}</div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">{k.val}</div>
            <div className="text-[10px] text-slate-400">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded p-3 shadow-sm flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input type="text" placeholder="Search by LAC, Owner, Parcel..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 text-xs border-none outline-none text-slate-700 placeholder-slate-400" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select value={filter} onChange={e => setFilter(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white text-slate-700">
            <option value="ALL">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="APPROVED">Approved</option>
            <option value="DISBURSED">Disbursed</option>
            <option value="DISPUTED">Disputed</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100">
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">LAC Reference</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Parcel / Project</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Owner(s)</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Base Value</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Solatium</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Total Award</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Status</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-3.5 py-2.5">
                    <div className="font-mono font-bold text-[#0B3559]">{a.lacNumber}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {a.awardDate}
                    </div>
                  </td>
                  <td className="px-3.5 py-2.5">
                    <div className="font-semibold text-slate-800">{a.parcelId}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{a.projectCode}</div>
                  </td>
                  <td className="px-3.5 py-2.5 text-slate-700 font-medium">
                    {a.ownerName}
                    {a.objectionCount > 0 && (
                      <div className="text-[10px] text-red-600 font-semibold mt-0.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {a.objectionCount} Objections
                      </div>
                    )}
                  </td>
                  <td className="px-3.5 py-2.5 font-mono text-slate-700">{a.baseValue}</td>
                  <td className="px-3.5 py-2.5 font-mono text-slate-600">{a.solatiumMultiplier}x</td>
                  <td className="px-3.5 py-2.5 font-mono font-bold text-emerald-700">{a.totalAward}</td>
                  <td className="px-3.5 py-2.5">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-3.5 py-2.5 text-right">
                    <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 ml-auto border border-slate-300 text-slate-700 rounded hover:bg-slate-100 transition-colors font-semibold text-[11px]">
                      <FileText className="w-3.5 h-3.5" />
                      View Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AwardsPage;
