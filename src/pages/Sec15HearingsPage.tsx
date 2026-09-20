import React, { useState } from 'react';
import { Gavel, Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';

const MOCK_HEARINGS = [
  { id: 'HRG-101', projectCode: 'NH65-HYD-PUN-01', objector: 'Smt. Rukmini B. Jadhav', parcelId: 'LP-SOL-047', hearingDate: '2025-05-28 10:30 AM', objectionType: 'Valuation of crop trees', attendance: 'PRESENT', status: 'PENDING_DECISION', slecRecommendation: '—' },
  { id: 'HRG-102', projectCode: 'NH65-HYD-PUN-01', objector: 'Pandurang M. Shinde', parcelId: 'LP-SOL-045', hearingDate: '2025-05-28 11:15 AM', objectionType: 'Apportionment Dispute', attendance: 'ABSENT', status: 'REJECTED', slecRecommendation: 'Dismissed due to non-appearance.' },
  { id: 'HRG-103', projectCode: 'DFCCIL-EDFC-04', objector: 'Ramesh Singh', parcelId: 'LP-VAR-012', hearingDate: '2025-05-15 02:00 PM', objectionType: 'Alignment Change Request', attendance: 'PRESENT', status: 'ACCEPTED', slecRecommendation: 'Marginal alignment shift recommended to save residential structure.' },
];

export const Sec15HearingsPage: React.FC = () => {
  const [data] = useState(MOCK_HEARINGS);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-600 rounded flex items-center justify-center">
            <Gavel className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#0B3559]">Section 15 Hearing Schedule Manager</h1>
            <p className="text-xs text-slate-500">Manage statutory objection hearings, attendance, and Collector recommendations</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-[#0B3559] text-white rounded hover:bg-[#071E3D] transition-colors">
          <Calendar className="w-3.5 h-3.5" /> Schedule Hearing
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100">
              <th className="px-3.5 py-2.5 font-semibold text-slate-700">Hearing Ref & Date</th>
              <th className="px-3.5 py-2.5 font-semibold text-slate-700">Objector / Parcel</th>
              <th className="px-3.5 py-2.5 font-semibold text-slate-700">Objection Ground</th>
              <th className="px-3.5 py-2.5 font-semibold text-slate-700">Attendance</th>
              <th className="px-3.5 py-2.5 font-semibold text-slate-700">Outcome & Recommendation</th>
              <th className="px-3.5 py-2.5 font-semibold text-slate-700 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map(row => (
              <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-3.5 py-2.5">
                  <div className="font-mono font-bold text-slate-900">{row.id}</div>
                  <div className="text-[10px] text-amber-700 font-semibold mt-0.5 flex items-center gap-1"><Calendar className="w-3 h-3"/> {row.hearingDate}</div>
                </td>
                <td className="px-3.5 py-2.5">
                  <div className="font-semibold text-slate-900">{row.objector}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{row.parcelId}</div>
                </td>
                <td className="px-3.5 py-2.5 text-slate-700 font-medium">{row.objectionType}</td>
                <td className="px-3.5 py-2.5">
                  <span className={`inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded ${row.attendance === 'PRESENT' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {row.attendance}
                  </span>
                </td>
                <td className="px-3.5 py-2.5">
                  <div className="mb-1">
                    {row.status === 'ACCEPTED' && <span className="text-emerald-700 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5"/> Accepted</span>}
                    {row.status === 'REJECTED' && <span className="text-red-600 font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5"/> Rejected</span>}
                    {row.status === 'PENDING_DECISION' && <span className="text-amber-600 font-bold flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> Pending</span>}
                  </div>
                  <div className="text-[10px] text-slate-500">{row.slecRecommendation}</div>
                </td>
                <td className="px-3.5 py-2.5 text-right">
                  <button className="text-[#0B3559] hover:underline font-semibold flex items-center justify-end gap-1 ml-auto">
                    Record Outcome
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

export default Sec15HearingsPage;
