import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MapPin, FileText, Download, ShieldCheck, Send } from 'lucide-react';

export const CitizenDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'STATUS' | 'COMPENSATION' | 'RR' | 'GRIEVANCE' | 'NOTICES'>('STATUS');
  const [grievanceText, setGrievanceText] = useState('');
  const [grievanceSubmitted, setGrievanceSubmitted] = useState(false);

  // Single citizen parcel mock data (Shri Tukaram S. Gaikwad)
  const citizenParcel = {
    parcelCode: 'MH-PN-KH-001',
    khasraNumber: '142/1A',
    village: 'Khed Shivapur',
    tehsil: 'Khed',
    district: 'Pune',
    state: 'Maharashtra',
    areaHectares: 2.4,
    projectName: 'Pune Ring Road Southern Arc (NH-48 Corridor)',
    statutoryStage: 'AWARD_DECLARED',
    currentStageIndex: 4, // 0..5
    timelineSteps: [
      { step: '1. Sec 4 Proposal', label: 'Land Acquisition Requisition Initiated', status: 'COMPLETED', date: '10 Jan 2026' },
      { step: '2. Sec 11 Notification', label: 'Gazette Notice Published (Public Notice)', status: 'COMPLETED', date: '28 Feb 2026' },
      { step: '3. Sec 15 Hearing', label: 'Objection Hearing & Verification Conducted', status: 'COMPLETED', date: '15 May 2026' },
      { step: '4. Sec 23 Award Inquiry', label: 'Land Valuation & Award Declared', status: 'COMPLETED', date: '10 Aug 2026' },
      { step: '5. Compensation Payment', label: 'PFMS Direct Benefit Transfer Sent to Bank', status: 'IN_PROGRESS', date: 'Pending Bank Processing' },
      { step: '6. Possession Handover', label: 'Final Handover (Sec 38)', status: 'PENDING', date: 'Expected Nov 2026' }
    ],
    compensationDetails: {
      assessedValue: 8500000,
      solatium100Pct: 8500000,
      interestAmount: 425000,
      totalCompensation: 17425000,
      pfmsRefNo: 'PFMS20260912MH099',
      paymentStatus: 'IN_TRANSIT',
      bankName: 'State Bank of India (Khed Branch)',
      accountMasked: 'XXXX-XXXX-4819'
    },
    rrEntitlements: [
      { item: 'Constructed House or One-time Financial Grant', status: 'APPROVED', amount: '₹5,00,000' },
      { item: 'One-time Resettlement Allowance', status: 'DISBURSED', amount: '₹50,000' },
      { item: 'Stamp Duty & Registration Fee Exemption', status: 'ELIGIBLE', amount: 'Full Waiver' },
      { item: 'Mandatory Employment / Annuity Grant', status: 'UNDER_PROCESS', amount: '₹2,500/month' }
    ],
    notices: [
      { title: 'Section 11(1) Preliminary Gazette Notification', pdfName: 'Sec11_MH_PN_001.pdf', date: '28 Feb 2026' },
      { title: 'Section 15(1) Objection Hearing Notice', pdfName: 'Sec15_Hearing_Notice.pdf', date: '20 Apr 2026' },
      { title: 'Section 23 Award Declaration Notice', pdfName: 'Award_Notice_Tukaram_Gaikwad.pdf', date: '10 Aug 2026' }
    ],
    grievances: [
      { id: 'GRV-CIT-1092', subject: 'Inquiry regarding PFMS Compensation Transfer Timeline', status: 'IN_PROGRESS', date: '05 Sep 2026' }
    ]
  };

  const handleGrievanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceText) return;
    setGrievanceSubmitted(true);
    setTimeout(() => {
      setGrievanceText('');
    }, 2000);
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Official Citizen Welcome Banner */}
      <div className="bg-[#0B3559] text-white p-5 rounded-lg shadow-md border-l-4 border-l-amber-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <h1 className="text-lg font-bold text-white tracking-tight">
                RFCTLARR Citizen Transparency Portal
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded font-semibold uppercase">
                AUTHENTICATED LANDOWNER
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Welcome, <strong className="text-white">{user?.fullName || 'Shri Tukaram S. Gaikwad'}</strong> • Landowner Parcel ID: <span className="font-mono text-amber-300 font-semibold">{citizenParcel.parcelCode}</span>
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs bg-slate-800/80 px-3 py-1.5 rounded border border-slate-700">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Khasra No. {citizenParcel.khasraNumber} • {citizenParcel.village}, {citizenParcel.district}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for Citizen - Mobile Touch Scrollable */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
        <button
          onClick={() => setActiveTab('STATUS')}
          className={`px-3.5 py-2 text-xs font-bold rounded whitespace-nowrap transition-colors shrink-0 ${
            activeTab === 'STATUS' ? 'bg-[#0B3559] text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          My Land Status
        </button>

        <button
          onClick={() => setActiveTab('COMPENSATION')}
          className={`px-3.5 py-2 text-xs font-bold rounded whitespace-nowrap transition-colors shrink-0 ${
            activeTab === 'COMPENSATION' ? 'bg-[#0B3559] text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Compensation &amp; DBT
        </button>

        <button
          onClick={() => setActiveTab('RR')}
          className={`px-3.5 py-2 text-xs font-bold rounded whitespace-nowrap transition-colors shrink-0 ${
            activeTab === 'RR' ? 'bg-[#0B3559] text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          R&amp;R Entitlements
        </button>

        <button
          onClick={() => setActiveTab('NOTICES')}
          className={`px-3.5 py-2 text-xs font-bold rounded whitespace-nowrap transition-colors shrink-0 ${
            activeTab === 'NOTICES' ? 'bg-[#0B3559] text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Official Notices
        </button>

        <button
          onClick={() => setActiveTab('GRIEVANCE')}
          className={`px-3.5 py-2 text-xs font-bold rounded whitespace-nowrap transition-colors shrink-0 ${
            activeTab === 'GRIEVANCE' ? 'bg-amber-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Direct Grievance / Appeal
        </button>
      </div>

      {/* TAB 1: VISUAL STATUS TRACKER */}
      {activeTab === 'STATUS' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded shadow-sm p-4">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Acquisition Lifecycle Tracker (Parcel: {citizenParcel.parcelCode})
            </h2>
            <p className="text-xs text-slate-600 mb-4">
              Project: <strong>{citizenParcel.projectName}</strong> • Area Required: <strong>{citizenParcel.areaHectares} Hectares</strong>
            </p>

            {/* Stepper Delivery-Style Tracker */}
            <div className="relative my-6 px-2">
              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                {citizenParcel.timelineSteps.map((step, idx) => (
                  <div key={step.step} className="relative flex items-start space-x-3 text-xs">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 text-xs font-bold font-mono ${
                      step.status === 'COMPLETED' ? 'bg-emerald-600 text-white' :
                      step.status === 'IN_PROGRESS' ? 'bg-amber-500 text-slate-900 ring-4 ring-amber-100' :
                      'bg-slate-200 text-slate-500'
                    }`}>
                      {step.status === 'COMPLETED' ? '✓' : idx + 1}
                    </div>

                    <div className={`flex-1 p-3 rounded border ${
                      step.status === 'IN_PROGRESS' ? 'bg-amber-50/60 border-amber-300' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">{step.step}</span>
                        <span className="font-mono text-[11px] font-semibold text-slate-600">{step.date}</span>
                      </div>
                      <p className="text-xs text-slate-700 mt-0.5">{step.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMPENSATION BREAKDOWN */}
      {activeTab === 'COMPENSATION' && (
        <div className="bg-white border border-slate-200 rounded shadow-sm p-5 space-y-4">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-200">
            Assessed Compensation Breakdown (Sec 23 Award)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <span className="text-xs text-slate-500 font-medium">Assessed Market Value</span>
              <div className="text-lg font-bold font-mono text-slate-900 mt-1">₹85,00,000</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <span className="text-xs text-slate-500 font-medium">100% Solatium (Mandatory)</span>
              <div className="text-lg font-bold font-mono text-slate-900 mt-1">₹85,00,000</div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded">
              <span className="text-xs text-emerald-800 font-medium">Interest &amp; Total Award</span>
              <div className="text-lg font-bold font-mono text-emerald-800 mt-1">₹1,74,25,000</div>
            </div>
          </div>

          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded space-y-2 text-xs">
            <div className="flex justify-between font-bold text-slate-900">
              <span>PFMS Payment Status:</span>
              <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-mono">IN TRANSIT TO BANK</span>
            </div>
            <div className="text-slate-700">PFMS Reference Number: <strong className="font-mono">{citizenParcel.compensationDetails.pfmsRefNo}</strong></div>
            <div className="text-slate-700">Crediting Bank: <strong>{citizenParcel.compensationDetails.bankName}</strong> ({citizenParcel.compensationDetails.accountMasked})</div>
          </div>
        </div>
      )}

      {/* TAB 3: R&R ENTITLEMENTS */}
      {activeTab === 'RR' && (
        <div className="bg-white border border-slate-200 rounded shadow-sm p-5 space-y-4">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-200">
            Rehabilitation &amp; Resettlement (R&amp;R) Entitlements Checklist
          </h2>

          <div className="space-y-2.5">
            {citizenParcel.rrEntitlements.map(item => (
              <div key={item.item} className="p-3 bg-slate-50 border border-slate-200 rounded flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-900">{item.item}</span>
                  <div className="text-emerald-700 font-mono font-semibold mt-0.5">{item.amount}</div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-semibold rounded text-[11px]">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: OFFICIAL NOTICES DOWNLOAD */}
      {activeTab === 'NOTICES' && (
        <div className="bg-white border border-slate-200 rounded shadow-sm p-5 space-y-4">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-200">
            Download Official Statutory Notices
          </h2>

          <div className="space-y-2.5">
            {citizenParcel.notices.map(notice => (
              <div key={notice.title} className="p-3.5 bg-slate-50 border border-slate-200 rounded flex justify-between items-center text-xs">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-[#0B3559]" />
                  <div>
                    <span className="font-bold text-slate-900">{notice.title}</span>
                    <p className="text-slate-500 text-[11px]">Issued on {notice.date}</p>
                  </div>
                </div>

                <button 
                  onClick={() => alert(`Downloading official PDF: ${notice.pdfName}`)}
                  className="px-3 py-1.5 bg-[#0B3559] hover:bg-[#071E3D] text-white text-xs font-semibold rounded flex items-center space-x-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: FILE / TRACK GRIEVANCE */}
      {activeTab === 'GRIEVANCE' && (
        <div className="bg-white border border-slate-200 rounded shadow-sm p-5 space-y-4">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-200">
            Landowner Grievance Desk
          </h2>

          <form onSubmit={handleGrievanceSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Describe Your Grievance / Objection
              </label>
              <textarea
                rows={3}
                value={grievanceText}
                onChange={e => setGrievanceText(e.target.value)}
                placeholder="Enter details regarding compensation, land boundary, or R&R entitlement..."
                className="w-full text-xs p-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded shadow-sm flex items-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Official Grievance</span>
            </button>

            {grievanceSubmitted && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-xs font-semibold">
                ✓ Grievance submitted successfully! Tracking ID: GRV-CIT-2026-991. You will be notified of updates.
              </div>
            )}
          </form>

          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">My Filed Grievances</h3>
            {citizenParcel.grievances.map(g => (
              <div key={g.id} className="p-3 bg-slate-50 border border-slate-200 rounded flex justify-between items-center text-xs">
                <div>
                  <span className="font-mono font-bold text-[#0B3559]">{g.id}</span> — {g.subject}
                  <p className="text-[11px] text-slate-500">Filed on {g.date}</p>
                </div>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[11px] font-bold rounded">
                  {g.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
