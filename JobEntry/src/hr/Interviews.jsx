import React, { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Badge, Input, Select } from "../components/Forms";
import { applicationAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { CalendarCheck, Loader, Check, X } from "lucide-react";

const formatDate = (value) => {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
};

export const HRInterviews = () => {
  const { token } = useAuth();
  const [pendingApplications, setPendingApplications] = useState([]);
  const [interviewApplications, setInterviewApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [scheduleForm, setScheduleForm] = useState({});

  const loadData = async () => {
    setLoading(true);
    setError("");

    const [pendingResult, viewedResult] = await Promise.all([
      applicationAPI.getCompanyApplications(token, {
        status: "PENDING",
        page: 1,
        limit: 20,
      }),
      applicationAPI.getCompanyApplications(token, {
        status: "VIEWED",
        page: 1,
        limit: 20,
      }),
    ]);

    if (!pendingResult.success) {
      setError(pendingResult.error || "Failed to load pending applications");
    }

    if (!viewedResult.success) {
      setError(viewedResult.error || "Failed to load interview applications");
    }

    const pendingData = Array.isArray(pendingResult.data?.data)
      ? pendingResult.data.data
      : Array.isArray(pendingResult.data)
        ? pendingResult.data
        : [];

    const viewedData = Array.isArray(viewedResult.data?.data)
      ? viewedResult.data.data
      : Array.isArray(viewedResult.data)
        ? viewedResult.data
        : [];

    setPendingApplications(pendingData);
    setInterviewApplications(viewedData);
    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const scheduleInterview = async (applicationId) => {
    const current = scheduleForm[applicationId] || {};
    if (!current.date || !current.type) {
      setError("Please provide interview date and type");
      return;
    }

    setActionLoading(applicationId);
    const note = `Interview ${current.type} - ${current.date}${current.link ? ` - ${current.link}` : ""}${current.note ? ` - ${current.note}` : ""}`;

    const result = await applicationAPI.scheduleInterview(
      applicationId,
      { note },
      token,
    );

    if (!result.success) {
      setError(result.error || "Failed to schedule interview");
    } else {
      await loadData();
    }

    setActionLoading(null);
  };

  const finalizeInterview = async (applicationId, status) => {
    setActionLoading(applicationId);

    const result = await applicationAPI.updateApplicationStatus(
      applicationId,
      {
        status,
        note: status === "ACCEPTED" ? "Interview passed" : "Interview rejected",
      },
      token,
    );

    if (!result.success) {
      setError(result.error || "Failed to update interview result");
    } else {
      await loadData();
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
        <h1 className="text-2xl font-bold text-slate-800">
          Interview Management
        </h1>
        <p className="text-slate-500 mt-1">
          Schedule interviews and update results for your candidates.
        </p>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <p className="text-red-700 text-sm">{error}</p>
        </Card>
      )}

      <Card title={`Pending Applications (${pendingApplications.length})`}>
        <div className="space-y-4">
          {pendingApplications.map((item) => (
            <div
              key={item.id}
              className="border border-slate-200 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-800">
                    {item.user?.Fullname || "Candidate"}
                  </p>
                  <p className="text-sm text-slate-500">
                    {item.jobPost?.title || "Job"}
                  </p>
                </div>
                <Badge variant="yellow">PENDING</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Input
                  label="Interview Date"
                  type="datetime-local"
                  value={scheduleForm[item.id]?.date || ""}
                  onChange={(e) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      [item.id]: {
                        ...prev[item.id],
                        date: e.target.value,
                      },
                    }))
                  }
                />
                <Select
                  label="Type"
                  value={scheduleForm[item.id]?.type || ""}
                  onChange={(e) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      [item.id]: {
                        ...prev[item.id],
                        type: e.target.value,
                      },
                    }))
                  }
                  options={[
                    { value: "Online", label: "Online" },
                    { value: "Onsite", label: "Onsite" },
                    { value: "Phone", label: "Phone" },
                  ]}
                />
                <Input
                  label="Meeting Link"
                  value={scheduleForm[item.id]?.link || ""}
                  onChange={(e) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      [item.id]: {
                        ...prev[item.id],
                        link: e.target.value,
                      },
                    }))
                  }
                  placeholder="https://meet.google.com/..."
                />
                <Input
                  label="Note"
                  value={scheduleForm[item.id]?.note || ""}
                  onChange={(e) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      [item.id]: {
                        ...prev[item.id],
                        note: e.target.value,
                      },
                    }))
                  }
                  placeholder="Optional note"
                />
              </div>

              <Button
                size="sm"
                onClick={() => scheduleInterview(item.id)}
                isLoading={actionLoading === item.id}
                className="inline-flex items-center"
              >
                <CalendarCheck className="h-4 w-4 mr-1" /> Schedule Interview
              </Button>
            </div>
          ))}

          {pendingApplications.length === 0 && (
            <div className="text-center py-6 text-slate-500">
              No pending applications
            </div>
          )}
        </div>
      </Card>

      <Card title={`Interviewed Candidates (${interviewApplications.length})`}>
        <div className="space-y-4">
          {interviewApplications.map((item) => (
            <div
              key={item.id}
              className="border border-slate-200 rounded-lg p-4"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-800">
                    {item.user?.Fullname || "Candidate"}
                  </p>
                  <p className="text-sm text-slate-500">
                    {item.jobPost?.title || "Job"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {item.note || "No interview note"}
                  </p>
                  <p className="text-xs text-slate-400">
                    Reviewed:{" "}
                    {item.reviewedAt ? formatDate(item.reviewedAt) : "N/A"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    isLoading={actionLoading === item.id}
                    onClick={() => finalizeInterview(item.id, "ACCEPTED")}
                  >
                    <Check className="h-4 w-4 mr-1" /> Accept
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                    isLoading={actionLoading === item.id}
                    onClick={() => finalizeInterview(item.id, "REJECTED")}
                  >
                    <X className="h-4 w-4 mr-1" /> Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {interviewApplications.length === 0 && (
            <div className="text-center py-6 text-slate-500">
              No interviews scheduled
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
