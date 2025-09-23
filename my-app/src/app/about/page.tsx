export const metadata = {
  title: "About | BizReply",
  description: "Learn about BizReply's mission to help teams engage authentically at scale.",
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-semibold">Our mission</h1>
      <p className="mt-3 text-black/80 dark:text-white/80">We believe the best growth comes from helpful conversations. BizReply helps you find the right moments and respond with empathy and speed.</p>

      <h2 className="mt-10 text-2xl font-medium">What we value</h2>
      <ul className="mt-3 space-y-2 list-disc pl-5 text-black/80 dark:text-white/80">
        <li>Customer obsession</li>
        <li>Clarity and simplicity</li>
        <li>Privacy and security</li>
      </ul>

      <h2 className="mt-10 text-2xl font-medium">Who we are</h2>
      <p className="mt-3 text-black/80 dark:text-white/80">We're a small, remote-first team of builders and operators who love social, AI, and tooling that makes people more effective.</p>
    </main>
  );
}


