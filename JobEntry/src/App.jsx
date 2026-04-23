import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Context
import { AuthProvider } from './context/AuthContext';

// Layouts
import { DashboardLayout } from './layout/DashboardLayout';
import { PublicLayout } from './layout/PublicLayout';

// Public Pages (Candidate)
import { Home } from './candidate/Home';
import { JobList } from './candidate/JobList';
import { JobDetail } from './candidate/JobDetail';
import { CompanyList } from './candidate/CompanyList';
import { Auth } from './candidate/Auth';
import { CandidateDashboard } from './candidate/Dashboard';
import { CandidateCVManagement } from './candidate/CVManagement';

// HR Pages
import { HRDashboard } from './hr/Dashboard';
import { HRJobManagement } from './hr/JobManagement';
import { HRCandidateSearch } from './hr/CandidateSearch';

// Admin Pages
import { AdminDashboard } from './admin/Dashboard';
import { AdminUserManagement } from './admin/UserManagement';
import { AdminJobModeration } from './admin/JobModeration';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        {/* Public Website Routes (Candidate Facing) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/companies" element={<CompanyList />} />
        </Route>

        {/* Auth Routes (No Navbar/Footer Wrapper) */}
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />

        {/* Candidate Dashboard Routes */}
        <Route path="/candidate" element={<DashboardLayout role="candidate" />}>
          <Route path="" element={<Navigate to="/candidate/dashboard" replace />} />
          <Route path="dashboard" element={<CandidateDashboard />} />
          <Route path="cv" element={<CandidateCVManagement />} />
          <Route path="*" element={<div className="p-8 text-center"><h2 className="text-xl text-slate-500 font-medium">Page coming soon. Use sidebar to navigate.</h2></div>} />
        </Route>

        {/* HR Dashboard Routes */}
        <Route path="/hr" element={<DashboardLayout role="hr" />}>
          <Route path="" element={<Navigate to="/hr/dashboard" replace />} />
          <Route path="dashboard" element={<HRDashboard />} />
          <Route path="jobs" element={<HRJobManagement />} />
          <Route path="candidates" element={<HRCandidateSearch />} />
          <Route path="*" element={<div className="p-8 text-center"><h2 className="text-xl text-slate-500 font-medium">Page coming soon. Use sidebar to navigate.</h2></div>} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<DashboardLayout role="admin" />}>
          <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUserManagement />} />
          <Route path="jobs" element={<AdminJobModeration />} />
          <Route path="*" element={<div className="p-8 text-center"><h2 className="text-xl text-slate-500 font-medium">Page coming soon. Use sidebar to navigate.</h2></div>} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
