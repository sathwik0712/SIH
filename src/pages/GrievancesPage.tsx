import React, { useState } from 'react';
import { MessageSquareWarning, Search, Filter, MessageSquare, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

const MOCK_GRIEVANCES = [
  { id: 'GRV-2026-001', date: '2025-05-18', projectCode: 'NH65-HYD-PUN-01', claimant: 'Ramesh Patil', category: 'COMPENSATION', description: 'Compensation assessed is lower than current market value in Hadapsar.', status: 'OPEN', resolution: '—' },
  { id: 'GRV-2026-002', date: '2025-05-20', projectCode: 'DFCCIL-EDFC-04', claimant: 'Sunita Deshpande', category: 'R_AND_R', description: 'Alternative house plot allotted is 20km away from original village.', status: 'IN_PROGRESS', resolution: 'Under review by CALA.' },
  { id: 'GRV-2026-003', date: '2025-05-10', projectCode: 'SECI-SOLAR-TUM-01', claimant: 'Anil Gowda', category: 'MEASUREMENT', description: 'Survey map includes 0.5 Ha of unnotified land.', status: 'RESOLVED', resolution: 'Survey team re-verified and corrected the area.' },
];

export const GrievancesPage: React.FC = () => {
  const [data] = useState(MOCK_GRIEVANCES);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-700 rounded flex items-center justify-center">
            <MessageSquareWarning className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#0B3559]">Landowner Grievance Portal</h1>
            <p className="text-xs text-slate-500">Track and resolve complaints regarding compensation, measurement, and R&R</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-[#0B3559] text-white rounded hover:bg-[#071E3D] transition-colors">
          <MessageSquare className="w-3.5 h-3.5" /> Log New Grievance
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded p-3 shadow-sm flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input type="text" placeholder="Search by GRV ID, Claimant..." className="flex-1 text-xs border-none outline-none text-slate-700 placeholder-slate-400" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select className="text-xs border border-slate-200 rounded px-2 py-1 bg-white text-slate-700">
            <option value="ALL">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100">
              <th className="px-3.5 py-2.5 font-semibold text-slate-700">GRV ID & Date</th>
              <th className="px-3.5 py-2.5 font-semibold text-slate-700">Project / Claimant</th>
              <th className="px-3.5 py-2.5 font-semibold text-slate-700">Category</th>
              <th className="px-3.5 py-2.5 font-semibold text-slate-700 w-1/3">Description & Resolution</th>
              <th className="px-3.5 py-2.5 font-semibold text-slate-700">Status</th>
              <th className="px-3.5 py-2.5 font-semibold text-slate-700 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map(row => (
              <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-3.5 py-2.5">
                  <div className="font-mono font-bold text-red-700">{row.id}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{row.date}</div>
                </td>
                <td className="px-3.5 py-2.5">
                  <div className="font-semibold text-slate-900">{row.claimant}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{row.projectCode}</div>
                </td>
                <td className="px-3.5 py-2.5 font-mono text-[10px]"><span className="bg-slate-100 px-2 py-1 rounded text-slate-600">{row.category}</span></td>
                <td className="px-3.5 py-2.5">
                  <div className="text-slate-800 font-medium mb-1">{row.description}</div>
                  <div className="text-[10px] text-slate-500 border-l-2 border-slate-300 pl-2">{row.resolution}</div>
                </td>
                <td className="px-3.5 py-2.5"><StatusBadge status={row.status} /></td>
                <td className="px-3.5 py-2.5 text-right">
                  <button className="text-[#0B3559] hover:underline font-semibold flex items-center justify-end gap-1 ml-auto">
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GrievancesPage;
