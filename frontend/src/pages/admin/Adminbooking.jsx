import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Trash2, Loader2, Search, Filter, Calendar, Clock, Users, Phone, Mail, MapPin, AlertTriangle, Eye, Download } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import API from "../../services/api"; // นำเข้า API

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ป้องกัน Error ด้วยการสร้างตัวแปร safe
  const safeBookings = Array.isArray(bookings) ? bookings : [];

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await API.get("/bookings");
      console.log("API Response:", response.data); // Debug
      // ตรวจสอบให้แน่ใจว่าได้ Array
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]); // set เป็น array เปล่าเมื่อ error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/bookings/${id}/status`, { status });
      fetchBookings();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("คุณแน่ใจว่าจะลบการจองนี้?")) return;
    try {
      await API.delete(`/bookings/${id}`);
      fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  // ใช้ safeBookings แทน bookings
  const filteredBookings = safeBookings.filter(booking => {
    const matchesSearch = 
      booking.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.ceremony?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone?.includes(searchTerm) ||
      booking.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status) => {
    switch (status) {
      case "pending":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          label: "รอยืนยัน",
          icon: Clock
        };
      case "confirmed":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          label: "ยืนยันแล้ว",
          icon: CheckCircle
        };
      case "cancelled":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          label: "ยกเลิก",
          icon: XCircle
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          label: status,
          icon: AlertTriangle
        };
    }
  };

  const BookingModal = ({ booking, isOpen, onClose }) => {
    if (!isOpen || !booking) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-6 rounded-t-2xl">
            <h2 className="text-2xl font-bold">รายละเอียดการจอง #{booking.id}</h2>
            <p className="opacity-90 mt-1">{booking.ceremony}</p>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Personal Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-800 border-b border-gray-200 pb-2">ข้อมูลผู้จอง</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Users className="text-orange-500" size={18} />
                    <span className="text-gray-700">{booking.full_name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="text-orange-500" size={18} />
                    <span className="text-gray-700">{booking.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="text-orange-500" size={18} />
                    <span className="text-gray-700">{booking.email}</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="text-orange-500 mt-1" size={18} />
                    <span className="text-gray-700">{booking.address}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-800 border-b border-gray-200 pb-2">การติดต่อฉุกเฉิน</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="text-red-500" size={18} />
                    <span className="text-gray-700">{booking.emergency_contact}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="text-red-500" size={18} />
                    <span className="text-gray-700">{booking.emergency_phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-lg text-gray-800 mb-4">รายละเอียดการจอง</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="text-blue-500" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">วันที่</p>
                    <p className="font-medium">{new Date(booking.date).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="text-blue-500" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">เวลา</p>
                    <p className="font-medium">{booking.time}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="text-blue-500" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">จำนวนคน</p>
                    <p className="font-medium">{booking.participants || "ไม่ระบุ"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {booking.special_requests && (
              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">คำขอพิเศษ</h3>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <p className="text-gray-700">{booking.special_requests}</p>
                </div>
              </div>
            )}

            {/* Status and Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-500 mb-1">สถานะปัจจุบัน</p>
                {(() => {
                  const StatusIcon = getStatusConfig(booking.status).icon;
                  return (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusConfig(booking.status).bg} ${getStatusConfig(booking.status).text}`}>
                      <StatusIcon size={16} className="mr-1" />
                      {getStatusConfig(booking.status).label}
                    </span>
                  );
                })()}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(booking.id, "confirmed")}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-1"
                >
                  <CheckCircle size={16} />
                  <span>ยืนยัน</span>
                </button>
                <button
                  onClick={() => updateStatus(booking.id, "cancelled")}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-1"
                >
                  <XCircle size={16} />
                  <span>ยกเลิก</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-between items-center">
            <p className="text-sm text-gray-500">
              สร้างเมื่อ: {new Date(booking.created_at).toLocaleString("th-TH")}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-6 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold mb-2">จัดการการจอง</h1>
          <p className="opacity-90">รายการการจองพิธีกรรมทั้งหมด</p>
        </div>

        {/* Stats Cards - ใช้ safeBookings แทน bookings */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {["all", "pending", "confirmed", "cancelled"].map((status) => {
            const count = status === "all" ? safeBookings.length : safeBookings.filter(b => b.status === status).length;
            const config = getStatusConfig(status);
            const StatusIcon = config.icon;
            
            return (
              <div key={status} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      {status === "all" ? "ทั้งหมด" : config.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-800">{count}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${config.bg}`}>
                    <StatusIcon size={24} className={config.text} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="ค้นหาด้วยชื่อ, พิธี, โทรศัพท์, หรืออีเมล..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400" size={20} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="pending">รอยืนยัน</option>
                <option value="confirmed">ยืนยันแล้ว</option>
                <option value="cancelled">ยกเลิก</option>
              </select>
            </div>
            <button className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2">
              <Download size={20} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Bookings Table */}
        {loading ? (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-center items-center">
              <Loader2 className="animate-spin w-10 h-10 text-orange-500 mr-3" />
              <span className="text-gray-600">กำลังโหลดข้อมูล...</span>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium">ID</th>
                    <th className="px-6 py-4 text-left font-medium">พิธี</th>
                    <th className="px-6 py-4 text-left font-medium">ผู้จอง</th>
                    <th className="px-6 py-4 text-left font-medium">ติดต่อ</th>
                    <th className="px-6 py-4 text-left font-medium">วันเวลา</th>
                    <th className="px-6 py-4 text-left font-medium">สถานะ</th>
                    <th className="px-6 py-4 text-center font-medium">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                        ไม่พบข้อมูลการจอง
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => {
                      const statusConfig = getStatusConfig(booking.status);
                      
                      return (
                        <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                              #{booking.id}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{booking.ceremony}</div>
                            {booking.participants && (
                              <div className="text-sm text-gray-500 flex items-center mt-1">
                                <Users size={14} className="mr-1" />
                                {booking.participants} คน
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{booking.full_name}</div>
                            <div className="text-sm text-gray-500">{booking.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <Phone size={14} className="mr-2" />
                              {booking.phone}
                            </div>
                            {booking.emergency_contact && (
                              <div className="flex items-center text-sm text-gray-500">
                                <AlertTriangle size={14} className="mr-2" />
                                {booking.emergency_contact}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <Calendar size={14} className="mr-2" />
                              {new Date(booking.date).toLocaleDateString('th-TH', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock size={14} className="mr-2" />
                              {booking.time}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {(() => {
                              const StatusIcon = statusConfig.icon;
                              return (
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                                  <StatusIcon size={16} className="mr-1" />
                                  {statusConfig.label}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowModal(true);
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                title="ดูรายละเอียด"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => updateStatus(booking.id, "confirmed")}
                                className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                title="ยืนยัน"
                              >
                                <CheckCircle size={16} />
                              </button>
                              <button
                                onClick={() => updateStatus(booking.id, "cancelled")}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                title="ยกเลิก"
                              >
                                <XCircle size={16} />
                              </button>
                              <button
                                onClick={() => deleteBooking(booking.id)}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title="ลบ"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      <BookingModal
        booking={selectedBooking}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedBooking(null);
        }}
      />
    </AdminLayout>
  );
}