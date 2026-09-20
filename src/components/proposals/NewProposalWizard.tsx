import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { saveNewProposal } from '../../services/proposalService';
import { ProjectCategory, ProposalDocument } from '../../types/proposal';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Building,
  MapPin,
  IndianRupee,
  Paperclip,
  Check
} from 'lucide-react';

export const NewProposalWizard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState(() => ({
    title: '',
    projectCategory: 'Highways' as ProjectCategory,
    requiringBody: user?.department || 'National Highways Authority of India (NHAI)',
    nodalOfficerName: user?.fullName || 'Shri R. K. Verma',
    nodalOfficerContact: user?.email || 'r.verma@nhai.org',
    purpose: 'National Infrastructure Corridor Expansion',
    state: user?.state || 'Maharashtra',
    districts: user?.district || 'Pune',
    villagesCount: 12,
    privateHa: 350.0,
    govtHa: 100.0,
    forestHa: 25.0,
    landCostCr: 320.0,
    rrCostCr: 75.0,
    contingencyCr: 15.0,
    adminSanctionNo: `SANCTION/2026/REQ/${Math.floor(1000 + Math.random() * 9000)}`,
    adminSanctionDate: new Date().toISOString().split('T')[0],
    declarationAgreed: false,
  }));

  const [uploadedFiles, setUploadedFiles] = useState<ProposalDocument[]>([
    { id: 'u-1', name: 'DPR_Feasibility_Report_V1.pdf', type: 'DPR', uploadedAt: new Date().toISOString().split('T')[0], sizeMb: 12.4, url: '#' },
    { id: 'u-2', name: 'Cadastral_Alignment_Map.pdf', type: 'ALIGNMENT_MAP', uploadedAt: new Date().toISOString().split('T')[0], sizeMb: 6.8, url: '#' },
  ]);

  const handleSimulatedFileUpload = (type: 'DPR' | 'ALIGNMENT_MAP' | 'LAND_SCHEDULE') => {
    const newDoc: ProposalDocument = {
      id: `u-${Date.now()}`,
      name: `${type}_Uploaded_Doc.pdf`,
      type,
      uploadedAt: new Date().toISOString().split('T')[0],
      sizeMb: parseFloat((Math.random() * 10 + 2).toFixed(1)),
      url: '#'
    };
    setUploadedFiles([...uploadedFiles, newDoc]);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.declarationAgreed) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const created = saveNewProposal(
        {
          title: formData.title || 'National Infrastructure Project Requisition',
          projectCategory: formData.projectCategory,
          requiringBody: formData.requiringBody,
          nodalOfficerName: formData.nodalOfficerName,
          nodalOfficerContact: formData.nodalOfficerContact,
          state: formData.state,
          districts: formData.districts.split(',').map(d => d.trim()),
          villagesCount: Number(formData.villagesCount) || 5,
          landExtent: {
            privateHa: Number(formData.privateHa) || 0,
            govtHa: Number(formData.govtHa) || 0,
            forestHa: Number(formData.forestHa) || 0,
            totalHa: (Number(formData.privateHa) || 0) + (Number(formData.govtHa) || 0) + (Number(formData.forestHa) || 0),
          },
          budget: {
            landCostCr: Number(formData.landCostCr) || 0,
            rrCostCr: Number(formData.rrCostCr) || 0,
            contingencyCr: Number(formData.contingencyCr) || 0,
            totalCostCr: (Number(formData.landCostCr) || 0) + (Number(formData.rrCostCr) || 0) + (Number(formData.contingencyCr) || 0),
          },
          adminSanctionNo: formData.adminSanctionNo,
          adminSanctionDate: formData.adminSanctionDate,
          documents: uploadedFiles,
        },
        user?.fullName || 'Nodal Officer',
        user?.roleDisplayName || 'Requiring Body'
      );

      setIsSubmitting(false);
      setSubmittedId(created.proposalNumber);
    }, 1200);
  };

  if (submittedId) {
    return (
      <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-lg p-6 shadow-md text-center space-y-4 my-8">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h2 className="text-lg font-bold text-slate-900">Requisition Proposal Submitted Successfully!</h2>
        <p className="text-xs text-slate-600">
          Your statutory land acquisition requisition has been registered and transmitted to the State Revenue Department for scrutiny under RFCTLARR Act 2013 Section 4.
        </p>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded font-mono text-sm font-bold text-[#0B3559]">
          Tracking Requisition No: <span className="text-amber-600">{submittedId}</span>
        </div>

        <div className="flex justify-center gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={() => navigate('/proposals')}
            className="px-4 py-2 bg-[#0B3559] hover:bg-[#071E3D] text-white text-xs font-bold rounded shadow-sm"
          >
            Track Proposals Register
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { num: 1, label: 'Agency & Project' },
    { num: 2, label: 'Land & Location' },
    { num: 3, label: 'Cost & Sanction' },
    { num: 4, label: 'Document Uploads' },
    { num: 5, label: 'Review & Submit' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-[#0B3559] text-white p-4 rounded shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-base font-bold tracking-tight">
            Online Land Requisition Proposal Creation Wizard (Sec 4)
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Statutory submission portal for Requiring Bodies &amp; Infrastructure Entities
          </p>
        </div>
        <span className="text-xs font-mono bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2.5 py-1 rounded font-bold">
          RFCTLARR FORM-A
        </span>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-0 transform -translate-y-1/2" />
          {steps.map(s => (
            <div key={s.num} className="relative z-10 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                currentStep === s.num ? 'bg-amber-500 text-slate-900 ring-4 ring-amber-100' :
                currentStep > s.num ? 'bg-emerald-600 text-white' :
                'bg-slate-200 text-slate-600'
              }`}>
                {currentStep > s.num ? '✓' : s.num}
              </div>
              <span className={`text-[10px] font-semibold mt-1 ${currentStep === s.num ? 'text-[#0B3559] font-bold' : 'text-slate-500'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Wizard Form Container */}
      <div className="bg-white border border-slate-200 rounded shadow-sm p-6">

        {/* STEP 1: PROJECT & AGENCY DETAILS */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-200 flex items-center gap-2">
              <Building className="w-4 h-4 text-[#0B3559]" />
              Step 1: Requiring Body &amp; Project Overview
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Title / Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Pune-Solapur National Highway Expansion Phase III"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-[#0B3559] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Infrastructure Category *
                </label>
                <select
                  value={formData.projectCategory}
                  onChange={e => setFormData({ ...formData, projectCategory: e.target.value as ProjectCategory })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-[#0B3559] focus:outline-none"
                >
                  <option value="Highways">Highways &amp; Expressways</option>
                  <option value="Railways">Railways &amp; Freight Corridors</option>
                  <option value="Energy">Green Energy &amp; Power Generation</option>
                  <option value="Industrial">Industrial Parks &amp; MIDC Corridors</option>
                  <option value="Urban Infrastructure">Urban Metro &amp; City Infrastructure</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Requiring Body Entity Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.requiringBody}
                  onChange={e => setFormData({ ...formData, requiringBody: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-[#0B3559] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nodal Officer Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nodalOfficerName}
                  onChange={e => setFormData({ ...formData, nodalOfficerName: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-[#0B3559] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nodal Officer Official Contact (Email / Phone) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nodalOfficerContact}
                  onChange={e => setFormData({ ...formData, nodalOfficerContact: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-[#0B3559] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: LAND & LOCATION SCHEDULE */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-200 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0B3559]" />
              Step 2: Land Extent &amp; Geographic Schedule
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target State *</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={e => setFormData({ ...formData, state: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-[#0B3559]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Districts (Comma Separated) *</label>
                <input
                  type="text"
                  value={formData.districts}
                  onChange={e => setFormData({ ...formData, districts: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-[#0B3559]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Villages Count *</label>
                <input
                  type="number"
                  value={formData.villagesCount}
                  onChange={e => setFormData({ ...formData, villagesCount: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-[#0B3559]"
                />
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded md:col-span-3">
                <span className="text-xs font-bold text-slate-900 block mb-2">Land Breakdown Extent (Hectares)</span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700">Private Land (Ha)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.privateHa}
                      onChange={e => setFormData({ ...formData, privateHa: Number(e.target.value) })}
                      className="w-full text-xs p-2 border border-slate-300 rounded font-mono font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700">Govt / Gram Sabha (Ha)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.govtHa}
                      onChange={e => setFormData({ ...formData, govtHa: Number(e.target.value) })}
                      className="w-full text-xs p-2 border border-slate-300 rounded font-mono font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700">Forest / Protected (Ha)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.forestHa}
                      onChange={e => setFormData({ ...formData, forestHa: Number(e.target.value) })}
                      className="w-full text-xs p-2 border border-slate-300 rounded font-mono font-bold text-slate-800"
                    />
                  </div>
                </div>

                <div className="mt-2 text-right font-mono text-xs text-slate-700">
                  Total Land Extent Required: <strong className="text-emerald-700">{Number(formData.privateHa) + Number(formData.govtHa) + Number(formData.forestHa)} Hectares</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: COST & ADMINISTRATIVE SANCTION */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-200 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-[#0B3559]" />
              Step 3: Tentative Compensation &amp; Financial Sanction
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Administrative &amp; Financial Sanction Order No *
                </label>
                <input
                  type="text"
                  required
                  value={formData.adminSanctionNo}
                  onChange={e => setFormData({ ...formData, adminSanctionNo: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded font-mono focus:ring-2 focus:ring-[#0B3559]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Administrative Sanction Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.adminSanctionDate}
                  onChange={e => setFormData({ ...formData, adminSanctionDate: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-[#0B3559]"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded md:col-span-2 grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700">Estimated Land Cost (₹ Cr)</label>
                  <input
                    type="number"
                    value={formData.landCostCr}
                    onChange={e => setFormData({ ...formData, landCostCr: Number(e.target.value) })}
                    className="w-full text-xs p-2 border border-slate-300 rounded font-mono font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700">R&amp;R Resettlement Budget (₹ Cr)</label>
                  <input
                    type="number"
                    value={formData.rrCostCr}
                    onChange={e => setFormData({ ...formData, rrCostCr: Number(e.target.value) })}
                    className="w-full text-xs p-2 border border-slate-300 rounded font-mono font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700">Contingency (₹ Cr)</label>
                  <input
                    type="number"
                    value={formData.contingencyCr}
                    onChange={e => setFormData({ ...formData, contingencyCr: Number(e.target.value) })}
                    className="w-full text-xs p-2 border border-slate-300 rounded font-mono font-bold text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: STATUTORY DOCUMENT UPLOADS */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-200 flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-[#0B3559]" />
              Step 4: Statutory Document Uploads
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded text-center space-y-2">
                <span className="text-xs font-bold text-slate-800 block">Detailed Project Report (DPR)</span>
                <button
                  type="button"
                  onClick={() => handleSimulatedFileUpload('DPR')}
                  className="px-3 py-1.5 bg-[#0B3559] text-white text-xs font-semibold rounded hover:bg-[#071E3D] transition-colors"
                >
                  Upload DPR PDF
                </button>
              </div>

              <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded text-center space-y-2">
                <span className="text-xs font-bold text-slate-800 block">Cadastral Alignment Map</span>
                <button
                  type="button"
                  onClick={() => handleSimulatedFileUpload('ALIGNMENT_MAP')}
                  className="px-3 py-1.5 bg-[#0B3559] text-white text-xs font-semibold rounded hover:bg-[#071E3D] transition-colors"
                >
                  Upload GIS Map PDF
                </button>
              </div>

              <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded text-center space-y-2">
                <span className="text-xs font-bold text-slate-800 block">Village Land Schedule</span>
                <button
                  type="button"
                  onClick={() => handleSimulatedFileUpload('LAND_SCHEDULE')}
                  className="px-3 py-1.5 bg-[#0B3559] text-white text-xs font-semibold rounded hover:bg-[#071E3D] transition-colors"
                >
                  Upload Schedule PDF
                </button>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-700 mb-2">Uploaded File Manifest ({uploadedFiles.length} files)</h4>
              <div className="space-y-2">
                {uploadedFiles.map(doc => (
                  <div key={doc.id} className="p-2.5 bg-emerald-50/60 border border-emerald-200 rounded flex justify-between items-center text-xs">
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-slate-800">{doc.name}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">{doc.sizeMb} MB</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">Verified PDF</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW & SUBMIT */}
        {currentStep === 5 && (
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Step 5: Review &amp; Statutory Digital Declaration
            </h3>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>Project Title: <strong className="text-slate-900">{formData.title || 'National Infrastructure Project'}</strong></div>
                <div>Category: <strong className="text-slate-900">{formData.projectCategory}</strong></div>
                <div>Requiring Agency: <strong className="text-slate-900">{formData.requiringBody}</strong></div>
                <div>Nodal Officer: <strong className="text-slate-900">{formData.nodalOfficerName}</strong></div>
                <div>Target State &amp; District: <strong className="text-slate-900">{formData.state}, {formData.districts}</strong></div>
                <div>Total Extent: <strong className="text-emerald-700 font-bold">{Number(formData.privateHa) + Number(formData.govtHa) + Number(formData.forestHa)} Hectares</strong></div>
                <div>Sanction Order No: <strong className="font-mono text-slate-900">{formData.adminSanctionNo}</strong></div>
                <div>Total Tentative Budget: <strong className="font-mono text-slate-900">₹{Number(formData.landCostCr) + Number(formData.rrCostCr) + Number(formData.contingencyCr)} Cr</strong></div>
              </div>
            </div>

            <div className="p-3 bg-amber-50/80 border border-amber-300 rounded flex items-start space-x-2">
              <input
                type="checkbox"
                id="dec"
                required
                checked={formData.declarationAgreed}
                onChange={e => setFormData({ ...formData, declarationAgreed: e.target.checked })}
                className="mt-0.5 rounded text-[#0B3559] focus:ring-[#0B3559]"
              />
              <label htmlFor="dec" className="text-xs text-slate-800 leading-snug cursor-pointer">
                <strong>Statutory Declaration:</strong> I hereby certify that the land requisition details, extent schedule, and statutory documents uploaded above are accurate and approved by competent financial authority under RFCTLARR Act 2013 rules.
              </label>
            </div>

            <div className="pt-2 text-right">
              <button
                type="submit"
                disabled={!formData.declarationAgreed || isSubmitting}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs rounded shadow transition-colors flex items-center space-x-2 ml-auto"
              >
                <span>{isSubmitting ? 'Transmitting Requisition...' : 'Submit Requisition Proposal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Wizard Navigation Buttons */}
        <div className="flex justify-between items-center pt-6 mt-6 border-t border-slate-200">
          <button
            type="button"
            disabled={currentStep === 1 || currentStep === 5}
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="px-4 py-2 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-30 flex items-center space-x-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Step</span>
          </button>

          {currentStep < 5 && (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="px-5 py-2 bg-[#0B3559] hover:bg-[#071E3D] text-white text-xs font-bold rounded shadow-sm flex items-center space-x-1.5"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
