import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Briefcase, Menu, X, User } from 'lucide-react';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

export const PublicNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false); // Close mobile menu on route change
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Jobs', path: '/jobs' },
    { name: 'Companies', path: '/companies' },
  ];

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className={`p-1.5 rounded-lg transition-colors ${isScrolled ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]' : 'bg-white text-[var(--color-primary)]'}`}>
              <Briefcase className="h-6 w-6" />
            </div>
            <span className={`text-xl font-bold tracking-tight ${isScrolled ? 'text-slate-800' : 'text-slate-800 lg:text-white'}`}>
              JobEntry
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-8">
             {navLinks.map((link) => (
               <NavLink
                 key={link.name}
                 to={link.path}
                 className={({ isActive }) => 
                    `px-3 py-2 text-sm font-medium transition-colors ${
                      isActive 
                        ? (isScrolled ? 'text-[var(--color-primary)]' : 'text-slate-800 lg:text-white font-bold') 
                        : (isScrolled ? 'text-slate-600 hover:text-[var(--color-primary)]' : 'text-slate-600 lg:text-slate-100 lg:hover:text-white hover:text-[var(--color-primary)]')
                    }`
                 }
               >
                 {link.name}
               </NavLink>
             ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
             {isAuthenticated ? (
               <>
                 <Link 
                   to={String(user?.role || user?.Role || user?.roleName || '').toUpperCase() === 'ADMIN' ? '/admin/dashboard' : String(user?.role || user?.Role || user?.roleName || '').toUpperCase() === 'HR' ? '/hr/dashboard' : '/candidate/dashboard'} 
                   className={`text-sm font-medium ${isScrolled ? 'text-[var(--color-primary)]' : 'text-slate-100 lg:text-white font-bold'}`}
                 >
                   Dashboard
                 </Link>
                 <button 
                   onClick={() => { logout(); navigate('/'); }}
                   className={`text-sm font-medium ${isScrolled ? 'text-slate-600 hover:text-slate-900' : 'text-slate-600 lg:text-slate-100 lg:hover:text-white'}`}
                 >
                   Log out
                 </button>
               </>
             ) : (
               <>
                 <Link to="/login" className={`text-sm font-medium ${isScrolled ? 'text-slate-600 hover:text-slate-900' : 'text-slate-600 lg:text-slate-100 lg:hover:text-white'}`}>
                   Sign In
                 </Link>
                 <Link to="/register">
                   <Button className={`${!isScrolled ? 'bg-white text-slate-800 hover:bg-slate-50' : ''}`}>
                     Post a Job
                   </Button>
                 </Link>
               </>
             )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-md ${isScrolled ? 'text-slate-600' : 'text-slate-800'}`}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-slate-100 animate-in slide-in-from-top-2">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block px-3 py-2.5 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-[var(--color-primary)]"
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-slate-100 pt-4 mt-2 grid gap-2">
              {isAuthenticated ? (
                <>
                  <Link 
                    to={String(user?.role || user?.Role || user?.roleName || '').toUpperCase() === 'ADMIN' ? '/admin/dashboard' : String(user?.role || user?.Role || user?.roleName || '').toUpperCase() === 'HR' ? '/hr/dashboard' : '/candidate/dashboard'} 
                    className="block px-3 py-2.5 rounded-md text-center text-base font-medium bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => { logout(); navigate('/'); }}
                    className="block w-full px-3 py-2.5 rounded-md text-center text-base font-medium border border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-2.5 rounded-md text-center text-base font-medium border border-slate-200 text-slate-700 hover:bg-slate-50">Log in</Link>
                  <Link to="/register" className="block px-3 py-2.5 rounded-md text-center text-base font-medium bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]">Register / Post Job</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
