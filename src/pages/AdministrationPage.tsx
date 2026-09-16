import React from 'react';
import { Users, Shield, ShieldAlert, CheckCircle2, XCircle, Search, Settings } from 'lucide-react';

interface UserRecord {
  id: string;
  name: string;
  role: string;
  department: string;
  jurisdiction: string;
  lastLogin: string;
  status: 'ACTIVE' | 'INACTIVE';
}

const MOCK_USERS: UserRecord[] = [
  { id: 'USR-01', name: 'Rajesh Kumar', role: 'State Nodal Officer', department: 'Revenue Dept', jurisdiction: 'Maharashtra State', lastLogin: 'Today, 09:12 AM', status: 'ACTIVE' },
  { id: 'USR-02', name: 'Sanjay Deshmukh', role: 'District Collector', department: 'Collectorate Pune', jurisdiction: 'Pune District', lastLogin: 'Today, 10:45 AM', status: 'ACTIVE' },
  { id: 'USR-03', name: 'Suraj Verma', role: 'Revenue Inspector', department: 'Land Records', jurisdiction: 'Haveli Taluka', lastLogin: 'Yesterday, 04:30 PM', status: 'ACTIVE' },
  { id: 'USR-04', name: 'Anil Desai', role: 'Talathi', department: 'Land Records', jurisdiction: 'Moshi / Bhosari', lastLogin: 'Yesterday, 02:15 PM', status: 'ACTIVE' },
  { id: 'USR-05', name: 'Priya Sharma', role: 'Revenue Inspector', department: 'Land Records', jurisdiction: 'Pimpri Taluka', lastLogin: '10 Jun 2025', status: 'INACTIVE' },
  { id: 'USR-06', name: 'Amitabh Singh', role: 'NHAI Project Director', department: 'NHAI', jurisdiction: 'NH48 Corridor', lastLogin: 'Today, 08:30 AM', status: 'ACTIVE' },
  { id: 'USR-07', name: 'Neha Gupta', role: 'Central Ministry', department: 'MoRTH', jurisdiction: 'National', lastLogin: 'Today, 11:00 AM', status: 'ACTIVE' },
];

const PERMISSIONS = [
  { role: 'Central Ministry', readAll: true, approveGazette: false, issueAward: false, pfmsAccess: false, editRecords: false },
  { role: 'State Nodal Officer', readAll: true, approveGazette: true, issueAward: false, pfmsAccess: true, editRecords: false },
  { role: 'District Collector', readAll: true, approveGazette: false, issueAward: true, pfmsAccess: true, editRecords: true },
  { role: 'Revenue Inspector', readAll: false, approveGazette: false, issueAward: false, pfmsAccess: false, editRecords: true },
  { role: 'Acquiring Body (NHAI)', readAll: true, approveGazette: false, issueAward: false, pfmsAccess: true, editRecords: false },
];

function PermCheck({ val }: { val: boolean }) {
  return val ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-300 mx-auto" />;
}

export const AdministrationPage: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center">
            <Settings className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#0B3559]">System Administration & Access Control</h1>
            <p className="text-xs text-slate-500">Manage user roles, jurisdictions, and RBAC permissions</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* User Management Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded shadow-sm overflow-hidden flex flex-col">
          <div className="p-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5"><Users className="w-4 h-4" /> User Directory</h3>
            <div className="flex items-center gap-2 border border-slate-200 rounded px-2 py-1 bg-white">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input type="text" placeholder="Search users..." className="text-xs border-none outline-none w-32" />
            </div>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-3.5 py-2.5 font-semibold text-slate-700">User / Dept</th>
                  <th className="px-3.5 py-2.5 font-semibold text-slate-700">Role & Jurisdiction</th>
                  <th className="px-3.5 py-2.5 font-semibold text-slate-700 text-center">Status</th>
                  <th className="px-3.5 py-2.5 font-semibold text-slate-700 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_USERS.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-3.5 py-2.5">
                      <div className="font-semibold text-slate-900">{u.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{u.department}</div>
                    </td>
                    <td className="px-3.5 py-2.5">
                      <div className="font-semibold text-[#0B3559]">{u.role}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{u.jurisdiction}</div>
                    </td>
                    <td className="px-3.5 py-2.5 text-center">
                      {u.status === 'ACTIVE' ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">ACTIVE</span>
                      ) : (
                        <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded font-bold">INACTIVE</span>
                      )}
                      <div className="text-[9px] text-slate-400 mt-1">{u.lastLogin}</div>
                    </td>
                    <td className="px-3.5 py-2.5 text-right">
                      <button className="text-blue-600 font-semibold hover:underline">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Permission Matrix */}
        <div className="bg-white border border-slate-200 rounded shadow-sm flex flex-col">
          <div className="p-3 border-b border-slate-200 bg-slate-50">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5"><Shield className="w-4 h-4" /> Role Permissions Matrix</h3>
          </div>
          <div className="overflow-x-auto p-2">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="p-2 font-semibold text-slate-700 w-1/3">Role</th>
                  <th className="p-2 font-semibold text-slate-700 text-center" title="Read All Data"><div className="truncate">View</div></th>
                  <th className="p-2 font-semibold text-slate-700 text-center" title="Edit Field Records"><div className="truncate">Edit</div></th>
                  <th className="p-2 font-semibold text-slate-700 text-center" title="Issue Sec 23 Award"><div className="truncate">Award</div></th>
                  <th className="p-2 font-semibold text-slate-700 text-center" title="PFMS Financial Auth"><div className="truncate">PFMS</div></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PERMISSIONS.map(p => (
                  <tr key={p.role}>
                    <td className="p-2 font-semibold text-[#0B3559] leading-tight">{p.role}</td>
                    <td className="p-2"><PermCheck val={p.readAll} /></td>
                    <td className="p-2"><PermCheck val={p.editRecords} /></td>
                    <td className="p-2"><PermCheck val={p.issueAward} /></td>
                    <td className="p-2"><PermCheck val={p.pfmsAccess} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-auto p-3 bg-amber-50 border-t border-amber-200 text-xs text-amber-800 flex gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p><strong>Note:</strong> Collector and State Nodal Officer roles require Multi-Factor Authentication (MFA) via Aadhaar eSign for PFMS transfers.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdministrationPage;
