import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import Ticker from "@/components/home/Ticker";
import Flagships from "@/components/home/Flagships";
import Method from "@/components/home/Method";
import WhyNextWave from "@/components/home/WhyNextWave";
import Contact from "@/components/home/Contact";
import Footer from "@/components/home/Footer";
export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Ticker />
        <Flagships />
        <Method />
        <WhyNextWave />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
