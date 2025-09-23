import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Features from "./components/Features";
import Pricing from "./components/Pricing";
import FAQ from "./components/FAQ";
import SiteFooter from "./components/SiteFooter";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
      <FAQ />
      <SiteFooter />
    </div>
  );
}
