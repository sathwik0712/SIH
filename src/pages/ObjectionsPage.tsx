import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Objection } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { DataTable, Column } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { 
  MessageSquareWarning, Plus, CheckCircle2, 
  Calendar, Gavel, FileText, AlertCircle 
} from 'lucide-react';

interface ObjectionsPageProps {
  onNavigate: (module: string, projectId?: string) => void;
}

export const ObjectionsPage: React.FC<ObjectionsPageProps> = ({ onNavigate }) => {
  const { objections, projects, parcels, fileObjection, disposeObjection } = useApp();

  const [filterProject, setFilterProject] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [disposingObjection, setDisposingObjection] = useState<Objection | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    projectId: projects[0]?.id || 'PRJ-101',
    parcelId: 'PCL-101-001',
    surveyNumber: '142/1A',
    applicantName: '',
    applicantContact: '9822000000',
    grounds: 'Inadequate Compensation Rate' as Objection['grounds'],
    description: '',
    hearingDate: new Date(Date.now() + 14*24*60*60*1000).toISOString().split('T')[0],
    hearingOfficer: 'Collector & Competent Authority (CALA)',
  });

  // Decision Form State
  const [decisionChoice, setDecisionChoice] = useState<Objection['decision']>('Rejected - Lawful Public Purpose');
  const [decisionRemarks, setDecisionRemarks] = useState('');

  const filteredObjections = objections.filter((o) => {
    if (filterProject !== 'ALL' && o.projectId !== filterProject) return false;
    if (filterStatus !== 'ALL' && o.status !== filterStatus) return false;
    return true;
  });

  const columns: Column<Objection>[] = [
    {
      key: 'id',
      header: 'Objection ID',
      sortable: true,
      render: (o) => <span className="font-mono font-bold text-gov-navy text-xs">{o.id}</span>,
      width: '120px',
    },
    {
      key: 'surveyNumber',
      header: 'Survey No.',
      sortable: true,
      render: (o) => <span className="font-bold text-gov-gray-900 text-xs">Survey {o.surveyNumber}</span>,
      width: '110px',
    },
    {
      key: 'applicantName',
      header: 'Applicant / Objector',
      sortable: true,
      render: (o) => (
        <div>
          <div className="font-semibold text-gov-gray-900">{o.applicantName}</div>
          <div className="text-[10px] text-gov-gray-500">Contact: {o.applicantContact}</div>
        </div>
      ),
    },
    {
      key: 'grounds',
      header: 'Grounds for Objection',
      sortable: true,
      render: (o) => (
        <div>
          <span className="font-semibold text-amber-950 text-[11px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            {o.grounds}
          </span>
          <div className="text-[10px] text-gov-gray-600 mt-1 line-clamp-1">{o.description}</div>
        </div>
      ),
    },
    {
      key: 'hearingDate',
      header: 'Hearing Date',
      sortable: true,
      render: (o) => (
        <div>
          <div className="font-mono text-xs">{o.hearingDate}</div>
          <div className="text-[10px] text-gov-gray-500">{o.hearingOfficer}</div>
        </div>
      ),
      width: '140px',
    },
    {
      key: 'decision',
      header: 'Collector Order',
      sortable: true,
      render: (o) => (
        <span className="text-[11px] font-medium text-gov-gray-800">
          {o.decision}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Disposal Status',
      sortable: true,
      align: 'center',
      render: (o) => <StatusBadge status={o.status} size="sm" />,
      width: '130px',
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'center',
      render: (o) => (
        o.status !== 'Disposed' ? (
          <button
            onClick={() => {
              setDisposingObjection(o);
              setDecisionRemarks(`Hearing conducted. Collector order passed under Section 15(2) RFCTLARR Act.`);
            }}
            className="px-2 py-1 bg-amber-700 text-white text-[11px] font-semibold rounded hover:bg-amber-800 flex items-center gap-1 mx-auto"
          >
            <Gavel className="w-3 h-3" />
            <span>Pass Order</span>
          </button>
        ) : (
          <span className="text-emerald-700 font-bold text-[11px] flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Disposed</span>
          </span>
        )
      ),
      width: '110px',
    },
  ];

  const handleFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.applicantName.trim()) return;

    fileObjection({
      projectId: formData.projectId,
      parcelId: formData.parcelId,
      surveyNumber: formData.surveyNumber,
      applicantName: formData.applicantName,
      applicantContact: formData.applicantContact,
      dateFiled: new Date().toISOString().split('T')[0],
      grounds: formData.grounds,
      description: formData.description,
      hearingDate: formData.hearingDate,
      hearingOfficer: formData.hearingOfficer,
      decision: 'Pending',
      status: 'Hearing Scheduled',
      orderDocumentUrl: '/documents/order_simulated.pdf',
    });

    setIsFileModalOpen(false);
  };

  const handleDisposeSubmit = () => {
    if (!disposingObjection) return;
    disposeObjection(disposingObjection.id, decisionChoice, decisionRemarks);
    setDisposingObjection(null);
  };

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Section 15 Claims & Objections' }]} />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gov-gray-300 pb-3">
        <div>
          <h2 className="text-xl font-bold text-gov-navy font-serif flex items-center gap-2">
            <MessageSquareWarning className="w-5 h-5 text-amber-500" />
            <span>Section 15 Claims & Objections Management</span>
          </h2>
          <p className="text-xs text-gov-gray-600">
            Statutory hearing registry for public objections, boundary disputes, and compensation revision claims under RFCTLARR Act
          </p>
        </div>

        <button
          onClick={() => setIsFileModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gov-navy text-white text-xs font-semibold rounded hover:bg-gov-navy-hover transition-colors shadow-2xs"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>File Section 15 Objection</span>
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
            <option value="ALL">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} — {p.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-1">
          <span className="text-gov-gray-700">Hearing Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2 py-1 text-xs border border-gov-gray-300 rounded bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="Hearing Scheduled">Hearing Scheduled</option>
            <option value="Disposed">Disposed / Order Passed</option>
          </select>
        </label>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredObjections}
        searchPlaceholder="Search applicant, survey number, grounds, or ID..."
        title={`Statutory Objections Registry (${filteredObjections.length})`}
        subtitle="Appeals heard by the Competent Authority for Land Acquisition (CALA)"
        exportFileName="bhoomisetu_objections"
      />

      {/* File Objection Modal */}
      <Modal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        title="File Public Objection under Section 15"
        subtitle="Record objection within 60 days of Section 11 statutory notification"
        maxWidth="2xl"
        actions={
          <>
            <button
              onClick={() => setIsFileModalOpen(false)}
              className="px-3 py-1.5 border border-gov-gray-300 rounded bg-white text-gov-gray-700 text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleFileSubmit}
              className="px-4 py-1.5 bg-gov-navy text-white text-xs font-semibold rounded hover:bg-gov-navy-hover"
            >
              Register & Schedule Hearing
            </button>
          </>
        }
      >
        <form onSubmit={handleFileSubmit} className="space-y-3">
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
                Affected Survey Number <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.surveyNumber}
                onChange={(e) => setFormData({ ...formData, surveyNumber: e.target.value })}
                placeholder="e.g. 146/1"
                className="w-full p-2 border border-gov-gray-300 rounded text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Applicant / Landowner Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.applicantName}
                onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                placeholder="e.g. Shri Kashinath D. Gaikwad"
                className="w-full p-2 border border-gov-gray-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Applicant Contact Number
              </label>
              <input
                type="text"
                value={formData.applicantContact}
                onChange={(e) => setFormData({ ...formData, applicantContact: e.target.value })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Grounds for Objection <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.grounds}
                onChange={(e) => setFormData({ ...formData, grounds: e.target.value as Objection['grounds'] })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs"
              >
                <option value="Area Measurement Mismatch">Area Measurement Mismatch</option>
                <option value="Inadequate Compensation Rate">Inadequate Compensation Rate</option>
                <option value="Religious / Heritage Structure">Religious / Heritage Structure</option>
                <option value="Multiple Ownership Claim">Multiple Ownership Claim</option>
                <option value="Exclusion of Agricultural Land">Exclusion of Agricultural Land</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Scheduled Hearing Date
              </label>
              <input
                type="date"
                value={formData.hearingDate}
                onChange={(e) => setFormData({ ...formData, hearingDate: e.target.value })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gov-gray-700 mb-1">
              Objection Statement & Particulars of Grievance
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detail the discrepancy in area, rate valuation, or ownership titles..."
              className="w-full p-2 border border-gov-gray-300 rounded text-xs"
            />
          </div>
        </form>
      </Modal>

      {/* Pass Order Modal */}
      {disposingObjection && (
        <Modal
          isOpen={true}
          onClose={() => setDisposingObjection(null)}
          title={`Collector Hearing: Pass Speaking Order on Objection ${disposingObjection.id}`}
          subtitle={`Applicant: ${disposingObjection.applicantName} | Survey No: ${disposingObjection.surveyNumber}`}
          maxWidth="2xl"
          actions={
            <>
              <button
                onClick={() => setDisposingObjection(null)}
                className="px-3 py-1.5 border border-gov-gray-300 rounded bg-white text-gov-gray-700 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDisposeSubmit}
                className="px-4 py-1.5 bg-gov-navy text-white text-xs font-semibold rounded hover:bg-gov-navy-hover"
              >
                Issue Signed Speaking Order
              </button>
            </>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-gov-gray-50 rounded border border-gov-gray-200 space-y-1">
              <p><strong>Grounds of Objection:</strong> {disposingObjection.grounds}</p>
              <p className="text-gov-gray-600 leading-relaxed">{disposingObjection.description}</p>
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Collector / CALA Formal Determination <span className="text-red-600">*</span>
              </label>
              <select
                value={decisionChoice}
                onChange={(e) => setDecisionChoice(e.target.value as Objection['decision'])}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs font-bold"
              >
                <option value="Rejected - Lawful Public Purpose">Rejected &mdash; Acquisition in Overriding Public Purpose</option>
                <option value="Partially Upheld - Area Re-surveyed">Partially Upheld &mdash; Joint Cadastral Re-survey Ordered</option>
                <option value="Rate Revision Recommended">Rate Revision Recommended &mdash; Referred to District Valuation Committee</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Reasoned Order Notes / Directions to Revenue Staff
              </label>
              <textarea
                rows={3}
                value={decisionRemarks}
                onChange={(e) => setDecisionRemarks(e.target.value)}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
