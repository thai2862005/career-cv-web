import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiSave, FiLock } from 'react-icons/fi';
import { Button, Input, Loading } from '../../components';
import { authService } from '../../services';
import { useAuthStore } from '../../store';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [form, setForm] = useState({
    Fullname: '',
    email: '',
    phone: '',
    address: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setForm({
        Fullname: user.Fullname || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await authService.updateProfile({
        Fullname: form.Fullname,
        phone: form.phone || undefined,
        address: form.address || undefined
      });
      
      updateUser(response.data);
      setEditing(false);
      toast.success('Cập nhật thành công!');
    } catch (error) {
      toast.error(error.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Mật khẩu mới không khớp');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);
    try {
      await authService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Đổi mật khẩu thành công!');
    } catch (error) {
      toast.error(error.message || 'Đổi mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Loading fullScreen />;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Hồ sơ cá nhân</h1>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <FiUser className="w-10 h-10 text-green-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user.Fullname}</h2>
              <p className="text-gray-500">{user.email}</p>
              <p className="text-sm text-green-600 capitalize">{user.roleName || user.role?.name}</p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-5">
            <Input
              label="Họ và tên"
              name="Fullname"
              value={form.Fullname}
              onChange={handleChange}
              disabled={!editing}
              leftIcon={<FiUser className="w-5 h-5" />}
            />

            <Input
              label="Email"
              name="email"
              value={form.email}
              disabled
              leftIcon={<FiMail className="w-5 h-5" />}
              helperText="Email không thể thay đổi"
            />

            <Input
              label="Số điện thoại"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              disabled={!editing}
              leftIcon={<FiPhone className="w-5 h-5" />}
              placeholder="Chưa cập nhật"
            />

            <Input
              label="Địa chỉ"
              name="address"
              value={form.address}
              onChange={handleChange}
              disabled={!editing}
              leftIcon={<FiMapPin className="w-5 h-5" />}
              placeholder="Chưa cập nhật"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            {editing ? (
              <>
                <Button variant="secondary" onClick={() => setEditing(false)}>
                  Hủy
                </Button>
                <Button onClick={handleSave} loading={loading}>
                  <FiSave className="w-4 h-4 mr-2" />
                  Lưu thay đổi
                </Button>
              </>
            ) : (
              <Button onClick={() => setEditing(true)}>
                <FiEdit2 className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </Button>
            )}
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bảo mật</h3>
          <Button variant="outline" onClick={() => setShowPasswordModal(true)}>
            <FiLock className="w-4 h-4 mr-2" />
            Đổi mật khẩu
          </Button>
        </div>

        {/* Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Đổi mật khẩu</h3>
              <div className="space-y-4">
                <Input
                  label="Mật khẩu hiện tại"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                  required
                />
                <Input
                  label="Mật khẩu mới"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                  required
                />
                <Input
                  label="Xác nhận mật khẩu mới"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  required
                />
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="secondary" onClick={() => setShowPasswordModal(false)} fullWidth>
                  Hủy
                </Button>
                <Button onClick={handleChangePassword} loading={loading} fullWidth>
                  Xác nhận
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
