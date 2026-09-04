import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CompensationDisbursement } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { DataTable, Column } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { 
  Banknote, ArrowRight, CheckCircle2, ShieldCheck, 
  Send, Scale, Building, AlertCircle, RefreshCw 
} from 'lucide-react';

interface CompensationPageProps {
  onNavigate: (module: string, projectId?: string) => void;
}

export const CompensationPage: React.FC<CompensationPageProps> = ({ onNavigate }) => {
  const { compensationRecords, projects, disburseCompensation, referToCourtEscrow } = useApp();

  const [filterProject, setFilterProject] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedDisbursement, setSelectedDisbursement] = useState<CompensationDisbursement | null>(null);
  const [utrInput, setUtrInput] = useState('');
  const [isEscrowConfirmOpen, setIsEscrowConfirmOpen] = useState(false);

  const filteredCompensation = compensationRecords.filter((c) => {
    if (filterProject !== 'ALL' && c.projectId !== filterProject) return false;
    if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;
    return true;
  });

  const totalAssessed = compensationRecords.reduce((acc, c) => acc + c.amountAssessed, 0);
  const totalApproved = compensationRecords.reduce((acc, c) => acc + c.amountApproved, 0);
  const totalDisbursed = compensationRecords.reduce((acc, c) => acc + c.amountDisbursed, 0);
  const totalPending = compensationRecords.reduce((acc, c) => acc + c.pendingAmount, 0);

  const columns: Column<CompensationDisbursement>[] = [
    {
      key: 'id',
      header: 'Disbursement ID',
      sortable: true,
      render: (c) => (
        <div>
          <span className="font-mono font-bold text-gov-navy text-xs">{c.id}</span>
          <div className="text-[10px] text-gov-gray-500 font-mono">Survey {c.surveyNumber}</div>
        </div>
      ),
      width: '130px',
    },
    {
      key: 'beneficiaryName',
      header: 'Beneficiary Name & Bank Details',
      sortable: true,
      render: (c) => (
        <div>
          <div className="font-bold text-gov-gray-900 text-xs">{c.beneficiaryName}</div>
          <div className="text-[10px] text-gov-gray-500 flex items-center gap-1 mt-0.5">
            <Building className="w-3 h-3 text-gov-gray-400" />
            <span>{c.bankName}</span>
          </div>
          <div className="text-[10px] text-gov-gray-500 font-mono">
            A/C: {c.accountNumberMasked} | IFSC: {c.ifscCode}
          </div>
        </div>
      ),
    },
    {
      key: 'amountApproved',
      header: 'Approved (₹L)',
      sortable: true,
      align: 'right',
      render: (c) => <span className="font-semibold text-gov-gray-900">₹{c.amountApproved} L</span>,
      width: '110px',
    },
    {
      key: 'amountDisbursed',
      header: 'Disbursed (₹L)',
      sortable: true,
      align: 'right',
      render: (c) => (
        <span className={`font-bold font-serif ${c.amountDisbursed > 0 ? 'text-emerald-800' : 'text-gov-gray-400'}`}>
          ₹{c.amountDisbursed} L
        </span>
      ),
      width: '120px',
    },
    {
      key: 'disbursementMode',
      header: 'Payment Gateway Mode',
      sortable: true,
      render: (c) => (
        <div>
          <span className="text-[11px] font-medium text-gov-gray-800">{c.disbursementMode}</span>
          {c.utrTransactionNumber && (
            <div className="text-[9px] font-mono text-emerald-800 truncate max-w-xs">
              UTR: {c.utrTransactionNumber}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Payment Status',
      sortable: true,
      align: 'center',
      render: (c) => <StatusBadge status={c.status} size="sm" />,
      width: '140px',
    },
    {
      key: 'actions',
      header: 'Statutory Action',
      align: 'center',
      render: (c) => (
        c.status === 'Paid' ? (
          <span className="text-emerald-800 font-bold text-[11px] flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Credited</span>
          </span>
        ) : c.status === 'Disputed Escrow' ? (
          <span className="text-red-800 font-medium text-[11px] flex items-center justify-center gap-1">
            <Scale className="w-3.5 h-3.5 text-red-600" />
            <span>In Court Escrow</span>
          </span>
        ) : (
          <div className="flex items-center justify-center gap-1">
            <button
              onClick={() => {
                setSelectedDisbursement(c);
                setUtrInput(`PFMS${Date.now()}`);
              }}
              className="px-2 py-1 bg-gov-navy text-white text-[11px] font-semibold rounded hover:bg-gov-navy-hover flex items-center gap-1"
            >
              <Send className="w-3 h-3 text-amber-400" />
              <span>Disburse DBT</span>
            </button>
            <button
              onClick={() => {
                setSelectedDisbursement(c);
                setIsEscrowConfirmOpen(true);
              }}
              className="px-1.5 py-1 bg-white text-red-800 border border-red-300 text-[11px] rounded hover:bg-red-50"
              title="Deposit into Court Escrow under Sec 76"
            >
              <Scale className="w-3 h-3" />
            </button>
          </div>
        )
      ),
      width: '140px',
    },
  ];

  const handleDisburseConfirm = () => {
    if (!selectedDisbursement) return;
    disburseCompensation(selectedDisbursement.id, utrInput);
    setSelectedDisbursement(null);
  };

  const handleEscrowConfirm = () => {
    if (!selectedDisbursement) return;
    referToCourtEscrow(selectedDisbursement.id);
    setSelectedDisbursement(null);
    setIsEscrowConfirmOpen(false);
  };

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Compensation & Direct Benefit Transfer (DBT)' }]} />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gov-gray-300 pb-3">
        <div>
          <h2 className="text-xl font-bold text-gov-navy font-serif flex items-center gap-2">
            <Banknote className="w-5 h-5 text-amber-500" />
            <span>Compensation Disbursement & DBT Management Engine</span>
          </h2>
          <p className="text-xs text-gov-gray-600">
            Real-time direct treasury disbursements via Public Financial Management System (PFMS) & Civil Court Escrow under Section 76
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="bg-blue-100 text-blue-950 px-2 py-1 rounded font-medium border border-blue-300 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-800" />
            <span>PFMS / e-Kuber Banking Integration Active</span>
          </span>
        </div>
      </div>

      {/* Summary KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-white rounded border border-gov-gray-300 shadow-2xs">
          <span className="text-[11px] text-gov-gray-600 block">Total Assessed:</span>
          <span className="text-lg font-bold text-gov-navy font-serif">₹{totalAssessed.toFixed(2)} L</span>
          <span className="text-[10px] text-gov-gray-500 block mt-0.5">Statutory Award Value</span>
        </div>
        <div className="p-3 bg-emerald-50 rounded border border-emerald-300 shadow-2xs">
          <span className="text-[11px] text-emerald-800 block font-medium">Disbursed via DBT:</span>
          <span className="text-lg font-bold text-emerald-950 font-serif">₹{totalDisbursed.toFixed(2)} L</span>
          <span className="text-[10px] text-emerald-700 block mt-0.5">Credited to Beneficiary A/Cs</span>
        </div>
        <div className="p-3 bg-amber-50 rounded border border-amber-300 shadow-2xs">
          <span className="text-[11px] text-amber-800 block font-medium">Pending Disbursement:</span>
          <span className="text-lg font-bold text-amber-950 font-serif">₹{totalPending.toFixed(2)} L</span>
          <span className="text-[10px] text-amber-700 block mt-0.5">Awaiting Collector e-Sign</span>
        </div>
        <div className="p-3 bg-red-50 rounded border border-red-300 shadow-2xs">
          <span className="text-[11px] text-red-800 block font-medium">Civil Court Escrow (Sec 76):</span>
          <span className="text-lg font-bold text-red-950 font-serif">₹680.50 L</span>
          <span className="text-[10px] text-red-700 block mt-0.5">Litigated Partition Claims</span>
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
            <option value="ALL">All Projects ({projects.length})</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} — {p.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-1">
          <span className="text-gov-gray-700">Payment Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2 py-1 text-xs border border-gov-gray-300 rounded bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="Paid">Paid / DBT Cleared</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Disputed Escrow">Disputed Escrow (Sec 76)</option>
          </select>
        </label>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredCompensation}
        searchPlaceholder="Search beneficiary name, account, IFSC, or survey..."
        title={`Beneficiary Compensation Disbursements (${filteredCompensation.length})`}
        subtitle="Direct Benefit Transfer mandates generated under RFCTLARR Act statutory provisions"
        exportFileName="bhoomisetu_compensation_dbt"
      />

      {/* Disburse DBT Confirmation Modal */}
      {selectedDisbursement && !isEscrowConfirmOpen && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedDisbursement(null)}
          title={`Execute Direct Benefit Transfer: ₹${selectedDisbursement.amountApproved} Lakhs`}
          subtitle={`Beneficiary: ${selectedDisbursement.beneficiaryName} | Survey No. ${selectedDisbursement.surveyNumber}`}
          maxWidth="2xl"
          actions={
            <>
              <button
                onClick={() => setSelectedDisbursement(null)}
                className="px-3 py-1.5 border border-gov-gray-300 rounded bg-white text-gov-gray-700 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDisburseConfirm}
                className="px-4 py-1.5 bg-emerald-800 text-white text-xs font-bold rounded hover:bg-emerald-900 flex items-center gap-1"
              >
                <Send className="w-3 h-3 text-amber-400" />
                <span>Confirm PFMS Treasury Mandate</span>
              </button>
            </>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-emerald-50 rounded border border-emerald-300 space-y-2">
              <div className="flex justify-between">
                <span className="text-gov-gray-600">Beneficiary:</span>
                <span className="font-bold text-gov-gray-900">{selectedDisbursement.beneficiaryName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gov-gray-600">Bank & Branch:</span>
                <span className="font-medium text-gov-gray-900">{selectedDisbursement.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gov-gray-600">Masked Account Number:</span>
                <span className="font-mono font-bold">{selectedDisbursement.accountNumberMasked}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gov-gray-600">Bank IFSC Code:</span>
                <span className="font-mono">{selectedDisbursement.ifscCode}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-emerald-200 text-sm font-bold text-emerald-950">
                <span>Disbursement Amount:</span>
                <span className="font-serif">₹{selectedDisbursement.amountApproved} Lakhs</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                PFMS UTR / Transaction Reference Number
              </label>
              <input
                type="text"
                value={utrInput}
                onChange={(e) => setUtrInput(e.target.value)}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs font-mono font-bold text-gov-navy"
              />
            </div>

            <p className="text-[11px] text-gov-gray-600 bg-gov-gray-50 p-2.5 rounded border border-gov-gray-200">
              Upon confirming, the transaction will be routed through the RBI e-Kuber treasury settlement engine and the cadastral land parcel status will automatically update to <strong>Compensation Disbursed</strong>.
            </p>
          </div>
        </Modal>
      )}

      {/* Escrow Deposit Modal */}
      {selectedDisbursement && isEscrowConfirmOpen && (
        <Modal
          isOpen={true}
          onClose={() => {
            setIsEscrowConfirmOpen(false);
            setSelectedDisbursement(null);
          }}
          title="Deposit Compensation into Principal Civil Court Escrow"
          subtitle="Statutory reference under Section 76 RFCTLARR Act (Disputed Titles)"
          maxWidth="2xl"
          actions={
            <>
              <button
                onClick={() => {
                  setIsEscrowConfirmOpen(false);
                  setSelectedDisbursement(null);
                }}
                className="px-3 py-1.5 border border-gov-gray-300 rounded bg-white text-gov-gray-700 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleEscrowConfirm}
                className="px-4 py-1.5 bg-red-800 text-white text-xs font-bold rounded hover:bg-red-900"
              >
                Execute Court Escrow Deposit
              </button>
            </>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-red-50 rounded border border-red-200 text-red-950 space-y-1">
              <p className="font-bold flex items-center gap-1 text-red-900">
                <AlertCircle className="w-4 h-4" />
                <span>Section 76 Statutory Reference</span>
              </p>
              <p className="leading-relaxed">
                When the amount of compensation has been settled and there is any dispute as to the apportionment of the same or any part thereof, the Collector may refer such dispute to the Authority.
              </p>
            </div>

            <div className="p-3 bg-gov-gray-50 rounded border border-gov-gray-200 space-y-1">
              <div className="flex justify-between">
                <span>Beneficiary Claim:</span>
                <strong>{selectedDisbursement.beneficiaryName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Survey No:</span>
                <strong>{selectedDisbursement.surveyNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span>Escrow Amount:</span>
                <strong className="text-red-900">₹{selectedDisbursement.amountApproved} Lakhs</strong>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
