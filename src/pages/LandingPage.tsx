import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ShieldCheck, Map, ArrowRight, BookOpen, Fingerprint } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0B3559] rounded-lg flex items-center justify-center shadow-inner">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-xl font-black text-[#0B3559] tracking-tight leading-none">BHOOMISETU</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">National Land Acquisition Portal</div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <a href="#about" className="hover:text-[#0B3559] transition-colors">About</a>
          <a href="#features" className="hover:text-[#0B3559] transition-colors">Features</a>
          <a href="#stats" className="hover:text-[#0B3559] transition-colors">Live Stats</a>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/citizen')} className="px-4 py-2 text-sm font-semibold text-[#0B3559] bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors hidden sm:block">
            Check Land Status
          </button>
          <button onClick={() => navigate('/login')} className="px-4 py-2 text-sm font-semibold text-white bg-[#0B3559] rounded hover:bg-[#071E3D] transition-colors shadow-sm flex items-center gap-2">
            <Fingerprint className="w-4 h-4" />
            Government Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <div className="bg-[#0B3559] text-white py-20 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Transparent, Swift & Just <br className="hidden sm:block"/> Land Acquisition
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              A unified digital ecosystem for tracking national infrastructure projects, ensuring timely compensation, and managing R&R benefits under the RFCTLARR Act, 2013.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <button onClick={() => navigate('/login')} className="w-full sm:w-auto px-8 py-3 text-base font-bold text-[#0B3559] bg-white rounded shadow-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                Access Department Portal <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => navigate('/citizen')} className="w-full sm:w-auto px-8 py-3 text-base font-bold text-white bg-white/20 border border-white/30 rounded shadow-lg hover:bg-white/30 transition-all">
                Citizen / Landowner Services
              </button>
            </div>
          </div>
        </div>

        {/* Live Stats */}
        <div className="max-w-6xl mx-auto w-full px-6 py-12 -mt-10 relative z-20" id="stats">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center divide-x divide-slate-100">
            <div>
              <div className="text-3xl font-black text-[#0B3559]">10</div>
              <div className="text-xs font-bold text-slate-500 uppercase mt-1">Active Projects</div>
            </div>
            <div>
              <div className="text-3xl font-black text-emerald-600">₹3,136<span className="text-lg">Cr</span></div>
              <div className="text-xs font-bold text-slate-500 uppercase mt-1">Compensation Disbursed</div>
            </div>
            <div>
              <div className="text-3xl font-black text-purple-600">3,317</div>
              <div className="text-xs font-bold text-slate-500 uppercase mt-1">Families Rehabilitated</div>
            </div>
            <div>
              <div className="text-3xl font-black text-blue-600">5</div>
              <div className="text-xs font-bold text-slate-500 uppercase mt-1">States Covered</div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="max-w-6xl mx-auto w-full px-6 py-16" id="features">
          <h2 className="text-2xl font-bold text-center text-[#0B3559] mb-12">Core Capabilities</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center mb-4 text-blue-700">
                <Map className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">GIS Integration</h3>
              <p className="text-sm text-slate-600">Live cadastral mapping overlaying exact land parcel coordinates with satellite imagery for field verifications.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded flex items-center justify-center mb-4 text-emerald-700">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Tamper-Evident Audit</h3>
              <p className="text-sm text-slate-600">Every statutory step, objection, and compensation disbursement is logged immutably ensuring zero tampering.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded flex items-center justify-center mb-4 text-purple-700">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Statutory Workflows</h3>
              <p className="text-sm text-slate-600">Built strictly on the RFCTLARR Act timelines to prevent delays from Section 11 Notification through to Possession.</p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 text-center text-xs">
        <p>© 2026 BhoomiSetu Platform. Developed for SIH 2026. Data shown is simulated for demonstration.</p>
      </footer>
    </div>
  );
};
