import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Project } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { DataTable, Column } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { 
  FolderKanban, Plus, ExternalLink, MapPin, 
  Calendar, Building2, CheckCircle2, TrendingUp 
} from 'lucide-react';

interface ProjectsPageProps {
  onNavigate: (module: string, projectId?: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onNavigate }) => {
  const { projects, createProject, setSelectedProjectId } = useApp();

  const [filterState, setFilterState] = useState<string>('ALL');
  const [filterSector, setFilterSector] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sector: 'Highways' as Project['sector'],
    state: 'Maharashtra',
    district: 'Pune',
    acquiringAuthority: 'National Highways Authority of India (NHAI)',
    landRequiredHa: 250,
    estimatedCostCr: 1500,
    startDate: '2024-09-01',
    targetDate: '2027-03-31',
    description: '',
    nodalOfficer: 'Shri A. K. Sharma (Special Land Acquisition Officer)',
  });

  const filteredProjects = projects.filter((p) => {
    if (filterState !== 'ALL' && p.state !== filterState) return false;
    if (filterSector !== 'ALL' && p.sector !== filterSector) return false;
    if (filterStatus !== 'ALL' && p.status !== filterStatus) return false;
    return true;
  });

  const columns: Column<Project>[] = [
    {
      key: 'code',
      header: 'Project Code',
      sortable: true,
      render: (p) => (
        <div>
          <span className="font-mono font-bold text-gov-navy text-xs">{p.code}</span>
          <div className="text-[10px] text-gov-gray-500">{p.id}</div>
        </div>
      ),
      width: '130px',
    },
    {
      key: 'name',
      header: 'Project Name & Alignment',
      sortable: true,
      render: (p) => (
        <div>
          <div className="font-bold text-gov-gray-900 leading-tight">{p.name}</div>
          <div className="text-[10px] text-gov-gray-500 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-gov-gray-400" />
            <span>{p.district}, {p.state}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'sector',
      header: 'Sector',
      sortable: true,
      render: (p) => (
        <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-800 border border-slate-200">
          {p.sector}
        </span>
      ),
      width: '130px',
    },
    {
      key: 'acquiringAuthority',
      header: 'Acquiring Authority',
      sortable: true,
      render: (p) => <span className="text-gov-gray-700">{p.acquiringAuthority}</span>,
    },
    {
      key: 'landRequiredHa',
      header: 'Target Area',
      sortable: true,
      align: 'right',
      render: (p) => <span className="font-medium">{p.landRequiredHa} Ha</span>,
      width: '100px',
    },
    {
      key: 'landAcquiredHa',
      header: 'Acquired Area',
      sortable: true,
      align: 'right',
      render: (p) => {
        const pct = ((p.landAcquiredHa / p.landRequiredHa) * 100).toFixed(0);
        return (
          <div>
            <span className="font-bold text-emerald-800">{p.landAcquiredHa} Ha</span>
            <div className="text-[10px] text-gov-gray-500 font-medium">({pct}%)</div>
          </div>
        );
      },
      width: '110px',
    },
    {
      key: 'currentStage',
      header: 'Statutory Stage',
      sortable: true,
      align: 'center',
      render: (p) => (
        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-semibold text-[11px]">
          Stage {p.currentStage}/10
        </span>
      ),
      width: '110px',
    },
    {
      key: 'status',
      header: 'Timeline Status',
      sortable: true,
      align: 'center',
      render: (p) => <StatusBadge status={p.status} size="sm" />,
      width: '120px',
    },
    {
      key: 'targetDate',
      header: 'Target Date',
      sortable: true,
      render: (p) => <span className="font-mono text-[11px] text-gov-gray-700">{p.targetDate}</span>,
      width: '100px',
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'center',
      render: (p) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedProjectId(p.id);
            onNavigate('project-details', p.id);
          }}
          className="px-2.5 py-1 bg-gov-navy text-white text-xs font-semibold rounded hover:bg-gov-navy-hover transition-colors"
        >
          Details
        </button>
      ),
      width: '90px',
    },
  ];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    createProject({
      name: formData.name,
      sector: formData.sector,
      state: formData.state,
      district: formData.district,
      acquiringAuthority: formData.acquiringAuthority,
      landRequiredHa: Number(formData.landRequiredHa),
      estimatedCostCr: Number(formData.estimatedCostCr),
      startDate: formData.startDate,
      targetDate: formData.targetDate,
      status: 'On Track',
      description: formData.description,
      nodalOfficer: formData.nodalOfficer,
    });

    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Infrastructure Projects Registry' }]} />

      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gov-gray-300 pb-3">
        <div>
          <h2 className="text-xl font-bold text-gov-navy font-serif">
            Central Infrastructure Projects Registry
          </h2>
          <p className="text-xs text-gov-gray-600">
            Master repository of all national infrastructure acquisitions under RFCTLARR Act, 2013
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gov-navy text-white text-xs font-semibold rounded hover:bg-gov-navy-hover transition-colors shadow-2xs"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Register New Project Proposal</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3 bg-gov-gray-100 border border-gov-gray-300 rounded flex flex-wrap items-center gap-3 text-xs">
        <span className="font-bold text-gov-navy uppercase tracking-wider">Filters:</span>

        <label className="flex items-center gap-1">
          <span className="text-gov-gray-700">State:</span>
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="px-2 py-1 text-xs border border-gov-gray-300 rounded bg-white"
          >
            <option value="ALL">All States</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Telangana">Telangana</option>
            <option value="Odisha">Odisha</option>
            <option value="Gujarat">Gujarat</option>
          </select>
        </label>

        <label className="flex items-center gap-1">
          <span className="text-gov-gray-700">Sector:</span>
          <select
            value={filterSector}
            onChange={(e) => setFilterSector(e.target.value)}
            className="px-2 py-1 text-xs border border-gov-gray-300 rounded bg-white"
          >
            <option value="ALL">All Sectors</option>
            <option value="Highways">Highways</option>
            <option value="Railways">Railways</option>
            <option value="Renewable Energy">Renewable Energy</option>
            <option value="Industrial Corridors">Industrial Corridors</option>
            <option value="Urban Transit">Urban Transit</option>
          </select>
        </label>

        <label className="flex items-center gap-1">
          <span className="text-gov-gray-700">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2 py-1 text-xs border border-gov-gray-300 rounded bg-white"
          >
            <option value="ALL">All Timeline States</option>
            <option value="On Track">On Track</option>
            <option value="At Risk">At Risk</option>
            <option value="Delayed">Delayed</option>
            <option value="Completed">Completed</option>
          </select>
        </label>
      </div>

      {/* Main Data Table */}
      <DataTable
        columns={columns}
        data={filteredProjects}
        searchPlaceholder="Search project by name, code, district, or authority..."
        title={`All Registered Projects (${filteredProjects.length})`}
        subtitle="Click any row to open the complete 360-degree project workspace"
        onRowClick={(p) => {
          setSelectedProjectId(p.id);
          onNavigate('project-details', p.id);
        }}
        exportFileName="bhoomisetu_projects_master"
      />

      {/* Create Project Proposal Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Register New Land Acquisition Project Proposal"
        subtitle="Initiate statutory Stage 1 (Proposal & SIA) under RFCTLARR Act"
        maxWidth="3xl"
        actions={
          <>
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="px-3 py-1.5 border border-gov-gray-300 rounded bg-white text-gov-gray-700 text-xs hover:bg-gov-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateSubmit}
              className="px-4 py-1.5 bg-gov-navy text-white text-xs font-semibold rounded hover:bg-gov-navy-hover"
            >
              Submit Project Proposal
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Project Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. NH-48 8-Lane Expressway Expansion"
                className="w-full p-2 border border-gov-gray-300 rounded text-xs focus:ring-1 focus:ring-gov-navy"
              />
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Sector / Infrastructure Class <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value as Project['sector'] })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs"
              >
                <option value="Highways">Highways</option>
                <option value="Railways">Railways</option>
                <option value="Renewable Energy">Renewable Energy</option>
                <option value="Industrial Corridors">Industrial Corridors</option>
                <option value="Urban Transit">Urban Transit</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                State <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs"
              >
                <option value="Maharashtra">Maharashtra</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Telangana">Telangana</option>
                <option value="Odisha">Odisha</option>
                <option value="Gujarat">Gujarat</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                District / Taluka <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                placeholder="e.g. Pune"
                className="w-full p-2 border border-gov-gray-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Acquiring Authority / Body <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.acquiringAuthority}
                onChange={(e) => setFormData({ ...formData, acquiringAuthority: e.target.value })}
                placeholder="e.g. National Highways Authority of India (NHAI)"
                className="w-full p-2 border border-gov-gray-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Target Land Area (Hectares) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.landRequiredHa}
                onChange={(e) => setFormData({ ...formData, landRequiredHa: Number(e.target.value) })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Estimated Project Cost (₹ Crores)
              </label>
              <input
                type="number"
                step="1"
                value={formData.estimatedCostCr}
                onChange={(e) => setFormData({ ...formData, estimatedCostCr: Number(e.target.value) })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Statutory Target Completion Date
              </label>
              <input
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gov-gray-700 mb-1">
              Public Purpose & Project Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="State the public purpose, corridors connected, and economic significance..."
              className="w-full p-2 border border-gov-gray-300 rounded text-xs"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
