import React from "react";
import { X, Download, Mail, Phone, MapPin, FileText } from "lucide-react";
import { Button } from "./Button";

export const CVViewerModal = ({ isOpen, onClose, candidate, cvData }) => {
  if (!isOpen || !candidate) return null;

  const handleDownload = () => {
    if (cvData?.fileUrl) {
      // Create a link to download the file
      const link = document.createElement("a");
      link.href = cvData.fileUrl;
      link.download = cvData.filename || "cv.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleViewInNewTab = () => {
    if (cvData?.fileUrl) {
      window.open(cvData.fileUrl, "_blank");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">CV Preview</h2>
            <p className="text-sm text-slate-500 mt-1">{candidate.Fullname}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          <div className="p-8 space-y-8">
            {/* Header Section */}
            <div className="text-center pb-8 border-b border-slate-200">
              <div className="h-20 w-20 mx-auto mb-4 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                {(candidate.Fullname || "U").charAt(0).toUpperCase()}
              </div>
              <h1 className="text-3xl font-bold text-slate-900">
                {candidate.Fullname || "Unnamed"}
              </h1>

              {/* Contact Information */}
              <div className="flex flex-wrap justify-center gap-6 mt-4 text-slate-600">
                {candidate.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[var(--color-primary)]" />
                    <a
                      href={`mailto:${candidate.email}`}
                      className="hover:text-[var(--color-primary)]"
                    >
                      {candidate.email}
                    </a>
                  </div>
                )}
                {candidate.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[var(--color-primary)]" />
                    <a
                      href={`tel:${candidate.phone}`}
                      className="hover:text-[var(--color-primary)]"
                    >
                      {candidate.phone}
                    </a>
                  </div>
                )}
                {candidate.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[var(--color-primary)]" />
                    <span>{candidate.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* CV Document Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-[var(--color-primary)] rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 text-lg">
                    {cvData?.title || "CV Document"}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Uploaded on{" "}
                    {new Date(
                      cvData?.createdAt || new Date(),
                    ).toLocaleDateString()}
                    {cvData?.fileSize &&
                      ` • ${formatFileSize(cvData.fileSize)}`}
                  </p>
                  <p className="text-xs text-slate-500 mt-2 font-mono bg-white px-2 py-1 rounded inline-block mt-3">
                    {cvData?.filename}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                  Account Created
                </p>
                <p className="text-slate-900 font-semibold mt-1">
                  {new Date(
                    candidate.createdAt || new Date(),
                  ).toLocaleDateString("vi-VN")}
                </p>
              </div>
              {candidate._count?.applications && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                    Applications
                  </p>
                  <p className="text-slate-900 font-semibold mt-1">
                    {candidate._count.applications}
                  </p>
                </div>
              )}
            </div>

            {/* Template Section */}
            <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-lg p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Quick Preview
              </h2>
              <p className="text-slate-600 leading-relaxed">
                This is a CV preview for {candidate.Fullname}. The complete CV
                file is displayed below. You can download the original file or
                open it in a new tab to view the full document.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="secondary"
            onClick={handleViewInNewTab}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            View Document
          </Button>
          <Button onClick={handleDownload} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

// Helper function to format file size
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
