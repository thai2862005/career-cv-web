import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiEye, 
  FiToggleLeft, 
  FiToggleRight,
  FiUsers,
  FiSearch
} from 'react-icons/fi';
import { Loading, Button, Pagination } from '../../components';
import { jobService } from '../../services';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const HRJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadJobs();
  }, [pagination.page, filter]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: 10,
        isActive: filter === 'active' ? true : filter === 'inactive' ? false : undefined
      };
      
      const response = await jobService.getMyJobs(params);
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

  const handleToggle = async (id, currentStatus) => {
    try {
      await jobService.toggleJobStatus(id);
      setJobs(jobs.map(job => 
        job.id === id ? { ...job, isActive: !currentStatus } : job
      ));
      toast.success(currentStatus ? 'Đã tắt tuyển dụng' : 'Đã bật tuyển dụng');
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa tin tuyển dụng này?')) return;

    try {
      await jobService.deleteJob(id);
      setJobs(jobs.filter(job => job.id !== id));
      toast.success('Đã xóa tin tuyển dụng');
    } catch (error) {
      toast.error(error.message || 'Xóa thất bại');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý tin tuyển dụng</h1>
            <p className="text-gray-600 mt-1">{pagination.total} tin tuyển dụng</p>
          </div>
          <Link
            to="/hr/jobs/create"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
          >
            <FiPlus className="w-5 h-5" />
            Đăng tin mới
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'Tất cả' },
              { value: 'active', label: 'Đang tuyển' },
              { value: 'inactive', label: 'Đã đóng' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === option.value
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <Loading text="Đang tải danh sách..." />
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FiSearch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chưa có tin tuyển dụng nào
            </h3>
            <p className="text-gray-600 mb-6">
              Bắt đầu đăng tin để tìm kiếm ứng viên
            </p>
            <Link to="/hr/jobs/create">
              <Button>
                <FiPlus className="w-4 h-4 mr-2" />
                Đăng tin đầu tiên
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Tiêu đề
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Ứng viên
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Lượt xem
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Trạng thái
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Ngày đăng
                    </th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Link 
                          to={`/hr/jobs/${job.id}`}
                          className="font-medium text-gray-900 hover:text-green-600 transition"
                        >
                          {job.title}
                        </Link>
                        <p className="text-sm text-gray-500">{job.location}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Link 
                          to={`/hr/jobs/${job.id}/applications`}
                          className="flex items-center gap-1 text-gray-600 hover:text-green-600"
                        >
                          <FiUsers className="w-4 h-4" />
                          {job._count?.applications || 0}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1 text-gray-600">
                          <FiEye className="w-4 h-4" />
                          {job.viewCount || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggle(job.id, job.isActive)}
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                            job.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {job.isActive ? (
                            <>
                              <FiToggleRight className="w-4 h-4" />
                              Đang tuyển
                            </>
                          ) : (
                            <>
                              <FiToggleLeft className="w-4 h-4" />
                              Đã đóng
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {dayjs(job.createdAt).format('DD/MM/YYYY')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/hr/jobs/${job.id}/edit`)}
                            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(job.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
      </div>
    </div>
  );
};

export default HRJobs;
