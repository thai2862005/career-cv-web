import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input, Badge } from '../components/Forms';
import { EmptyState } from '../components/States';
import { Search, Filter, Mail, FileText, ExternalLink } from 'lucide-react';

export const HRCandidateSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const mockSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
    }, 1000);
  };

  const candidates = [
    { id: 1, name: 'Alice Walker', role: 'Frontend Developer', experience: '5 years', skills: ['React', 'TypeScript', 'Tailwind'], rating: 4.8 },
    { id: 2, name: 'Tom Hardy', role: 'Fullstack Engineer', experience: '3 years', skills: ['Node.js', 'React', 'MongoDB'], rating: 4.2 },
    { id: 3, name: 'Sophia Lin', role: 'UI Developer', experience: '7 years', skills: ['Vue.js', 'CSS', 'Figma'], rating: 4.9 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Candidate Search</h1>
        <p className="text-slate-500 mt-1">Source talent from our pool of registered professionals.</p>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 text-slate-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Skills, role, or keywords (e.g. React, Manager)..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div className="w-full md:w-64 relative">
             <Filter className="absolute left-3 top-2.5 text-slate-400 h-4 w-4" />
             <select className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white text-slate-700">
               <option>Any Experience Level</option>
               <option>Entry Level</option>
               <option>Mid Level</option>
               <option>Senior Level</option>
             </select>
          </div>
          <Button onClick={mockSearch} isLoading={isSearching} className="md:w-auto w-full">Search</Button>
        </div>
      </Card>

      {!hasSearched && !isSearching && (
        <Card className="border-dashed bg-slate-50 shadow-none">
          <EmptyState 
            title="Search for Candidates" 
            description="Enter relevant keywords or skills above to start searching through the candidate database."
          />
        </Card>
      )}

      {hasSearched && !isSearching && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{candidates.length} candidates found</h3>
          
          <div className="grid gap-4">
            {candidates.map(candidate => (
              <Card key={candidate.id} className="hover:border-[var(--color-primary-light)] transition-colors">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-600 border border-slate-200">
                      {candidate.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 flex items-center">{candidate.name} <span className="ml-2 text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">★ {candidate.rating}</span></h4>
                      <p className="text-sm text-slate-500">{candidate.role} • {candidate.experience} experience</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 md:w-auto w-full">
                    {candidate.skills.map(skill => (
                      <span key={skill} className="px-2.5 py-1 bg-blue-50 text-[var(--color-primary-active)] text-xs rounded font-medium border border-blue-100">{skill}</span>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="secondary" size="sm" className="flex items-center"><FileText className="h-3.5 w-3.5 mr-1" /> View CV</Button>
                    <Button size="sm" className="flex items-center"><Mail className="h-3.5 w-3.5 mr-1" /> Message</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
