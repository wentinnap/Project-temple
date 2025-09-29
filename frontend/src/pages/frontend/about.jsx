import LayoutHome from "../../layouts/frontend";

export default function About() {
  return (
    <LayoutHome fullWidth>
     {/* Hero Section */}
<section className="relative h-100 w-full">
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
            <h3 className="font-semibold text-lg mb-2">พ.ศ. 2220–2226</h3>
            <p>• วัดกำแพงสร้างขึ้นราว พ.ศ. 2220 ปลายสมัยอยุธยา เดิมชื่อว่า 
              วัดส้มป่อยต่อมาได้รับพระราชทาน วิสุงคามสีมา (เขตอุโบสถ) ใน พ.ศ. 2226</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="font-semibold text-lg mb-2">พ.ศ. ๒๕๐๕</h3>
            <p> หลังจากอยุธยาล่มสลาย วัดมีการทรุดโทรมไปตามกาลเวลา
 • ช่วงรัตนโกสินทร์ตอนต้น–กลาง มีการ บูรณะอุโบสถ เจดีย์ และโบราณสถาน ครั้งใหญ่ โดยชาวบ้านและคณะสงฆ์ร่วมแรงร่วมใจ</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="font-semibold text-lg mb-2">พ.ศ. ๒๕๕๐</h3>
            <p>• วัดกำแพงกลายเป็น สถานที่ประกอบพิธีสำคัญของชาวบางเขน นนทบุรี เช่น งานกฐิน ผ้าป่า และงานสรงน้ำพระ
  ในบางปี วัดได้จัด พิธีสร้าง/แจกวัตถุมงคล เพื่อช่วยเหลือชุมชนและหารายได้บูรณะวัด เช่น ช่วงวิกฤตเศรษฐกิจและโควิด-19</p>
          </div>
        </div>
      </section>
    </LayoutHome>
  );
}
