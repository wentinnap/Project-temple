import Navbar from "../components/frontend/Navbar";
import Footer from "../components/frontend/Footer";

export default function LayoutHome({ children, fullWidth = false }) {
  return (
    <>
      <Navbar />

      <main className={fullWidth ? "flex-1 w-full" : "flex-1 container mx-auto px-6 py-6"}>
        {children}
      </main>

      <Footer />
    </>
  );
}
