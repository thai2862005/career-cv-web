import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiUsers, 
  FiBriefcase, 
  FiHome, 
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiArrowRight
} from 'react-icons/fi';
import { Loading } from '../../components';
import { adminService } from '../../services';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalCompanies: 0,
    totalApplications: 0,
    pendingJobs: 0,
    pendingCompanies: 0
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await adminService.getDashboard();
      setStats(response.data || {});
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen text="Đang tải dashboard..." />;
  }

  const statCards = [
    { 
      label: 'Tổng người dùng', 
      value: stats.totalUsers || 0, 
      icon: FiUsers, 
      color: 'bg-blue-500',
      link: '/admin/users'
    },
    { 
      label: 'Tổng việc làm', 
      value: stats.totalJobs || 0, 
      icon: FiBriefcase, 
      color: 'bg-green-500',
      link: '/admin/jobs'
    },
    { 
      label: 'Tổng công ty', 
      value: stats.totalCompanies || 0, 
      icon: FiHome, 
      color: 'bg-purple-500',
      link: '/admin/companies'
    },
    { 
      label: 'Tổng đơn ứng tuyển', 
      value: stats.totalApplications || 0, 
      icon: FiFileText, 
      color: 'bg-orange-500',
      link: '/admin/applications'
    },
  ];

  const pendingCards = [
    {
      label: 'Việc làm chờ duyệt',
      value: stats.pendingJobs || 0,
      icon: FiClock,
      link: '/admin/jobs/pending',
      color: 'text-yellow-600 bg-yellow-50'
    },
    {
      label: 'Công ty chờ xác thực',
      value: stats.pendingCompanies || 0,
      icon: FiCheckCircle,
      link: '/admin/companies?verified=false',
      color: 'text-blue-600 bg-blue-50'
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Quản lý hệ thống CareerCV</p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link
                key={index}
                to={stat.link}
                className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Pending Items */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {pendingCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Link
                key={index}
                to={card.link}
                className={`${card.color} rounded-xl p-6 flex items-center justify-between hover:opacity-90 transition`}
              >
                <div className="flex items-center gap-4">
                  <Icon className="w-8 h-8" />
                  <div>
                    <p className="text-3xl font-bold">{card.value}</p>
                    <p className="text-sm opacity-80">{card.label}</p>
                  </div>
                </div>
                <FiArrowRight className="w-6 h-6" />
              </Link>
            );
          })}
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quản lý nhanh</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/admin/users"
              className="flex items-center gap-3 p-4 rounded-lg border hover:border-green-500 hover:bg-green-50 transition"
            >
              <FiUsers className="w-6 h-6 text-green-600" />
              <span className="font-medium text-gray-900">Người dùng</span>
            </Link>
            <Link
              to="/admin/jobs"
              className="flex items-center gap-3 p-4 rounded-lg border hover:border-green-500 hover:bg-green-50 transition"
            >
              <FiBriefcase className="w-6 h-6 text-green-600" />
              <span className="font-medium text-gray-900">Việc làm</span>
            </Link>
            <Link
              to="/admin/companies"
              className="flex items-center gap-3 p-4 rounded-lg border hover:border-green-500 hover:bg-green-50 transition"
            >
              <FiHome className="w-6 h-6 text-green-600" />
              <span className="font-medium text-gray-900">Công ty</span>
            </Link>
            <Link
              to="/admin/categories"
              className="flex items-center gap-3 p-4 rounded-lg border hover:border-green-500 hover:bg-green-50 transition"
            >
              <FiTrendingUp className="w-6 h-6 text-green-600" />
              <span className="font-medium text-gray-900">Ngành nghề</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
