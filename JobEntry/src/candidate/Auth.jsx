import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, Loader, AlertCircle } from 'lucide-react';
import { Input, Badge } from '../components/Forms';
import { Button } from '../components/Button';
import { useAuth, ROLES } from '../context/AuthContext';

export const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register, loading } = useAuth();
  
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [role, setRole] = useState(''); // Start empty - make role required
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        // Login
        const result = await login({ email, password });
        if (result.success) {
          // Navigate based on role
          const user = result.data.user;
          const userRole = String(user?.role || user?.Role || user?.roleName || 'JOB_SEEKER').toUpperCase();
          if (userRole === 'HR') navigate('/hr/dashboard');
          else if (userRole === 'ADMIN') navigate('/admin/dashboard');
          else navigate('/candidate/dashboard');
        } else {
          setError(result.error || 'Login failed');
        }
      } else {
        // Register - Validate role is selected
        if (!role) {
          setError('Please select a role to continue');
          return;
        }

        const result = await register({
          email,
          password,
          Fullname: `${firstName} ${lastName}`,
          role: role, // Send role string
        });
        
        if (result.success) {
          const user = result.data.user;
          const userRole = String(user?.role || user?.Role || user?.roleName || 'JOB_SEEKER').toUpperCase();
          if (userRole === 'HR') navigate('/hr/dashboard');
          else if (userRole === 'ADMIN') navigate('/admin/dashboard');
          else navigate('/candidate/dashboard');
        } else {
          setError(result.error || 'Registration failed');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Visual Identity Side (Left) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 justify-center items-center overflow-hidden">
        <div className="absolute inset-0">
           <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" alt="Office Collaboration" className="object-cover w-full h-full opacity-30" />
           <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary-dark)] to-[var(--color-primary)] mix-blend-multiply opacity-80"></div>
        </div>
        
        <div className="relative z-10 max-w-md px-8 text-center">
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md inline-flex items-center justify-center mb-8 border border-white/20">
            <Briefcase className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-6 leading-tight">Elevate your career with JobEntry</h1>
          <p className="text-lg text-blue-100">Join a network of over 10,000 professionals and get discovered by top-tier organizations globally.</p>
        </div>
      </div>

      {/* Auth Form Side (Right) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-24 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center gap-2 mb-12 lg:hidden justify-center">
            <div className="p-1.5 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary-active)]">
              <Briefcase className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-800">
              JobEntry
            </span>
          </Link>

          <div className="mb-10 lg:mb-12">
            <h2 className="text-3xl font-bold text-slate-800">{isLogin ? 'Welcome back' : 'Create an account'}</h2>
            <p className="text-slate-500 mt-2 text-sm md:text-base">
              {isLogin ? 'Enter your details to access your account' : 'Fill in the details below to complete your registration'}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleAuth}>
            {error && (
              <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            )}
            
            <Input
              label="Email address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {!isLogin && (
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Choose Your Role <span className="text-red-500">*</span>
                </label>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-slate-800"
                  required
                >
                  <option value="">-- Select a Role --</option>
                  <option value={ROLES.JOB_SEEKER.name}>
                    {ROLES.JOB_SEEKER.display} (Role ID: {ROLES.JOB_SEEKER.id})
                  </option>
                  <option value={ROLES.HR.name}>
                    {ROLES.HR.display} (Role ID: {ROLES.HR.id})
                  </option>
                  <option value={ROLES.ADMIN.name}>
                    {ROLES.ADMIN.display} (Role ID: {ROLES.ADMIN.id})
                  </option>
                </select>
                {role && (
                  <p className="text-xs text-slate-500">
                    Selected: {ROLES[role]?.display} • Role ID: {ROLES[role]?.id}
                  </p>
                )}
              </div>
            )}



            {isLogin && (
              <div className="flex justify-between items-center pb-2">
                <label className="flex items-center text-sm text-slate-600">
                  <input type="checkbox" className="rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] mr-2 w-4 h-4" />
                  Remember me
                </label>
                <a href="#" className="text-sm font-medium text-[var(--color-primary)] hover:underline">Forgot password?</a>
              </div>
            )}

            <Button size="lg" className="w-full h-12 text-base mt-2" disabled={loading}>
              {loading ? (
                <Loader className="h-5 w-5 animate-spin mr-2 inline" />
              ) : null}
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
            
            {isLogin && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <span className="font-semibold">Demo Account:</span><br/>
                  Email: admin@career-cv.com<br/>
                  Password: password123
                </p>
              </div>
            )}
            
            <div className="relative py-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button type="button" className="flex justify-center items-center py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>
              <button type="button" className="flex justify-center items-center py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-800 font-medium">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setEmail('');
                setPassword('');
                setFirstName('');
                setLastName('');
              }}
              className="font-semibold text-[var(--color-primary)] hover:underline"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
