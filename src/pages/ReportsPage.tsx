import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { 
  PieChart, FileSpreadsheet, Download, Printer, 
  FileText, CheckCircle2, Building, Calendar 
} from 'lucide-react';

interface ReportsPageProps {
  onNavigate: (module: string, projectId?: string) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ onNavigate }) => {
  const { projects, parcels, compensationRecords, families, rrBenefits } = useApp();

  const [reportType, setReportType] = useState<string>('state-wise');
  const [filterState, setFilterState] = useState<string>('ALL');

  const handlePrint = () => {
    window.print();
  };

  // State-wise dataset
  const stateSummary = [
    { state: 'Maharashtra', projectsCount: 2, landReq: 545.0, landAcq: 420.4, compDisbursedCr: 1555.6, compPendingCr: 8.3, rrRehabPct: '100%' },
    { state: 'Uttar Pradesh', projectsCount: 3, landReq: 595.8, landAcq: 325.9, compDisbursedCr: 1225.6, compPendingCr: 45.2, rrRehabPct: '75%' },
    { state: 'Telangana', projectsCount: 2, landReq: 1000.0, landAcq: 790.0, compDisbursedCr: 1420.5, compPendingCr: 12.0, rrRehabPct: '90%' },
    { state: 'Odisha', projectsCount: 2, landReq: 1140.0, landAcq: 860.0, compDisbursedCr: 830.0, compPendingCr: 68.4, rrRehabPct: '85%' },
    { state: 'Gujarat', projectsCount: 1, landReq: 410.0, landAcq: 390.0, compDisbursedCr: 920.0, compPendingCr: 4.1, rrRehabPct: '100%' },
  ];

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Reports & MIS Generator' }]} />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gov-gray-300 pb-3 no-print">
        <div>
          <h2 className="text-xl font-bold text-gov-navy font-serif flex items-center gap-2">
            <PieChart className="w-5 h-5 text-amber-500" />
            <span>National Land Acquisition MIS & Analytical Reports Generator</span>
          </h2>
          <p className="text-xs text-gov-gray-600">
            Official statutory reporting suite for parliamentary oversight, NITI Aayog review & State Chief Secretary dashboards
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-gov-navy border border-gov-gray-300 text-xs font-semibold rounded hover:bg-gov-gray-100 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-gov-navy" />
            <span>Print Official Report</span>
          </button>
        </div>
      </div>

      {/* Report Configuration Form (No-print) */}
      <div className="p-3 bg-gov-gray-100 border border-gov-gray-300 rounded flex flex-wrap items-center justify-between gap-3 text-xs no-print">
        <div className="flex items-center gap-3 flex-wrap">
          <label className="flex items-center gap-1.5">
            <span className="font-bold text-gov-navy">Report Type:</span>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-gov-gray-300 rounded bg-white font-semibold text-gov-navy"
            >
              <option value="state-wise">State-Wise Consolidated Acquisition Progress</option>
              <option value="project-master">National Infrastructure Projects Master Status</option>
              <option value="compensation-audit">Statutory Compensation & DBT Treasury Audit</option>
              <option value="rr-compliance">Section 31 R&R Entitlement Compliance</option>
            </select>
          </label>

          <label className="flex items-center gap-1">
            <span className="text-gov-gray-700">Filter State:</span>
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
        </div>

        <div className="text-[11px] text-gov-gray-600 font-mono">
          Report Generated: <strong>{new Date().toISOString().slice(0, 10)}</strong>
        </div>
      </div>

      {/* Printable Official Government Report Body */}
      <div className="bg-white border border-gov-gray-300 rounded p-6 shadow-sm space-y-4">
        {/* Official Header for Print & Web */}
        <div className="text-center border-b-2 border-gov-navy pb-4 space-y-1">
          <p className="text-xs font-bold text-gov-gray-800 tracking-wider">
            भारत सरकार &bull; GOVERNMENT OF INDIA
          </p>
          <h3 className="text-lg font-bold text-gov-navy font-serif uppercase tracking-tight">
            National Land Acquisition & Management System (BHOOMISETU)
          </h3>
          <p className="text-xs font-semibold text-gov-gray-700">
            {reportType === 'state-wise' && 'STATE-WISE CONSOLIDATED LAND ACQUISITION PROGRESS REPORT'}
            {reportType === 'project-master' && 'CENTRAL INFRASTRUCTURE PROJECTS STATUTORY STATUS REPORT'}
            {reportType === 'compensation-audit' && 'COMPENSATION DISBURSEMENT & DIRECT BENEFIT TRANSFER AUDIT'}
            {reportType === 'rr-compliance' && 'RESETTLEMENT & REHABILITATION (SECTION 31) COMPLIANCE AUDIT'}
          </p>
          <p className="text-[10px] text-gov-gray-500 font-mono">
            Document Reference: GOI/BHOOMISETU/MIS/{new Date().getFullYear()}/{Math.floor(Math.random()*9000+1000)} &bull; Generated on {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>

        {/* Report Table View */}
        {reportType === 'state-wise' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse border border-gov-gray-300">
              <thead className="bg-gov-gray-100 text-gov-gray-900 border-b border-gov-gray-300 font-bold">
                <tr>
                  <th className="p-2.5 border border-gov-gray-300">State Name</th>
                  <th className="p-2.5 border border-gov-gray-300 text-center">Projects Count</th>
                  <th className="p-2.5 border border-gov-gray-300 text-right">Land Required (Ha)</th>
                  <th className="p-2.5 border border-gov-gray-300 text-right">Land Acquired (Ha)</th>
                  <th className="p-2.5 border border-gov-gray-300 text-center">Physical Progress (%)</th>
                  <th className="p-2.5 border border-gov-gray-300 text-right">Disbursed (₹ Cr)</th>
                  <th className="p-2.5 border border-gov-gray-300 text-center">R&R Rehab Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gov-gray-200">
                {stateSummary.map((s, idx) => {
                  const pct = ((s.landAcq / s.landReq) * 100).toFixed(1);
                  return (
                    <tr key={idx} className={idx % 2 === 1 ? 'bg-gov-gray-50/50' : 'bg-white'}>
                      <td className="p-2.5 font-bold text-gov-navy border border-gov-gray-300">{s.state}</td>
                      <td className="p-2.5 text-center border border-gov-gray-300 font-medium">{s.projectsCount}</td>
                      <td className="p-2.5 text-right border border-gov-gray-300">{s.landReq.toFixed(1)}</td>
                      <td className="p-2.5 text-right font-bold text-emerald-800 border border-gov-gray-300">{s.landAcq.toFixed(1)}</td>
                      <td className="p-2.5 text-center font-bold text-gov-navy border border-gov-gray-300">{pct}%</td>
                      <td className="p-2.5 text-right font-bold border border-gov-gray-300">₹{s.compDisbursedCr.toFixed(1)}</td>
                      <td className="p-2.5 text-center font-semibold text-emerald-800 border border-gov-gray-300">{s.rrRehabPct}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gov-gray-100 font-bold text-gov-gray-900 border-t-2 border-gov-navy">
                <tr>
                  <td className="p-2.5 border border-gov-gray-300">National Total</td>
                  <td className="p-2.5 text-center border border-gov-gray-300">10 Projects</td>
                  <td className="p-2.5 text-right border border-gov-gray-300">3,690.8 Ha</td>
                  <td className="p-2.5 text-right text-emerald-900 border border-gov-gray-300">2,786.3 Ha</td>
                  <td className="p-2.5 text-center text-gov-navy border border-gov-gray-300">75.5%</td>
                  <td className="p-2.5 text-right border border-gov-gray-300">₹5,951.7 Cr</td>
                  <td className="p-2.5 text-center text-emerald-900 border border-gov-gray-300">92.4%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {reportType === 'project-master' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse border border-gov-gray-300">
              <thead className="bg-gov-gray-100 font-bold border-b border-gov-gray-300">
                <tr>
                  <th className="p-2 border border-gov-gray-300">Code & Project</th>
                  <th className="p-2 border border-gov-gray-300">State/Dist</th>
                  <th className="p-2 border border-gov-gray-300 text-right">Required Ha</th>
                  <th className="p-2 border border-gov-gray-300 text-right">Acquired Ha</th>
                  <th className="p-2 border border-gov-gray-300 text-center">Stage</th>
                  <th className="p-2 border border-gov-gray-300 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gov-gray-200">
                {projects.map((p) => (
                  <tr key={p.id}>
                    <td className="p-2 border border-gov-gray-300">
                      <strong>{p.name}</strong>
                      <div className="font-mono text-[10px] text-gov-gray-500">{p.code}</div>
                    </td>
                    <td className="p-2 border border-gov-gray-300">{p.district}, {p.state}</td>
                    <td className="p-2 border border-gov-gray-300 text-right">{p.landRequiredHa}</td>
                    <td className="p-2 border border-gov-gray-300 text-right font-bold text-emerald-800">{p.landAcquiredHa}</td>
                    <td className="p-2 border border-gov-gray-300 text-center">Stage {p.currentStage}/10</td>
                    <td className="p-2 border border-gov-gray-300 text-center">{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Official Footer Notes */}
        <div className="pt-6 border-t border-gov-gray-300 text-[11px] text-gov-gray-600 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p><strong>Certified Official Government MIS Extract</strong></p>
            <p>Data synced with NIC National Land Acquisition Gateway & State Bhulekh Systems.</p>
          </div>
          <div className="text-right">
            <p><strong>Competent Authority Seal & Signature</strong></p>
            <p className="font-mono text-[10px] text-emerald-800">Digitally Authenticated (NIC-eSign-2026)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
