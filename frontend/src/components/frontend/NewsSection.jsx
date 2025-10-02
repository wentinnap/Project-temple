import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Newspaper, Calendar, ArrowRight, AlertCircle, RefreshCw } from "lucide-react";

export default function NewsSection() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch("http://localhost:5000/api/news/public?limit=6&page=1");
        
        if (!res.ok) {
          throw new Error("ไม่สามารถโหลดข่าวได้");
        }
        
        const data = await res.json();

        let newsArray = [];
        
        if (Array.isArray(data)) {
          newsArray = data;
        } else if (data.news && Array.isArray(data.news)) {
          newsArray = data.news;
        } else if (data.data && Array.isArray(data.data)) {
          newsArray = data.data;
        }

        const latestNews = newsArray
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 6);

        setNews(latestNews);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Icon */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <Newspaper className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">ข่าวสารล่าสุด</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full"></div>
          </div>

          {/* Loading Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
                <div className="w-full h-56 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <Newspaper className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">ข่าวสารล่าสุด</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full"></div>
          </div>

          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center border border-red-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">เกิดข้อผิดพลาด</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <RefreshCw className="w-5 h-5" />
              โหลดใหม่
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (news.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <Newspaper className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">ข่าวสารล่าสุด</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full"></div>
          </div>

          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <Newspaper className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">ยังไม่มีข่าวสาร</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-orange-50 to-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mb-4 shadow-lg">
            <Newspaper className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            ข่าวสาร<span className="text-orange-600">ล่าสุด</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-4">
            ติดตามข่าวสารและกิจกรรมต่างๆ ของวัดกำแพง
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full"></div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {news.map((item, index) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200">
                <img
                  src={item.image_url || "/placeholder-news.jpg"}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = "/placeholder-news.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-orange-600 shadow-lg">
                  ข่าวใหม่
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                  {item.title}
                </h3>
                
                {/* Content Preview */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {item.content ? item.content.replace(/<[^>]*>/g, '') : 'ไม่มีรายละเอียด'}
                </p>
                
                {/* Date */}
                <div className="flex items-center text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
                  <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                  {new Date(item.created_at || item.date).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>

                {/* Read More Link */}
                <Link
                  to={`/news/${item.id}`}
                  className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 group/link"
                >
                  <span>อ่านต่อ</span>
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            to="/news"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 group"
          >
            <Newspaper className="w-5 h-5" />
            <span>ดูข่าวทั้งหมด</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}