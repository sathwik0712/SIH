import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AcquisitionStage } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { WorkflowTimeline, STAGES_CONFIG } from '../components/common/WorkflowTimeline';
import { StatusBadge } from '../components/common/StatusBadge';
import { DataTable, Column } from '../components/common/DataTable';
import { CadastralMap } from '../components/gis/CadastralMap';
import { 
  Building2, MapPin, Calendar, Banknote, 
  Map, ScrollText, Award, Users, KeyRound, 
  FileText, History, CheckCircle2, AlertTriangle, 
  ArrowRight, Shield, Clock, ExternalLink 
} from 'lucide-react';

interface ProjectDetailsPageProps {
  projectId: string;
  onNavigate: (module: string, projectId?: string) => void;
}

export const ProjectDetailsPage: React.FC<ProjectDetailsPageProps> = ({ projectId, onNavigate }) => {
  const { 
    projects, parcels, notifications, objections, 
    awards, compensationRecords, families, rrBenefits, 
    possessionRecords, documents, auditLogs, advanceProjectStage 
  } = useApp();

  const project = projects.find(p => p.id === projectId) || projects[0];
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedWorkflowStage, setSelectedWorkflowStage] = useState<AcquisitionStage>(project.currentStage);

  if (!project) {
    return (
      <div className="p-8 text-center text-gov-gray-600">
        <p className="font-bold text-sm">Project Not Found</p>
        <button onClick={() => onNavigate('projects')} className="mt-2 text-xs text-gov-navy underline">
          Return to Projects Registry
        </button>
      </div>
    );
  }

  // Project-filtered datasets
  const projectParcels = parcels.filter(p => p.projectId === project.id);
  const projectNotifs = notifications.filter(n => n.projectId === project.id);
  const projectObjections = objections.filter(o => o.projectId === project.id);
  const projectAwards = awards.filter(a => a.projectId === project.id);
  const projectCompensation = compensationRecords.filter(c => c.projectId === project.id);
  const projectFamilies = families.filter(f => f.projectId === project.id);
  const projectRR = rrBenefits.filter(r => r.projectId === project.id);
  const projectPossession = possessionRecords.filter(p => p.projectId === project.id);
  const projectDocuments = documents.filter(d => d.projectId === project.id);
  const projectAudit = auditLogs.filter(a => a.entityId.includes(project.id) || a.details.includes(project.name));

  const progressPct = ((project.landAcquiredHa / project.landRequiredHa) * 100).toFixed(1);

  const tabs = [
    { id: 'overview', label: '1. Overview', icon: Building2 },
    { id: 'parcels', label: `2. Parcels (${projectParcels.length})`, icon: MapPin },
    { id: 'workflow', label: '3. Statutory Workflow', icon: Clock },
    { id: 'notifications', label: `4. Notifications (${projectNotifs.length})`, icon: ScrollText },
    { id: 'objections', label: `5. Objections (${projectObjections.length})`, icon: AlertTriangle },
    { id: 'awards', label: `6. Awards (${projectAwards.length})`, icon: Award },
    { id: 'compensation', label: `7. Compensation (${projectCompensation.length})`, icon: Banknote },
    { id: 'randr', label: `8. R&R (${projectRR.length})`, icon: Users },
    { id: 'possession', label: `9. Possession (${projectPossession.length})`, icon: KeyRound },
    { id: 'documents', label: `10. Documents (${projectDocuments.length})`, icon: FileText },
  ];

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <Breadcrumbs
        items={[
          { label: 'Projects Registry', action: () => onNavigate('projects') },
          { label: project.code },
        ]}
      />

      {/* Project Hero Header */}
      <div className="bg-white border border-gov-gray-300 rounded p-4 shadow-sm select-none">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gov-gray-200 pb-3">
          <div className="space-y-1 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-gov-navy bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {project.code}
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-800 border border-slate-200">
                Sector: {project.sector}
              </span>
              <StatusBadge status={project.status} size="sm" />
            </div>
            <h2 className="text-lg font-bold text-gov-navy font-serif leading-snug">
              {project.name}
            </h2>
            <p className="text-xs text-gov-gray-600 leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1.5 text-xs text-right">
            <div className="text-[11px] text-gov-gray-500">
              Nodal Officer: <strong>{project.nodalOfficer}</strong>
            </div>
            <div className="text-[11px] text-gov-gray-500">
              Target Date: <strong className="font-mono">{project.targetDate}</strong>
            </div>
            <div className="text-[11px] text-gov-gray-500">
              Acquiring Body: <strong>{project.acquiringAuthority}</strong>
            </div>
          </div>
        </div>

        {/* Quick KPI Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 pt-3 text-xs">
          <div className="p-2 bg-gov-gray-50 rounded border border-gov-gray-200">
            <span className="text-[10px] text-gov-gray-500 block">Required Area:</span>
            <span className="font-bold text-gov-navy text-sm font-serif">{project.landRequiredHa} Ha</span>
          </div>
          <div className="p-2 bg-emerald-50 rounded border border-emerald-200">
            <span className="text-[10px] text-emerald-800 block">Acquired Area:</span>
            <span className="font-bold text-emerald-900 text-sm font-serif">
              {project.landAcquiredHa} Ha ({progressPct}%)
            </span>
          </div>
          <div className="p-2 bg-gov-gray-50 rounded border border-gov-gray-200">
            <span className="text-[10px] text-gov-gray-500 block">Total Parcels:</span>
            <span className="font-bold text-gov-navy text-sm font-serif">{project.totalParcelsCount} Parcels</span>
          </div>
          <div className="p-2 bg-gov-gray-50 rounded border border-gov-gray-200">
            <span className="text-[10px] text-gov-gray-500 block">Estimated Cost:</span>
            <span className="font-bold text-gov-navy text-sm font-serif">₹{project.estimatedCostCr} Cr</span>
          </div>
          <div className="p-2 bg-blue-50 rounded border border-blue-200">
            <span className="text-[10px] text-blue-800 block">Comp. Disbursed:</span>
            <span className="font-bold text-blue-900 text-sm font-serif">₹{project.compensationDisbursedCr} Cr</span>
          </div>
          <div className="p-2 bg-amber-50 rounded border border-amber-200">
            <span className="text-[10px] text-amber-800 block">Risk Score:</span>
            <span className="font-bold text-amber-950 text-sm font-serif">{project.riskScore} / 100</span>
          </div>
        </div>
      </div>

      {/* Statutory 10-Stage Horizontal Lifecycle Bar */}
      <WorkflowTimeline
        currentStage={project.currentStage}
        activeSelectedStage={selectedWorkflowStage}
        onSelectStage={(s) => {
          setSelectedWorkflowStage(s);
          setActiveTab('workflow');
        }}
      />

      {/* Subtabs Header */}
      <div className="flex border-b border-gov-gray-300 bg-white rounded-t overflow-x-auto text-xs font-medium select-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-gov-navy text-gov-navy font-bold bg-blue-50/50'
                  : 'border-transparent text-gov-gray-600 hover:text-gov-navy hover:bg-gov-gray-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-gov-navy' : 'text-gov-gray-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Subtab Content Panels */}
      <div className="bg-white border border-t-0 border-gov-gray-300 rounded-b p-4 shadow-sm">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left Column: Project Milestones */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gov-navy uppercase tracking-wider font-serif">
                  Statutory Lifecycle Summary
                </h4>
                <div className="p-3 bg-gov-gray-50 rounded border border-gov-gray-200 text-xs space-y-2">
                  <div className="flex justify-between py-1 border-b border-gov-gray-200">
                    <span className="text-gov-gray-600">Current Statutory Stage:</span>
                    <span className="font-bold text-gov-navy">
                      Stage {project.currentStage} — {STAGES_CONFIG[project.currentStage - 1]?.label}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gov-gray-200">
                    <span className="text-gov-gray-600">Statutory Act Governing:</span>
                    <span className="font-medium text-gov-gray-900">RFCTLARR Act, 2013 (Central Act 30)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gov-gray-200">
                    <span className="text-gov-gray-600">Jurisdictional CALA:</span>
                    <span className="font-medium text-gov-gray-900">Collector & District Magistrate, {project.district}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gov-gray-200">
                    <span className="text-gov-gray-600">Start Date:</span>
                    <span className="font-mono text-gov-gray-900">{project.startDate}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gov-gray-600">Statutory Deadline:</span>
                    <span className="font-mono font-bold text-gov-navy">{project.targetDate}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="p-3 bg-emerald-50/50 rounded border border-emerald-200 text-xs space-y-1.5">
                  <div className="flex justify-between font-medium">
                    <span className="text-emerald-950">Land Acquisition Physical Progress:</span>
                    <span className="font-bold text-emerald-900">{progressPct}%</span>
                  </div>
                  <div className="h-3 w-full bg-gov-gray-200 rounded overflow-hidden">
                    <div className="h-full bg-emerald-600" style={{ width: `${progressPct}%` }}></div>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    {project.landAcquiredHa} Hectares possessed of {project.landRequiredHa} Hectares required.
                  </p>
                </div>
              </div>

              {/* Right Column: Mini GIS Snippet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gov-navy uppercase tracking-wider font-serif flex items-center gap-1">
                    <Map className="w-3.5 h-3.5" />
                    <span>Project Cadastral Footprint</span>
                  </h4>
                  <button
                    onClick={() => onNavigate('gis-map')}
                    className="text-xs text-gov-navy hover:underline font-semibold"
                  >
                    Open Full GIS Map &rarr;
                  </button>
                </div>
                <CadastralMap
                  parcelsList={projectParcels}
                  selectedProjectId={project.id}
                  heightClass="h-[280px]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LAND PARCELS */}
        {activeTab === 'parcels' && (
          <div className="space-y-3">
            <DataTable
              columns={[
                { key: 'surveyNumber', header: 'Survey No.', sortable: true, render: (p) => <span className="font-bold text-gov-navy">{p.surveyNumber}</span> },
                { key: 'khasraNumber', header: 'Khasra No.', sortable: true },
                { key: 'village', header: 'Village', sortable: true },
                { key: 'areaAcres', header: 'Area (Acres)', sortable: true, align: 'right', render: (p) => <span>{p.areaAcres} Ac ({p.areaHa} Ha)</span> },
                { key: 'landType', header: 'Category', sortable: true },
                { key: 'ownerName', header: 'Owner Name', sortable: true },
                { key: 'verificationStatus', header: 'Verification', sortable: true, align: 'center', render: (p) => <StatusBadge status={p.verificationStatus} size="sm" /> },
                { key: 'acquisitionStatus', header: 'Acquisition Stage', sortable: true, align: 'center', render: (p) => <StatusBadge status={p.acquisitionStatus} size="sm" /> },
                { key: 'totalCompensationEstimated', header: 'Est. Compensation', sortable: true, align: 'right', render: (p) => <span className="font-bold text-emerald-800">₹{p.totalCompensationEstimated} L</span> },
              ]}
              data={projectParcels}
              title={`Cadastral Land Parcels (${projectParcels.length})`}
              subtitle={`Survey records belonging to ${project.name}`}
            />
          </div>
        )}

        {/* TAB 3: STATUTORY WORKFLOW */}
        {activeTab === 'workflow' && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50/60 rounded border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">
                    Statutory Stage {selectedWorkflowStage} of 10
                  </span>
                  <h3 className="text-base font-bold text-gov-navy font-serif">
                    {STAGES_CONFIG[selectedWorkflowStage - 1]?.label} ({STAGES_CONFIG[selectedWorkflowStage - 1]?.actRef})
                  </h3>
                </div>

                {project.currentStage === selectedWorkflowStage && selectedWorkflowStage < 10 && (
                  <button
                    onClick={() => advanceProjectStage(project.id, (selectedWorkflowStage + 1) as AcquisitionStage)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gov-navy text-white text-xs font-semibold rounded hover:bg-gov-navy-hover transition-colors shadow-xs"
                  >
                    <span>Advance to Stage {selectedWorkflowStage + 1}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Stage Checklist */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-gov-gray-900 uppercase tracking-wider text-[11px]">
                Statutory Compliance Checklist for Stage {selectedWorkflowStage}:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  { item: 'Detailed Cadastral Boundary Survey Completed', done: selectedWorkflowStage >= 3 },
                  { item: 'Gram Sabha / Public Consultation Minutes Documented', done: selectedWorkflowStage >= 2 },
                  { item: 'Social Impact Assessment (SIA) Study Cleared by Expert Group', done: selectedWorkflowStage >= 2 },
                  { item: 'Section 11(1) Preliminary Gazette Notification Published', done: selectedWorkflowStage >= 4 },
                  { item: '60-Day Section 15 Objection Hearing Window Concluded', done: selectedWorkflowStage >= 5 },
                  { item: 'Section 19(1) Final Declaration of Public Purpose Published', done: selectedWorkflowStage >= 6 },
                  { item: 'Section 23 Valuation & Statutory 100% Solatium Computed', done: selectedWorkflowStage >= 6 },
                  { item: 'Direct Benefit Transfer (DBT) Compensation Disbursed via PFMS', done: selectedWorkflowStage >= 7 },
                  { item: 'Resettlement & Rehabilitation Allotment Handed Over (Sec 31)', done: selectedWorkflowStage >= 8 },
                  { item: 'Section 16 Physical Possession & Panchnama Executed', done: selectedWorkflowStage >= 9 },
                ].map((chk, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded border flex items-center justify-between ${
                      chk.done ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950' : 'bg-gov-gray-50 border-gov-gray-200 text-gov-gray-600'
                    }`}
                  >
                    <span className="font-medium">{chk.item}</span>
                    <span className="flex-shrink-0 ml-2">
                      {chk.done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <Clock className="w-4 h-4 text-gov-gray-400" />
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <DataTable
            columns={[
              { key: 'sectionType', header: 'Section / Statutory Notice', sortable: true, render: (n) => <span className="font-bold text-gov-navy">{n.sectionType}</span> },
              { key: 'gazetteNumber', header: 'Gazette Reference No.', sortable: true, render: (n) => <span className="font-mono text-xs">{n.gazetteNumber}</span> },
              { key: 'publicationDate', header: 'Publication Date', sortable: true },
              { key: 'expiryDate', header: 'Objection Expiry', sortable: true },
              { key: 'parcelsAffectedCount', header: 'Parcels Affected', align: 'center', render: (n) => <span>{n.parcelsAffectedCount}</span> },
              { key: 'status', header: 'Status', sortable: true, align: 'center', render: (n) => <StatusBadge status={n.status} size="sm" /> },
            ]}
            data={projectNotifs}
            title={`Statutory Gazette Notifications (${projectNotifs.length})`}
            subtitle="Gazette notifications published under Section 4, 6, 11 & 19"
          />
        )}

        {/* TAB 5: OBJECTIONS */}
        {activeTab === 'objections' && (
          <DataTable
            columns={[
              { key: 'surveyNumber', header: 'Survey No.', sortable: true, render: (o) => <span className="font-bold text-gov-navy">{o.surveyNumber}</span> },
              { key: 'applicantName', header: 'Applicant Name', sortable: true },
              { key: 'grounds', header: 'Grounds of Objection', sortable: true },
              { key: 'hearingDate', header: 'Hearing Date', sortable: true },
              { key: 'decision', header: 'Collector Order', sortable: true },
              { key: 'status', header: 'Status', sortable: true, align: 'center', render: (o) => <StatusBadge status={o.status} size="sm" /> },
            ]}
            data={projectObjections}
            title={`Section 15 Objections & Hearings (${projectObjections.length})`}
            subtitle="Public claims and objection hearings conducted before CALA"
          />
        )}

        {/* TAB 6: AWARDS */}
        {activeTab === 'awards' && (
          <DataTable
            columns={[
              { key: 'awardNumber', header: 'Award Reference No.', sortable: true, render: (a) => <span className="font-mono font-bold text-gov-navy">{a.awardNumber}</span> },
              { key: 'surveyNumber', header: 'Survey No.', sortable: true },
              { key: 'ownerName', header: 'Owner Name', sortable: true },
              { key: 'marketValue', header: 'Market Value (₹L)', sortable: true, align: 'right', render: (a) => <span>₹{a.marketValue}</span> },
              { key: 'solatium100Percent', header: 'Solatium 100% (₹L)', sortable: true, align: 'right', render: (a) => <span>₹{a.solatium100Percent}</span> },
              { key: 'totalAwardAmount', header: 'Total Award (₹L)', sortable: true, align: 'right', render: (a) => <span className="font-bold text-emerald-800">₹{a.totalAwardAmount}</span> },
              { key: 'collectorApprovalStatus', header: 'Approval Status', sortable: true, align: 'center', render: (a) => <StatusBadge status={a.collectorApprovalStatus} size="sm" /> },
            ]}
            data={projectAwards}
            title={`Statutory Awards Declared (${projectAwards.length})`}
            subtitle="Determinations under Section 23/30 with 100% solatium & asset valuations"
          />
        )}

        {/* TAB 7: COMPENSATION */}
        {activeTab === 'compensation' && (
          <DataTable
            columns={[
              { key: 'surveyNumber', header: 'Survey No.', sortable: true },
              { key: 'beneficiaryName', header: 'Beneficiary Name', sortable: true, render: (c) => <span className="font-semibold text-gov-gray-900">{c.beneficiaryName}</span> },
              { key: 'bankName', header: 'Bank & IFSC', sortable: true, render: (c) => <div><div>{c.bankName}</div><div className="font-mono text-[10px] text-gov-gray-500">{c.ifscCode}</div></div> },
              { key: 'amountApproved', header: 'Approved (₹L)', sortable: true, align: 'right', render: (c) => <span>₹{c.amountApproved}</span> },
              { key: 'amountDisbursed', header: 'Disbursed (₹L)', sortable: true, align: 'right', render: (c) => <span className="font-bold text-emerald-800">₹{c.amountDisbursed}</span> },
              { key: 'disbursementMode', header: 'Payment Mode', sortable: true },
              { key: 'status', header: 'Status', sortable: true, align: 'center', render: (c) => <StatusBadge status={c.status} size="sm" /> },
            ]}
            data={projectCompensation}
            title={`Direct Benefit Transfer Compensation (${projectCompensation.length})`}
            subtitle="Payment disbursements through PFMS e-Kuber gateway"
          />
        )}

        {/* TAB 8: R&R */}
        {activeTab === 'randr' && (
          <DataTable
            columns={[
              { key: 'headOfFamily', header: 'Head of Family', sortable: true, render: (r) => <span className="font-bold text-gov-navy">{r.headOfFamily}</span> },
              { key: 'village', header: 'Village', sortable: true },
              { key: 'housingOption', header: 'Housing Entitlement', sortable: true },
              { key: 'housingStatus', header: 'Housing Status', sortable: true, align: 'center', render: (r) => <StatusBadge status={r.housingStatus} size="sm" /> },
              { key: 'annuityOrJobOption', header: 'Livelihood Benefit', sortable: true },
              { key: 'relocationStatus', header: 'Relocation Status', sortable: true, align: 'center', render: (r) => <StatusBadge status={r.relocationStatus} size="sm" /> },
            ]}
            data={projectRR}
            title={`Resettlement & Rehabilitation Entitlements (${projectRR.length})`}
            subtitle="Housing, subsistence grants & annuity allotments under Section 31"
          />
        )}

        {/* TAB 9: POSSESSION */}
        {activeTab === 'possession' && (
          <DataTable
            columns={[
              { key: 'panchnamaNumber', header: 'Panchnama Ref No.', sortable: true, render: (p) => <span className="font-mono font-bold text-gov-navy">{p.panchnamaNumber}</span> },
              { key: 'surveyNumber', header: 'Survey No.', sortable: true },
              { key: 'village', header: 'Village', sortable: true },
              { key: 'areaPossessedHa', header: 'Area (Ha)', sortable: true, align: 'right', render: (p) => <span>{p.areaPossessedHa} Ha</span> },
              { key: 'possessionDate', header: 'Handover Date', sortable: true },
              { key: 'handoverOfficer', header: 'Revenue Officer', sortable: true },
              { key: 'status', header: 'Status', sortable: true, align: 'center', render: (p) => <StatusBadge status={p.status} size="sm" /> },
            ]}
            data={projectPossession}
            title={`Physical Possession Records (${projectPossession.length})`}
            subtitle="Formal site handovers executed under Section 16/17"
          />
        )}

        {/* TAB 10: DOCUMENTS */}
        {activeTab === 'documents' && (
          <DataTable
            columns={[
              { key: 'title', header: 'Document Title', sortable: true, render: (d) => <span className="font-semibold text-gov-navy">{d.title}</span> },
              { key: 'category', header: 'Category', sortable: true },
              { key: 'version', header: 'Version', sortable: true, render: (d) => <span className="font-mono text-xs">{d.version}</span> },
              { key: 'fileSizeMb', header: 'Size', sortable: true, align: 'right', render: (d) => <span>{d.fileSizeMb} MB</span> },
              { key: 'uploadedBy', header: 'Uploaded By', sortable: true },
              { key: 'verificationStatus', header: 'Status', sortable: true, align: 'center', render: (d) => <StatusBadge status={d.verificationStatus} size="sm" /> },
            ]}
            data={projectDocuments}
            title={`Project Document Repository (${projectDocuments.length})`}
            subtitle="Gazette orders, RoR records, Panchnama and valuation files"
          />
        )}
      </div>
    </div>
  );
};
