export default function Hero() {
  return (
    <section
      className="relative h-[90vh] flex items-center justify-center" // 👈 ปรับจาก h-screen
      style={{
        background: `
          linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
          url('/HeroImage.png'),
          linear-gradient(135deg, #1a365d 0%, #2d5016 100%)
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* เนื้อหา */}
      <div className="relative z-10 text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight drop-shadow-lg">
          ยินดีต้อนรับสู่
          <span className="block text-orange-400 mt-2">วัดกำแพง</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
          สถานที่แห่งความศรัทธาและจิตใจอันสงบ  
          ร่วมสืบสานประเพณี ศึกษาธรรม และทำกิจกรรมเพื่อชุมชน
        </p>

        {/* ปุ่ม CTA */}
        <div className="mt-8 flex justify-center space-x-4">
          <a
            href="/about"
            className="px-6 py-3 bg-orange-400 text-white rounded-lg font-medium hover:bg-orange-300 transition shadow-lg"
          >
            เกี่ยวกับวัด
          </a>
          <a
            href="/Calendar"
            className="px-6 py-3 border border-white text-white rounded-lg font-medium hover:bg-white hover:text-orange-400 transition shadow-lg"
          >
            ปฏิทินกิจกรรม
          </a>
        </div>
      </div>
    </section>
  );
}
