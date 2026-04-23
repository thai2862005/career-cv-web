import React, { useState } from 'react';
import { Search, MapPin, Code, Palette, Megaphone, Database, Briefcase, ChevronRight, Loader } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Link, useNavigate } from 'react-router-dom';
import { useJobs } from '../hooks/useJobs';
import { useCompanies } from '../hooks/useCompanies';

export const Home = () => {
  const navigate = useNavigate();
  const { jobs, loading: jobsLoading } = useJobs();
  const { companies, loading: companiesLoading } = useCompanies();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  const categories = [
    { name: 'Engineering', icon: <Code className="h-6 w-6" />, count: 320 },
    { name: 'Design', icon: <Palette className="h-6 w-6" />, count: 154 },
    { name: 'Marketing', icon: <Megaphone className="h-6 w-6" />, count: 86 },
    { name: 'Data Science', icon: <Database className="h-6 w-6" />, count: 124 },
  ];

  // Get featured jobs (first 4)

  // Get top companies (first 6)
  const featuredJobs = Array.isArray(jobs) ? jobs.slice(0, 4) : [];
const topCompanies = Array.isArray(companies) ? companies.slice(0, 6).map(c => c.name) : [];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-slate-900 pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[100%] rounded-full bg-gradient-to-b from-[var(--color-primary-dark)] to-[var(--color-primary)] opacity-20 blur-3xl"></div>
          <div className="absolute top-[20%] -left-[10%] w-[50%] h-[80%] rounded-full bg-gradient-to-b from-blue-600 to-cyan-500 opacity-20 blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 animate-in slide-in-from-bottom-6 duration-700">
            Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary-light)] to-[var(--color-primary)]">next dream job</span>
          </h1>
          <p className="mt-4 text-xl text-slate-300 max-w-3xl mx-auto mb-10 animate-in slide-in-from-bottom-8 duration-700 delay-100">
            Discover thousands of job opportunities with top companies. Your future career starts right here.
          </p>

          {/* Search Bar */}
          <div className="bg-white p-2 rounded-xl shadow-2xl max-w-4xl mx-auto flex flex-col md:flex-row gap-2 animate-in slide-in-from-bottom-10 duration-700 delay-200">
            <div className="flex-1 relative flex items-center px-4">
              <Search className="h-5 w-5 text-slate-400 shrink-0" />
              <input type="text" placeholder="Job title, keywords, or company" className="w-full pl-3 py-3 text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent" />
            </div>
            <div className="hidden md:block w-px bg-slate-200 mx-2"></div>
            <div className="flex-1 relative flex items-center px-4 border-t border-slate-100 md:border-none">
              <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
              <input type="text" placeholder="City or remote" className="w-full pl-3 py-3 text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent" />
            </div>
            <Button size="lg" className="w-full md:w-auto mt-2 md:mt-0 px-8 py-4 font-semibold text-base shadow-lg shadow-blue-500/30" onClick={() => navigate('/jobs')}>
              Search
            </Button>
          </div>
          
          <p className="mt-6 text-sm text-slate-400 animate-in fade-in duration-1000 delay-500">
            Popular: React, Backend, Product Manager, Remote
          </p>
        </div>
      </section>

      {/* Top Companies Marquee/Section */}
      <section className="py-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold tracking-wider text-slate-500 uppercase mb-6">Trusted by the best companies</p>
          {companiesLoading ? (
            <div className="flex justify-center items-center py-4">
              <Loader className="h-5 w-5 animate-spin text-[var(--color-primary)]" />
            </div>
          ) : topCompanies.length > 0 ? (
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {topCompanies.map((company, i) => (
                <span key={i} className="text-xl md:text-2xl font-bold text-slate-700">{company}</span>
              ))}
            </div>
          ) : (
            <p className="text-slate-400">No companies available</p>
          )}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-800">Browse by category</h2>
              <p className="text-slate-500 mt-2">Find a job that's perfect for you in our most popular categories.</p>
            </div>
            <Link to="/jobs" className="hidden sm:flex text-[var(--color-primary)] font-medium hover:underline items-center">
              All Categories <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <Link to="/jobs" key={i}>
                <Card className="hover:-translate-y-1 hover:border-[var(--color-primary-light)] hover:shadow-lg transition-all cursor-pointer group text-center p-6 h-full flex flex-col items-center justify-center">
                  <div className="h-16 w-16 mb-4 rounded-full bg-blue-50 text-[var(--color-primary)] flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                    {cat.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{cat.name}</h3>
                  <p className="text-slate-500 text-sm mt-1">{cat.count} jobs available</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800">Featured Jobs</h2>
            <p className="text-slate-500 mt-2">Discover the latest job openings hand-picked for you.</p>
          </div>

          {jobsLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
            </div>
          ) : featuredJobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featuredJobs.map((job) => (
                  <Card key={job.id} className="hover:border-[var(--color-primary-light)] hover:shadow-md transition-all group">
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 rounded-lg bg-blue-50 flex items-center justify-center text-[var(--color-primary)] text-2xl font-bold flex-shrink-0">
                        {job.company?.name?.charAt(0) || 'J'}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link to={`/jobs/${job.id}`} className="text-lg font-bold text-slate-800 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">{job.title}</Link>
                            <p className="text-slate-500 text-sm mt-1">{job.company?.name || 'Unknown Company'}</p>
                          </div>
                          <span className="bg-green-50 text-green-700 text-xs font-semibold px-2 py-1 rounded hidden sm:block whitespace-nowrap">{job.jobType || 'Full-time'}</span>
                        </div>
                        
                        <div className="flex flex-wrap items-center mt-4 text-sm text-slate-600 gap-y-2">
                          <div className="flex items-center w-full sm:w-1/2">
                            <MapPin className="h-4 w-4 mr-1.5 text-slate-400" /> {job.location || 'Not specified'}
                          </div>
                          <div className="flex items-center w-full sm:w-1/2 font-medium text-slate-700">
                            <Briefcase className="h-4 w-4 mr-1.5 text-slate-400 hidden sm:block" /> {job.salary || 'Competitive'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className="mt-12 text-center">
                <Button size="lg" variant="secondary" onClick={() => navigate('/jobs')}>Explore All Jobs</Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <p>No jobs available at the moment. Please check back later.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[var(--color-primary)] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to accelerate your career?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">Create an account today to save jobs, track applications, and receive personalized recommendations.</p>
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <Button size="lg" className="bg-white text-[var(--color-primary)] hover:bg-slate-50 font-bold px-8 py-3 h-auto" onClick={() => navigate('/register')}>Create Account</Button>
            <Button size="lg" variant="ghost" className="text-white hover:bg-white/20 border border-white font-semibold px-8 py-3 h-auto" onClick={() => navigate('/login')}>Sign In</Button>
          </div>
        </div>
      </section>
    </div>
  );
};
