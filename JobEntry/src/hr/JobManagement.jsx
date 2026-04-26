import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Table } from '../components/Table';
import { Badge, Input, Select } from '../components/Forms';
import { Modal } from '../components/Modal';
import { Plus, Edit, Trash2, StopCircle, AlertCircle, Check } from 'lucide-react';
import { jobAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const HRJobManagement = () => {
  // Auth hook
  const { user, token } = useAuth();
  
  // States
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [successMessage, setSuccessMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    type: 'Full-time',
    location: '',
    salary: '',
    requirements: '',
  });

  // Access control - only HR can access
  const isHR = user?.role === 'HR';

  // Fetch jobs on mount
  useEffect(() => {
    if (isHR && token) {
      fetchJobs();
    }
  }, [isHR, token]);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    const response = await jobAPI.getMyJobs(token);
    
    if (response.success) {
      setJobs(response.data.data || response.data);
    } else {
      setError(response.error || 'Failed to fetch jobs');
    }
    setLoading(false);
  };

  const handleOpenModal = (job = null) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        title: job.title,
        description: job.description || '',
        department: job.department || '',
        type: job.type || 'Full-time',
        location: job.location || '',
        salary: job.salary || '',
        requirements: job.requirements || '',
      });
    } else {
      setEditingJob(null);
      setFormData({
        title: '',
        description: '',
        department: '',
        type: 'Full-time',
        location: '',
        salary: '',
        requirements: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (editingJob) {
        // Update job
        response = await jobAPI.updateJob(editingJob._id, formData, token);
      } else {
        // Create new job
        response = await jobAPI.createJob(formData, token);
      }

      if (response.success) {
        setSuccessMessage(editingJob ? 'Job updated successfully!' : 'Job created successfully!');
        handleCloseModal();
        fetchJobs();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.error || 'Failed to save job');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    setLoading(true);
    const response = await jobAPI.deleteJob(jobId, token);

    if (response.success) {
      setSuccessMessage('Job deleted successfully!');
      fetchJobs();
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setError(response.error || 'Failed to delete job');
    }
    setLoading(false);
  };

  const handleToggleStatus = async (jobId) => {
    setLoading(true);
    const response = await jobAPI.toggleJobStatus(jobId, token);

    if (response.success) {
      setSuccessMessage('Job status updated!');
      fetchJobs();
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setError(response.error || 'Failed to update job status');
    }
    setLoading(false);
  };

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    if (statusFilter !== 'All Statuses' && job.status !== statusFilter) return false;
    if (departmentFilter !== 'All Departments' && job.department !== departmentFilter) return false;
    return true;
  });

  // Table columns
  const columns = [
    { 
      header: 'Job ID', 
      cell: (row) => <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">{row._id?.slice(-6) || 'N/A'}</span> 
    },
    { 
      header: 'Job Title', 
      cell: (row) => (
        <div>
          <p className="font-medium text-slate-800">{row.title}</p>
          <p className="text-xs text-slate-500">{row.department} • {row.type}</p>
        </div>
      ) 
    },
    { 
      header: 'Location', 
      cell: (row) => <span className="text-slate-700">{row.location || 'N/A'}</span> 
    },
    { 
      header: 'Posted Date', 
      cell: (row) => new Date(row.createdAt).toLocaleDateString() 
    },
    { 
      header: 'Status', 
      cell: (row) => {
        let variant = 'gray';
        if (row.status === 'Active') variant = 'green';
        if (row.status === 'Draft') variant = 'yellow';
        if (row.status === 'Closed') variant = 'red';
        return <Badge variant={variant}>{row.status}</Badge>;
      }
    },
    { 
      header: 'Actions', 
      cell: (row) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => handleOpenModal(row)}
            className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleToggleStatus(row._id)}
            className="p-1.5 text-slate-400 hover:text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
            title="Toggle Status"
          >
            <StopCircle className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleDeleteJob(row._id)}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  // Access check
  if (!isHR) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <div className="flex flex-col items-center text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">Access Denied</h2>
            <p className="text-slate-600">You do not have permission to access this page. Only HR users can manage jobs.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <Check className="h-5 w-5" />
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Job Management</h1>
          <p className="text-slate-500 mt-1">Create, edit, and manage your job postings.</p>
        </div>
        <Button 
          onClick={() => handleOpenModal()}
          className="flex text-sm"
          disabled={loading}
        >
          <Plus className="h-4 w-4 mr-2" /> Post New Job
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-wrap gap-4">
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-300 rounded-md text-sm py-2 px-3 focus:ring-2 focus:ring-[var(--color-primary)]"
        >
          <option>All Statuses</option>
          <option>Active</option>
          <option>Draft</option>
          <option>Closed</option>
        </select>
        <select 
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="border border-slate-300 rounded-md text-sm py-2 px-3 focus:ring-2 focus:ring-[var(--color-primary)]"
        >
          <option>All Departments</option>
          <option>Engineering</option>
          <option>Design</option>
          <option>Product</option>
          <option>Marketing</option>
          <option>Sales</option>
          <option>HR</option>
        </select>
      </div>

      {/* Jobs Table */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-slate-500">Loading jobs...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-slate-500">No jobs found. Create your first job posting!</p>
          </div>
        </Card>
      ) : (
        <>
          <Card className="!p-0 border-0 shadow-none bg-transparent">
            <Table columns={columns} data={filteredJobs} />
          </Card>
          
          <div className="flex justify-between items-center text-sm text-slate-500 mt-4">
            <span>Showing 1 to {filteredJobs.length} of {jobs.length} entries</span>
          </div>
        </>
      )}

      {/* Create/Edit Job Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingJob ? 'Edit Job' : 'Post New Job'}
        footer={
          <>
            <Button 
              variant="secondary"
              onClick={handleCloseModal}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveJob}
              disabled={loading}
            >
              {loading ? 'Saving...' : (editingJob ? 'Update Job' : 'Post Job')}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveJob} className="space-y-4">
          <Input
            label="Job Title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleFormChange}
            placeholder="e.g., Senior React Developer"
            required
          />

          <Select
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleFormChange}
            options={[
              { value: 'Engineering', label: 'Engineering' },
              { value: 'Design', label: 'Design' },
              { value: 'Product', label: 'Product' },
              { value: 'Marketing', label: 'Marketing' },
              { value: 'Sales', label: 'Sales' },
              { value: 'HR', label: 'HR' },
            ]}
            required
          />

          <Select
            label="Job Type"
            name="type"
            value={formData.type}
            onChange={handleFormChange}
            options={[
              { value: 'Full-time', label: 'Full-time' },
              { value: 'Part-time', label: 'Part-time' },
              { value: 'Contract', label: 'Contract' },
              { value: 'Internship', label: 'Internship' },
            ]}
            required
          />

          <Input
            label="Location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleFormChange}
            placeholder="e.g., Remote, New York, NY"
          />

          <Input
            label="Salary Range"
            name="salary"
            type="text"
            value={formData.salary}
            onChange={handleFormChange}
            placeholder="e.g., $80,000 - $120,000"
          />

          <div className="flex flex-col space-y-1 mb-4">
            <label className="text-sm font-medium text-slate-700">Job Description</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Enter job description..."
              className="px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-shadow text-slate-800 min-h-32"
              required
            />
          </div>

          <div className="flex flex-col space-y-1 mb-4">
            <label className="text-sm font-medium text-slate-700">Requirements</label>
            <textarea 
              name="requirements"
              value={formData.requirements}
              onChange={handleFormChange}
              placeholder="Enter job requirements (one per line)..."
              className="px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-shadow text-slate-800 min-h-32"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
