import { useState, useEffect } from "react";
import { jobAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

/**
 * Hook to fetch all jobs with auto-refresh and real-time updates
 */
export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch jobs immediately on mount
    fetchJobs();

    // Set up interval to refetch jobs every 30 seconds
    // This ensures newly approved jobs appear on the home page
    const pollInterval = setInterval(() => {
      fetchJobs();
    }, 30000); // 30 seconds

    // Listen for job approval events from admin
    const handleJobApproved = (event) => {
      if (event.key === "jobApproved") {
        // Refetch jobs immediately when admin approves a job
        fetchJobs();
      }
    };

    window.addEventListener("storage", handleJobApproved);

    // Cleanup
    return () => {
      clearInterval(pollInterval);
      window.removeEventListener("storage", handleJobApproved);
    };
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    const response = await jobAPI.getAllJobs();
    setLoading(false);

    if (response.success) {
      const data = response.data;
      // Try common response structures
      const jobList = Array.isArray(data)
        ? data
        : Array.isArray(data?.jobs)
          ? data.jobs
          : Array.isArray(data?.data)
            ? data.data
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
