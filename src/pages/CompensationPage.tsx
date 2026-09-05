import React from 'react';
import { PlaceholderModule } from '../components/common/PlaceholderModule';
import { DollarSign } from 'lucide-react';

export const CompensationPage: React.FC = () => (
  <PlaceholderModule
    title="Direct Compensation Disbursal"
    subtitle="PFMS direct-benefit transfer and compensation tracking per survey number"
    actSection="Direct Bank Transfer / PFMS"
    targetPhase="Phase 4 Target"
    icon={DollarSign}
    keyFeatures={[
      'Beneficiary-wise compensation assessment and bank account validation',
      'PFMS transaction ID reconciliation and payment status',
      'Dispute hold escrow tracking for litigated parcels',
      'Real-time financial synchronization with national dashboard charts',
    ]}
  />
);

export default CompensationPage;
