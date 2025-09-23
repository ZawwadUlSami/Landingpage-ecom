export const metadata = {
  title: "Pricing | BizReply",
  description: "Transparent, simple pricing for BizReply. Choose a plan that fits your team.",
};

function Plan({ name, price, features }: { name: string; price: string; features: string[] }) {
  return (
    <div className="p-6 rounded-lg border border-black/10 dark:border-white/10">
      <h3 className="text-xl font-semibold">{name}</h3>
      <div className="mt-2 text-3xl font-bold">{price}</div>
      <ul className="mt-4 space-y-2 text-black/80 dark:text-white/80">
        {features.map((f) => (
          <li key={f}>• {f}</li>
        ))}
      </ul>
      <a href="/signup" className="inline-block mt-6 px-4 py-2 rounded-md bg-brand-gradient text-white">Get started</a>
    </div>
  );
}

export default function PricingPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-semibold">Pricing that scales with you</h1>
      <p className="mt-3 text-black/70 dark:text-white/70">Start free, upgrade when you see results. No hidden fees.</p>

      <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Plan
          name="Starter"
          price="$0"
          features={["100 AI replies / month", "1 social account", "Basic discovery", "Community support"]}
        />
        <Plan
          name="Growth"
          price="$49/mo"
          features={["Unlimited replies", "3 social accounts", "Lead capture & CRM sync", "Email support"]}
        />
        <Plan
          name="Team"
          price="$149/mo"
          features={["Unlimited everything", "5+ social accounts", "Playbooks & analytics", "Priority support"]}
        />
      </section>

      <p className="mt-10 text-sm text-black/60 dark:text-white/60">All plans include security best practices, OAuth logins, and data encryption.</p>
    </main>
  );
}


