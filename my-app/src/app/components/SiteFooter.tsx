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
            <li><a className="hover:underline" href="https://bizreply.co/">How It Works</a></li>
            <li><a className="hover:underline" href="https://bizreply.featurebase.app/roadmap">Product Roadmap</a></li>
            <li><a className="hover:underline" href="https://bizreply.co/">Affiliate Program</a></li>
            <li><a className="hover:underline" href="https://bizreply.co/">Book A Call</a></li>
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
      <div className="text-center text-xs text-black/60 dark:text-white/60 mt-8">
        © bizreply.co — All Rights Reserved
      </div>
    </footer>
  );
}


