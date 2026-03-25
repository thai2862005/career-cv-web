import { Link } from 'react-router-dom';
import { FiMapPin, FiUsers, FiBriefcase, FiCheckCircle } from 'react-icons/fi';

const CompanyCard = ({ company }) => {
  const {
    id,
    name,
    logoUrl,
    location,
    industry,
    size,
    isVerified,
    _count
  } = company;

  const getSizeLabel = (size) => {
    const sizes = {
      '1-10': '1-10 nhân viên',
      '11-50': '11-50 nhân viên',
      '51-200': '51-200 nhân viên',
      '201-500': '201-500 nhân viên',
      '501-1000': '501-1000 nhân viên',
      '1000+': 'Trên 1000 nhân viên'
    };
    return sizes[size] || size;
  };

  return (
    <Link
      to={`/companies/${id}`}
      className="block bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 p-5 group"
    >
      <div className="flex gap-4">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-gray-400">
                {name?.charAt(0)}
              </span>
            )}
          </div>
        </div>

        {/* Company Info */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition line-clamp-1">
              {name}
            </h3>
            {isVerified && (
              <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            )}
          </div>

          {industry && (
            <p className="text-gray-600 text-sm mt-1">{industry}</p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
            {location && (
              <span className="flex items-center gap-1">
                <FiMapPin className="w-4 h-4" />
                {location}
              </span>
            )}
            {size && (
              <span className="flex items-center gap-1">
                <FiUsers className="w-4 h-4" />
                {getSizeLabel(size)}
              </span>
            )}
          </div>

          {/* Job Count */}
          {_count?.jobPosts > 0 && (
            <div className="mt-3">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                <FiBriefcase className="w-3 h-3" />
                {_count.jobPosts} việc làm đang tuyển
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CompanyCard;
