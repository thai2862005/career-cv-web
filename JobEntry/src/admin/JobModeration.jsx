import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Badge } from '../components/Forms';
import { Check, X, ShieldAlert, Eye, Loader } from 'lucide-react';
import { jobAPI, getAuthToken } from '../services/api';

export const AdminJobModeration = () => {
  const [pendingJobs, setPendingJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('pending');
  const [rejectReason, setRejectReason] = useState({});
  const [showRejectModal, setShowRejectModal] = useState(null);

  const token = getAuthToken();

  // Fetch pending jobs on mount
  useEffect(() => {
    fetchPendingJobs();
  }, []);

  const fetchPendingJobs = async () => {
    setLoading(true);
    setError(null);
    const result = await jobAPI.getPendingJobs(token);
    if (result.success) {
      // Safely extract array from potential nested API response formats
      const rawData = result.data;
      const dataArray = Array.isArray(rawData) ? rawData : 
                        (Array.isArray(rawData?.data) ? rawData.data : 
                        (Array.isArray(rawData?.items) ? rawData.items : 
                        (Array.isArray(rawData?.content) ? rawData.content : [])));
      setPendingJobs(dataArray);
    } else {
      setError(result.error || 'Failed to fetch jobs');
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
        <h1 className="text-2xl font-bold text-slate-800">Job Post Moderation</h1>
        <p className="text-slate-500 mt-1">Review flagged jobs and ensure platform quality.</p>
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
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {pendingJobs.map((job, idx) => {
          if (!job) return null;
          return (
          <Card key={job.id || idx} title={`Review Request: ${job.id || 'Unknown'}`} className={job.risk === 'High' ? 'border-red-200' : ''}>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{job.title || 'Untitled'}</h3>
                  <p className="text-sm font-medium text-[var(--color-primary)]">{job.company || 'Unknown Company'}</p>
                  <p className="text-xs text-slate-400 mt-1">Posted {job.posted || 'Recently'}</p>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm text-slate-600">
                  <p className="line-clamp-3">
                    {job.description || 'We are looking for a reliable individual to work from home. No experience needed! Earn quick money by simply typing documents. Apply today and start tomorrow. Wire transfer accepted ...'}
                  </p>
                  <button className="text-[var(--color-primary)] font-medium mt-2 flex items-center hover:underline">
                    <Eye className="h-4 w-4 mr-1" /> View Full Description
                  </button>
                </div>
              </div>
              
              <div className="w-full md:w-72 flex flex-col space-y-4">
                <div className={`p-4 rounded-lg flex items-start space-x-3 ${job.risk === 'High' ? 'bg-red-50 border border-red-100' : 'bg-yellow-50 border border-yellow-100'}`}>
                  <ShieldAlert className={`h-5 w-5 mt-0.5 ${job.risk === 'High' ? 'text-red-500' : 'text-yellow-500'}`} />
                  <div>
                    <h4 className={`text-sm font-bold ${job.risk === 'High' ? 'text-red-800' : 'text-yellow-800'}`}>System Flag: {job.risk || 'Medium'} Risk</h4>
                    <p className={`text-xs mt-1 ${job.risk === 'High' ? 'text-red-600' : 'text-yellow-700'}`}>{job.reason || 'Flagged for review'}</p>
                  </div>
                </div>

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
        )})}
        {pendingJobs.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Check className="h-12 w-12 mx-auto text-green-300 mb-4" />
            <p className="text-lg font-medium text-slate-700">All caught up!</p>
            <p>No jobs pending moderation at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
};
