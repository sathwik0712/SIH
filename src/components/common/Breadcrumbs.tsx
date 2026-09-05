import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface RouteNameMap {
  [key: string]: string;
}

const routeNames: RouteNameMap = {
  dashboard: 'National Dashboard',
  projects: 'Project Register',
  parcels: 'Land Parcels (Cadastral)',
  workflow: 'Acquisition Workflow',
  'gis-map': 'GIS Spatial Map',
  notifications: 'Notifications & Gazette',
  awards: 'Award Inquiries & Declarations',
  compensation: 'Direct Compensation Disbursal',
  'affected-families': 'Affected Families Register',
  randr: 'Rehabilitation & Resettlement',
  possession: 'Land Possession Handover',
  documents: 'Documents Repository',
  reports: 'MIS Reports & Exports',
  analytics: 'Analytics & Risk Engine',
  alerts: 'Alerts & Escalations',
  'audit-trail': 'Audit Trail & Compliance Log',
  admin: 'System Administration',
  'field-verification': 'Mobile Field Verification',
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <nav className="flex items-center space-x-1.5 text-xs text-slate-500 py-2.5 px-4 bg-white border-b border-slate-200">
      <Link to="/dashboard" className="flex items-center text-slate-600 hover:text-gov-navy-800 transition-colors">
        <Home className="w-3.5 h-3.5 mr-1 text-slate-400" />
        <span>Home</span>
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = routeNames[value] || value.toUpperCase();

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            {isLast ? (
              <span className="font-semibold text-slate-800">{displayName}</span>
            ) : (
              <Link to={to} className="text-slate-600 hover:text-gov-navy-800 transition-colors">
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
