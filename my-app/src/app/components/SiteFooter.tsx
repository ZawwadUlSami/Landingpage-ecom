export default function SiteFooter() {
  return (
    <footer className="w-full bg-gray-900 text-white mt-20 py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="font-semibold text-xl">Bank Statement Converter</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              The world's most trusted bank statement converter. Transform PDF statements from any bank into perfect Excel format with 99.9% accuracy.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3 text-gray-300">
              <li><a className="hover:text-white transition-colors" href="#features">Features</a></li>
              <li><a className="hover:text-white transition-colors" href="#pricing">Pricing</a></li>
              <li><a className="hover:text-white transition-colors" href="#about">About</a></li>
              <li><a className="hover:text-white transition-colors" href="#contact">Contact</a></li>
              <li><a className="hover:text-white transition-colors" href="/dashboard">Dashboard</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <span className="block">Email Support</span>
                <a href="mailto:support@bankstatementconverter.com" className="hover:text-white transition-colors">
                  support@bankstatementconverter.com
                </a>
              </li>
              <li>
                <span className="block">Sales Inquiries</span>
                <a href="mailto:sales@bankstatementconverter.com" className="hover:text-white transition-colors">
                  sales@bankstatementconverter.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400">
              © 2025 Bank Statement Converter. All Rights Reserved.
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <a className="hover:text-white transition-colors" href="/privacy">Privacy Policy</a>
              <a className="hover:text-white transition-colors" href="/terms">Terms of Service</a>
              <a className="hover:text-white transition-colors" href="/security">Security</a>
              <a className="hover:text-white transition-colors" href="/refund-policy">Refund Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}