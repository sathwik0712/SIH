import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RoleType } from '../../types';
import { getRoleConfig } from '../../config/roleConfig';

interface RoleGuardProps {
  allowedRoles?: RoleType[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center space-y-3 bg-white p-6 border border-slate-300 rounded shadow-sm">
          <div className="w-8 h-8 border-4 border-gov-navy-800 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-700">Verifying Role Permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const roleConfig = getRoleConfig(user.role);

  // Special case for citizen role
  if (user.role === 'CITIZEN' && location.pathname !== '/citizen') {
    return <Navigate to="/citizen" replace />;
  }

  // Check if role is allowed
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.warn(`Access denied for role ${user.role} on route ${location.pathname}. Redirecting to ${roleConfig.defaultRoute}`);
    return <Navigate to={roleConfig.defaultRoute} replace />;
  }

  return <>{children}</>;
};
