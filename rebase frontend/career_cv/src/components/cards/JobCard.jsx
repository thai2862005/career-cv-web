import { Link } from 'react-router-dom';
import { FiMapPin, FiDollarSign, FiClock, FiBookmark, FiHeart } from 'react-icons/fi';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const JobCard = ({ job, onSave, isSaved = false, showCompany = true }) => {
  const {
    id,
    title,
    company,
    location,
    salary,
    salaryMax,
    jobType,
    createdAt,
    deadline,
    isActive
  } = job;

  const formatSalary = () => {
    if (!salary) return 'Thỏa thuận';
    if (salaryMax) {
      return `${(salary / 1000000).toFixed(0)} - ${(salaryMax / 1000000).toFixed(0)} triệu`;
    }
    return `${(salary / 1000000).toFixed(0)} triệu`;
  };

  const getJobTypeLabel = (type) => {
    const types = {
      FULL_TIME: 'Toàn thời gian',
      PART_TIME: 'Bán thời gian',
      CONTRACT: 'Hợp đồng',
      INTERNSHIP: 'Thực tập',
      REMOTE: 'Từ xa'
    };
    return types[type] || type;
  };

  const getJobTypeColor = (type) => {
    const colors = {
      FULL_TIME: 'bg-green-100 text-green-700',
      PART_TIME: 'bg-blue-100 text-blue-700',
      CONTRACT: 'bg-orange-100 text-orange-700',
      INTERNSHIP: 'bg-purple-100 text-purple-700',
      REMOTE: 'bg-teal-100 text-teal-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 p-5 group">
      <div className="flex gap-4">
        {/* Company Logo */}
        {showCompany && company && (
          <Link to={`/companies/${company.id}`} className="flex-shrink-0">
            <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-gray-400">
                  {company.name?.charAt(0)}
                </span>
              )}
            </div>
          </Link>
        )}

        {/* Job Info */}
        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <Link
                to={`/jobs/${id}`}
                className="text-lg font-semibold text-gray-900 hover:text-green-600 transition line-clamp-1"
              >
                {title}
              </Link>
              {showCompany && company && (
                <Link
                  to={`/companies/${company.id}`}
                  className="text-gray-600 hover:text-green-600 transition text-sm"
                >
                  {company.name}
                </Link>
              )}
            </div>

            {/* Save Button */}
            {onSave && (
              <button
                onClick={() => onSave(id)}
                className={`p-2 rounded-full transition ${
                  isSaved
                    ? 'text-red-500 bg-red-50 hover:bg-red-100'
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <FiHeart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <FiDollarSign className="w-4 h-4 text-green-500" />
              {formatSalary()}
            </span>
            <span className="flex items-center gap-1">
              <FiMapPin className="w-4 h-4 text-gray-400" />
              {location || 'Không xác định'}
            </span>
            <span className="flex items-center gap-1">
              <FiClock className="w-4 h-4 text-gray-400" />
              {dayjs(createdAt).fromNow()}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getJobTypeColor(jobType)}`}>
              {getJobTypeLabel(jobType)}
            </span>
            {deadline && dayjs(deadline).isBefore(dayjs().add(7, 'day')) && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                Sắp hết hạn
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Apply Button - shows on hover */}
      <div className="mt-4 pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link
          to={`/jobs/${id}`}
          className="block w-full text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium"
        >
          Ứng tuyển ngay
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
