import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { JobCard, CompanyCard, CategoryCard, Loading } from '../components';
import { Card, Badge, Button } from '../components/ui';
import { jobService, companyService, categoryService } from '../services';

const Home = () => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [topCompanies, setTopCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [jobsRes, companiesRes, categoriesRes] = await Promise.all([
        jobService.getJobs({ limit: 6 }),
        companyService.getCompanies({ limit: 6 }),
        categoryService.getCategories()
      ]);

      setFeaturedJobs(jobsRes.data || []);
      setTopCompanies(companiesRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (location) params.set('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  if (loading) {
    return <Loading fullScreen text="Đang tải trang chủ..." />;
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6 lg:px-24">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-bl from-primary-container/30 to-transparent rounded-bl-[120px]"></div>
        </div>

        <div className="relative z-10 max-w-5xl">
          <p className="font-headline font-bold text-primary tracking-wider mb-4 uppercase text-sm">
            Nền tảng tuyển dụng hàng đầu
          </p>
          <h1 className="font-headline text-5xl md:text-6xl font-extrabold text-on-surface leading-tight tracking-tight mb-8">
            Curating the world's <span className="italic">exceptional</span> talent.
          </h1>

          {/* Bento-style Search Bar */}
          <form
            onSubmit={handleSearch}
            className="mt-12 p-2 bg-surface-container-lowest editorial-shadow rounded-xl flex flex-col md:flex-row gap-2 border border-outline-variant/10"
          >
            <div className="flex-1 flex items-center px-4 py-3 gap-3 border-r border-outline-variant/10">
              <span className="material-symbols-outlined text-primary text-xl">search</span>
              <input
                type="text"
                placeholder="Vị trí, kỹ năng, từ khóa..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/60 font-body outline-none"
              />
            </div>
            <div className="flex-1 flex items-center px-4 py-3 gap-3">
              <span className="material-symbols-outlined text-primary text-xl">location_on</span>
              <input
                type="text"
                placeholder="Địa điểm hoặc remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/60 font-body outline-none"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="px-10 rounded-base"
            >
              Tìm kiếm
            </Button>
          </form>

          <div className="mt-8 flex flex-wrap gap-6 text-sm text-on-surface-variant">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary scale-75">check_circle</span>
              12,400+ Việc làm
            </span>
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary scale-75">check_circle</span>
              Công ty hàng đầu
            </span>
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary scale-75">check_circle</span>
              AI-Powered Matching
            </span>
          </div>
        </div>
      </section>

      {/* Featured Jobs (Bento Grid) */}
      {featuredJobs.length > 0 && (
        <section className="bg-surface-container-low py-24 px-6 lg:px-24">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-16">
              <div>
                <h2 className="font-headline text-4xl font-bold tracking-tight text-on-surface mb-2">
                  Việc làm nổi bật
                </h2>
                <p className="text-on-surface-variant body">
                  Những cơ hội tuyệt vời dành cho bạn.
                </p>
              </div>
              <Link
                to="/jobs"
                className="text-primary font-semibold flex items-center gap-1 group hover-lift hidden md:flex"
              >
                Xem tất cả
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredJobs.map((job) => (
                <Card
                  key={job.id}
                  elevated
                  interactive
                  className="border-l-4 border-primary group cursor-pointer"
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="h-14 w-14 rounded-base bg-surface-container overflow-hidden p-2 flex items-center justify-center">
                      {job.company?.logo ? (
                        <img
                          src={job.company.logo}
                          alt={job.company.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-primary">business</span>
                      )}
                    </div>
                    {job.matchScore && (
                      <Badge variant="match" size="sm">
                        {job.matchScore}% MATCH
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-headline text-xl font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-on-surface-variant text-sm font-medium mb-6">
                    {job.company?.name} • {job.location}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-outline-variant/10">
                    <span className="text-on-surface font-semibold">
                      {job.salaryMin}-{job.salaryMax}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/jobs/${job.id}`);
                      }}
                    >
                      Chi tiết
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12 md:hidden">
              <Link to="/jobs">
                <Button variant="primary" size="lg">
                  Xem tất cả việc làm
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Top Companies (Atmospheric Layering) */}
      {topCompanies.length > 0 && (
        <section className="py-24 px-6 lg:px-24 bg-surface">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface mb-4">
                Các công ty hàng đầu
              </h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto">
                Cơ hội làm việc với những tổ chức uy tín toàn cầu.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
              {topCompanies.map((company) => (
                <Link
                  key={company.id}
                  to={`/companies/${company.id}`}
                  className="h-16 flex items-center justify-center opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all"
                >
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="h-auto max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <p className="font-headline font-bold text-on-surface text-sm">{company.name}</p>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Us / System Overview */}
      <section className="py-32 px-6 lg:px-24 relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 relative">
            <div className="aspect-square rounded-3xl overflow-hidden editorial-shadow bg-surface-container-high">
              <div className="w-full h-full bg-gradient-to-br from-primary-container to-primary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-9xl opacity-20">
                  groups
                </span>
              </div>
            </div>

            <div className="absolute -bottom-10 -right-10 bg-primary p-8 rounded-2xl text-on-primary editorial-shadow hidden md:block max-w-xs">
              <p className="font-headline text-3xl font-extrabold mb-2">94%</p>
              <p className="text-sm font-medium opacity-90">
                Tỷ lệ thành công cho những vị trí được tuyển dụng.
              </p>
            </div>
          </div>

          <div className="lg:w-1/2">
            <span className="text-primary font-bold text-sm mb-4 block uppercase tracking-widest">
              Về nền tảng
            </span>
            <h2 className="font-headline text-5xl font-extrabold text-on-surface mb-8 leading-tight tracking-tight">
              Khám phá <span className="italic font-normal">tài năng</span> toàn cầu.
            </h2>
            <p className="text-on-surface-variant text-lg mb-8 leading-relaxed">
              Nền tảng của chúng tôi kết hợp trí tuệ nhân tạo với trực giác con người để tạo ra những kết quả tuyệt vời.
              Chúng tôi không chỉ là một cơ sở dữ liệu, mà là một hệ sinh thái kỹ thuật số được thiết kế cho các nhà tuyển
              dụng trao đổi tinh tế.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-base bg-primary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary">psychology</span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-lg text-on-surface">Đối sánh thông minh</h4>
                  <p className="text-on-surface-variant text-sm">
                    Phân tích hơn 140 điểm dữ liệu để tìm kết quả khớp hoàn hảo.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-base bg-primary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary">verified_user</span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-lg text-on-surface">Ứng viên được xác minh</h4>
                  <p className="text-on-surface-variant text-sm">
                    Mỗi chuyên gia được xác minh kỹ lưỡng trong mạng của chúng tôi.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 flex gap-4">
              <Link to="/register">
                <Button variant="primary">Bắt đầu ngay</Button>
              </Link>
              <Button variant="outline">Phương pháp của chúng tôi</Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mb-24 px-6 lg:px-24">
        <div className="max-w-7xl mx-auto bg-on-surface rounded-3xl p-12 lg:p-24 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-transparent"></div>
          <div className="relative z-10">
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-on-primary mb-6">
              Sẵn sàng bắt đầu?
            </h2>
            <p className="text-on-primary/70 max-w-xl mx-auto mb-12 text-lg">
              Gia nhập 2,000+ tổ chức hàng đầu thế giới sử dụng nền tảng của chúng tôi.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Link to="/register">
                <Button variant="primary" size="xl">
                  Tạo tài khoản
                </Button>
              </Link>
              <Button variant="outline" size="xl">
                Lịch hò gặp mặt
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

