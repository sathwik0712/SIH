import React from 'react';
import { PlaceholderModule } from '../components/common/PlaceholderModule';
import { KeyRound } from 'lucide-react';

export const PossessionPage: React.FC = () => (
  <PlaceholderModule
    title="Land Possession Handover"
    subtitle="Formal handing-over and revenue record mutation under Section 38"
    actSection="Section 38 & 40 Handover"
    targetPhase="Phase 3/4 Target"
    icon={KeyRound}
    keyFeatures={[
      'Formal panchanama and possession certificate recording',
      'Revenue record mutation (Record of Rights / 7/12 extract update)',
      'Handover to Requiring Body (NHAI/DFCCIL/SECI) with digital signatures',
      'Encumbrance-free certificate issuance',
    ]}
  />
);

export default PossessionPage;
