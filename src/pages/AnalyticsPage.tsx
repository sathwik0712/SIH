import React from 'react';
import { PlaceholderModule } from '../components/common/PlaceholderModule';
import { TrendingUp } from 'lucide-react';

export const AnalyticsPage: React.FC = () => (
  <PlaceholderModule
    title="Analytics & Prototype Risk Engine"
    subtitle="Rule-based delay prediction, statutory deadline monitoring, and corridor bottleneck assessment"
    actSection="Prototype Risk Engine"
    targetPhase="Phase 5 Target"
    icon={TrendingUp}
    keyFeatures={[
      'Transparent rule-based risk score (disputed parcels + compensation delay + R&R gap)',
      'Timeline adherence tracking against statutory 12-month limit',
      'Interactive risk breakdown factor inspection',
      'Clearly labeled as Prototype Risk Assessment (non-AI rule engine)',
    ]}
  />
);

export default AnalyticsPage;
