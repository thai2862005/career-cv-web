import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Badge } from '../components/Forms';
import { Check, X, ShieldAlert, Eye, Loader, Plus, Edit2, Trash2, ChevronDown, Briefcase } from 'lucide-react';
import { jobAPI, getAuthToken } from '../services/api';

export const AdminJobModeration = () => {
  const [allJobs, setAllJobs] = useState([]);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('pending');
  const [rejectReason, setRejectReason] = useState({});
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary_range: '',
    job_type: '',
    category: '',
    experience_level: ''
  });

  const token = getAuthToken();

  // Fetch jobs on mount
  useEffect(() => {
    fetchAllJobs();
  }, []);

  const fetchAllJobs = async () => {
    setLoading(true);
    setError(null);
    
    // Fetch all jobs (admin view)
    const allJobsResult = await jobAPI.getAllJobsAdmin(token);
    // Fetch pending jobs
    const pendingResult = await jobAPI.getPendingJobs(token);
    
    if (allJobsResult.success) {
      const rawData = allJobsResult.data;
      const dataArray = Array.isArray(rawData) ? rawData : 
                        (Array.isArray(rawData?.data) ? rawData.data : 
                        (Array.isArray(rawData?.items) ? rawData.items : 
                        (Array.isArray(rawData?.content) ? rawData.content : [])));
      setAllJobs(dataArray);
    }

    if (pendingResult.success) {
      const rawData = pendingResult.data;
      const dataArray = Array.isArray(rawData) ? rawData : 
                        (Array.isArray(rawData?.data) ? rawData.data : 
                        (Array.isArray(rawData?.items) ? rawData.items : 
                        (Array.isArray(rawData?.content) ? rawData.content : [])));
      setPendingJobs(dataArray);
    } else {
      setError(pendingResult.error || 'Failed to fetch jobs');
    }
    setLoading(false);
  };

  const handleApproveJob = async (jobId) => {
    setActionLoading(jobId);
    const result = await jobAPI.approveJob(jobId, token);
    
    if (result.success) {
      setPendingJobs(pendingJobs.filter(job => job.id !== jobId));
      alert('Job approved successfully!');
    } else {
      alert(`Error: ${result.error}`);
    }
    setActionLoading(null);
  };

  const handleRejectJob = async (jobId) => {
    if (!rejectReason[jobId] || !rejectReason[jobId].trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setActionLoading(jobId);
    const result = await jobAPI.rejectJob(jobId, rejectReason[jobId], token);
    
    if (result.success) {
      setPendingJobs(pendingJobs.filter(job => job.id !== jobId));
      setRejectReason(prev => ({ ...prev, [jobId]: '' }));
      setShowRejectModal(null);
      alert('Job rejected successfully!');
    } else {
      alert(`Error: ${result.error}`);
    }
    setActionLoading(null);
  };

  const handleCreateJob = async () => {
    if (!formData.title || !formData.description) {
      alert('Please fill in required fields');
      return;
    }

    setActionLoading('create');
    const result = await jobAPI.createJob(formData, token);
    
    if (result.success) {
      setFormData({
        title: '',
        description: '',
        location: '',
        salary_range: '',
        job_type: '',
        category: '',
        experience_level: ''
      });
      setShowCreateModal(false);
      await fetchAllJobs();
      alert('Job created successfully!');
    } else {
      alert(`Error: ${result.error}`);
    }
    setActionLoading(null);
  };

  const handleEditJob = async () => {
    if (!formData.title || !formData.description) {
      alert('Please fill in required fields');
      return;
    }

    setActionLoading('edit');
    const result = await jobAPI.updateJobAdmin(showEditModal, formData, token);
    
    if (result.success) {
      setFormData({
        title: '',
        description: '',
        location: '',
        salary_range: '',
        job_type: '',
        category: '',
        experience_level: ''
      });
      setShowEditModal(null);
      await fetchAllJobs();
      alert('Job updated successfully!');
    } else {
      alert(`Error: ${result.error}`);
    }
    setActionLoading(null);
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    setActionLoading(jobId);
    const result = await jobAPI.deleteJobAdmin(jobId, token);
    
    if (result.success) {
      await fetchAllJobs();
      alert('Job deleted successfully!');
    } else {
      alert(`Error: ${result.error}`);
    }
    setActionLoading(null);
  };

  const openEditModal = (job) => {
    setFormData({
      title: job.title || '',
      description: job.description || '',
      location: job.location || '',
      salary_range: job.salary_range || '',
      job_type: job.job_type || '',
      category: job.category || '',
      experience_level: job.experience_level || ''
    });
    setShowEditModal(job.id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const jobsToDisplay = selectedFilter === 'pending' ? pendingJobs : allJobs;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Job Management</h1>
          <p className="text-slate-500 mt-1">Manage, create, and moderate job posts.</p>
        </div>
        <button 
          onClick={() => {
            setFormData({
              title: '',
              description: '',
              location: '',
              salary_range: '',
              job_type: '',
              category: '',
              experience_level: ''
            });
            setShowCreateModal(true);
          }}
          className="flex items-center space-x-2 bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          <span>Create Job</span>
        </button>
      </div>

      <div className="flex space-x-2 flex-wrap gap-2">
        <button 
          onClick={() => setSelectedFilter('pending')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            selectedFilter === 'pending' 
              ? 'bg-[var(--color-primary)] text-white' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Pending Review ({pendingJobs.length})
        </button>
        <button 
          onClick={() => setSelectedFilter('all')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            selectedFilter === 'all' 
              ? 'bg-[var(--color-primary)] text-white' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Jobs ({allJobs.length})
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Jobs Display */}
      <div className="grid gap-6">
        {selectedFilter === 'pending' ? (
          // Pending Jobs View
          <>
            {pendingJobs.map((job, idx) => (
              <Card key={job.id || idx} title={`Review Request: ${job.title || 'Unknown'}`} className={job.risk === 'High' ? 'border-red-200' : ''}>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{job.title || 'Untitled'}</h3>
                      <p className="text-sm font-medium text-[var(--color-primary)]">{job.company || 'Unknown Company'}</p>
                      <p className="text-xs text-slate-400 mt-1">Posted {job.posted_date || 'Recently'}</p>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm text-slate-600">
                      <p className="line-clamp-3">
                        {job.description || 'No description provided'}
                      </p>
                      <button className="text-[var(--color-primary)] font-medium mt-2 flex items-center hover:underline">
                        <Eye className="h-4 w-4 mr-1" /> View Full Description
                      </button>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-72 flex flex-col space-y-4">
                    {job.risk && (
                      <div className={`p-4 rounded-lg flex items-start space-x-3 ${job.risk === 'High' ? 'bg-red-50 border border-red-100' : 'bg-yellow-50 border border-yellow-100'}`}>
                        <ShieldAlert className={`h-5 w-5 mt-0.5 ${job.risk === 'High' ? 'text-red-500' : 'text-yellow-500'}`} />
                        <div>
                          <h4 className={`text-sm font-bold ${job.risk === 'High' ? 'text-red-800' : 'text-yellow-800'}`}>System Flag: {job.risk} Risk</h4>
                          <p className={`text-xs mt-1 ${job.risk === 'High' ? 'text-red-600' : 'text-yellow-700'}`}>{job.reason || 'Flagged for review'}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 mt-auto pt-4">
                      <button 
                        onClick={() => handleApproveJob(job.id)}
                        disabled={!job.id || actionLoading === job.id}
                        className="flex-1 flex items-center justify-center py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-lg font-medium text-sm transition-colors text-center"
                      >
                        {actionLoading === job.id ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-1" /> Approve
                          </>
                        )}
                      </button>
                      <button 
                        onClick={() => setShowRejectModal(job.id)}
                        disabled={!job.id || actionLoading === job.id}
                        className="flex-1 flex items-center justify-center py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg font-medium text-sm transition-colors text-center"
                      >
                        <X className="h-4 w-4 mr-1" /> Reject
                      </button>
                    </div>

                    {showRejectModal === job.id && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <label className="block text-xs font-medium text-slate-700 mb-2">Rejection Reason</label>
                        <textarea
                          value={rejectReason[job.id] || ''}
                          onChange={(e) => setRejectReason(prev => ({ ...prev, [job.id]: e.target.value }))}
                          placeholder="Explain why this job is being rejected..."
                          className="w-full px-3 py-2 text-xs border border-red-200 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                          rows="3"
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleRejectJob(job.id)}
                            disabled={actionLoading === job.id}
                            className="flex-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-md transition-colors"
                          >
                            Confirm Reject
                          </button>
                          <button
                            onClick={() => setShowRejectModal(null)}
                            className="flex-1 px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium rounded-md transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
            {pendingJobs.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <Check className="h-12 w-12 mx-auto text-green-300 mb-4" />
                <p className="text-lg font-medium text-slate-700">All caught up!</p>
                <p>No jobs pending moderation at this time.</p>
              </div>
            )}
          </>
        ) : (
          // All Jobs View - Table Format
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Job Title</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Company</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Location</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Type</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-3 text-center font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allJobs.map((job, idx) => (
                  <tr key={job.id || idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{job.title || 'Untitled'}</td>
                    <td className="px-6 py-4 text-slate-600">{job.company || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-600">{job.location || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <Badge className="text-xs">{job.job_type || 'Full-time'}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={`text-xs ${job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                        {job.status || 'Active'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEditModal(job)}
                          disabled={actionLoading === job.id}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Edit job"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          disabled={actionLoading === job.id}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete job"
                        >
                          {actionLoading === job.id ? (
                            <Loader className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {allJobs.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <Briefcase className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                <p className="text-lg font-medium text-slate-700">No jobs found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">
                {showEditModal ? 'Edit Job' : 'Create New Job'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(null);
                }}
                className="text-slate-500 hover:text-slate-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter job title"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter job description"
                  rows="5"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="e.g., Ho Chi Minh City"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={formData.salary_range}
                    onChange={(e) => setFormData({...formData, salary_range: e.target.value})}
                    placeholder="e.g., $30k - $50k"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Job Type</label>
                  <select
                    value={formData.job_type}
                    onChange={(e) => setFormData({...formData, job_type: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  >
                    <option value="">Select type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    placeholder="e.g., IT, Marketing"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Experience Level</label>
                  <select
                    value={formData.experience_level}
                    onChange={(e) => setFormData({...formData, experience_level: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  >
                    <option value="">Select level</option>
                    <option value="Entry">Entry</option>
                    <option value="Mid">Mid</option>
                    <option value="Senior">Senior</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6 border-t border-slate-200 pt-4">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(null);
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={showEditModal ? handleEditJob : handleCreateJob}
                  disabled={actionLoading === 'create' || actionLoading === 'edit'}
                  className="flex-1 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 font-medium transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {(actionLoading === 'create' || actionLoading === 'edit') && (
                    <Loader className="h-4 w-4 animate-spin" />
                  )}
                  {showEditModal ? 'Update Job' : 'Create Job'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
