import React from 'react';
import { Card } from '../components/Card';
import { Table } from '../components/Table';
import { Badge } from '../components/Forms';
import { Users, Briefcase, CheckCircle, Clock } from 'lucide-react';

export const HRDashboard = () => {
  const stats = [
    { title: 'Active Jobs', count: 8, icon: <Briefcase className="text-blue-500" />, bg: 'bg-blue-50' },
    { title: 'Total Candidates', count: 245, icon: <Users className="text-purple-500" />, bg: 'bg-purple-50' },
    { title: 'Hired This Month', count: 12, icon: <CheckCircle className="text-green-500" />, bg: 'bg-green-50' },
    { title: 'Pending Reviews', count: 34, icon: <Clock className="text-orange-500" />, bg: 'bg-orange-50' },
  ];

  const recentCandidates = [
    { name: 'Sarah Jenkins', role: 'UX Designer', applied: '2 hours ago', status: 'New', score: '95%' },
    { name: 'Michael Chen', role: 'React Developer', applied: '5 hours ago', status: 'Screening', score: '88%' },
    { name: 'David Smith', role: 'Project Manager', applied: '1 day ago', status: 'Interview', score: '92%' },
    { name: 'Emma Wilson', role: 'Data Analyst', applied: '2 days ago', status: 'Offer', score: '98%' },
  ];

  const columns = [
    { header: 'Candidate Name', cell: (row) => <span className="font-medium text-slate-800">{row.name}</span> },
    { header: 'Applied Role', accessorKey: 'role' },
    { header: 'Applied At', accessorKey: 'applied' },
    { header: 'Match Score', cell: (row) => <span className="text-[var(--color-primary)] font-semibold">{row.score}</span> },
    { header: 'Status', cell: (row) => {
      let variant = 'gray';
      if (row.status === 'New') variant = 'blue';
      if (row.status === 'Interview') variant = 'yellow';
      if (row.status === 'Offer') variant = 'green';
      return <Badge variant={variant}>{row.status}</Badge>;
    }},
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Recruitment Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of your current hiring pipeline and metrics.</p>
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
        <Card title="Recent Applications" className="col-span-2 overflow-hidden" actions={<button className="text-sm font-medium text-[var(--color-primary)] hover:underline">View All</button>}>
          <div className="border border-slate-100 rounded-lg overflow-hidden">
             <Table columns={columns} data={recentCandidates} />
          </div>
        </Card>
        
        <Card title="Hiring Funnel">
          <div className="space-y-4 pt-2">
            {[
              { label: 'Sourced', count: 1200, percent: 100 },
              { label: 'Applied', count: 450, percent: 37 },
              { label: 'Screened', count: 180, percent: 15 },
              { label: 'Interviewed', count: 60, percent: 5 },
              { label: 'Hired', count: 12, percent: 1 },
            ].map((step, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">{step.label}</span>
                  <span className="text-slate-500">{step.count} ({step.percent}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-[var(--color-primary)] h-2 rounded-full" style={{ width: `${step.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
