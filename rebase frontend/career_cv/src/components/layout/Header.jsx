import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiMenu, 
  FiX, 
  FiBell, 
  FiUser, 
  FiLogOut, 
  FiChevronDown,
  FiBriefcase,
  FiFileText,
  FiSettings,
  FiGrid
} from 'react-icons/fi';
import { useAuthStore } from '../../store';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, logout, isHR, isAdmin, isJobSeeker } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  const getDashboardLink = () => {
    if (isAdmin()) return '/admin';
    if (isHR()) return '/hr';
    return '/dashboard';
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">CV</span>
            </div>
            <span className="text-xl font-bold text-gray-900">CareerCV</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/jobs" className="text-gray-700 hover:text-green-600 font-medium transition">
              Việc làm
            </Link>
            <Link to="/companies" className="text-gray-700 hover:text-green-600 font-medium transition">
              Công ty
            </Link>
            {isAuthenticated && isJobSeeker() && (
              <>
                <Link to="/saved-jobs" className="text-gray-700 hover:text-green-600 font-medium transition">
                  Việc đã lưu
                </Link>
                <Link to="/my-applications" className="text-gray-700 hover:text-green-600 font-medium transition">
                  Đã ứng tuyển
                </Link>
              </>
            )}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:text-green-600 transition">
                  <FiBell className="w-6 h-6" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <FiUser className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">{user?.Fullname || 'User'}</span>
                    <FiChevronDown className={`w-4 h-4 text-gray-500 transition ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-2 z-50">
                      <Link
                        to={getDashboardLink()}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        <FiGrid className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        <FiUser className="w-4 h-4" />
                        <span>Hồ sơ cá nhân</span>
                      </Link>
                      {isJobSeeker() && (
                        <Link
                          to="/my-cv"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          <FiFileText className="w-4 h-4" />
                          <span>Quản lý CV</span>
                        </Link>
                      )}
                      <Link
                        to="/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        <FiSettings className="w-4 h-4" />
                        <span>Cài đặt</span>
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 w-full"
                      >
                        <FiLogOut className="w-4 h-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* HR: Post Job Button */}
                {isHR() && (
                  <Link
                    to="/hr/jobs/create"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    Đăng tuyển
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-green-600 font-medium transition"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600"
          >
            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link to="/jobs" className="text-gray-700 hover:text-green-600 font-medium">
                Việc làm
              </Link>
              <Link to="/companies" className="text-gray-700 hover:text-green-600 font-medium">
                Công ty
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to={getDashboardLink()} className="text-gray-700 hover:text-green-600 font-medium">
                    Dashboard
                  </Link>
                  <Link to="/profile" className="text-gray-700 hover:text-green-600 font-medium">
                    Hồ sơ
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 font-medium text-left"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-green-600 font-medium">
                    Đăng nhập
                  </Link>
                  <Link to="/register" className="text-green-600 font-medium">
                    Đăng ký
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
