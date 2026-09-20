import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CitizenDashboard } from '../components/dashboards/CitizenDashboard';
import { LogOut } from 'lucide-react';

export const CitizenPortal: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Header Bar for Citizen */}
      <header className="bg-[#0B3559] text-white px-4 sm:px-6 py-3 flex justify-between items-center shadow-md border-b-2 border-amber-500">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-amber-500 text-[#0B3559] font-black font-serif flex items-center justify-center text-lg shadow-sm">
            B
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold font-serif tracking-tight text-white">BHOOMISETU</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded font-semibold uppercase">
                CITIZEN PORTAL
              </span>
            </div>
            <p className="text-[11px] text-slate-300">RFCTLARR Landowner Transparency &amp; Compensation Tracking</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-semibold text-white">{user?.fullName || 'Shri Tukaram S. Gaikwad'}</span>
            <span className="text-[10px] font-mono text-amber-300">Aadhaar Verified Landowner</span>
          </div>
          <button
            onClick={logout}
            className="px-3 py-1.5 bg-white/10 hover:bg-rose-600/80 text-white rounded text-xs font-semibold flex items-center space-x-1.5 border border-white/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-4 sm:p-6">
        <CitizenDashboard />
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-400 text-[11px] py-3 text-center border-t border-slate-700">
        Bhoomisetu National Land Acquisition Portal • Government of India • Ministry of Road Transport &amp; Highways
      </footer>
    </div>
  );
};

export default CitizenPortal;

