import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store';

const DashboardRedirect = () => {
  const { isAuthenticated, getRole } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const role = getRole();
  if (role === 'ADMIN') return <Navigate to="/admin" replace />;
  if (role === 'HR') return <Navigate to="/hr" replace />;

  // Default dashboard for job seekers or other users
  return <Navigate to="/profile" replace />;
};

export default DashboardRedirect;
