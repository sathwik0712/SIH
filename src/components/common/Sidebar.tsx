import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getRoleConfig } from '../../config/roleConfig';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const roleConfig = getRoleConfig(user?.role);
  const navItems = roleConfig.navItems;

  // Group nav items by section
  const sections = Array.from(new Set(navItems.map(item => item.section)));

  return (
    <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col border-r border-slate-800 shrink-0 select-none min-h-[calc(100vh-80px)]">
      <div className="p-3 bg-slate-950 border-b border-slate-800 text-[11px] text-slate-400 font-medium">
        <span className="text-slate-200">PORTAL NAVIGATION</span>
        <span className="block text-[10px] text-slate-400 font-bold">{roleConfig.displayName}</span>
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
          <span className="font-semibold text-amber-400">{user?.district || user?.state || 'All India'}</span>
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
          Role: <strong className="text-slate-200">{roleConfig.displayName}</strong>
        </div>
      </div>
    </aside>
  );
};
