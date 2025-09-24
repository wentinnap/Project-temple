import LayoutHome from "../../layouts/frontend";

const newsData = [
  {
    id: 1,
    title: "งานบุญประจำปีวัดใหญ่",
    date: "2025-09-20",
    image: "https://source.unsplash.com/1200x600/?temple,festival",
    description: "ขอเชิญร่วมงานบุญใหญ่ประจำปี เพื่อความเป็นสิริมงคลแก่ชีวิต",
  },
  {
    id: 2,
    title: "การบวชพระภิกษุใหม่",
    date: "2025-09-10",
    image: "https://source.unsplash.com/1200x600/?monk,ordination",
    description: "ขอเรียนเชิญร่วมอนุโมทนาบุญกับพระภิกษุใหม่ ณ วัด...",
  },
  {
    id: 3,
    title: "กิจกรรมเวียนเทียนวันสำคัญ",
    date: "2025-08-30",
    image: "https://source.unsplash.com/1200x600/?buddhism,ceremony",
    description: "เวียนเทียนในวันพระใหญ่ เพื่อสืบสานประเพณีไทยพุทธ",
  },
];

export default function NewsPage() {
  return (
    <LayoutHome fullWidth>
      {/* Hero Section */}
      <section className="relative h-90 flex items-center justify-center bg-gray-800 text-white">
        <img
          src="https://source.unsplash.com/1600x600/?temple,news"
          alt="ข่าวสาร"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <h1 className="relative text-4xl font-bold z-10">ข่าวสารและกิจกรรม</h1>
      </section>

      {/* News List */}
      <div className="container mx-auto px-6 py-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {newsData.map((news) => (
          <div
            key={news.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition"
          >
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <p className="text-sm text-gray-500">{news.date}</p>
              <h2 className="text-xl font-semibold mt-2">{news.title}</h2>
              <p className="text-gray-600 mt-2 line-clamp-3">{news.description}</p>
              <button className="mt-4 text-blue-600 hover:underline">
                อ่านต่อ →
              </button>
            </div>
          </div>
        ))}
      </div>
    </LayoutHome>
  );
}
