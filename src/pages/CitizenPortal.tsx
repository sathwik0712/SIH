import React from 'react';
import { useAuth } from '../context/AuthContext';
import { MapPin, FileText, CheckCircle2, IndianRupee, AlertCircle } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

export const CitizenPortal: React.FC = () => {
  const { user, logout } = useAuth();

  // Mock data for the citizen's parcel
  const myParcel = {
    parcelCode: 'LP-PUN-001',
    surveyNumber: '142/1A',
    village: 'Hadapsar Rural',
    district: 'Pune',
    state: 'Maharashtra',
    areaHectares: 3.45,
    acquisitionStatus: 'AWARD_DECLARED',
    compensationStatus: 'APPROVED',
    compensationAmountInr: 14850000,
    projectCode: 'NH65-HYD-PUN-01',
    projectName: 'NH-65 Hyderabad–Pune 4/6 Lane Highway Corridor',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#0B3559] text-white px-4 py-3 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-lg font-bold font-serif tracking-tight">BHOOMISETU</h1>
          <p className="text-[10px] text-amber-300">Citizen / Landowner Portal</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div>Welcome, <span className="font-bold">{user?.fullName || 'Landowner'}</span></div>
          <button onClick={logout} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded border border-white/20 transition-colors">
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-4">
        {/* Notification Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="text-xs text-amber-900">
            <strong>Update on your Land Parcel:</strong> The Section 23 Award has been declared. Your compensation of ₹1.48 Cr has been approved and is queued for direct PFMS transfer to your registered bank account.
          </div>
        </div>

        {/* Project Context */}
        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Acquiring Project</div>
          <div className="text-sm font-bold text-slate-800">{myParcel.projectName}</div>
          <div className="text-xs text-slate-500 mt-0.5">Reference: {myParcel.projectCode}</div>
        </div>

        {/* Parcel Details & Compensation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded p-4 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-[#0B3559] border-b border-slate-100 pb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              My Land Parcel
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Survey Number:</span>
                <span className="font-bold">{myParcel.surveyNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-semibold">{myParcel.village}, {myParcel.district}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Area Affected:</span>
                <span className="font-bold text-emerald-700">{myParcel.areaHectares} Ha</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="text-slate-500">Acquisition Stage:</span>
                <StatusBadge status={myParcel.acquisitionStatus} />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded p-4 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-[#0B3559] border-b border-slate-100 pb-2 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-purple-600" />
              Compensation & Entitlements
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Total Award Amount:</span>
                <span className="font-bold text-lg font-mono text-purple-800">₹{(myParcel.compensationAmountInr / 10000000).toFixed(2)} Cr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Status:</span>
                <span className="font-bold text-emerald-600">{myParcel.compensationStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bank Account:</span>
                <span className="font-mono">XXXX-XXXX-3421 (Verified)</span>
              </div>
              
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="font-bold text-slate-700 mb-2">R&R Benefits (Third Schedule)</div>
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>One-time Resettlement Allowance (₹50,000) Approved</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <h2 className="text-sm font-bold text-[#0B3559] border-b border-slate-100 pb-2 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-600" />
            Official Documents
          </h2>
          <div className="space-y-2 text-xs">
            {['Section 11(1) Notification Gazette', 'Joint Measurement Survey Report', 'Section 19 Declaration', 'Section 23 Award Order'].map((doc, i) => (
              <div key={i} className="flex justify-between items-center p-2 hover:bg-slate-50 rounded border border-transparent hover:border-slate-200 transition-colors cursor-pointer">
                <span className="font-medium text-slate-700">{doc}</span>
                <span className="text-gov-navy-800 underline font-semibold">Download PDF</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenPortal;
