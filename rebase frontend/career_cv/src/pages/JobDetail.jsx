import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Badge, Button, TopAppBar, Avatar } from '../components/ui';
import { jobService, applicationService } from '../services';
import { useAuthStore } from '../store';
import toast from 'react-hot-toast';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isJobSeeker } = useAuthStore();

  const [job, setJob] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    loadJobDetail();
  }, [id]);

  const loadJobDetail = async () => {
    try {
      setLoading(true);
      const response = await jobService.getJobById(id);
      setJob(response.data);

      if (isAuthenticated && isJobSeeker()) {
        // Check if saved
        const savedResponse = await jobService.getSavedJobs();
        setIsSaved(savedResponse.data?.some(j => j.id === id));

        // Check if already applied
        const appsResponse = await applicationService.getMyApplications();
        setHasApplied(appsResponse.data?.some(app => app.jobId === id));
      }
    } catch (error) {
      console.error('Error loading job:', error);
      toast.error('Không thể tải thông tin việc làm');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isJobSeeker()) {
      toast.error('Chỉ người tìm việc mới có thể ứng tuyển');
      return;
    }

    try {
      setApplying(true);
      await applicationService.applyForJob({
        jobId: id,
      });
      setHasApplied(true);
      toast.success('Ứng tuyển thành công!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (isSaved) {
        await jobService.unsaveJob(id);
        setIsSaved(false);
        toast.success('Đã bỏ lưu việc làm');
      } else {
        await jobService.saveJob(id);
        setIsSaved(true);
        toast.success('Đã lưu việc làm');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin">
          <span className="material-symbols-outlined text-4xl text-primary">hourglass_empty</span>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="space-y-8 px-6 py-20 text-center">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 block">
          work_outline
        </span>
        <p className="text-on-surface-variant">Không tìm thấy việc làm</p>
        <Button variant="primary" onClick={() => navigate('/jobs')}>
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <>
      <TopAppBar
        leftContent={
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-surface-container rounded-base">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        }
      />

      <div className="min-h-screen bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero Section */}
              <Card elevated className="border-l-4 border-primary">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4">
                    <div className="h-16 w-16 rounded-base bg-surface-container overflow-hidden flex items-center justify-center flex-shrink-0">
                      {job.company?.logo ? (
                        <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="material-symbols-outlined">business</span>
                      )}
                    </div>
                    <div>
                      <h1 className="font-headline text-3xl font-bold text-on-surface">{job.title}</h1>
                      <p className="text-on-surface-variant">{job.company?.name}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={isSaved ? 'primary' : 'outline'}
                      size="sm"
                      onClick={handleSave}
                    >
                      <span className="material-symbols-outlined">
                        {isSaved ? 'bookmark' : 'bookmark_outline'}
                      </span>
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-outline-variant/10">
                  <div>
                    <p className="text-on-surface-variant text-sm">Mức lương</p>
                    <p className="font-semibold text-primary">{job.salaryMin}-{job.salaryMax}</p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant text-sm">Loại công việc</p>
                    <Badge variant="default" size="sm">{job.jobType}</Badge>
                  </div>
                  <div>
                    <p className="text-on-surface-variant text-sm">Địa điểm</p>
                    <p className="font-semibold text-on-surface">{job.location}</p>
                  </div>
                </div>
              </Card>

              {/* Requirements */}
              <Card>
                <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">Yêu cầu công việc</h2>
                <div className="space-y-3 text-on-surface-variant">
                  {job.requirements && typeof job.requirements === 'string' ? (
                    <p>{job.requirements}</p>
                  ) : Array.isArray(job.requirements) ? (
                    job.requirements.map((req, idx) => (
                      <div key={idx} className="flex gap-3">
                        <span className="material-symbols-outlined text-primary flex-shrink-0 text-sm">check</span>
                        <span>{req}</span>
                      </div>
                    ))
                  ) : null}
                </div>
              </Card>

              {/* Description */}
              {job.description && (
                <Card>
                  <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">Mô tả công việc</h2>
                  <div className="text-on-surface-variant whitespace-pre-wrap">{job.description}</div>
                </Card>
              )}

              {/* Benefits */}
              {job.benefits && (
                <Card>
                  <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">Quyền lợi</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Array.isArray(job.benefits) && job.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex gap-3 p-4 bg-primary-container rounded-base">
                        <span className="material-symbols-outlined text-primary flex-shrink-0 text-sm">check_circle</span>
                        <span className="text-on-primary-container text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply CTA */}
              <Card elevated className="sticky top-24">
                {!hasApplied ? (
                  <>
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      loading={applying}
                      onClick={handleApply}
                      disabled={applying}
                      className="mb-3"
                    >
                      Ứng tuyển ngay
                    </Button>
                    <p className="text-center text-xs text-on-surface-variant">
                      {!isAuthenticated ? 'Đăng nhập để ứng tuyển' : ''}
                    </p>
                  </>
                ) : (
                  <Button variant="secondary" fullWidth disabled>
                    <span className="material-symbols-outlined mr-2 text-sm">check</span>
                    Đã ứng tuyển
                  </Button>
                )}
              </Card>

              {/* Company Info */}
              {job.company && (
                <Card>
                  <h3 className="font-headline font-bold text-on-surface mb-4">Về công ty</h3>
                  <div className="space-y-4">
                    <p className="text-on-surface-variant text-sm">{job.company.description}</p>
                    <div className="flex items-center gap-2 pt-4 border-t border-outline-variant/10">
                      <Badge variant="primary" size="sm">
                        {job.company.verified ? 'Đã xác minh' : 'Chưa xác minh'}
                      </Badge>
                    </div>
                  </div>
                </Card>
              )}

              {/* Skills Required */}
              {job.skills && (
                <Card>
                  <h3 className="font-headline font-bold text-on-surface mb-4">Kỹ năng cần thiết</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(job.skills) && job.skills.map((skill, idx) => (
                      <Badge key={idx} variant="default" size="sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobDetail;

  useEffect(() => {
    loadJob();
  }, [id]);

  const loadJob = async () => {
    try {
      const response = await jobService.getJobById(id);
      setJob(response.data);
      
      if (isAuthenticated && isJobSeeker()) {
        // Check if saved
        const savedResponse = await jobService.getSavedJobs();
        const savedIds = (savedResponse.data || []).map(j => j.id);
        setIsSaved(savedIds.includes(Number(id)));
        
        // Check if already applied
        const applicationsResponse = await applicationService.getMyApplications();
        const appliedJobIds = (applicationsResponse.data || []).map(a => a.jobPostId);
        setHasApplied(appliedJobIds.includes(Number(id)));
        
        // Load CVs
        const cvsResponse = await cvService.getMyCVs();
        setMyCVs(cvsResponse.data || []);
      }
    } catch (error) {
      console.error('Error loading job:', error);
      toast.error('Không thể tải thông tin việc làm');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (isSaved) {
        await jobService.unsaveJob(id);
        setIsSaved(false);
        toast.success('Đã bỏ lưu việc làm');
      } else {
        await jobService.saveJob(id);
        setIsSaved(true);
        toast.success('Đã lưu việc làm');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleApply = async () => {
    if (!selectedCV) {
      toast.error('Vui lòng chọn CV');
      return;
    }

    setApplying(true);
    try {
      await applicationService.applyJob({
        jobPostId: Number(id),
        cvId: Number(selectedCV),
        coverLetter: coverLetter || undefined
      });
      
      setShowApplyModal(false);
      setHasApplied(true);
      toast.success('Ứng tuyển thành công!');
    } catch (error) {
      toast.error(error.message || 'Ứng tuyển thất bại');
    } finally {
      setApplying(false);
    }
  };

  const openApplyModal = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (myCVs.length === 0) {
      toast.error('Bạn cần tải lên CV trước khi ứng tuyển');
      navigate('/my-cv');
      return;
    }
    
    setShowApplyModal(true);
  };

  const formatSalary = () => {
    if (!job.salary) return 'Thỏa thuận';
    if (job.salaryMax) {
      return `${(job.salary / 1000000).toFixed(0)} - ${(job.salaryMax / 1000000).toFixed(0)} triệu VND`;
    }
    return `${(job.salary / 1000000).toFixed(0)} triệu VND`;
  };

  const getJobTypeLabel = (type) => {
    const types = {
      FULL_TIME: 'Toàn thời gian',
      PART_TIME: 'Bán thời gian',
      CONTRACT: 'Hợp đồng',
      INTERNSHIP: 'Thực tập',
      REMOTE: 'Từ xa'
    };
    return types[type] || type;
  };

  if (loading) {
    return <Loading fullScreen text="Đang tải thông tin việc làm..." />;
  }

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Không tìm thấy việc làm
        </h2>
        <Link to="/jobs" className="text-green-600 hover:underline">
          Quay lại danh sách việc làm
        </Link>
      </div>
    );
  }

  const { company } = job;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition"
        >
          <FiArrowLeft className="w-5 h-5" />
          Quay lại
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex gap-4">
                {company && (
                  <Link to={`/companies/${company.id}`} className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border">
                      {company.logoUrl ? (
                        <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-bold text-gray-400">{company.name?.charAt(0)}</span>
                      )}
                    </div>
                  </Link>
                )}
                <div className="flex-grow">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  {company && (
                    <Link to={`/companies/${company.id}`} className="text-green-600 hover:underline font-medium">
                      {company.name}
                    </Link>
                  )}
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                <div className="flex items-center gap-2 text-gray-600">
                  <FiDollarSign className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Mức lương</p>
                    <p className="font-medium text-gray-900">{formatSalary()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FiMapPin className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Địa điểm</p>
                    <p className="font-medium text-gray-900">{job.location || 'Không xác định'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FiBriefcase className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Hình thức</p>
                    <p className="font-medium text-gray-900">{getJobTypeLabel(job.jobType)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FiClock className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Kinh nghiệm</p>
                    <p className="font-medium text-gray-900">{job.experience || 'Không yêu cầu'}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                {hasApplied ? (
                  <Button fullWidth disabled>
                    <FiCheckCircle className="w-5 h-5 mr-2" />
                    Đã ứng tuyển
                  </Button>
                ) : (
                  <Button onClick={openApplyModal} fullWidth>
                    Ứng tuyển ngay
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={handleSave}
                  className={isSaved ? 'text-red-500 border-red-500' : ''}
                >
                  <FiHeart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="outline">
                  <FiShare2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Mô tả công việc</h2>
              <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                {job.description}
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Yêu cầu ứng viên</h2>
                <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                  {job.requirements}
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quyền lợi</h2>
                <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                  {job.benefits}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Card */}
            {company && (
              <Link to={`/companies/${company.id}`} className="block bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                <h3 className="font-semibold text-gray-900 mb-4">Thông tin công ty</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border">
                    {company.logoUrl ? (
                      <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-bold text-gray-400">{company.name?.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 flex items-center gap-1">
                      {company.name}
                      {company.isVerified && <FiCheckCircle className="w-4 h-4 text-green-500" />}
                    </h4>
                    {company.industry && (
                      <p className="text-sm text-gray-500">{company.industry}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  {company.size && (
                    <div className="flex items-center gap-2">
                      <FiUsers className="w-4 h-4" />
                      <span>{company.size} nhân viên</span>
                    </div>
                  )}
                  {company.location && (
                    <div className="flex items-center gap-2">
                      <FiMapPin className="w-4 h-4" />
                      <span>{company.location}</span>
                    </div>
                  )}
                </div>
              </Link>
            )}

            {/* Job Meta */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Thông tin chung</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Ngày đăng</span>
                  <span className="text-gray-900">{dayjs(job.createdAt).format('DD/MM/YYYY')}</span>
                </div>
                {job.deadline && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Hạn nộp hồ sơ</span>
                    <span className="text-gray-900">{dayjs(job.deadline).format('DD/MM/YYYY')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Lượt xem</span>
                  <span className="text-gray-900">{job.viewCount || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title="Ứng tuyển công việc"
        size="md"
      >
        <div className="p-6 space-y-4">
          <div>
            <p className="text-gray-600 mb-4">
              Ứng tuyển vị trí <strong>{job.title}</strong> tại <strong>{company?.name}</strong>
            </p>
          </div>

          <Select
            label="Chọn CV"
            required
            value={selectedCV}
            onChange={(e) => setSelectedCV(e.target.value)}
            options={myCVs.map(cv => ({ value: cv.id, label: cv.title || cv.filename }))}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thư giới thiệu (không bắt buộc)
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={4}
              placeholder="Viết vài dòng giới thiệu về bản thân..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowApplyModal(false)} fullWidth>
              Hủy
            </Button>
            <Button onClick={handleApply} loading={applying} fullWidth>
              Gửi hồ sơ
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default JobDetail;
