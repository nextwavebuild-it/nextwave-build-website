import Hero from "@/components/home/Hero";
import Ticker from "@/components/home/Ticker";
import Flagships from "@/components/home/Flagships";
import Method from "@/components/home/Method";
import WhyNextWave from "@/components/home/WhyNextWave";
import Contact from "@/components/home/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Ticker />
      <Flagships />
      <Method />
      <WhyNextWave />
      <Contact />
    </main>
  );
}
