import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { RoleGuard } from './components/common/RoleGuard';

// Direct Page Imports
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ProposalsPage } from './pages/ProposalsPage';
import { NewProposalWizard } from './components/proposals/NewProposalWizard';
import { Projects } from './pages/Projects';
import { ProjectDetails } from './pages/ProjectDetails';
import { LandParcels } from './pages/LandParcels';
import { AcquisitionWorkflowPage } from './pages/AcquisitionWorkflowPage';
import { GISMapPage } from './pages/GISMapPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AwardsPage } from './pages/AwardsPage';
import { CompensationPage } from './pages/CompensationPage';
import { AffectedFamiliesPage } from './pages/AffectedFamiliesPage';
import { RRBenefitsPage } from './pages/RRBenefitsPage';
import { SIAPage } from './pages/SIAPage';
import { GrievancesPage } from './pages/GrievancesPage';
import { Sec15HearingsPage } from './pages/Sec15HearingsPage';
import { PossessionPage } from './pages/PossessionPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { ReportsPage } from './pages/ReportsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AlertsPage } from './pages/AlertsPage';
import { AuditTrail } from './pages/AuditTrail';
import { AdministrationPage } from './pages/AdministrationPage';
import { FieldVerificationPage } from './pages/FieldVerificationPage';
import { CitizenDashboard } from './components/dashboards/CitizenDashboard';
import { useAuth } from './context/AuthContext';
import { LogOut } from 'lucide-react';
import { ErrorBoundary } from './components/common/ErrorBoundary';

