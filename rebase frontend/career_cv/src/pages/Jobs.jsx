import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { JobCard, Loading, Pagination } from '../components';
import { Card, Badge, Button, Input, TopAppBar, Sidebar } from '../components/ui';
import { jobService, categoryService } from '../services';
import { useAuthStore } from '../store';
import toast from 'react-hot-toast';

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const { isAuthenticated, isJobSeeker } = useAuthStore();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('location') || '',
    category: searchParams.get('category') || '',
    jobType: searchParams.get('jobType') || '',
    experience: searchParams.get('experience') || '',
  });

  useEffect(() => {
    loadJobs();
    if (isAuthenticated && isJobSeeker()) {
      loadSavedJobs();
    }
  }, [searchParams]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const params = {
        page: searchParams.get('page') || 1,
        limit: 12,
        keyword: searchParams.get('keyword') || undefined,
        location: searchParams.get('location') || undefined,
        categoryId: searchParams.get('category') || undefined,
        jobType: searchParams.get('jobType') || undefined,
      };

      const response = await jobService.getJobs(params);
      setJobs(response.data || []);
      setPagination({
        page: response.pagination?.page || 1,
        totalPages: response.pagination?.totalPages || 1,
        total: response.pagination?.total || 0
      });
    } catch (error) {
      console.error('Error loading jobs:', error);
      toast.error('Không thể tải danh sách việc làm');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadSavedJobs = async () => {
    try {
      const response = await jobService.getSavedJobs();
      setSavedJobIds((response.data || []).map(job => job.id));
    } catch (error) {
      console.error('Error loading saved jobs:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveJob = async (jobId) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để lưu việc làm');
      return;
    }

    try {
      if (savedJobIds.includes(jobId)) {
        await jobService.unsaveJob(jobId);
        setSavedJobIds(prev => prev.filter(id => id !== jobId));
        toast.success('Đã bỏ lưu việc làm');
      } else {
        await jobService.saveJob(jobId);
        setSavedJobIds(prev => [...prev, jobId]);
        toast.success('Đã lưu việc làm');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      keyword: '',
      location: '',
      category: '',
      jobType: '',
      experience: '',
    });
    setSearchParams({});
  };

  const hasActiveFilters = Object.values(filters).some(v => v);

  const jobTypeOptions = [
    { value: 'FULL_TIME', label: 'Toàn thời gian' },
    { value: 'PART_TIME', label: 'Bán thời gian' },
    { value: 'CONTRACT', label: 'Hợp đồng' },
    { value: 'INTERNSHIP', label: 'Thực tập' },
    { value: 'REMOTE', label: 'Từ xa' },
  ];

  const experienceOptions = [
    { value: '0', label: 'Không yêu cầu' },
    { value: '1', label: '1-2 năm' },
    { value: '3', label: '3-5 năm' },
    { value: '5', label: 'Trên 5 năm' },
  ];

  if (loading && jobs.length === 0) {
    return <Loading fullScreen text="Đang tải danh sách việc làm..." />;
  }

  return (
    <div className="min-h-screen bg-surface-container-low">
      <TopAppBar
        title="Danh sách việc làm"
        leftContent={
          <button
            className="md:hidden p-2 hover:bg-surface-container rounded-base"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        }
      />

      <div className="flex">
        {/* Sidebar Filters */}
        <aside className={`w-80 bg-surface p-6 border-r border-outline-variant/10 ${sidebarOpen ? 'block' : 'hidden'} md:block fixed md:static h-screen overflow-y-auto md:h-auto`}>
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <h3 className="font-headline font-bold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">tune</span>
                Bộ lọc
              </h3>
            </div>

            <Input
              label="Từ khóa"
              placeholder="Vị trí, kỹ năng..."
              value={filters.keyword}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
              leftIcon={<span className="material-symbols-outlined text-sm">search</span>}
            />

            <Input
              label="Địa điểm"
              placeholder="Thành phố, quận..."
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              leftIcon={<span className="material-symbols-outlined text-sm">location_on</span>}
            />

            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">Loại công việc</label>
              <select
                value={filters.jobType}
                onChange={(e) => handleFilterChange('jobType', e.target.value)}
                className="w-full px-3 py-2 rounded-base border border-outline-variant bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="">Tất cả</option>
                {jobTypeOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">Kinh nghiệm</label>
              <select
                value={filters.experience}
                onChange={(e) => handleFilterChange('experience', e.target.value)}
                className="w-full px-3 py-2 rounded-base border border-outline-variant bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="">Tất cả</option>
                {experienceOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">Danh mục</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 rounded-base border border-outline-variant bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pt-4 border-t border-outline-variant/10">
              <Button type="submit" variant="primary" className="flex-1">
                Tìm kiếm
              </Button>
              {hasActiveFilters && (
                <Button type="button" variant="outline" onClick={clearFilters}>
                  Xóa
                </Button>
              )}
            </div>
          </form>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-12">
          {/* Results Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="font-headline text-3xl font-bold text-on-surface">
                  Kết quả tìm kiếm
                </h1>
                <p className="text-on-surface-variant mt-2">
                  Tìm thấy <strong>{pagination.total}</strong> việc làm
                </p>
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.entries(filters).map(([key, value]) =>
                  value ? (
                    <Badge
                      key={key}
                      variant="primary"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => handleFilterChange(key, '')}
                    >
                      {value}
                      <span className="ms ml-2">{key === 'keyword' && '✕'}</span>
                    </Badge>
                  ) : null
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                >
                  Xóa tất cả
                </Button>
              </div>
            )}
          </div>

          {/* Jobs Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin">
                <span className="material-symbols-outlined text-4xl text-primary">hourglass_empty</span>
              </div>
            </div>
          ) : jobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {jobs.map((job) => (
                  <Card
                    key={job.id}
                    elevated
                    interactive
                    className="flex flex-col cursor-pointer border-l-4 border-primary"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="h-12 w-12 rounded-base bg-surface-container overflow-hidden flex items-center justify-center flex-shrink-0">
                        {job.company?.logo ? (
                          <img
                            src={job.company.logo}
                            alt={job.company.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-primary">business</span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {job.jobType && (
                          <Badge variant="default" size="sm">
                            {job.jobType}
                          </Badge>
                        )}
                        {isAuthenticated && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveJob(job.id);
                            }}
                            className={`p-2 rounded-full transition ${
                              savedJobIds.includes(job.id)
                                ? 'bg-primary-container text-primary'
                                : 'text-on-surface-variant hover:bg-surface-container'
                            }`}
                          >
                            <span className="material-symbols-outlined text-sm">
                              {savedJobIds.includes(job.id) ? 'bookmark' : 'bookmark_outline'}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>

                    <h3 className="font-headline text-lg font-bold text-on-surface mb-1 line-clamp-2">
                      {job.title}
                    </h3>
                    <p className="text-on-surface-variant text-sm mb-4">
                      {job.company?.name} • {job.location}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4 flex-grow">
                      {job.skills && job.skills.slice(0, 3).map((skill, idx) => (
                        <Badge key={idx} variant="default" size="sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                      <span className="font-semibold text-primary">
                        {job.salaryMin}-{job.salaryMax}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/jobs/${job.id}`);
                        }}
                      >
                        Chi tiết
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <Pagination
                  page={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 block mb-4">
                work_outline
              </span>
              <p className="text-on-surface-variant">
                Không tìm thấy việc làm phù hợp với bộ lọc của bạn
              </p>
              <Button
                variant="primary"
                onClick={clearFilters}
                className="mt-6"
              >
                Xóa bộ lọc
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Jobs;
