import React, { useRef, useState } from 'react';
import { FileText, Upload, Download, Eye, Trash2, CheckCircle2, Clock, AlertCircle, Search, Filter, FolderOpen, X } from 'lucide-react';
import { apiFetch } from '../api/client';

interface Document {
  id: string;
  name: string;
  type: string;
  category: 'LEGAL' | 'SURVEY' | 'FINANCIAL' | 'NOTIFICATION' | 'AWARD' | 'POSSESSION';
  size: string;
  uploadedBy: string;
  uploadedOn: string;
  status: 'VERIFIED' | 'PENDING' | 'REJECTED';
  projectCode: string;
  surveyNo?: string;
}

const MOCK_DOCS: Document[] = [
  { id: 'DOC001', name: 'Section_4_Preliminary_Notification.pdf', type: 'PDF', category: 'NOTIFICATION', size: '2.4 MB', uploadedBy: 'Collector, Pune', uploadedOn: '14 Nov 2024', status: 'VERIFIED', projectCode: 'LA-NH48-PNQ-001' },
  { id: 'DOC002', name: 'SIA_Report_NHAI_NH48_Pune.pdf', type: 'PDF', category: 'LEGAL', size: '8.1 MB', uploadedBy: 'SIA Agency', uploadedOn: '10 Dec 2024', status: 'VERIFIED', projectCode: 'LA-NH48-PNQ-001' },
  { id: 'DOC003', name: 'Joint_Measurement_Survey_Bhosari.xlsx', type: 'XLSX', category: 'SURVEY', size: '1.2 MB', uploadedBy: 'Revenue Inspector', uploadedOn: '28 Jan 2025', status: 'VERIFIED', projectCode: 'LA-NH48-PNQ-001', surveyNo: '14/2A, 14/2B' },
  { id: 'DOC004', name: 'Cadastral_Map_Survey_14_15_16.pdf', type: 'PDF', category: 'SURVEY', size: '14.5 MB', uploadedBy: 'Revenue Inspector', uploadedOn: '28 Jan 2025', status: 'VERIFIED', projectCode: 'LA-NH48-PNQ-001' },
  { id: 'DOC005', name: 'Gazette_Notification_Sec11_MH_2025_0342.pdf', type: 'PDF', category: 'NOTIFICATION', size: '0.8 MB', uploadedBy: 'Collector, Pune', uploadedOn: '15 Mar 2025', status: 'VERIFIED', projectCode: 'LA-NH48-PNQ-001' },
  { id: 'DOC006', name: 'Objection_Register_Sec15_12_Objections.pdf', type: 'PDF', category: 'LEGAL', size: '1.9 MB', uploadedBy: 'Collector, Pune', uploadedOn: '10 May 2025', status: 'PENDING', projectCode: 'LA-NH48-PNQ-001' },
  { id: 'DOC007', name: 'Award_Inquiry_Sec23_Draft.pdf', type: 'PDF', category: 'AWARD', size: '3.2 MB', uploadedBy: 'Collector, Pune', uploadedOn: '—', status: 'PENDING', projectCode: 'LA-NH48-PNQ-001' },
  { id: 'DOC008', name: 'PFMS_Payment_Acknowledgement_CP001_CP002.pdf', type: 'PDF', category: 'FINANCIAL', size: '0.4 MB', uploadedBy: 'Finance Officer', uploadedOn: '12 Apr 2025', status: 'VERIFIED', projectCode: 'LA-NH48-PNQ-001', surveyNo: '14/2A, 14/2B' },
  { id: 'DOC009', name: 'Panchnama_Possession_14_2A.pdf', type: 'PDF', category: 'POSSESSION', size: '0.6 MB', uploadedBy: 'Collector, Pune', uploadedOn: '20 May 2025', status: 'VERIFIED', projectCode: 'LA-NH48-PNQ-001', surveyNo: '14/2A' },
  { id: 'DOC010', name: 'Land_Valuation_Report_CBRE_Bhosari.pdf', type: 'PDF', category: 'FINANCIAL', size: '5.7 MB', uploadedBy: 'Valuation Agency', uploadedOn: '05 Feb 2025', status: 'VERIFIED', projectCode: 'LA-NH48-PNQ-001' },
  { id: 'DOC011', name: 'HC_Court_Petition_Govind_Shinde_HC2025_0432.pdf', type: 'PDF', category: 'LEGAL', size: '1.1 MB', uploadedBy: 'Legal Cell', uploadedOn: '01 Jun 2025', status: 'REJECTED', projectCode: 'LA-NH48-PNQ-001', surveyNo: '15/1' },
  { id: 'DOC012', name: 'RR_Colony_Allotment_Letter_RSS_A.pdf', type: 'PDF', category: 'LEGAL', size: '0.9 MB', uploadedBy: 'R&R Officer', uploadedOn: '15 May 2025', status: 'VERIFIED', projectCode: 'LA-NH48-PNQ-001' },
];

