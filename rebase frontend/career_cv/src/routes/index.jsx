import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components';
import { PrivateRoute, PublicOnlyRoute } from './PrivateRoute';

// Import pages
import DashboardRedirect from '../pages/DashboardRedirect';

import {
  Home,
  Jobs,
  JobDetail,
  Companies,
  CompanyDetail,
  Login,
  Register,
  Profile,
  MyCV,
  MyApplications,
  SavedJobs,
  HRDashboard,
  HRJobs,
  CreateJob,
  HRApplications,
  AdminDashboard,
  AdminUsers,
  ErrorPage
} from '../pages';

// Layout wrapper component
const LayoutWrapper = ({ children }) => (
  <Layout>{children}</Layout>
);

export const router = createBrowserRouter([
  // Public routes with layout
  {
    path: '/',
    element: <LayoutWrapper><Home /></LayoutWrapper>,
    errorElement: <ErrorPage />,
  },
  {
    path: '/jobs',
    element: <LayoutWrapper><Jobs /></LayoutWrapper>,
  },
  {
    path: '/jobs/:id',
    element: <LayoutWrapper><JobDetail /></LayoutWrapper>,
  },
  {
    path: '/companies',
    element: <LayoutWrapper><Companies /></LayoutWrapper>,
  },
  {
    path: '/companies/:id',
    element: <LayoutWrapper><CompanyDetail /></LayoutWrapper>,
  },

  // Auth routes (no layout)
  {
    path: '/login',
    element: <PublicOnlyRoute><Login /></PublicOnlyRoute>,
  },
  {
    path: '/register',
    element: <PublicOnlyRoute><Register /></PublicOnlyRoute>,
  },

  // User routes (protected)
  {
    path: '/profile',
    element: (
      <PrivateRoute>
        <LayoutWrapper><Profile /></LayoutWrapper>
      </PrivateRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <LayoutWrapper><DashboardRedirect /></LayoutWrapper>
      </PrivateRoute>
    ),
  },
  {
    path: '/my-cv',
    element: (
      <PrivateRoute roles={['JOB_SEEKER', 'ADMIN']}>
        <LayoutWrapper><MyCV /></LayoutWrapper>
      </PrivateRoute>
    ),
  },
  {
    path: '/my-applications',
    element: (
      <PrivateRoute roles={['JOB_SEEKER', 'ADMIN']}>
        <LayoutWrapper><MyApplications /></LayoutWrapper>
      </PrivateRoute>
    ),
  },
  {
    path: '/saved-jobs',
    element: (
      <PrivateRoute roles={['JOB_SEEKER', 'ADMIN']}>
        <LayoutWrapper><SavedJobs /></LayoutWrapper>
      </PrivateRoute>
    ),
  },

  // HR routes
  {
    path: '/hr',
    element: (
      <PrivateRoute roles={['HR', 'ADMIN']}>
        <LayoutWrapper><HRDashboard /></LayoutWrapper>
      </PrivateRoute>
    ),
  },
  {
    path: '/hr/jobs',
    element: (
      <PrivateRoute roles={['HR', 'ADMIN']}>
        <LayoutWrapper><HRJobs /></LayoutWrapper>
      </PrivateRoute>
    ),
  },
  {
    path: '/hr/jobs/create',
    element: (
      <PrivateRoute roles={['HR', 'ADMIN']}>
        <LayoutWrapper><CreateJob /></LayoutWrapper>
      </PrivateRoute>
    ),
  },
  {
    path: '/hr/jobs/:id/edit',
    element: (
      <PrivateRoute roles={['HR', 'ADMIN']}>
        <LayoutWrapper><CreateJob /></LayoutWrapper>
      </PrivateRoute>
    ),
  },
  {
    path: '/hr/applications',
    element: (
      <PrivateRoute roles={['HR', 'ADMIN']}>
        <LayoutWrapper><HRApplications /></LayoutWrapper>
      </PrivateRoute>
    ),
  },

  // Admin routes
  {
    path: '/admin',
    element: (
      <PrivateRoute roles={['ADMIN']}>
        <LayoutWrapper><AdminDashboard /></LayoutWrapper>
      </PrivateRoute>
    ),
  },
  {
    path: '/admin/users',
    element: (
      <PrivateRoute roles={['ADMIN']}>
        <LayoutWrapper><AdminUsers /></LayoutWrapper>
      </PrivateRoute>
    ),
  },

  // Catch all
  {
    path: '*',
    element: <ErrorPage />,
  },
]);
