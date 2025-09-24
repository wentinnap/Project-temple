import LayoutHome from "../../layouts/frontend";

export default function About() {
  return (
    <LayoutHome fullWidth>
     {/* Hero Section */}
<section className="relative w-full">
  <div className="absolute inset-0">
    <img
      src="/src/assets/heroabout.png" 
      alt="วัดกำแพง"
      className="w-full h-[500px] object-cover"
    />
    <div className="absolute inset-0 bg-black/60"></div> {/* overlay */}
  </div>
  <div className="relative z-10 flex items-center justify-center h-[500px] text-center text-white">
    <div>
      <h1 className="text-4xl font-bold mb-4 text-orange-400">เกี่ยวกับวัดกำแพง</h1>
      <p className="text-lg">ศูนย์รวมจิตใจ สืบสานพระพุทธศาสนา และวัฒนธรรมไทย</p>
    </div>
  </div>
</section>


      {/* เนื้อหา */}
      <section className="py-12 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">ประวัติความเป็นมา</h2>
        <p className="text-lg leading-relaxed mb-4">
          วัดกำแพง เป็นวัดเก่าแก่ที่มีประวัติศาสตร์ยาวนาน
          และเป็นศูนย์รวมจิตใจของชุมชนในท้องถิ่น
          โดยมีการจัดกิจกรรมทางศาสนาและวัฒนธรรมอย่างต่อเนื่อง
          เช่น งานประเพณีสงกรานต์ การเข้าพรรษา และการทำบุญตักบาตร
        </p>
        <p className="text-lg leading-relaxed mb-4">
          นอกจากบทบาททางศาสนาแล้ว
          วัดกำแพงยังเป็นแหล่งเรียนรู้ธรรมะ ศิลปะ และภูมิปัญญาท้องถิ่น
          เปิดโอกาสให้เยาวชนและประชาชนทั่วไปได้ร่วมกิจกรรมอย่างสร้างสรรค์
        </p>
      </section>

      {/* Timeline */}
      <section className="py-12 bg-gray-50">
        <h2 className="text-2xl font-bold text-center mb-10">เหตุการณ์สำคัญ</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="font-semibold text-lg mb-2">พ.ศ. ๒๔๙๐</h3>
            <p>ก่อตั้งวัดกำแพงและเริ่มสร้างอุโบสถหลังแรก</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="font-semibold text-lg mb-2">พ.ศ. ๒๕๐๕</h3>
            <p>บูรณะพระวิหารและสร้างพระประธานองค์ใหญ่</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="font-semibold text-lg mb-2">พ.ศ. ๒๕๕๐</h3>
            <p>จัดงานฉลองครบ ๖๐ ปี และสร้างหอสมุดธรรมะ</p>
          </div>
        </div>
      </section>
    </LayoutHome>
  );
}
