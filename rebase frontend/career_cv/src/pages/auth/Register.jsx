import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import { Button, Input } from '../../components';
import { authService } from '../../services';
import { useAuthStore } from '../../store';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const isHR = searchParams.get('role') === 'hr';
  
  const [form, setForm] = useState({
    Fullname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!form.Fullname || form.Fullname.length < 2) {
      newErrors.Fullname = 'Họ tên phải có ít nhất 2 ký tự';
    }
    
    if (!form.email) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (form.phone && !/^[0-9]{10,11}$/.test(form.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    
    if (!form.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (form.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        Fullname: form.Fullname,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
        roleId: isHR ? 2 : 1 // 1 = JOB_SEEKER, 2 = HR
      };
      
      const response = await authService.register(payload);
      const { user, token } = response.data || response;
      
      setAuth(user, token);
      toast.success('Đăng ký thành công!');
      
      if (isHR) {
        navigate('/hr/company/create');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message || 'Đăng ký thất bại');
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
            {isHR ? 'Đăng ký nhà tuyển dụng' : 'Tạo tài khoản mới'}
          </h1>
          <p className="text-gray-600 text-center mb-8">
            {isHR 
              ? 'Tìm kiếm ứng viên tiềm năng cho công ty của bạn'
              : 'Bắt đầu hành trình tìm việc của bạn ngay hôm nay'
            }
          </p>

          {/* Role Tabs */}
          <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
            <Link
              to="/register"
              className={`flex-1 py-2 text-center rounded-md font-medium transition ${
                !isHR
                  ? 'bg-white text-green-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Ứng viên
            </Link>
            <Link
              to="/register?role=hr"
              className={`flex-1 py-2 text-center rounded-md font-medium transition ${
                isHR
                  ? 'bg-white text-green-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Nhà tuyển dụng
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Họ và tên"
              type="text"
              name="Fullname"
              value={form.Fullname}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
              error={errors.Fullname}
              leftIcon={<FiUser className="w-5 h-5" />}
              required
            />

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
              label="Số điện thoại"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="0901234567"
              error={errors.phone}
              leftIcon={<FiPhone className="w-5 h-5" />}
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

            <Input
              label="Xác nhận mật khẩu"
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              error={errors.confirmPassword}
              leftIcon={<FiLock className="w-5 h-5" />}
              required
            />

            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 mt-1 text-green-600 rounded focus:ring-green-500" required />
              <span className="text-sm text-gray-600">
                Tôi đồng ý với{' '}
                <Link to="/terms" className="text-green-600 hover:underline">
                  Điều khoản sử dụng
                </Link>
                {' '}và{' '}
                <Link to="/privacy" className="text-green-600 hover:underline">
                  Chính sách bảo mật
                </Link>
              </span>
            </label>

            <Button type="submit" fullWidth size="lg" loading={loading}>
              Đăng ký
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-green-600 font-medium hover:underline">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
