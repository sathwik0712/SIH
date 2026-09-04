import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  Bell, User, Shield, Check, Globe, 
  ChevronDown, ExternalLink, AlertCircle, Sparkles, Sun, Moon 
} from 'lucide-react';

interface GovernmentHeaderProps {
  onNavigate: (module: string) => void;
  activeModule: string;
}

export const GovernmentHeader: React.FC<GovernmentHeaderProps> = ({ onNavigate, activeModule }) => {
  const { 
    currentUser, switchRole, highContrast, setHighContrast, 
    fontSize, setFontSize, alerts, language, setLanguage, t 
  } = useApp();
  
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const unreadAlertsCount = alerts.filter(a => !a.isRead).length;

  const rolesList: { role: UserRole; title: string; subtitle: string }[] = [
    { role: 'CENTRAL_MINISTRY', title: 'Central Ministry', subtitle: 'National Oversight & Policy' },
    { role: 'STATE_AUTHORITY', title: 'State Authority', subtitle: 'State Revenue Secretary' },
    { role: 'DISTRICT_AUTHORITY', title: 'District Authority', subtitle: 'District Collector & CALA' },
    { role: 'LAND_ACQUIRING_AUTHORITY', title: 'Land Acquiring Authority', subtitle: 'NHAI / DFCCIL / SECI' },
    { role: 'FIELD_OFFICER', title: 'Field Revenue Officer', subtitle: 'Circle Inspector / Talathi' },
    { role: 'EXECUTIVE_VIEWER', title: 'Executive / Viewer', subtitle: 'PM Gati Shakti / NITI Aayog' },
  ];

  const handleFontSizeChange = (size: 'normal' | 'large' | 'larger') => {
    setFontSize(size);
    const root = document.documentElement;
    if (size === 'normal') root.style.fontSize = '16px';
    if (size === 'large') root.style.fontSize = '17.5px';
    if (size === 'larger') root.style.fontSize = '19px';
  };

  const handleContrastToggle = () => {
    const next = !highContrast;
    setHighContrast(next);
    if (next) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  };

  return (
    <header className="no-print border-b border-gov-gray-300 select-none">
      {/* 1. National Tricolor Top Accent Strip */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-gov-saffron-strip"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-gov-green-strip"></div>
      </div>

      {/* 2. Official Government Identity & Accessibility Top Bar */}
      <div className="bg-gov-gray-100 text-gov-gray-700 text-xs px-4 py-1.5 border-b border-gov-gray-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gov-gray-900">भारत सरकार</span>
          <span className="text-gov-gray-400">|</span>
          <span className="font-semibold">{t('govIndia')}</span>
          <span className="hidden md:inline text-gov-gray-400">|</span>
          <span className="hidden md:inline text-gov-gray-600">{t('ministryName')}</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Accessibility Font Size Controls */}
          <div className="flex items-center border border-gov-gray-300 rounded bg-white overflow-hidden text-[11px]">
            <button 
              onClick={() => handleFontSizeChange('normal')} 
              className={`px-1.5 py-0.5 hover:bg-gov-gray-100 font-medium ${fontSize === 'normal' ? 'bg-gov-navy text-white hover:bg-gov-navy' : ''}`}
              title="Standard Font Size"
            >
              A-
            </button>
            <button 
              onClick={() => handleFontSizeChange('large')} 
              className={`px-1.5 py-0.5 hover:bg-gov-gray-100 font-semibold border-l border-gov-gray-200 ${fontSize === 'large' ? 'bg-gov-navy text-white hover:bg-gov-navy' : ''}`}
              title="Large Font Size"
            >
              A
            </button>
            <button 
              onClick={() => handleFontSizeChange('larger')} 
              className={`px-1.5 py-0.5 hover:bg-gov-gray-100 font-bold border-l border-gov-gray-200 ${fontSize === 'larger' ? 'bg-gov-navy text-white hover:bg-gov-navy' : ''}`}
              title="Extra Large Font Size"
            >
              A+
            </button>
          </div>

          {/* High Contrast Mode */}
          <button
            onClick={handleContrastToggle}
            className="flex items-center gap-1 text-[11px] px-2 py-0.5 border border-gov-gray-300 rounded bg-white hover:bg-gov-gray-100 text-gov-gray-700 font-medium"
            title="Toggle High Contrast Display"
          >
            {highContrast ? <Sun className="w-3 h-3 text-amber-500" /> : <Moon className="w-3 h-3 text-gov-gray-600" />}
            <span>{highContrast ? 'Standard' : 'High Contrast'}</span>
          </button>

          {/* Bilingual Language Selector */}
          <div className="flex items-center border border-gov-gray-300 rounded bg-white overflow-hidden text-[11px]">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 font-bold transition-colors ${language === 'en' ? 'bg-gov-navy text-white' : 'text-gov-gray-700 hover:bg-gov-gray-100'}`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-0.5 font-bold border-l border-gov-gray-200 transition-colors ${language === 'hi' ? 'bg-gov-navy text-white' : 'text-gov-gray-700 hover:bg-gov-gray-100'}`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Portal Header Strip */}
      <div className="bg-gov-navy text-white px-4 py-3 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          {/* Neutral Cadastral Seal Logo */}
          <div className="w-10 h-10 rounded bg-white/10 border border-white/20 flex items-center justify-center text-amber-400 font-bold text-lg shadow-inner">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-wider text-white font-serif">{t('appName')}</h1>
              <span className="text-[10px] bg-amber-500 text-gov-navy-dark font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                SIH-2026 PS 26016
              </span>
            </div>
            <p className="text-xs text-slate-200 font-light tracking-tight">
              {t('subTitle')}
            </p>
          </div>
        </div>

        {/* Right Action Cluster: Notifications & RBAC Switcher */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <button
            onClick={() => onNavigate('alerts')}
            className="relative p-2 rounded hover:bg-white/10 text-slate-200 hover:text-white transition-colors border border-transparent hover:border-white/20"
            title="System Alerts and Statutory Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Quick Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded bg-white/10 hover:bg-white/15 border border-white/20 text-left transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-amber-400 text-gov-navy-dark flex items-center justify-center font-bold text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-amber-300 leading-tight">
                  {currentUser.designation.split(',')[0]}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-300" />
            </button>

            {/* Dropdown Menu */}
            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white text-gov-gray-900 rounded border border-gov-gray-300 shadow-xl z-50 py-1.5">
                <div className="px-3 py-2 border-b border-gov-gray-200 bg-gov-gray-50">
                  <p className="text-[11px] font-bold text-gov-navy uppercase tracking-wider">Switch Evaluator Persona</p>
                  <p className="text-[10px] text-gov-gray-500">Test different government stakeholder access tiers</p>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-gov-gray-100">
                  {rolesList.map((item) => {
                    const isSelected = currentUser.role === item.role;
                    return (
                      <button
                        key={item.role}
                        onClick={() => {
                          switchRole(item.role);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-gov-gray-100 transition-colors ${isSelected ? 'bg-blue-50/80 text-gov-navy font-semibold' : 'text-gov-gray-800'}`}
                      >
                        <div>
                          <div className="font-medium flex items-center gap-1.5">
                            <Shield className={`w-3.5 h-3.5 ${isSelected ? 'text-gov-navy' : 'text-gov-gray-400'}`} />
                            <span>{item.title}</span>
                          </div>
                          <p className="text-[11px] text-gov-gray-500 ml-5">{item.subtitle}</p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-gov-navy" />}
                      </button>
                    );
                  })}
                </div>

                <div className="px-3 py-2 border-t border-gov-gray-200 bg-gov-gray-50 text-[11px] text-gov-gray-600 flex items-center justify-between">
                  <span>Scope: {currentUser.department}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Official Demo Notice Ribbon */}
      <div className="bg-amber-100 border-b border-amber-200 text-amber-900 text-xs px-4 py-1 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 font-medium">
          <AlertCircle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
          <span>
            <strong>DEMO ENVIRONMENT:</strong> All seeded land records, notifications, awards, and compensation datasets are simulated for SIH 2026 Evaluation (Problem Statement 26016).
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-2 text-[11px] text-amber-800">
          <span>Active Role Scope: <strong>{currentUser.role.replace(/_/g, ' ')}</strong></span>
        </div>
      </div>
    </header>
  );
};
