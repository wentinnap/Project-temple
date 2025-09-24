import Navbar from "../../components/frontend/Navbar";
import HeroCarousel from "../../components/frontend/HeroCarousel";
import NewsSection from "../../components/frontend/NewsSection";
import Footer from "../../components/frontend/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <HeroCarousel />


      <NewsSection />



      <Footer />
    </div>
  );
}