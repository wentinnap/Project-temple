import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LayoutHome from "../../layouts/frontend";
import Pagination from "../../components/frontend/Pagination";
import API from "../../services/api";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        // ✅ แก้: เปลี่ยนจาก /news เป็น /news/public
        const res = await API.get(`/news/public?page=${currentPage}&limit=6`);
        
        setNews(res.data.news || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error("Error fetching news", err);
        setError("ไม่สามารถโหลดข่าวได้");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [currentPage]);

  return (
    <LayoutHome fullWidth>
      {/* Hero */}
      <section className="relative h-100 flex items-center justify-center bg-gray-800 text-white">
        <img
          src="https://source.unsplash.com/1600x600/?temple,news"
          alt="ข่าวสาร"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <h1 className="relative text-4xl font-bold z-10">ข่าวสารและกิจกรรม</h1>
      </section>

      {/* News Grid */}
      <div className="container mx-auto px-6 py-12">
        {loading ? (
          // ✅ Loading State
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-3 bg-gray-300 rounded w-1/3 mb-2"></div>
                  <div className="h-5 bg-gray-300 rounded mb-2"></div>
                  <div className="h-5 bg-gray-300 rounded w-4/5 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // ✅ Error State
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center max-w-md mx-auto">
            <p className="text-red-600 mb-4">❌ {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              โหลดใหม่
            </button>
          </div>
        ) : news.length === 0 ? (
          // ✅ Empty State
          <div className="bg-white rounded-lg p-12 text-center shadow">
            <p className="text-gray-500 text-lg">ยังไม่มีข่าวสาร</p>
          </div>
        ) : (
          // ✅ News Grid
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition"
              >
                <img
                  src={item.image_url || "https://source.unsplash.com/800x600/?temple"}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = "https://source.unsplash.com/800x600/?temple";
                  }}
                />
                <div className="p-6">
                  <p className="text-sm text-gray-500">
                    {item.date
                      ? new Date(item.date).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "ไม่ระบุวันที่"}
                  </p>
                  <h2 className="text-xl font-semibold mt-2 line-clamp-2">{item.title}</h2>
                  <p className="text-gray-600 mt-2 line-clamp-3">
                    {item.content || "ไม่มีคำอธิบาย"}
                  </p>
                  <Link
                    to={`/news/${item.id}`}
                    className="mt-4 inline-block text-blue-600 hover:underline"
                  >
                    อ่านต่อ →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && news.length > 0 && totalPages > 1 && (
        <div className="flex justify-center pb-12">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </LayoutHome>
  );
}