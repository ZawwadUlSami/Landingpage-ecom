export const metadata = {
  title: "Security | BizReply",
  description: "Overview of BizReply security practices and responsible disclosure.",
};

export default function SecurityPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-semibold">Security at BizReply</h1>
      <p className="mt-3 text-black/80 dark:text-white/80">Security is built into our product and processes.</p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg border border-black/10 dark:border-white/10">
          <h2 className="text-xl font-medium">Data protection</h2>
          <p className="mt-2 text-black/70 dark:text-white/70">Encryption in transit (TLS 1.2+) and at rest (AES-256). Secrets managed securely.</p>
        </div>
        <div className="p-6 rounded-lg border border-black/10 dark:border-white/10">
          <h2 className="text-xl font-medium">Access control</h2>
          <p className="mt-2 text-black/70 dark:text-white/70">Least-privilege access, SSO/OAuth, and role-based permissions.</p>
        </div>
        <div className="p-6 rounded-lg border border-black/10 dark:border-white/10">
          <h2 className="text-xl font-medium">Monitoring</h2>
          <p className="mt-2 text-black/70 dark:text-white/70">Audit logs, anomaly detection, and backups with regular restore tests.</p>
        </div>
        <div className="p-6 rounded-lg border border-black/10 dark:border-white/10">
          <h2 className="text-xl font-medium">Disclosure</h2>
          <p className="mt-2 text-black/70 dark:text-white/70">Report vulnerabilities to security@bizreply.co. We appreciate responsible disclosure.</p>
        </div>
      </div>
    </main>
  );
}


