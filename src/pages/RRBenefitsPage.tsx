import React from 'react';
import { PlaceholderModule } from '../components/common/PlaceholderModule';
import { Home } from 'lucide-react';

export const RRBenefitsPage: React.FC = () => (
  <PlaceholderModule
    title="Rehabilitation & Resettlement (R&R Benefits)"
    subtitle="Mandatory second-schedule and third-schedule entitlement distribution"
    actSection="Schedule II & III RFCTLARR"
    targetPhase="Phase 4 Target"
    icon={Home}
    keyFeatures={[
      'Housing entitlement tracking in designated resettlement colonies',
      'One-time subsistence grant (₹3,000/month for 1 year) disbursement',
      'Skill development and employment annuity preference tracking',
      'Civic infrastructure provisioning in resettlement areas',
    ]}
  />
);

export default RRBenefitsPage;
