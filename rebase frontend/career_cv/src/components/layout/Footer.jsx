import { Link } from 'react-router-dom';
import { FiFacebook, FiLinkedin, FiTwitter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">CV</span>
              </div>
              <span className="text-xl font-bold text-white">CareerCV</span>
            </div>
            <p className="text-gray-400 mb-4">
              Nền tảng tuyển dụng hàng đầu Việt Nam, kết nối nhà tuyển dụng với ứng viên tiềm năng.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-green-500 transition">
                <FiFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-green-500 transition">
                <FiLinkedin className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-green-500 transition">
                <FiTwitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* For Job Seekers */}
          <div>
            <h3 className="text-white font-semibold mb-4">Dành cho ứng viên</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/jobs" className="hover:text-green-500 transition">
                  Tìm việc làm
                </Link>
              </li>
              <li>
                <Link to="/companies" className="hover:text-green-500 transition">
                  Danh sách công ty
                </Link>
              </li>
              <li>
                <Link to="/my-cv" className="hover:text-green-500 transition">
                  Quản lý CV
                </Link>
              </li>
              <li>
                <Link to="/saved-jobs" className="hover:text-green-500 transition">
                  Việc làm đã lưu
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-white font-semibold mb-4">Dành cho nhà tuyển dụng</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/hr" className="hover:text-green-500 transition">
                  Đăng tin tuyển dụng
                </Link>
              </li>
              <li>
                <Link to="/hr/candidates" className="hover:text-green-500 transition">
                  Tìm kiếm ứng viên
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-green-500 transition">
                  Bảng giá dịch vụ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <FiMapPin className="w-5 h-5 text-green-500" />
                <span>123 Đường ABC, Quận 1, TP.HCM</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiPhone className="w-5 h-5 text-green-500" />
                <span>(028) 1234 5678</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="w-5 h-5 text-green-500" />
                <span>contact@careercv.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-800 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2024 CareerCV. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/terms" className="text-gray-500 hover:text-gray-400 text-sm">
              Điều khoản sử dụng
            </Link>
            <Link to="/privacy" className="text-gray-500 hover:text-gray-400 text-sm">
              Chính sách bảo mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
