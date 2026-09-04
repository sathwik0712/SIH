import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, FolderKanban, MapPin, Map, 
  GitMerge, ScrollText, MessageSquareWarning, Award, 
  Banknote, Users, Home, KeyRound, 
  FileText, BarChart3, PieChart, BellRing, 
  History, Settings2, Smartphone, ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  onNavigate: (module: string) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  highlight?: boolean;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ activeModule, onNavigate, isOpen, onCloseMobile }) => {
  const { currentUser, alerts, t } = useApp();
  const unreadAlertsCount = alerts.filter(a => !a.isRead).length;

  const menuSections: MenuSection[] = [
    {
      title: 'CORE GOVERNANCE',
      items: [
        { id: 'dashboard', label: '1. National Dashboard', icon: LayoutDashboard },
        { id: 'projects', label: '2. Infrastructure Projects', icon: FolderKanban },
        { id: 'parcels', label: '3. Land Parcel Cadastre', icon: MapPin },
        { id: 'gis-map', label: '4. GIS Cadastral Map', icon: Map },
        { id: 'workflow', label: '5. Acquisition Lifecycle', icon: GitMerge },
      ]
    },
    {
      title: 'RFCTLARR STATUTORY PROCESS',
      items: [
        { id: 'notifications', label: '6. Statutory Notifications', icon: ScrollText },
        { id: 'objections', label: '7. Claims & Objections', icon: MessageSquareWarning },
        { id: 'awards', label: '8. Awards & Valuation', icon: Award },
        { id: 'compensation', label: '9. Compensation & DBT', icon: Banknote },
        { id: 'families', label: '10. Affected Families (SIA)', icon: Users },
        { id: 'randr', label: '11. Resettlement & Rehab', icon: Home },
        { id: 'possession', label: '12. Physical Possession', icon: KeyRound },
      ]
    },
    {
      title: 'MONITORING & OVERSIGHT',
      items: [
        { id: 'documents', label: '13. Document Repository', icon: FileText },
        { id: 'analytics', label: '14. Delay & Risk Analytics', icon: BarChart3 },
        { id: 'reports', label: '15. Reports & MIS Generator', icon: PieChart },
        { id: 'alerts', label: '16. Alerts & Action Center', icon: BellRing, badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined },
        { id: 'audit', label: '17. Statutory Audit Trail', icon: History },
        { id: 'admin', label: '18. Administration & APIs', icon: Settings2 },
      ]
    },
    {
      title: 'FIELD OPERATIONS',
      items: [
        { id: 'field-verification', label: 'Mobile Field Officer Mode', icon: Smartphone, highlight: true },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 bg-gov-navy-dark text-slate-200 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* User Identity Panel */}
        <div className="p-3.5 border-b border-slate-800 bg-black/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-gov-navy border border-slate-600 flex items-center justify-center font-bold text-amber-400 text-xs shadow">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-amber-400 font-medium truncate uppercase tracking-tight">
                {currentUser.role.replace(/_/g, ' ')}
              </p>
            </div>
          </div>
          {currentUser.district && (
            <div className="mt-2 text-[10px] text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800">
              Jurisdiction: <strong>{currentUser.district}, {currentUser.state}</strong>
            </div>
          )}
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto py-2 px-2 space-y-4 text-xs select-none">
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <p className="px-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = activeModule === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-left transition-all ${
                        isActive
                          ? 'bg-gov-navy text-white font-semibold border-l-4 border-amber-400 shadow-sm pl-2'
                          : item.highlight
                          ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900/50'
                          : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-amber-400' : item.highlight ? 'text-emerald-400' : 'text-slate-400'}`} />
                        <span className="truncate">{t(item.id) || item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800 bg-black/30 text-[10px] text-slate-400 flex items-center justify-between">
          <span>v2.6.1-SIH-STABLE</span>
          <span className="text-amber-400">NIC Compliant</span>
        </div>
      </aside>
    </>
  );
};
