import React, { useState } from 'react';
import { FileBarChart, Download, FileText, Calendar, Filter, Search, Table, Map, Clock, RefreshCw } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface ReportConfig {
  id: string;
  title: string;
  description: string;
  category: 'STATUTORY' | 'FINANCIAL' | 'PROGRESS' | 'GIS';
  format: ('PDF' | 'XLSX' | 'CSV')[];
  lastGenerated: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ON_DEMAND';
  icon: React.ElementType;
}

const REPORTS: ReportConfig[] = [
  { id: 'REP-001', title: 'Sec 11(1) Preliminary Notification Status', description: 'List of all parcels awaiting or cleared for Section 11 gazette publication.', category: 'STATUTORY', format: ['PDF', 'XLSX'], lastGenerated: 'Today, 09:30 AM', frequency: 'WEEKLY', icon: FileText },
  { id: 'REP-002', title: 'PFMS Disbursal & Solatium Report', description: 'Detailed financial reconciliation of compensation paid, pending, and disputed.', category: 'FINANCIAL', format: ['XLSX', 'CSV'], lastGenerated: 'Yesterday, 06:00 PM', frequency: 'DAILY', icon: Table },
  { id: 'REP-003', title: 'Physical Possession (Sec 38) Tracker', description: 'Panchnama and fencing status for all acquired parcels.', category: 'PROGRESS', format: ['PDF', 'XLSX'], lastGenerated: '05 Jun 2025', frequency: 'WEEKLY', icon: Clock },
  { id: 'REP-004', title: 'R&R Benefits Entitlement Master', description: 'Third Schedule entitlements mapped against affected families and completion status.', category: 'STATUTORY', format: ['PDF', 'XLSX', 'CSV'], lastGenerated: '01 Jun 2025', frequency: 'MONTHLY', icon: FileBarChart },
  { id: 'REP-005', title: 'Land Parcel GIS coordinates extract', description: 'Raw WGS84 polygon data for all acquired and pending parcels.', category: 'GIS', format: ['CSV'], lastGenerated: 'Today, 10:15 AM', frequency: 'ON_DEMAND', icon: Map },
  { id: 'REP-006', title: 'Section 15 Objections Register', description: 'Summary of all objections received, hearings scheduled, and SLEC recommendations.', category: 'STATUTORY', format: ['PDF'], lastGenerated: '02 Jun 2025', frequency: 'WEEKLY', icon: FileText },
];

const categoryColors: Record<string, string> = {
  STATUTORY: 'bg-indigo-100 text-indigo-800',
  FINANCIAL: 'bg-emerald-100 text-emerald-800',
  PROGRESS:  'bg-blue-100 text-blue-800',
  GIS:       'bg-orange-100 text-orange-800',
};

export const ReportsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('ALL');
  const [generating, setGenerating] = useState<string | null>(null);

  const filtered = REPORTS.filter(r => {
    const matchSearch = search === '' || r.title.toLowerCase().includes(search.toLowerCase());
    const matchCat    = filterCat === 'ALL' || r.category === filterCat;
    return matchSearch && matchCat;
  });

  const handleDownload = (id: string, format: string) => {
    setGenerating(`${id}-${format}`);
    setTimeout(() => {
      const report = REPORTS.find(r => r.id === id);
      if (!report) {
        setGenerating(null);
        return;
      }

      if (format === 'PDF') {
        const doc = new jsPDF();
        doc.text(report.title, 14, 15);
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
        
        autoTable(doc, {
          startY: 28,
          head: [['Reference ID', 'Project', 'Status', 'Date']],
          body: [
            ['REF-1001', 'NH-65 Highway', 'Approved', '2025-05-10'],
            ['REF-1002', 'Eastern Freight', 'Pending', '2025-06-12'],
            ['REF-1003', 'Solar Park II', 'Completed', '2025-08-20'],
          ],
        });
        
        doc.save(`${id}_${report.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
      } else if (format === 'XLSX') {
        const worksheet = XLSX.utils.aoa_to_sheet([
          ['Reference ID', 'Project', 'Status', 'Date'],
          ['REF-1001', 'NH-65 Highway', 'Approved', '2025-05-10'],
          ['REF-1002', 'Eastern Freight', 'Pending', '2025-06-12'],
          ['REF-1003', 'Solar Park II', 'Completed', '2025-08-20'],
        ]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report Data");
        XLSX.writeFile(workbook, `${id}_${report.title.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`);
      } else if (format === 'CSV') {
        const csvContent = "Reference ID,Project,Status,Date\nREF-1001,NH-65 Highway,Approved,2025-05-10\nREF-1002,Eastern Freight,Pending,2025-06-12\nREF-1003,Solar Park II,Completed,2025-08-20";
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${id}_${report.title.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      setGenerating(null);
    }, 1200);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center">
            <FileBarChart className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#0B3559]">MIS & Statutory Reports Generator</h1>
            <p className="text-xs text-slate-500">Generate on-demand or scheduled reports for state and central government portals</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded p-3 shadow-sm flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[250px]">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input type="text" placeholder="Search reports..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 text-xs border-none outline-none text-slate-700 placeholder-slate-400" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white text-slate-700">
            <option value="ALL">All Categories</option>
            <option value="STATUTORY">Statutory</option>
            <option value="FINANCIAL">Financial</option>
            <option value="PROGRESS">Progress Tracking</option>
            <option value="GIS">GIS & Mapping</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(report => {
          const Icon = report.icon;
          return (
            <div key={report.id} className="bg-white border border-slate-200 rounded shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="p-4 flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div className={`w-8 h-8 rounded flex items-center justify-center ${categoryColors[report.category].split(' ')[0]}`}>
                    <Icon className={`w-4 h-4 ${categoryColors[report.category].split(' ')[1]}`} />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${categoryColors[report.category]}`}>
                    {report.category}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{report.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2 mb-3">{report.description}</p>
                
                <div className="space-y-1.5 mt-auto">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Last Run: {report.lastGenerated}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Frequency: {report.frequency}</span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap gap-2">
                {report.format.map(fmt => {
                  const isGen = generating === `${report.id}-${fmt}`;
                  return (
                    <button
                      key={fmt}
                      onClick={() => handleDownload(report.id, fmt)}
                      disabled={isGen}
                      className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold px-2 py-1.5 rounded transition-colors ${
                        isGen ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {isGen ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                      {isGen ? 'Generating...' : `Get ${fmt}`}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReportsPage;
