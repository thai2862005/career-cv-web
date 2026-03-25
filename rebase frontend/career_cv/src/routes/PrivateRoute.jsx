import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store';

export const PrivateRoute = ({ children, roles = [] }) => {
  const location = useLocation();
  const { isAuthenticated, getRole } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0) {
    const userRole = getRole();
    if (!roles.includes(userRole)) {
      // Redirect to appropriate dashboard based on role
      if (userRole === 'ADMIN') {
        return <Navigate to="/admin" replace />;
      } else if (userRole === 'HR') {
        return <Navigate to="/hr" replace />;
      } else {
        return <Navigate to="/" replace />;
      }
    }
  }

  return children;
};

export const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, getRole } = useAuthStore();

  if (isAuthenticated) {
    const role = getRole();
    if (role === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    } else if (role === 'HR') {
      return <Navigate to="/hr" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};
