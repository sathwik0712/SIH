import React, { useState } from 'react';
import { Users, FileText, UploadCloud, CheckCircle2, AlertCircle, Clock, Download } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

const MOCK_SIA = [
  { id: 'SIA-001', projectCode: 'NH65-HYD-PUN-01', agency: 'TISS Mumbai', reportDate: '2024-11-15', expertReview: 'APPROVED', governmentConsent: 'GRANTED', status: 'COMPLETED' },
  { id: 'SIA-002', projectCode: 'DFCCIL-EDFC-04', agency: 'Center for Policy Research', reportDate: '2025-01-10', expertReview: 'CONDITIONAL', governmentConsent: 'PENDING', status: 'IN_PROGRESS' },
  { id: 'SIA-003', projectCode: 'SECI-SOLAR-TUM-01', agency: 'ISEC Bengaluru', reportDate: '—', expertReview: 'PENDING', governmentConsent: 'PENDING', status: 'PENDING' },
];

export const SIAPage: React.FC = () => {
  const [data] = useState(MOCK_SIA);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-700 rounded flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#0B3559]">Social Impact Assessment (SIA)</h1>
            <p className="text-xs text-slate-500">Statutory tracking of SIA reports, expert group reviews, and Govt. consent (Sec 4 to Sec 8)</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-[#0B3559] text-white rounded hover:bg-[#071E3D] transition-colors">
          <UploadCloud className="w-3.5 h-3.5" /> Upload SIA Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total SIA Initiated', val: '10', color: 'border-l-blue-600' },
          { label: 'SIA Reports Published', val: '7', color: 'border-l-emerald-600' },
          { label: 'Expert Group Cleared', val: '5', color: 'border-l-purple-600' },
          { label: 'Exempted (Sec 10A)', val: '2', color: 'border-l-amber-500' },
        ].map(k => (
          <div key={k.label} className={`bg-white border border-slate-200 border-l-4 ${k.color} rounded p-3 shadow-sm`}>
            <div className="text-[11px] text-slate-500 font-medium">{k.label}</div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">{k.val}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100">
              <th className="px-3.5 py-2.5 font-semibold text-slate-700">Project Code</th>
              <th className="px-3.5 py-2.5 font-semibold text-slate-700">SIA Agency</th>
              <th className="px-3.5 py-2.5 font-semibold text-slate-700">Report Date</th>
              <th className="px-3.5 py-2.5 font-semibold text-slate-700">Expert Group (Sec 7)</th>
              <th className="px-3.5 py-2.5 font-semibold text-slate-700">Govt Consent (Sec 8)</th>
              <th className="px-3.5 py-2.5 font-semibold text-slate-700">Overall Status</th>
              <th className="px-3.5 py-2.5 font-semibold text-slate-700 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map(row => (
              <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-3.5 py-2.5 font-mono font-bold text-[#0B3559]">{row.projectCode}</td>
                <td className="px-3.5 py-2.5 text-slate-700">{row.agency}</td>
                <td className="px-3.5 py-2.5 font-mono text-slate-600">{row.reportDate}</td>
                <td className="px-3.5 py-2.5">
                  <span className={`inline-flex items-center gap-1 font-semibold ${row.expertReview === 'APPROVED' ? 'text-emerald-700' : row.expertReview === 'CONDITIONAL' ? 'text-amber-600' : 'text-slate-500'}`}>
                    {row.expertReview === 'APPROVED' ? <CheckCircle2 className="w-3.5 h-3.5"/> : row.expertReview === 'CONDITIONAL' ? <AlertCircle className="w-3.5 h-3.5"/> : <Clock className="w-3.5 h-3.5"/>}
                    {row.expertReview}
                  </span>
                </td>
                <td className="px-3.5 py-2.5 font-semibold text-slate-700">{row.governmentConsent}</td>
                <td className="px-3.5 py-2.5"><StatusBadge status={row.status} /></td>
                <td className="px-3.5 py-2.5 text-right">
                  <button className="text-blue-600 hover:text-blue-800 font-semibold flex items-center justify-end gap-1 ml-auto">
                    <Download className="w-3.5 h-3.5" /> Report
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

export default SIAPage;
