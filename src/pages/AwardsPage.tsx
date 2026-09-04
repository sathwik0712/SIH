import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AwardRecord } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { DataTable, Column } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { 
  Award, Plus, CheckCircle2, Calculator, 
  FileText, ShieldCheck, DollarSign 
} from 'lucide-react';

interface AwardsPageProps {
  onNavigate: (module: string, projectId?: string) => void;
}

export const AwardsPage: React.FC<AwardsPageProps> = ({ onNavigate }) => {
  const { awards, projects, parcels, draftAward, approveAward } = useApp();

  const [filterProject, setFilterProject] = useState<string>('ALL');
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [selectedAwardForApprove, setSelectedAwardForApprove] = useState<AwardRecord | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    projectId: projects[0]?.id || 'PRJ-101',
    parcelId: 'PCL-101-001',
    surveyNumber: '142/1A',
    ownerName: 'Baburao Ramchandra Shinde',
    marketValue: 350.0,
    assetsValuation: 25.0,
    beneficiariesCount: 1,
  });

  const filteredAwards = awards.filter((a) => {
    if (filterProject !== 'ALL' && a.projectId !== filterProject) return false;
    return true;
  });

  // Calculate statutory award with Solatium 100% and 12% additional interest
  const solatium = formData.marketValue; // 100%
  const addlInterest = +(formData.marketValue * 0.12).toFixed(2); // 12% p.a.
  const totalCalculated = +(formData.marketValue + solatium + addlInterest + formData.assetsValuation).toFixed(2);

  const columns: Column<AwardRecord>[] = [
    {
      key: 'awardNumber',
      header: 'Award Ref. Number',
      sortable: true,
      render: (a) => (
        <div>
          <span className="font-mono font-bold text-gov-navy text-xs">{a.awardNumber}</span>
          <div className="text-[10px] text-gov-gray-500 font-mono">{a.id}</div>
        </div>
      ),
      width: '180px',
    },
    {
      key: 'surveyNumber',
      header: 'Survey / Khasra',
      sortable: true,
      render: (a) => <span className="font-bold text-gov-gray-900 text-xs">Survey {a.surveyNumber}</span>,
      width: '120px',
    },
    {
      key: 'ownerName',
      header: 'Primary Awardee',
      sortable: true,
      render: (a) => (
        <div>
          <div className="font-semibold text-gov-gray-900">{a.ownerName}</div>
          <div className="text-[10px] text-gov-gray-500">{a.beneficiariesCount} Registered Beneficiary(ies)</div>
        </div>
      ),
    },
    {
      key: 'marketValue',
      header: 'Base Market Value',
      sortable: true,
      align: 'right',
      render: (a) => <span className="font-medium text-gov-gray-800">₹{a.marketValue} L</span>,
      width: '130px',
    },
    {
      key: 'solatium100Percent',
      header: 'Solatium 100%',
      sortable: true,
      align: 'right',
      render: (a) => <span className="font-medium text-emerald-800">₹{a.solatium100Percent} L</span>,
      width: '120px',
    },
    {
      key: 'totalAwardAmount',
      header: 'Total Statutory Award',
      sortable: true,
      align: 'right',
      render: (a) => (
        <span className="font-bold text-emerald-900 font-serif text-xs">
          ₹{a.totalAwardAmount} Lakhs
        </span>
      ),
      width: '140px',
    },
    {
      key: 'collectorApprovalStatus',
      header: 'Approval Status',
      sortable: true,
      align: 'center',
      render: (a) => <StatusBadge status={a.collectorApprovalStatus} size="sm" />,
      width: '140px',
    },
    {
      key: 'actions',
      header: 'Collector Action',
      align: 'center',
      render: (a) => (
        a.collectorApprovalStatus !== 'Approved by Collector' ? (
          <button
            onClick={() => setSelectedAwardForApprove(a)}
            className="px-2.5 py-1 bg-emerald-800 text-white text-[11px] font-semibold rounded hover:bg-emerald-900 flex items-center gap-1 mx-auto"
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Approve Award</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigate('compensation')}
            className="px-2 py-0.5 bg-gov-navy text-white text-[11px] rounded font-medium hover:bg-gov-navy-hover"
          >
            Disburse &rarr;
          </button>
        )
      ),
      width: '120px',
    },
  ];

  const handleDraftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const awdNo = `CALA/PUNE/NH65/AWD-2024/${Math.floor(Math.random() * 900 + 100)}`;
    
    draftAward({
      projectId: formData.projectId,
      parcelId: formData.parcelId,
      awardNumber: awdNo,
      surveyNumber: formData.surveyNumber,
      ownerName: formData.ownerName,
      dateOfAward: new Date().toISOString().split('T')[0],
      marketValue: Number(formData.marketValue),
      solatium100Percent: solatium,
      additionalInterest12Percent: addlInterest,
      assetsValuation: Number(formData.assetsValuation),
      totalAwardAmount: totalCalculated,
      collectorApprovalStatus: 'Recommended by CALA',
      beneficiariesCount: Number(formData.beneficiariesCount),
    });

    setIsDraftModalOpen(false);
  };

  const handleApproveConfirm = () => {
    if (!selectedAwardForApprove) return;
    approveAward(selectedAwardForApprove.id);
    setSelectedAwardForApprove(null);
  };

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Awards & Valuation' }]} />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gov-gray-300 pb-3">
        <div>
          <h2 className="text-xl font-bold text-gov-navy font-serif flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Statutory Awards & Valuation Determination</span>
          </h2>
          <p className="text-xs text-gov-gray-600">
            Statutory award determination under Section 23/30 with mandatory 100% Solatium and 12% p.a. additional interest
          </p>
        </div>

        <button
          onClick={() => setIsDraftModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gov-navy text-white text-xs font-semibold rounded hover:bg-gov-navy-hover transition-colors shadow-2xs"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Draft Section 23 Award</span>
        </button>
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
            <option value="ALL">All Projects ({projects.length})</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} — {p.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredAwards}
        searchPlaceholder="Search award number, survey number, or owner name..."
        title={`Statutory Awards Declared (${filteredAwards.length})`}
        subtitle="Formal compensation assessments finalized under RFCTLARR Act, 2013"
        exportFileName="bhoomisetu_statutory_awards"
      />

      {/* Draft Award Modal */}
      <Modal
        isOpen={isDraftModalOpen}
        onClose={() => setIsDraftModalOpen(false)}
        title="Draft Statutory Award under Section 23 & 30"
        subtitle="Automatic computation of 100% Solatium and Section 30(3) additional interest"
        maxWidth="2xl"
        actions={
          <>
            <button
              onClick={() => setIsDraftModalOpen(false)}
              className="px-3 py-1.5 border border-gov-gray-300 rounded bg-white text-gov-gray-700 text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleDraftSubmit}
              className="px-4 py-1.5 bg-gov-navy text-white text-xs font-semibold rounded hover:bg-gov-navy-hover"
            >
              Draft & Submit for Collector Approval
            </button>
          </>
        }
      >
        <form onSubmit={handleDraftSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Infrastructure Project <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} — {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Survey Number <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.surveyNumber}
                onChange={(e) => setFormData({ ...formData, surveyNumber: e.target.value })}
                placeholder="e.g. 145/3A"
                className="w-full p-2 border border-gov-gray-300 rounded text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Primary Awardee / Owner Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Number of Beneficiaries
              </label>
              <input
                type="number"
                min="1"
                value={formData.beneficiariesCount}
                onChange={(e) => setFormData({ ...formData, beneficiariesCount: Number(e.target.value) })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Basic Market Value (₹ Lakhs) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.marketValue}
                onChange={(e) => setFormData({ ...formData, marketValue: Number(e.target.value) })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Assets Valuation (Trees / Structures) ₹L
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.assetsValuation}
                onChange={(e) => setFormData({ ...formData, assetsValuation: Number(e.target.value) })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs"
              />
            </div>
          </div>

          {/* Statutory Calculation Summary Card */}
          <div className="p-3 bg-emerald-50 rounded border border-emerald-300 text-xs space-y-1.5">
            <h4 className="font-bold text-emerald-950 uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5" />
              <span>RFCTLARR Statutory Calculation Breakdown:</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 pt-1 text-gov-gray-800">
              <div>Base Market Value: <strong>₹{formData.marketValue} L</strong></div>
              <div>Solatium (100%): <strong>₹{solatium} L</strong></div>
              <div>Addl. Interest (12% p.a.): <strong>₹{addlInterest} L</strong></div>
              <div>Assets (Trees/Wells): <strong>₹{formData.assetsValuation} L</strong></div>
            </div>
            <div className="pt-2 border-t border-emerald-200 flex justify-between items-center text-sm font-bold text-emerald-950">
              <span>Total Statutory Award Amount:</span>
              <span className="text-base font-serif">₹{totalCalculated} Lakhs</span>
            </div>
          </div>
        </form>
      </Modal>

      {/* Collector Approve Modal */}
      {selectedAwardForApprove && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedAwardForApprove(null)}
          title={`Collector Sign-Off: Statutory Award ${selectedAwardForApprove.awardNumber}`}
          subtitle={`Awardee: ${selectedAwardForApprove.ownerName} | Survey No: ${selectedAwardForApprove.surveyNumber}`}
          maxWidth="2xl"
          actions={
            <>
              <button
                onClick={() => setSelectedAwardForApprove(null)}
                className="px-3 py-1.5 border border-gov-gray-300 rounded bg-white text-gov-gray-700 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleApproveConfirm}
                className="px-4 py-1.5 bg-emerald-800 text-white text-xs font-bold rounded hover:bg-emerald-900"
              >
                Affix Digital Seal & Approve Award
              </button>
            </>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-gov-gray-50 rounded border border-gov-gray-200 space-y-2">
              <div className="flex justify-between py-1 border-b border-gov-gray-200">
                <span className="text-gov-gray-600">Base Market Value:</span>
                <span className="font-bold text-gov-gray-900">₹{selectedAwardForApprove.marketValue} Lakhs</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gov-gray-200">
                <span className="text-gov-gray-600">Mandatory 100% Solatium (Sec 30(1)):</span>
                <span className="font-bold text-emerald-800">₹{selectedAwardForApprove.solatium100Percent} Lakhs</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gov-gray-200">
                <span className="text-gov-gray-600">Additional Interest 12% p.a. (Sec 30(3)):</span>
                <span className="font-bold text-emerald-800">₹{selectedAwardForApprove.additionalInterest12Percent} Lakhs</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gov-gray-200">
                <span className="text-gov-gray-600">Assets / Fruit Trees Valuation:</span>
                <span className="font-bold text-gov-gray-900">₹{selectedAwardForApprove.assetsValuation} Lakhs</span>
              </div>
              <div className="flex justify-between py-1 text-sm font-bold text-gov-navy">
                <span>Final Statutory Award Total:</span>
                <span className="font-serif text-base text-emerald-900">₹{selectedAwardForApprove.totalAwardAmount} Lakhs</span>
              </div>
            </div>

            <p className="text-[11px] text-gov-gray-600 leading-relaxed bg-blue-50 p-2.5 rounded border border-blue-200">
              By approving this statutory award, the Competent Authority orders the generation of electronic payment advice (EPA) for Direct Benefit Transfer via PFMS e-Kuber treasury.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};
