import React from 'react';
import { PlaceholderModule } from '../components/common/PlaceholderModule';
import { BarChart3 } from 'lucide-react';

export const ReportsPage: React.FC = () => (
  <PlaceholderModule
    title="MIS Reports & Official Exports"
    subtitle="National, State, and District level land acquisition MIS analytics and PDF/Excel generation"
    actSection="MIS & Reporting Cell"
    targetPhase="Phase 5 Target"
    icon={BarChart3}
    keyFeatures={[
      'State-wise Acquisition Progress Report with target vs actual variance',
      'Compensation Disbursal & Escrow Summary',
      'Pending Objections and Litigation Status Report',
      'Formal PDF & Excel export with official NIC formatting',
    ]}
  />
);

export default ReportsPage;
