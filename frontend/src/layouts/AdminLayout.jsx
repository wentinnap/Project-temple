import AdminSidebar from "../components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      {/* Sidebar คงที่ */}
      <AdminSidebar />
      {/* เนื้อหาหลัก */}
      <main className="flex-1 p-6 bg-gray-100 min-h-screen ml-64">
        {children}
      </main>
    </div>
  );
};

