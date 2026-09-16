import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { WorkflowTimeline } from '../components/common/WorkflowTimeline';
import { StatusBadge } from '../components/common/StatusBadge';
import { ArrowLeft, MapPin, Building2, Calendar, FileText, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    apiFetch<any>(`/projects/${id}`)
      .then(res => {
        if (res.success && res.data) {
          setProject(res.data);
        }
      })
      .catch(err => console.error('Failed to load project details:', err))
      .finally(() => setIsLoading(false));
  }, [id]);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'parcels', label: 'Land Parcels' },
    { id: 'workflow', label: 'Acquisition Workflow' },
    { id: 'notifications', label: 'Notifications (Sec 11/19)' },
    { id: 'awards', label: 'Awards (Sec 23/30)' },
    { id: 'compensation', label: 'Compensation' },
    { id: 'randr', label: 'R&R Package' },
    { id: 'possession', label: 'Possession' },
    { id: 'documents', label: 'Documents' },
    { id: 'audit', label: 'Audit Trail' },
  ];

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500">
        <div className="inline-block w-6 h-6 border-2 border-gov-navy-800 border-t-transparent rounded-full animate-spin mb-2" />
        <p className="text-xs">Loading official project records...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-white p-6 rounded border border-slate-200 text-center">
        <p className="text-sm font-semibold text-slate-800">Project Not Found</p>
        <Link to="/projects" className="text-xs text-gov-navy-800 underline mt-2 inline-block">
          Return to Project Register
        </Link>
      </div>
    );
  }

  const generateGazette = () => {
    if (!project) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('GAZETTE OF INDIA - EXTRAORDINARY', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('PART II—Section 3—Sub-section (ii)', 105, 28, { align: 'center' });
    doc.setFontSize(14);
    doc.text('MINISTRY OF ROAD TRANSPORT AND HIGHWAYS', 105, 40, { align: 'center' });
    doc.setFontSize(12);
    doc.text('NOTIFICATION', 105, 50, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`New Delhi, the ${new Date().toLocaleDateString()}`, 150, 60);
    
    const text = `S.O. (E).— In exercise of the powers conferred by sub-section (1) of section 11 of the Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (30 of 2013), the Central Government hereby notifies that the land specified in the Schedule below is required for the public purpose, namely, for the development of ${project.projectName} in the State of ${project.state}, District ${project.district}.`;
    
    const splitText = doc.splitTextToSize(text, 170);
    doc.text(splitText, 20, 75);
    
    doc.setFontSize(12);
    doc.text('SCHEDULE', 105, 120, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Total Land Required: ${project.totalLandRequiredHectares} Hectares`, 20, 130);
    doc.text(`Total Parcels: ${project.totalParcels}`, 20, 140);
    doc.text(`Acquiring Authority: ${project.acquiringAuthority}`, 20, 150);
    
    doc.text('[Digitally Generated via BHOOMISETU]', 20, 270);
    
    doc.save(`Gazette_Sec11_${project.projectCode}.pdf`);
  };

  return (
    <div className="space-y-4">
      {/* Top Breadcrumb & Back */}
      <div className="flex items-center justify-between">
        <Link
          to="/projects"
          className="flex items-center space-x-1 text-xs text-slate-600 hover:text-gov-navy-800 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </Link>
        <button
          onClick={generateGazette}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-[#0B3559] text-white rounded hover:bg-[#071E3D] transition-colors"
        >
          <Download className="w-3.5 h-3.5" /> Generate Sec 11 Gazette
        </button>
      </div>

      {/* Project Header Card */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-gov-navy-800 bg-gov-navy-50 px-2 py-0.5 rounded border border-gov-navy-200">
                {project.projectCode}
              </span>
              <StatusBadge status={project.status} />
            </div>
            <h1 className="text-lg font-bold text-slate-900 mt-1">{project.projectName}</h1>
            <p className="text-xs text-slate-600 mt-0.5">{project.description}</p>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-slate-600">
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{project.state}, {project.district}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-800">{project.acquiringAuthority}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Target: {project.targetCompletionDate}</span>
            </div>
          </div>
        </div>

        {/* Workflow Timeline / Milestone Tracker */}
        <div className="mt-4">
          <div className="w-full bg-white p-4 border border-slate-200 rounded shadow-sm">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
              Project Milestone Tracker (Statutory Timelines)
            </h4>
            <div className="flex flex-col space-y-3">
              {[
                { name: 'Proposal / Sec 4', target: '2 Months', actual: 'Completed', status: 'ON_TRACK', pct: '100%' },
                { name: 'Field Survey', target: '1 Month', actual: 'Completed', status: 'ON_TRACK', pct: '100%' },
                { name: 'Notification / Sec 11', target: '2 Months', actual: 'Completed', status: 'ON_TRACK', pct: '100%' },
                { name: 'Objections / Sec 15', target: '2 Months', actual: 'Completed', status: 'ON_TRACK', pct: '100%' },
                { name: 'Award / Sec 23', target: '6 Months', actual: 'In Progress', status: 'ON_TRACK', pct: '60%' },
                { name: 'Compensation', target: '3 Months', actual: 'Pending', status: 'PENDING', pct: '0%' },
                { name: 'R&R Execution', target: '6 Months', actual: 'Pending', status: 'PENDING', pct: '0%' },
                { name: 'Possession / Sec 38', target: '1 Month', actual: 'Pending', status: 'PENDING', pct: '0%' },
              ].map((stage, idx) => (
                <div key={idx} className="flex items-center text-xs group">
                  <div className="w-40 font-semibold text-slate-700 group-hover:text-gov-navy-800 transition-colors">{stage.name}</div>
                  <div className="flex-1 flex items-center space-x-2">
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex border border-slate-200">
                      <div className={`h-full transition-all duration-500 ${stage.status === 'ON_TRACK' ? 'bg-emerald-500' : stage.status === 'DELAYED' ? 'bg-red-500' : stage.status === 'PENDING' ? 'bg-slate-300' : 'bg-amber-500'}`} style={{ width: stage.pct }}></div>
                    </div>
                  </div>
                  <div className="w-32 text-right text-[10px] text-slate-500 font-mono">
                    Tgt: {stage.target} | Act: {stage.actual}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-gov-navy-800 text-gov-navy-800 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-2">
                <span className="font-bold text-slate-700 block">Land Requirement & Progress</span>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Total Required:</span>
                  <span className="font-mono font-bold">{project.totalLandRequiredHectares} Ha</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Acquired / Demarcated:</span>
                  <span className="font-mono font-bold text-emerald-700">{project.totalLandAcquiredHectares} Ha</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Total Survey Parcels:</span>
                  <span className="font-mono font-bold">{project.totalParcels} (Verified: {project.verifiedParcels})</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-2">
                <span className="font-bold text-slate-700 block">Financial & Compensation Status</span>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Compensation Assessed:</span>
                  <span className="font-mono font-bold">₹{project.compensationAssessedCr} Cr</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Disbursed (PFMS):</span>
                  <span className="font-mono font-bold text-emerald-700">₹{project.compensationDisbursedCr} Cr</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Disbursal Ratio:</span>
                  <span className="font-mono font-bold">
                    {project.compensationAssessedCr ? `${((project.compensationDisbursedCr / project.compensationAssessedCr) * 100).toFixed(1)}%` : '0%'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-2">
                <span className="font-bold text-slate-700 block">R&R & Affected Families</span>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Total Affected Families:</span>
                  <span className="font-mono font-bold">{project.totalAffectedFamilies}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Rehabilitated / Resettled:</span>
                  <span className="font-mono font-bold text-emerald-700">{project.rehabilitatedFamilies}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Statutory Notice Date:</span>
                  <span className="font-mono font-bold">{project.notificationDate || 'Pending'}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'overview' && (
            <div className="p-8 text-center bg-slate-50 rounded border border-dashed border-slate-300 text-slate-500">
              <FileText className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="font-semibold text-slate-700">Module Scaffolding Active: {tabs.find(t => t.id === activeTab)?.label}</p>
              <p className="text-xs text-slate-400 mt-1">This workspace tab is scaffolded and will be enhanced in subsequent build phases.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
