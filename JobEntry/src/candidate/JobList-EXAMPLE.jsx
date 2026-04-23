import React, { useState, useMemo } from 'react';
import { Search, MapPin, Briefcase, Loader, Filter, X } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Link } from 'react-router-dom';
import { useJobs } from '../hooks/useJobs';
import { useAuth } from '../context/AuthContext';

/**
 * JobList Component
 * Displays all jobs with search and filter functionality
 * Connected to backend API
 */
export const JobList = () => {
  const { jobs, loading, error, refetch } = useJobs();
  const { isAuthenticated } = useAuth();
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter jobs based on search and filters
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = 
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLocation = 
        !locationFilter || 
        job.location?.toLowerCase().includes(locationFilter.toLowerCase());

      const matchesType = 
        !typeFilter || 
        job.jobType === typeFilter;

      const matchesCategory = 
        !categoryFilter || 
        job.category?.name === categoryFilter;

      return matchesSearch && matchesLocation && matchesType && matchesCategory;
    });
  }, [jobs, searchQuery, locationFilter, typeFilter, categoryFilter]);

  // Get unique categories from jobs
  const categories = useMemo(() => {
    const cats = new Set();
    jobs.forEach(job => {
      if (job.category?.name) {
        cats.add(job.category.name);
      }
    });
    return Array.from(cats);
  }, [jobs]);

  // Get unique job types
  const jobTypes = useMemo(() => {
    const types = new Set();
    jobs.forEach(job => {
      if (job.jobType) {
        types.add(job.jobType);
      }
    });
    return Array.from(types);
  }, [jobs]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setLocationFilter('');
    setTypeFilter('');
    setCategoryFilter('');
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery || locationFilter || typeFilter || categoryFilter;

  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <section className="bg-slate-50 border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Job Listings</h1>
          <p className="text-slate-600">Explore {jobs.length} job opportunities</p>
        </div>
      </section>

      {/* Search Bar */}
      <section className="bg-white border-b border-slate-200 sticky top-0 z-10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 flex-col md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by job title, company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <Button
              variant={showFilters ? 'primary' : 'secondary'}
              className="w-full md:w-auto flex items-center justify-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>

          {/* Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchQuery && (
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery('')}>
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              {locationFilter && (
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  Location: {locationFilter}
                  <button onClick={() => setLocationFilter('')}>
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              {typeFilter && (
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  Type: {typeFilter}
                  <button onClick={() => setTypeFilter('')}>
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              {categoryFilter && (
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  Category: {categoryFilter}
                  <button onClick={() => setCategoryFilter('')}>
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 underline text-sm ml-auto"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Filters Sidebar (Mobile Responsive) */}
      {showFilters && (
        <section className="bg-slate-50 border-b border-slate-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Location Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="City or region..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[var(--color-primary)] text-sm"
                />
              </div>

              {/* Job Type Filter */}
              {jobTypes.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-3">
                    Job Type
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[var(--color-primary)] text-sm"
                  >
                    <option value="">All Types</option>
                    {jobTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Category Filter */}
              {categories.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-3">
                    Category
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[var(--color-primary)] text-sm"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Refresh Button */}
              <div className="flex items-end">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={refetch}
                >
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <section className="flex-1 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader className="h-8 w-8 animate-spin text-[var(--color-primary)] mb-4" />
              <p className="text-slate-600">Loading jobs...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-8">
              <p className="text-red-700 font-medium">Error loading jobs</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <Button
                variant="primary"
                size="sm"
                className="mt-4"
                onClick={refetch}
              >
                Try Again
              </Button>
            </div>
          )}

          {/* No Results */}
          {!loading && filteredJobs.length === 0 && jobs.length > 0 && (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                No jobs found
              </h3>
              <p className="text-slate-600 mb-4">
                Try adjusting your search or filters
              </p>
              <Button
                variant="secondary"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* No Jobs at All */}
          {!loading && jobs.length === 0 && (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                No jobs available
              </h3>
              <p className="text-slate-600">
                Please check back later for new opportunities.
              </p>
            </div>
          )}

          {/* Job Cards */}
          {!loading && filteredJobs.length > 0 && (
            <>
              <div className="mb-6 flex justify-between items-center">
                <p className="text-slate-600">
                  Showing <span className="font-semibold">{filteredJobs.length}</span> of <span className="font-semibold">{jobs.length}</span> jobs
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {filteredJobs.map((job) => (
                  <Link key={job.id} to={`/jobs/${job.id}`}>
                    <Card className="hover:border-[var(--color-primary-light)] hover:shadow-md transition-all group cursor-pointer p-6">
                      <div className="flex items-start justify-between gap-4">
                        {/* Left Content */}
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            {/* Company Avatar */}
                            <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-[var(--color-primary)] text-lg font-bold flex-shrink-0">
                              {job.company?.name?.charAt(0) || 'J'}
                            </div>

                            {/* Job Title and Company */}
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-slate-800 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                                {job.title}
                              </h3>
                              <p className="text-slate-600 text-sm">
                                {job.company?.name || 'Unknown Company'}
                              </p>
                            </div>
                          </div>

                          {/* Job Details */}
                          <div className="flex flex-wrap gap-4 text-sm text-slate-600 mt-4">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1.5 text-slate-400" />
                              {job.location || 'Not specified'}
                            </div>
                            <div className="flex items-center">
                              <Briefcase className="h-4 w-4 mr-1.5 text-slate-400" />
                              {job.jobType || 'Full-time'}
                            </div>
                            {job.salary && (
                              <div className="font-medium text-slate-700">
                                {job.salary}
                              </div>
                            )}
                          </div>

                          {/* Description Preview */}
                          {job.description && (
                            <p className="text-slate-600 text-sm mt-3 line-clamp-2">
                              {job.description}
                            </p>
                          )}

                          {/* Tags */}
                          {job.category && (
                            <div className="mt-3 flex gap-2">
                              <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded">
                                {job.category.name}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Right Side - Posted Date */}
                        <div className="text-right flex-shrink-0">
                          {job.createdAt && (
                            <p className="text-xs text-slate-500">
                              Posted {new Date(job.createdAt).toLocaleDateString()}
                            </p>
                          )}
                          <div className="mt-2">
                            {isAuthenticated ? (
                              <Button size="sm" variant="primary">
                                View Details
                              </Button>
                            ) : (
                              <p className="text-xs text-slate-500">
                                <Link to="/login" className="text-[var(--color-primary)] hover:underline">
                                  Login to apply
                                </Link>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};
