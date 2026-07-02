import React, { useState, useEffect } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Input, Select, Badge } from "../components/Forms";
import { Search, MapPin, Briefcase, Bookmark, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jobAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export const CandidateJobSearch = () => {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [categoryTerm, setCategoryTerm] = useState("");
  const [sortBy, setSortBy] = useState("Most Relevant");

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    fetchJobs();
    if (isAuthenticated) {
      fetchSavedJobs();
    }
  }, [isAuthenticated, token]);

  const fetchJobs = async () => {
    setLoading(true);
    const response = await jobAPI.getAllJobs();
    if (response.success) {
      const data = response.data;
      const jobsArray = Array.isArray(data)
        ? data
        : data?.data || data?.jobs || data?.items || [];
      setJobs(jobsArray);
    }
    setLoading(false);
  };

  const fetchSavedJobs = async () => {
    if (!token) return;
    const response = await jobAPI.getSavedJobs(token);
    if (response.success) {
      const data = response.data;
      const savedArray = Array.isArray(data)
        ? data
        : data?.data || data?.savedJobs || [];
      const savedIds = savedArray
        .map((item) =>
          Number(
            item.jobPostId ||
              item.jobId ||
              item.job?.id ||
              item.jobPost?.id ||
              item.id,
          ),
        )
        .filter(Number.isFinite);
      setSavedJobIds(savedIds);
    }
  };

  const handleSaveJob = async (e, jobId) => {
    e.stopPropagation(); // Prevent card click
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setSavingId(jobId);

    const numericJobId = Number(jobId);
    const isSaved = savedJobIds.includes(numericJobId);
    let response;

    if (isSaved) {
      response = await jobAPI.unsaveJob(jobId, token);
      if (response.success) {
        setSavedJobIds((prev) => prev.filter((id) => id !== numericJobId));
      }
    } else {
      response = await jobAPI.saveJob(jobId, token);
      if (response.success) {
        setSavedJobIds((prev) => [...prev, numericJobId]);
      }
    }

    setSavingId(null);
  };

  // Filtering
  let filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !searchTerm ||
      (job.title &&
        job.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.company?.name &&
        job.company.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLocation =
      !locationTerm ||
      (job.location &&
        job.location.toLowerCase().includes(locationTerm.toLowerCase()));

    const matchesCategory =
      !categoryTerm ||
      (job.category &&
        job.category.toLowerCase() === categoryTerm.toLowerCase()) ||
      (job.category?.name &&
        job.category.name.toLowerCase() === categoryTerm.toLowerCase());

    return matchesSearch && matchesLocation && matchesCategory;
  });

  // Sorting
  if (sortBy === "Newest") {
    filteredJobs = [...filteredJobs].sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
    );
  } else if (sortBy === "Highest Paid") {
    filteredJobs = [...filteredJobs].sort((a, b) => {
      const numA = parseInt((a.salary || "").replace(/[^0-9]/g, "")) || 0;
      const numB = parseInt((b.salary || "").replace(/[^0-9]/g, "")) || 0;
      return numB - numA;
    });
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Find your dream job
        </h1>
        <p className="text-slate-500 mt-1">
          Search through thousands of listings across top companies.
        </p>
      </div>

      <Card className="!p-4 bg-white/50 backdrop-blur-md border-[var(--color-primary-light)]">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Job title, keywords, or company..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64 relative">
            <MapPin className="absolute left-3 top-3 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Location"
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
              value={locationTerm}
              onChange={(e) => setLocationTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <select
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
              value={categoryTerm}
              onChange={(e) => setCategoryTerm(e.target.value)}
            >
              <option value="">Any Category</option>
              <option value="IT">IT / Software</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Engineering">Engineering</option>
            </select>
          </div>
          <Button size="lg" className="w-full md:w-auto min-w-[120px]">
            Search Jobs
          </Button>
        </div>
      </Card>

      <div className="flex justify-between items-center text-sm text-slate-500">
        <p>
          Showing{" "}
          <span className="font-semibold text-slate-800">
            {filteredJobs.length}
          </span>{" "}
          jobs based on your preferences
        </p>
        <div className="flex items-center gap-2">
          <span>Sort by:</span>
          <select
            className="border-none bg-transparent font-medium text-slate-800 focus:ring-0 cursor-pointer"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option>Most Relevant</option>
            <option>Newest</option>
            <option>Highest Paid</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader className="h-8 w-8 text-[var(--color-primary)] animate-spin" />
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {filteredJobs.map((job) => {
            const company = job.company || {};
            const normalizedJobId = Number(job.id);
            const isSavedById = savedJobIds.includes(normalizedJobId);
            const isSaving = savingId === job.id;

            return (
              <Card
                key={job.id}
                className="hover:border-[var(--color-primary-light)] hover:shadow-md transition-all cursor-pointer group"
                actions={
                  <button
                    onClick={(e) => handleSaveJob(e, job.id)}
                    disabled={isSaving}
                    className="p-1.5 focus:outline-none"
                    title={isSavedById ? "Unsave Job" : "Save Job"}
                  >
                    {isSaving ? (
                      <Loader className="h-5 w-5 text-slate-400 animate-spin" />
                    ) : (
                      <Bookmark
                        className={`h-5 w-5 transition-colors ${isSavedById ? "text-[var(--color-primary)] fill-[var(--color-primary)]" : "text-slate-400 group-hover:text-[var(--color-primary)]"}`}
                      />
                    )}
                  </button>
                }
              >
                <div onClick={() => navigate(`/jobs/${job.id}`)}>
                  <div className="flex items-start space-x-4 mb-4">
                    {company.logoUrl ? (
                      <img
                        src={company.logoUrl}
                        alt={company.name}
                        className="h-14 w-14 rounded-lg object-cover flex-shrink-0 border border-slate-100"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-lg bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary)] text-2xl font-bold flex-shrink-0">
                        {(company.name || job.company || "J").charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 group-hover:text-[var(--color-primary)] transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <p className="text-slate-500 text-sm">
                          {company.name || job.company}
                        </p>
                        {company.isVerified && (
                          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {company.industry || "Technology"} •{" "}
                        {company.size || "Growing team"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-sm text-slate-600">
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

                  <div className="flex flex-wrap gap-2">
                    {(job.tags || []).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <p className="text-slate-500 text-lg">
            No jobs found matching your criteria.
          </p>
        </div>
      )}

      <div className="flex justify-center pt-4">
        <Button variant="secondary" className="mr-2">
          Previous
        </Button>
        <Button
          variant="secondary"
          className="hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
        >
          1
        </Button>
        <Button variant="secondary" className="border-l-0">
          2
        </Button>
        <Button variant="secondary" className="border-l-0">
          3
        </Button>
        <Button variant="secondary" className="ml-2">
          Next
        </Button>
      </div>
    </div>
  );
};
