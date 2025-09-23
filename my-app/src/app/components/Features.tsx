export default function Features() {
  const pros = [
    "One-Click Auto Search refreshes content across socials daily.",
    "Track and find posts from multiple platforms under one roof.",
    "Seamless AI replies mentioning your brand and key messages.",
    "Keyword-specific filters to find targeted posts.",
  ];

  const cons = [
    "Manual search is labor-intensive across platforms.",
    "Inconsistent and delayed responses to posts.",
    "Misses key conversations or leads due to oversight.",
    "Overlooked opportunities using manual methods.",
  ];

  return (
    <section className="w-full max-w-6xl mx-auto py-16 px-6">
      <div className="text-center mb-10">
        <span className="inline-block rounded-full border border-black/10 dark:border-white/15 px-3 py-1 text-sm font-medium mb-3">
          Why Use BizReply
        </span>
        <h2 className="text-2xl sm:text-4xl font-bold">Save Time vs Manual Approach</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-black/10 dark:border-white/15 p-6">
          <h3 className="font-semibold text-lg mb-3">With BizReply</h3>
          <ul className="space-y-2 list-disc pl-5 text-sm">
            {pros.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-black/10 dark:border-white/15 p-6">
          <h3 className="font-semibold text-lg mb-3">Manual Approach</h3>
          <ul className="space-y-2 list-disc pl-5 text-sm">
            {cons.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}


