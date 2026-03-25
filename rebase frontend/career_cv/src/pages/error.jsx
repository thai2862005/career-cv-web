import { Link, useRouteError } from "react-router-dom";
import { FiHome, FiArrowLeft, FiAlertTriangle } from "react-icons/fi";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  const is404 = error?.status === 404;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiAlertTriangle className="w-12 h-12 text-red-500" />
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          {is404 ? '404' : 'Oops!'}
        </h1>
        
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          {is404 ? 'Trang không tồn tại' : 'Đã có lỗi xảy ra'}
        </h2>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          {is404 
            ? 'Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.'
            : error?.statusText || error?.message || 'Vui lòng thử lại sau.'
          }
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium"
          >
            <FiArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
          
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
          >
            <FiHome className="w-5 h-5" />
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
