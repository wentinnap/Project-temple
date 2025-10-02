import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, MessageCircle, Phone, Mail, ArrowLeft, Search, Filter } from 'lucide-react';
import LayoutHome from "../../layouts/frontend";

const QAPage = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [questions, setQuestions] = useState([]);

  // ✅ โหลดคำถามจาก backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/questions");
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    };
    fetchQuestions();
  }, []);

  // ✅ เพิ่มคำถามใหม่
  const handleAddQuestion = async () => {
    if (newQuestion.trim()) {
      try {
        const res = await fetch("http://localhost:5000/api/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: newQuestion }),
        });

        if (res.ok) {
          const newQ = {
            id: Date.now(),
            category: 'general',
            question: newQuestion,
            answer: null,
            tags: ['คำถามใหม่'],
          };
          setQuestions([newQ, ...questions]);
          setNewQuestion('');
          setShowAddForm(false);
        }
      } catch (err) {
        console.error("Error adding question:", err);
      }
    }
  };

  const categories = [
    { value: 'all', label: 'ทั้งหมด', color: 'gray' },
    { value: 'donation', label: 'การบริจาค', color: 'orange' },
    { value: 'ceremony', label: 'พิธีกรรม', color: 'blue' },
    { value: 'general', label: 'ทั่วไป', color: 'green' },
    { value: 'teaching', label: 'การเรียนรู้', color: 'purple' }
  ];

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.answer?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleQuestion = (id) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.color : 'gray';
  };

  return (
    <LayoutHome fullWidth>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 pt-20">
        {/* Hero Section */}
        <div className="relative h-100 bg-gradient-to-r from-orange-600 to-yellow-600 text-white py-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <MessageCircle className="mx-auto mb-6 drop-shadow-lg" size={80} />
            <h1 className="text-4xl md:text-6xl font-bold mb-4">ถาม-ตอบ</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              คำถามที่พบบ่อยเกี่ยวกับวัดกำแพง
            </p>
            <div className="w-32 h-1 bg-white/30 mx-auto rounded-full"></div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Search and Filter */}
          <div className="mb-12 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="ค้นหาคำถาม คำตอบ หรือหัวข้อที่สนใจ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-orange-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-lg bg-white/80 backdrop-blur-sm"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3">
              <Filter className="text-gray-600 mt-2" size={20} />
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    selectedCategory === category.value
                      ? `bg-${category.color}-500 text-white shadow-lg shadow-${category.color}-500/25`
                      : `bg-white/70 text-${category.color}-600 hover:bg-${category.color}-50 border border-${category.color}-200`
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Results Count */}
            <p className="text-gray-600">
              แสดง {filteredQuestions.length} คำถาม {searchTerm && `จากการค้นหา "${searchTerm}"`}
            </p>
          </div>

          {/* Q&A List */}
          <div className="grid gap-6 mb-12">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">ไม่พบคำถามที่ตรงกับการค้นหา</h3>
                <p className="text-gray-500">ลองเปลี่ยนคำค้นหาหรือหมวดหมู่</p>
              </div>
            ) : (
              filteredQuestions.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/50 hover:shadow-2xl transition-all duration-300"
                >
                  <button
                    onClick={() => toggleQuestion(item.id)}
                    className="w-full px-8 py-6 text-left hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 transition-all duration-300 group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`flex-shrink-0 w-8 h-8 bg-gradient-to-r from-${getCategoryColor(item.category)}-500 to-${getCategoryColor(item.category)}-600 rounded-full flex items-center justify-center text-white font-bold text-sm mt-1`}>
                          Q
                        </div>
                        <div className="flex-1">
                          <span className="text-lg font-semibold text-gray-800 leading-relaxed group-hover:text-orange-700 transition-colors block mb-2">
                            {item.question}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        {activeQuestion === item.id ? (
                          <ChevronUp className="text-orange-600 transition-transform duration-300" size={28} />
                        ) : (
                          <ChevronDown className="text-orange-600 transition-transform duration-300" size={28} />
                        )}
                      </div>
                    </div>
                  </button>
                  
                  {activeQuestion === item.id && (
                    <div className="px-8 pb-8 border-t border-orange-100 bg-gradient-to-r from-orange-25 to-yellow-25">
                      <div className="pt-6 pl-12">
                        <div className={`w-8 h-8 bg-gradient-to-r from-${getCategoryColor(item.category)}-500 to-${getCategoryColor(item.category)}-600 rounded-full flex items-center justify-center text-white font-bold text-sm mb-4`}>
                          A
                        </div>
                        <p className="text-gray-700 leading-relaxed text-base">
                          {item.answer || "รอการตอบกลับจากเจ้าหน้าที่"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Add Question Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-white/50">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Plus className="mr-3 text-orange-600" size={28} />
              มีคำถามเพิ่มเติม?
            </h3>
            
            {!showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:shadow-orange-500/25 transform hover:-translate-y-0.5"
              >
                <Plus size={20} className="mr-2" />
                ถามคำถาม
              </button>
            ) : (
              <div className="space-y-6">
                <textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="พิมพ์คำถามของท่านที่นี่..."
                  className="w-full p-4 border-2 border-orange-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 resize-none h-32 text-base"
                />
                <div className="flex gap-4">
                  <button
                    onClick={handleAddQuestion}
                    disabled={!newQuestion.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:shadow-orange-500/25"
                  >
                    ส่งคำถาม
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewQuestion('');
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300 font-medium"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </LayoutHome>
  );
};

export default QAPage;
