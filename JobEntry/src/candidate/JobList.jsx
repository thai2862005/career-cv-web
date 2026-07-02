import React, { useState, useEffect } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import {
  Search,
  MapPin,
  Briefcase,
  ChevronDown,
  Filter,
  Bookmark,
  Loader,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { jobAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export const JobList = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSalary, setSelectedSalary] = useState("Any");
  const [sortBy, setSortBy] = useState("Most Relevant");

  const [searchParams] = useSearchParams();
  const companyId = searchParams.get("companyId");
  const { token, isAuthenticated } = useAuth();

  const pageSize = 6;

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [companyId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, locationQuery]);

  useEffect(() => {
    fetchJobs(currentPage);
    if (isAuthenticated) {
      fetchSavedJobs();
    }
  }, [companyId, currentPage, isAuthenticated, token]);

  const fetchJobs = async (page = 1) => {
    setLoading(true);
    const filters = { page, limit: pageSize };
    if (companyId) filters.companyId = companyId;
    if (searchQuery.trim()) filters.keyword = searchQuery.trim();
    if (locationQuery.trim()) filters.location = locationQuery.trim();

    const response = await jobAPI.getAllJobs(filters);
    if (response.success) {
      const data = response.data;
      const jobsArray = Array.isArray(data)
        ? data
        : data?.data || data?.jobs || data?.items || [];
      setJobs(jobsArray);
      const meta = data?.meta || response.data?.meta;
      setTotalPages(Math.max(1, meta?.totalPages || 1));
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
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const numericJobId = Number(jobId);
    const isSaved = savedJobIds.includes(numericJobId);
    if (isSaved) {
      const response = await jobAPI.unsaveJob(jobId, token);
      if (response.success) {
        setSavedJobIds((prev) => prev.filter((id) => id !== numericJobId));
      }
    } else {
      const response = await jobAPI.saveJob(jobId, token);
      if (response.success) {
        setSavedJobIds((prev) => [...prev, numericJobId]);
      }
    }
  };

  const handleTypeToggle = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
  };

  let filteredJobs = jobs.filter((job) => {
    const title = job.title || "";
    const companyName = job.company?.name || "";
    const location = job.location || "";

    const matchesSearch =
      !searchQuery ||
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      companyName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation =
      !locationQuery ||
      location.toLowerCase().includes(locationQuery.toLowerCase());

    const matchesType =
      selectedTypes.length === 0 ||
      selectedTypes.includes(job.jobType || job.type);

    const categoryName = job.category?.name || job.category;
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(categoryName);

    let matchesSalary = true; // Advanced salary filtering can be implemented later

    return (
      matchesSearch &&
      matchesLocation &&
      matchesType &&
      matchesCategory &&
      matchesSalary
    );
  });

  if (sortBy === "Most Recent") {
    filteredJobs = [...filteredJobs].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  } else if (sortBy === "Highest Salary") {
    filteredJobs = [...filteredJobs].sort(
      (a, b) => (b.salary || 0) - (a.salary || 0),
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-16">
      {/* Search Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-6">
            Find your next job
          </h1>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3.5 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Job title, keywords, or company..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] transition-shadow text-slate-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64 relative">
              <MapPin className="absolute left-4 top-3.5 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="City, state, or remote"
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] transition-shadow text-slate-800"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
              />
            </div>
            <Button size="lg" className="h-[50px] px-8 py-3">
              Find Jobs
            </Button>
            <Button
              variant="secondary"
              className="md:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-5 w-5 mr-2" /> Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div
            className={`lg:w-1/4 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <Card className="sticky top-24">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-800 mb-3">
                    Job Type
                  </h3>
                  <div className="space-y-2">
                    {[
                      "Full-time",
                      "Part-time",
                      "Contract",
                      "Temporary",
                      "Internship",
                    ].map((type, i) => (
                      <label
                        key={i}
                        className="flex items-center text-sm text-slate-600 hover:text-slate-800 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] mr-3 w-4 h-4"
                          checked={selectedTypes.includes(type)}
                          onChange={() => handleTypeToggle(type)}
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h3 className="font-semibold text-slate-800 mb-3">
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {[
                      "Engineering",
                      "Design",
                      "Marketing",
                      "Data Science",
                      "Sales",
                    ].map((cat, i) => (
                      <label
                        key={i}
                        className="flex items-center text-sm text-slate-600 hover:text-slate-800 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] mr-3 w-4 h-4"
                          checked={selectedCategories.includes(cat)}
                          onChange={() => handleCategoryToggle(cat)}
                        />
                        {cat}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h3 className="font-semibold text-slate-800 mb-3">
                    Salary Range
                  </h3>
                  <div className="space-y-2">
                    {["Any", "$50k - $80k", "$80k - $120k", "$120k+"].map(
                      (salary, i) => (
                        <label
                          key={i}
                          className="flex items-center text-sm text-slate-600 hover:text-slate-800 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="salary"
                            className="border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] mr-3 w-4 h-4"
                            checked={selectedSalary === salary}
                            onChange={() => setSelectedSalary(salary)}
                          />
                          {salary}
                        </label>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Job Listings */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-slate-800">
                Showing <span className="font-bold">{filteredJobs.length}</span>{" "}
                jobs
              </h2>
              <div className="flex items-center text-sm">
                <span className="text-slate-500 mr-2">Sort by:</span>
                <select
                  className="border-none bg-transparent font-medium text-slate-800 focus:ring-0 cursor-pointer decoration-transparent focus:outline-none"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option>Most Relevant</option>
                  <option>Most Recent</option>
                  <option>Highest Salary</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader className="h-8 w-8 text-[var(--color-primary)] animate-spin" />
                </div>
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map((job) => {
                  const company = job.company || {};

                  return (
                    <div
                      key={job.id}
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      <Card className="hover:border-[var(--color-primary-light)] hover:shadow-md transition-all cursor-pointer group flex flex-col sm:flex-row gap-4 p-5 sm:p-6 relative">
                        <button
                          onClick={(e) => handleSaveJob(e, job.id)}
                          className={`absolute top-5 right-5 p-2 rounded-full transition-colors z-10 hover:bg-slate-100 ${savedJobIds.includes(Number(job.id)) ? "text-[var(--color-primary)]" : "text-slate-400 hover:text-slate-600"}`}
                        >
                          <Bookmark
                            className="h-5 w-5"
                            fill={
                              savedJobIds.includes(Number(job.id))
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </button>

                        {company.logoUrl ? (
                          <img
                            src={company.logoUrl}
                            alt={company.name}
                            className="h-16 w-16 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-xl bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary-dark)] text-2xl font-bold flex-shrink-0">
                            {(company.name || "C").charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div className="flex-1 pr-8">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-slate-800 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                                {job.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <p className="text-slate-500 text-sm">
                                  {company.name}
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
                            <span className="mt-2 sm:mt-0 font-medium text-slate-800 bg-slate-100 px-3 py-1 rounded-full text-sm inline-block">
                              {job.salary ? `$${job.salary}` : "Negotiable"}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center mt-3 text-sm text-slate-600 gap-y-2 gap-x-4">
                            <span className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1.5 text-slate-400" />{" "}
                              <span className="line-clamp-1">
                                {job.location}
                              </span>
                            </span>
                            <span className="flex items-center">
                              <Briefcase className="h-4 w-4 mr-1.5 text-slate-400" />{" "}
                              {job.jobType || job.type || "FULL_TIME"}
                            </span>
                            {job.category?.name && (
                              <span className="text-[var(--color-primary)] font-medium">
                                • {job.category.name}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2 mt-4">
                            {job.experience && (
                              <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-xs rounded-md">
                                Exp: {job.experience}
                              </span>
                            )}
                          </div>
                        </div>
                      </Card>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-500 text-lg">
                    No jobs found matching your criteria.
                  </p>
                  <Button
                    variant="ghost"
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery("");
                      setLocationQuery("");
                      setSelectedTypes([]);
                      setSelectedCategories([]);
                      setSelectedSalary("Any");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>

            {/* Pagination Placeholder */}
            <div className="mt-10 flex flex-col items-center gap-4">
              <p className="text-sm text-slate-500">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex flex-wrap justify-center gap-1">
                <Button
                  variant="secondary"
                  className="px-4"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                >
                  Previous
                </Button>
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((page) => (
                  <Button
                    key={page}
                    className="px-4"
                    variant={page === currentPage ? "primary" : "secondary"}
                    onClick={() => goToPage(page)}
                    disabled={loading}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="secondary"
                  className="px-4"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
