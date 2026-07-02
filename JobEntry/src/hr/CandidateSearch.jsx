import React, { useState, useEffect } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { EmptyState } from "../components/States";
import { CVViewerModal } from "../components/CVViewerModal";
import { Search, Mail, FileText, Loader } from "lucide-react";
import { applicationAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export const HRCandidateSearch = () => {
  const { token } = useAuth();
  const [keyword, setKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState("");
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedCV, setSelectedCV] = useState(null);

  const fetchCandidates = async (searchKeyword = "") => {
    setIsSearching(true);
    setError("");

    const result = await applicationAPI.searchCandidates(
      { keyword: searchKeyword, page: 1, limit: 20 },
      token,
    );

    if (result.success) {
      const data = Array.isArray(result.data?.data)
        ? result.data.data
        : Array.isArray(result.data)
          ? result.data
          : [];
      setCandidates(data);
      setHasSearched(true);
    } else {
      setError(result.error || "Failed to search candidates");
      setCandidates([]);
      setHasSearched(true);
    }

    setIsSearching(false);
  };

  useEffect(() => {
    if (token) {
      fetchCandidates("");
    }
  }, [token]);

  const onSearch = () => {
    fetchCandidates(keyword.trim());
  };

  const handleViewCV = (candidate) => {
    const cv = candidate.cvs?.[0];
    if (cv) {
      setSelectedCandidate(candidate);
      setSelectedCV(cv);
      setIsCVModalOpen(true);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Candidate Search</h1>
        <p className="text-slate-500 mt-1">
          Source talent from our pool of registered professionals.
        </p>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Skills, role, or keywords (e.g. React, Manager)..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onSearch();
                }
              }}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <Button
            onClick={onSearch}
            isLoading={isSearching}
            className="md:w-auto w-full"
          >
            Search
          </Button>
        </div>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <p className="text-red-700 text-sm">{error}</p>
        </Card>
      )}

      {!hasSearched && !isSearching && (
        <Card className="border-dashed bg-slate-50 shadow-none">
          <EmptyState
            title="Search for Candidates"
            description="Enter relevant keywords or skills above to start searching through the candidate database."
          />
        </Card>
      )}

      {isSearching && (
        <div className="flex justify-center py-8">
          <Loader className="h-6 w-6 text-slate-500 animate-spin" />
        </div>
      )}

      {hasSearched && !isSearching && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            {candidates.length} candidates found
          </h3>

          <div className="grid gap-4">
            {candidates.map((candidate) => (
              <Card
                key={candidate.id}
                className="hover:border-[var(--color-primary-light)] transition-colors"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-600 border border-slate-200">
                      {(candidate.Fullname || "U").charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">
                        {candidate.Fullname || "Unnamed candidate"}
                      </h4>
                      <p className="text-sm text-slate-500">
                        {candidate.email}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Applications: {candidate._count?.applications || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 md:w-auto w-full">
                    <span className="px-2.5 py-1 bg-blue-50 text-[var(--color-primary-active)] text-xs rounded font-medium border border-blue-100">
                      {candidate.phone || "No phone"}
                    </span>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded font-medium border border-slate-200">
                      {candidate.address || "No address"}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex items-center"
                      onClick={() => handleViewCV(candidate)}
                    >
                      <FileText className="h-3.5 w-3.5 mr-1" /> View CV
                    </Button>
                    <Button
                      size="sm"
                      className="flex items-center"
                      onClick={() => {
                        window.location.href = `mailto:${candidate.email}`;
                      }}
                    >
                      <Mail className="h-3.5 w-3.5 mr-1" /> Message
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {candidates.length === 0 && (
              <Card>
                <div className="text-center py-8 text-slate-500">
                  No candidates found
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* CV Viewer Modal */}
      <CVViewerModal
        isOpen={isCVModalOpen}
        onClose={() => {
          setIsCVModalOpen(false);
          setSelectedCandidate(null);
          setSelectedCV(null);
        }}
        candidate={selectedCandidate}
        cvData={selectedCV}
      />
    </div>
  );
};
