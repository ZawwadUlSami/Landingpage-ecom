type Plan = {
  name: string;
  price: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

export default function Pricing() {
  const plans: Plan[] = [
    {
      name: "Solopreneur",
      price: "$59 / mo",
      features: [
        "5 Keywords Track",
        "200 AI Replies/Month",
        "All 8 Social Medias",
        "1 Brand Project",
        "Bring Your Own API Key",
        "Multi-Language",
      ],
      cta: "Get Started",
    },
    {
      name: "Startup",
      price: "$99 / mo",
      features: [
        "25 Keywords Track",
        "500 AI Replies/Month",
        "All 8 Social Medias",
        "5 Brand Projects",
        "BYO API Key, Multi-Language",
      ],
      cta: "Get Started",
      highlighted: true,
    },
    {
      name: "Agency",
      price: "$249 / mo",
      features: [
        "25 Keywords Track",
        "Unlimited Replies",
        "All 8 Social Medias",
        "20 Brand Projects",
        "Client Report Builder",
      ],
      cta: "Get Started",
    },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto py-16 px-6">
      <div className="text-center mb-10">
        <span className="inline-block rounded-full border border-black/10 dark:border-white/15 px-3 py-1 text-sm font-medium mb-3">
          Pricing
        </span>
        <h2 className="text-2xl sm:text-4xl font-bold">Simple Plans</h2>
        <p className="text-black/70 dark:text-white/70 mt-2 text-sm">
          Lifetime deal available starting at $59.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl border border-black/10 dark:border-white/15 p-6 ${
              plan.highlighted ? "bg-black/5 dark:bg-white/5" : ""
            }`}
          >
            <h3 className="font-semibold text-lg">{plan.name}</h3>
            <div className="text-3xl font-bold mt-2">{plan.price}</div>
            <ul className="mt-4 space-y-2 list-disc pl-5 text-sm">
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <a
              href="https://bizreply.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-foreground text-background px-5 text-sm font-medium hover:opacity-90"
            >
              {plan.cta}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}


