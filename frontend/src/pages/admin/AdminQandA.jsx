import { useState, useEffect } from "react";
import API from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";
import { MessageCircle, Send, X, Trash2, CheckCircle, AlertCircle, Edit3 } from "lucide-react";

export default function AdminQandA() {
  const [questions, setQuestions] = useState([]);
  const [answering, setAnswering] = useState(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchQuestions = async () => {
    try {
      const res = await API.get("/questions");
      setQuestions(res.data);
    } catch (err) {
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAnswer = async (id) => {
    if (!answer.trim()) {
      alert("กรุณากรอกคำตอบ");
      return;
    }
    
    try {
      await API.put(`/questions/${id}`, { answer });
      setAnswer("");
      setAnswering(null);
      fetchQuestions();
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการตอบคำถาม");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("คุณต้องการลบคำถามนี้ใช่หรือไม่?")) return;
    
    setDeleting(id);
    try {
      await API.delete(`/questions/${id}`);
      fetchQuestions();
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการลบคำถาม");
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">กำลังโหลดคำถาม...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">จัดการคำถาม-คำตอบ</h2>
              <p className="text-gray-500">ตอบคำถามจากผู้ใช้งานในระบบ</p>
            </div>
          </div>
          <div className="w-full h-1 bg-gradient-to-r from-orange-500 to-orange-700 rounded-full"></div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-medium text-sm">คำถามทั้งหมด</p>
                <p className="text-3xl font-bold text-blue-800">{questions.length}</p>
              </div>
              <MessageCircle className="w-12 h-12 text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-medium text-sm">ตอบแล้ว</p>
                <p className="text-3xl font-bold text-green-800">
                  {questions.filter(q => q.answer).length}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 font-medium text-sm">รอตอบ</p>
                <p className="text-3xl font-bold text-red-800">
                  {questions.filter(q => !q.answer).length}
                </p>
              </div>
              <AlertCircle className="w-12 h-12 text-red-400" />
            </div>
          </div>
        </div>

        {/* Questions List */}
        {questions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">ยังไม่มีคำถาม</h3>
            <p className="text-gray-500">เมื่อมีผู้ใช้งานส่งคำถามจะแสดงที่นี่</p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q) => (
              <div
                key={q.id}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 overflow-hidden ${
                  q.answer ? 'border-green-200' : 'border-orange-200'
                }`}
              >
                {/* Status Badge */}
                <div className={`px-6 py-2 ${q.answer ? 'bg-green-50' : 'bg-orange-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {q.answer ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-700">ตอบแล้ว</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-orange-600" />
                          <span className="text-sm font-medium text-orange-700">รอตอบ</span>
                        </>
                      )}
                    </div>
                    {q.created_at && (
                      <span className="text-xs text-gray-500">
                        {formatDate(q.created_at)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  {/* Question */}
                  <div className="mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">คำถาม:</p>
                        <p className="text-lg font-semibold text-gray-800 leading-relaxed">
                          {q.question}
                        </p>
                        {q.user_name && (
                          <p className="text-sm text-gray-500 mt-2">
                            โดย: <span className="font-medium text-gray-700">{q.user_name}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Answer Section */}
                  {q.answer ? (
                    <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-green-600 font-medium mb-1">คำตอบ:</p>
                          <p className="text-gray-800 leading-relaxed">{q.answer}</p>
                        </div>
                      </div>
                    </div>
                  ) : answering === q.id ? (
                    <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
                      <div className="flex items-start gap-3 mb-3">
                        <Edit3 className="w-5 h-5 text-orange-600 mt-1" />
                        <p className="text-sm text-orange-700 font-medium">กำลังตอบคำถาม:</p>
                      </div>
                      <textarea
                        className="w-full border-2 border-orange-300 p-3 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:outline-none transition-all duration-300 resize-none"
                        placeholder="พิมพ์คำตอบของคุณ..."
                        rows={4}
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                      />
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleAnswer(q.id)}
                          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2.5 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                        >
                          <Send className="w-4 h-4" />
                          ส่งคำตอบ
                        </button>
                        <button
                          onClick={() => {
                            setAnswering(null);
                            setAnswer("");
                          }}
                          className="flex items-center gap-2 bg-gray-400 text-white px-5 py-2.5 rounded-xl hover:bg-gray-500 transition-all duration-300 shadow-md font-medium"
                        >
                          <X className="w-4 h-4" />
                          ยกเลิก
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                    {!q.answer && answering !== q.id && (
                      <button
                        onClick={() => setAnswering(q.id)}
                        className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                      >
                        <Edit3 className="w-4 h-4" />
                        ตอบคำถาม
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDelete(q.id)}
                      disabled={deleting === q.id}
                      className={`flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium ml-auto ${
                        deleting === q.id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {deleting === q.id ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                          กำลังลบ...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          ลบ
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}