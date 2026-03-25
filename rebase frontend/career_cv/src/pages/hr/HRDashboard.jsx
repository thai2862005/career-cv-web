import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiBriefcase, 
  FiUsers, 
  FiEye, 
  FiCheckCircle,
  FiPlus,
  FiArrowRight,
  FiTrendingUp
} from 'react-icons/fi';
import { Loading } from '../../components';
import { jobService, applicationService, companyService } from '../../services';
import toast from 'react-hot-toast';

const HRDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [companyRes, jobsRes, appsRes, statsRes] = await Promise.all([
        companyService.getMyCompany(),
        jobService.getMyJobs({ limit: 5 }),
        applicationService.getCompanyApplications({ limit: 5 }),
        applicationService.getApplicationStats()
      ]);

      setCompany(companyRes.data);
      setRecentJobs(jobsRes.data || []);
      setRecentApplications(appsRes.data || []);
      
      const jobData = jobsRes.data || [];
      const statsData = statsRes.data || {};
      
      setStats({
        totalJobs: jobsRes.pagination?.total || jobData.length,
        activeJobs: jobData.filter(j => j.isActive).length,
        totalApplications: statsData.total || 0,
        pendingApplications: statsData.pending || 0
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
      if (error.status === 404) {
        // Company not created yet
        setCompany(null);
      } else {
        toast.error('Không thể tải dữ liệu dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen text="Đang tải dashboard..." />;
  }

  // No company yet
  if (!company) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiBriefcase className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Chào mừng đến CareerCV
          </h1>
          <p className="text-gray-600 mb-8">
            Để bắt đầu đăng tin tuyển dụng, bạn cần tạo hồ sơ công ty trước.
          </p>
          <Link
            to="/hr/company/create"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
          >
            <FiPlus className="w-5 h-5" />
            Tạo hồ sơ công ty
          </Link>
        </div>
      </div>
    );
  }

  const statCards = [
    { 
      label: 'Tổng việc làm', 
      value: stats.totalJobs, 
      icon: FiBriefcase, 
      color: 'bg-blue-500',
      link: '/hr/jobs'
    },
    { 
      label: 'Việc làm đang tuyển', 
      value: stats.activeJobs, 
      icon: FiCheckCircle, 
      color: 'bg-green-500',
      link: '/hr/jobs'
    },
    { 
      label: 'Tổng ứng tuyển', 
      value: stats.totalApplications, 
      icon: FiUsers, 
      color: 'bg-purple-500',
      link: '/hr/applications'
    },
    { 
      label: 'Chờ xử lý', 
      value: stats.pendingApplications, 
      icon: FiEye, 
      color: 'bg-orange-500',
      link: '/hr/applications'
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Xin chào, {company.name}</p>
          </div>
          <Link
            to="/hr/jobs/create"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
          >
            <FiPlus className="w-5 h-5" />
            Đăng tin mới
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Jobs */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Việc làm gần đây</h2>
              <Link to="/hr/jobs" className="text-green-600 hover:underline text-sm flex items-center gap-1">
                Xem tất cả <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {recentJobs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Chưa có việc làm nào</p>
            ) : (
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <Link
                    key={job.id}
                    to={`/hr/jobs/${job.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-500">
                        {job._count?.applications || 0} ứng viên
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      job.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {job.isActive ? 'Đang tuyển' : 'Đã đóng'}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Ứng viên mới nhất</h2>
              <Link to="/hr/applications" className="text-green-600 hover:underline text-sm flex items-center gap-1">
                Xem tất cả <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {recentApplications.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Chưa có ứng viên nào</p>
            ) : (
              <div className="space-y-4">
                {recentApplications.map((app) => (
                  <Link
                    key={app.id}
                    to={`/hr/applications/${app.id}`}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <FiUsers className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {app.user?.Fullname}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {app.jobPost?.title}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      app.status === 'VIEWED' ? 'bg-blue-100 text-blue-700' :
                      app.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {app.status === 'PENDING' ? 'Mới' :
                       app.status === 'VIEWED' ? 'Đã xem' :
                       app.status === 'ACCEPTED' ? 'Chấp nhận' : 'Từ chối'}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
