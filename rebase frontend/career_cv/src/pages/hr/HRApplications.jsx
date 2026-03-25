import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiFileText, 
  FiCheck, 
  FiX,
  FiEye,
  FiDownload
} from 'react-icons/fi';
import { Loading, Button, Pagination, Select, Modal } from '../../components';
import { applicationService } from '../../services';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const HRApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadApplications();
  }, [pagination.page, statusFilter]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: 15,
        status: statusFilter || undefined
      };
      
      const response = await applicationService.getCompanyApplications(params);
      setApplications(response.data || []);
      setPagination({
        page: response.pagination?.page || 1,
        totalPages: response.pagination?.totalPages || 1,
        total: response.pagination?.total || 0
      });
    } catch (error) {
      console.error('Error loading applications:', error);
      toast.error('Không thể tải danh sách ứng viên');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    setUpdating(true);
    try {
      await applicationService.updateApplicationStatus(id, { status });
      setApplications(applications.map(app => 
        app.id === id ? { ...app, status } : app
      ));
      setSelectedApp(null);
      toast.success('Cập nhật trạng thái thành công');
    } catch (error) {
      toast.error('Cập nhật thất bại');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      PENDING: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-700' },
      VIEWED: { label: 'Đã xem', color: 'bg-blue-100 text-blue-700' },
      ACCEPTED: { label: 'Chấp nhận', color: 'bg-green-100 text-green-700' },
      REJECTED: { label: 'Từ chối', color: 'bg-red-100 text-red-700' }
    };
    const c = config[status] || config.PENDING;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.color}`}>
        {c.label}
      </span>
    );
  };

  const statusOptions = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'PENDING', label: 'Chờ xử lý' },
    { value: 'VIEWED', label: 'Đã xem' },
    { value: 'ACCEPTED', label: 'Chấp nhận' },
    { value: 'REJECTED', label: 'Từ chối' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý ứng viên</h1>
            <p className="text-gray-600 mt-1">{pagination.total} ứng viên</p>
          </div>
          <div className="w-full md:w-48">
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPagination(p => ({ ...p, page: 1 }));
              }}
              options={statusOptions}
            />
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <Loading text="Đang tải danh sách..." />
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FiUser className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chưa có ứng viên nào
            </h3>
            <p className="text-gray-600">
              Đăng tin tuyển dụng để nhận hồ sơ ứng viên
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                        Ứng viên
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                        Vị trí ứng tuyển
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                        Ngày ứng tuyển
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                        Trạng thái
                      </th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <FiUser className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {app.user?.Fullname}
                              </p>
                              <p className="text-sm text-gray-500">{app.user?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            to={`/hr/jobs/${app.jobPost?.id}`}
                            className="text-gray-900 hover:text-green-600"
                          >
                            {app.jobPost?.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                          {dayjs(app.appliedAt).format('DD/MM/YYYY HH:mm')}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(app.status)}
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedApp(app)}
                          >
                            <FiEye className="w-4 h-4 mr-1" />
                            Xem
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {pagination.totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={(page) => setPagination(p => ({ ...p, page }))}
                />
              </div>
            )}
          </>
        )}

        {/* Application Detail Modal */}
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title="Chi tiết hồ sơ ứng viên"
          size="lg"
        >
          {selectedApp && (
            <div className="p-6">
              {/* Candidate Info */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <FiUser className="w-8 h-8 text-gray-400" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedApp.user?.Fullname}
                  </h3>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <FiMail className="w-4 h-4" />
                      {selectedApp.user?.email}
                    </span>
                    {selectedApp.user?.phone && (
                      <span className="flex items-center gap-1">
                        <FiPhone className="w-4 h-4" />
                        {selectedApp.user.phone}
                      </span>
                    )}
                  </div>
                </div>
                {getStatusBadge(selectedApp.status)}
              </div>

              {/* Job Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-500 mb-1">Vị trí ứng tuyển</p>
                <p className="font-medium text-gray-900">{selectedApp.jobPost?.title}</p>
              </div>

              {/* CV */}
              {selectedApp.cv && (
                <div className="border rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FiFileText className="w-8 h-8 text-red-500" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {selectedApp.cv.title || selectedApp.cv.filename}
                        </p>
                        <p className="text-sm text-gray-500">CV ứng tuyển</p>
                      </div>
                    </div>
                    {selectedApp.cv.fileUrl && (
                      <a
                        href={selectedApp.cv.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-green-600 hover:underline"
                      >
                        <FiDownload className="w-4 h-4" />
                        Tải xuống
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Cover Letter */}
              {selectedApp.coverLetter && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">Thư giới thiệu</p>
                  <p className="text-gray-600 bg-gray-50 rounded-lg p-4 whitespace-pre-line">
                    {selectedApp.coverLetter}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                {selectedApp.status === 'PENDING' && (
                  <Button
                    variant="secondary"
                    onClick={() => handleUpdateStatus(selectedApp.id, 'VIEWED')}
                    loading={updating}
                  >
                    <FiEye className="w-4 h-4 mr-2" />
                    Đánh dấu đã xem
                  </Button>
                )}
                {(selectedApp.status === 'PENDING' || selectedApp.status === 'VIEWED') && (
                  <>
                    <Button
                      variant="danger"
                      onClick={() => handleUpdateStatus(selectedApp.id, 'REJECTED')}
                      loading={updating}
                    >
                      <FiX className="w-4 h-4 mr-2" />
                      Từ chối
                    </Button>
                    <Button
                      onClick={() => handleUpdateStatus(selectedApp.id, 'ACCEPTED')}
                      loading={updating}
                    >
                      <FiCheck className="w-4 h-4 mr-2" />
                      Chấp nhận
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default HRApplications;
