import React, { useState, useEffect } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { Input } from "../components/Forms";
import {
  FileText,
  Upload,
  MoreVertical,
  Eye,
  Download,
  Trash2,
  Loader,
} from "lucide-react";
import { cvAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";
const PUBLIC_BASE_URL = API_BASE_URL.replace(/\/api\/v1$/, "");

export const CandidateCVManagement = () => {
  const { token } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [cvName, setCvName] = useState("");

  useEffect(() => {
    fetchCVs();
  }, []);

  const fetchCVs = async () => {
    if (!token) return;
    setLoading(true);
    const response = await cvAPI.getMyCVs(token);
    if (response.success) {
      const data = response.data;
      const cvsArray = Array.isArray(data)
        ? data
        : data?.data || data?.cvs || [];
      setCvs(cvsArray);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!token) return;
    const response = await cvAPI.deleteCV(id, token);
    if (response.success) {
      setCvs(cvs.filter((cv) => cv.id !== id));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !token) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append(
      "title",
      cvName.trim() || selectedFile.name.replace(/\.[^.]+$/, ""),
    );

    const response = await cvAPI.uploadCV(formData, token);

    if (response.success) {
      setIsModalOpen(false);
      setSelectedFile(null);
      setCvName("");
      fetchCVs(); // Refresh list
    } else {
      alert(response.error || "Upload failed");
    }
    setUploading(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const resolveFileUrl = (fileUrl) => {
    if (!fileUrl) return "";
    if (/^https?:\/\//i.test(fileUrl)) return fileUrl;
    return `${PUBLIC_BASE_URL}${fileUrl.startsWith("/") ? "" : "/"}${fileUrl}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">CV Management</h1>
          <p className="text-slate-500 mt-1">
            Upload and manage your resumes to apply for jobs quickly.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex text-sm">
          <Upload className="h-4 w-4 mr-2" /> Upload New CV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {loading ? (
          <div className="flex justify-center py-12 col-span-full">
            <Loader className="h-8 w-8 text-[var(--color-primary)] animate-spin" />
          </div>
        ) : (
          cvs.map((cv) => (
            <Card
              key={cv.id}
              className="relative group border-2 hover:border-[var(--color-primary-light)] transition-all"
            >
              {cv.isDefault && (
                <div className="absolute top-0 right-0 bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-bl-lg rounded-tr-lg z-10">
                  Default
                </div>
              )}
              <div className="flex flex-col items-center text-center p-4">
                <div className="h-16 w-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                  <FileText className="h-8 w-8" />
                </div>
                <h3
                  className="font-semibold text-slate-800 truncate w-full mb-1"
                  title={cv.title || cv.name || "CV Document"}
                >
                  {cv.title || cv.name || "CV Document"}
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Uploaded{" "}
                  {new Date(cv.createdAt || new Date()).toLocaleDateString()} •{" "}
                  {formatFileSize(cv.fileSize ?? cv.size ?? 0)}
                </p>

                <div className="flex items-center justify-center space-x-2 w-full pt-4 border-t border-slate-100 opacity-80 group-hover:opacity-100 transition-opacity">
                  {(cv.fileUrl || cv.url) && (
                    <a
                      href={resolveFileUrl(cv.fileUrl || cv.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-500 hover:text-[var(--color-primary)] hover:bg-blue-50 rounded-md transition-colors"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </a>
                  )}
                  {(cv.fileUrl || cv.url) && (
                    <a
                      href={resolveFileUrl(cv.fileUrl || cv.url)}
                      download
                      className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(cv.id)}
                    className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 focus:outline-none hidden group-hover:block">
                <MoreVertical className="h-5 w-5" />
              </button>
            </Card>
          ))
        )}

        <div
          onClick={() => setIsModalOpen(true)}
          className="border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100 hover:border-[var(--color-primary)] transition-all flex flex-col items-center justify-center cursor-pointer min-h-[220px] text-slate-500 group"
        >
          <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
            <Upload className="h-5 w-5 text-slate-400 group-hover:text-[var(--color-primary)] transition-colors" />
          </div>
          <span className="font-medium text-sm group-hover:text-[var(--color-primary)] transition-colors">
            Click to upload new CV
          </span>
          <span className="text-xs mt-1">PDF, DOCX up to 5MB</span>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload CV"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
            >
              {uploading ? (
                <Loader className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              {uploading ? "Uploading..." : "Upload File"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="relative border-2 border-dashed border-[var(--color-primary-light)] bg-blue-50/50 rounded-lg p-8 flex flex-col items-center justify-center text-center">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="h-10 w-10 text-[var(--color-primary)] mb-3" />
            {selectedFile ? (
              <>
                <p className="text-sm font-medium text-[var(--color-primary)] mb-1">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-500 mb-4">
                  {formatFileSize(selectedFile.size)}
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                  className="relative z-10"
                >
                  Change File
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-slate-700 mb-1">
                  Drag and drop your file here
                </p>
                <p className="text-xs text-slate-500 mb-4">
                  Files supported: PDF, DOC, DOCX. Max size: 5MB
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="pointer-events-none"
                >
                  Browse Files
                </Button>
              </>
            )}
          </div>

          <Input
            label="Document Name (Optional)"
            placeholder="e.g. Designer_Resume_2026"
            value={cvName}
            onChange={(e) => setCvName(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};
