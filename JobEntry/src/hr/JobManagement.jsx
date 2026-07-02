import React, { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Table } from "../components/Table";
import { Badge, Input, Select } from "../components/Forms";
import { Modal } from "../components/Modal";
import {
  Plus,
  Edit,
  Trash2,
  StopCircle,
  AlertCircle,
  Check,
} from "lucide-react";
import { jobAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const getStatusInfo = (job) => {
  if (!job.isApproved) return { label: "Pending Approval", variant: "yellow" };
  if (!job.isActive) return { label: "Closed", variant: "red" };
  return { label: "Active", variant: "green" };
};

const normalizeJobs = (payload) => {
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
};

export const HRJobManagement = () => {
  const { user, token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    benefits: "",
    location: "",
    salary: "",
    salaryMax: "",
    jobType: "FULL_TIME",
    experience: "",
  });

  const isHR = String(user?.role || "").toUpperCase() === "HR";

  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    const response = await jobAPI.getMyJobs(token);

    if (response.success) {
      setJobs(normalizeJobs(response.data));
    } else {
      setError(response.error || "Failed to fetch jobs");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (isHR && token) {
      fetchJobs();
    }
  }, [isHR, token]);

  const resetForm = () => {
    setEditingJob(null);
    setFieldErrors({});
    setFormData({
      title: "",
      description: "",
      requirements: "",
      benefits: "",
      location: "",
      salary: "",
      salaryMax: "",
      jobType: "FULL_TIME",
      experience: "",
    });
  };

  const openModal = (job = null) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        title: job.title || "",
        description: job.description || "",
        requirements: job.requirements || "",
        benefits: job.benefits || "",
        location: job.location || "",
        salary: job.salary || "",
        salaryMax: job.salaryMax || "",
        jobType: job.jobType || "FULL_TIME",
        experience: job.experience || "",
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    const payload = {
      title: formData.title,
      description: formData.description,
      requirements: formData.requirements || undefined,
      benefits: formData.benefits || undefined,
      location: formData.location,
      salary: formData.salary ? Number(formData.salary) : undefined,
      salaryMax: formData.salaryMax ? Number(formData.salaryMax) : undefined,
      jobType: formData.jobType,
      experience: formData.experience || undefined,
    };

    const response = editingJob
      ? await jobAPI.updateJob(editingJob.id, payload, token)
      : await jobAPI.createJob(payload, token);

    if (response.success) {
      setSuccessMessage(
        editingJob ? "Job updated successfully" : "Job created successfully",
      );
      closeModal();
      await fetchJobs();
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      setError(response.error || "Failed to save job");
      if (
        response.fieldErrors &&
        Object.keys(response.fieldErrors).length > 0
      ) {
        setFieldErrors(response.fieldErrors);
      } else if (response.errors && response.errors.length > 0) {
        const errorsMap = {};
        response.errors.forEach((err) => {
          if (
            err.path &&
            err.path.length > 0 &&
            typeof err.path[0] === "string"
          ) {
            errorsMap[err.path[0]] = err.message;
          }
        });
        setFieldErrors(errorsMap);
      }
    }

    setLoading(false);
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    setLoading(true);
    setError("");

    const response = await jobAPI.deleteJob(jobId, token);
    if (response.success) {
      setSuccessMessage("Job deleted successfully");
      await fetchJobs();
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      setError(response.error || "Failed to delete job");
    }

    setLoading(false);
  };

  const toggleJobStatus = async (jobId) => {
    setLoading(true);
    setError("");

    const response = await jobAPI.toggleJobStatus(jobId, token);
    if (response.success) {
      setSuccessMessage("Job status updated");
      await fetchJobs();
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      setError(response.error || "Failed to update job status");
    }

    setLoading(false);
  };

  const filteredJobs = jobs.filter((job) => {
    if (statusFilter === "ALL") return true;
    const status = getStatusInfo(job).label;
    return status === statusFilter;
  });

  const columns = [
    {
      header: "Job ID",
      cell: (row) => (
        <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
          #{row.id}
        </span>
      ),
    },
    {
      header: "Title",
      cell: (row) => (
        <div>
          <p className="font-medium text-slate-800">{row.title}</p>
          <p className="text-xs text-slate-500">
            {row.jobType || "FULL_TIME"} • {row.experience || "N/A"}
          </p>
        </div>
      ),
    },
    {
      header: "Location",
      cell: (row) => <span>{row.location || "N/A"}</span>,
    },
    {
      header: "Posted Date",
      cell: (row) =>
        row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A",
    },
    {
      header: "Status",
      cell: (row) => {
        const info = getStatusInfo(row);
        return <Badge variant={info.variant}>{info.label}</Badge>;
      },
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => openModal(row)}
            className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => toggleJobStatus(row.id)}
            className="p-1.5 text-slate-400 hover:text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
            title="Toggle"
          >
            <StopCircle className="h-4 w-4" />
          </button>
          <button
            onClick={() => deleteJob(row.id)}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  if (!isHR) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <div className="flex flex-col items-center text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Access Denied
            </h2>
            <p className="text-slate-600">
              Only HR users can access this page.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <Check className="h-5 w-5" />
          {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Job Management</h1>
          <p className="text-slate-500 mt-1">
            Manage your company jobs with real backend data.
          </p>
        </div>
        <Button
          onClick={() => openModal()}
          className="flex text-sm"
          disabled={loading}
        >
          <Plus className="h-4 w-4 mr-2" /> Post New Job
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-wrap gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-300 rounded-md text-sm py-2 px-3 focus:ring-2 focus:ring-[var(--color-primary)]"
        >
          <option value="ALL">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Pending Approval">Pending Approval</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-500">Loading jobs...</div>
      ) : filteredJobs.length === 0 ? (
        <Card>
          <div className="text-center py-8 text-slate-500">No jobs found.</div>
        </Card>
      ) : (
        <Card className="!p-0 border-0 shadow-none bg-transparent">
          <Table columns={columns} data={filteredJobs} />
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingJob ? "Edit Job" : "Post New Job"}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={saveJob} disabled={loading}>
              {editingJob ? "Update Job" : "Post Job"}
            </Button>
          </>
        }
      >
        <form onSubmit={saveJob} className="space-y-4" noValidate>
          <div>
            <Input
              label="Job Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
            {fieldErrors.title && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.title}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
              {fieldErrors.location && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.location}
                </p>
              )}
            </div>
            <div>
              <Input
                label="Experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="2+ years"
              />
              {fieldErrors.experience && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.experience}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Select
                label="Job Type"
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                options={[
                  { value: "FULL_TIME", label: "Full-time" },
                  { value: "PART_TIME", label: "Part-time" },
                  { value: "CONTRACT", label: "Contract" },
                  { value: "INTERNSHIP", label: "Internship" },
                  { value: "REMOTE", label: "Remote" },
                ]}
              />
              {fieldErrors.jobType && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.jobType}
                </p>
              )}
            </div>
            <div>
              <Input
                label="Salary Min (USD)"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                type="number"
              />
              {fieldErrors.salary && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.salary}
                </p>
              )}
            </div>
            <div>
              <Input
                label="Salary Max (USD)"
                name="salaryMax"
                value={formData.salaryMax}
                onChange={handleChange}
                type="number"
              />
              {fieldErrors.salaryMax && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.salaryMax}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`px-4 py-2 border ${fieldErrors.description ? "border-red-500" : "border-slate-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] min-h-28`}
            />
            {fieldErrors.description && (
              <p className="text-red-500 text-xs mt-1">
                {fieldErrors.description}
              </p>
            )}
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Requirements
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              className={`px-4 py-2 border ${fieldErrors.requirements ? "border-red-500" : "border-slate-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] min-h-24`}
            />
            {fieldErrors.requirements && (
              <p className="text-red-500 text-xs mt-1">
                {fieldErrors.requirements}
              </p>
            )}
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Benefits
            </label>
            <textarea
              name="benefits"
              value={formData.benefits}
              onChange={handleChange}
              className={`px-4 py-2 border ${fieldErrors.benefits ? "border-red-500" : "border-slate-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] min-h-24`}
            />
            {fieldErrors.benefits && (
              <p className="text-red-500 text-xs mt-1">
                {fieldErrors.benefits}
              </p>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};
