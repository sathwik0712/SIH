import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Landmark,
  FolderGit2,
  MapPin,
  Gavel,
  DollarSign,
  MessageSquareWarning,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DistrictDashboard: React.FC = () => {
  const { user } = useAuth();
  const districtName = user?.district || 'Pune';

  return (
    <div className="space-y-4">
      {/* District DM/Collector Header */}
      <div className="bg-[#0B3559] text-white p-4 rounded shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Landmark className="w-5 h-5 text-amber-400" />
            <h1 className="text-base font-bold text-white tracking-tight">
              Office of the District Collector &amp; Magistrate — {districtName} District
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded font-semibold uppercase">
              DISTRICT JURISDICTION
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Logged in as <strong className="text-white">{user?.fullName}</strong> ({user?.designation}) • Administration &amp; Statutory Hearing Authority
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/hearings"
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded text-xs font-bold shadow-sm transition-colors"
          >
            <Gavel className="w-4 h-4" />
            <span>Manage Sec 15 Hearings</span>
          </Link>
        </div>
      </div>

      {/* District KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border-l-4 border-l-[#0B3559] border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>District Active Projects</span>
            <FolderGit2 className="w-4 h-4 text-[#0B3559]" />
          </div>
          <div className="text-3xl font-bold text-slate-900 mt-1 font-mono">2</div>
          <div className="text-[11px] text-slate-500 mt-1">{districtName} District Scope</div>
        </div>

        <div className="bg-white border-l-4 border-l-emerald-600 border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Parcels Surveyed / Verified</span>
            <MapPin className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-3xl font-bold text-emerald-800 mt-1 font-mono">142 / 168</div>
          <div className="text-[11px] text-slate-500 mt-1">26 Field Surveys Pending</div>
        </div>

        <div className="bg-white border-l-4 border-l-amber-500 border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Pending Sec 15 Hearings</span>
            <Gavel className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-bold text-amber-700 mt-1 font-mono">4 Hearings</div>
          <div className="text-[11px] text-amber-700 mt-1">Scheduled This Week</div>
        </div>

        <div className="bg-white border-l-4 border-l-purple-600 border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Compensation Pending</span>
            <DollarSign className="w-4 h-4 text-purple-700" />
          </div>
          <div className="text-3xl font-bold text-purple-900 mt-1 font-mono">₹45.2 Cr</div>
          <div className="text-[11px] text-slate-500 mt-1">of ₹180.0 Cr Assessed Total</div>
        </div>
      </div>

      {/* District Operations Overview & Hearings Quick List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Hearings Schedule */}
        <div className="bg-white border border-slate-200 rounded shadow-sm p-4">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Gavel className="w-4 h-4 text-[#0B3559]" />
              Sec 15 Objection Hearings Schedule
            </h3>
            <Link to="/hearings" className="text-xs font-semibold text-[#0B3559] hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-slate-900">Parcel MH-PN-045 (Khed Tehsil)</span>
                <p className="text-slate-600 text-[11px]">Objector: Shri Tukaram Gaikwad • Land Valuation Discrepancy</p>
              </div>
              <span className="px-2 py-1 bg-amber-100 text-amber-800 font-semibold rounded text-[11px]">Tomorrow 11:00 AM</span>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-slate-900">Parcel MH-PN-089 (Haveli Tehsil)</span>
                <p className="text-slate-600 text-[11px]">Objector: Smt. Sunita Patil • Joint Ownership Dispute</p>
              </div>
              <span className="px-2 py-1 bg-amber-100 text-amber-800 font-semibold rounded text-[11px]">22 Sep 02:30 PM</span>
            </div>
          </div>
        </div>

        {/* Citizen Grievance Tracker */}
        <div className="bg-white border border-slate-200 rounded shadow-sm p-4">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <MessageSquareWarning className="w-4 h-4 text-amber-600" />
              Citizen Grievances Pending Resolution
            </h3>
            <Link to="/grievances" className="text-xs font-semibold text-[#0B3559] hover:underline flex items-center gap-1">
              <span>Grievance Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-slate-900">GRV-2026-901 — Delay in Compensation Disbursal</span>
                <p className="text-slate-600 text-[11px]">Applicant: Ramesh Shinde • Pune District Collectorate</p>
              </div>
              <span className="px-2 py-1 bg-red-100 text-red-800 font-semibold rounded text-[11px]">High Priority</span>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-slate-900">GRV-2026-884 — R&amp;R Resettlement Plot Allocation</span>
                <p className="text-slate-600 text-[11px]">Applicant: Vithal Jadhav • Khed Sub-Division</p>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 font-semibold rounded text-[11px]">In Progress</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
