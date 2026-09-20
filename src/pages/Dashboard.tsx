import React from 'react';
import { useAuth } from '../context/AuthContext';
import { MinistryDashboard } from '../components/dashboards/MinistryDashboard';
import { StateDashboard } from '../components/dashboards/StateDashboard';
import { DistrictDashboard } from '../components/dashboards/DistrictDashboard';
import { CALADashboard } from '../components/dashboards/CALADashboard';
import { FieldOfficerDashboard } from '../components/dashboards/FieldOfficerDashboard';
import { CitizenDashboard } from '../components/dashboards/CitizenDashboard';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'CENTRAL_MINISTRY':
      return <MinistryDashboard />;
    case 'STATE_AUTHORITY':
      return <StateDashboard />;
    case 'DISTRICT_AUTHORITY':
      return <DistrictDashboard />;
    case 'LAND_ACQUIRING_AUTHORITY':
      return <CALADashboard />;
    case 'FIELD_OFFICER':
      return <FieldOfficerDashboard />;
    case 'CITIZEN':
      return <CitizenDashboard />;
    case 'EXECUTIVE_VIEWER':
      return <MinistryDashboard />;
    default:
      return <MinistryDashboard />;
  }
};
