import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiMapPin } from 'react-icons/fi';
import { CompanyCard, Loading, Pagination, Button } from '../components';
import { companyService } from '../services';
import toast from 'react-hot-toast';

const Companies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');

  useEffect(() => {
    loadCompanies();
  }, [searchParams]);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const params = {
        page: searchParams.get('page') || 1,
        limit: 12,
        keyword: searchParams.get('keyword') || undefined,
        location: searchParams.get('location') || undefined,
      };

      const response = await companyService.getCompanies(params);
      setCompanies(response.data || []);
      setPagination({
        page: response.pagination?.page || 1,
        totalPages: response.pagination?.totalPages || 1,
        total: response.pagination?.total || 0
      });
    } catch (error) {
      console.error('Error loading companies:', error);
      toast.error('Không thể tải danh sách công ty');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (location) params.set('location', location);
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white text-center mb-6">
            Khám phá các công ty hàng đầu
          </h1>

          <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-lg p-4 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tên công ty..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex-1 relative">
                <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Địa điểm..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <Button type="submit" size="lg">
                <FiSearch className="w-5 h-5 mr-2" />
                Tìm kiếm
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Tìm thấy <span className="font-semibold text-green-600">{pagination.total}</span> công ty
          </p>
        </div>

        {loading ? (
          <Loading text="Đang tải danh sách công ty..." />
        ) : companies.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiSearch className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy công ty
            </h3>
            <p className="text-gray-600">
              Hãy thử thay đổi từ khóa tìm kiếm
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Companies;
