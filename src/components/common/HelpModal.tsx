import React from 'react';
import { HelpCircle, X, BookOpen, ShieldCheck, Users } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex justify-between items-center z-10">
          <h2 className="text-lg font-bold text-[#0B3559] flex items-center gap-2">
            <HelpCircle className="w-5 h-5" /> BHOOMISETU System Guide
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-8 text-sm text-slate-700">
          {/* Workflow Section */}
          <section>
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" /> Statutory Workflow (RFCTLARR Act, 2013)
            </h3>
            <p className="mb-4">The platform enforces strict adherence to the statutory stages of land acquisition:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <strong className="text-[#0B3559] block">1. Sec 4 - Proposal & SIA</strong>
                Social Impact Assessment initiation and Expert Group clearance.
              </div>
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <strong className="text-[#0B3559] block">2. Sec 11 - Preliminary Notification</strong>
                Official intent to acquire land; triggers field verification and freezing of property transactions.
              </div>
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <strong className="text-[#0B3559] block">3. Sec 15 - Objections & Hearings</strong>
                Landowners file objections. Collector hears cases and submits recommendations.
              </div>
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <strong className="text-[#0B3559] block">4. Sec 19 - Final Declaration</strong>
                Final summary of land to be acquired post-objections.
              </div>
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <strong className="text-[#0B3559] block">5. Sec 23 - Award Assessment</strong>
                Calculation of land value, solatium (100%), and structural assets.
              </div>
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <strong className="text-[#0B3559] block">6. Sec 31 & 38 - R&R and Possession</strong>
                Disbursement of compensation via PFMS, provisioning of R&R benefits, and final handover.
              </div>
            </div>
          </section>

          {/* Roles Section */}
          <section>
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Role-Based Access Control
            </h3>
            <ul className="space-y-3">
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-slate-900">Central / State Ministry:</strong> Macro-level dashboard view, analytics across all projects, and access to the immutable audit trail.
                </div>
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-slate-900">Land Acquiring Authority (CALA):</strong> District-level operations. Can advance workflows, generate statutory gazettes, and manage hearings.
                </div>
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-slate-900">Field Officer:</strong> Conducts on-ground surveys using the GIS module. PII (Personally Identifiable Information) of landowners is partially masked for data privacy.
                </div>
              </li>
            </ul>
          </section>

          {/* Citizen Section */}
          <section>
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-600" /> Citizen Centricity
            </h3>
            <p>
              The <strong>Citizen Portal</strong> allows affected landowners to check their compensation status, track R&R entitlements, and directly file grievances (which are routed to the Grievances module for officer resolution). This fulfills the core mandate for radical transparency.
            </p>
          </section>
        </div>
        
        <div className="border-t border-slate-200 bg-slate-50 p-4 text-right rounded-b-lg">
          <button onClick={onClose} className="px-4 py-2 bg-[#0B3559] text-white text-sm font-semibold rounded hover:bg-[#071E3D] transition-colors">
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
