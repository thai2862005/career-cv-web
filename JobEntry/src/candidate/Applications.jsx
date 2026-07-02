import React, { useState, useEffect } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Badge } from "../components/Forms";
import {
  Briefcase,
  MapPin,
  Calendar,
  ExternalLink,
  Loader,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { applicationAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export const CandidateApplications = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchApplications();
  }, [token]);

  const fetchApplications = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const response = await applicationAPI.getMyApplications(token);
    if (response.success) {
      const data = response.data;
      const appsArray = Array.isArray(data)
        ? data
        : data?.data || data?.applications || [];
      setApplications(appsArray);
    }
    setLoading(false);
  };

  const getStatusDisplay = (status) => {
    const s = String(status || "").toUpperCase();
    switch (s) {
      case "PENDING":
      case "SUBMITTED":
        return {
          color: "blue",
          text: "Application Sent",
          icon: <Clock className="h-4 w-4 mr-1" />,
        };
      case "VIEWED":
      case "REVIEWING":
        return {
          color: "indigo",
          text: "Under Review",
          icon: <Eye className="h-4 w-4 mr-1" />,
        };
      case "INTERVIEW":
        return {
          color: "purple",
          text: "Interview",
          icon: <Calendar className="h-4 w-4 mr-1" />,
        };
      case "HIRED":
      case "ACCEPTED":
        return {
          color: "green",
          text: "Hired",
          icon: <CheckCircle className="h-4 w-4 mr-1" />,
        };
      case "REJECTED":
        return {
          color: "red",
          text: "Rejected",
          icon: <XCircle className="h-4 w-4 mr-1" />,
        };
      default:
        return {
          color: "slate",
          text: status || "Pending",
          icon: <Clock className="h-4 w-4 mr-1" />,
        };
    }
  };

  const filteredApps =
    statusFilter === "ALL"
      ? applications
      : applications.filter(
          (app) => String(app.status || "").toUpperCase() === statusFilter,
        );

  const stats = {
    total: applications.length,
    pending: applications.filter((a) =>
      ["PENDING", "SUBMITTED"].includes(String(a.status || "").toUpperCase()),
    ).length,
    interview: applications.filter(
      (a) => String(a.status || "").toUpperCase() === "INTERVIEW",
    ).length,
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Applications</h1>
        <p className="text-slate-500 mt-1">
          Track the status of jobs you have applied for.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="!p-4 bg-white flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
            <Briefcase className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Applied</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.total}</h3>
          </div>
        </Card>
        <Card className="!p-4 bg-white flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center">
            <Clock className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pending</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {stats.pending}
            </h3>
          </div>
        </Card>
        <Card className="!p-4 bg-white flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center">
            <Calendar className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Interviews</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {stats.interview}
            </h3>
          </div>
        </Card>
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="font-semibold text-slate-800">Application History</h2>
          <select
            className="px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[var(--color-primary)]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="REVIEWING">Under Review</option>
            <option value="INTERVIEW">Interview</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader className="h-8 w-8 text-[var(--color-primary)] animate-spin" />
          </div>
        ) : filteredApps.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredApps.map((app) => {
              const job = app.job || app.jobPost || {};
              const statusInfo = getStatusDisplay(app.status);
              const appliedDate = new Date(
                app.createdAt || new Date(),
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <div
                  key={app.id}
                  className="p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
                    <div className="flex items-start gap-4">
                      <div
                        className="h-12 w-12 rounded-lg bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary)] text-xl font-bold flex-shrink-0 cursor-pointer"
                        onClick={() => navigate(`/jobs/${job.id}`)}
                      >
                        {(job.company?.name || job.company || "J").charAt(0)}
                      </div>
                      <div>
                        <h3
                          className="font-semibold text-slate-800 hover:text-[var(--color-primary)] cursor-pointer transition-colors"
                          onClick={() => navigate(`/jobs/${job.id}`)}
                        >
                          {job.title || "Unknown Job"}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {job.company?.name ||
                            job.company ||
                            "Unknown Company"}
                        </p>

                        <div className="flex flex-wrap items-center mt-2 text-xs text-slate-500 gap-x-4 gap-y-1">
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />{" "}
                            {job.location || "Remote"}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" /> Applied on{" "}
                            {appliedDate}
                          </span>
                          {app.cv && (
                            <span className="flex items-center text-blue-600">
                              <FileText className="h-3 w-3 mr-1" />{" "}
                              {app.cv.name || "CV Document"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 mt-4 md:mt-0">
                      <Badge
                        variant={statusInfo.color}
                        className="flex items-center px-2.5 py-1 text-xs"
                      >
                        {statusInfo.icon} {statusInfo.text}
                      </Badge>

                      <button
                        className="text-xs font-medium text-[var(--color-primary)] hover:underline flex items-center"
                        onClick={() => navigate(`/jobs/${job.id}`)}
                      >
                        View Job <ExternalLink className="h-3 w-3 ml-1" />
                      </button>
                    </div>
                  </div>

                  {app.note && (
                    <div className="mt-3 bg-blue-50/50 p-3 rounded border border-blue-100 text-sm text-slate-700">
                      <p className="font-semibold text-blue-900 mb-1 text-xs uppercase tracking-wider">
                        Note from Recruiter
                      </p>
                      {app.note}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">
              No applications found
            </h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              {statusFilter === "ALL"
                ? "You haven't applied to any jobs yet."
                : `You don't have any applications with status '${statusFilter}'.`}
            </p>
            {statusFilter === "ALL" && (
              <Button onClick={() => navigate("/candidate/jobs")}>
                Browse Jobs
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
