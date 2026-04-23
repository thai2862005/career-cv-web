import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Table } from '../components/Table';
import { Badge } from '../components/Forms';
import { Plus, MoreHorizontal, Edit, Trash2, StopCircle } from 'lucide-react';

export const HRJobManagement = () => {
  const jobs = [
    { id: 'JOB-001', title: 'Senior React Developer', department: 'Engineering', type: 'Full-time', applicants: 45, status: 'Active', postedAt: 'Oct 10, 2026' },
    { id: 'JOB-002', title: 'UX/UI Designer', department: 'Design', type: 'Full-time', applicants: 128, status: 'Active', postedAt: 'Oct 12, 2026' },
    { id: 'JOB-003', title: 'Product Manager', department: 'Product', type: 'Full-time', applicants: 32, status: 'Draft', postedAt: '-' },
    { id: 'JOB-004', title: 'Marketing Specialist', department: 'Marketing', type: 'Contract', applicants: 89, status: 'Closed', postedAt: 'Sep 15, 2026' },
  ];

  const columns = [
    { header: 'Job ID', cell: (row) => <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">{row.id}</span> },
    { header: 'Job Title', cell: (row) => (
        <div>
          <p className="font-medium text-slate-800">{row.title}</p>
          <p className="text-xs text-slate-500">{row.department} • {row.type}</p>
        </div>
      ) 
    },
    { header: 'Applicants', cell: (row) => <span className="font-semibold text-slate-700">{row.applicants}</span> },
    { header: 'Posted Date', accessorKey: 'postedAt' },
    { header: 'Status', cell: (row) => {
        let variant = 'gray';
        if (row.status === 'Active') variant = 'green';
        if (row.status === 'Draft') variant = 'yellow';
        return <Badge variant={variant}>{row.status}</Badge>;
      }
    },
    { header: 'Actions', cell: () => (
        <div className="flex space-x-2">
          <button className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"><Edit className="h-4 w-4" /></button>
          <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"><StopCircle className="h-4 w-4" /></button>
          <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 className="h-4 w-4" /></button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Job Management</h1>
          <p className="text-slate-500 mt-1">Create, edit, and manage your job postings.</p>
        </div>
        <Button className="flex text-sm"><Plus className="h-4 w-4 mr-2" /> Post New Job</Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-wrap gap-4">
        <select className="border-slate-200 rounded-md text-sm py-2 px-3 focus:ring-[var(--color-primary)]">
          <option>All Statuses</option>
          <option>Active</option>
          <option>Draft</option>
          <option>Closed</option>
        </select>
        <select className="border-slate-200 rounded-md text-sm py-2 px-3 focus:ring-[var(--color-primary)]">
          <option>All Departments</option>
          <option>Engineering</option>
          <option>Design</option>
          <option>Marketing</option>
        </select>
        <div className="flex-1"></div>
        <div className="flex items-center space-x-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
          <button className="px-3 py-1 bg-white shadow-sm rounded-md text-sm font-medium text-slate-800">List</button>
          <button className="px-3 py-1 text-sm font-medium text-slate-500 hover:text-slate-800">Grid</button>
        </div>
      </div>

      <Card className="!p-0 border-0 shadow-none bg-transparent">
        <Table columns={columns} data={jobs} />
      </Card>
      
      <div className="flex justify-between items-center text-sm text-slate-500 mt-4">
        <span>Showing 1 to 4 of 4 entries</span>
        <div className="flex space-x-1">
          <Button variant="secondary" size="sm" disabled>Previous</Button>
          <Button variant="secondary" size="sm" disabled>Next</Button>
        </div>
      </div>
    </div>
  );
};
