export const metadata = {
  title: "FAQ | BizReply",
  description: "Frequently asked questions about BizReply pricing, features, and security.",
};

function QA({ q, a }: { q: string; a: string }) {
  return (
    <div className="p-5 rounded-lg border border-black/10 dark:border-white/10">
      <h3 className="font-medium">{q}</h3>
      <p className="mt-2 text-black/70 dark:text-white/70">{a}</p>
    </div>
  );
}

export default function FaqPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 space-y-4">
      <h1 className="text-3xl md:text-4xl font-semibold">Frequently asked questions</h1>
      <QA q="How does BizReply find relevant posts?" a="We index public conversations across supported platforms and use AI to match them to your ICP." />
      <QA q="Will my account get flagged?" a="We follow platform policies and use rate limits, OAuth, and human-in-the-loop to keep usage compliant." />
      <QA q="Can I customize the reply tone?" a="Yes. Choose tones like friendly, expert, or concise, and add brand guidelines." />
      <QA q="Do you integrate with my CRM?" a="We integrate with HubSpot and Salesforce; more via Zapier and our API." />
      <QA q="How secure is my data?" a="We encrypt data at rest and in transit, and follow least-privilege access." />
      <QA q="Do you offer discounts?" a="Yes, we offer annual and nonprofit discounts. Contact sales." />
    </main>
  );
}


