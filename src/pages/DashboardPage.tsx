import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { StatisticsPanel } from '../components/common/StatisticsPanel';
import { StatusBadge } from '../components/common/StatusBadge';
import { GovernmentAlertBanner } from '../components/common/GovernmentAlertBanner';
import { 
  FolderKanban, MapPin, Banknote, Users, 
  Clock, AlertTriangle, ShieldCheck, TrendingUp, 
  CheckCircle2, ArrowRight, BarChart2, PieChart as PieIcon, Map 
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (module: string, projectId?: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { 
    currentUser, projects, parcels, compensationRecords, 
    families, rrBenefits, possessionRecords, alerts, t 
  } = useApp();

  const [filterState, setFilterState] = useState<string>('ALL');
  const [filterSector, setFilterSector] = useState<string>('ALL');

  // Filtered dataset
  const filteredProjects = projects.filter(p => {
    if (filterState !== 'ALL' && p.state !== filterState) return false;
    if (filterSector !== 'ALL' && p.sector !== filterSector) return false;
    return true;
  });

  // Calculate high-level metrics
  const totalProjectsCount = filteredProjects.length;
  const totalLandRequired = filteredProjects.reduce((acc, p) => acc + p.landRequiredHa, 0);
  const totalLandAcquired = filteredProjects.reduce((acc, p) => acc + p.landAcquiredHa, 0);
  const acquisitionPercentage = totalLandRequired > 0 ? ((totalLandAcquired / totalLandRequired) * 100).toFixed(1) : '0';

  const pendingVerificationCount = parcels.filter(p => p.verificationStatus === 'Pending' || p.verificationStatus === 'In Progress').length;
  const totalAssessedComp = compensationRecords.reduce((acc, c) => acc + c.amountAssessed, 0);
  const totalDisbursedComp = compensationRecords.reduce((acc, c) => acc + c.amountDisbursed, 0);

  const totalFamiliesAffected = families.length;
  const totalFamiliesRehabilitated = rrBenefits.filter(r => r.relocationStatus === 'Relocation Completed').length;
  const totalPossessionCount = possessionRecords.filter(p => p.status === 'Possession Completed').length;
  const delayedProjectsCount = filteredProjects.filter(p => p.status === 'Delayed' || p.status === 'At Risk').length;

  const topCriticalAlert = alerts.find(a => a.severity === 'Critical' && !a.isRead);

  return (
    <div className="space-y-4">
      {/* Breadcrumb & Title */}
      <div>
        <Breadcrumbs items={[{ label: t('dashboard') }]} />
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gov-gray-300 pb-3">
          <div>
            <h2 className="text-xl font-bold text-gov-navy font-serif tracking-tight">
              {t('subTitle')} &mdash; {t('dashboard')}
            </h2>
            <p className="text-xs text-gov-gray-600">
              Integrated real-time statutory monitoring across Central Ministries, State Revenue Departments & Acquiring Authorities
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <label className="flex items-center gap-1 text-xs text-gov-gray-700 bg-white px-2 py-1 border border-gov-gray-300 rounded shadow-2xs">
              <span className="font-semibold text-gov-navy">State:</span>
              <select
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                className="text-xs bg-transparent focus:outline-none"
              >
                <option value="ALL">All States (National)</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Telangana">Telangana</option>
                <option value="Odisha">Odisha</option>
                <option value="Gujarat">Gujarat</option>
              </select>
            </label>

            <label className="flex items-center gap-1 text-xs text-gov-gray-700 bg-white px-2 py-1 border border-gov-gray-300 rounded shadow-2xs">
              <span className="font-semibold text-gov-navy">Sector:</span>
              <select
                value={filterSector}
                onChange={(e) => setFilterSector(e.target.value)}
                className="text-xs bg-transparent focus:outline-none"
              >
                <option value="ALL">All Sectors</option>
                <option value="Highways">Highways</option>
                <option value="Railways">Railways</option>
                <option value="Renewable Energy">Renewable Energy</option>
                <option value="Industrial Corridors">Industrial Corridors</option>
                <option value="Urban Transit">Urban Transit</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* Critical Alert Banner if any */}
      {topCriticalAlert && (
        <GovernmentAlertBanner
          type="critical"
          title={topCriticalAlert.title}
          message={topCriticalAlert.message}
          actionText="Review & Take Statutory Action"
          onAction={() => onNavigate('alerts')}
        />
      )}

      {/* 1. Compact High-Density Statistics Panel (8 Core KPIs) */}
      <StatisticsPanel
        metrics={[
          {
            label: t('totalProjects'),
            value: totalProjectsCount,
            subtext: `${filterState === 'ALL' ? 'Across 5 States' : filterState}`,
            icon: FolderKanban,
            onClick: () => onNavigate('projects'),
          },
          {
            label: t('landRequired'),
            value: `${totalLandRequired.toFixed(0)} Ha`,
            subtext: 'Statutory Target',
            icon: MapPin,
          },
          {
            label: t('landAcquired'),
            value: `${totalLandAcquired.toFixed(0)} Ha`,
            subtext: `${acquisitionPercentage}% Completed`,
            icon: ShieldCheck,
            variant: 'success',
            onClick: () => onNavigate('gis-map'),
          },
          {
            label: t('pendingVerification'),
            value: pendingVerificationCount,
            subtext: 'Parcels in Field',
            icon: Clock,
            variant: pendingVerificationCount > 0 ? 'warning' : 'default',
            onClick: () => onNavigate('parcels'),
          },
          {
            label: t('compDisbursed'),
            value: `₹${(totalDisbursedComp / 100).toFixed(1)} Cr`,
            subtext: `of ₹${(totalAssessedComp / 100).toFixed(1)} Cr Assessed`,
            icon: Banknote,
            variant: 'info',
            onClick: () => onNavigate('compensation'),
          },
          {
            label: t('familiesRehab'),
            value: `${totalFamiliesRehabilitated}/${totalFamiliesAffected}`,
            subtext: 'R&R Relocated',
            icon: Users,
            variant: 'success',
            onClick: () => onNavigate('randr'),
          },
          {
            label: t('possessionExecuted'),
            value: totalPossessionCount,
            subtext: 'Panchnama Done',
            icon: CheckCircle2,
            variant: 'success',
            onClick: () => onNavigate('possession'),
          },
          {
            label: t('delayedAtRisk'),
            value: delayedProjectsCount,
            subtext: 'Escalation Alert',
            icon: AlertTriangle,
            variant: delayedProjectsCount > 0 ? 'danger' : 'default',
            onClick: () => onNavigate('analytics'),
          },
        ]}
      />

      {/* 2. Visual Analytics Section (Grid of 4 Clean Government Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Visual 1: Project Lifecycle Funnel Progression */}
        <div className="bg-white border border-gov-gray-300 rounded p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-gov-gray-200">
            <div>
              <h4 className="text-xs font-bold text-gov-navy uppercase tracking-wider font-serif flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Statutory Lifecycle Funnel (All Projects)</span>
              </h4>
              <p className="text-[11px] text-gov-gray-600">Distribution of projects across the 10 RFCTLARR statutory milestones</p>
            </div>
            <button 
              onClick={() => onNavigate('workflow')}
              className="text-xs text-gov-navy hover:underline font-semibold"
            >
              View Workflow &rarr;
            </button>
          </div>

          <div className="py-3 space-y-2 text-xs">
            {[
              { stage: '1-3: Identification & Field Verification', count: projects.filter(p => p.currentStage <= 3).length, color: 'bg-slate-400' },
              { stage: '4-5: Sec 11 Notification & Sec 15 Objections', count: projects.filter(p => p.currentStage === 4 || p.currentStage === 5).length, color: 'bg-amber-500' },
              { stage: '6-7: Sec 23 Awards & Compensation DBT', count: projects.filter(p => p.currentStage === 6 || p.currentStage === 7).length, color: 'bg-blue-600' },
              { stage: '8-9: R&R Colony & Sec 16 Possession', count: projects.filter(p => p.currentStage === 8 || p.currentStage === 9).length, color: 'bg-emerald-600' },
              { stage: '10: Project Closure & Encumbrance Free', count: projects.filter(p => p.currentStage === 10).length, color: 'bg-emerald-800' },
            ].map((f, idx) => {
              const pct = ((f.count / projects.length) * 100).toFixed(0);
              return (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-medium text-gov-gray-800">{f.stage}</span>
                    <span className="font-bold text-gov-navy">{f.count} Projects ({pct}%)</span>
                  </div>
                  <div className="h-2.5 w-full bg-gov-gray-100 rounded overflow-hidden border border-gov-gray-200">
                    <div className={`h-full ${f.color}`} style={{ width: `${Math.max(5, +pct)}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-gov-gray-200 flex items-center justify-between text-[11px] text-gov-gray-500">
            <span>Average statutory turnaround: <strong>14.2 Months</strong></span>
            <span className="text-emerald-700 font-medium">Within Act Limit</span>
          </div>
        </div>

        {/* Visual 2: State-wise Land Acquisition Progress */}
        <div className="bg-white border border-gov-gray-300 rounded p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-gov-gray-200">
            <div>
              <h4 className="text-xs font-bold text-gov-navy uppercase tracking-wider font-serif flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5" />
                <span>State-Wise Land Acquisition Progress (Hectares)</span>
              </h4>
              <p className="text-[11px] text-gov-gray-600">Comparison of proposed vs physically acquired land area</p>
            </div>
            <button 
              onClick={() => onNavigate('gis-map')}
              className="text-xs text-gov-navy hover:underline font-semibold"
            >
              Open GIS Map &rarr;
            </button>
          </div>

          <div className="py-3 space-y-2 text-xs">
            {[
              { state: 'Maharashtra', req: 545.0, acq: 420.4 },
              { state: 'Uttar Pradesh', req: 595.8, acq: 325.9 },
              { state: 'Telangana', req: 1000.0, acq: 790.0 },
              { state: 'Odisha', req: 1140.0, acq: 860.0 },
              { state: 'Gujarat', req: 410.0, acq: 390.0 },
            ].map((s, idx) => {
              const pct = ((s.acq / s.req) * 100).toFixed(0);
              return (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-semibold text-gov-navy">{s.state}</span>
                    <span className="text-gov-gray-700">
                      <strong>{s.acq} Ha</strong> of {s.req} Ha ({pct}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-gov-gray-100 rounded overflow-hidden border border-gov-gray-200 flex">
                    <div className="h-full bg-emerald-600" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-gov-gray-200 flex items-center justify-between text-[11px] text-gov-gray-500">
            <span>Highest efficiency: <strong>Gujarat (95.1%)</strong></span>
            <span>Focus state: <strong>Uttar Pradesh (54.7%)</strong></span>
          </div>
        </div>
      </div>

      {/* 3. Financial & R&R Metrics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Compensation Disbursement Breakdown */}
        <div className="bg-white border border-gov-gray-300 rounded p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gov-gray-200">
            <h4 className="text-xs font-bold text-gov-navy uppercase tracking-wider font-serif">
              Compensation Breakdown (PFMS)
            </h4>
            <button 
              onClick={() => onNavigate('compensation')}
              className="text-xs text-gov-navy hover:underline font-semibold"
            >
              Details &rarr;
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2 bg-emerald-50 rounded border border-emerald-200">
              <span className="font-medium text-emerald-950">Direct Benefit Transfer (Paid):</span>
              <span className="font-bold text-emerald-800">₹{totalDisbursedComp.toFixed(2)} Lakhs</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-amber-50 rounded border border-amber-200">
              <span className="font-medium text-amber-950">Pending Approval by Collector:</span>
              <span className="font-bold text-amber-800">₹830.96 Lakhs</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-red-50 rounded border border-red-200">
              <span className="font-medium text-red-950">Deposited in Civil Court Escrow (Sec 76):</span>
              <span className="font-bold text-red-800">₹680.50 Lakhs</span>
            </div>
          </div>
        </div>

        {/* Resettlement & Rehabilitation Tracking */}
        <div className="bg-white border border-gov-gray-300 rounded p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gov-gray-200">
            <h4 className="text-xs font-bold text-gov-navy uppercase tracking-wider font-serif">
              R&R Entitlement Status (Sec 31)
            </h4>
            <button 
              onClick={() => onNavigate('randr')}
              className="text-xs text-gov-navy hover:underline font-semibold"
            >
              Details &rarr;
            </button>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between py-1 border-b border-gov-gray-100">
              <span className="text-gov-gray-600">Total Affected Families Identified:</span>
              <span className="font-bold text-gov-navy">{families.length} Families</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gov-gray-100">
              <span className="text-gov-gray-600">Physically Displaced:</span>
              <span className="font-semibold text-amber-800">
                {families.filter(f => f.isDisplaced).length} Families
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-gov-gray-100">
              <span className="text-gov-gray-600">Housing Units Allotted in R&R Colony:</span>
              <span className="font-semibold text-emerald-800">
                {rrBenefits.filter(r => r.housingStatus === 'Allotted').length} Units
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gov-gray-600">Subsistence & Skill Grants Cleared:</span>
              <span className="font-bold text-emerald-700">100% Compliant</span>
            </div>
          </div>
        </div>

        {/* Schedule & Statutory Adherence */}
        <div className="bg-white border border-gov-gray-300 rounded p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gov-gray-200">
            <h4 className="text-xs font-bold text-gov-navy uppercase tracking-wider font-serif">
              Timeline Adherence & Risk Index
            </h4>
            <button 
              onClick={() => onNavigate('analytics')}
              className="text-xs text-gov-navy hover:underline font-semibold"
            >
              Analytics &rarr;
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gov-gray-600">On Track Projects:</span>
              <span className="font-bold text-emerald-700">{projects.filter(p => p.status === 'On Track').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gov-gray-600">At Risk Projects:</span>
              <span className="font-bold text-amber-700">{projects.filter(p => p.status === 'At Risk').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gov-gray-600">Delayed Projects:</span>
              <span className="font-bold text-red-700">{projects.filter(p => p.status === 'Delayed').length}</span>
            </div>
            <div className="p-2 bg-blue-50 rounded border border-blue-200 text-[11px] text-blue-900 leading-tight">
              <strong>Statutory Compliance:</strong> Zero projects currently have lapsed Section 19(1) statutory periods.
            </div>
          </div>
        </div>
      </div>

      {/* 4. Priority Infrastructure Projects Table */}
      <div className="bg-white border border-gov-gray-300 rounded p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-gov-gray-200 pb-2">
          <div>
            <h3 className="text-sm font-bold text-gov-navy font-serif">
              Priority Infrastructure Land Acquisition Projects
            </h3>
            <p className="text-xs text-gov-gray-600">
              National master projects monitored under PM Gati Shakti & Ministry Dashboards
            </p>
          </div>
          <button
            onClick={() => onNavigate('projects')}
            className="px-3 py-1.5 bg-gov-navy text-white text-xs font-semibold rounded hover:bg-gov-navy-hover flex items-center gap-1"
          >
            <span>View All {projects.length} Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-gov-gray-100 text-gov-gray-800 border-b border-gov-gray-300 font-semibold">
              <tr>
                <th className="px-3 py-2 border-r border-gov-gray-200">Project Code & Name</th>
                <th className="px-3 py-2 border-r border-gov-gray-200">State / District</th>
                <th className="px-3 py-2 border-r border-gov-gray-200">Authority</th>
                <th className="px-3 py-2 border-r border-gov-gray-200 text-right">Required (Ha)</th>
                <th className="px-3 py-2 border-r border-gov-gray-200 text-right">Acquired (Ha)</th>
                <th className="px-3 py-2 border-r border-gov-gray-200 text-center">Stage</th>
                <th className="px-3 py-2 border-r border-gov-gray-200 text-center">Status</th>
                <th className="px-3 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gov-gray-200">
              {filteredProjects.slice(0, 5).map((p) => {
                const progressPct = ((p.landAcquiredHa / p.landRequiredHa) * 100).toFixed(0);
                return (
                  <tr key={p.id} className="hover:bg-blue-50/40">
                    <td className="px-3 py-2.5 font-medium border-r border-gov-gray-200">
                      <div className="font-semibold text-gov-navy">{p.name}</div>
                      <div className="text-[10px] text-gov-gray-500 font-mono">{p.code}</div>
                    </td>
                    <td className="px-3 py-2.5 border-r border-gov-gray-200">
                      {p.district}, {p.state}
                    </td>
                    <td className="px-3 py-2.5 border-r border-gov-gray-200 text-gov-gray-700">
                      {p.acquiringAuthority}
                    </td>
                    <td className="px-3 py-2.5 border-r border-gov-gray-200 text-right font-medium">
                      {p.landRequiredHa}
                    </td>
                    <td className="px-3 py-2.5 border-r border-gov-gray-200 text-right font-bold text-emerald-800">
                      {p.landAcquiredHa} <span className="text-[10px] text-gov-gray-500">({progressPct}%)</span>
                    </td>
                    <td className="px-3 py-2.5 border-r border-gov-gray-200 text-center">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-medium text-[11px]">
                        Stage {p.currentStage}/10
                      </span>
                    </td>
                    <td className="px-3 py-2.5 border-r border-gov-gray-200 text-center">
                      <StatusBadge status={p.status} size="sm" />
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <button
                        onClick={() => onNavigate('project-details', p.id)}
                        className="px-2.5 py-1 text-xs bg-gov-navy text-white rounded font-medium hover:bg-gov-navy-hover"
                      >
                        Deep Dive
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
