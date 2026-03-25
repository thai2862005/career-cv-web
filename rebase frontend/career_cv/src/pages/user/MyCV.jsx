import { useState, useEffect, useRef } from 'react';
import { FiUpload, FiFile, FiTrash2, FiStar, FiDownload, FiEdit2 } from 'react-icons/fi';
import { Button, Loading, Modal, Input } from '../../components';
import { cvService } from '../../services';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const MyCV = () => {
  const [cvs, setCVs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingCV, setEditingCV] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadCVs();
  }, []);

  const loadCVs = async () => {
    try {
      const response = await cvService.getMyCVs();
      setCVs(response.data || []);
    } catch (error) {
      console.error('Error loading CVs:', error);
      toast.error('Không thể tải danh sách CV');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Chỉ chấp nhận file PDF, DOC, DOCX');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File không được vượt quá 5MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('cv', file);
      formData.append('title', file.name.replace(/\.[^/.]+$/, ''));

      await cvService.uploadCV(formData);
      toast.success('Tải CV thành công!');
      loadCVs();
    } catch (error) {
      toast.error(error.message || 'Tải CV thất bại');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await cvService.setDefaultCV(id);
      setCVs(cvs.map(cv => ({ ...cv, isDefault: cv.id === id })));
      toast.success('Đã đặt CV mặc định');
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa CV này?')) return;

    try {
      await cvService.deleteCV(id);
      setCVs(cvs.filter(cv => cv.id !== id));
      toast.success('Đã xóa CV');
    } catch (error) {
      toast.error(error.message || 'Xóa CV thất bại');
    }
  };

  const handleEdit = (cv) => {
    setEditingCV(cv);
    setEditTitle(cv.title || '');
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      toast.error('Vui lòng nhập tên CV');
      return;
    }

    try {
      await cvService.updateCV(editingCV.id, { title: editTitle });
      setCVs(cvs.map(cv => cv.id === editingCV.id ? { ...cv, title: editTitle } : cv));
      setEditingCV(null);
      toast.success('Cập nhật thành công');
    } catch (error) {
      toast.error('Cập nhật thất bại');
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  if (loading) {
    return <Loading fullScreen text="Đang tải danh sách CV..." />;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý CV</h1>
            <p className="text-gray-600 mt-1">Tải lên và quản lý CV của bạn</p>
          </div>
          <Button onClick={() => fileInputRef.current?.click()} loading={uploading}>
            <FiUpload className="w-4 h-4 mr-2" />
            Tải CV lên
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleUpload}
            className="hidden"
          />
        </div>

        {cvs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiFile className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chưa có CV nào
            </h3>
            <p className="text-gray-600 mb-6">
              Tải lên CV để bắt đầu ứng tuyển công việc
            </p>
            <Button onClick={() => fileInputRef.current?.click()}>
              <FiUpload className="w-4 h-4 mr-2" />
              Tải CV đầu tiên
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {cvs.map((cv) => (
              <div
                key={cv.id}
                className={`bg-white rounded-xl shadow-sm p-5 border-2 transition ${
                  cv.isDefault ? 'border-green-500' : 'border-transparent hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiFile className="w-6 h-6 text-red-600" />
                  </div>

                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {cv.title || cv.filename}
                      </h3>
                      {cv.isDefault && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                          <FiStar className="w-3 h-3" />
                          Mặc định
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span>{cv.filename}</span>
                      <span>{formatFileSize(cv.fileSize)}</span>
                      <span>{dayjs(cv.createdAt).format('DD/MM/YYYY')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!cv.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefault(cv.id)}
                        title="Đặt làm mặc định"
                      >
                        <FiStar className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(cv)}
                      title="Chỉnh sửa"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </Button>
                    {cv.fileUrl && (
                      <a
                        href={cv.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        title="Tải xuống"
                      >
                        <FiDownload className="w-4 h-4" />
                      </a>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(cv.id)}
                      className="text-red-600 hover:bg-red-50"
                      title="Xóa"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        <Modal
          isOpen={!!editingCV}
          onClose={() => setEditingCV(null)}
          title="Chỉnh sửa CV"
          size="sm"
        >
          <div className="p-6">
            <Input
              label="Tên CV"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="VD: CV_Developer_2024"
            />
            <div className="flex gap-3 mt-6">
              <Button variant="secondary" onClick={() => setEditingCV(null)} fullWidth>
                Hủy
              </Button>
              <Button onClick={handleSaveEdit} fullWidth>
                Lưu
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default MyCV;
