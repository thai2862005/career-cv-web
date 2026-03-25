import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { Button, Input, Select, Loading } from '../../components';
import { jobService, categoryService } from '../../services';
import toast from 'react-hot-toast';

const CreateJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    requirements: '',
    benefits: '',
    location: '',
    salary: '',
    salaryMax: '',
    jobType: 'FULL_TIME',
    experience: '',
    categoryId: '',
    deadline: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCategories();
    if (isEdit) {
      loadJob();
    }
  }, [id]);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadJob = async () => {
    setLoading(true);
    try {
      const response = await jobService.getJobById(id);
      const job = response.data;
      setForm({
        title: job.title || '',
        description: job.description || '',
        requirements: job.requirements || '',
        benefits: job.benefits || '',
        location: job.location || '',
        salary: job.salary?.toString() || '',
        salaryMax: job.salaryMax?.toString() || '',
        jobType: job.jobType || 'FULL_TIME',
        experience: job.experience || '',
        categoryId: job.categoryId?.toString() || '',
        deadline: job.deadline ? job.deadline.split('T')[0] : ''
      });
    } catch (error) {
      toast.error('Không thể tải thông tin việc làm');
      navigate('/hr/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title) newErrors.title = 'Vui lòng nhập tiêu đề';
    if (!form.description) newErrors.description = 'Vui lòng nhập mô tả công việc';
    if (!form.location) newErrors.location = 'Vui lòng nhập địa điểm';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        requirements: form.requirements || undefined,
        benefits: form.benefits || undefined,
        location: form.location,
        salary: form.salary ? Number(form.salary) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
        jobType: form.jobType,
        experience: form.experience || undefined,
        categoryId: form.categoryId ? Number(form.categoryId) : undefined,
        deadline: form.deadline || undefined
      };

      if (isEdit) {
        await jobService.updateJob(id, payload);
        toast.success('Cập nhật thành công!');
      } else {
        await jobService.createJob(payload);
        toast.success('Đăng tin thành công!');
      }
      
      navigate('/hr/jobs');
    } catch (error) {
      toast.error(error.message || (isEdit ? 'Cập nhật thất bại' : 'Đăng tin thất bại'));
    } finally {
      setLoading(false);
    }
  };

  const jobTypeOptions = [
    { value: 'FULL_TIME', label: 'Toàn thời gian' },
    { value: 'PART_TIME', label: 'Bán thời gian' },
    { value: 'CONTRACT', label: 'Hợp đồng' },
    { value: 'INTERNSHIP', label: 'Thực tập' },
    { value: 'REMOTE', label: 'Từ xa' },
  ];

  if (loading && isEdit) {
    return <Loading fullScreen text="Đang tải thông tin..." />;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Chỉnh sửa tin tuyển dụng' : 'Đăng tin tuyển dụng mới'}
            </h1>
            <p className="text-gray-600 mt-1">
              Điền đầy đủ thông tin để thu hút ứng viên phù hợp
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h2>
            <div className="space-y-4">
              <Input
                label="Tiêu đề công việc"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="VD: Senior Frontend Developer"
                error={errors.title}
                required
              />

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Địa điểm làm việc"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="VD: Hà Nội, TP.HCM"
                  error={errors.location}
                  required
                />
                <Select
                  label="Hình thức làm việc"
                  name="jobType"
                  value={form.jobType}
                  onChange={handleChange}
                  options={jobTypeOptions}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Select
                  label="Ngành nghề"
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  options={categories.map(c => ({ value: c.id, label: c.name }))}
                  placeholder="Chọn ngành nghề"
                />
                <Input
                  label="Kinh nghiệm yêu cầu"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="VD: 2-3 năm"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <Input
                  label="Mức lương từ (VND)"
                  name="salary"
                  type="number"
                  value={form.salary}
                  onChange={handleChange}
                  placeholder="VD: 15000000"
                />
                <Input
                  label="Đến (VND)"
                  name="salaryMax"
                  type="number"
                  value={form.salaryMax}
                  onChange={handleChange}
                  placeholder="VD: 25000000"
                />
                <Input
                  label="Hạn nộp hồ sơ"
                  name="deadline"
                  type="date"
                  value={form.deadline}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Mô tả công việc</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả công việc <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Mô tả chi tiết về công việc, trách nhiệm..."
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yêu cầu ứng viên
                </label>
                <textarea
                  name="requirements"
                  value={form.requirements}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Kỹ năng, bằng cấp, kinh nghiệm yêu cầu..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quyền lợi
                </label>
                <textarea
                  name="benefits"
                  value={form.benefits}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Lương, thưởng, phúc lợi, môi trường làm việc..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/hr/jobs')}
            >
              Hủy
            </Button>
            <Button type="submit" loading={loading}>
              <FiSave className="w-4 h-4 mr-2" />
              {isEdit ? 'Cập nhật' : 'Đăng tin'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;
