import { useEffect, useState } from "react";
import API from "../../services/api";
import LayoutHome from "../../layouts/frontend";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  Download, 
  ZoomIn,
  Loader,
  AlertCircle
} from "lucide-react";

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = ['all', 'พิธีกรรม', 'กิจกรรม', 'เทศกาล'];

  useEffect(() => {
    setLoading(true);
    API.get("/gallery")
      .then(res => {
        setImages(res.data);
        setFilteredImages(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('ไม่สามารถโหลดภาพได้');
        setLoading(false);
      });
  }, []);

  // Filter functionality
  useEffect(() => {
    let filtered = images;

    // Filter by category
    if (filter !== 'all') {
      filtered = filtered.filter(image => image.category === filter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(image => 
        image.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredImages(filtered);
  }, [filter, searchTerm, images]);

  const openModal = (image, index) => {
    const actualIndex = filteredImages.findIndex(img => img.id === image.id);
    setSelectedImage(image);
    setCurrentIndex(actualIndex);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setSelectedImage(filteredImages[nextIndex]);
    setCurrentIndex(nextIndex);
  };

  const prevImage = () => {
    const prevIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
    setSelectedImage(filteredImages[prevIndex]);
    setCurrentIndex(prevIndex);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, currentIndex, filteredImages.length]);

  const handleDownload = (imageUrl, filename) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename || 'image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <LayoutHome fullWidth>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
        {/* Header Section */}
        <div className="relative h-100 bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-5xl font-bold mb-4">แกลอรี่กิจกรรม</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-6">
              ภาพบรรยากาศกิจกรรมและพิธีกรรมต่างๆ ของวัดกำแพง
            </p>
            <div className="flex justify-center items-center space-x-6 text-sm">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>อัพเดทล่าสุด: {new Date().toLocaleDateString('th-TH')}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                <span>{images.length} ภาพ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ค้นหาภาพ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="text-gray-500 w-5 h-5" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'ทั้งหมด' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-gray-600">
              พบ {filteredImages.length} ภาพ
              {filter !== 'all' && ` ในหมวด "${filter}"`}
              {searchTerm && ` ที่ตรงกับ "${searchTerm}"`}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-7xl mx-auto px-6 mb-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="max-w-7xl mx-auto px-6 pb-12">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader className="w-8 h-8 animate-spin text-orange-500 mr-3" />
              <span className="text-gray-600">กำลังโหลดภาพ...</span>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">
                {images.length === 0 ? 'ยังไม่มีภาพในแกลอรี่' : 'ไม่พบภาพที่ตรงกับเงื่อนไข'}
              </h3>
              <p className="text-gray-500">
                {images.length === 0 ? 'กรุณารอการอัพเดทภาพใหม่' : 'ลองเปลี่ยนคำค้นหาหรือหมวดหมู่'}
              </p>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {filteredImages.map((image, index) => (
                <div
                  key={image.id}
                  className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-1 break-inside-avoid"
                  onClick={() => openModal(image, index)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.title || "gallery"}
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-center text-white">
                        <ZoomIn className="w-8 h-8 mx-auto mb-2" />
                        {image.title && (
                          <h3 className="text-lg font-semibold mb-1">{image.title}</h3>
                        )}
                        {image.date && (
                          <p className="text-sm opacity-90">
                            {new Date(image.date).toLocaleDateString('th-TH')}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Category Badge */}
                    {image.category && (
                      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full text-white backdrop-blur-sm ${
                          image.category === 'พิธีกรรม' ? 'bg-orange-500/90' :
                          image.category === 'กิจกรรม' ? 'bg-blue-500/90' :
                          'bg-purple-500/90'
                        }`}>
                          {image.category}
                        </span>
                      </div>
                    )}

                    {/* Download Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(image.url, image.title);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white/80 rounded-lg backdrop-blur-sm text-gray-700 hover:bg-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                      title="ดาวน์โหลด"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Image Info (Optional) */}
                  {(image.title || image.date) && (
                    <div className="p-3 bg-white">
                      {image.title && (
                        <h3 className="font-medium text-gray-800 text-sm truncate">
                          {image.title}
                        </h3>
                      )}
                      {image.date && (
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(image.date).toLocaleDateString('th-TH')}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal - Full Screen Image Viewer */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 z-10 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            {filteredImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors duration-200"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors duration-200"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute top-6 left-6 z-10 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
              {currentIndex + 1} / {filteredImages.length}
            </div>

            {/* Download Button */}
            <button
              onClick={() => handleDownload(selectedImage.url, selectedImage.title)}
              className="absolute bottom-6 right-6 z-10 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors duration-200"
              title="ดาวน์โหลด"
            >
              <Download className="w-6 h-6" />
            </button>

            {/* Main Image */}
            <div className="relative max-w-full max-h-full flex items-center justify-center">
              <img
                src={selectedImage.url}
                alt={selectedImage.title || "gallery"}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
              
              {/* Image Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                {selectedImage.title && (
                  <h2 className="text-2xl font-bold mb-2">{selectedImage.title}</h2>
                )}
                <div className="flex items-center justify-between">
                  {selectedImage.category && (
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      selectedImage.category === 'พิธีกรรม' ? 'bg-orange-500' :
                      selectedImage.category === 'กิจกรรม' ? 'bg-blue-500' :
                      'bg-purple-500'
                    }`}>
                      {selectedImage.category}
                    </span>
                  )}
                  {selectedImage.date && (
                    <span className="text-sm opacity-90">
                      {new Date(selectedImage.date).toLocaleDateString('th-TH')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutHome>
  );
}