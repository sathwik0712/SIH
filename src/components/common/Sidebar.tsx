import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FolderGit2,
  MapPin,
  GitMerge,
  Map,
  FileText,
  Award,
  DollarSign,
  Users,
  Home,
  KeyRound,
  FileArchive,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  History,
  Settings,
  Smartphone,
  ClipboardList,
  Briefcase,
  Gavel,
  ShieldCheck,
  MessageSquareWarning
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  section: string;
  roles?: string[];
}

const navItems: NavItem[] = [
  // Overview
  { name: 'National Dashboard', path: '/dashboard', icon: LayoutDashboard, section: 'Overview' },
  { name: 'Analytics & Risk Engine', path: '/analytics', icon: TrendingUp, section: 'Overview' },
  { name: 'Alerts & Escalations', path: '/alerts', icon: AlertTriangle, section: 'Overview' },

  // Land Acquisition & Projects
  { name: 'Project Register', path: '/projects', icon: ClipboardList, section: 'Land Acquisition' },
  { name: 'Land Parcels (Cadastral)', path: '/parcels', icon: MapPin, section: 'Land Acquisition' },
  { name: 'GIS Spatial Map', path: '/gis-map', icon: Map, section: 'Land Acquisition' },
  { name: 'SIA Module', path: '/sia', icon: Users, section: 'Land Acquisition' },
  { name: 'Acquisition Workflow', path: '/workflow', icon: Briefcase, section: 'Land Acquisition' },
  { name: 'Sec 15 Hearings', path: '/hearings', icon: Gavel, section: 'Land Acquisition' },
  { name: 'Mobile Field Survey', path: '/field-verification', icon: Smartphone, section: 'Land Acquisition' },

  // Statutory & Awards
  { name: 'Notifications (Sec 11/19)', path: '/notifications', icon: FileText, section: 'Statutory Stages' },
  { name: 'Award Generation (Sec 23)', path: '/awards', icon: Award, section: 'Statutory Stages' },
  { name: 'Direct Compensation', path: '/compensation', icon: DollarSign, section: 'Statutory Stages' },

  // Social Impact & Rehabilitation
  { name: 'Affected Families', path: '/affected-families', icon: Users, section: 'R&R & Possession' },
  { name: 'Rehabilitation & Resettlement', path: '/randr', icon: Home, section: 'R&R & Possession' },
  { name: 'Possession Handover', path: '/possession', icon: KeyRound, section: 'R&R & Possession' },

  // Compliance & MIS
  { name: 'Documents Repository', path: '/documents', icon: FileArchive, section: 'Compliance & MIS' },
  { name: 'MIS Reports & Exports', path: '/reports', icon: BarChart3, section: 'Compliance & MIS' },
  { name: 'Audit Trail (Single Source)', path: '/audit-trail', icon: ShieldCheck, section: 'Compliance & MIS' },
  { name: 'Grievances', path: '/grievances', icon: MessageSquareWarning, section: 'Compliance & MIS' },
  { name: 'System Administration', path: '/admin', icon: Settings, section: 'Compliance & MIS' },
];

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  // Group nav items by section
  const sections = Array.from(new Set(navItems.map(item => item.section)));

  return (
    <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col border-r border-slate-800 shrink-0 select-none min-h-[calc(100vh-80px)]">
      <div className="p-3 bg-slate-950 border-b border-slate-800 text-[11px] text-slate-400 font-medium">
        <span className="text-slate-200">PORTAL NAVIGATION</span>
        <span className="block text-[10px] text-slate-500">RFCTLARR Standard Modules</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-4 text-xs">
        {sections.map(section => (
          <div key={section} className="space-y-1">
            <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              {section}
            </div>
            {navItems
              .filter(item => item.section === section)
              .map(item => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-2.5 px-3 py-2 rounded font-medium transition-colors ${
                        isActive
                          ? 'bg-gov-navy-800 text-white border-l-4 border-amber-500 pl-2'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0 text-slate-400" />
                    <span className="truncate">{item.name}</span>
                  </NavLink>
                );
              })}
          </div>
        ))}
      </nav>

      {/* Scope Footer */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center justify-between">
          <span>Active Scope:</span>
          <span className="font-semibold text-amber-400">{user?.state || 'National'}</span>
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5">
          Role: {user?.roleDisplayName || 'Guest'}
        </div>
      </div>
    </aside>
  );
};
