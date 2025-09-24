import AdminLayout from "../../layouts/AdminLayout";

export default function AdminHome() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold">🏠 Admin Home</h1>
      <p>ยินดีต้อนรับสู่ระบบจัดการเว็บไซต์วัด</p>

      {/* Dashboard สรุปข้อมูลแบบการ์ด */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        <div className="p-4 bg-green-100 rounded shadow">
          <h2 className="font-semibold">ข่าวสาร</h2>
          <p>รวมทั้งหมด: 12 ข่าว</p>
        </div>
        <div className="p-4 bg-blue-100 rounded shadow">
          <h2 className="font-semibold">บทความ</h2>
          <p>รวมทั้งหมด: 8 บทความ</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded shadow">
          <h2 className="font-semibold">กิจกรรม</h2>
          <p>รวมทั้งหมด: 5 งาน</p>
        </div>
        <div className="p-4 bg-purple-100 rounded shadow">
          <h2 className="font-semibold">พระในวัด</h2>
          <p>รวมทั้งหมด: 3 รูป</p>
        </div>
        <div className="p-4 bg-pink-100 rounded shadow">
          <h2 className="font-semibold">ผู้ใช้งาน</h2>
          <p>รวมทั้งหมด: 50 คน</p>
        </div>
      </div>
    </AdminLayout>
  );
}
