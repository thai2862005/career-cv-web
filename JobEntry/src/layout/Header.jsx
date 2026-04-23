import React from 'react';
import { Bell, Search, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Header = ({ role }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const displayName = user?.Fullname || user?.name || 'User';
  const displayRole = user?.role || role;

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 sticky top-0">
      <div className="flex items-center flex-1">
        <div className="relative w-64 md:w-96 hidden sm:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" />
          </span>
          <input 
            type="text" 
            placeholder="Search anywhere..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative text-slate-500 hover:text-slate-700 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-2"></div>
        
        <div className="flex items-center space-x-3">
          <div className="flex flex-col items-end hidden md:flex">
            <span className="text-sm font-medium text-slate-700">{displayName}</span>
            <span className="text-xs text-slate-500 capitalize">{displayRole?.toLowerCase()} Account</span>
          </div>
          <div className="h-9 w-9 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary-active)] ring-2 ring-transparent hover:ring-[var(--color-primary)] transition-all">
            <User className="h-5 w-5" />
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};
