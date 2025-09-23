export const metadata = {
  title: "Contact | BizReply",
  description: "Get in touch with the BizReply team for support, sales, or partnerships.",
};

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-semibold">Contact us</h1>
      <p className="mt-3 text-black/80 dark:text-white/80">We'd love to hear from you. Reach out and we'll respond within 1 business day.</p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg border border-black/10 dark:border-white/10">
          <h2 className="text-xl font-medium">Support</h2>
          <p className="mt-2 text-black/70 dark:text-white/70">help@bizreply.co</p>
        </div>
        <div className="p-6 rounded-lg border border-black/10 dark:border-white/10">
          <h2 className="text-xl font-medium">Sales</h2>
          <p className="mt-2 text-black/70 dark:text-white/70">sales@bizreply.co</p>
        </div>
        <div className="p-6 rounded-lg border border-black/10 dark:border-white/10">
          <h2 className="text-xl font-medium">Partnerships</h2>
          <p className="mt-2 text-black/70 dark:text-white/70">partners@bizreply.co</p>
        </div>
        <div className="p-6 rounded-lg border border-black/10 dark:border-white/10">
          <h2 className="text-xl font-medium">Address</h2>
          <p className="mt-2 text-black/70 dark:text-white/70">796, 1007 N Orange St, Wilmington, DE 19801</p>
        </div>
      </div>
    </main>
  );
}


