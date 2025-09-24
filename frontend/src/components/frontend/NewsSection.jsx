import { useState, useEffect } from 'react';
import API from '../../services/api';

export default function NewsSection() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await API.get('/public/news');
      setNews(res.data);
    } catch (err) {
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const truncateText = (text, maxLength = 120) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-orange-50 via-gray-50 to-orange-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #FD5A00 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, #FD5A00 1px, transparent 1px)`,
            backgroundSize: '50px 50px, 30px 30px'
          }}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-800 to-orange-600 bg-clip-text text-transparent mb-4">
              ข่าวสารจากวัด
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-700 mx-auto rounded-full"></div>
          </div>
          
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full"></div>
            <span className="ml-4 text-orange-700 font-medium">กำลังโหลดข่าวสาร...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-orange-50 to-orange-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #FD5A00 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, #FD5A00 1px, transparent 1px)`,
          backgroundSize: '50px 50px, 30px 30px'
        }}></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-orange-200/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-orange-300/20 rounded-full blur-2xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-5xl font-bold bg-gradient-to-r from-orange-800 to-orange-600 bg-clip-text text-transparent mb-6">
            ข่าวสารจากวัด
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-700 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            ติดตามข่าวสารและกิจกรรมต่างๆ ของวัด เพื่อร่วมทำบุญและสร้างสรรค์สังคมไปด้วยกัน
          </p>
        </div>

        {news.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">ยังไม่มีข่าวสาร</h3>
            <p className="text-gray-500">กำลังเตรียมข่าวสารและกิจกรรมดีๆ มาเพื่อทุกท่าน</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item, index) => (
              <div 
                key={item.id} 
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Image Section */}
                <div className="relative overflow-hidden">
                  {item.image_url ? (
                    <div className="h-56 bg-gray-200 overflow-hidden">
                      <img
                        src={`http://localhost:5000${item.image_url}`}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ) : (
                    <div className="h-56 bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 flex items-center justify-center relative">
                      <div className="text-orange-600 text-6xl opacity-60 transform group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  )}
                  
                  {/* Date Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm">
                      {formatDate(item.date)}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-orange-700 transition-colors duration-300">
                    {item.title}
                  </h3>

                  {/* Content */}
                  <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                    {truncateText(item.content)}
                  </p>

                  {/* Read More Button */}
                  <button className="inline-flex items-center text-orange-600 font-medium hover:text-orange-700 transition-all duration-300 group-hover:translate-x-1">
                    <span>อ่านต่อ</span>
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>

                {/* Bottom Gradient Line */}
                <div className="h-1 bg-gradient-to-r from-orange-500 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        {news.length > 0 && (
          <div className="text-center mt-16">
            <button className="group relative inline-flex items-center bg-gradient-to-r from-orange-600 to-orange-700 text-white px-10 py-4 rounded-2xl hover:from-orange-700 hover:to-orange-800 transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <svg className="w-5 h-5 mr-3 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              ดูข่าวสารทั้งหมด
              <svg className="w-5 h-5 ml-3 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              
              {/* Button Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-700 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}