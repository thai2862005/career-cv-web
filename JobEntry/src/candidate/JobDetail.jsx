import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ArrowLeft, MapPin, Briefcase, Clock, DollarSign, Bookmark, Share2, Target, Users } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';

export const JobDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isApplying, setIsApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setApplied(true);
    }, 1500);
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-16">
      {/* Dynamic Header */}
      <div className="bg-slate-900 border-b border-slate-800 text-white pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to search results
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-xl bg-white text-[var(--color-primary)] text-3xl md:text-4xl font-bold flex items-center justify-center shrink-0 shadow-lg">
                T
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold">Senior React Developer</h1>
                <Link to="/companies" className="text-lg text-[var(--color-primary-light)] font-medium mt-2 hover:underline inline-block">TechNova Inc.</Link>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button className="p-3 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors">
                <Bookmark className="h-5 w-5" />
              </button>
              <button className="p-3 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
              <Button 
                size="lg" 
                className="flex-1 md:flex-none py-3 shadow-lg shadow-blue-500/20" 
                onClick={handleApply}
                isLoading={isApplying}
                disabled={applied}
              >
                {applied ? 'Application Sent' : 'Apply Now'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6">
            
            {/* Short Info Grid */}
            <Card className="!p-0 overflow-hidden shadow-sm">
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-100">
                  <div className="bg-white p-5 flex flex-col">
                    <span className="text-xs text-slate-500 font-medium mb-1 flex items-center uppercase tracking-wider"><MapPin className="h-3.5 w-3.5 mr-1" /> Location</span>
                    <span className="text-sm font-semibold text-slate-800">New York, Remote</span>
                  </div>
                  <div className="bg-white p-5 flex flex-col">
                    <span className="text-xs text-slate-500 font-medium mb-1 flex items-center uppercase tracking-wider"><Briefcase className="h-3.5 w-3.5 mr-1" /> Type</span>
                    <span className="text-sm font-semibold text-slate-800">Full-time</span>
                  </div>
                  <div className="bg-white p-5 flex flex-col">
                    <span className="text-xs text-slate-500 font-medium mb-1 flex items-center uppercase tracking-wider"><DollarSign className="h-3.5 w-3.5 mr-1" /> Salary</span>
                    <span className="text-sm font-semibold text-slate-800">$120k - $150k</span>
                  </div>
                  <div className="bg-white p-5 flex flex-col">
                    <span className="text-xs text-slate-500 font-medium mb-1 flex items-center uppercase tracking-wider"><Clock className="h-3.5 w-3.5 mr-1" /> Posted</span>
                    <span className="text-sm font-semibold text-slate-800">2 days ago</span>
                  </div>
               </div>
            </Card>

            <Card title="Job Description" className="shadow-sm border-0">
              <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
                <p className="text-base leading-relaxed">
                  We are looking for a Senior React Developer to join our core engineering team. You will be responsible for building advanced UI components and driving the frontend architecture for our global recruiting platform.
                </p>
                
                <div>
                  <h4 className="text-lg text-slate-800 font-bold mb-3 flex items-center"><Target className="h-5 w-5 mr-2 text-[var(--color-primary)]" /> Key Responsibilities</h4>
                  <ul className="list-disc pl-5 space-y-2 text-slate-600">
                    <li>Develop highly responsive, scalable, and complex web applications using React.js.</li>
                    <li>Write clean, efficient, and maintainable code adhering to best practices.</li>
                    <li>Collaborate with product managers, designers, and backend engineers.</li>
                    <li>Optimize application performance for maximum speed and scalability.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg text-slate-800 font-bold mb-3 flex items-center"><Briefcase className="h-5 w-5 mr-2 text-[var(--color-primary)]" /> Requirements</h4>
                  <ul className="list-disc pl-5 space-y-2 text-slate-600">
                    <li>5+ years of professional experience with React and modern JavaScript.</li>
                    <li>Strong understanding of CSS frameworks like Tailwind CSS.</li>
                    <li>Experience with state management libraries (Redux, Zustand, Context API).</li>
                    <li>Excellent problem-solving and communication skills.</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card title="Required Skills" className="shadow-sm border-0">
              <div className="flex flex-wrap gap-2">
                {['React.js', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Redux', 'Git', 'REST APIs'].map(skill => (
                  <span key={skill} className="px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 text-sm rounded-lg font-medium hover:bg-white hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer">{skill}</span>
                ))}
              </div>
            </Card>
            
            <Card className="shadow-sm border-0" title="About the Company">
              <div className="text-center mb-6 pt-2">
                <div className="h-16 w-16 mx-auto rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary-active)] border border-[var(--color-primary)] flex items-center justify-center text-2xl font-bold mb-3 shadow-inner">
                  T
                </div>
                <h3 className="font-bold text-slate-800 text-lg">TechNova Inc.</h3>
                <Link to="/companies" className="text-sm text-[var(--color-primary)] font-medium hover:underline">View company profile</Link>
              </div>
              
              <div className="space-y-4 text-sm border-t border-slate-100 pt-5">
                <div className="flex items-center text-slate-600">
                  <Briefcase className="w-4 h-4 mr-3 text-slate-400" />
                  <span className="flex-1">Software Development</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <Users className="w-4 h-4 mr-3 text-slate-400" />
                  <span className="flex-1">500 - 1000 Employees</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <MapPin className="w-4 h-4 mr-3 text-slate-400" />
                  <span className="flex-1">San Francisco, CA</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
