import React from 'react';
import { PlaceholderModule } from '../components/common/PlaceholderModule';
import { Award } from 'lucide-react';

export const AwardsPage: React.FC = () => (
  <PlaceholderModule
    title="Award Inquiries & Declarations"
    subtitle="Competent Authority Land Acquisition (CALA) award determination under Section 23/30"
    actSection="Section 23 & 30 Awards"
    targetPhase="Phase 3 Target"
    icon={Award}
    keyFeatures={[
      'Formal award number generation and apportionment schedule',
      'Solatium calculation (100% statutory solatium under RFCTLARR Act)',
      'Multiplication factor based on rural/urban distance',
      'Beneficiary-wise entitlement list approval by District Collector',
    ]}
  />
);

export default AwardsPage;
