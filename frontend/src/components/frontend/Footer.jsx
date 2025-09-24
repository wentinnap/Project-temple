export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-orange-400 text-white py-12 mt-auto overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, #ffffff 1px, transparent 1px),
                           radial-gradient(circle at 80% 80%, #ffffff 1px, transparent 1px),
                           radial-gradient(circle at 40% 60%, #ffffff 0.5px, transparent 0.5px)`,
          backgroundSize: '60px 60px, 80px 80px, 40px 40px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Temple Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm p-2 border-2 border-white/30">
                <img 
                  src="/src/assets/logo.png" 
                  alt="โลโก้วัดกำแพง" 
                  className="w-full h-full object-contain rounded-full"
                  onError={(e) => {
                    // Fallback to icon if image fails to load
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'block';
                  }}
                />
                <svg 
                  className="w-8 h-8 text-yellow-300 hidden" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                  style={{display: 'none'}}
                >
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">วัดกำแพง</h3>
                <p className="text-orange-200 text-sm">Wat Kampaeng Temple</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-orange-300 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-orange-100">วัดกำแพง ตำบลทดสอบ อำเภอเมือง</p>
                  <p className="text-orange-100">จังหวัดกรุงเทพฯ 10200</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <p className="text-orange-100">โทร: 02-123-4567</p>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-orange-100">info@temple.com</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              ลิงก์ด่วน
            </h3>
            <ul className="space-y-3">
              {[
                { name: "เกี่ยวกับวัด", href: "/about" },
                { name: "ข่าวสาร", href: "/news" },
                { name: "ปฏิทินกิจกรรม", href: "/Calendar" },
                { name: "ทำบุญ/บริจาค", href: "/Donate" }
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-orange-200 hover:text-white transition-all duration-300 flex items-center space-x-2 group"
                  >
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              ติดตามเรา
            </h3>
            <div className="space-y-3">
              {[
                { 
                  name: "Facebook", 
                  href: "#", 
                  icon: "M18.77 7.46H15.5v-1.9c0-.9.6-1.1 1-1.1h2.2V2.5h-3c-2.8 0-4.7 2.1-4.7 5.1v1.9h-2v2h2V17h3v-5.5h2.5l.2-2z",
                  color: "hover:text-blue-300" 
                },
                { 
                  name: "YouTube", 
                  href: "#", 
                  icon: "M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z",
                  color: "hover:text-red-300" 
                },
                { 
                  name: "Line Official", 
                  href: "#", 
                  icon: "M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.032-.199.032-.2 0-.393-.129-.482-.334l-.970-2.154h-.06l-.97 2.154c-.089.205-.282.334-.482.334-.066 0-.135-.011-.199-.032-.258-.086-.432-.326-.432-.596V8.108c0-.345.282-.63.63-.63.346 0 .629.285.629.63v2.854l.970-2.154c.09-.205.283-.334.483-.334.199 0 .392.129.482.334l.970 2.154V8.108c0-.345.282-.63.629-.63.348 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.629.629-.348 0-.63-.285-.63-.629V8.108c0-.345.282-.63.63-.63.347 0 .629.285.629.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.629 0 .344-.281.629-.629.629z",
                  color: "hover:text-green-300" 
                }
              ].map((social) => (
                <a 
                  key={social.name}
                  href={social.href} 
                  className={`flex items-center space-x-3 text-green-200 ${social.color} transition-all duration-300 group`}
                >
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.icon} />
                    </svg>
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">{social.name}</span>
                </a>
              ))}
            </div>

            {/* QR Code or Additional Info */}
            <div className="mt-6 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-lg mx-auto mb-2">
                <svg className="w-8 h-8 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-center text-sm text-green-200">สแกนเพื่อติดตาม</p>
              <p className="text-center text-xs text-green-300">Line Official Account</p>
            </div>
          </div>
        </div>



        {/* Copyright */}
        <div className="border-t border-green-500/30 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-green-200 text-sm">
                © {new Date().getFullYear()} วัดกำแพง - สงวนลิขสิทธิ์
              </p>
              <p className="text-green-300 text-xs mt-1">
                Temple Management System v2.0
              </p>
            </div>
            <div className="flex items-center space-x-4 text-green-300">
              <a href="#" className="text-xs hover:text-white transition-colors">นโยบายความเป็นส่วนตัว</a>
              <span className="text-green-500">|</span>
              <a href="#" className="text-xs hover:text-white transition-colors">เงื่อนไขการใช้งาน</a>
              <span className="text-green-500">|</span>
              <a href="#" className="text-xs hover:text-white transition-colors">ติดต่อเรา</a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-400/10 to-transparent rounded-full blur-2xl"></div>
    </footer>
  );
}