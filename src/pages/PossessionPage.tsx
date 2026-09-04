import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PossessionRecord } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { DataTable, Column } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { 
  KeyRound, Plus, CheckCircle2, ShieldAlert, 
  Camera, FileCheck, UserCheck, Shield 
} from 'lucide-react';

interface PossessionPageProps {
  onNavigate: (module: string, projectId?: string) => void;
}

export const PossessionPage: React.FC<PossessionPageProps> = ({ onNavigate }) => {
  const { possessionRecords, projects, parcels, recordPhysicalPossession } = useApp();

  const [filterProject, setFilterProject] = useState<string>('ALL');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [selectedPossessionForPhoto, setSelectedPossessionForPhoto] = useState<PossessionRecord | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    projectId: projects[0]?.id || 'PRJ-101',
    parcelId: 'PCL-101-003',
    surveyNumber: '143/2',
    village: 'Loni Kalbhor',
    areaPossessedHa: 4.80,
    possessionDate: new Date().toISOString().split('T')[0],
    panchnamaNumber: `PANCH/HAVELI/2024/${Math.floor(Math.random()*900+100)}`,
    handoverOfficer: 'Shri Manoj V. Patil',
    handoverOfficerDesignation: 'Circle Revenue Inspector, Haveli',
    acquiringRepresentative: 'Er. Suresh K. Patel (CGM NHAI)',
    panchWitness1: 'Dattatray Vitthal Pawar (Police Patil)',
    panchWitness2: 'Kondiba Shankar Memane (Gram Panchayat)',
    isUrgencyClauseSec40Applied: false,
    policeAssistanceRequired: false,
    remarks: 'Boundary stones installed; encumbrance-free physical handover completed.',
  });

  const filteredPossessions = possessionRecords.filter((p) => {
    if (filterProject !== 'ALL' && p.projectId !== filterProject) return false;
    return true;
  });

  const columns: Column<PossessionRecord>[] = [
    {
      key: 'panchnamaNumber',
      header: 'Panchnama Reference No.',
      sortable: true,
      render: (p) => (
        <div>
          <span className="font-mono font-bold text-gov-navy text-xs">{p.panchnamaNumber}</span>
          <div className="text-[10px] text-gov-gray-500 font-mono">{p.id}</div>
        </div>
      ),
      width: '180px',
    },
    {
      key: 'surveyNumber',
      header: 'Survey No. & Village',
      sortable: true,
      render: (p) => (
        <div>
          <span className="font-bold text-gov-gray-900 text-xs">Survey {p.surveyNumber}</span>
          <div className="text-[10px] text-gov-gray-500">{p.village}</div>
        </div>
      ),
      width: '130px',
    },
    {
      key: 'areaPossessedHa',
      header: 'Area Handed Over',
      sortable: true,
      align: 'right',
      render: (p) => <span className="font-bold text-emerald-800">{p.areaPossessedHa} Ha</span>,
      width: '130px',
    },
    {
      key: 'possessionDate',
      header: 'Handover Date',
      sortable: true,
      render: (p) => <span className="font-mono text-xs">{p.possessionDate}</span>,
      width: '120px',
    },
    {
      key: 'handoverOfficer',
      header: 'Revenue Handover Officer',
      sortable: true,
      render: (p) => (
        <div>
          <div className="font-semibold text-gov-gray-900">{p.handoverOfficer}</div>
          <div className="text-[10px] text-gov-gray-500">{p.handoverOfficerDesignation}</div>
        </div>
      ),
    },
    {
      key: 'panchWitness1',
      header: 'Panch Witnesses',
      sortable: true,
      render: (p) => (
        <div className="text-[11px] text-gov-gray-700">
          <div>1. {p.panchWitness1}</div>
          <div>2. {p.panchWitness2}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Possession Status',
      sortable: true,
      align: 'center',
      render: (p) => <StatusBadge status={p.status} size="sm" />,
      width: '150px',
    },
    {
      key: 'actions',
      header: 'Evidence',
      align: 'center',
      render: (p) => (
        <button
          onClick={() => setSelectedPossessionForPhoto(p)}
          className="px-2 py-1 bg-gov-navy text-white text-[11px] rounded font-medium hover:bg-gov-navy-hover flex items-center gap-1 mx-auto"
        >
          <Camera className="w-3 h-3 text-amber-400" />
          <span>Site Photos</span>
        </button>
      ),
      width: '110px',
    },
  ];

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordPhysicalPossession({
      projectId: formData.projectId,
      parcelId: formData.parcelId,
      surveyNumber: formData.surveyNumber,
      village: formData.village,
      areaPossessedHa: Number(formData.areaPossessedHa),
      possessionDate: formData.possessionDate,
      panchnamaNumber: formData.panchnamaNumber,
      handoverOfficer: formData.handoverOfficer,
      handoverOfficerDesignation: formData.handoverOfficerDesignation,
      acquiringRepresentative: formData.acquiringRepresentative,
      panchWitness1: formData.panchWitness1,
      panchWitness2: formData.panchWitness2,
      isUrgencyClauseSec40Applied: formData.isUrgencyClauseSec40Applied,
      policeAssistanceRequired: formData.policeAssistanceRequired,
      status: 'Possession Completed',
      photographUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=400&q=80',
      panchnamaDocumentUrl: '/documents/panchnama_simulated.pdf',
      remarks: formData.remarks,
    });

    setIsRecordModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Physical Possession & Panchnama' }]} />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gov-gray-300 pb-3">
        <div>
          <h2 className="text-xl font-bold text-gov-navy font-serif flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-500" />
            <span>Physical Possession & Panchnama Handover Records</span>
          </h2>
          <p className="text-xs text-gov-gray-600">
            Statutory physical site possession, Panchnama execution, witness attestations, and encumbrance-free handover under Section 16
          </p>
        </div>

        <button
          onClick={() => setIsRecordModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gov-navy text-white text-xs font-semibold rounded hover:bg-gov-navy-hover transition-colors shadow-2xs"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Execute Physical Handover</span>
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
        data={filteredPossessions}
        searchPlaceholder="Search Panchnama number, survey, officer, or witness..."
        title={`Physical Possession Certificates (${filteredPossessions.length})`}
        subtitle="Formal site handover documents executed under Section 16 of RFCTLARR Act"
        exportFileName="bhoomisetu_possession_records"
      />

      {/* Record Possession Modal */}
      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="Execute Physical Possession & Panchnama Handover (Section 16)"
        subtitle="Record on-site handover to acquiring agency representative in presence of Panch witnesses"
        maxWidth="2xl"
        actions={
          <>
            <button
              onClick={() => setIsRecordModalOpen(false)}
              className="px-3 py-1.5 border border-gov-gray-300 rounded bg-white text-gov-gray-700 text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleRecordSubmit}
              className="px-4 py-1.5 bg-gov-navy text-white text-xs font-semibold rounded hover:bg-gov-navy-hover"
            >
              Execute Handover & Seal Panchnama
            </button>
          </>
        }
      >
        <form onSubmit={handleRecordSubmit} className="space-y-3">
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
                placeholder="e.g. 143/2"
                className="w-full p-2 border border-gov-gray-300 rounded text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Area Possessed (Hectares) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.areaPossessedHa}
                onChange={(e) => setFormData({ ...formData, areaPossessedHa: Number(e.target.value) })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Handover Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.possessionDate}
                onChange={(e) => setFormData({ ...formData, possessionDate: e.target.value })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Panchnama Ref. Number <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.panchnamaNumber}
                onChange={(e) => setFormData({ ...formData, panchnamaNumber: e.target.value })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Revenue Handover Officer Name
              </label>
              <input
                type="text"
                value={formData.handoverOfficer}
                onChange={(e) => setFormData({ ...formData, handoverOfficer: e.target.value })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Panch Witness 1 (Police Patil / Sarpanch) <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.panchWitness1}
                onChange={(e) => setFormData({ ...formData, panchWitness1: e.target.value })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Panch Witness 2 (Gram Panchayat Member) <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.panchWitness2}
                onChange={(e) => setFormData({ ...formData, panchWitness2: e.target.value })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gov-gray-700 mb-1">
              Handover Remarks & Boundary Stone Notes
            </label>
            <input
              type="text"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="w-full p-2 border border-gov-gray-300 rounded text-xs"
            />
          </div>
        </form>
      </Modal>

      {/* Photo View Modal */}
      {selectedPossessionForPhoto && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedPossessionForPhoto(null)}
          title={`Site Handover Evidence: Survey No. ${selectedPossessionForPhoto.surveyNumber}`}
          subtitle={`Panchnama Ref: ${selectedPossessionForPhoto.panchnamaNumber} | Date: ${selectedPossessionForPhoto.possessionDate}`}
          maxWidth="2xl"
          actions={
            <button
              onClick={() => setSelectedPossessionForPhoto(null)}
              className="px-4 py-1.5 bg-gov-navy text-white text-xs font-semibold rounded hover:bg-gov-navy-hover"
            >
              Close
            </button>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="rounded overflow-hidden border border-gov-gray-300 max-h-64">
              <img
                src={selectedPossessionForPhoto.photographUrl}
                alt="Site Panchnama Handover"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3 bg-gov-gray-50 rounded border border-gov-gray-200 text-xs space-y-1">
              <p><strong>Revenue Handover Officer:</strong> {selectedPossessionForPhoto.handoverOfficer} ({selectedPossessionForPhoto.handoverOfficerDesignation})</p>
              <p><strong>Acquiring Agency Rep:</strong> {selectedPossessionForPhoto.acquiringRepresentative}</p>
              <p><strong>Panch Witnesses:</strong> {selectedPossessionForPhoto.panchWitness1} &amp; {selectedPossessionForPhoto.panchWitness2}</p>
              <p><strong>Remarks:</strong> {selectedPossessionForPhoto.remarks}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
