import React from 'react';
import { PlaceholderModule } from '../components/common/PlaceholderModule';
import { Users } from 'lucide-react';

export const AffectedFamiliesPage: React.FC = () => (
  <PlaceholderModule
    title="Affected Families Register"
    subtitle="Census and baseline survey of project affected title-holders and tenants"
    actSection="Section 16 SIA Register"
    targetPhase="Phase 4 Target"
    icon={Users}
    keyFeatures={[
      'Comprehensive family demographic survey records',
      'Identification of landless agricultural labourers and artisans',
      'SC/ST vulnerable community special benefit tagging',
      'Grievance redressal case link per family ID',
    ]}
  />
);

export default AffectedFamiliesPage;
