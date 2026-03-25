import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBriefcase, FiClock, FiEye, FiCheckCircle, FiXCircle, FiTrash2 } from 'react-icons/fi';
import { Loading, Button, Pagination } from '../../components';
import { applicationService } from '../../services';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  useEffect(() => {
    loadApplications();
  }, [pagination.page]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const response = await applicationService.getMyApplications({
        page: pagination.page,
        limit: 10
      });
      setApplications(response.data || []);
      setPagination({
        page: response.pagination?.page || 1,
        totalPages: response.pagination?.totalPages || 1
      });
    } catch (error) {
      console.error('Error loading applications:', error);
      toast.error('Không thể tải danh sách ứng tuyển');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Bạn có chắc muốn hủy đơn ứng tuyển này?')) return;

    try {
      await applicationService.cancelApplication(id);
      setApplications(applications.filter(app => app.id !== id));
      toast.success('Đã hủy đơn ứng tuyển');
    } catch (error) {
      toast.error(error.message || 'Hủy thất bại');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-700', icon: FiClock },
      VIEWED: { label: 'Đã xem', color: 'bg-blue-100 text-blue-700', icon: FiEye },
      ACCEPTED: { label: 'Được chấp nhận', color: 'bg-green-100 text-green-700', icon: FiCheckCircle },
      REJECTED: { label: 'Từ chối', color: 'bg-red-100 text-red-700', icon: FiXCircle }
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4" />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return <Loading fullScreen text="Đang tải danh sách ứng tuyển..." />;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Đơn ứng tuyển của tôi</h1>
          <p className="text-gray-600 mt-1">Theo dõi trạng thái các đơn ứng tuyển</p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBriefcase className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chưa có đơn ứng tuyển nào
            </h3>
            <p className="text-gray-600 mb-6">
              Bắt đầu tìm kiếm và ứng tuyển việc làm ngay!
            </p>
            <Link to="/jobs">
              <Button>Tìm việc làm</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition"
                >
                  <div className="flex items-start gap-4">
                    {/* Company Logo */}
                    <Link
                      to={`/companies/${app.jobPost?.company?.id}`}
                      className="flex-shrink-0"
                    >
                      <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                        {app.jobPost?.company?.logoUrl ? (
                          <img
                            src={app.jobPost.company.logoUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xl font-bold text-gray-400">
                            {app.jobPost?.company?.name?.charAt(0)}
                          </span>
                        )}
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-grow min-w-0">
                      <Link
                        to={`/jobs/${app.jobPost?.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-green-600 transition line-clamp-1"
                      >
                        {app.jobPost?.title}
                      </Link>
                      <Link
                        to={`/companies/${app.jobPost?.company?.id}`}
                        className="text-gray-600 hover:text-green-600 transition text-sm"
                      >
                        {app.jobPost?.company?.name}
                      </Link>

                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FiClock className="w-4 h-4" />
                          Ứng tuyển: {dayjs(app.appliedAt).format('DD/MM/YYYY HH:mm')}
                        </span>
                        {app.reviewedAt && (
                          <span className="flex items-center gap-1">
                            <FiEye className="w-4 h-4" />
                            Xem lúc: {dayjs(app.reviewedAt).format('DD/MM/YYYY HH:mm')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex flex-col items-end gap-3">
                      {getStatusBadge(app.status)}
                      {app.status === 'PENDING' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancel(app.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <FiTrash2 className="w-4 h-4 mr-1" />
                          Hủy
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Cover Letter */}
                  {app.coverLetter && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-500 mb-1">Thư giới thiệu:</p>
                      <p className="text-gray-700 text-sm line-clamp-2">{app.coverLetter}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={(page) => setPagination(p => ({ ...p, page }))}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
