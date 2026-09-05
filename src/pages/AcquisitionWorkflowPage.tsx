import React from 'react';
import { PlaceholderModule } from '../components/common/PlaceholderModule';
import { GitMerge } from 'lucide-react';

export const AcquisitionWorkflowPage: React.FC = () => (
  <PlaceholderModule
    title="Acquisition Workflow"
    subtitle="End-to-end statutory stage progression under RFCTLARR Act 2013"
    actSection="Section 4 to 38 Lifecycle"
    targetPhase="Phase 3 Target"
    icon={GitMerge}
    keyFeatures={[
      'Field survey & verification submission by Revenue Inspector',
      'Preliminary Section 11(1) publication tracking',
      'Section 15 objection recording and hearing status',
      'Automated milestone transitions and approval gates',
    ]}
  />
);

export default AcquisitionWorkflowPage;
