import { useState, useEffect } from 'react';
import { 
  FiUser, 
  FiMail, 
  FiToggleLeft, 
  FiToggleRight,
  FiTrash2,
  FiKey,
  FiSearch
} from 'react-icons/fi';
import { Loading, Button, Pagination, Select, Input, Modal } from '../../components';
import { adminService } from '../../services';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [roleFilter, setRoleFilter] = useState('');
  const [keyword, setKeyword] = useState('');
  const [resetModal, setResetModal] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    loadUsers();
  }, [pagination.page, roleFilter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: 15,
        role: roleFilter || undefined,
        keyword: keyword || undefined
      };
      
      const response = await adminService.getUsers(params);
      setUsers(response.data || []);
      setPagination({
        page: response.pagination?.page || 1,
        totalPages: response.pagination?.totalPages || 1,
        total: response.pagination?.total || 0
      });
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(p => ({ ...p, page: 1 }));
    loadUsers();
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await adminService.toggleUserStatus(id);
      setUsers(users.map(user => 
        user.id === id ? { ...user, isActive: !currentStatus } : user
      ));
      toast.success(currentStatus ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản');
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa người dùng này?')) return;

    try {
      await adminService.deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
      toast.success('Đã xóa người dùng');
    } catch (error) {
      toast.error(error.message || 'Xóa thất bại');
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    try {
      await adminService.resetPassword(resetModal.id, { password: newPassword });
      setResetModal(null);
      setNewPassword('');
      toast.success('Đã đặt lại mật khẩu');
    } catch (error) {
      toast.error('Đặt lại mật khẩu thất bại');
    }
  };

  const getRoleBadge = (roleName) => {
    const config = {
      ADMIN: 'bg-red-100 text-red-700',
      HR: 'bg-blue-100 text-blue-700',
      JOB_SEEKER: 'bg-green-100 text-green-700'
    };
    const labels = {
      ADMIN: 'Admin',
      HR: 'HR',
      JOB_SEEKER: 'Ứng viên'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config[roleName] || 'bg-gray-100'}`}>
        {labels[roleName] || roleName}
      </span>
    );
  };

  const roleOptions = [
    { value: '', label: 'Tất cả vai trò' },
    { value: 'JOB_SEEKER', label: 'Ứng viên' },
    { value: 'HR', label: 'HR' },
    { value: 'ADMIN', label: 'Admin' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
          <p className="text-gray-600 mt-1">{pagination.total} người dùng</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Tìm theo tên, email..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                leftIcon={<FiSearch className="w-5 h-5" />}
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPagination(p => ({ ...p, page: 1 }));
                }}
                options={roleOptions}
              />
            </div>
            <Button type="submit">Tìm kiếm</Button>
          </form>
        </div>

        {/* Users List */}
        {loading ? (
          <Loading text="Đang tải danh sách..." />
        ) : users.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FiUser className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không tìm thấy người dùng
            </h3>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                        Người dùng
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                        Vai trò
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                        Trạng thái
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                        Ngày tạo
                      </th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <FiUser className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{user.Fullname}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getRoleBadge(user.role?.name || user.roleName)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleStatus(user.id, user.isActive)}
                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                              user.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {user.isActive ? (
                              <>
                                <FiToggleRight className="w-4 h-4" />
                                Hoạt động
                              </>
                            ) : (
                              <>
                                <FiToggleLeft className="w-4 h-4" />
                                Đã khóa
                              </>
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                          {dayjs(user.createdAt).format('DD/MM/YYYY')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setResetModal(user)}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Đặt lại mật khẩu"
                            >
                              <FiKey className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Xóa"
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

        {/* Reset Password Modal */}
        <Modal
          isOpen={!!resetModal}
          onClose={() => {
            setResetModal(null);
            setNewPassword('');
          }}
          title="Đặt lại mật khẩu"
          size="sm"
        >
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Đặt lại mật khẩu cho <strong>{resetModal?.Fullname}</strong>
            </p>
            <Input
              label="Mật khẩu mới"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới"
            />
            <div className="flex gap-3 mt-6">
              <Button variant="secondary" onClick={() => setResetModal(null)} fullWidth>
                Hủy
              </Button>
              <Button onClick={handleResetPassword} fullWidth>
                Xác nhận
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AdminUsers;
