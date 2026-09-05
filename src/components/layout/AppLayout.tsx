import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GovernmentHeader } from '../common/GovernmentHeader';
import { Sidebar } from '../common/Sidebar';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { GovernmentFooter } from '../common/GovernmentFooter';

export const AppLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

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

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <GovernmentHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-y-auto bg-slate-50 min-h-[calc(100vh-80px)]">
          <Breadcrumbs />
          <div className="p-4 md:p-6 flex-1 max-w-7xl w-full mx-auto">
            <Outlet />
          </div>
          {/* Official NIC Government Footer */}
          <GovernmentFooter />
        </main>
      </div>
    </div>
  );
};
