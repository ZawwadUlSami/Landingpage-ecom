type QA = { q: string; a: string };

export default function FAQ() {
  const qas: QA[] = [
    {
      q: "What is BizReply.co?",
      a: "BizReply monitors social mentions based on your keywords and helps write AI replies plugging your brand.",
    },
    {
      q: "How does BizReply work?",
      a: "We track specified keywords across social platforms and surface the most relevant posts for engagement.",
    },
    {
      q: "What AI models can I use?",
      a: "Bring your own API key for OpenAI, Gemini, or Straico and customize prompts in multiple languages.",
    },
    {
      q: "Is there a money-back guarantee?",
      a: "Yes, 30-day money-back guarantee on lifetime deals.",
    },
  ];

  return (
    <section className="w-full max-w-4xl mx-auto py-16 px-6">
      <div className="text-center mb-10">
        <span className="inline-block rounded-full border border-black/10 dark:border:white/15 px-3 py-1 text-sm font-medium mb-3">
          FAQ
        </span>
        <h2 className="text-2xl sm:text-4xl font-bold">Frequently Asked Questions</h2>
      </div>
      <div className="space-y-4">
        {qas.map((item) => (
          <details key={item.q} className="rounded-xl border border-black/10 dark:border-white/15">
            <summary className="cursor-pointer select-none px-4 py-3 font-medium">{item.q}</summary>
            <div className="px-4 pb-4 text-sm text-black/80 dark:text-white/80">{item.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}


