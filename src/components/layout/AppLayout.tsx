import React, { useState } from 'react';
import { Outlet, Navigate, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HelpCircle, LogOut, X } from 'lucide-react';
import { GovernmentHeader } from '../common/GovernmentHeader';
import { Sidebar } from '../common/Sidebar';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { GovernmentFooter } from '../common/GovernmentFooter';
import { HelpModal } from '../common/HelpModal';

import { getRoleConfig } from '../../config/roleConfig';

export const AppLayout: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center space-y-3 bg-white p-6 border border-slate-300 rounded shadow-sm">
          <div className="w-8 h-8 border-4 border-gov-navy-800 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-700">Verifying National Portal Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const roleConfig = getRoleConfig(user?.role);
  const navItems = roleConfig.navItems;
  const sections = Array.from(new Set(navItems.map(item => item.section)));

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <GovernmentHeader onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsHelpOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-[#0B3559] bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Help</span>
          </button>
        </div>
      </GovernmentHeader>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Slide-Out Drawer Navigation (under md: 768px) */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer Content */}
            <div className="relative w-72 max-w-[80vw] bg-slate-900 text-slate-300 flex flex-col h-full shadow-2xl z-10 border-r border-slate-800">
              <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white tracking-wide">BHOOMISETU</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                      PORTAL
                    </span>
                  </div>
                  <span className="block text-[11px] text-amber-400 font-semibold mt-0.5">
                    {roleConfig.displayName}
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Scope Snapshot */}
              <div className="px-3.5 py-2.5 bg-slate-800/60 border-b border-slate-800 text-[11px]">
                <div className="text-slate-200 font-semibold truncate">{user?.fullName}</div>
                <div className="text-slate-400 text-[10px] truncate">{user?.designation} • {user?.district || user?.state || 'India'}</div>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 overflow-y-auto py-2 px-2.5 space-y-4 text-xs">
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
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) =>
                              `flex items-center space-x-2.5 px-3 py-2.5 rounded font-medium transition-colors ${
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

              {/* Sign Out Button */}
              <div className="px-3 py-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  id="mobile-drawer-logout-btn"
                  className="flex items-center justify-center space-x-2 w-full bg-red-700 hover:bg-red-800 text-white px-3 py-2.5 rounded text-xs font-semibold border border-red-500 transition-colors shadow-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>

              {/* Footer inside mobile menu */}
              <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] flex justify-between items-center text-slate-400">
                <span className="text-[10px]">RFCTLARR Act 2013</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-slate-50 min-h-[calc(100vh-80px)]">
          <Breadcrumbs />
          <div className="p-3 sm:p-4 md:p-6 flex-1 max-w-7xl w-full mx-auto">
            <Outlet />
          </div>
          {/* Official NIC Government Footer */}
          <GovernmentFooter />
        </main>
      </div>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};
