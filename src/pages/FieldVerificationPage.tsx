import React, { useState } from 'react';
import { Camera, MapPin, Search, Filter, FileCheck, Map, Image as ImageIcon } from 'lucide-react';

interface Verification {
  id: string;
  surveyNo: string;
  village: string;
  assignedTo: string;
  dateScheduled: string;
  gpsCoordinates: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
  areaVerified?: number;
  assetsFound?: string[];
  remarks?: string;
}

const MOCK_VERIFICATIONS: Verification[] = [
  { id: 'FV-001', surveyNo: '14/2A', village: 'Bhosari', assignedTo: 'Suraj Verma (RI)', dateScheduled: '12 Jan 2025', gpsCoordinates: '18.520, 73.855', status: 'COMPLETED', areaVerified: 1.2, assetsFound: ['Borewell', 'Mango Tree (x2)'], remarks: 'Matched with cadastral map perfectly.' },
  { id: 'FV-002', surveyNo: '14/2B', village: 'Bhosari', assignedTo: 'Suraj Verma (RI)', dateScheduled: '12 Jan 2025', gpsCoordinates: '18.522, 73.858', status: 'COMPLETED', areaVerified: 0.8, assetsFound: [], remarks: 'Barren land, no structures.' },
  { id: 'FV-003', surveyNo: '15/1', village: 'Bhosari', assignedTo: 'Anil Desai (Talathi)', dateScheduled: '14 Jan 2025', gpsCoordinates: '18.518, 73.852', status: 'IN_PROGRESS', remarks: 'Survey boundary dispute with neighboring parcel.' },
  { id: 'FV-004', surveyNo: '16/3', village: 'Chikhali', assignedTo: 'Priya Sharma (RI)', dateScheduled: '15 Jan 2025', gpsCoordinates: '18.525, 73.860', status: 'REJECTED', remarks: 'Owner not present during joint measurement.' },
  { id: 'FV-005', surveyNo: '16/4', village: 'Chikhali', assignedTo: 'Priya Sharma (RI)', dateScheduled: '16 Jan 2025', gpsCoordinates: '18.516, 73.862', status: 'PENDING' },
  { id: 'FV-006', surveyNo: '17/1', village: 'Moshi', assignedTo: 'Anil Desai (Talathi)', dateScheduled: '18 Jan 2025', gpsCoordinates: '18.528, 73.856', status: 'PENDING' },
];

const statusStyles: Record<string, string> = {
  COMPLETED: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  IN_PROGRESS: 'bg-blue-50 text-blue-800 border-blue-200',
  PENDING: 'bg-amber-50 text-amber-800 border-amber-300',
  REJECTED: 'bg-red-50 text-red-800 border-red-200',
};

export const FieldVerificationPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  const filtered = MOCK_VERIFICATIONS.filter(v => {
    const s = search.toLowerCase();
    const matchesSearch = v.surveyNo.toLowerCase().includes(s) || v.village.toLowerCase().includes(s) || v.assignedTo.toLowerCase().includes(s);
    const matchesFilter = filter === 'ALL' || v.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sky-700 rounded flex items-center justify-center">
            <Camera className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#0B3559]">Field Inspection & Joint Measurement</h1>
            <p className="text-xs text-slate-500">Ground truthing, asset enumeration, and cadastral survey matching</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Scheduled', val: MOCK_VERIFICATIONS.length, color: 'border-l-[#0B3559]' },
          { label: 'Completed', val: MOCK_VERIFICATIONS.filter(v => v.status === 'COMPLETED').length, color: 'border-l-emerald-600' },
          { label: 'In Progress / Pending', val: MOCK_VERIFICATIONS.filter(v => v.status === 'IN_PROGRESS' || v.status === 'PENDING').length, color: 'border-l-amber-500' },
          { label: 'Rejected / Rescheduled', val: MOCK_VERIFICATIONS.filter(v => v.status === 'REJECTED').length, color: 'border-l-red-500' },
        ].map(k => (
          <div key={k.label} className={`bg-white border border-slate-200 border-l-4 ${k.color} rounded p-3 shadow-sm`}>
            <div className="text-[11px] text-slate-500 font-medium">{k.label}</div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">{k.val}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded p-3 shadow-sm flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input type="text" placeholder="Search by survey no, village, or surveyor..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 text-xs border-none outline-none text-slate-700 placeholder-slate-400" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select value={filter} onChange={e => setFilter(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white text-slate-700">
            <option value="ALL">All Status</option>
            <option value="COMPLETED">Completed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100">
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Survey No / ID</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Location</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Assigned To</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Verification Details</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Photos</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Status</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(v => (
                <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-3.5 py-2.5">
                    <div className="font-mono font-bold text-[#0B3559]">{v.surveyNo}</div>
                    <div className="text-[10px] text-slate-400">{v.id}</div>
                  </td>
                  <td className="px-3.5 py-2.5">
                    <div className="font-semibold text-slate-800">{v.village}</div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-600" /> {v.gpsCoordinates}
                    </div>
                  </td>
                  <td className="px-3.5 py-2.5 text-slate-700 font-medium">{v.assignedTo}</td>
                  <td className="px-3.5 py-2.5">
                    {v.status === 'COMPLETED' ? (
                      <div className="text-[11px]">
                        <span className="font-mono text-emerald-700 font-bold">{v.areaVerified} Ha</span> verified
                        {v.assetsFound && v.assetsFound.length > 0 && (
                          <div className="text-slate-500 mt-0.5">Assets: {v.assetsFound.join(', ')}</div>
                        )}
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-500">Scheduled: {v.dateScheduled}</div>
                    )}
                    {v.remarks && <div className="text-[10px] text-slate-600 italic mt-1">"{v.remarks}"</div>}
                  </td>
                  <td className="px-3.5 py-2.5">
                    {v.status === 'COMPLETED' ? (
                      <div className="flex gap-1">
                        <div className="w-8 h-8 bg-slate-200 border border-slate-300 rounded flex items-center justify-center cursor-pointer hover:bg-slate-300 transition-colors">
                          <ImageIcon className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="w-8 h-8 bg-slate-200 border border-slate-300 rounded flex items-center justify-center cursor-pointer hover:bg-slate-300 transition-colors">
                          <ImageIcon className="w-4 h-4 text-slate-500" />
                        </div>
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-400 border border-dashed border-slate-300 rounded px-2 py-1 text-center bg-slate-50">Awaiting Upload</div>
                    )}
                  </td>
                  <td className="px-3.5 py-2.5">
                    <span className={`px-2 py-0.5 rounded border text-[11px] font-bold ${statusStyles[v.status]}`}>
                      {v.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-3.5 py-2.5 text-right">
                    <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 ml-auto border border-slate-300 text-slate-700 rounded hover:bg-slate-100 transition-colors font-semibold text-[11px]">
                      <FileCheck className="w-3.5 h-3.5" />
                      {v.status === 'COMPLETED' ? 'View Report' : 'Update'}
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

export default FieldVerificationPage;
