import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logoadmin from "../../assets/logoadmin.png";

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNewsDropdownOpen, setIsNewsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // ฟังการ scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ฟังก์ชันสำหรับจัดการการจองพิธี
  const handleBookingClick = (e) => {
    if (!user) {
      e.preventDefault();
      navigate("/register");
    }
  };

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-200" 
          : "bg-gradient-to-r from-black/70 via-black/60 to-black/70 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <img 
              src={logoadmin} 
              alt="โลโก้วัดกำแพง" 
              className="h-12 w-12 object-contain rounded-full border-2 border-white/20 group-hover:border-orange-400 transition-all duration-300 shadow-lg" 
            />
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-yellow-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="flex flex-col">
            <span
              className={`text-xl font-bold transition-all duration-300 ${
                scrolled 
                  ? "text-gray-800" 
                  : "text-white drop-shadow-lg"
              }`}
            >
              วัดกำแพง
            </span>
            <span 
              className={`text-xs transition-all duration-300 ${
                scrolled 
                  ? "text-gray-500" 
                  : "text-orange-200 drop-shadow-sm"
              }`}
            >
              Wat Kampaeng Temple
            </span>
          </div>
        </Link>

        {/* Hamburger button (แสดงเฉพาะมือถือ) */}
        <button
          className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
            scrolled 
              ? "text-gray-700 hover:bg-gray-100" 
              : "text-white hover:bg-white/20 backdrop-blur-sm"
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop Menu */}
        <ul
          className={`hidden md:flex items-center space-x-8 font-medium transition-all duration-300 ${
            scrolled ? "text-gray-700" : "text-white"
          }`}
        >
          <li>
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-lg transition-all duration-300 relative group ${
                scrolled 
                  ? "hover:text-orange-600 hover:bg-orange-50" 
                  : "hover:text-orange-300 hover:bg-white/10 backdrop-blur-sm"
              }`}
            >
              หน้าแรก
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </li>
          
          <li>
            <Link 
              to="/about" 
              className={`px-3 py-2 rounded-lg transition-all duration-300 relative group ${
                scrolled 
                  ? "hover:text-orange-600 hover:bg-orange-50" 
                  : "hover:text-orange-300 hover:bg-white/10 backdrop-blur-sm"
              }`}
            >
              เกี่ยวกับวัด
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </li>

          {/* ข่าวสาร Dropdown */}
          <li className="relative group">
            <button
              className={`flex items-center px-4 py-2.5 rounded-lg transition-all duration-300 relative ${
                scrolled 
                  ? "hover:text-orange-600 hover:bg-orange-50" 
                  : "hover:text-orange-300 hover:bg-white/10 "
              } ${isNewsDropdownOpen ? (scrolled ? 'bg-orange-50 text-orange-600' : 'bg-white/10 text-orange-300') : ''}`}
              onClick={() => setIsNewsDropdownOpen(!isNewsDropdownOpen)}
            >
              ข่าวสาร
              <svg
                className={`w-4 h-4 ml-2 transition-transform duration-300 ${isNewsDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </button>

            {/* Dropdown Menu */}
            {isNewsDropdownOpen && (
              <div 
                className={`absolute top-full left-0 mt-3 w-64 rounded-xl shadow-2xl py-3 border overflow-hidden z-50 ${
                  scrolled 
                    ? "bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-200" 
                    : "bg-gradient-to-r from-black/70 via-black/60 to-black/70 backdrop-blur-sm"
                }`}
              >
                <Link
                  to="/news"
                  className={`flex items-center px-5 py-3.5 transition-all duration-200 ${
                    scrolled
                      ? 'hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 hover:text-orange-600'
                      : 'hover:bg-white/20 hover:text-orange-600'
                  }`}
                  onClick={() => setIsNewsDropdownOpen(false)}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">ข่าวสารทั้งหมด</div>
                    <div className="text-xs text-gray-500">ข่าวสารและประกาศ</div>
                  </div>
                </Link>
                <Link
                  to="/Calendar"
                  className={`flex items-center px-5 py-3.5 transition-all duration-200 ${
                    scrolled
                      ? 'hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 hover:text-orange-600'
                      : 'hover:bg-white/20 hover:text-orange-600'
                  }`}
                  onClick={() => setIsNewsDropdownOpen(false)}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v13a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">ปฏิทินกิจกรรม</div>
                    <div className="text-xs text-gray-500">กิจกรรมและพิธีกรรม</div>
                  </div>
                </Link>
                <Link
                  to="/gallery"
                  className={`flex items-center px-5 py-3.5 transition-all duration-200 ${
                    scrolled
                      ? 'hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 hover:text-orange-600'
                      : 'hover:bg-white/20 hover:text-orange-600'
                  }`}
                  onClick={() => setIsNewsDropdownOpen(false)}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">แกลอรี่กิจกรรม</div>
                    <div className="text-xs text-gray-500">รูปภาพกิจกรรมวัด</div>
                  </div>
                </Link>
              </div>
            )}
          </li>

          {/* จองพิธี - เพิ่มใหม่ */}
          <li>
            <Link 
              to={user ? "/booking" : "/register"}
              onClick={handleBookingClick}
              className={`px-3 py-2 rounded-lg transition-all duration-300 relative group ${
                scrolled 
                  ? "hover:text-orange-600 hover:bg-blue-50" 
                  : "hover:text-orange-300 hover:bg-white/10 backdrop-blur-sm"
              }`}
            >
              จองพิธี
              {!user && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  !
                </span>
              )}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </li>

          <li>
            <Link 
              to="/Donate" 
              className={`px-3 py-2 rounded-lg transition-all duration-300 relative group ${
                scrolled 
                  ? "hover:text-orange-600 hover:bg-orange-50" 
                  : "hover:text-orange-300 hover:bg-white/10 backdrop-blur-sm"
              }`}
            >
              ทำบุญ/บริจาค
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </li>

          <li>
            <Link 
              to="/Q&A" 
              className={`px-3 py-2 rounded-lg transition-all duration-300 relative group ${
                scrolled 
                  ? "hover:text-orange-600 hover:bg-orange-50" 
                  : "hover:text-orange-300 hover:bg-white/10 backdrop-blur-sm"
              }`}
            >
              ถาม-ตอบ
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </li>
        </ul>

        {/* ปุ่ม Login / โปรไฟล์ (Desktop) */}
        <div className="hidden md:flex space-x-3 items-center">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center space-x-3 px-4 py-2 rounded-xl transition-all duration-300 ${
                  scrolled 
                    ? "bg-gray-100 hover:bg-gray-200 text-gray-700" 
                    : "bg-white/20 hover:bg-white/30 backdrop-blur-lg text-white border border-white/30"
                }`}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user.first_name?.[0] || user.email[0]}
                </div>
                <span className="font-medium">
                  {user.first_name} {user.last_name}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 text-gray-700 border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-yellow-50">
                    <div className="text-sm font-medium text-gray-900">{user.first_name} {user.last_name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                    <div className="inline-flex px-2 py-1 mt-1 text-xs bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-full">
                      {role}
                    </div>
                  </div>
                  
                  {role === "user" && (
                    <Link
                      to="/booking"
                      className="flex items-center px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-200"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <svg className="w-4 h-4 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v13a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h2z" />
                      </svg>
                      การจองพิธี
                    </Link>
                  )}
                  {role === "monk" && (
                    <Link
                      to="/monk"
                      className="flex items-center px-4 py-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 transition-all duration-200"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <svg className="w-4 h-4 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      จัดการบทความ
                    </Link>
                  )}
                  {role === "admin" && (
                    <Link
                      to="/admin"
                      className="flex items-center px-4 py-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 transition-all duration-200"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <svg className="w-4 h-4 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      จัดการระบบ
                    </Link>
                  )}
                  <hr className="border-gray-200 my-1" />
                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                      setIsProfileOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 text-red-600 transition-all duration-200"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    ออกจากระบบ
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-3">
              <Link
                to="/login"
                className={`px-5 py-2.5 border-2 rounded-xl font-medium transition-all duration-300 ${
                  scrolled
                    ? "border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white hover:shadow-lg hover:shadow-orange-500/25"
                    : "border-white text-white hover:bg-white hover:text-gray-800 backdrop-blur-sm"
                }`}
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                to="/register"
                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                  scrolled
                    ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 hover:shadow-lg hover:shadow-orange-500/25"
                    : "bg-gradient-to-r from-white to-gray-100 text-gray-800 hover:from-orange-400 hover:to-yellow-400 hover:text-white shadow-lg"
                }`}
              >
                สมัครสมาชิก
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg shadow-2xl border-t border-gray-200">
          <div className="px-6 py-4">
            <ul className="space-y-3 text-gray-700">
              {/* หน้าแรก */}
              <li>
                <Link 
                  to="/" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 hover:text-orange-600 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="font-medium">หน้าแรก</span>
                </Link>
              </li>

              {/* เกี่ยวกับวัด */}
              <li>
                <Link 
                  to="/about" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 hover:text-orange-600 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="font-medium">เกี่ยวกับวัด</span>
                </Link>
              </li>

              {/* ข่าวสาร */}
              <li>
                <Link 
                  to="/news" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 hover:text-orange-600 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  <span className="font-medium">ข่าวสาร</span>
                </Link>
              </li>

              {/* ปฏิทินกิจกรรม */}
              <li className="ml-6">
                <Link 
                  to="/Calendar" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:text-green-600 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v13a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h2z" />
                  </svg>
                  <span className="font-medium">ปฏิทินกิจกรรม</span>
                </Link>
              </li>

              {/* แกลอรี่กิจกรรม */}
              <li className="ml-6">
                <Link 
                  to="/gallery" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 hover:text-purple-600 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">แกลอรี่กิจกรรม</span>
                </Link>
              </li>

              {/* จองพิธี - เพิ่มใหม่ */}
              <li>
                <Link 
                  to={user ? "/booking" : "/register"}
                  onClick={(e) => {
                    if (!user) {
                      e.preventDefault();
                      setIsOpen(false);
                      navigate("/register");
                    } else {
                      setIsOpen(false);
                    }
                  }}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-600 transition-all duration-200 relative"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v13a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h2z" />
                  </svg>
                  <div className="flex items-center">
                    <span className="font-medium">จองพิธี</span>
                    {!user && (
                      <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                        ต้องสมัครก่อน
                      </span>
                    )}
                  </div>
                </Link>
              </li>

              {/* ทำบุญ/บริจาค */}
              <li>
                <Link 
                  to="/Donate" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 hover:text-orange-600 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="font-medium">ทำบุญ/บริจาค</span>
                </Link>
              </li>

              {/* ถาม-ตอบ */}
              <li>
                <Link 
                  to="/Q&A" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 hover:text-orange-600 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">ถาม-ตอบ</span>
                </Link>
              </li>

              {/* ปุ่ม Login / โปรไฟล์ (Mobile) */}
              <hr className="border-gray-200 my-4" />
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.first_name?.[0] || user.email[0]}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user.first_name} {user.last_name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                  </div>
                  
                  {role === "user" && (
                    <Link
                      to="/booking"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 p-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v13a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h2z" />
                      </svg>
                      <span className="font-medium">การจองพิธี</span>
                    </Link>
                  )}
                  {role === "monk" && (
                    <Link
                      to="/monk"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 p-3 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-all duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span className="font-medium">จัดการบทความ</span>
                    </Link>
                  )}
                  {role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 p-3 rounded-xl hover:bg-purple-50 hover:text-purple-600 transition-all duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-medium">จัดการระบบ</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-red-50 hover:text-red-600 text-red-600 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-medium">ออกจากระบบ</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center space-x-2 w-full p-3 border-2 border-orange-500 text-orange-600 rounded-xl hover:bg-orange-500 hover:text-white transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-medium">เข้าสู่ระบบ</span>
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center space-x-2 w-full p-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span className="font-medium">สมัครสมาชิก</span>
                  </Link>
                </div>
              )}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}