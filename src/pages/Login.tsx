import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { DemoUser } from '../types';
import { Shield, KeyRound, User as UserIcon, RefreshCw, AlertCircle, CheckCircle2, Lock, ArrowRight, Building2 } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, demoAccounts, isAuthenticated } = useAuth();

  const [username, setUsername] = useState('ministry.admin@nic.in');
  const [password, setPassword] = useState('admin123');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('7K9P2');
  const [selectedRole, setSelectedRole] = useState('Central Ministry');

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput('');
  };

  const handleSelectDemoUser = (account: DemoUser) => {
    setSelectedRole(account.roleName);
    setUsername(account.username);
    setPassword(account.password);
    setCaptchaInput(captchaCode);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError('Please enter both User ID / Official Email and Password.');
      return;
    }

    if (captchaInput.toUpperCase() !== captchaCode.toUpperCase()) {
      setError('Invalid Security Captcha Code. Please re-enter.');
      generateCaptcha();
      return;
    }

    setIsLoading(true);
    try {
      await login(username, password, captchaInput);
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please verify your official access.');
      generateCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col justify-between select-none">
      {/* Top Gov Strip */}
      <div className="bg-[#071E3D] text-slate-200 px-4 py-1.5 text-xs flex justify-between items-center border-b border-[#0f2d57]">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-amber-400">भारत सरकार | GOVERNMENT OF INDIA</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300">Department of Land Resources (MoRD)</span>
        </div>
        <div className="flex items-center space-x-3 text-[11px] text-slate-300">
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
            SECURE ACCESS GATEWAY
          </span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="bg-[#0B3559] text-white px-4 py-3 flex justify-between items-center border-b border-[#082541] shadow-sm">
        <div className="flex items-center space-x-3 max-w-7xl mx-auto w-full">
          <div className="w-10 h-10 rounded border border-amber-400/40 bg-[#071E3D] flex items-center justify-center font-serif font-bold text-lg tracking-wider text-amber-400 shadow-inner">
            BS
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-serif font-bold tracking-tight text-white">
                BHOOMISETU
              </span>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-white/10 text-amber-300 border border-white/15 font-normal">
                भूमि सेतु
              </span>
            </div>
            <p className="text-[11px] text-slate-300 tracking-wide font-sans">
              National Land Acquisition &amp; Management System (RFCTLARR Act, 2013)
            </p>
          </div>
        </div>
      </div>

      {/* Saffron & Green Accent Strip */}
      <div className="h-1 w-full flex">
        <div className="w-1/2 bg-[#FF9933]" />
        <div className="w-1/2 bg-[#138808]" />
      </div>

      {/* Main Login Area */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 gap-0 bg-white border border-slate-300 rounded shadow-lg overflow-hidden">

          {/* Left Info Panel (Deep Navy #0B3559) */}
          <div className="md:col-span-5 bg-[#0B3559] text-white p-6 sm:p-8 flex flex-col justify-between border-r border-[#082541]">
            <div>
              <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-white/15">
                <div className="w-12 h-12 rounded border border-amber-400/50 bg-[#071E3D] flex items-center justify-center font-serif font-bold text-2xl text-amber-400 shadow-inner">
                  BS
                </div>
                <div>
                  <h1 className="text-xl font-serif font-bold tracking-tight text-white leading-tight">
                    BHOOMISETU
                  </h1>
                  <span className="text-xs text-amber-300 font-medium">भूमि सेतु e-Governance Portal</span>
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed mb-6 font-sans">
                A unified, end-to-end statutory platform for land acquisition, direct PFMS compensation, and rehabilitation &amp; resettlement under the <strong className="text-amber-300">RFCTLARR Act, 2013</strong>.
              </p>

              <div className="space-y-3 text-xs text-slate-200">
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Cadastral parcel tracking with Survey &amp; Khasra registry</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Section 11(1) to Section 38 statutory timeline enforcement</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Direct PFMS compensation &amp; R&amp;R benefit compliance</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Single-source-of-truth tamper-evident audit trail</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/15 text-[11px] text-slate-300">
              <div className="flex items-center space-x-1.5 text-amber-300 font-semibold mb-1">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Authorized Personnel Only</span>
              </div>
              <span>Access is monitored and audited in compliance with Government of India cybersecurity guidelines.</span>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-white">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-base font-bold text-[#0B3559]">Official Sign In</h2>
                  <p className="text-xs text-slate-500">Enter your credentials or click any demo role below</p>
                </div>
                <Lock className="w-5 h-5 text-[#0B3559]" />
              </div>

              {error && (
                <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Demo Fast-Switch Grid (6 Roles) */}
              <div className="mb-4 bg-slate-50 border border-slate-200 rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#0B3559] uppercase tracking-wider">
                    Demo Role Fast-Switch (1-Click Auto-Fill):
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">6 Demo Roles</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {demoAccounts.map(acc => {
                    const isSelected = username === acc.username;
                    return (
                      <button
                        key={acc.username}
                        type="button"
                        onClick={() => handleSelectDemoUser(acc)}
                        className={`text-left p-2 rounded border text-xs transition-all ${
                          isSelected
                            ? 'bg-[#0B3559] text-white border-[#0B3559] shadow-sm ring-2 ring-[#0B3559]/20'
                            : 'bg-white text-slate-800 border-slate-300 hover:border-[#0B3559] hover:bg-slate-100'
                        }`}
                      >
                        <div className={`font-bold text-[11px] truncate ${isSelected ? 'text-amber-300' : 'text-[#0B3559]'}`}>
                          {acc.roleName}
                        </div>
                        <div className={`text-[10px] truncate ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                          {acc.state}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official User ID / Email
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      id="username-input"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="e.g. ministry.admin@nic.in"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0B3559] focus:border-[#0B3559] font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      id="password-input"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0B3559] focus:border-[#0B3559] font-mono"
                      required
                    />
                  </div>
                </div>

                {/* Captcha Box */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Security Verification Code (Captcha)
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="bg-slate-200 border border-slate-300 px-4 py-1.5 rounded font-mono font-bold text-base tracking-widest text-slate-800 select-none line-through decoration-slate-500">
                      {captchaCode}
                    </div>
                    <button
                      type="button"
                      onClick={generateCaptcha}
                      className="p-2 border border-slate-300 rounded bg-white hover:bg-slate-50 text-slate-600 transition-colors"
                      title="Refresh Captcha"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <input
                      type="text"
                      id="captcha-input"
                      value={captchaInput}
                      onChange={e => setCaptchaInput(e.target.value)}
                      placeholder="Enter Captcha"
                      className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900 uppercase font-mono focus:outline-none focus:ring-1 focus:ring-[#0B3559] focus:border-[#0B3559]"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  id="login-submit-btn"
                  disabled={isLoading}
                  className="w-full mt-2 bg-[#0B3559] hover:bg-[#071E3D] text-white font-semibold py-2.5 px-4 rounded text-xs border border-[#082541] transition-colors flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating Session...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to BHOOMISETU</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-200 text-center text-[11px] text-slate-500">
              National Informatics Centre (NIC) • Ministry of Electronics &amp; Information Technology
            </div>
          </div>
        </div>
      </div>

      {/* Footer Strip */}
      <footer className="bg-[#071E3D] text-slate-400 text-center py-2.5 px-4 text-[11px] border-t border-[#082541]">
        BHOOMISETU Portal • National Land Acquisition &amp; Resettlement Management System • Demo Prototype
      </footer>
    </div>
  );
};
