import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';

// Direct Page Imports
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
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
import { PossessionPage } from './pages/PossessionPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { ReportsPage } from './pages/ReportsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AlertsPage } from './pages/AlertsPage';
import { AuditTrail } from './pages/AuditTrail';
import { AdministrationPage } from './pages/AdministrationPage';
import { FieldVerificationPage } from './pages/FieldVerificationPage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/parcels" element={<LandParcels />} />
            <Route path="/workflow" element={<AcquisitionWorkflowPage />} />
            <Route path="/gis-map" element={<GISMapPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/awards" element={<AwardsPage />} />
            <Route path="/compensation" element={<CompensationPage />} />
            <Route path="/affected-families" element={<AffectedFamiliesPage />} />
            <Route path="/randr" element={<RRBenefitsPage />} />
            <Route path="/possession" element={<PossessionPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/audit-trail" element={<AuditTrail />} />
            <Route path="/admin" element={<AdministrationPage />} />
            <Route path="/field-verification" element={<FieldVerificationPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
