import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '../context/AuthContext';
import { Loader } from 'lucide-react';

export const DashboardLayout = ({ role }) => {
  const location = useLocation();
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <Loader className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  // Prevent unauthenticated access
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Prevent cross-role routing
  if (user) {
    const extractedRole = user.role || user.Role || user.roleName || '';
    const userRole = String(extractedRole).toUpperCase();
    const expectedRole = String(role || '').toUpperCase();
    console.log('[DashboardLayout] userRole:', userRole, 'expectedRole:', expectedRole, 'User object:', user);
    
    // Treat candidate and JOB_SEEKER as equivalent
    const isCandidateMatch = (expectedRole === 'CANDIDATE' || expectedRole === 'JOB_SEEKER') && 
                             (userRole === 'CANDIDATE' || userRole === 'JOB_SEEKER');
                             
    if (userRole !== expectedRole && !isCandidateMatch) {
      // If user tries to access a different role's dashboard
      if (userRole === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
      if (userRole === 'HR') return <Navigate to="/hr/dashboard" replace />;
      
      // If userRole is something else entirely (e.g. empty), prevent infinite loop
      // by checking if we're already trying to go to candidate/dashboard
      if (expectedRole === 'CANDIDATE') return <Navigate to="/" replace />;
      
      return <Navigate to="/candidate/dashboard" replace />;
    }
  }
  
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar role={role} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header role={role} />
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
