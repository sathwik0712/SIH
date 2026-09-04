import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { DEMO_USERS } from '../data/seedData';
import { 
  ShieldCheck, Lock, User, KeyRound, 
  RefreshCw, Check, AlertCircle, Building2 
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { switchRole } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>('CENTRAL_MINISTRY');
  const [userId, setUserId] = useState('rajeshwar.sharma@gov.in');
  const [password, setPassword] = useState('GovIndia@2026');
  const [captchaInput, setCaptchaInput] = useState('7K9P2');
  const [captchaCode, setCaptchaCode] = useState('7K9P2');
  const [errorMessage, setErrorMessage] = useState('');

  const refreshCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput(code); // Pre-fill for ease of demonstration
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    const user = DEMO_USERS.find(u => u.role === role);
    if (user) {
      setUserId(user.email);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (captchaInput.toUpperCase() !== captchaCode.toUpperCase()) {
      setErrorMessage('Invalid security captcha. Please re-enter.');
      return;
    }

    switchRole(selectedRole);
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-gov-gray-100 flex flex-col justify-between select-none">
      {/* Top National Strip */}
      <div>
        <div className="h-1.5 w-full flex">
          <div className="flex-1 bg-gov-saffron-strip"></div>
          <div className="flex-1 bg-white"></div>
          <div className="flex-1 bg-gov-green-strip"></div>
        </div>

        <div className="bg-gov-gray-100 text-gov-gray-700 text-xs px-4 py-2 border-b border-gov-gray-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gov-gray-900">भारत सरकार</span>
            <span className="text-gov-gray-400">|</span>
            <span>Government of India</span>
            <span className="hidden sm:inline text-gov-gray-400">|</span>
            <span className="hidden sm:inline text-gov-gray-600">Ministry of Rural Development & MoRTH</span>
          </div>
          <div className="text-[11px] font-mono text-gov-gray-500">
            NIC Portal Security Level: <strong>Tier-IV</strong>
          </div>
        </div>
      </div>

      {/* Main Login Card Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-gov-gray-300 rounded shadow-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header Banner */}
          <div className="bg-gov-navy text-white p-5 text-center border-b border-gov-navy-dark">
            <div className="w-12 h-12 mx-auto mb-2 rounded bg-white/10 border border-white/20 flex items-center justify-center text-amber-400 shadow-inner">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 className="text-xl font-bold font-serif tracking-wider">BHOOMISETU</h1>
            <p className="text-xs text-slate-200 font-light mt-0.5">
              National Land Acquisition & Management System
            </p>
            <div className="mt-2 inline-block bg-amber-500 text-gov-navy-dark text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              Smart India Hackathon 2026 &bull; PS 26016
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-6 space-y-4 text-xs">
            {errorMessage && (
              <div className="p-2.5 bg-red-50 border border-red-300 text-red-900 rounded text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-700 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Quick Demo Role Selector */}
            <div>
              <label className="block font-bold text-gov-navy mb-1">
                Select Evaluator Government Persona <span className="text-red-600">*</span>
              </label>
              <select
                value={selectedRole}
                onChange={(e) => handleRoleSelect(e.target.value as UserRole)}
                className="w-full p-2.5 border border-gov-gray-300 rounded text-xs font-semibold text-gov-navy bg-gov-gray-50 focus:ring-1 focus:ring-gov-navy"
              >
                <option value="CENTRAL_MINISTRY">1. Central Ministry (Joint Secretary, MoRTH/DoLR)</option>
                <option value="STATE_AUTHORITY">2. State Authority (Principal Secretary Revenue)</option>
                <option value="DISTRICT_AUTHORITY">3. District Authority (District Collector & CALA Pune)</option>
                <option value="LAND_ACQUIRING_AUTHORITY">4. Land Acquiring Authority (NHAI / DFCCIL)</option>
                <option value="FIELD_OFFICER">5. Field Officer (Circle Inspector / Talathi)</option>
                <option value="EXECUTIVE_VIEWER">6. Executive / Viewer (PM Gati Shakti NMP)</option>
              </select>
              <p className="text-[10px] text-gov-gray-500 mt-1">
                Demo role-selector allows switching personas without re-entering credentials.
              </p>
            </div>

            {/* User ID */}
            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Government Official Email / User ID
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gov-gray-400" />
                <input
                  type="text"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-gov-gray-300 rounded text-xs focus:ring-1 focus:ring-gov-navy"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Official Portal Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gov-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-gov-gray-300 rounded text-xs focus:ring-1 focus:ring-gov-navy"
                />
              </div>
            </div>

            {/* Captcha */}
            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Security Image Captcha
              </label>
              <div className="flex items-center gap-2">
                <div className="bg-slate-200 border border-slate-300 rounded px-3 py-1.5 font-mono font-bold text-base tracking-widest text-gov-navy-dark select-none shadow-inner">
                  {captchaCode}
                </div>
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="p-1.5 text-gov-gray-600 hover:bg-gov-gray-200 rounded border border-gov-gray-300"
                  title="Generate New Security Captcha"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <input
                  type="text"
                  required
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  placeholder="Enter captcha"
                  className="flex-1 p-2 border border-gov-gray-300 rounded text-xs font-mono uppercase"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2.5 bg-gov-navy hover:bg-gov-navy-hover text-white text-xs font-bold rounded transition-colors shadow-sm flex items-center justify-center gap-1.5 mt-2"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Authenticate & Access BHOOMISETU Portal</span>
            </button>

            {/* Secondary actions */}
            <div className="flex items-center justify-between text-[11px] text-gov-gray-500 pt-2 border-t border-gov-gray-200">
              <span className="hover:underline cursor-pointer">Forgot Official Password?</span>
              <span className="hover:underline cursor-pointer">NIC Helpdesk Support</span>
            </div>
          </form>

          {/* Footer note */}
          <div className="p-3 bg-gov-gray-50 border-t border-gov-gray-200 text-center text-[10px] text-gov-gray-500">
            For demonstration purposes &bull; Sample Government Datasets for SIH Evaluation
          </div>
        </div>
      </div>

      {/* National Portal Footer */}
      <footer className="bg-gov-navy-dark text-slate-400 text-xs py-3 px-4 border-t border-slate-800 text-center space-y-1">
        <p className="text-slate-300 font-medium">
          Designed &amp; Hosted by National Informatics Centre (NIC) &bull; Government of India
        </p>
        <p className="text-[10px]">
          Compliant with Guidelines for Indian Government Websites (GIGW) &bull; RFCTLARR Act, 2013 Statutory Workflows
        </p>
      </footer>
    </div>
  );
};
