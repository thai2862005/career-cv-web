import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiSearch } from 'react-icons/fi';
import { JobCard, Loading, Button } from '../../components';
import { jobService } from '../../services';
import toast from 'react-hot-toast';

const SavedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const loadSavedJobs = async () => {
    try {
      const response = await jobService.getSavedJobs();
      setJobs(response.data || []);
    } catch (error) {
      console.error('Error loading saved jobs:', error);
      toast.error('Không thể tải danh sách việc làm đã lưu');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (jobId) => {
    try {
      await jobService.unsaveJob(jobId);
      setJobs(jobs.filter(job => job.id !== jobId));
      toast.success('Đã bỏ lưu việc làm');
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  if (loading) {
    return <Loading fullScreen text="Đang tải việc làm đã lưu..." />;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Việc làm đã lưu</h1>
          <p className="text-gray-600 mt-1">
            {jobs.length} việc làm đã lưu
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiHeart className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chưa có việc làm nào được lưu
            </h3>
            <p className="text-gray-600 mb-6">
              Lưu những việc làm yêu thích để xem lại sau
            </p>
            <Link to="/jobs">
              <Button>
                <FiSearch className="w-4 h-4 mr-2" />
                Tìm việc làm
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onSave={handleUnsave}
                isSaved={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
