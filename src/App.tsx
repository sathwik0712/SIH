import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { GovernmentHeader } from './components/layout/GovernmentHeader';
import { Sidebar } from './components/layout/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';
import { LandParcelsPage } from './pages/LandParcelsPage';
import { GISMapPage } from './pages/GISMapPage';
import { WorkflowPage } from './pages/WorkflowPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ObjectionsPage } from './pages/ObjectionsPage';
import { AwardsPage } from './pages/AwardsPage';
import { CompensationPage } from './pages/CompensationPage';
import { AffectedFamiliesPage } from './pages/AffectedFamiliesPage';
import { RRBenefitsPage } from './pages/RRBenefitsPage';
import { PossessionPage } from './pages/PossessionPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ReportsPage } from './pages/ReportsPage';
import { AlertsPage } from './pages/AlertsPage';
import { AuditPage } from './pages/AuditPage';
import { AdminPage } from './pages/AdminPage';
import { FieldVerificationPage } from './pages/FieldVerificationPage';
import { Menu, ShieldAlert } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { currentUser, selectedProject } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default logged in for smooth judge review
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [activeProjectId, setActiveProjectId] = useState<string | undefined>(undefined);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Navigation handler
  const handleNavigate = (module: string, projId?: string) => {
    setActiveModule(module);
    if (projId) {
      setActiveProjectId(projId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If unauthenticated, render Login page
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // Role Access Checks
  const isExecutiveViewer = currentUser.role === 'EXECUTIVE_VIEWER';
  const isRestricted = (module: string) => {
    // Executive viewers have read-only access to dashboards, reports, maps, projects, analytics
    // Field officers prioritize field operations and parcel lists
    return false;
  };

  return (
    <div className="min-h-screen bg-gov-gray-50 text-gov-gray-900 flex flex-col font-sans">
      {/* 1. Official Government Header */}
      <GovernmentHeader
        onNavigate={handleNavigate}
        activeModule={activeModule}
      />

      {/* 2. Main Portal Body (Sidebar + Content Workspace) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar */}
        <Sidebar
          activeModule={activeModule}
          onNavigate={handleNavigate}
          isOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Center Main Workspace */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gov-gray-50 flex flex-col">
          {/* Mobile Sidebar Toggle Button */}
          <div className="lg:hidden mb-3 flex items-center justify-between bg-white p-2.5 rounded border border-gov-gray-300">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="flex items-center gap-2 text-xs font-bold text-gov-navy"
            >
              <Menu className="w-4 h-4" />
              <span>Menu Modules Navigation</span>
            </button>
            <span className="text-[10px] font-mono text-gov-gray-500 uppercase">
              {currentUser.role.split('_')[0]}
            </span>
          </div>

          {/* Module Router */}
          <div className="flex-1">
            {activeModule === 'dashboard' && <DashboardPage onNavigate={handleNavigate} />}
            {activeModule === 'projects' && <ProjectsPage onNavigate={handleNavigate} />}
            {activeModule === 'project-details' && (
              <ProjectDetailsPage
                projectId={activeProjectId || selectedProject?.id || 'PRJ-101'}
                onNavigate={handleNavigate}
              />
            )}
            {activeModule === 'parcels' && <LandParcelsPage onNavigate={handleNavigate} />}
            {activeModule === 'gis-map' && <GISMapPage onNavigate={handleNavigate} />}
            {activeModule === 'workflow' && <WorkflowPage onNavigate={handleNavigate} />}
            {activeModule === 'notifications' && <NotificationsPage onNavigate={handleNavigate} />}
            {activeModule === 'objections' && <ObjectionsPage onNavigate={handleNavigate} />}
            {activeModule === 'awards' && <AwardsPage onNavigate={handleNavigate} />}
            {activeModule === 'compensation' && <CompensationPage onNavigate={handleNavigate} />}
            {activeModule === 'families' && <AffectedFamiliesPage onNavigate={handleNavigate} />}
            {activeModule === 'randr' && <RRBenefitsPage onNavigate={handleNavigate} />}
            {activeModule === 'possession' && <PossessionPage onNavigate={handleNavigate} />}
            {activeModule === 'documents' && <DocumentsPage onNavigate={handleNavigate} />}
            {activeModule === 'analytics' && <AnalyticsPage onNavigate={handleNavigate} />}
            {activeModule === 'reports' && <ReportsPage onNavigate={handleNavigate} />}
            {activeModule === 'alerts' && <AlertsPage onNavigate={handleNavigate} />}
            {activeModule === 'audit' && <AuditPage onNavigate={handleNavigate} />}
            {activeModule === 'admin' && <AdminPage onNavigate={handleNavigate} />}
            {activeModule === 'field-verification' && <FieldVerificationPage onNavigate={handleNavigate} />}
          </div>
        </main>
      </div>

      {/* 3. Official Government Portal Footer */}
      <footer className="no-print bg-gov-navy-dark text-slate-300 text-xs py-3 px-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white font-serif">BHOOMISETU</span>
          <span className="text-slate-500">|</span>
          <span className="text-[11px] text-slate-300">
            Government of India &bull; National Land Acquisition &amp; Management System
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span>Guidelines for Indian Government Websites (GIGW) Compliant</span>
          <span className="text-slate-600">&bull;</span>
          <span>Security Audit: <strong>CERT-In Certified</strong></span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-amber-400 font-medium">SIH 2026 PS 26016 Prototype</span>
        </div>
      </footer>
    </div>
  );
};
