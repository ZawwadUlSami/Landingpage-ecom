git export const metadata = {
  title: "Features | BizReply",
  description: "Explore BizReply's core features that help you find, engage, and convert on social media using AI.",
};

export default function FeaturesPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-semibold">Powerful features to grow faster</h1>
      <p className="mt-3 text-black/70 dark:text-white/70">Everything you need to discover the right conversations, reply with confidence, and turn attention into revenue.</p>

      <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 rounded-lg border border-black/10 dark:border-white/10">
          <h2 className="text-xl font-medium">Smart Lead Discovery</h2>
          <p className="mt-2 text-black/70 dark:text-white/70">AI finds posts and comments from your ideal buyers across platforms. No more doom-scrolling.</p>
        </div>
        <div className="p-6 rounded-lg border border-black/10 dark:border-white/10">
          <h2 className="text-xl font-medium">Reply Suggestions</h2>
          <p className="mt-2 text-black/70 dark:text-white/70">Get on-brand, context-aware replies you can post in one click. Edit tone and length instantly.</p>
        </div>
        <div className="p-6 rounded-lg border border-black/10 dark:border-white/10">
          <h2 className="text-xl font-medium">CRM Sync</h2>
          <p className="mt-2 text-black/70 dark:text-white/70">Automatically capture engaged prospects, with source context and next steps synced to your CRM.</p>
        </div>
        <div className="p-6 rounded-lg border border-black/10 dark:border-white/10">
          <h2 className="text-xl font-medium">Team Playbooks</h2>
          <p className="mt-2 text-black/70 dark:text-white/70">Create reusable reply frameworks and objection handlers so your team stays consistent and fast.</p>
        </div>
        <div className="p-6 rounded-lg border border-black/10 dark:border-white/10">
          <h2 className="text-xl font-medium">Analytics & Attribution</h2>
          <p className="mt-2 text-black/70 dark:text-white/70">See which replies drive follows, DMs, and pipeline. Double down on what works.</p>
        </div>
        <div className="p-6 rounded-lg border border-black/10 dark:border-white/10">
          <h2 className="text-xl font-medium">Security by Design</h2>
          <p className="mt-2 text-black/70 dark:text-white/70">OAuth logins, least-privilege permissions, and data encryption in transit and at rest.</p>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-medium">Built for your workflow</h2>
        <ul className="mt-4 space-y-2 list-disc pl-5 text-black/80 dark:text-white/80">
          <li>Chrome extension to reply without switching tabs</li>
          <li>Integrations: HubSpot, Salesforce, Slack, Zapier</li>
          <li>API access and webhooks</li>
        </ul>
      </section>
    </main>
  );
}


