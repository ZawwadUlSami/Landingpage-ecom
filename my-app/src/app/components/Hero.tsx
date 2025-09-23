export default function Hero() {
  return (
    <section className="w-full max-w-5xl mx-auto text-center py-20 px-6">
      <div className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 px-3 py-1 text-sm mb-6">
        <span className="font-medium">🔥 AI Social Sales & Mentions</span>
      </div>
      <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
        AI Social Post Finder & Replier To Promote Your Brand
      </h1>
      <p className="mt-4 text-base sm:text-lg text-black/70 dark:text-white/70 max-w-2xl mx-auto">
        BizReply finds ideal posts on Social Media based on your chosen keywords
        and helps write AI replies plugging in your brand.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href="https://bizreply.co/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center justify-center rounded-full bg-brand-gradient text-white px-6 text-sm font-medium hover:opacity-90"
        >
          Start For Free Today
        </a>
        <a
          href="https://appsumo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center justify-center rounded-full border border-black/10 dark:border-white/15 px-6 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
        >
          AppSumo Deal
        </a>
      </div>
      <p className="mt-3 text-xs text-black/60 dark:text-white/60">
        Pay once, get a lifetime deal forever. Starting at $59.
      </p>
    </section>
  );
}


