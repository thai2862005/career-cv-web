import React from 'react';
import { Card } from '../components/Card';
import { Badge } from '../components/Forms';
import { Briefcase, Bookmark, FileText, Clock } from 'lucide-react';

export const CandidateDashboard = () => {
  const stats = [
    { title: 'Applied Jobs', count: 12, icon: <Briefcase className="text-blue-500" />, bg: 'bg-blue-50' },
    { title: 'Saved Jobs', count: 5, icon: <Bookmark className="text-purple-500" />, bg: 'bg-purple-50' },
    { title: 'Interviews', count: 2, icon: <Clock className="text-green-500" />, bg: 'bg-green-50' },
    { title: 'CV Views', count: 48, icon: <FileText className="text-orange-500" />, bg: 'bg-orange-50' },
  ];

  const recentApplications = [
    { title: 'Frontend Developer', company: 'TechCorp', status: 'Reviewing', date: 'Oct 12, 2026' },
    { title: 'UX Designer', company: 'DesignStudio', status: 'Interview', date: 'Oct 09, 2026' },
    { title: 'React Engineer', company: 'WebSolutions', status: 'Rejected', date: 'Oct 01, 2026' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Reviewing': return <Badge variant="blue">Reviewing</Badge>;
      case 'Interview': return <Badge variant="green">Interview</Badge>;
      case 'Rejected': return <Badge variant="red">Rejected</Badge>;
      default: return <Badge variant="gray">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Welcome back, John!</h1>
        <p className="text-slate-500 mt-1">Here is what's happening with your job applications today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="flex items-center space-x-4 p-2">
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-800">{stat.count}</p>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Recent Applications" className="col-span-2">
          <div className="space-y-4">
            {recentApplications.map((app, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-md bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary-active)] font-bold text-xl">
                    {app.company.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{app.title}</h4>
                    <p className="text-sm text-slate-500">{app.company} • {app.date}</p>
                  </div>
                </div>
                <div>{getStatusBadge(app.status)}</div>
              </div>
            ))}
          </div>
        </Card>
        
        <Card title="Profile Completion">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="relative h-32 w-32 mb-4 drop-shadow-md">
              <svg className="h-full w-full" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="currentColor" strokeWidth="3"
                />
                <path
                  className="text-[var(--color-primary)] animate-[stroke_2s_ease-out]"
                  strokeDasharray="80, 100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-bold text-slate-800">80%</span>
              </div>
            </div>
            <h4 className="font-semibold text-slate-800">Almost there!</h4>
            <p className="text-sm text-slate-500 mt-2 mb-4">Complete your profile to increase your chances of getting hired.</p>
            <button className="text-[var(--color-primary)] font-medium text-sm hover:underline">Complete Profile</button>
          </div>
        </Card>
      </div>
    </div>
  );
};
