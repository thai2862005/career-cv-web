import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Search, MapPin, Briefcase, ChevronDown, Filter } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const JobList = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  const jobs = [
    { id: 1, title: 'Senior React Developer', company: 'TechNova', location: 'New York, Remote', type: 'Full-time', salary: '$120k - $150k', tags: ['React', 'JavaScript', 'Tailwind'], category: 'Engineering' },
    { id: 2, title: 'UI/UX Designer', company: 'Creative Studio', location: 'San Francisco, CA', type: 'Part-time', salary: '$80k - $100k', tags: ['Figma', 'Prototyping'], category: 'Design' },
    { id: 3, title: 'Backend Engineer (Node.js)', company: 'FinTech Solutions', location: 'London, UK', type: 'Full-time', salary: '£70k - £90k', tags: ['Node.js', 'PostgreSQL', 'AWS'], category: 'Engineering' },
    { id: 4, title: 'Growth Marketing Lead', company: 'StartupHub', location: 'Remote', type: 'Contract', salary: '$90k - $120k', tags: ['SEO', 'Analytics'], category: 'Marketing' },
    { id: 5, title: 'Data Scientist', company: 'DataCorp', location: 'Austin, TX', type: 'Full-time', salary: '$130k+', tags: ['Python', 'Machine Learning'], category: 'Data Science' },
    { id: 6, title: 'Frontend Developer', company: 'WebAgency', location: 'Chicago, IL', type: 'Full-time', salary: '$95k+', tags: ['React', 'CSS'], category: 'Engineering' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-16">
      {/* Search Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-6">Find your next job</h1>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3.5 text-slate-400 h-5 w-5" />
              <input 
                type="text" 
                placeholder="Job title, keywords, or company..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] transition-shadow text-slate-800"
              />
            </div>
            <div className="w-full md:w-64 relative">
               <MapPin className="absolute left-4 top-3.5 text-slate-400 h-5 w-5" />
               <input 
                type="text" 
                placeholder="City, state, or remote" 
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] transition-shadow text-slate-800"
              />
            </div>
            <Button size="lg" className="h-[50px] px-8 py-3">Find Jobs</Button>
            <Button variant="secondary" className="md:hidden" onClick={() => setShowFilters(!showFilters)}>
               <Filter className="h-5 w-5 mr-2" /> Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="sticky top-24">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-800 mb-3">Job Type</h3>
                  <div className="space-y-2">
                    {['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'].map((type, i) => (
                      <label key={i} className="flex items-center text-sm text-slate-600 hover:text-slate-800 cursor-pointer">
                        <input type="checkbox" className="rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] mr-3 w-4 h-4" />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h3 className="font-semibold text-slate-800 mb-3">Categories</h3>
                  <div className="space-y-2">
                    {['Engineering', 'Design', 'Marketing', 'Data Science', 'Sales'].map((cat, i) => (
                      <label key={i} className="flex items-center text-sm text-slate-600 hover:text-slate-800 cursor-pointer">
                        <input type="checkbox" className="rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] mr-3 w-4 h-4" />
                        {cat}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="font-semibold text-slate-800 mb-3">Salary Range</h3>
                  <div className="space-y-2">
                    {['Any', '$50k - $80k', '$80k - $120k', '$120k+'].map((salary, i) => (
                      <label key={i} className="flex items-center text-sm text-slate-600 hover:text-slate-800 cursor-pointer">
                        <input type="radio" name="salary" className="border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] mr-3 w-4 h-4" />
                        {salary}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Job Listings */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-slate-800">Showing <span className="font-bold">243</span> jobs</h2>
              <div className="flex items-center text-sm">
                <span className="text-slate-500 mr-2">Sort by:</span>
                <select className="border-none bg-transparent font-medium text-slate-800 focus:ring-0 cursor-pointer decoration-transparent focus:outline-none">
                  <option>Most Relevant</option>
                  <option>Most Recent</option>
                  <option>Highest Salary</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} onClick={() => navigate(`/jobs/${job.id}`)}>
                  <Card className="hover:border-[var(--color-primary-light)] hover:shadow-md transition-all cursor-pointer group flex flex-col sm:flex-row gap-4 p-5 sm:p-6">
                    <div className="h-16 w-16 rounded-xl bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary-dark)] text-2xl font-bold flex-shrink-0">
                      {job.company.charAt(0)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-slate-800 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">{job.title}</h3>
                          <p className="text-slate-500 text-sm mt-1">{job.company}</p>
                        </div>
                        <span className="mt-2 sm:mt-0 font-medium text-slate-800 bg-slate-100 px-3 py-1 rounded-full text-sm inline-block">{job.salary}</span>
                      </div>
                      
                      <div className="flex flex-wrap items-center mt-3 text-sm text-slate-600 gap-y-2 gap-x-4">
                        <span className="flex items-center"><MapPin className="h-4 w-4 mr-1.5 text-slate-400" /> {job.location}</span>
                        <span className="flex items-center"><Briefcase className="h-4 w-4 mr-1.5 text-slate-400" /> {job.type}</span>
                        <span className="text-[var(--color-primary)] font-medium">• {job.category}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        {job.tags.map(tag => (
                          <span key={tag} className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-xs rounded-md">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>

            {/* Pagination Placeholder */}
            <div className="flex justify-center mt-10">
              <div className="flex space-x-1">
                <Button variant="secondary" className="px-4">Previous</Button>
                <Button className="px-4">1</Button>
                <Button variant="secondary" className="px-4 border-l-0">2</Button>
                <Button variant="secondary" className="px-4 border-l-0">3</Button>
                <Button variant="secondary" className="px-4">Next</Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
