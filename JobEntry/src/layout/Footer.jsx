import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 py-12 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary-active)]">
                <Briefcase className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                JobEntry
              </span>
            </Link>
            <p className="text-sm mb-6 max-w-xs">Connecting top talent with the world's most innovative organizations directly through our unified portal.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-[var(--color-primary)] transition-colors text-sm font-medium">Twitter</a>
              <a href="#" className="hover:text-[var(--color-primary)] transition-colors text-sm font-medium">LinkedIn</a>
              <a href="#" className="hover:text-[var(--color-primary)] transition-colors text-sm font-medium">Facebook</a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">For Candidates</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link></li>
              <li><Link to="/companies" className="hover:text-white transition-colors">Browse Companies</Link></li>
              <li><Link to="/candidate/dashboard" className="hover:text-white transition-colors">Candidate Dashboard</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Saved Jobs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">For Employers</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/hr/dashboard" className="hover:text-white transition-colors">Employer Dashboard</Link></li>
              <li><Link to="/hr/dashboard" className="hover:text-white transition-colors">Post a Job</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Search Resumes</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">About Us</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="#" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-centertext-sm text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} JobEntry Inc. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6 text-sm">
             <Link to="/admin/dashboard" className="hover:text-white transition-colors text-slate-500">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
