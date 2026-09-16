import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import type { LandParcel } from '../types';
import type { Column } from '../components/common/DataTable';
import { DataTable } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { Plus, History } from 'lucide-react';

export const LandParcels: React.FC = () => {
  const [parcels, setParcels] = useState<LandParcel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<LandParcel>>({
    parcelCode: '',
    surveyNumber: '',
    village: '',
    mandalOrTehsil: '',
    district: '',
    state: '',
    areaHectares: 0,
    landType: 'Agricultural',
    ownershipType: 'Private',
    ownerName: '',
  });
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);
  const [parcelHistory, setParcelHistory] = useState<any[]>([]);

  const loadHistory = (parcelId: string) => {
    setSelectedParcelId(parcelId);
    setHistoryModalOpen(true);
    setParcelHistory([
      { date: '2025-05-10', event: 'Parcel Data Verified by Field Officer', user: 'Ramesh Singh' },
      { date: '2025-05-12', event: 'Section 11 Notification Drafted', user: 'CALA Solapur' },
      { date: '2025-05-20', event: 'Compensation Assessed at ₹12.5L', user: 'System' }
    ]);
  };

  const loadParcels = () => {
    setIsLoading(true);
    apiFetch<LandParcel[]>('/parcels')
      .then(res => {
        if (res.success && res.data) {
          setParcels(res.data);
        }
      })
      .catch(err => console.error('Failed to load parcels:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadParcels();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch<LandParcel>('/parcels', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      if (res.success) {
        setIsModalOpen(false);
        loadParcels();
      }
    } catch (err) {
      console.error('Failed to create parcel:', err);
    }
  };

  const columns: Column<LandParcel>[] = [
    {
      key: 'parcelCode',
      header: 'Parcel ID',
      sortable: true,
      className: 'font-mono font-bold text-gov-navy-800',
    },
    {
      key: 'surveyNumber',
      header: 'Survey / Khasra No',
      sortable: true,
      render: item => (
        <div>
          <span className="font-semibold text-slate-800 font-mono">{item.surveyNumber}</span>
          <span className="text-[10px] text-slate-400 block font-mono">({item.khasraNumber || 'N/A'})</span>
        </div>
      ),
    },
    {
      key: 'village',
      header: 'Village & Mandal',
      sortable: true,
      render: item => (
        <div>
          <span className="font-semibold text-slate-800">{item.village}</span>
          <span className="text-[11px] text-slate-500 block">{item.mandalOrTehsil}, {item.district}</span>
        </div>
      ),
    },
    {
      key: 'areaHectares',
      header: 'Area (Ha)',
      sortable: true,
      render: item => <span className="font-mono font-bold">{item.areaHectares} Ha</span>,
    },
    {
      key: 'landType',
      header: 'Land Type',
      sortable: true,
      render: item => (
        <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] text-slate-700">
          {item.landType}
        </span>
      ),
    },
    {
      key: 'ownerName',
      header: 'Title Holder (Owner)',
      sortable: true,
      render: item => (
        <div>
          <span className="font-medium text-slate-900">{item.ownerName}</span>
          <span className="text-[10px] text-slate-400 block">{item.ownershipType}</span>
        </div>
      ),
    },
    {
      key: 'verificationStatus',
      header: 'Verification',
      sortable: true,
      render: item => <StatusBadge status={item.verificationStatus} />,
    },
    {
      key: 'acquisitionStatus',
      header: 'Acquisition Stage',
      sortable: true,
      render: item => <StatusBadge status={item.acquisitionStatus} />,
    },
    {
      key: 'compensationStatus',
      header: 'Compensation',
      sortable: true,
      render: item => <StatusBadge status={item.compensationStatus} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: item => (
        <button 
          onClick={() => loadHistory(String(item.id))}
          className="text-[#0B3559] hover:underline font-semibold flex items-center gap-1 text-[11px]"
        >
          <History className="w-3.5 h-3.5" /> History
        </button>
      ),
    }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-gov-navy-900">Cadastral Land Parcels Registry</h2>
          <p className="text-xs text-slate-600">
            Survey-level spatial land inventory with verified revenue boundaries and ownership records.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-gov-navy-800 hover:bg-gov-navy-900 text-white rounded text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Land Parcel</span>
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-lg max-w-lg w-full">
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-800">Add New Land Parcel</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Parcel Code</label>
                  <input type="text" required value={formData.parcelCode} onChange={e => setFormData({...formData, parcelCode: e.target.value})} className="w-full border border-slate-300 rounded px-2 py-1 text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Survey Number</label>
                  <input type="text" required value={formData.surveyNumber} onChange={e => setFormData({...formData, surveyNumber: e.target.value})} className="w-full border border-slate-300 rounded px-2 py-1 text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Owner Name</label>
                  <input type="text" required value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} className="w-full border border-slate-300 rounded px-2 py-1 text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Area (Hectares)</label>
                  <input type="number" step="0.01" required value={formData.areaHectares} onChange={e => setFormData({...formData, areaHectares: parseFloat(e.target.value)})} className="w-full border border-slate-300 rounded px-2 py-1 text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Village</label>
                  <input type="text" required value={formData.village} onChange={e => setFormData({...formData, village: e.target.value})} className="w-full border border-slate-300 rounded px-2 py-1 text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">District</label>
                  <input type="text" required value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full border border-slate-300 rounded px-2 py-1 text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">State</label>
                  <input type="text" required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full border border-slate-300 rounded px-2 py-1 text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Mandal/Tehsil</label>
                  <input type="text" required value={formData.mandalOrTehsil} onChange={e => setFormData({...formData, mandalOrTehsil: e.target.value})} className="w-full border border-slate-300 rounded px-2 py-1 text-xs" />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded text-xs">Cancel</button>
                <button type="submit" className="px-3 py-1.5 bg-gov-navy-800 text-white rounded text-xs">Save Parcel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {historyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-lg max-w-md w-full">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <History className="w-4 h-4 text-[#0B3559]" /> Status History
              </h3>
              <button onClick={() => setHistoryModalOpen(false)} className="text-slate-400 hover:text-slate-600">×</button>
            </div>
            <div className="p-4">
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {parcelHistory.map((item, idx) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-white bg-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ml-1 mt-1 z-10" />
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded border border-slate-200 bg-slate-50 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <time className="text-[10px] font-mono text-slate-500 font-bold">{item.date}</time>
                      </div>
                      <div className="text-xs text-slate-800 font-medium">{item.event}</div>
                      <div className="text-[10px] text-slate-500 mt-1">By: {item.user}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <DataTable
        columns={columns}
        data={parcels}
        isLoading={isLoading}
        searchPlaceholder="Search by Survey No, Khasra, Village, Mandal, or Owner Name..."
        searchField={p => `${p.parcelCode} ${p.surveyNumber} ${p.khasraNumber} ${p.village} ${p.ownerName} ${p.mandalOrTehsil}`}
      />
    </div>
  );
};
