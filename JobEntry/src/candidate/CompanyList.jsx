import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Search, MapPin, ExternalLink, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CompanyList = () => {
  const companies = [
    { id: 1, name: 'TechNova', industry: 'Software', employees: '500-1000', location: 'San Francisco, CA', openJobs: 12, rating: 4.8 },
    { id: 2, name: 'Global Finance', industry: 'FinTech', employees: '10k+', location: 'New York, NY', openJobs: 8, rating: 4.5 },
    { id: 3, title: 'Creative Studio', industry: 'Design', employees: '50-100', location: 'Remote', openJobs: 3, rating: 4.9 },
    { id: 4, name: 'HealthPlus', industry: 'Healthcare', employees: '1000-5000', location: 'Boston, MA', openJobs: 24, rating: 4.2 },
    { id: 5, name: 'EcoEnergy', industry: 'Renewables', employees: '100-500', location: 'Austin, TX', openJobs: 5, rating: 4.6 },
    { id: 6, name: 'Data Insights', industry: 'Data Science', employees: '50-100', location: 'London, UK', openJobs: 2, rating: 4.7 },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">Discover Top Organizations</h1>
          <p className="text-lg text-slate-500">Explore company cultures, benefits, and open positions at the world's most innovative workplaces.</p>
        </div>

        <div className="bg-white p-2 rounded-xl shadow-md border border-slate-200 max-w-3xl mx-auto flex flex-col md:flex-row gap-2 mb-12">
          <div className="flex-1 relative flex items-center px-4">
            <Search className="h-5 w-5 text-slate-400 shrink-0" />
            <input type="text" placeholder="Search by company name or industry..." className="w-full pl-3 py-3 text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent" />
          </div>
          <Button size="lg" className="w-full md:w-32 py-3 h-auto">Search</Button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Featured Employers</h2>
          <div className="flex items-center text-sm font-medium text-[var(--color-primary)] hover:underline cursor-pointer">
            View All Companies
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company, i) => (
            <Card key={i} className="hover:border-[var(--color-primary-light)] hover:shadow-lg transition-all group flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="h-16 w-16 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center text-2xl font-bold border border-orange-100 shadow-sm transition-transform group-hover:scale-105">
                  {(company.name || company.title).charAt(0)}
                </div>
                <div className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-1 rounded">
                  ★ {company.rating}
                </div>
              </div>
              
              <div className="mb-4 flex-grow">
                <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-[var(--color-primary)] transition-colors">
                  {company.name || company.title}
                </h3>
                <p className="text-[var(--color-primary)] text-sm font-semibold mb-4">{company.industry}</p>
                
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-slate-400" /> {company.location}</div>
                  <div className="flex items-center"><Users className="h-4 w-4 mr-2 text-slate-400" /> {company.employees} employees</div>
                  <div className="flex items-center"><TrendingUp className="h-4 w-4 mr-2 text-slate-400" /> Hiring active</div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                <span className="text-sm font-semibold text-slate-800">{company.openJobs} open jobs</span>
                <Link to="/jobs" className="text-sm font-medium text-[var(--color-primary)] hover:underline flex items-center">
                  View Jobs <ExternalLink className="h-3.5 w-3.5 ml-1" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
