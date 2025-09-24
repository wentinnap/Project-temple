import { useState } from 'react';
import { Calendar, Clock, MapPin, Phone, Mail, User, Users, DollarSign, CheckCircle, AlertCircle, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TempleBooking = () => {
  const navigate = useNavigate();
  const [selectedCeremony, setSelectedCeremony] = useState('');
  const [bookingId, setBookingId] = useState(null);
  const [formData, setFormData] = useState({
    ceremony: '',
    fullName: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    participants: '',
    specialRequests: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Available ceremonies data
  const ceremonies = [
    {
      id: 'พิธีทำบุญ/ปิติยานุโมทนา',
      name: 'พิธีทำบุญ/ปิติยานุโมทนา',
      description: 'พิธีทำบุญทั่วไป อุทิศส่วนกุศลแก่ผู้ล่วงลับ',
      duration: '1-2 ชั่วโมง',
      requirements: 'ดอกไม้ ธูป เทียน อาหารคาว-หวาน',
      location: 'อุโบสถ'
    },
    {
      id: 'พิธีบรรพชาอุปสมบท',
      name: 'พิธีบรรพชาอุปสมบท',
      description: 'พิธีบรรพชาเณรหรืออุปสมบทพระภิกษุ',
      duration: '4-6 ชั่วโมง',
      requirements: 'จีวรครบชุด บาตร อัฐบริขาร',
      location: 'อุโบสถ'
    },
    {
      id: 'พิธีแต่งงานทางศาสนา',
      name: 'พิธีแต่งงานทางศาสนา',
      description: 'พิธีสมรสตามประเพณีพุทธศาสนา',
      duration: '2-3 ชั่วโมง',
      requirements: 'ดอกไม้จันทน์ ข้าวตอก เงิน ทอง',
      location: 'ศาลาการเปรียญ'
    },
    {
      id: 'พิธีสวดมนต์บ้านใหม่',
      name: 'พิธีสวดมนต์บ้านใหม่',
      description: 'พิธีเข้าบ้านใหม่ ให้พรบ้านเรือน',
      duration: '1-2 ชั่วโมง',
      requirements: 'ดอกไม้ ธูป เทียน อาหารคาว-หวาน',
      location: 'ที่บ้านผู้จอง'
    },
    {
      id: 'พิธีทำบุญศพ/ฌาปนกิจ',
      name: 'พิธีทำบุญศพ/ฌาปนกิจ',
      description: 'พิธีสวดมนต์ทำบุญแก่ผู้ล่วงลับ',
      duration: '2-4 ชั่วโมง',
      requirements: 'ดอกไม้ ธูป เทียน น้ำมนต์',
      location: 'วัดหรือบ้าน'
    },
    {
      id: 'พิธีพิเศษอื่นๆ',
      name: 'พิธีพิเศษอื่นๆ',
      description: 'พิธีกรรมเฉพาะตามความต้องการ',
      duration: 'ตามความเหมาะสม',
      requirements: 'ตามประเพณีพิธี',
      location: 'ตามสถานที่'
    }
  ];

  const timeSlots = [
    '06:00 - 08:00',
    '08:00 - 10:00',
    '10:00 - 12:00',
    '13:00 - 15:00',
    '15:00 - 17:00',
    '17:00 - 19:00'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCeremonySelect = (ceremony) => {
    setSelectedCeremony(ceremony.id);
    setFormData(prev => ({
      ...prev,
      ceremony: ceremony.id
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.success) {
      setBookingId(data.bookingId); // ✅ เก็บ bookingId จาก backend
      setIsSubmitted(true);
    } else {
      alert("เกิดข้อผิดพลาด: " + data.message);
    }
  } catch (err) {
    console.error("Error:", err);
    alert("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
  }
};

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">จองสำเร็จแล้ว</h2>
          <p className="text-gray-600 mb-6">
            เรารับคำขอจองพิธีของท่านแล้ว เจ้าหน้าที่จะติดต่อกลับภายใน 24 ชั่วโมง
          </p>
          <div className="bg-orange-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-orange-800">
              <strong>หมายเลขการจอง:</strong> BK{bookingId}
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Home size={20} />
              กลับหน้าหลัก
            </button>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  ceremony: '',
                  fullName: '',
                  phone: '',
                  email: '',
                  date: '',
                  time: '',
                  participants: '',
                  specialRequests: '',
                  address: '',
                  emergencyContact: '',
                  emergencyPhone: ''
                });
                setSelectedCeremony('');
              }}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
            >
              จองพิธีใหม่
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header with Home Button */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>กลับหน้าหลัก</span>
            </button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">จองพิธีทางศาสนา</h1>
              <p className="text-gray-600">วัดกำแพง</p>
            </div>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Main Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">รับจองพิธีกรรมทางพุทธศาสนาทุกประเภท</h2>
          <p className="text-gray-600 text-lg">กรุณาเลือกประเภทพิธีและกรอกข้อมูลให้ครบถ้วน</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Ceremony Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Select Ceremony */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6">
                <h2 className="text-2xl font-bold">1. เลือกประเภทพิธี</h2>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {ceremonies.map((ceremony) => (
                    <div
                      key={ceremony.id}
                      onClick={() => handleCeremonySelect(ceremony)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedCeremony === ceremony.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <h3 className="font-bold text-gray-800 mb-2">{ceremony.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{ceremony.description}</p>
                      <div className="space-y-1 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          <span>ระยะเวลา: {ceremony.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          <span>สถานที่: {ceremony.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2: Booking Form */}
            {selectedCeremony && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
                  <h2 className="text-2xl font-bold">2. กรอกข้อมูลการจอง</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">ข้อมูลส่วนตัว</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ชื่อ-นามสกุล *
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            required
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="กรอกชื่อ-นามสกุล"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            เบอร์โทรศัพท์ *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="0XX-XXX-XXXX"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            อีเมล
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="example@email.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ที่อยู่
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="ที่อยู่สำหรับติดต่อ"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Emergency Contact */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">ผู้ติดต่อฉุกเฉิน</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ชื่อผู้ติดต่อฉุกเฉิน
                          </label>
                          <input
                            type="text"
                            name="emergencyContact"
                            value={formData.emergencyContact}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="ชื่อผู้ติดต่อฉุกเฉิน"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            เบอร์โทรฉุกเฉิน
                          </label>
                          <input
                            type="tel"
                            name="emergencyPhone"
                            value={formData.emergencyPhone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="0XX-XXX-XXXX"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Ceremony Details */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">รายละเอียดพิธี</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            วันที่ต้องการ *
                          </label>
                          <input
                            type="date"
                            name="date"
                            required
                            value={formData.date}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            เวลาที่ต้องการ *
                          </label>
                          <select
                            name="time"
                            required
                            value={formData.time}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          >
                            <option value="">เลือกเวลา</option>
                            {timeSlots.map((time) => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            จำนวนผู้เข้าร่วม
                          </label>
                          <input
                            type="number"
                            name="participants"
                            value={formData.participants}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="จำนวนคน"
                            min="1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Special Requests */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ความต้องการพิเศษ/หมายเหตุ
                      </label>
                      <textarea
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="รายละเอียดเพิ่มเติมหรือความต้องการพิเศษ..."
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={handleSubmit}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition-all transform hover:scale-[1.02]"
                      >
                        ส่งคำขอจองพิธี
                      </button>
                      <button
                        onClick={() => navigate('/')}
                        className="px-6 py-4 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <Home size={20} />
                        หน้าหลัก
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            {/* Selected Ceremony Info */}
            {selectedCeremony && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
                  <h3 className="text-xl font-bold">พิธีที่เลือก</h3>
                </div>
                <div className="p-4">
                  {ceremonies.find(c => c.id === selectedCeremony) && (
                    <div className="space-y-3">
                      <h4 className="font-bold text-gray-800">
                        {ceremonies.find(c => c.id === selectedCeremony).name}
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span>{ceremonies.find(c => c.id === selectedCeremony).duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>{ceremonies.find(c => c.id === selectedCeremony).location}</span>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                        <p className="text-sm text-amber-800">
                          <strong>สิ่งที่ต้องเตรียม:</strong><br />
                          {ceremonies.find(c => c.id === selectedCeremony).requirements}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">ติดต่อสอบถาม</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-orange-500" />
                  <span>02-XXX-XXXX</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-orange-500" />
                  <span>info@watkampaeng.th</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-orange-500 mt-1" />
                  <span>วัดกำแพง เขตดุสิต นนทบุรี</span>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">ข้อแนะนำสำคัญ</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                  <span>กรุณาจองล่วงหน้าอย่างน้อย 7 วัน</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                  <span>ค่าพิธีอาจเปลี่ยนแปลงตามความเหมาะสม</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                  <span>เจ้าหน้าที่จะติดต่อยืนยันการจองภายใน 24 ชั่วโมง</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TempleBooking;