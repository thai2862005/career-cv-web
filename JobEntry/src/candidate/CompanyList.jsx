import React, { useState, useEffect } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import {
  Search,
  MapPin,
  ExternalLink,
  Users,
  TrendingUp,
  AlertCircle,
  Loader,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { companyAPI } from "../services/api";

export const CompanyList = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      const response = await companyAPI.getAllCompanies();
      if (response.success) {
        const data = response.data;
        const companiesArray = Array.isArray(data)
          ? data
          : data?.data || data?.companies || [];
        setCompanies(companiesArray);
      }
      setLoading(false);
    };

    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
            Discover Top Organizations
          </h1>
          <p className="text-lg text-slate-500">
            Explore company cultures, benefits, and open positions at the
            world's most innovative workplaces.
          </p>
        </div>

        <div className="bg-white p-2 rounded-xl shadow-md border border-slate-200 max-w-3xl mx-auto flex flex-col md:flex-row gap-2 mb-12">
          <div className="flex-1 relative flex items-center px-4">
            <Search className="h-5 w-5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by company name or industry..."
              className="w-full pl-3 py-3 text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button size="lg" className="w-full md:w-32 py-3 h-auto">
            Search
          </Button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            Featured Employers
          </h2>
          <div className="flex items-center text-sm font-medium text-[var(--color-primary)] hover:underline cursor-pointer">
            View All Companies
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader className="h-8 w-8 text-[var(--color-primary)] animate-spin" />
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-slate-400" />
            <h3 className="text-xl font-medium text-slate-800 mb-2">
              No companies found
            </h3>
            <p>Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <Card
                key={company.id}
                className="hover:border-[var(--color-primary-light)] hover:shadow-lg transition-all group flex flex-col h-full cursor-pointer"
                onClick={() => navigate(`/jobs?companyId=${company.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  {company.logoUrl ? (
                    <img
                      src={company.logoUrl}
                      alt={company.name}
                      className="h-16 w-16 rounded-xl object-cover border border-slate-100 shadow-sm transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-xl bg-slate-100 text-[var(--color-primary)] flex items-center justify-center text-2xl font-bold border border-slate-200 shadow-sm transition-transform group-hover:scale-105">
                      {(company.name || company.title || "C")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}
                  {company.isVerified && (
                    <div className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded border border-blue-100 flex items-center">
                      Verified
                    </div>
                  )}
                </div>

                <div className="mb-4 flex-grow">
                  <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                    {company.name || company.title}
                  </h3>
                  <p className="text-[var(--color-primary)] text-sm font-semibold mb-4">
                    {company.industry || "Tech Sector"}
                  </p>

                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-slate-400" />{" "}
                      <span className="line-clamp-1">
                        {company.location || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-slate-400" />{" "}
                      {company.size || "Growing team"}
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2 text-slate-400" />{" "}
                      Hiring active
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <span className="text-sm font-semibold text-slate-800">
                    {company.openJobCount ?? company._count?.jobs ?? 0} open
                    jobs
                  </span>
                  <Link
                    to={`/jobs?companyId=${company.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm font-medium text-[var(--color-primary)] hover:underline flex items-center"
                  >
                    View Jobs <ExternalLink className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
