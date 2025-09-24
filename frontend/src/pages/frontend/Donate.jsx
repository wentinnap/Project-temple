import LayoutHome from "../../layouts/frontend";

export default function About() {
  return (
    <LayoutHome fullWidth>
 <section className="relative w-full">
        <div className="absolute inset-0">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/65/Wat_Phra_Kaew_Bangkok.jpg"
            alt="วัดกำแพง"
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center h-[400px] text-center text-white">
          <div>
            <h1 className="text-4xl font-bold mb-4 text-orange-400">ทำบุญ / บริจาค</h1>
            <p className="text-lg">ร่วมสร้างกุศล สนับสนุนกิจกรรมและการพัฒนาวัด</p>
          </div>
        </div>
      </section>

      {/* รูปใหญ่ ใต้ Hero */}
      <section className="container mx-auto px-6 py-12">
        <img
          src="/src/assets/Donate.png" 
          alt="ภาพบรรยากาศวัด"
          className="w-full h-[800px]"
        />
      </section>

      {/* เนื้อหา + ช่องทางการบริจาค */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6 text-center text-orange-400">ช่องทางการบริจาค</h2>
        <p className="text-lg leading-relaxed mb-8 text-center">
          ทุกการบริจาคของท่านจะถูกนำไปใช้ในการทำนุบำรุงพระพุทธศาสนาและกิจกรรมสาธารณะประโยชน์
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* กล่อง 1 */}
          <div className="bg-white shadow-lg rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">โอนผ่านบัญชีธนาคาร</h3>
            <p className="mb-2">ธนาคารกสิกรไทย</p>
            <p className="mb-2">ชื่อบัญชี: วัดกำแพง</p>
            <p className="font-bold text-lg">เลขบัญชี: 089-1-58112-2</p>
          </div>

          {/* กล่อง 2 */}
          <div className="bg-white shadow-lg rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">สแกน QR Code</h3>
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=donation"
              alt="QR Code"
              className="mx-auto"
            />
          </div>
        </div>
      </section>
    </LayoutHome>
  );
}
