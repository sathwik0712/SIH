import React, { useState } from 'react';
import { Map, Layers, Filter, Info } from 'lucide-react';
import { CadastralMap, Parcel } from '../components/gis/CadastralMap';

// Mock parcel data for demonstration
const MOCK_PARCELS: Parcel[] = [
  { id: 'P001', surveyNo: '14/2A', owner: 'Ramesh Patil', area: 1.2, status: 'ACQUIRED', lat: 18.520, lng: 73.855, village: 'Bhosari', compensation: '₹24.6L' },
  { id: 'P002', surveyNo: '14/2B', owner: 'Sunita Deshpande', area: 0.8, status: 'PENDING', lat: 18.522, lng: 73.858, village: 'Bhosari', compensation: '₹16.4L' },
  { id: 'P003', surveyNo: '15/1', owner: 'Govind Shinde', area: 2.5, status: 'DISPUTED', lat: 18.518, lng: 73.852, village: 'Bhosari', compensation: '₹51.2L' },
  { id: 'P004', surveyNo: '16/3', owner: 'Lata Kulkarni', area: 1.8, status: 'ACQUIRED', lat: 18.525, lng: 73.860, village: 'Chikhali', compensation: '₹36.9L' },
  { id: 'P005', surveyNo: '16/4', owner: 'Vijay More', area: 0.6, status: 'NOTIFIED', lat: 18.516, lng: 73.862, village: 'Chikhali', compensation: '₹12.3L' },
  { id: 'P006', surveyNo: '17/1', owner: 'Anita Jadhav', area: 3.1, status: 'ACQUIRED', lat: 18.528, lng: 73.856, village: 'Moshi', compensation: '₹63.5L' },
  { id: 'P007', surveyNo: '17/2', owner: 'Suresh Kale', area: 1.4, status: 'PENDING', lat: 18.513, lng: 73.849, village: 'Moshi', compensation: '₹28.7L' },
  { id: 'P008', surveyNo: '18/1', owner: 'Priya Gaikwad', area: 2.2, status: 'DISPUTED', lat: 18.530, lng: 73.863, village: 'Moshi', compensation: '₹45.1L' },
];

const statusColors: Record<string, { dot: string; badge: string; label: string }> = {
  ACQUIRED: { dot: '#16a34a', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', label: 'Acquired' },
  PENDING:  { dot: '#d97706', badge: 'bg-amber-50 text-amber-800 border-amber-300',     label: 'Pending Award' },
  DISPUTED: { dot: '#dc2626', badge: 'bg-red-50 text-red-800 border-red-200',           label: 'Disputed' },
  NOTIFIED: { dot: '#2563eb', badge: 'bg-blue-50 text-blue-800 border-blue-200',        label: 'Notified (Sec 11)' },
};

export const GISMapPage: React.FC = () => {
  const [selected, setSelected] = useState<Parcel | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filtered = filterStatus === 'ALL' ? MOCK_PARCELS : MOCK_PARCELS.filter(p => p.status === filterStatus);
  const stats = {
    total: MOCK_PARCELS.length,
    acquired: MOCK_PARCELS.filter(p => p.status === 'ACQUIRED').length,
    pending: MOCK_PARCELS.filter(p => p.status === 'PENDING').length,
    disputed: MOCK_PARCELS.filter(p => p.status === 'DISPUTED').length,
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-emerald-700 rounded flex items-center justify-center">
            <Map className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#0B3559]">GIS Parcel Map — Land Acquisition Survey</h1>
            <p className="text-xs text-slate-500">Interactive cadastral map with parcel-level acquisition status overlay</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500 font-mono">OSM Base Layer · WGS84</span>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Parcels', val: stats.total, color: 'border-l-[#0B3559]', sub: 'Mapped on GIS' },
          { label: 'Acquired', val: stats.acquired, color: 'border-l-emerald-600', sub: `${Math.round((stats.acquired / stats.total) * 100)}% of total` },
          { label: 'Pending Award', val: stats.pending, color: 'border-l-amber-500', sub: 'Awaiting compensation' },
          { label: 'Disputed', val: stats.disputed, color: 'border-l-red-600', sub: 'Under litigation' },
        ].map(k => (
          <div key={k.label} className={`bg-white border border-slate-200 border-l-4 ${k.color} rounded p-3 shadow-sm`}>
            <div className="text-[11px] text-slate-500 font-medium">{k.label}</div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-0.5">{k.val}</div>
            <div className="text-[10px] text-slate-400">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-slate-200 bg-slate-50">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Survey Area — Pune District (MH)</h3>
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="text-xs border border-slate-200 rounded px-2 py-1 bg-white text-slate-700"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACQUIRED">Acquired</option>
                <option value="PENDING">Pending</option>
                <option value="DISPUTED">Disputed</option>
                <option value="NOTIFIED">Notified</option>
              </select>
            </div>
          </div>
          
          <div style={{ height: '420px', width: '100%', position: 'relative' }}>
            <CadastralMap 
              parcels={filtered} 
              onParcelSelect={(parcel) => setSelected(parcel)} 
              selectedParcelId={selected?.id} 
            />
          </div>

          {/* Legend */}
          <div className="p-3 border-t border-slate-200 bg-slate-50 flex flex-wrap gap-4 mt-auto">
            {Object.entries(statusColors).map(([key, val]) => (
              <div key={key} className="flex items-center gap-1.5 text-xs text-slate-700">
                <div className="w-3 h-3 rounded-full border border-white shadow" style={{ background: val.dot }} />
                <span>{val.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Parcel List */}
        <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden flex flex-col">
          <div className="p-3 border-b border-slate-200 bg-slate-50">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Parcel Registry ({filtered.length})</h3>
          </div>
          <div className="overflow-y-auto flex-1" style={{ maxHeight: '460px' }}>
            {filtered.map(parcel => {
              const cfg = statusColors[parcel.status];
              return (
                <button
                  key={parcel.id}
                  onClick={() => setSelected(parcel)}
                  className={`w-full text-left p-3 border-b border-slate-100 hover:bg-slate-50 transition-colors ${selected?.id === parcel.id ? 'bg-blue-50 border-blue-100' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono text-[#0B3559]">{parcel.surveyNo}</span>
                        <span className={`text-[11px] px-1.5 py-0.5 rounded border font-medium ${cfg.badge}`}>{cfg.label}</span>
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">{parcel.owner}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{parcel.village} · {parcel.area} Ha</div>
                    </div>
                    <span className="text-xs font-semibold text-slate-700 font-mono">{parcel.compensation}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected parcel detail */}
          {selected && (
            <div className="p-3 bg-blue-50 border-t border-blue-200 mt-auto">
              <div className="flex items-center gap-1 mb-2">
                <Info className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Selected Parcel</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs text-slate-700">
                <div><span className="font-semibold">Survey No:</span> {selected.surveyNo}</div>
                <div><span className="font-semibold">Village:</span> {selected.village}</div>
                <div><span className="font-semibold">Owner:</span> {selected.owner}</div>
                <div><span className="font-semibold">Area:</span> {selected.area} Ha</div>
                <div><span className="font-semibold">Status:</span> {statusColors[selected.status]?.label}</div>
                <div><span className="font-semibold">Compensation:</span> {selected.compensation}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GISMapPage;
