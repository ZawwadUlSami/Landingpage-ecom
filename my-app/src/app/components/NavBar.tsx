export default function NavBar() {
  return (
    <header className="w-full sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/30 border-b border-black/10 dark:border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <a href="#hero" className="font-semibold">BizReply</a>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a className="hover:underline" href="#how-it-works">How it works</a>
          <a className="hover:underline" href="#features">Features</a>
          <a className="hover:underline" href="#pricing">Pricing</a>
          <a className="hover:underline" href="#faq">FAQ</a>
          <a className="hover:underline" href="#about">About</a>
          <a className="hover:underline" href="#contact">Contact</a>
        </nav>
        <a href="#pricing" className="px-3 py-1.5 rounded-md bg-brand-gradient text-white text-sm">Get started</a>
      </div>
    </header>
  );
}


