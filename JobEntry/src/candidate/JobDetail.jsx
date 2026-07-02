import React, { useState, useEffect } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Bookmark,
  Share2,
  Target,
  Users,
  Loader,
  AlertCircle,
} from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { jobAPI, cvAPI, applicationAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export const JobDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token, isAuthenticated } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isApplying, setIsApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applyError, setApplyError] = useState("");

  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    fetchJobDetails();
    if (isAuthenticated && token) {
      checkSavedStatus();
      checkAppliedStatus();
    }
  }, [id, isAuthenticated, token]);

  const fetchJobDetails = async () => {
    setLoading(true);
    const response = await jobAPI.getJobById(id);
    if (response.success) {
      setJob(response.data);
    } else {
      setError("Job not found or has been removed.");
    }
    setLoading(false);
  };

  const checkSavedStatus = async () => {
    if (!token) return;
    const response = await jobAPI.getSavedJobs(token);
    if (response.success) {
      const data = response.data;
      const savedArray = Array.isArray(data)
        ? data
        : data?.data || data?.savedJobs || [];
      const isJobSaved = savedArray.some(
        (item) =>
          item.jobPostId == id ||
          item.jobId == id ||
          item.job?.id == id ||
          item.jobPost?.id == id ||
          item.id == id,
      );
      setIsSaved(isJobSaved);
    }
  };

  const checkAppliedStatus = async () => {
    if (!token) return;
    const response = await applicationAPI.getMyApplications(token);
    if (response.success) {
      const data = response.data;
      const appsArray = Array.isArray(data)
        ? data
        : data?.data || data?.applications || [];
      const hasApplied = appsArray.some(
        (app) =>
          app.jobPostId == id ||
          app.jobId == id ||
          app.job?.id == id ||
          app.jobPost?.id == id,
      );
      setApplied(hasApplied);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setIsApplying(true);
    setApplyError("");

    // 1. Get CVs to find default CV
    const cvRes = await cvAPI.getMyCVs(token);
    if (!cvRes.success) {
      setApplyError("Failed to verify CVs. Please try again.");
      setIsApplying(false);
      return;
    }

    const cvData = cvRes.data;
    const cvsArray = Array.isArray(cvData)
      ? cvData
      : cvData?.data || cvData?.cvs || [];

    if (cvsArray.length === 0) {
      alert("You need to upload a CV first before applying.");
      navigate("/candidate/cv");
      return;
    }

    const defaultCv = cvsArray.find((c) => c.isDefault) || cvsArray[0];

    // 2. Apply
    const applyRes = await applicationAPI.submitApplication(
      {
        jobPostId: parseInt(id),
        cvId: defaultCv.id,
        coverLetter:
          "I am very interested in this position and look forward to hearing from you.",
      },
      token,
    );

    if (applyRes.success) {
      setApplied(true);
      alert("Applied successfully! You can track it in My Applications.");
      navigate("/candidate/applications");
    } else {
      setApplyError(
        applyRes.error || "Failed to apply. You might have already applied.",
      );
    }

    setIsApplying(false);
  };

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setSaveError("");

    if (isSaved) {
      const response = await jobAPI.unsaveJob(id, token);
      if (response.success) {
        setIsSaved(false);
      } else {
        setSaveError(response.error || "Failed to remove saved job.");
      }
    } else {
      const response = await jobAPI.saveJob(id, token);
      if (response.success) {
        setIsSaved(true);
      } else {
        setSaveError(response.error || "Failed to save job.");
      }
    }
  };

  const company = job?.company || {};

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 flex justify-center items-start pb-16">
        <Loader className="h-10 w-10 text-[var(--color-primary)] animate-spin mt-20" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-16 flex flex-col items-center">
        <AlertCircle className="h-16 w-16 text-slate-400 mb-4 mt-20" />
        <h2 className="text-2xl font-bold text-slate-800">
          {error || "Job not found"}
        </h2>
        <Button className="mt-6" onClick={() => navigate("/jobs")}>
          Back to Job Search
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-16">
      {/* Dynamic Header */}
      <div className="bg-slate-900 border-b border-slate-800 text-white pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to search results
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-6">
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="h-20 w-20 md:h-24 md:w-24 rounded-xl object-cover bg-white shadow-lg"
                />
              ) : (
                <div className="h-20 w-20 md:h-24 md:w-24 rounded-xl bg-white text-[var(--color-primary)] text-3xl md:text-4xl font-bold flex items-center justify-center shrink-0 shadow-lg">
                  {(company.name || "C").charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-2xl md:text-4xl font-bold">{job.title}</h1>
                <Link
                  to={`/companies/${company.id}`}
                  className="text-lg text-[var(--color-primary-light)] font-medium mt-2 hover:underline inline-block"
                >
                  {company.name}
                </Link>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  {company.isVerified && (
                    <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-semibold uppercase tracking-wider">
                      Verified Company
                    </span>
                  )}
                  {company.industry && (
                    <span className="px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/20">
                      {company.industry}
                    </span>
                  )}
                  {company.size && (
                    <span className="px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/20">
                      {company.size}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto">
              {(applyError || saveError) && (
                <p className="text-red-300 text-sm font-medium text-right">
                  {applyError || saveError}
                </p>
              )}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleSave}
                  className={`p-3 rounded-lg border ${isSaved ? "border-[var(--color-primary)] text-[var(--color-primary)]" : "border-slate-700 text-slate-300 hover:bg-slate-800"} transition-colors`}
                >
                  <Bookmark
                    className="h-5 w-5"
                    fill={isSaved ? "currentColor" : "none"}
                  />
                </button>
                <button className="p-3 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
                <Button
                  size="lg"
                  className="flex-1 md:flex-none py-3 shadow-lg shadow-blue-500/20"
                  onClick={handleApply}
                  isLoading={isApplying}
                  disabled={applied}
                >
                  {applied ? "Applied" : "Apply Now"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6">
            {/* Short Info Grid */}
            <Card className="!p-0 overflow-hidden shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-100">
                <div className="bg-white p-5 flex flex-col">
                  <span className="text-xs text-slate-500 font-medium mb-1 flex items-center uppercase tracking-wider">
                    <MapPin className="h-3.5 w-3.5 mr-1" /> Location
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {job.location}
                  </span>
                </div>
                <div className="bg-white p-5 flex flex-col">
                  <span className="text-xs text-slate-500 font-medium mb-1 flex items-center uppercase tracking-wider">
                    <Briefcase className="h-3.5 w-3.5 mr-1" /> Type
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {job.jobType || "Full-time"}
                  </span>
                </div>
                <div className="bg-white p-5 flex flex-col">
                  <span className="text-xs text-slate-500 font-medium mb-1 flex items-center uppercase tracking-wider">
                    <DollarSign className="h-3.5 w-3.5 mr-1" /> Salary
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {job.salary ? `$${job.salary}` : "Negotiable"}
                  </span>
                </div>
                <div className="bg-white p-5 flex flex-col">
                  <span className="text-xs text-slate-500 font-medium mb-1 flex items-center uppercase tracking-wider">
                    <Clock className="h-3.5 w-3.5 mr-1" /> Posted
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>

            {company.description && (
              <Card title="About the Company" className="shadow-sm border-0">
                <div className="space-y-4 text-slate-600">
                  <p className="leading-relaxed whitespace-pre-wrap">
                    {company.description}
                  </p>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {company.industry && (
                      <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200">
                        {company.industry}
                      </span>
                    )}
                    {company.size && (
                      <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200">
                        {company.size}
                      </span>
                    )}
                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 hover:underline"
                      >
                        Company website
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            )}

            <Card title="Job Description" className="shadow-sm border-0">
              <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
                <div className="text-base leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </div>

                {job.requirements && (
                  <div>
                    <h4 className="text-lg text-slate-800 font-bold mb-3 flex items-center">
                      <Target className="h-5 w-5 mr-2 text-[var(--color-primary)]" />{" "}
                      Requirements
                    </h4>
                    <div className="whitespace-pre-wrap text-slate-600 pl-2">
                      {job.requirements}
                    </div>
                  </div>
                )}

                {job.benefits && (
                  <div>
                    <h4 className="text-lg text-slate-800 font-bold mb-3 flex items-center">
                      <Briefcase className="h-5 w-5 mr-2 text-[var(--color-primary)]" />{" "}
                      Benefits
                    </h4>
                    <div className="whitespace-pre-wrap text-slate-600 pl-2">
                      {job.benefits}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            {job.category && (
              <Card
                title="Category & Experience"
                className="shadow-sm border-0"
              >
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 text-sm rounded-lg font-medium">
                    {job.category.name}
                  </span>
                  {job.experience && (
                    <span className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-lg font-medium">
                      Exp: {job.experience}
                    </span>
                  )}
                </div>
              </Card>
            )}

            <Card className="shadow-sm border-0" title="About the Company">
              <div className="text-center mb-6 pt-2">
                {company.logoUrl ? (
                  <img
                    src={company.logoUrl}
                    alt={company.name}
                    className="h-16 w-16 mx-auto rounded-xl object-cover border border-slate-200 mb-3 shadow-inner"
                  />
                ) : (
                  <div className="h-16 w-16 mx-auto rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary-active)] border border-[var(--color-primary)] flex items-center justify-center text-2xl font-bold mb-3 shadow-inner">
                    {(company.name || "C").charAt(0).toUpperCase()}
                  </div>
                )}
                <h3 className="font-bold text-slate-800 text-lg">
                  {company.name}
                </h3>
                <Link
                  to={`/companies/${company.id}`}
                  className="text-sm text-[var(--color-primary)] font-medium hover:underline"
                >
                  View company profile
                </Link>
                {company.isVerified && (
                  <div className="mt-3 inline-flex px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-xs font-semibold uppercase tracking-wider">
                    Verified Company
                  </div>
                )}
              </div>

              <div className="space-y-4 text-sm border-t border-slate-100 pt-5">
                <div className="flex items-center text-slate-600">
                  <Briefcase className="w-4 h-4 mr-3 text-slate-400" />
                  <span className="flex-1">
                    {company.industry || "Technology"}
                  </span>
                </div>
                <div className="flex items-center text-slate-600">
                  <Users className="w-4 h-4 mr-3 text-slate-400" />
                  <span className="flex-1">
                    {company.size || "Growing Team"}
                  </span>
                </div>
                <div className="flex items-center text-slate-600">
                  <MapPin className="w-4 h-4 mr-3 text-slate-400" />
                  <span className="flex-1">{company.location || "Global"}</span>
                </div>
                {company.website && (
                  <div className="flex items-center text-slate-600">
                    <span className="w-4 h-4 mr-3 text-slate-400" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 text-[var(--color-primary)] hover:underline"
                    >
                      {company.website}
                    </a>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
