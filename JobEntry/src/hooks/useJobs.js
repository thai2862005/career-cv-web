import { useState, useEffect } from 'react';
import { jobAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

/**
 * Hook to fetch all jobs
 */
export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    const response = await jobAPI.getAllJobs();
    setLoading(false);

    if (response.success) {
  const data = response.data;
  // thử các structure phổ biến
  const jobList = Array.isArray(data) ? data 
    : Array.isArray(data?.jobs) ? data.jobs
    : Array.isArray(data?.data) ? data.data
    : [];
  setJobs(jobList);
}
  };

  return { jobs, loading, error, refetch: fetchJobs };
};

/**
 * Hook to fetch single job by ID
 */
export const useJobById = (jobId) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const fetchJob = async () => {
    setLoading(true);
    setError(null);
    const response = await jobAPI.getJobById(jobId);
    setLoading(false);

    if (response.success) {
      setJob(response.data);
    } else {
      setError(response.error);
    }
  };

  return { job, loading, error, refetch: fetchJob };
};

/**
 * Hook to fetch saved jobs
 */
export const useSavedJobs = () => {
  const { token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      fetchSavedJobs();
    }
  }, [token]);

  const fetchSavedJobs = async () => {
    setLoading(true);
    setError(null);
    const response = await jobAPI.getSavedJobs(token);
    setLoading(false);

    if (response.success) {
      setJobs(response.data || []);
    } else {
      setError(response.error);
    }
  };

  const saveJob = async (jobId) => {
    const response = await jobAPI.saveJob(jobId, token);
    if (response.success) {
      fetchSavedJobs();
    }
    return response;
  };

  const unsaveJob = async (jobId) => {
    const response = await jobAPI.unsaveJob(jobId, token);
    if (response.success) {
      fetchSavedJobs();
    }
    return response;
  };

  return { jobs, loading, error, saveJob, unsaveJob, refetch: fetchSavedJobs };
};
