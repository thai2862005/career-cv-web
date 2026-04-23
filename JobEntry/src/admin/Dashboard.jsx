import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Users, Briefcase, FileWarning, DollarSign, Loader } from 'lucide-react';
import { Table } from '../components/Table';
import { Badge } from '../components/Forms';
import { jobAPI, userAPI, getAuthToken } from '../services/api';

export const AdminDashboard = () => {
  const [stats, setStats] = useState([
    { title: 'Total Users', count: '0', icon: <Users className="text-blue-500" />, bg: 'bg-blue-50' },
    { title: 'Active Jobs', count: '0', icon: <Briefcase className="text-purple-500" />, bg: 'bg-purple-50' },
    { title: 'Revenue (MTD)', count: '$0', icon: <DollarSign className="text-green-500" />, bg: 'bg-green-50' },
    { title: 'Pending Reports', count: 0, icon: <FileWarning className="text-red-500" />, bg: 'bg-red-50' },
  ]);

  const [recentActivity, setRecentActivity] = useState([
    { user: 'system', action: 'Dashboard loaded', time: 'Just now', type: 'system' },
  ]);

  const [pendingModerations, setPendingModerations] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = getAuthToken();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch pending jobs for moderation
      const jobsResult = await jobAPI.getPendingJobs(token);
      const usersResult = await userAPI.getAllUsers(token);

      if (jobsResult.success && jobsResult.data) {
        const jobsData = Array.isArray(jobsResult.data) ? jobsResult.data : 
                         (Array.isArray(jobsResult.data?.data) ? jobsResult.data.data : 
                         (Array.isArray(jobsResult.data?.items) ? jobsResult.data.items : 
                         (Array.isArray(jobsResult.data?.content) ? jobsResult.data.content : [])));
                         
        const usersData = Array.isArray(usersResult.data) ? usersResult.data : 
                          (Array.isArray(usersResult.data?.data) ? usersResult.data.data : 
                          (Array.isArray(usersResult.data?.items) ? usersResult.data.items : 
                          (Array.isArray(usersResult.data?.content) ? usersResult.data.content : [])));

        setPendingModerations(jobsData.slice(0, 5)); // Show first 5
        
        setStats([
          { 
            title: 'Total Users', 
            count: usersData.length || '0', 
            icon: <Users className="text-blue-500" />, 
            bg: 'bg-blue-50' 
          },
          { 
            title: 'Pending Jobs', 
            count: jobsData.length || '0', 
            icon: <Briefcase className="text-purple-500" />, 
            bg: 'bg-purple-50' 
          },
          { 
            title: 'Revenue (MTD)', 
            count: '$45,200', 
            icon: <DollarSign className="text-green-500" />, 
            bg: 'bg-green-50' 
          },
          { 
            title: 'Flagged Content', 
            count: jobsData.filter(j => j.risk === 'High').length || 0, 
            icon: <FileWarning className="text-red-500" />, 
            bg: 'bg-red-50' 
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">System Dashboard</h1>
        <p className="text-slate-500 mt-1">Platform overview, metrics and recent system activities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="flex items-center space-x-4 p-2 transition-transform hover:-translate-y-1 duration-300">
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stat.count}</p>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Jobs Requiring Attention" className="col-span-2">
          <div className="overflow-x-auto">
            {pendingModerations.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 font-medium rounded-tl-lg">Company</th>
                    <th className="px-4 py-3 font-medium">Job Title</th>
                    <th className="px-4 py-3 font-medium">Flag Reason</th>
                    <th className="px-4 py-3 font-medium rounded-tr-lg">Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm border border-t-0 border-slate-100 rounded-b-lg">
                  {pendingModerations.map((mod, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-700">{mod.company}</td>
                      <td className="px-4 py-3 text-slate-600">{mod.title}</td>
                      <td className="px-4 py-3"><Badge variant="yellow">{mod.reason}</Badge></td>
                      <td className="px-4 py-3">
                        <Badge variant={mod.risk === 'High' ? 'red' : 'yellow'}>{mod.risk}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p className="font-medium">No pending jobs</p>
                <p className="text-sm">All jobs have been moderated</p>
              </div>
            )}
          </div>
        </Card>
        
        <Card title="Activity Log">
          <div className="space-y-4">
            {recentActivity.map((log, idx) => (
              <div key={idx} className="flex items-start space-x-3">
                <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${log.type === 'system' ? 'bg-blue-400' : log.type === 'billing' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <div className="flex flex-col">
                  <span className="text-sm text-slate-700"><strong>{log.user}</strong> {log.action}</span>
                  <span className="text-xs text-slate-400">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
