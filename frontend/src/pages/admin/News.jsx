import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import API from "../../services/api";

export default function News() {
  const [newsList, setNewsList] = useState([]);
  const [form, setForm] = useState({ title: "", date: "", content: "" });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchNews();
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      // ✅ แก้ไข: เพิ่ม /news ข้างหน้า
      const res = await API.get("/news/all");
      setNewsList(res.data);
    } catch (err) {
      console.error(err);
      alert("ไม่สามารถโหลดข่าวได้");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const resetForm = () => {
    setForm({ title: "", date: "", content: "" });
    setImageFile(null);
    if (preview) { URL.revokeObjectURL(preview); setPreview(null); }
    setIsEditing(false);
    setEditId(null);
  };

  const handleAdd = async () => {
    if (!form.title || !form.date || !form.content) return alert("กรอกข้อมูลให้ครบ");
    setLoading(true);
    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("date", form.date);
      data.append("content", form.content);
      if (imageFile) data.append("image", imageFile);

      const res = await API.post("/news", data, { headers: { "Content-Type": "multipart/form-data" } });
      setNewsList(prev => [res.data, ...prev]);
      resetForm();
      alert("เพิ่มข่าวสำเร็จ!");
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดเพิ่มข่าว");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (news) => {
    setForm({ title: news.title, date: news.date.slice(0,10), content: news.content });
    setPreview(news.image_url || null);
    setIsEditing(true);
    setEditId(news.id);
    setImageFile(null);
  };

  const handleUpdate = async () => {
    if (!form.title || !form.date || !form.content) return alert("กรอกข้อมูลให้ครบ");
    setLoading(true);
    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("date", form.date);
      data.append("content", form.content);
      if (imageFile) data.append("image", imageFile);

      const res = await API.put(`/news/${editId}`, data, { headers: { "Content-Type": "multipart/form-data" } });
      setNewsList(prev => prev.map(n => (n.id === editId ? res.data : n)));
      resetForm();
      alert("อัปเดตข่าวสำเร็จ!");
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดอัปเดตข่าว");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบ?")) return;
    setLoading(true);
    try {
      // ✅ แก้ไข: เพิ่ม / ข้างหน้า
      await API.delete(`/news/${id}`);
      setNewsList(prev => prev.filter(n => n.id !== id));
      alert("ลบข่าวสำเร็จ!");
    } catch (err) {
      console.error(err);
      alert("ลบไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = newsList.filter(news => 
    news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    news.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
        {/* Header Section */}
        <div className="bg-white shadow-lg rounded-2xl mb-8 p-6 border border-orange-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-3 rounded-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  จัดการข่าวสาร
                </h1>
                <p className="text-gray-600 mt-1">ระบบบริหารจัดการข่าวและประกาศ</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-4 rounded-xl text-white text-center shadow-lg">
              <div className="text-2xl font-bold">{newsList.length}</div>
              <div className="text-sm opacity-90">ข่าวทั้งหมด</div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white shadow-xl rounded-2xl mb-8 overflow-hidden border border-orange-100">
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-6">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d={isEditing ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 4v16m8-8H4"} />
              </svg>
              {isEditing ? "แก้ไขข่าว" : "เพิ่มข่าวใหม่"}
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">หัวข้อข่าว</label>
                  <input 
                    name="title" 
                    value={form.title} 
                    onChange={handleChange} 
                    placeholder="ชื่อข่าว" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:border-orange-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">วันที่</label>
                  <input 
                    type="date" 
                    name="date" 
                    value={form.date} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:border-orange-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">เนื้อหา</label>
                  <textarea 
                    name="content" 
                    value={form.content} 
                    onChange={handleChange} 
                    placeholder="เขียนเนื้อหาข่าว..." 
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:border-orange-300 resize-none"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">รูปภาพ</label>
                  <div className="border-2 border-dashed border-orange-300 rounded-xl p-6 text-center hover:border-orange-400 transition-colors duration-200 bg-orange-50/30">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImage}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      {preview ? (
                        <div className="space-y-3">
                          <img src={preview} alt="preview" className="w-full h-40 object-cover rounded-lg mx-auto border border-orange-200" />
                          <p className="text-sm text-orange-600">คลิกเพื่อเปลี่ยนรูป</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <svg className="w-12 h-12 text-orange-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <div>
                            <p className="text-orange-600 font-medium">เลือกรูปภาพ</p>
                            <p className="text-sm text-orange-500">PNG, JPG up to 10MB</p>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  {isEditing ? (
                    <>
                      <button 
                        onClick={handleUpdate} 
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
                      >
                        {loading ? (
                          <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        อัปเดต
                      </button>
                      <button 
                        onClick={resetForm}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        ยกเลิก
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={handleAdd} 
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
                    >
                      {loading ? (
                        <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      )}
                      เพิ่มข่าว
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* News List Section */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-orange-100">
          <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-6 border-b border-orange-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="text-xl font-semibold text-orange-800 flex items-center">
                <svg className="w-6 h-6 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
                </svg>
                รายการข่าวทั้งหมด
              </h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="ค้นหาข่าว..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full md:w-64"
                />
                <svg className="w-5 h-5 text-orange-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <svg className="animate-spin w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                </svg>
                <span className="ml-2 text-gray-600">กำลังโหลด...</span>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">#</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">รูปภาพ</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">หัวข้อ</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">วันที่</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">เนื้อหา</th>
                    <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredNews.length > 0 ? (
                    filteredNews.map((n, i) => (
                      <tr key={n.id} className="hover:bg-orange-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{i + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {n.image_url ? (
                            <img 
                              src={n.image_url} 
                              alt="" 
                              className="w-16 h-12 object-cover rounded-lg shadow-sm border border-orange-200" 
                            />
                          ) : (
                            <div className="w-16 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">{n.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(n.date).toLocaleDateString('th-TH', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-xs truncate">{n.content}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button 
                              onClick={() => handleEdit(n)}
                              className="bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white px-3 py-1.5 rounded-lg text-sm transition-all duration-200 transform hover:scale-105 hover:shadow-md flex items-center"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              แก้ไข
                            </button>
                            <button 
                              onClick={() => handleDelete(n.id)}
                              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-1.5 rounded-lg text-sm transition-all duration-200 transform hover:scale-105 hover:shadow-md flex items-center"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              ลบ
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <svg className="w-16 h-16 text-orange-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                          <p className="text-orange-600 text-lg font-medium">ไม่มีข้อมูลข่าว</p>
                          <p className="text-orange-500 text-sm mt-1">เริ่มต้นโดยการเพิ่มข่าวใหม่</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}