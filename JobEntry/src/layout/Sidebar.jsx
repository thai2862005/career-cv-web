import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Building2, 
  Briefcase, 
  Users, 
  LayoutDashboard, 
  FileText, 
  Bookmark, 
  Search, 
  Settings,
  ShieldCheck,
  AlertOctagon,
  CreditCard,
  Database
} from 'lucide-react';

export const Sidebar = ({ role }) => {
  const location = useLocation();

  const menus = {
    candidate: [
      { path: '/candidate/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
      { path: '/candidate/jobs', label: 'Job Search', icon: <Search size={20} /> },
      { path: '/candidate/applications', label: 'Applications Tracking', icon: <Briefcase size={20} /> },
      { path: '/candidate/cv', label: 'CV Management', icon: <FileText size={20} /> },
      { path: '/candidate/saved-jobs', label: 'Saved Jobs', icon: <Bookmark size={20} /> },
    ],
    hr: [
      { path: '/hr/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
      { path: '/hr/jobs', label: 'Job Management', icon: <Briefcase size={20} /> },
      { path: '/hr/candidates', label: 'Candidate Search', icon: <Users size={20} /> },
      { path: '/hr/interviews', label: 'Interviews', icon: <Building2 size={20} /> },
    ],
    admin: [
      { path: '/admin/dashboard', label: 'System Overview', icon: <LayoutDashboard size={20} /> },
      { path: '/admin/users', label: 'User Management', icon: <Users size={20} /> },
      { path: '/admin/jobs', label: 'Job Moderation', icon: <ShieldCheck size={20} /> },
      { path: '/admin/reports', label: 'Violation Reports', icon: <AlertOctagon size={20} /> },
      { path: '/admin/packages', label: 'Service Packages', icon: <CreditCard size={20} /> },
      { path: '/admin/backup', label: 'Data Backup', icon: <Database size={20} /> },
    ]
  };

  const navItems = menus[role] || [];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full flex-shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-xl">
          <Briefcase className="h-6 w-6" />
          <span>JobEntry</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {role.toUpperCase()} MENU
        </div>
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-[var(--color-primary-light)] text-[var(--color-primary-active)]' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-slate-200">
        <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors">
          <Settings size={20} className="mr-3" />
          Settings
        </button>
      </div>
    </aside>
  );
};
