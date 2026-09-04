import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RRBenefit } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { DataTable, Column } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { 
  Home, HeartHandshake, CheckCircle2, Building, 
  MapPin, Award, Edit, Check 
} from 'lucide-react';

interface RRBenefitsPageProps {
  onNavigate: (module: string, projectId?: string) => void;
}

export const RRBenefitsPage: React.FC<RRBenefitsPageProps> = ({ onNavigate }) => {
  const { rrBenefits, projects, updateRRBenefit } = useApp();

  const [filterProject, setFilterProject] = useState<string>('ALL');
  const [filterRelocation, setFilterRelocation] = useState<string>('ALL');
  const [editingBenefit, setEditingBenefit] = useState<RRBenefit | null>(null);

  const filteredBenefits = rrBenefits.filter((r) => {
    if (filterProject !== 'ALL' && r.projectId !== filterProject) return false;
    if (filterRelocation !== 'ALL' && r.relocationStatus !== filterRelocation) return false;
    return true;
  });

  const columns: Column<RRBenefit>[] = [
    {
      key: 'id',
      header: 'R&R Scheme ID',
      sortable: true,
      render: (r) => <span className="font-mono font-bold text-gov-navy text-xs">{r.id}</span>,
      width: '120px',
    },
    {
      key: 'headOfFamily',
      header: 'Head of Family & Village',
      sortable: true,
      render: (r) => (
        <div>
          <div className="font-bold text-gov-gray-900 text-xs">{r.headOfFamily}</div>
          <div className="text-[10px] text-gov-gray-500">{r.village} ({r.familyId})</div>
        </div>
      ),
    },
    {
      key: 'housingOption',
      header: 'Housing Entitlement (Sec 31)',
      sortable: true,
      render: (r) => (
        <div>
          <div className="font-semibold text-gov-gray-900 text-[11px]">{r.housingOption}</div>
          {r.colonyName && (
            <div className="text-[10px] text-gov-gray-500 font-mono">
              {r.colonyName} &mdash; {r.plotNumber}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'housingStatus',
      header: 'Housing Status',
      sortable: true,
      align: 'center',
      render: (r) => <StatusBadge status={r.housingStatus} size="sm" />,
      width: '120px',
    },
    {
      key: 'annuityOrJobOption',
      header: 'Livelihood & Rehabilitation Benefit',
      sortable: true,
      render: (r) => (
        <span className="text-[11px] text-gov-gray-800 font-medium">
          {r.annuityOrJobOption}
        </span>
      ),
    },
    {
      key: 'subsistenceGrantPaid',
      header: 'Subsistence ₹50k',
      sortable: true,
      align: 'center',
      render: (r) => (
        r.subsistenceGrantPaid ? (
          <span className="text-emerald-800 font-bold text-[11px] flex items-center justify-center gap-0.5">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Paid</span>
          </span>
        ) : (
          <span className="text-amber-800 text-[11px]">Pending</span>
        )
      ),
      width: '130px',
    },
    {
      key: 'relocationStatus',
      header: 'Relocation Progress',
      sortable: true,
      align: 'center',
      render: (r) => <StatusBadge status={r.relocationStatus} size="sm" />,
      width: '150px',
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'center',
      render: (r) => (
        <button
          onClick={() => setEditingBenefit(r)}
          className="px-2 py-1 bg-gov-navy text-white text-[11px] rounded font-medium hover:bg-gov-navy-hover flex items-center gap-1 mx-auto"
        >
          <Edit className="w-3 h-3 text-amber-400" />
          <span>Update</span>
        </button>
      ),
      width: '100px',
    },
  ];

  const handleUpdateSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBenefit) return;
    updateRRBenefit(editingBenefit);
    setEditingBenefit(null);
  };

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Resettlement & Rehabilitation (R&R)' }]} />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gov-gray-300 pb-3">
        <div>
          <h2 className="text-xl font-bold text-gov-navy font-serif flex items-center gap-2">
            <Home className="w-5 h-5 text-amber-500" />
            <span>Resettlement & Rehabilitation (R&R) Implementation</span>
          </h2>
          <p className="text-xs text-gov-gray-600">
            Mandatory entitlements under Section 31 and Second Schedule of RFCTLARR Act (Housing, Annuity, Employment & Grants)
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-white rounded border border-gov-gray-300">
          <span className="text-gov-gray-600 block">Total R&R Beneficiaries:</span>
          <span className="text-lg font-bold text-gov-navy font-serif">{rrBenefits.length} Families</span>
        </div>
        <div className="p-3 bg-emerald-50 rounded border border-emerald-300">
          <span className="text-emerald-900 block font-medium">Housing Plots Allotted:</span>
          <span className="text-lg font-bold text-emerald-950 font-serif">
            {rrBenefits.filter(r => r.housingStatus === 'Allotted').length} Units
          </span>
        </div>
        <div className="p-3 bg-blue-50 rounded border border-blue-300">
          <span className="text-blue-900 block font-medium">Relocation Completed:</span>
          <span className="text-lg font-bold text-blue-950 font-serif">
            {rrBenefits.filter(r => r.relocationStatus === 'Relocation Completed').length} Families
          </span>
        </div>
        <div className="p-3 bg-amber-50 rounded border border-amber-300">
          <span className="text-amber-900 block font-medium">Colony Construction:</span>
          <span className="text-lg font-bold text-amber-950 font-serif">On Schedule</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-3 bg-gov-gray-100 border border-gov-gray-300 rounded flex flex-wrap items-center gap-3 text-xs">
        <span className="font-bold text-gov-navy uppercase tracking-wider">Filters:</span>

        <label className="flex items-center gap-1">
          <span className="text-gov-gray-700">Project:</span>
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="px-2 py-1 text-xs border border-gov-gray-300 rounded bg-white max-w-xs"
          >
            <option value="ALL">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} — {p.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-1">
          <span className="text-gov-gray-700">Relocation Status:</span>
          <select
            value={filterRelocation}
            onChange={(e) => setFilterRelocation(e.target.value)}
            className="px-2 py-1 text-xs border border-gov-gray-300 rounded bg-white"
          >
            <option value="ALL">All Relocation States</option>
            <option value="Relocation Completed">Relocation Completed</option>
            <option value="In Progress">In Progress</option>
          </select>
        </label>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredBenefits}
        searchPlaceholder="Search family head, village, or R&R ID..."
        title={`R&R Entitlements & Allotments Registry (${filteredBenefits.length})`}
        subtitle="Individual family benefit tracking under the Second Schedule of RFCTLARR Act"
        exportFileName="bhoomisetu_rr_benefits"
      />

      {/* Edit Benefit Modal */}
      {editingBenefit && (
        <Modal
          isOpen={true}
          onClose={() => setEditingBenefit(null)}
          title={`Update R&R Entitlement: ${editingBenefit.headOfFamily}`}
          subtitle={`Family ID: ${editingBenefit.familyId} | Village: ${editingBenefit.village}`}
          maxWidth="2xl"
          actions={
            <>
              <button
                onClick={() => setEditingBenefit(null)}
                className="px-3 py-1.5 border border-gov-gray-300 rounded bg-white text-gov-gray-700 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSave}
                className="px-4 py-1.5 bg-gov-navy text-white text-xs font-semibold rounded hover:bg-gov-navy-hover"
              >
                Save R&R Record
              </button>
            </>
          }
        >
          <form onSubmit={handleUpdateSave} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gov-gray-700 mb-1">
                  Housing Status
                </label>
                <select
                  value={editingBenefit.housingStatus}
                  onChange={(e) => setEditingBenefit({ ...editingBenefit, housingStatus: e.target.value as RRBenefit['housingStatus'] })}
                  className="w-full p-2 border border-gov-gray-300 rounded text-xs"
                >
                  <option value="Allotted">Allotted (Plot / Constructed House)</option>
                  <option value="Sanctioned">Sanctioned (Under Construction)</option>
                  <option value="Disbursed">Disbursed (Cash Grant Option)</option>
                  <option value="Pending">Pending Land Allocation</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gov-gray-700 mb-1">
                  Relocation Status
                </label>
                <select
                  value={editingBenefit.relocationStatus}
                  onChange={(e) => setEditingBenefit({ ...editingBenefit, relocationStatus: e.target.value as RRBenefit['relocationStatus'] })}
                  className="w-full p-2 border border-gov-gray-300 rounded text-xs"
                >
                  <option value="Relocation Completed">Relocation Completed</option>
                  <option value="In Progress">In Progress (Moving into Colony)</option>
                  <option value="Colony Construction Underway">Colony Construction Underway</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gov-gray-700 mb-1">
                  Resettlement Colony Name
                </label>
                <input
                  type="text"
                  value={editingBenefit.colonyName || ''}
                  onChange={(e) => setEditingBenefit({ ...editingBenefit, colonyName: e.target.value })}
                  placeholder="e.g. NH-65 Uruli Rehabilitation Colony"
                  className="w-full p-2 border border-gov-gray-300 rounded text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-gov-gray-700 mb-1">
                  Allotted Plot Number
                </label>
                <input
                  type="text"
                  value={editingBenefit.plotNumber || ''}
                  onChange={(e) => setEditingBenefit({ ...editingBenefit, plotNumber: e.target.value })}
                  placeholder="e.g. Plot B-14"
                  className="w-full p-2 border border-gov-gray-300 rounded text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-gov-gray-200">
              <input
                type="checkbox"
                id="subsChk"
                checked={editingBenefit.subsistenceGrantPaid}
                onChange={(e) => setEditingBenefit({ ...editingBenefit, subsistenceGrantPaid: e.target.checked })}
                className="rounded border-gov-gray-300 text-gov-navy focus:ring-gov-navy"
              />
              <label htmlFor="subsChk" className="text-xs font-semibold text-gov-gray-900">
                ₹50,000 One-Time Subsistence Allowance Disbursed
              </label>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
