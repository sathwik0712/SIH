import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatutoryNotification } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { DataTable, Column } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { 
  ScrollText, Plus, FileText, Download, 
  ExternalLink, Calendar, Shield 
} from 'lucide-react';

interface NotificationsPageProps {
  onNavigate: (module: string, projectId?: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigate }) => {
  const { notifications, projects, addNotification } = useApp();

  const [filterProject, setFilterProject] = useState<string>('ALL');
  const [filterSection, setFilterSection] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedNotifForPdf, setSelectedNotifForPdf] = useState<StatutoryNotification | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    projectId: projects[0]?.id || 'PRJ-101',
    sectionType: 'Section 11(1) - SIA' as StatutoryNotification['sectionType'],
    gazetteNumber: `CG-MH-E-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*900000+100000)}`,
    publicationDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 60*24*60*60*1000).toISOString().split('T')[0],
    issuingAuthority: 'Competent Authority for Land Acquisition (CALA)',
    parcelsAffectedCount: 15,
    summary: 'Preliminary statutory notification declaring intention to acquire specified survey parcels for public infrastructure expansion.',
  });

  const filteredNotifs = notifications.filter((n) => {
    if (filterProject !== 'ALL' && n.projectId !== filterProject) return false;
    if (filterSection !== 'ALL' && n.sectionType !== filterSection) return false;
    return true;
  });

  const columns: Column<StatutoryNotification>[] = [
    {
      key: 'gazetteNumber',
      header: 'Gazette Reference No.',
      sortable: true,
      render: (n) => (
        <div>
          <span className="font-mono font-bold text-gov-navy text-xs">{n.gazetteNumber}</span>
          <div className="text-[10px] text-gov-gray-500 font-mono">{n.id}</div>
        </div>
      ),
      width: '180px',
    },
    {
      key: 'sectionType',
      header: 'Statutory Section',
      sortable: true,
      render: (n) => (
        <span className="font-bold text-gov-gray-900 text-xs">
          {n.sectionType}
        </span>
      ),
      width: '180px',
    },
    {
      key: 'projectId',
      header: 'Project Code',
      sortable: true,
      render: (n) => {
        const p = projects.find(proj => proj.id === n.projectId);
        return (
          <div>
            <div className="font-semibold text-gov-navy">{p?.code || n.projectId}</div>
            <div className="text-[10px] text-gov-gray-500 truncate max-w-xs">{p?.name}</div>
          </div>
        );
      },
    },
    {
      key: 'publicationDate',
      header: 'Publication Date',
      sortable: true,
      render: (n) => <span className="font-mono text-xs text-gov-gray-700">{n.publicationDate}</span>,
      width: '120px',
    },
    {
      key: 'expiryDate',
      header: 'Objection Window',
      sortable: true,
      render: (n) => (
        <span className="font-mono text-xs text-amber-900 font-medium">
          Upto {n.expiryDate}
        </span>
      ),
      width: '130px',
    },
    {
      key: 'parcelsAffectedCount',
      header: 'Parcels',
      sortable: true,
      align: 'center',
      render: (n) => <span className="font-semibold text-gov-gray-900">{n.parcelsAffectedCount}</span>,
      width: '80px',
    },
    {
      key: 'status',
      header: 'Gazette Status',
      sortable: true,
      align: 'center',
      render: (n) => <StatusBadge status={n.status} size="sm" />,
      width: '130px',
    },
    {
      key: 'actions',
      header: 'Gazette Copy',
      align: 'center',
      render: (n) => (
        <button
          onClick={() => setSelectedNotifForPdf(n)}
          className="px-2 py-1 bg-gov-navy text-white text-[11px] rounded font-medium hover:bg-gov-navy-hover flex items-center gap-1 mx-auto"
        >
          <FileText className="w-3 h-3 text-amber-400" />
          <span>View Order</span>
        </button>
      ),
      width: '110px',
    },
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNotification({
      projectId: formData.projectId,
      sectionType: formData.sectionType,
      gazetteNumber: formData.gazetteNumber,
      publicationDate: formData.publicationDate,
      expiryDate: formData.expiryDate,
      status: 'Published',
      issuingAuthority: formData.issuingAuthority,
      parcelsAffectedCount: Number(formData.parcelsAffectedCount),
      gazettePdfUrl: '/documents/gazette_simulated.pdf',
      summary: formData.summary,
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Statutory Notifications' }]} />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gov-gray-300 pb-3">
        <div>
          <h2 className="text-xl font-bold text-gov-navy font-serif flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-amber-500" />
            <span>Official Gazette Statutory Notifications</span>
          </h2>
          <p className="text-xs text-gov-gray-600">
            Mandatory publications under Sections 4(1), 6(1), 9(1), 11(1), and 19(1) of RFCTLARR Act, 2013
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gov-navy text-white text-xs font-semibold rounded hover:bg-gov-navy-hover transition-colors shadow-2xs"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Publish Gazette Notification</span>
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
          <span className="text-gov-gray-700">Statutory Section:</span>
          <select
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
            className="px-2 py-1 text-xs border border-gov-gray-300 rounded bg-white"
          >
            <option value="ALL">All Statutory Sections</option>
            <option value="Section 4(1) - Preliminary">Section 4(1) - Preliminary</option>
            <option value="Section 11(1) - SIA">Section 11(1) - SIA Notification</option>
            <option value="Section 19(1) - Final Declaration">Section 19(1) - Final Declaration</option>
            <option value="Section 9(1) - Notice">Section 9(1) - Notice</option>
          </select>
        </label>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredNotifs}
        searchPlaceholder="Search gazette reference number or project..."
        title={`Statutory Gazette Publications (${filteredNotifs.length})`}
        subtitle="Official legal records published in the Gazette of India / State Official Gazettes"
        exportFileName="bhoomisetu_notifications"
      />

      {/* Publish Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Publish Statutory Notification in Official Gazette"
        subtitle="Generate electronic Gazette Extra-Ordinary notification reference under RFCTLARR Act"
        maxWidth="2xl"
        actions={
          <>
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="px-3 py-1.5 border border-gov-gray-300 rounded bg-white text-gov-gray-700 text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleAddSubmit}
              className="px-4 py-1.5 bg-gov-navy text-white text-xs font-semibold rounded hover:bg-gov-navy-hover"
            >
              Publish to e-Gazette
            </button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit} className="space-y-3">
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

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Statutory Section <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.sectionType}
                onChange={(e) => setFormData({ ...formData, sectionType: e.target.value as StatutoryNotification['sectionType'] })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs"
              >
                <option value="Section 11(1) - SIA">Section 11(1) - Preliminary SIA</option>
                <option value="Section 19(1) - Final Declaration">Section 19(1) - Final Declaration</option>
                <option value="Section 4(1) - Preliminary">Section 4(1) - Preliminary</option>
                <option value="Section 9(1) - Notice">Section 9(1) - Notice</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Gazette Reference No. <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.gazetteNumber}
                onChange={(e) => setFormData({ ...formData, gazetteNumber: e.target.value })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Publication Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.publicationDate}
                onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Objection Hearing Deadline (60 Days)
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs font-bold text-amber-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Number of Affected Parcels
              </label>
              <input
                type="number"
                value={formData.parcelsAffectedCount}
                onChange={(e) => setFormData({ ...formData, parcelsAffectedCount: Number(e.target.value) })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Issuing Competent Authority
              </label>
              <input
                type="text"
                value={formData.issuingAuthority}
                onChange={(e) => setFormData({ ...formData, issuingAuthority: e.target.value })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gov-gray-700 mb-1">
              Gazette Order Public Summary & Boundary Schedule
            </label>
            <textarea
              rows={3}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full p-2 border border-gov-gray-300 rounded text-xs"
            />
          </div>
        </form>
      </Modal>

      {/* View Gazette Order Modal */}
      {selectedNotifForPdf && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedNotifForPdf(null)}
          title={`Official Gazette Notification: ${selectedNotifForPdf.gazetteNumber}`}
          subtitle={`Issued under ${selectedNotifForPdf.sectionType}`}
          maxWidth="2xl"
          actions={
            <button
              onClick={() => setSelectedNotifForPdf(null)}
              className="px-4 py-1.5 bg-gov-navy text-white text-xs font-semibold rounded hover:bg-gov-navy-hover"
            >
              Close Gazette Viewer
            </button>
          }
        >
          <div className="space-y-3 text-xs bg-white p-4 border border-gov-gray-300 rounded">
            <div className="text-center border-b border-gov-gray-300 pb-3 space-y-1">
              <h3 className="font-bold text-gov-navy uppercase tracking-wider font-serif text-sm">
                The Gazette of India — Extraordinary
              </h3>
              <p className="text-[11px] text-gov-gray-600">Part II — Section 3 — Sub-section (ii)</p>
              <p className="font-mono text-xs font-bold text-gov-navy-dark">REF: {selectedNotifForPdf.gazetteNumber}</p>
            </div>

            <div className="space-y-2 text-gov-gray-800 leading-relaxed pt-2">
              <p>
                <strong>MINISTRY OF ROAD TRANSPORT & HIGHWAYS / REVENUE DEPARTMENT</strong>
              </p>
              <p>
                <strong>NOTIFICATION</strong> &mdash; Published on <strong>{selectedNotifForPdf.publicationDate}</strong>
              </p>
              <p className="text-justify">
                {selectedNotifForPdf.summary}
              </p>
              <p className="text-justify">
                Any person interested in any land which has been notified under the schedule hereto annexed may, within sixty days from the date of publication of this notification, object to the acquisition of the land under Section 15 of the Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (Act 30 of 2013).
              </p>
            </div>

            <div className="p-3 bg-gov-gray-50 rounded border border-gov-gray-200 flex justify-between items-center text-[11px]">
              <span>Issuing Authority: <strong>{selectedNotifForPdf.issuingAuthority}</strong></span>
              <span className="text-emerald-700 font-bold">DIGITALLY SIGNED & SEALED</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
