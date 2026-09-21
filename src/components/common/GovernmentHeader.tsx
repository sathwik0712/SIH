import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, LogOut, Globe, Search, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  children?: React.ReactNode;
  onToggleMobileMenu?: () => void;
}

export const GovernmentHeader: React.FC<Props> = ({ children, onToggleMobileMenu }) => {
  const { user, logout } = useAuth();

  const getRoleBadgeStyle = (role?: string) => {
    switch (role) {
      case 'CENTRAL_MINISTRY':
        return 'bg-purple-900/80 text-purple-200 border-purple-400';
      case 'STATE_AUTHORITY':
        return 'bg-blue-900/80 text-blue-200 border-blue-400';
      case 'DISTRICT_AUTHORITY':
        return 'bg-emerald-900/80 text-emerald-200 border-emerald-400';
      case 'LAND_ACQUIRING_AUTHORITY':
        return 'bg-amber-900/80 text-amber-200 border-amber-400';
      case 'FIELD_OFFICER':
        return 'bg-orange-900/80 text-orange-200 border-orange-400';
      default:
        return 'bg-slate-800 text-slate-200 border-slate-500';
    }
  };

  return (
    <header className="w-full sticky top-0 z-40 shadow-md">
      {/* Top Gov Strip */}
      <div className="bg-[#071E3D] text-slate-200 px-4 py-1 text-xs flex justify-between items-center border-b border-[#0f2d57] overflow-hidden max-w-[100vw]">
        <div className="flex items-center space-x-3 min-w-0">
          <span className="font-semibold text-amber-400 tracking-wide truncate">भारत सरकार | GOVERNMENT OF INDIA</span>
          <span className="hidden md:inline text-slate-500 shrink-0">|</span>
          <span className="hidden md:inline text-slate-300 shrink-0">Department of Land Resources (MoRD)</span>
        </div>
        <div className="flex items-center space-x-4 shrink-0">
          <div className="hidden sm:flex items-center space-x-1 text-slate-300">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px]">English / हिन्दी</span>
          </div>
        </div>
      </div>

      {/* Main Header Bar (Deep Rich Navy #0B3559) */}
      <div className="backdrop-blur-md bg-[#0B3559]/95 text-white px-4 py-2.5 flex justify-between items-center border-b border-[#082541]/80 overflow-hidden max-w-[100vw]">
        <div className="flex items-center space-x-3">
          {user && onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-1.5 -ml-1 text-slate-200 hover:text-white hover:bg-white/10 rounded transition-colors"
              aria-label="Open Navigation Menu"
              id="mobile-menu-toggle-btn"
            >
              <Menu className="w-5 h-5 text-amber-400" />
            </button>
          )}

          {/* Brand Treatment */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded border border-amber-400/40 bg-[#071E3D] flex items-center justify-center font-serif font-bold text-lg tracking-wider text-amber-400 shadow-inner">
              BS
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-serif font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                  BHOOMISETU
                </span>
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-white/10 text-amber-300 border border-white/15 font-normal hidden sm:inline">
                  भूमि सेतु
                </span>
              </div>
              <p className="text-[11px] text-slate-300 tracking-wide font-sans hidden sm:block">
                National Land Acquisition &amp; Management System (RFCTLARR Act, 2013)
              </p>
            </div>
          </Link>
        </div>

        {/* User Info and Quick Actions */}
        {user ? (
          <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
            {children}
            <div className="hidden lg:flex items-center mx-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Global Search (Parcels, Projects)..."
                  className="w-64 pl-8 pr-3 py-1.5 bg-[#071E3D] border border-white/20 rounded text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all shadow-inner"
                />
              </div>
            </div>

            <Link
              to="/alerts"
              id="header-alerts-btn"
              className="relative p-2 rounded text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
              title="View Alerts"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-[#0B3559] animate-pulse" />
            </Link>

            <div className="hidden sm:flex flex-col items-end border-l border-white/20 pl-4">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm text-white">{user.fullName}</span>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${getRoleBadgeStyle(user.role)}`}>
                  {user.roleDisplayName}
                </span>
              </div>
              <div className="text-[11px] text-slate-300 flex items-center space-x-2 mt-0.5">
                <span>{user.designation}</span>
                <span>•</span>
                <span className="text-amber-300 font-medium">{user.district || user.state}</span>
              </div>
            </div>

            <button
              onClick={logout}
              id="header-logout-btn"
              className="flex items-center space-x-1.5 bg-red-700 hover:bg-red-800 text-white px-2 sm:px-3 py-1.5 rounded text-xs font-semibold border border-red-500 transition-colors shadow-sm shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded text-xs font-semibold shadow-sm transition-colors"
          >
            <span>Sign In</span>
          </Link>
        )}
      </div>

      {/* Saffron & Green Accent Strip */}
      <div className="h-1 w-full flex">
        <div className="w-1/2 bg-[#FF9933]" />
        <div className="w-1/2 bg-[#138808]" />
      </div>
    </header>
  );
};
