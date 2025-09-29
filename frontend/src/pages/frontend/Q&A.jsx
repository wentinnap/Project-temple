import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, MessageCircle, Phone, Mail, ArrowLeft, Search, Filter } from 'lucide-react';
import LayoutHome from "../../layouts/frontend";

const QAPage = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [questions, setQuestions] = useState([
    {
      id: 1,
      category: 'donation',
      question: "การทำบุญออนไลน์มีผลบุญเท่ากับการมาวัดจริงหรือไม่?",
      answer: "การทำบุญด้วยใจบริสุทธิ์และศรัทธาจะได้รับผลบุญเท่าเทียมกัน ไม่ว่าจะทำผ่านช่องทางใด ที่สำคัญคือจิตใจและเจตนาในการให้ทาน สำหรับการทำบุญออนไลน์ วัดได้จัดให้มีพิธีกรรมและการอุทิศส่วนกุศลอย่างเหมาะสม",
      tags: ['บุญ', 'ออนไลน์', 'ทำบุญ']
    },
    {
      id: 2,
      category: 'donation',
      question: "สามารถกำหนดวัตถุประสงค์การบริจาคได้หรือไม่?",
      answer: "ท่านสามารถระบุวัตถุประสงค์ได้ เช่น บริจาคเพื่อการก่อสร้าง การศึกษา การพิมพ์หนังสือธรรม หรือกิจกรรมต่างๆ ของวัด เราจะนำเงินบริจาคไปใช้ตามเจตนาของผู้บริจาคอย่างโปร่งใส",
      tags: ['บริจาค', 'วัตถุประสงค์', 'การใช้เงิน']
    },
    {
      id: 3,
      category: 'donation',
      question: "จะได้รับใบเสร็จรับเงินหรือไม่?",
      answer: "ท่านจะได้รับใบเสร็จรับเงินทางอีเมลหรือทางไปรษณีย์ตามที่ระบุไว้ สามารถนำไปใช้ในการลดหย่อนภาษีได้ กรุณาเก็บใบเสร็จไว้เป็นหลักฐานสำหรับการยื่นภาษี",
      tags: ['ใบเสร็จ', 'ภาษี', 'ลดหย่อน']
    },
    {
      id: 4,
      category: 'donation',
      question: "มีขั้นต่ำในการบริจาคหรือไม่?",
      answer: "ไม่มีจำนวนขั้นต่ำ ท่านสามารถบริจาคตามกำลังทรัพย์และศรัทธา แม้จำนวนเล็กน้อยก็มีค่าและได้รับผลบุญเท่าเทียมกัน เพราะที่สำคัญคือความจริงใจ",
      tags: ['จำนวนเงิน', 'ขั้นต่ำ', 'บุญกุศล']
    },
    {
      id: 5,
      category: 'ceremony',
      question: "สามารถจองพิธีกรรมล่วงหน้าได้กี่วัน?",
      answer: "ท่านสามารถจองพิธีกรรมล่วงหน้าได้อย่างน้อย 7 วัน สำหรับพิธีใหญ่เช่น งานบุญใหญ่ หรือพิธีสำคัญ ขอให้จองล่วงหน้า 14-30 วัน เพื่อให้วัดได้เตรียมการอย่างเหมาะสม",
      tags: ['จองล่วงหน้า', 'พิธีกรรม', 'เตรียมการ']
    },
    {
      id: 6,
      category: 'ceremony',
      question: "ค่าใช้จ่ายในการทำพิธีคิดอย่างไร?",
      answer: "ค่าใช้จ่ายขึ้นอยู่กับประเภทพิธีและความต้องการ เช่น จำนวนพระ อาหารถวาย ดอกไม้ธูปเทียน เราจะแจ้งรายละเอียดค่าใช้จ่ายให้ทราบล่วงหน้าอย่างชัดเจน",
      tags: ['ค่าใช้จ่าย', 'พิธี', 'ราคา']
    },
    {
      id: 7,
      category: 'general',
      question: "วัดเปิด-ปิดเวลาไหน?",
      answer: "วัดเปิดให้เข้าชมตั้งแต่เวลา 05:00-20:00 น. ทุกวัน สำหรับการขอพบพระอาจารย์หรือขอคำปรึกษา แนะนำช่วงเวลา 08:00-11:00 น. และ 13:00-17:00 น.",
      tags: ['เวลาเปิด-ปิด', 'เข้าชม', 'พบพระ']
    },
    {
      id: 8,
      category: 'general',
      question: "มีที่จอดรถหรือไม่?",
      answer: "วัดมีที่จอดรถสำหรับผู้มาร่วมงานและทำบุญ สามารถจอดได้ประมาณ 100 คัน หากเป็นงานใหญ่อาจมีการจัดที่จอดรถเพิ่มเติมในบริเวณใกล้เคียง",
      tags: ['ที่จอดรถ', 'สิ่งอำนวยความสะดวก', 'การจราจร']
    },
    {
      id: 9,
      category: 'teaching',
      question: "มีการเรียนการสอนพระธรรมหรือไม่?",
      answer: "วัดจัดให้มีการเรียนพระธรรมทุกวันอาทิตย์ เวลา 09:00-11:00 น. และมีการสอนสมาธิทุกวันพุธ เวลา 19:00-21:00 น. ฟรีไม่เสียค่าใช้จ่าย",
      tags: ['เรียนธรรม', 'สมาธิ', 'การสอน']
    },
    {
      id: 10,
      category: 'teaching',
      question: "สามารถขอคำปรึกษาด้านจิตใจได้หรือไม่?",
      answer: "สามารถขอคำปรึกษากับพระอาจารย์ได้ โดยนัดหมายล่วงหน้า หรือมาในช่วงเวลาที่เหมาะสม พระอาจารย์ยินดีให้คำแนะนำเรื่องการดำเนินชีวิตและการแก้ไขปัญหาต่างๆ",
      tags: ['คำปรึกษา', 'จิตใจ', 'พระอาจารย์']
    }
  ]);

  const categories = [
    { value: 'all', label: 'ทั้งหมด', color: 'gray' },
    { value: 'donation', label: 'การบริจาค', color: 'orange' },
    { value: 'ceremony', label: 'พิธีกรรม', color: 'blue' },
    { value: 'general', label: 'ทั่วไป', color: 'green' },
    { value: 'teaching', label: 'การเรียนรู้', color: 'purple' }
  ];

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleQuestion = (id) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      const newQ = {
        id: Date.now(),
        category: 'general',
        question: newQuestion,
        answer: "ขอบคุณสำหรับคำถาม เจ้าหน้าที่วัดจะตอบกลับโดยเร็วที่สุด หรือท่านสามารถติดต่อสอบถามโดยตรงได้ตามช่องทางด้านล่าง",
        tags: ['คำถามใหม่']
      };
      setQuestions([newQ, ...questions]);
      setNewQuestion('');
      setShowAddForm(false);
    }
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
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            ถาม-ตอบ
          </h1>
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
            filteredQuestions.map((item, index) => (
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
                        <div className="flex flex-wrap gap-2">
                          {item.tags.map((tag, tagIndex) => (
                            <span 
                              key={tagIndex}
                              className={`px-2 py-1 bg-${getCategoryColor(item.category)}-100 text-${getCategoryColor(item.category)}-700 rounded-full text-xs`}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
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
                        {item.answer}
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
                placeholder="พิมพ์คำถามของท่านที่นี่... เช่น เกี่ยวกับวิธีการบริจาค ประเภทของการทำบุญ พิธีกรรมต่างๆ หรือกิจกรรมของวัด"
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

        {/* Contact Info */}
        <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-8 shadow-xl border border-orange-200">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-orange-800 mb-2">ติดต่อสอบถามเพิ่มเติม</h3>
            <p className="text-orange-700">
              หากไม่พบคำตอบที่ต้องการ สามารถติดต่อเจ้าหน้าที่วัดโดยตรง
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center justify-center space-x-3 p-4 bg-white/70 rounded-xl">
              <Phone className="text-orange-600" size={24} />
              <span className="font-semibold text-orange-800">02-XXX-XXXX</span>
            </div>
            <div className="flex items-center justify-center space-x-3 p-4 bg-white/70 rounded-xl">
              <Mail className="text-orange-600" size={24} />
              <span className="font-semibold text-orange-800">info@watkampaeng.org</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:shadow-orange-500/25 transform hover:-translate-y-0.5">
              <Phone size={20} className="inline mr-2" />
              โทรสอบถาม
            </button>
            
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:-translate-y-0.5">
              <Mail size={20} className="inline mr-2" />
              ส่งอีเมล
            </button>
            
            <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:shadow-green-500/25 transform hover:-translate-y-0.5">
              <MessageCircle size={20} className="inline mr-2" />
              Line Official
            </button>
            
            <button 
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transform hover:-translate-y-0.5"
            >
              <ArrowLeft size={20} className="inline mr-2" />
              กลับหน้าเดิม
            </button>
          </div>
        </div>
      </div>
    </div>
    </LayoutHome>
  );
};

export default QAPage;