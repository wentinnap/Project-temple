import { useState, useEffect, useRef } from "react";
import API from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";
import { 
  Upload, 
  X, 
  Edit2, 
  Trash2, 
  Search, 
  Calendar,
  Eye,
  Plus,
  Image as ImageIcon,
  AlertCircle,
  Check,
  Loader,
  RefreshCw
} from "lucide-react";

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [previewFiles, setPreviewFiles] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Form states
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    category: "กิจกรรม",
    date: new Date().toISOString().split('T')[0]
  });

  const categories = ["กิจกรรม", "พิธีกรรม", "เทศกาล"];

  // Fetch images from API
  const fetchImages = async (page = 1) => {
    setLoading(true);
    setError("");
    
    try {
      const response = await API.get("/gallery", {
        params: {
          page,
          limit: pagination.limit
        }
      });

      // Handle different API response formats
      let imageData = [];
      let paginationData = pagination;

      if (response.data) {
        if (Array.isArray(response.data)) {
          // Simple array response
          imageData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // Paginated response
          imageData = response.data.data;
          paginationData = response.data.pagination || pagination;
        }
      }

      const normalizedData = normalizeImageData(imageData);
      setImages(normalizedData);
      setFilteredImages(normalizedData);
      setPagination(paginationData);

      console.log(`Loaded ${normalizedData.length} images from API`);
    } catch (err) {
      console.error("API Error:", err);
      setError(`ไม่สามารถโหลดข้อมูลได้: ${err.response?.data?.message || err.message}`);
      setImages([]);
      setFilteredImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Normalize image data structure
  const normalizeImageData = (images) => {
    return images.map(img => ({
      id: img.id,
      url: img.url || img.image_url,
      title: img.title || img.filename?.replace(/\.[^/.]+$/, "") || `ภาพ ${img.id}`,
      description: img.description || "",
      category: img.category || "กิจกรรม",
      date: img.date || img.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
      filename: img.filename,
      created_at: img.created_at,
      updated_at: img.updated_at
    }));
  };

  // Search functionality
  useEffect(() => {
    const filtered = images.filter(img => 
      img.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredImages(filtered);
  }, [searchTerm, images]);

  // Handle file selection with preview
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Validate file types and sizes
      const validFiles = files.filter(file => {
        const isValidType = file.type.startsWith('image/');
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
        return isValidType && isValidSize;
      });

      if (validFiles.length !== files.length) {
        setError("บางไฟล์ไม่ถูกต้อง: เฉพาะไฟล์รูปภาพขนาดไม่เกิน 5MB เท่านั้น");
      }

      // Create preview URLs
      const previews = validFiles.map(file => ({
        file,
        url: URL.createObjectURL(file),
        name: file.name
      }));
      setPreviewFiles(previews);
      setError(""); // Clear any previous errors
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (previewFiles.length === 0) {
      setError("กรุณาเลือกไฟล์รูปภาพ");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const uploadPromises = previewFiles.map(async (preview) => {
        const formData = new FormData();
        formData.append("image", preview.file);
        formData.append("title", uploadForm.title || preview.name.split('.')[0]);
        formData.append("description", uploadForm.description || "");
        formData.append("category", uploadForm.category);
        formData.append("date", uploadForm.date);

        return API.post("/gallery/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      });

      await Promise.all(uploadPromises);

      // Reset form and refresh data
      setPreviewFiles([]);
      setUploadForm({
        title: "",
        description: "",
        category: "กิจกรรม",
        date: new Date().toISOString().split('T')[0]
      });
      setShowUploadModal(false);
      setUploadSuccess(true);

      // Refresh gallery
      fetchImages(1);

      // Hide success message after 3 seconds
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      console.error("Upload error:", err);
      setError(`อัปโหลดไม่สำเร็จ: ${err.response?.data?.message || err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("คุณแน่ใจว่าต้องการลบรูปนี้?")) return;
    
    setActionLoading(true);
    try {
      await API.delete(`/gallery/${id}`);
      
      // Remove from local state
      setImages(prev => prev.filter(img => img.id !== id));
      setFilteredImages(prev => prev.filter(img => img.id !== id));
      
      // Remove from selection
      setSelectedImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });

      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      console.error("Delete error:", err);
      setError(`ไม่สามารถลบภาพได้: ${err.response?.data?.message || err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBatchDelete = async () => {
    if (selectedImages.size === 0) return;
    if (!window.confirm(`คุณแน่ใจว่าต้องการลบภาพ ${selectedImages.size} รูป?`)) return;

    setActionLoading(true);
    try {
      const deletePromises = [...selectedImages].map(id => API.delete(`/gallery/${id}`));
      await Promise.all(deletePromises);

      // Remove from local state
      setImages(prev => prev.filter(img => !selectedImages.has(img.id)));
      setFilteredImages(prev => prev.filter(img => !selectedImages.has(img.id)));
      setSelectedImages(new Set());

      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      console.error("Batch delete error:", err);
      setError(`ไม่สามารถลบภาพได้: ${err.response?.data?.message || err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (image) => {
    setEditingImage({ ...image });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingImage) return;

    setActionLoading(true);
    try {
      await API.put(`/gallery/${editingImage.id}`, {
        title: editingImage.title,
        description: editingImage.description,
        category: editingImage.category,
        date: editingImage.date
      });

      // Update local state
      setImages(prev => prev.map(img => 
        img.id === editingImage.id ? editingImage : img
      ));
      setFilteredImages(prev => prev.map(img => 
        img.id === editingImage.id ? editingImage : img
      ));

      setShowEditModal(false);
      setEditingImage(null);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      console.error("Update error:", err);
      setError(`ไม่สามารถอัพเดทข้อมูลได้: ${err.response?.data?.message || err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const toggleImageSelection = (id) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedImages(newSelected);
  };

  const selectAll = () => {
    setSelectedImages(new Set(filteredImages.map(img => img.id)));
  };

  const clearSelection = () => {
    setSelectedImages(new Set());
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchImages(newPage);
    }
  };

  // Clean up preview URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      previewFiles.forEach(preview => URL.revokeObjectURL(preview.url));
    };
  }, [previewFiles]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">จัดการแกลอรี่</h1>
              <p className="text-gray-600">อัพโหลดและจัดการภาพกิจกรรมของวัด</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => fetchImages(pagination.page)}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>รีเฟรช</span>
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 flex items-center space-x-2 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>เพิ่มภาพใหม่</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">{pagination.total || images.length}</div>
              <div className="text-sm text-blue-500">ภาพทั้งหมด</div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
              <div className="text-2xl font-bold text-green-600">
                {images.filter(img => img.category === 'กิจกรรม').length}
              </div>
              <div className="text-sm text-green-500">กิจกรรม</div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl">
              <div className="text-2xl font-bold text-orange-600">
                {images.filter(img => img.category === 'พิธีกรรม').length}
              </div>
              <div className="text-sm text-orange-500">พิธีกรรม</div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">
                {images.filter(img => img.category === 'เทศกาล').length}
              </div>
              <div className="text-sm text-purple-500">เทศกาล</div>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {uploadSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
            <Check className="w-5 h-5 text-green-600" />
            <span className="text-green-800">ดำเนินการสำเร็จ!</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
            <button 
              onClick={() => setError("")}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Search and Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ค้นหาภาพ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Batch Actions */}
            {selectedImages.size > 0 && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">เลือกแล้ว {selectedImages.size} รูป</span>
                <button
                  onClick={handleBatchDelete}
                  disabled={actionLoading}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center space-x-1 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>ลบที่เลือก</span>
                </button>
                <button
                  onClick={clearSelection}
                  className="text-gray-600 hover:text-gray-800 px-3 py-2"
                >
                  ยกเลิกการเลือก
                </button>
              </div>
            )}
          </div>

          {/* Selection Actions */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={selectAll}
                className="text-orange-600 hover:text-orange-800 text-sm font-medium"
              >
                เลือกทั้งหมด
              </button>
              <span className="text-gray-400">|</span>
              <span className="text-sm text-gray-600">
                แสดง {filteredImages.length} จาก {images.length} รูป
              </span>
            </div>

            {/* Pagination Info */}
            {pagination.totalPages > 1 && (
              <div className="text-sm text-gray-600">
                หน้า {pagination.page} จาก {pagination.totalPages}
              </div>
            )}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-orange-500 mr-3" />
              <span className="text-gray-600">กำลังโหลดภาพ...</span>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {images.length === 0 ? "ยังไม่มีภาพในแกลอรี่" : "ไม่พบภาพที่ตรงกับเงื่อนไข"}
              </h3>
              <p className="text-gray-500 mb-4">
                {images.length === 0 ? "เริ่มต้นด้วยการอัพโหลดภาพแรกของคุณ" : "ลองเปลี่ยนคำค้นหา"}
              </p>
              {images.length === 0 && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-yellow-600 transition-all duration-200"
                >
                  อัพโหลดภาพเดี๋ยวนี้
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredImages.map((img) => (
                  <div key={img.id} className="relative group bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                    {/* Selection Checkbox */}
                    <div className="absolute top-3 left-3 z-10">
                      <input
                        type="checkbox"
                        checked={selectedImages.has(img.id)}
                        onChange={() => toggleImageSelection(img.id)}
                        className="w-5 h-5 text-orange-500 bg-white border-2 border-gray-300 rounded focus:ring-orange-500"
                      />
                    </div>

                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={img.url}
                        alt={img.title || ""}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          console.error("Image failed to load:", img.url);
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      
                      {/* Error fallback */}
                      <div className="hidden w-full h-full bg-gray-200 items-center justify-center">
                        <div className="text-center text-gray-500">
                          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <div className="text-sm">ไม่สามารถโหลดภาพได้</div>
                        </div>
                      </div>
                      
                      {/* Category Badge */}
                      {img.category && (
                        <div className="absolute top-3 right-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${
                            img.category === 'กิจกรรม' ? 'bg-blue-500' :
                            img.category === 'พิธีกรรม' ? 'bg-orange-500' :
                            'bg-purple-500'
                          }`}>
                            {img.category}
                          </span>
                        </div>
                      )}

                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                        <button
                          onClick={() => window.open(img.url, '_blank')}
                          className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors duration-200"
                          title="ดูภาพ"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(img)}
                          disabled={actionLoading}
                          className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors duration-200 disabled:opacity-50"
                          title="แก้ไข"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(img.id)}
                          disabled={actionLoading}
                          className="p-2 bg-red-500/80 backdrop-blur-sm rounded-lg text-white hover:bg-red-600/80 transition-colors duration-200 disabled:opacity-50"
                          title="ลบ"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Image Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {img.title || `ภาพ ${img.id}`}
                      </h3>
                      {img.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {img.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                        <span>{new Date(img.date).toLocaleDateString('th-TH')}</span>
                        <span className="text-xs">ID: {img.id}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-6">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1 || loading}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                  >
                    ก่อนหน้า
                  </button>
                  
                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        disabled={loading}
                        className={`px-3 py-2 rounded-lg ${
                          pageNum === pagination.page
                            ? 'bg-orange-500 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages || loading}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                  >
                    ถัดไป
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">อัพโหลดภาพใหม่</h2>
                  <button
                    onClick={() => {
                      setShowUploadModal(false);
                      setPreviewFiles([]);
                    }}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleUpload} className="space-y-6">
                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">เลือกไฟล์รูปภาพ</label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-400 transition-colors duration-200 cursor-pointer"
                    >
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่</p>
                      <p className="text-sm text-gray-500">รองรับ JPG, PNG, GIF (สูงสุด 5MB)</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                    
                    {/* Preview Files */}
                    {previewFiles.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        {previewFiles.map((preview, index) => (
                          <div key={index} className="relative">
                            <img
                              src={preview.url}
                              alt={preview.name}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                              {preview.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อภาพ</label>
                    <input
                      type="text"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="ใส่ชื่อภาพ (ถ้าไม่ใส่จะใช้ชื่อไฟล์)"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">คำอธิบาย</label>
                    <textarea
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="คำอธิบายภาพ (ไม่บังคับ)"
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">หมวดหมู่</label>
                    <select
                      value={uploadForm.category}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">วันที่</label>
                    <input
                      type="date"
                      value={uploadForm.date}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUploadModal(false);
                        setPreviewFiles([]);
                      }}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      disabled={previewFiles.length === 0 || uploading}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {uploading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          <span>กำลังอัพโหลด...</span>
                        </>
                      ) : (
                        <span>อัพโหลด</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingImage && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">แก้ไขข้อมูลภาพ</h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6">
                  {/* Image Preview */}
                  <div className="text-center">
                    <img
                      src={editingImage.url}
                      alt={editingImage.title}
                      className="max-w-full h-48 object-cover rounded-xl mx-auto"
                    />
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อภาพ</label>
                    <input
                      type="text"
                      value={editingImage.title || ''}
                      onChange={(e) => setEditingImage(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">คำอธิบาย</label>
                    <textarea
                      value={editingImage.description || ''}
                      onChange={(e) => setEditingImage(prev => ({ ...prev, description: e.target.value }))}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">หมวดหมู่</label>
                    <select
                      value={editingImage.category || 'กิจกรรม'}
                      onChange={(e) => setEditingImage(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">วันที่</label>
                    <input
                      type="date"
                      value={editingImage.date || ''}
                      onChange={(e) => setEditingImage(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      disabled={actionLoading}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      {actionLoading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          <span>กำลังบันทึก...</span>
                        </>
                      ) : (
                        <span>บันทึก</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}