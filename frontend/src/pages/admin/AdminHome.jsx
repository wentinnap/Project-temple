import AdminLayout from "../../layouts/AdminLayout";
import { Newspaper, FileText, Calendar, Users, User, Home } from "lucide-react";

export default function AdminHome() {
  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Home className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold">หน้าหลักผู้ดูแลระบบ</h1>
      </div>
      <p className="text-gray-600 mb-8">
        ยินดีต้อนรับสู่ระบบจัดการเว็บไซต์วัด ✨  
        คุณสามารถดูภาพรวมและจัดการข้อมูลต่าง ๆ ได้จากที่นี่
      </p>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-full">
              <Newspaper className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">ข่าวสาร</h2>
              <p className="text-gray-600">รวมทั้งหมด: 12 ข่าว</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">บทความ</h2>
              <p className="text-gray-600">รวมทั้งหมด: 8 บทความ</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">กิจกรรม</h2>
              <p className="text-gray-600">รวมทั้งหมด: 5 งาน</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">พระในวัด</h2>
              <p className="text-gray-600">รวมทั้งหมด: 3 รูป</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-100 text-pink-600 rounded-full">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">ผู้ใช้งาน</h2>
              <p className="text-gray-600">รวมทั้งหมด: 50 คน</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
