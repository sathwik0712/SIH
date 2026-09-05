import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import type { LandParcel } from '../types';
import type { Column } from '../components/common/DataTable';
import { DataTable } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { Plus } from 'lucide-react';

export const LandParcels: React.FC = () => {
  const [parcels, setParcels] = useState<LandParcel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiFetch<LandParcel[]>('/parcels')
      .then(res => {
        if (res.success && res.data) {
          setParcels(res.data);
        }
      })
      .catch(err => console.error('Failed to load parcels:', err))
      .finally(() => setIsLoading(false));
  }, []);

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
          onClick={() => alert('Add Land Parcel form will be fully available in Phase 2.')}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-gov-navy-800 hover:bg-gov-navy-900 text-white rounded text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Land Parcel</span>
        </button>
      </div>

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
