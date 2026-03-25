import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FiMapPin, 
  FiUsers, 
  FiGlobe, 
  FiCheckCircle,
  FiBriefcase,
  FiArrowLeft,
  FiStar
} from 'react-icons/fi';
import { Loading, Button, JobCard } from '../components';
import { companyService, jobService } from '../services';
import toast from 'react-hot-toast';

const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    loadCompany();
  }, [id]);

  const loadCompany = async () => {
    try {
      const [companyRes, reviewsRes] = await Promise.all([
        companyService.getCompanyById(id),
        companyService.getCompanyReviews(id)
      ]);
      
      setCompany(companyRes.data);
      setReviews(reviewsRes.data || []);
      
      // Load company jobs
      const jobsRes = await jobService.getJobs({ companyId: id, limit: 10 });
      setJobs(jobsRes.data || []);
    } catch (error) {
      console.error('Error loading company:', error);
      toast.error('Không thể tải thông tin công ty');
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return <Loading fullScreen text="Đang tải thông tin công ty..." />;
  }

  if (!company) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Không tìm thấy công ty
        </h2>
        <Link to="/companies" className="text-green-600 hover:underline">
          Quay lại danh sách công ty
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Cover Image */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-green-600 to-teal-600 relative">
        {company.coverImage && (
          <img
            src={company.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Company Header */}
        <div className="bg-white rounded-xl shadow-sm -mt-16 relative z-10 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo */}
            <div className="flex-shrink-0 -mt-20 md:-mt-24">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                {company.logoUrl ? (
                  <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-gray-400">{company.name?.charAt(0)}</span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{company.name}</h1>
                {company.isVerified && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    <FiCheckCircle className="w-4 h-4" />
                    Đã xác thực
                  </span>
                )}
              </div>

              {company.industry && (
                <p className="text-lg text-gray-600 mb-4">{company.industry}</p>
              )}

              <div className="flex flex-wrap gap-4 text-gray-600">
                {company.location && (
                  <span className="flex items-center gap-2">
                    <FiMapPin className="w-5 h-5 text-green-500" />
                    {company.location}
                  </span>
                )}
                {company.size && (
                  <span className="flex items-center gap-2">
                    <FiUsers className="w-5 h-5 text-green-500" />
                    {getSizeLabel(company.size)}
                  </span>
                )}
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-green-600 hover:underline"
                  >
                    <FiGlobe className="w-5 h-5" />
                    Website
                  </a>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 md:gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{jobs.length}</div>
                <div className="text-sm text-gray-500">Việc làm</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{reviews.length}</div>
                <div className="text-sm text-gray-500">Đánh giá</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b">
            <div className="flex gap-8 px-6">
              <button
                onClick={() => setActiveTab('about')}
                className={`py-4 border-b-2 font-medium transition ${
                  activeTab === 'about'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Giới thiệu
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`py-4 border-b-2 font-medium transition flex items-center gap-2 ${
                  activeTab === 'jobs'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <FiBriefcase className="w-4 h-4" />
                Việc làm ({jobs.length})
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 border-b-2 font-medium transition flex items-center gap-2 ${
                  activeTab === 'reviews'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <FiStar className="w-4 h-4" />
                Đánh giá ({reviews.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Về công ty</h3>
                <div className="text-gray-700 whitespace-pre-line">
                  {company.description || 'Chưa có thông tin giới thiệu.'}
                </div>
              </div>
            )}

            {/* Jobs Tab */}
            {activeTab === 'jobs' && (
              <div>
                {jobs.length === 0 ? (
                  <div className="text-center py-12">
                    <FiBriefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Chưa có việc làm nào</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {jobs.map((job) => (
                      <JobCard key={job.id} job={job} showCompany={false} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <FiStar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Chưa có đánh giá nào</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-6 last:border-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FiStar
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {review.isAnonymous ? 'Ẩn danh' : review.user?.Fullname}
                          </span>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                        <p className="text-gray-600 mb-3">{review.content}</p>
                        {(review.pros || review.cons) && (
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            {review.pros && (
                              <div>
                                <span className="text-green-600 font-medium">Điểm tốt:</span>
                                <p className="text-gray-600">{review.pros}</p>
                              </div>
                            )}
                            {review.cons && (
                              <div>
                                <span className="text-red-600 font-medium">Điểm cần cải thiện:</span>
                                <p className="text-gray-600">{review.cons}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
