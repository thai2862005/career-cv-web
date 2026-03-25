import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { Button, Input } from '../../components';
import { authService } from '../../services';
import { useAuthStore } from '../../store';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!form.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await authService.login(form);
      const { user, token } = response.data || response;
      
      setAuth(user, token);
      toast.success('Đăng nhập thành công!');
      
      // Navigate based on role
      const roleName = user.roleName || user.role?.name;
      if (roleName === 'ADMIN') {
        navigate('/admin');
      } else if (roleName === 'HR') {
        navigate('/hr');
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.error(error.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">CV</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">CareerCV</span>
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Chào mừng trở lại
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Đăng nhập để tiếp tục tìm kiếm cơ hội việc làm
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              error={errors.email}
              leftIcon={<FiMail className="w-5 h-5" />}
              required
            />

            <Input
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              error={errors.password}
              leftIcon={<FiLock className="w-5 h-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              }
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-green-600 rounded focus:ring-green-500" />
                <span className="text-sm text-gray-600">Ghi nhớ đăng nhập</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-green-600 hover:underline">
                Quên mật khẩu?
              </Link>
            </div>

            <Button type="submit" fullWidth size="lg" loading={loading}>
              Đăng nhập
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-green-600 font-medium hover:underline">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>

        {/* HR Registration */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Bạn là nhà tuyển dụng?{' '}
            <Link to="/register?role=hr" className="text-green-600 hover:underline">
              Đăng ký tài khoản HR
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
