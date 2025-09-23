export default function SiteFooter() {
  return (
    <footer className="w-full border-t border-black/10 dark:border-white/15 mt-20 py-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div>
          <div className="font-semibold">BizReply</div>
          <p className="mt-2 text-black/70 dark:text-white/70">
            BizReply finds ideal posts on Social Media and helps you reply with AI.
          </p>
        </div>
        <div>
          <div className="font-semibold">Main Links</div>
          <ul className="mt-2 space-y-1">
            <li><a className="hover:underline" href="#how-it-works">How it works</a></li>
            <li><a className="hover:underline" href="#features">Features</a></li>
            <li><a className="hover:underline" href="#pricing">Pricing</a></li>
            <li><a className="hover:underline" href="#faq">FAQ</a></li>
            <li><a className="hover:underline" href="#about">About</a></li>
            <li><a className="hover:underline" href="#contact">Contact</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Contact</div>
          <ul className="mt-2 space-y-1 text-black/80 dark:text-white/80">
            <li>Phone: +1 302 308 2443</li>
            <li>Address: 796, 1007 N Orange St, Wilmington, DE 19801</li>
            <li>hello@bizreply.co</li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-black/60 dark:text-white/60">
        <div>© bizreply.co — All Rights Reserved</div>
        <div className="space-x-4">
          <a className="hover:underline" href="/privacy">Privacy</a>
          <a className="hover:underline" href="/terms">Terms</a>
          <a className="hover:underline" href="/cookies">Cookies</a>
          <a className="hover:underline" href="/security">Security</a>
          <a className="hover:underline" href="/refund-policy">Refunds</a>
        </div>
        <div className="text-black/60 dark:text-white/60">Made with ❤️ by BizReply</div>
      </div>
    </footer>
  );
}


