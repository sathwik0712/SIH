import React, { useEffect, useState } from 'react';
import { IndianRupee, Download, Filter, Search, CheckCircle2, Clock, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api/client';

interface PaymentRecord {
  id: string;
  beneficiaryName: string;
  surveyNo: string;
  village: string;
  awardAmount: number;
  solatium: number;
  totalAmount: number;
  pfmsRef: string;
  utrNo: string;
  bankAccount: string;
  bank: string;
  paymentDate: string;
  status: 'DISBURSED' | 'PENDING' | 'DISPUTED' | 'RETURNED' | 'PROCESSING';
}

const MOCK_PAYMENTS: PaymentRecord[] = [
  { id: 'CP001', beneficiaryName: 'Ramesh Patil', surveyNo: '14/2A', village: 'Bhosari', awardAmount: 12.3, solatium: 12.3, totalAmount: 24.6, pfmsRef: 'PFMS/MH/2025/00421', utrNo: 'HDFC3049812345', bankAccount: '****4521', bank: 'HDFC Bank', paymentDate: '12 Apr 2025', status: 'DISBURSED' },
  { id: 'CP002', beneficiaryName: 'Sunita Deshpande', surveyNo: '14/2B', village: 'Bhosari', awardAmount: 8.2, solatium: 8.2, totalAmount: 16.4, pfmsRef: 'PFMS/MH/2025/00422', utrNo: 'SBI9871234567', bankAccount: '****7832', bank: 'SBI', paymentDate: '12 Apr 2025', status: 'DISBURSED' },
  { id: 'CP003', beneficiaryName: 'Govind Shinde', surveyNo: '15/1', village: 'Bhosari', awardAmount: 25.6, solatium: 25.6, totalAmount: 51.2, pfmsRef: 'PFMS/MH/2025/00423', utrNo: '—', bankAccount: '****2201', bank: 'BOI', paymentDate: '—', status: 'DISPUTED' },
  { id: 'CP004', beneficiaryName: 'Lata Kulkarni', surveyNo: '16/3', village: 'Chikhali', awardAmount: 18.45, solatium: 18.45, totalAmount: 36.9, pfmsRef: 'PFMS/MH/2025/00424', utrNo: 'ICICI7612340987', bankAccount: '****9012', bank: 'ICICI Bank', paymentDate: '15 Apr 2025', status: 'DISBURSED' },
  { id: 'CP005', beneficiaryName: 'Vijay More', surveyNo: '16/4', village: 'Chikhali', awardAmount: 6.15, solatium: 6.15, totalAmount: 12.3, pfmsRef: 'PFMS/MH/2025/00425', utrNo: '—', bankAccount: '****3389', bank: 'UCO Bank', paymentDate: '—', status: 'PENDING' },
  { id: 'CP006', beneficiaryName: 'Anita Jadhav', surveyNo: '17/1', village: 'Moshi', awardAmount: 31.75, solatium: 31.75, totalAmount: 63.5, pfmsRef: 'PFMS/MH/2025/00426', utrNo: 'AXIS4512308765', bankAccount: '****6674', bank: 'Axis Bank', paymentDate: '18 Apr 2025', status: 'DISBURSED' },
  { id: 'CP007', beneficiaryName: 'Suresh Kale', surveyNo: '17/2', village: 'Moshi', awardAmount: 14.35, solatium: 14.35, totalAmount: 28.7, pfmsRef: 'PFMS/MH/2025/00427', utrNo: '—', bankAccount: '****1120', bank: 'PNB', paymentDate: '—', status: 'PROCESSING' },
  { id: 'CP008', beneficiaryName: 'Priya Gaikwad', surveyNo: '18/1', village: 'Moshi', awardAmount: 22.55, solatium: 22.55, totalAmount: 45.1, pfmsRef: 'PFMS/MH/2025/00428', utrNo: '—', bankAccount: '****8842', bank: 'Canara Bank', paymentDate: '—', status: 'DISPUTED' },
  { id: 'CP009', beneficiaryName: 'Deepak Nair', surveyNo: '19/1', village: 'Alandi', awardAmount: 19.8, solatium: 19.8, totalAmount: 39.6, pfmsRef: 'PFMS/MH/2025/00429', utrNo: 'KOTAK3312234567', bankAccount: '****5500', bank: 'Kotak Bank', paymentDate: '20 Apr 2025', status: 'DISBURSED' },
  { id: 'CP010', beneficiaryName: 'Meena Desai', surveyNo: '19/2', village: 'Alandi', awardAmount: 11.5, solatium: 11.5, totalAmount: 23.0, pfmsRef: 'PFMS/MH/2025/00430', utrNo: '—', bankAccount: '****9933', bank: 'Union Bank', paymentDate: '—', status: 'RETURNED' },
];

const statusCfg: Record<string, { badge: string; icon: React.ElementType; label: string }> = {
  DISBURSED:  { badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: CheckCircle2, label: 'Disbursed' },
  PENDING:    { badge: 'bg-amber-50 text-amber-800 border-amber-300',      icon: Clock,         label: 'Pending' },
  DISPUTED:   { badge: 'bg-red-50 text-red-800 border-red-200',            icon: AlertTriangle, label: 'Disputed' },
  RETURNED:   { badge: 'bg-red-50 text-red-800 border-red-200',            icon: XCircle,       label: 'Returned' },
  PROCESSING: { badge: 'bg-blue-50 text-blue-800 border-blue-200',         icon: RefreshCw,     label: 'Processing' },
};

export const CompensationPage: React.FC = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [payments, setPayments] = useState<PaymentRecord[]>(MOCK_PAYMENTS);

  useEffect(() => {
    apiFetch<PaymentRecord[]>('/compensation')
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          // Merge API data with mock data for demonstration
          setPayments([...res.data, ...MOCK_PAYMENTS]);
        }
      })
      .catch(err => console.error('Failed to fetch compensation:', err));
  }, []);

  const maskName = (name: string) => {
    if (!name) return name;
    return name.split(' ').map(part => part.charAt(0) + '*'.repeat(part.length - 1)).join(' ');
  };

  const shouldMask = (user?.role as string) === 'PUBLIC' || (user?.role as string) === 'FIELD_OFFICER';

  const filtered = payments.filter(p => {
    const matchSearch = search === '' || p.beneficiaryName.toLowerCase().includes(search.toLowerCase()) || p.surveyNo.includes(search);
    const matchStatus = filterStatus === 'ALL' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalDisbursed = payments.filter(p => p.status === 'DISBURSED').reduce((acc, p) => acc + p.totalAmount, 0);
  const totalPending   = payments.filter(p => p.status !== 'DISBURSED').reduce((acc, p) => acc + p.totalAmount, 0);
  const totalAssessed  = payments.reduce((acc, p) => acc + p.totalAmount, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-700 rounded flex items-center justify-center">
            <IndianRupee className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#0B3559]">Compensation Disbursal — PFMS Direct Benefit Transfer</h1>
            <p className="text-xs text-slate-500">Beneficiary-wise compensation, solatium, and PFMS transaction tracking</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-[#0B3559] text-white rounded hover:bg-[#071E3D] transition-colors">
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Assessed', val: `₹${totalAssessed.toFixed(1)}L`, sub: `${MOCK_PAYMENTS.length} beneficiaries`, color: 'border-l-[#0B3559]' },
          { label: 'Disbursed via PFMS', val: `₹${totalDisbursed.toFixed(1)}L`, sub: `${MOCK_PAYMENTS.filter(p => p.status === 'DISBURSED').length} payments completed`, color: 'border-l-emerald-600' },
          { label: 'Pending / Processing', val: `₹${totalPending.toFixed(1)}L`, sub: `${MOCK_PAYMENTS.filter(p => ['PENDING','PROCESSING'].includes(p.status)).length} pending`, color: 'border-l-amber-500' },
          { label: 'Disputed / Returned', val: `${MOCK_PAYMENTS.filter(p => ['DISPUTED','RETURNED'].includes(p.status)).length}`, sub: 'Parcels under dispute', color: 'border-l-red-500' },
        ].map(k => (
          <div key={k.label} className={`bg-white border border-slate-200 border-l-4 ${k.color} rounded p-3 shadow-sm`}>
            <div className="text-[11px] text-slate-500 font-medium">{k.label}</div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">{k.val}</div>
            <div className="text-[10px] text-slate-400">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded p-3 shadow-sm flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[180px]">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or survey no…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-xs border-none outline-none text-slate-700 placeholder-slate-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="text-xs border border-slate-200 rounded px-2 py-1 bg-white text-slate-700"
          >
            <option value="ALL">All Status</option>
            <option value="DISBURSED">Disbursed</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="DISPUTED">Disputed</option>
            <option value="RETURNED">Returned</option>
          </select>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">{filtered.length} records</span>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100">
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Beneficiary</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Survey No.</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Village</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700 text-right">Award (₹L)</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700 text-right">Solatium (₹L)</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700 text-right">Total (₹L)</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">PFMS Ref</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Bank / Account</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Payment Date</th>
                <th className="px-3.5 py-2.5 font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(p => {
                const cfg = statusCfg[p.status];
                const StatusIcon = cfg.icon;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-3.5 py-2.5 font-semibold text-slate-900">{shouldMask ? maskName(p.beneficiaryName) : p.beneficiaryName}</td>
                    <td className="px-3.5 py-2.5 font-mono text-[#0B3559] font-bold">{p.surveyNo}</td>
                    <td className="px-3.5 py-2.5 text-slate-600">{p.village}</td>
                    <td className="px-3.5 py-2.5 font-mono text-right text-slate-900">{p.awardAmount.toFixed(2)}</td>
                    <td className="px-3.5 py-2.5 font-mono text-right text-slate-900">{p.solatium.toFixed(2)}</td>
                    <td className="px-3.5 py-2.5 font-mono text-right font-bold text-emerald-700">{p.totalAmount.toFixed(2)}</td>
                    <td className="px-3.5 py-2.5 font-mono text-[10px] text-slate-500">{p.pfmsRef}</td>
                    <td className="px-3.5 py-2.5 text-slate-600">{p.bank} {p.bankAccount}</td>
                    <td className="px-3.5 py-2.5 text-slate-600">{p.paymentDate}</td>
                    <td className="px-3.5 py-2.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border font-medium ${cfg.badge}`}>
                        <StatusIcon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
          <span>Showing {filtered.length} of {payments.length} records — PFMS Sync: Today 09:42 IST</span>
          <span className="font-mono font-semibold text-emerald-700">Total Disbursed: ₹{totalDisbursed.toFixed(1)}L of ₹{totalAssessed.toFixed(1)}L Assessed</span>
        </div>
      </div>
    </div>
  );
};

export default CompensationPage;
