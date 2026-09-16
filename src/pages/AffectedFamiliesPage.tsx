import React, { useEffect, useState } from 'react';
import { Users, Search, Filter, Download, MapPin, Phone, CheckCircle2, Clock, AlertTriangle, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api/client';

interface Family {
  id: string;
  headName: string;
  relation: string;
  members: number;
  village: string;
  surveyNo: string;
  landType: 'AGRICULTURAL' | 'RESIDENTIAL' | 'COMMERCIAL' | 'TENANTED';
  affectedArea: number;
  aadhaar: string;
  phone: string;
  category: 'SC' | 'ST' | 'OBC' | 'GENERAL';
  status: 'REGISTERED' | 'VERIFIED' | 'COMPENSATED' | 'RESETTLED' | 'PENDING';
  registeredOn: string;
  rrEntitlement: string;
}

const MOCK_FAMILIES: Family[] = [
  { id: 'FAM001', headName: 'Ramesh Patil', relation: 'Self', members: 5, village: 'Bhosari', surveyNo: '14/2A', landType: 'AGRICULTURAL', affectedArea: 1.2, aadhaar: '****4521', phone: '98765 43210', category: 'GENERAL', status: 'COMPENSATED', registeredOn: '10 Jan 2025', rrEntitlement: 'House Plot + Employment' },
  { id: 'FAM002', headName: 'Sunita Deshpande', relation: 'Self', members: 3, village: 'Bhosari', surveyNo: '14/2B', landType: 'AGRICULTURAL', affectedArea: 0.8, aadhaar: '****7832', phone: '87654 32109', category: 'OBC', status: 'VERIFIED', registeredOn: '10 Jan 2025', rrEntitlement: 'House Plot + Annuity' },
  { id: 'FAM003', headName: 'Govind Shinde', relation: 'Self', members: 7, village: 'Bhosari', surveyNo: '15/1', landType: 'AGRICULTURAL', affectedArea: 2.5, aadhaar: '****2201', phone: '76543 21098', category: 'ST', status: 'PENDING', registeredOn: '12 Jan 2025', rrEntitlement: 'House Plot + Employment + Skill Training' },
  { id: 'FAM004', headName: 'Lata Kulkarni', relation: 'Self', members: 4, village: 'Chikhali', surveyNo: '16/3', landType: 'RESIDENTIAL', affectedArea: 0.05, aadhaar: '****9012', phone: '65432 10987', category: 'GENERAL', status: 'RESETTLED', registeredOn: '14 Jan 2025', rrEntitlement: 'House in Resettlement Colony' },
  { id: 'FAM005', headName: 'Vijay More', relation: 'Self', members: 2, village: 'Chikhali', surveyNo: '16/4', landType: 'AGRICULTURAL', affectedArea: 0.6, aadhaar: '****3389', phone: '54321 09876', category: 'SC', status: 'REGISTERED', registeredOn: '14 Jan 2025', rrEntitlement: 'House Plot + Employment' },
  { id: 'FAM006', headName: 'Anita Jadhav', relation: 'Self', members: 6, village: 'Moshi', surveyNo: '17/1', landType: 'AGRICULTURAL', affectedArea: 3.1, aadhaar: '****6674', phone: '43210 98765', category: 'OBC', status: 'COMPENSATED', registeredOn: '16 Jan 2025', rrEntitlement: 'House Plot + Employment' },
  { id: 'FAM007', headName: 'Suresh Kale', relation: 'Self', members: 4, village: 'Moshi', surveyNo: '17/2', landType: 'TENANTED', affectedArea: 1.4, aadhaar: '****1120', phone: '32109 87654', category: 'ST', status: 'VERIFIED', registeredOn: '16 Jan 2025', rrEntitlement: 'One-time payment + Skill Training' },
  { id: 'FAM008', headName: 'Priya Gaikwad', relation: 'Self', members: 8, village: 'Moshi', surveyNo: '18/1', landType: 'AGRICULTURAL', affectedArea: 2.2, aadhaar: '****8842', phone: '21098 76543', category: 'GENERAL', status: 'PENDING', registeredOn: '18 Jan 2025', rrEntitlement: 'House Plot + Employment' },
  { id: 'FAM009', headName: 'Deepak Nair', relation: 'Self', members: 3, village: 'Alandi', surveyNo: '19/1', landType: 'COMMERCIAL', affectedArea: 0.1, aadhaar: '****5500', phone: '10987 65432', category: 'OBC', status: 'RESETTLED', registeredOn: '20 Jan 2025', rrEntitlement: 'Alternative Shop + Annuity' },
  { id: 'FAM010', headName: 'Meena Desai', relation: 'Self', members: 5, village: 'Alandi', surveyNo: '19/2', landType: 'AGRICULTURAL', affectedArea: 1.8, aadhaar: '****9933', phone: '09876 54321', category: 'SC', status: 'REGISTERED', registeredOn: '20 Jan 2025', rrEntitlement: 'House Plot + Employment' },
];

const statusCfg: Record<string, { badge: string; icon: React.ElementType; label: string }> = {
  REGISTERED:   { badge: 'bg-slate-50 text-slate-700 border-slate-200',      icon: Clock,         label: 'Registered' },
  VERIFIED:     { badge: 'bg-blue-50 text-blue-800 border-blue-200',         icon: CheckCircle2,  label: 'Verified' },
  COMPENSATED:  { badge: 'bg-cyan-50 text-cyan-800 border-cyan-200',         icon: CheckCircle2,  label: 'Compensated' },
  RESETTLED:    { badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',icon: CheckCircle2,  label: 'Resettled' },
  PENDING:      { badge: 'bg-amber-50 text-amber-800 border-amber-300',      icon: AlertTriangle, label: 'Pending' },
};

const landTypeBadge: Record<string, string> = {
  AGRICULTURAL: 'bg-green-100 text-green-800',
  RESIDENTIAL:  'bg-purple-100 text-purple-800',
  COMMERCIAL:   'bg-orange-100 text-orange-800',
  TENANTED:     'bg-slate-100 text-slate-700',
};

const categoryColors: Record<string, string> = {
  SC: 'bg-blue-100 text-blue-800',
  ST: 'bg-indigo-100 text-indigo-800',
  OBC: 'bg-yellow-100 text-yellow-800',
  GENERAL: 'bg-slate-100 text-slate-700',
};

export const AffectedFamiliesPage: React.FC = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [selected, setSelected] = useState<Family | null>(null);
  const [families, setFamilies] = useState<Family[]>(MOCK_FAMILIES);

  useEffect(() => {
    apiFetch<Family[]>('/affected-families')
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          // Merge API data with mock data for demonstration
          setFamilies([...res.data, ...MOCK_FAMILIES]);
        }
      })
      .catch(err => console.error('Failed to fetch affected families:', err));
  }, []);

  const maskName = (name: string) => {
    if (!name) return name;
    return name.split(' ').map(part => part.charAt(0) + '*'.repeat(part.length - 1)).join(' ');
  };

  const maskPhone = (phone: string) => {
    if (!phone) return phone;
    return phone.substring(0, 3) + '****' + phone.substring(phone.length - 3);
  };

  const shouldMask = (user?.role as string) === 'PUBLIC' || (user?.role as string) === 'FIELD_OFFICER';

  const filtered = families.filter(f => {
    const matchSearch = search === '' || f.headName.toLowerCase().includes(search.toLowerCase()) || f.surveyNo.includes(search) || f.village.toLowerCase().includes(search.toLowerCase());
    const matchStatus   = filterStatus === 'ALL' || f.status === filterStatus;
    const matchCategory = filterCategory === 'ALL' || f.category === filterCategory;
    return matchSearch && matchStatus && matchCategory;
  });

  const totalMembers = families.reduce((acc, f) => acc + f.members, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-700 rounded flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#0B3559]">Affected Families Registry — RFCTLARR Third Schedule</h1>
            <p className="text-xs text-slate-500">Family-wise enumeration, verification status, and R&R entitlement mapping</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-[#0B3559] text-white rounded hover:bg-[#071E3D] transition-colors">
          <Download className="w-3.5 h-3.5" />
          Export Registry
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total Families', val: families.length, color: 'border-l-[#0B3559]', sub: `${totalMembers} members` },
          { label: 'Resettled', val: families.filter(f => f.status === 'RESETTLED').length, color: 'border-l-emerald-600', sub: 'Fully rehabilitated' },
          { label: 'Compensated', val: families.filter(f => f.status === 'COMPENSATED').length, color: 'border-l-cyan-600', sub: 'PFMS paid' },
          { label: 'Verified', val: families.filter(f => f.status === 'VERIFIED').length, color: 'border-l-blue-600', sub: 'Awaiting payment' },
          { label: 'Pending', val: families.filter(f => ['PENDING','REGISTERED'].includes(f.status)).length, color: 'border-l-amber-500', sub: 'Action required' },
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
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, survey no, or village…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-xs border-none outline-none text-slate-700 placeholder-slate-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white text-slate-700">
            <option value="ALL">All Status</option>
            <option value="REGISTERED">Registered</option>
            <option value="VERIFIED">Verified</option>
            <option value="COMPENSATED">Compensated</option>
            <option value="RESETTLED">Resettled</option>
            <option value="PENDING">Pending</option>
          </select>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white text-slate-700">
            <option value="ALL">All Category</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="OBC">OBC</option>
            <option value="GENERAL">General</option>
          </select>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">{filtered.length} families</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100">
                  <th className="px-3.5 py-2.5 font-semibold text-slate-700">Head of Family</th>
                  <th className="px-3.5 py-2.5 font-semibold text-slate-700">Village / Survey</th>
                  <th className="px-3.5 py-2.5 font-semibold text-slate-700">Members</th>
                  <th className="px-3.5 py-2.5 font-semibold text-slate-700">Land Type</th>
                  <th className="px-3.5 py-2.5 font-semibold text-slate-700">Category</th>
                  <th className="px-3.5 py-2.5 font-semibold text-slate-700">Status</th>
                  <th className="px-3.5 py-2.5 font-semibold text-slate-700 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(f => {
                  const cfg = statusCfg[f.status];
                  const StatusIcon = cfg.icon;
                  return (
                    <tr key={f.id} className={`hover:bg-slate-50/70 transition-colors cursor-pointer ${selected?.id === f.id ? 'bg-blue-50' : ''}`} onClick={() => setSelected(f)}>
                      <td className="px-3.5 py-2.5 font-semibold text-slate-900">{shouldMask ? maskName(f.headName) : f.headName}</td>
                      <td className="px-3.5 py-2.5">
                        <div className="flex items-center gap-1 text-slate-600">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {f.village}
                        </div>
                        <div className="font-mono text-[10px] text-[#0B3559] font-bold mt-0.5">{f.surveyNo}</div>
                      </td>
                      <td className="px-3.5 py-2.5 font-mono font-bold text-slate-900">{f.members}</td>
                      <td className="px-3.5 py-2.5">
                        <span className={`px-1.5 py-0.5 rounded text-[11px] font-medium ${landTypeBadge[f.landType]}`}>{f.landType}</span>
                      </td>
                      <td className="px-3.5 py-2.5">
                        <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${categoryColors[f.category]}`}>{f.category}</span>
                      </td>
                      <td className="px-3.5 py-2.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border font-medium ${cfg.badge}`}>
                          <StatusIcon className="w-3 h-3" />{cfg.label}
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 text-right">
                        <button className="p-1 hover:bg-slate-100 rounded transition-colors">
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 font-mono">
            {filtered.length} of {families.length} families · Total Members: {filtered.reduce((acc, f) => acc + f.members, 0)}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="bg-white border border-slate-200 rounded shadow-sm">
          {selected ? (
            <>
              <div className="p-3 border-b border-slate-200 bg-slate-50">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Family Details</h3>
              </div>
              <div className="p-4 space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-700" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{shouldMask ? maskName(selected.headName) : selected.headName}</div>
                    <div className="text-slate-500">{selected.relation} · {selected.village}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Family ID', val: selected.id },
                    { label: 'Survey No', val: selected.surveyNo },
                    { label: 'Members', val: selected.members },
                    { label: 'Affected Area', val: `${selected.affectedArea} Ha` },
                    { label: 'Land Type', val: selected.landType },
                    { label: 'Category', val: selected.category },
                    { label: 'Aadhaar (masked)', val: selected.aadhaar },
                    { label: 'Phone', val: shouldMask ? maskPhone(selected.phone) : selected.phone },
                    { label: 'Registered On', val: selected.registeredOn },
                  ].map(item => (
                    <div key={item.label} className="bg-slate-50 rounded p-2">
                      <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{item.label}</div>
                      <div className="font-semibold text-slate-900 mt-0.5">{item.val}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded p-3">
                  <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1">R&R Entitlement</div>
                  <div className="text-xs text-emerald-900 font-medium">{selected.rrEntitlement}</div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-[#0B3559] text-white rounded text-[11px] font-semibold hover:bg-[#071E3D] transition-colors">
                    <Phone className="w-3 h-3" /> Contact
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-slate-200 text-slate-700 rounded text-[11px] font-semibold hover:bg-slate-50 transition-colors">
                    <Download className="w-3 h-3" /> Certificate
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-slate-400">
              <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs">Click a family record to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AffectedFamiliesPage;