const statusCfg: Record<string, { badge: string; icon: React.ElementType; label: string }> = {
  VERIFIED: { badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: CheckCircle2, label: 'Verified' },
  PENDING:  { badge: 'bg-amber-50 text-amber-800 border-amber-300',      icon: Clock,        label: 'Pending' },
  REJECTED: { badge: 'bg-red-50 text-red-800 border-red-200',            icon: AlertCircle,  label: 'Rejected' },
};

const categoryColors: Record<string, string> = {
  LEGAL:        'bg-purple-100 text-purple-800',
  SURVEY:       'bg-blue-100 text-blue-800',
  FINANCIAL:    'bg-emerald-100 text-emerald-800',
  NOTIFICATION: 'bg-orange-100 text-orange-800',
  AWARD:        'bg-indigo-100 text-indigo-800',
  POSSESSION:   'bg-teal-100 text-teal-800',
};

const typeIcon = (type: string) => {
  if (type === 'PDF') return '📄';
  if (type === 'XLSX') return '📊';
  return '📁';
};

export const DocumentsPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [uploadQueue, setUploadQueue] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);

  const filtered = MOCK_DOCS.filter(d => {
    const matchSearch = search === '' || d.name.toLowerCase().includes(search.toLowerCase()) || (d.surveyNo || '').includes(search);
    const matchCat    = filterCategory === 'ALL' || d.category === filterCategory;
    const matchStatus = filterStatus === 'ALL' || d.status === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      setUploadQueue(q => [...q, f.name]);
      
      const formData = new FormData();
      formData.append('file', f);
      formData.append('projectId', 'LA-NH48-PNQ-001');
      formData.append('documentType', 'GENERAL');
      
      try {
        const res = await apiFetch('/documents/upload', {
          method: 'POST',
          body: formData,
        });
        if (res.success) {
          console.log('Upload successful:', res.data);
        }
      } catch (err) {
        console.error('Failed to upload', f.name, err);
      } finally {
        setUploadQueue(q => q.filter(n => n !== f.name));
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-700 rounded flex items-center justify-center">
            <FolderOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#0B3559]">Documents Repository — LA-NH48-PNQ-001</h1>
            <p className="text-xs text-slate-500">Statutory documents, notifications, awards, and financial records</p>
          </div>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-[#0B3559] text-white rounded hover:bg-[#071E3D] transition-colors"
        >
          <Upload className="w-3.5 h-3.5" /> Upload Document
        </button>
        <input ref={fileInputRef} type="file" className="hidden" multiple accept=".pdf,.xlsx,.csv,.jpg,.png" onChange={e => handleFiles(e.target.files)} />
      </div>

      {/* Upload queue notifications */}
      {uploadQueue.length > 0 && (
        <div className="space-y-1.5">
          {uploadQueue.map(name => (
            <div key={name} className="bg-blue-50 border border-blue-200 rounded p-2.5 flex items-center gap-2 text-xs text-blue-800">
              <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span>Uploading: <strong>{name}</strong>…</span>
            </div>
          ))}
        </div>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Documents', val: MOCK_DOCS.length, sub: 'In repository', color: 'border-l-[#0B3559]' },
          { label: 'Verified', val: MOCK_DOCS.filter(d => d.status === 'VERIFIED').length, sub: 'Approved & filed', color: 'border-l-emerald-600' },
          { label: 'Pending Review', val: MOCK_DOCS.filter(d => d.status === 'PENDING').length, sub: 'Awaiting verification', color: 'border-l-amber-500' },
          { label: 'Rejected', val: MOCK_DOCS.filter(d => d.status === 'REJECTED').length, sub: 'Needs resubmission', color: 'border-l-red-500' },
        ].map(k => (
          <div key={k.label} className={`bg-white border border-slate-200 border-l-4 ${k.color} rounded p-3 shadow-sm`}>
            <div className="text-[11px] text-slate-500 font-medium">{k.label}</div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-0.5">{k.val}</div>
            <div className="text-[10px] text-slate-400">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Drag and drop zone */}
      <div
        className={`border-2 border-dashed rounded p-6 text-center transition-colors cursor-pointer ${dragging ? 'border-[#0B3559] bg-blue-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
        <p className="text-xs font-semibold text-slate-700">Drag & drop files here, or click to browse</p>
        <p className="text-[11px] text-slate-400 mt-1">Supported: PDF, XLSX, CSV, JPG, PNG · Max 50 MB per file</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded p-3 shadow-sm flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[180px]">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input type="text" placeholder="Search documents…" value={search} onChange={e => setSearch(e.target.value)} className="flex-1 text-xs border-none outline-none text-slate-700 placeholder-slate-400" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white text-slate-700">
            <option value="ALL">All Categories</option>
            <option value="LEGAL">Legal</option>
            <option value="SURVEY">Survey</option>
            <option value="FINANCIAL">Financial</option>
            <option value="NOTIFICATION">Notification</option>
            <option value="AWARD">Award</option>
            <option value="POSSESSION">Possession</option>
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white text-slate-700">
            <option value="ALL">All Status</option>
            <option value="VERIFIED">Verified</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">{filtered.length} documents</span>
      </div>

      {/* Document List */}
      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filtered.map(doc => {
            const cfg = statusCfg[doc.status];
            const StatusIcon = cfg.icon;
            return (
              <div key={doc.id} className="p-3.5 flex items-center gap-3 hover:bg-slate-50/70 transition-colors group">
                <span className="text-2xl flex-shrink-0">{typeIcon(doc.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-slate-900 truncate max-w-xs">{doc.name}</span>
                    <span className={`text-[11px] px-1.5 py-0.5 rounded font-medium ${categoryColors[doc.category]}`}>{doc.category}</span>
                    <span className={`inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded border font-medium ${cfg.badge}`}>
                      <StatusIcon className="w-3 h-3" />{cfg.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                    <span>{doc.size}</span>
                    <span>·</span>
                    <span>{doc.uploadedBy}</span>
                    <span>·</span>
                    <span>{doc.uploadedOn}</span>
                    {doc.surveyNo && <><span>·</span><span className="font-mono text-[#0B3559]">Survey: {doc.surveyNo}</span></>}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 hover:bg-slate-200 rounded transition-colors" title="Preview">
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                  </button>
                  <button className="p-1.5 hover:bg-slate-200 rounded transition-colors" title="Download">
                    <Download className="w-3.5 h-3.5 text-slate-600" />
                  </button>
                  <button className="p-1.5 hover:bg-red-50 rounded transition-colors" title="Delete">
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 font-mono">
          {filtered.length} of {MOCK_DOCS.length} documents · Repository: NIC-LA-MH-2025
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;
