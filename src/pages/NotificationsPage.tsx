import React from 'react';
import { PlaceholderModule } from '../components/common/PlaceholderModule';
import { FileText } from 'lucide-react';

export const NotificationsPage: React.FC = () => (
  <PlaceholderModule
    title="Statutory Notifications & Gazette"
    subtitle="Gazette publication records for Section 11(1) and Section 19(1) declarations"
    actSection="Section 11 & Section 19"
    targetPhase="Phase 3 Target"
    icon={FileText}
    keyFeatures={[
      'Section 11(1) Preliminary Notification tracking with Gazette numbers',
      'Section 19(1) Declaration of Resettlement Area publication',
      'Publication date validation against 12-month statutory lapse timer',
      'Digital document repository for district gazette notifications',
    ]}
  />
);

export default NotificationsPage;
