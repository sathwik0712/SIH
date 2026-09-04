import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DMSDocument } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { DataTable, Column } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { 
  FileText, Plus, Download, Eye, 
  Upload, FileSpreadsheet, FileCode, CheckCircle2 
} from 'lucide-react';

interface DocumentsPageProps {
  onNavigate: (module: string, projectId?: string) => void;
}

export const DocumentsPage: React.FC<DocumentsPageProps> = ({ onNavigate }) => {
  const { documents, projects, uploadDocument } = useApp();

  const [filterProject, setFilterProject] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<DMSDocument | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    projectId: projects[0]?.id || 'PRJ-101',
    title: '',
    category: 'Project Proposal & SIA' as DMSDocument['category'],
    fileType: 'PDF' as DMSDocument['fileType'],
    version: 'v1.0',
    verificationStatus: 'Verified Official' as DMSDocument['verificationStatus'],
  });

  const filteredDocuments = documents.filter((d) => {
    if (filterProject !== 'ALL' && d.projectId !== filterProject) return false;
    if (filterCategory !== 'ALL' && d.category !== filterCategory) return false;
    return true;
  });

  const columns: Column<DMSDocument>[] = [
    {
      key: 'id',
      header: 'Doc ID',
      sortable: true,
      render: (d) => <span className="font-mono font-bold text-gov-navy text-xs">{d.id}</span>,
      width: '100px',
    },
    {
      key: 'title',
      header: 'Official Document Title',
      sortable: true,
      render: (d) => (
        <div>
          <div className="font-bold text-gov-gray-900 text-xs">{d.title}</div>
          <div className="text-[10px] text-gov-gray-500">{d.projectName}</div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Statutory Category',
      sortable: true,
      render: (d) => (
        <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-800 border border-slate-200">
          {d.category}
        </span>
      ),
      width: '170px',
    },
    {
      key: 'version',
      header: 'Version',
      sortable: true,
      render: (d) => <span className="font-mono text-xs font-semibold text-gov-navy">{d.version}</span>,
      width: '80px',
    },
    {
      key: 'fileType',
      header: 'Format & Size',
      sortable: true,
      render: (d) => (
        <div className="text-[11px] text-gov-gray-700">
          <span className="font-mono font-bold">{d.fileType}</span> ({d.fileSizeMb} MB)
        </div>
      ),
      width: '120px',
    },
    {
      key: 'uploadedBy',
      header: 'Uploaded By',
      sortable: true,
      render: (d) => (
        <div>
          <div className="font-medium text-gov-gray-900 text-[11px]">{d.uploadedBy}</div>
          <div className="text-[10px] text-gov-gray-500 font-mono">{d.uploadDate}</div>
        </div>
      ),
    },
    {
      key: 'verificationStatus',
      header: 'Status',
      sortable: true,
      align: 'center',
      render: (d) => <StatusBadge status={d.verificationStatus} size="sm" />,
      width: '130px',
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'center',
      render: (d) => (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => setViewingDoc(d)}
            className="p-1 text-gov-navy hover:bg-blue-50 rounded"
            title="Inspect Document Metadata"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => alert(`Simulated downloading: ${d.title} (${d.version})`)}
            className="p-1 text-emerald-800 hover:bg-emerald-50 rounded"
            title="Download Document"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
      width: '90px',
    },
  ];

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const proj = projects.find(p => p.id === formData.projectId);
    uploadDocument({
      projectId: formData.projectId,
      projectName: proj?.name || 'Infrastructure Project',
      title: formData.title,
      category: formData.category,
      fileType: formData.fileType,
      fileSizeMb: +(Math.random() * 15 + 2).toFixed(1),
      version: formData.version,
      verificationStatus: formData.verificationStatus,
      fileUrl: '/documents/sample_upload.pdf',
    });

    setIsUploadModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Document Repository (DMS)' }]} />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gov-gray-300 pb-3">
        <div>
          <h2 className="text-xl font-bold text-gov-navy font-serif flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            <span>National Land Acquisition Document Repository (DMS)</span>
          </h2>
          <p className="text-xs text-gov-gray-600">
            Secure multi-tier archive for Gazette notifications, valuation sheets, RoR extract 7/12 records, Panchnama, and SIA studies
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gov-navy text-white text-xs font-semibold rounded hover:bg-gov-navy-hover transition-colors shadow-2xs"
        >
          <Upload className="w-4 h-4 text-amber-400" />
          <span>Upload Official Document</span>
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

        <label className="flex items-center gap-1">
          <span className="text-gov-gray-700">Category:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-2 py-1 text-xs border border-gov-gray-300 rounded bg-white"
          >
            <option value="ALL">All Document Categories</option>
            <option value="Project Proposal & SIA">Project Proposal & SIA</option>
            <option value="Statutory Notifications">Statutory Notifications</option>
            <option value="Valuation & Awards">Valuation & Awards</option>
            <option value="Possession Panchnama">Possession Panchnama</option>
          </select>
        </label>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredDocuments}
        searchPlaceholder="Search document title, version, or project..."
        title={`Archived Official Records (${filteredDocuments.length})`}
        subtitle="Digitally signed repository maintaining immutable version history"
        exportFileName="bhoomisetu_documents_index"
      />

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Official Statutory Record to DMS"
        subtitle="Maintain official version control and digital audit trail"
        maxWidth="2xl"
        actions={
          <>
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="px-3 py-1.5 border border-gov-gray-300 rounded bg-white text-gov-gray-700 text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleUploadSubmit}
              className="px-4 py-1.5 bg-gov-navy text-white text-xs font-semibold rounded hover:bg-gov-navy-hover"
            >
              Upload & Seal Document
            </button>
          </>
        }
      >
        <form onSubmit={handleUploadSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Select Project <span className="text-red-600">*</span>
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

            <div className="md:col-span-2">
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Document Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Joint Cadastral Inspection Sheet & DGPS Coordinates"
                className="w-full p-2 border border-gov-gray-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Document Category <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as DMSDocument['category'] })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs"
              >
                <option value="Project Proposal & SIA">Project Proposal & SIA</option>
                <option value="Land Records & Cadastral">Land Records & Cadastral</option>
                <option value="Statutory Notifications">Statutory Notifications</option>
                <option value="Claims & Objections">Claims & Objections</option>
                <option value="Valuation & Awards">Valuation & Awards</option>
                <option value="Compensation & DBT">Compensation & DBT</option>
                <option value="R&R Records">R&R Records</option>
                <option value="Possession Panchnama">Possession Panchnama</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Version Tag
              </label>
              <input
                type="text"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                File Format
              </label>
              <select
                value={formData.fileType}
                onChange={(e) => setFormData({ ...formData, fileType: e.target.value as DMSDocument['fileType'] })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs"
              >
                <option value="PDF">PDF (Portable Document)</option>
                <option value="XLSX">XLSX (Spreadsheet Data)</option>
                <option value="GeoJSON">GeoJSON (Cadastral Spatial Data)</option>
                <option value="DWG">DWG (Engineering Cadastral Drawing)</option>
                <option value="JPG">JPG (Geo-Tagged Photo Evidence)</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>

      {/* Inspect Doc Modal */}
      {viewingDoc && (
        <Modal
          isOpen={true}
          onClose={() => setViewingDoc(null)}
          title={`Document Metadata: ${viewingDoc.title}`}
          subtitle={`DMS Ref: ${viewingDoc.id} | Version: ${viewingDoc.version}`}
          maxWidth="2xl"
          actions={
            <button
              onClick={() => setViewingDoc(null)}
              className="px-4 py-1.5 bg-gov-navy text-white text-xs font-semibold rounded hover:bg-gov-navy-hover"
            >
              Close
            </button>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-gov-gray-50 rounded border border-gov-gray-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-gov-gray-600">Project:</span>
                <span className="font-bold text-gov-navy">{viewingDoc.projectName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gov-gray-600">Category:</span>
                <span className="font-medium text-gov-gray-900">{viewingDoc.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gov-gray-600">File Type & Size:</span>
                <span>{viewingDoc.fileType} ({viewingDoc.fileSizeMb} MB)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gov-gray-600">Uploaded By:</span>
                <span className="font-semibold">{viewingDoc.uploadedBy} ({viewingDoc.uploadedRole})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gov-gray-600">Upload Timestamp:</span>
                <span className="font-mono">{viewingDoc.uploadDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gov-gray-600">Verification Seal:</span>
                <StatusBadge status={viewingDoc.verificationStatus} size="sm" />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
