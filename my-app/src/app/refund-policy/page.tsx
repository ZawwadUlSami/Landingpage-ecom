export const metadata = {
  title: "Refund Policy | BizReply",
  description: "Our refund policy for BizReply subscriptions and purchases.",
};

export default function RefundPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 prose prose-neutral dark:prose-invert">
      <h1>Refund Policy</h1>
      <p>We want you to love BizReply. If you're not satisfied, contact us.</p>

      <h2>Subscriptions</h2>
      <p>Monthly plans can be canceled anytime and stop renewing immediately. Annual plans can be refunded within 14 days of purchase.</p>

      <h2>Trials</h2>
      <p>Trials are free. Charges begin only after the trial period ends unless canceled.</p>

      <h2>How to request a refund</h2>
      <p>Email billing@bizreply.co from your account email with your order details.</p>
    </main>
  );
}


