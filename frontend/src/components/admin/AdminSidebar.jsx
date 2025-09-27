import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logoadmin from "../../assets/logoadmin.png";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // ดึงข้อมูล admin จาก localStorage
  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  };

  const user = getCurrentUser();
  const adminName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : "Admin";
  const templeName = "วัดกำแพง"; // เปลี่ยนเป็นชื่อวัดจริงถ้ามี

  const handleLogout = () => {
    if (confirm('คุณต้องการออกจากระบบหรือไม่?')) {
      logout();
      navigate('/', { replace: true });
    }
  };

  const menuItems = [
    { path: "/admin", icon: "🏠", label: "หน้าแรก" },
    { path: "/admin/dashboard", icon: "📊", label: "แดชบอร์ด" },
    { path: "/admin/news", icon: "📰", label: "จัดการข่าว" },
    { path: "/admin/Adminbooking", icon: "📖", label: "จัดการการจอง" },
    { path: "/admin/events", icon: "📅", label: "ปฏิทินกิจกรรม" },
    { path: "/admin/monks", icon: "🙏", label: "พระสงฆ์" },
    { path: "/admin/users", icon: "👥", label: "ผู้ใช้งาน" },
    { path: "/admin/gallery", icon: "🖼️", label: "จัดการแกลอรี่" } // 👈 เพิ่มเมนูใหม่
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col fixed left-0 top-0 shadow-2xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #ffffff 1px, transparent 1px),
                           radial-gradient(circle at 80% 50%, #ffffff 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      {/* Header Section */}
      <div className="relative z-10 p-6 border-b border-gray-700">
        {/* โลโก้ + ชื่อวัด */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={logoadmin}
              alt="Temple Logo"
              className="w-20 h-20 rounded-full border-4 border-white shadow-xl object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-xs">✓</span>
            </div>
          </div>
          <h1 className="text-xl font-bold mt-3 text-center bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            {templeName}
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mt-1"></div>
        </div>

        {/* ข้อมูล Admin */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-4 rounded-xl shadow-lg border border-gray-600">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-lg">
              👋
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-300">สวัสดีครับ</p>
              <p className="font-semibold text-white truncate">{adminName}</p>
              <div className="flex items-center mt-1">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <p className="text-xs text-green-400">{user?.role || 'Administrator'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="relative z-10 flex flex-col gap-2 flex-1 p-4 overflow-y-auto">
        <div className="mb-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
            เมนูจัดการ
          </h3>
        </div>
        
        {menuItems.map((item, index) => (
          <Link
            key={item.path}
            to={item.path}
            className="group flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:shadow-lg hover:shadow-blue-500/25"
          >
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-700 rounded-lg group-hover:bg-white/20 transition-colors duration-300">
              <span className="text-lg">{item.icon}</span>
            </div>
            <span className="font-medium text-gray-200 group-hover:text-white transition-colors duration-300">
              {item.label}
            </span>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
        
        <div className="mt-6 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-yellow-400">Tips</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            คลิกเมนูเพื่อจัดการข้อมูลของวัด อย่าลืมบันทึกข้อมูลก่อนออกจากระบบ
          </p>
        </div>
      </nav>

      {/* Footer Section */}
      <div className="relative z-10 border-t border-gray-700 p-4">
        <div className="mb-3 text-center">
          <div className="text-xs text-gray-400 mb-1">เวลาทำงาน</div>
          <div className="text-sm text-green-400 font-medium">
            {new Date().toLocaleTimeString('th-TH', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
        
        <div className="space-y-2">
          <Link
            to="/"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 p-3 rounded-xl text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center space-x-2 group"
          >
            <svg 
              className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="font-medium">กลับหน้าแรก</span>
          </Link>
          
          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 p-3 rounded-xl text-white transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 flex items-center justify-center space-x-2 group"
          >
            <svg 
              className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">ออกจากระบบ</span>
          </button>
        </div>
        
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            © 2024 Temple Management System
          </p>
        </div>
      </div>
    </div>
  );
}