function CitizenViewPage() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-[#0B3559] text-white px-4 sm:px-6 py-3 flex justify-between items-center shadow-md border-b-2 border-amber-500">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-amber-500 text-[#0B3559] font-black font-serif flex items-center justify-center text-lg shadow-sm">
            B
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold font-serif tracking-tight text-white">BHOOMISETU</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded font-semibold uppercase">
                CITIZEN PORTAL
              </span>
            </div>
            <p className="text-[11px] text-slate-300">RFCTLARR Landowner Transparency &amp; Compensation Tracking</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-semibold text-white">{user?.fullName || 'Shri Tukaram S. Gaikwad'}</span>
            <span className="text-[10px] font-mono text-amber-300">Aadhaar Verified Landowner</span>
          </div>
          <button
            onClick={logout}
            className="px-3 py-1.5 bg-white/10 hover:bg-rose-600/80 text-white rounded text-xs font-semibold flex items-center space-x-1.5 border border-white/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6">
        <CitizenDashboard />
      </main>

      <footer className="bg-slate-800 text-slate-400 text-[11px] py-3 text-center border-t border-slate-700">
        Bhoomisetu National Land Acquisition Portal • Government of India • Ministry of Road Transport &amp; Highways
      </footer>
    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/citizen"
              element={
                <RoleGuard allowedRoles={['CITIZEN']}>
                  <CitizenViewPage />
                </RoleGuard>
              }
            />

            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              
              <Route
                path="/proposals"
                element={
                  <RoleGuard allowedRoles={['CENTRAL_MINISTRY', 'STATE_AUTHORITY', 'DISTRICT_AUTHORITY', 'LAND_ACQUIRING_AUTHORITY', 'EXECUTIVE_VIEWER']}>
                    <ProposalsPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/proposals/new"
                element={
                  <RoleGuard allowedRoles={['LAND_ACQUIRING_AUTHORITY', 'STATE_AUTHORITY', 'CENTRAL_MINISTRY']}>
                    <NewProposalWizard />
                  </RoleGuard>
                }
              />
              <Route
                path="/projects"
                element={
                  <RoleGuard allowedRoles={['CENTRAL_MINISTRY', 'STATE_AUTHORITY', 'DISTRICT_AUTHORITY', 'LAND_ACQUIRING_AUTHORITY', 'EXECUTIVE_VIEWER']}>
                    <Projects />
                  </RoleGuard>
                }
              />
              <Route
                path="/projects/:id"
                element={
                  <RoleGuard allowedRoles={['CENTRAL_MINISTRY', 'STATE_AUTHORITY', 'DISTRICT_AUTHORITY', 'LAND_ACQUIRING_AUTHORITY', 'EXECUTIVE_VIEWER']}>
                    <ProjectDetails />
                  </RoleGuard>
                }
              />
              <Route
                path="/parcels"
                element={
                  <RoleGuard allowedRoles={['DISTRICT_AUTHORITY', 'LAND_ACQUIRING_AUTHORITY', 'FIELD_OFFICER']}>
                    <LandParcels />
                  </RoleGuard>
                }
              />
              <Route
                path="/workflow"
                element={
                  <RoleGuard allowedRoles={['STATE_AUTHORITY', 'LAND_ACQUIRING_AUTHORITY']}>
                    <AcquisitionWorkflowPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/gis-map"
                element={
                  <RoleGuard allowedRoles={['FIELD_OFFICER', 'LAND_ACQUIRING_AUTHORITY', 'DISTRICT_AUTHORITY', 'STATE_AUTHORITY', 'CENTRAL_MINISTRY']}>
                    <GISMapPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/notifications"
                element={
                  <RoleGuard allowedRoles={['LAND_ACQUIRING_AUTHORITY']}>
                    <NotificationsPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/awards"
                element={
                  <RoleGuard allowedRoles={['LAND_ACQUIRING_AUTHORITY']}>
                    <AwardsPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/compensation"
                element={
                  <RoleGuard allowedRoles={['DISTRICT_AUTHORITY', 'LAND_ACQUIRING_AUTHORITY']}>
                    <CompensationPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/affected-families"
                element={
                  <RoleGuard allowedRoles={['DISTRICT_AUTHORITY', 'LAND_ACQUIRING_AUTHORITY']}>
                    <AffectedFamiliesPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/randr"
                element={
                  <RoleGuard allowedRoles={['LAND_ACQUIRING_AUTHORITY']}>
                    <RRBenefitsPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/sia"
                element={
                  <RoleGuard allowedRoles={['LAND_ACQUIRING_AUTHORITY']}>
                    <SIAPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/grievances"
                element={
                  <RoleGuard allowedRoles={['DISTRICT_AUTHORITY', 'LAND_ACQUIRING_AUTHORITY']}>
                    <GrievancesPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/hearings"
                element={
                  <RoleGuard allowedRoles={['DISTRICT_AUTHORITY', 'LAND_ACQUIRING_AUTHORITY']}>
                    <Sec15HearingsPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/possession"
                element={
                  <RoleGuard allowedRoles={['LAND_ACQUIRING_AUTHORITY']}>
                    <PossessionPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/documents"
                element={
                  <RoleGuard allowedRoles={['DISTRICT_AUTHORITY', 'LAND_ACQUIRING_AUTHORITY', 'FIELD_OFFICER']}>
                    <DocumentsPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/reports"
                element={
                  <RoleGuard allowedRoles={['CENTRAL_MINISTRY', 'STATE_AUTHORITY', 'EXECUTIVE_VIEWER']}>
                    <ReportsPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/analytics"
                element={
                  <RoleGuard allowedRoles={['CENTRAL_MINISTRY', 'STATE_AUTHORITY', 'EXECUTIVE_VIEWER']}>
                    <AnalyticsPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/alerts"
                element={
                  <RoleGuard allowedRoles={['CENTRAL_MINISTRY', 'STATE_AUTHORITY', 'DISTRICT_AUTHORITY', 'LAND_ACQUIRING_AUTHORITY', 'EXECUTIVE_VIEWER']}>
                    <AlertsPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/audit-trail"
                element={
                  <RoleGuard allowedRoles={['CENTRAL_MINISTRY', 'STATE_AUTHORITY']}>
                    <AuditTrail />
                  </RoleGuard>
                }
              />
              <Route
                path="/admin"
                element={
                  <RoleGuard allowedRoles={['CENTRAL_MINISTRY']}>
                    <AdministrationPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/field-verification"
                element={
                  <RoleGuard allowedRoles={['FIELD_OFFICER', 'LAND_ACQUIRING_AUTHORITY']}>
                    <FieldVerificationPage />
                  </RoleGuard>
                }
              />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
