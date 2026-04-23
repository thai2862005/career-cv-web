import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input, Select, Badge } from '../components/Forms';
import { Search, MapPin, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CandidateJobSearch = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const jobs = [
    { id: 1, title: 'Senior React Developer', company: 'TechNova', location: 'New York, Remote', type: 'Full-time', salary: '$120k - $150k', tags: ['React', 'JavaScript', 'Tailwind'] },
    { id: 2, title: 'UI/UX Designer', company: 'Creative Studio', location: 'San Francisco, CA', type: 'Part-time', salary: '$80k - $100k', tags: ['Figma', 'Prototyping'] },
    { id: 3, title: 'Backend Engineer (Node.js)', company: 'FinTech Solutions', location: 'London, UK', type: 'Full-time', salary: '£70k - £90k', tags: ['Node.js', 'PostgreSQL', 'AWS'] },
    { id: 4, title: 'Frontend Developer', company: 'StartupHub', location: 'Remote', type: 'Contract', salary: '$50/hr', tags: ['Vue.js', 'CSS'] },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Find your dream job</h1>
        <p className="text-slate-500 mt-1">Search through thousands of listings across top companies.</p>
      </div>

      <Card className="!p-4 bg-white/50 backdrop-blur-md border-[var(--color-primary-light)]">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-slate-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Job title, keywords, or company..." 
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64 relative">
             <MapPin className="absolute left-3 top-3 text-slate-400 h-5 w-5" />
             <input 
              type="text" 
              placeholder="Location" 
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div className="w-full md:w-48">
            <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]">
              <option value="">Any Category</option>
              <option value="IT">IT / Software</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
          <Button size="lg" className="w-full md:w-auto min-w-[120px]">Search Jobs</Button>
        </div>
      </Card>

      <div className="flex justify-between items-center text-sm text-slate-500">
        <p>Showing <span className="font-semibold text-slate-800">124</span> jobs based on your preferences</p>
        <div className="flex items-center gap-2">
          <span>Sort by:</span>
          <select className="border-none bg-transparent font-medium text-slate-800 focus:ring-0 cursor-pointer">
            <option>Most Relevant</option>
            <option>Newest</option>
            <option>Highest Paid</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:border-[var(--color-primary-light)] hover:shadow-md transition-all cursor-pointer group" actions={<Bookmark className="h-5 w-5 text-slate-400 group-hover:text-[var(--color-primary)] transition-colors" />}>
            <div onClick={() => navigate(`/candidate/jobs/${job.id}`)}>
              <div className="flex items-start space-x-4 mb-4">
                <div className="h-14 w-14 rounded-lg bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary)] text-2xl font-bold flex-shrink-0">
                  {job.company.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 group-hover:text-[var(--color-primary)] transition-colors">{job.title}</h3>
                  <p className="text-slate-500 text-sm mt-1">{job.company}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-sm text-slate-600">
                <span className="flex items-center"><MapPin className="h-4 w-4 mr-1 text-slate-400" /> {job.location}</span>
                <span className="flex items-center"><Briefcase className="h-4 w-4 mr-1 text-slate-400" /> {job.type}</span>
                <span className="inline-block font-medium text-slate-800">{job.salary}</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {job.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">{tag}</span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center pt-4">
         <Button variant="secondary" className="mr-2">Previous</Button>
         <Button variant="secondary" className="hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] bg-[var(--color-primary)] text-white border-[var(--color-primary)]">1</Button>
         <Button variant="secondary" className="border-l-0">2</Button>
         <Button variant="secondary" className="border-l-0">3</Button>
         <Button variant="secondary" className="ml-2">Next</Button>
      </div>
    </div>
  );
};
