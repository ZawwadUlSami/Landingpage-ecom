import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Features from "./components/Features";
import Pricing from "./components/Pricing";
import FAQ from "./components/FAQ";
import SiteFooter from "./components/SiteFooter";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <NavBar />
      <section id="hero">
        <Hero />
      </section>
      <section id="how-it-works">
        <HowItWorks />
      </section>
      <section id="features">
        <Features />
      </section>
      <section id="pricing">
        <Pricing />
      </section>
      <section id="faq">
        <FAQ />
      </section>
      <section id="about" className="w-full max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-6">
          <span className="inline-block rounded-full border border-black/10 dark:border-white/15 px-3 py-1 text-sm font-medium mb-3">About</span>
          <h2 className="text-2xl sm:text-4xl font-bold">We help you engage authentically</h2>
        </div>
        <p className="text-black/80 dark:text-white/80 text-sm md:text-base">BizReply is built by a remote-first team passionate about social, AI, and tools that make people more effective. We believe growth starts with helpful conversations.</p>
      </section>
      <section id="contact" className="w-full max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-6">
          <span className="inline-block rounded-full border border-black/10 dark:border-white/15 px-3 py-1 text-sm font-medium mb-3">Contact</span>
          <h2 className="text-2xl sm:text-4xl font-bold">Get in touch</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="rounded-xl border border-black/10 dark:border-white/15 p-5">
            <div className="font-medium">Support</div>
            <div className="text-black/70 dark:text-white/70 mt-1">help@bizreply.co</div>
          </div>
          <div className="rounded-xl border border-black/10 dark:border-white/15 p-5">
            <div className="font-medium">Sales</div>
            <div className="text-black/70 dark:text-white/70 mt-1">sales@bizreply.co</div>
          </div>
          <div className="rounded-xl border border-black/10 dark:border-white/15 p-5">
            <div className="font-medium">Address</div>
            <div className="text-black/70 dark:text-white/70 mt-1">796, 1007 N Orange St, Wilmington, DE 19801</div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
