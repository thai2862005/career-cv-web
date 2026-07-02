import React, { useState, useEffect } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import {
  MapPin,
  Briefcase,
  Bookmark,
  Loader,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jobAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export const CandidateSavedJobs = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unsavingId, setUnsavingId] = useState(null);

  useEffect(() => {
    fetchSavedJobs();
  }, [token]);

  const fetchSavedJobs = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const response = await jobAPI.getSavedJobs(token);
    if (response.success) {
      const data = response.data;
      const savedArray = Array.isArray(data)
        ? data
        : data?.data || data?.savedJobs || [];
      setSavedJobs(savedArray);
    }
    setLoading(false);
  };

  const handleUnsave = async (e, jobId) => {
    e.stopPropagation();
    if (!token) return;

    setUnsavingId(jobId);
    const response = await jobAPI.unsaveJob(jobId, token);

    if (response.success) {
      setSavedJobs((prev) =>
        prev.filter((item) => {
          const itemJobId =
            item.jobPostId ||
            item.jobId ||
            item.job?.id ||
            item.jobPost?.id ||
            item.id;
          return String(itemJobId) !== String(jobId);
        }),
      );
    }
    setUnsavingId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Saved Jobs</h1>
        <p className="text-slate-500 mt-1">
          Review and apply to the jobs you've bookmarked.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader className="h-8 w-8 text-[var(--color-primary)] animate-spin" />
        </div>
      ) : savedJobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {savedJobs.map((item) => {
            // Depending on API response, job details might be nested or direct
            const job = item.job || item.jobPost || item;
            const jobId = job.id || item.jobId || item.jobPostId;
            const isUnsaving = unsavingId === jobId;

            return (
              <Card
                key={jobId}
                className="hover:border-[var(--color-primary-light)] hover:shadow-md transition-all cursor-pointer group p-5"
                onClick={() => navigate(`/jobs/${jobId}`)}
              >
                <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
                  <div className="flex items-start space-x-4">
                    <div className="h-14 w-14 rounded-lg bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary)] text-2xl font-bold flex-shrink-0">
                      {(job.company?.name || job.company || "J").charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                        {job.title}
                      </h3>
                      <p className="text-slate-500 text-sm mt-1">
                        {job.company?.name || job.company}
                      </p>

                      <div className="flex flex-wrap items-center mt-3 text-sm text-slate-600 gap-y-2 gap-x-4">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-slate-400" />{" "}
                          {job.location || "Not specified"}
                        </span>
                        <span className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1 text-slate-400" />{" "}
                          {job.jobType || job.type || "Full-time"}
                        </span>
                        <span className="inline-block font-medium text-slate-800">
                          {job.salary || "Competitive"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col justify-end items-end gap-3 mt-4 md:mt-0">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/jobs/${jobId}`);
                      }}
                      className="w-full sm:w-auto"
                    >
                      Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={(e) => handleUnsave(e, jobId)}
                      disabled={isUnsaving}
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                      {isUnsaving ? (
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bookmark className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">
            No saved jobs yet
          </h3>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            You haven't bookmarked any jobs. Browse our job board and save jobs
            you're interested in applying for later.
          </p>
          <Button onClick={() => navigate("/candidate/jobs")}>
            Browse Jobs
          </Button>
        </div>
      )}
    </div>
  );
};
