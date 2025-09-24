type QA = { q: string; a: string };

export default function FAQ() {
  const qas: QA[] = [
    {
      q: "What is Bank Statement Converter?",
      a: "Bank Statement Converter is a secure platform that converts PDF bank statements from thousands of banks worldwide into clean Excel (XLS) format with 99.9% accuracy.",
    },
    {
      q: "How does the conversion work?",
      a: "Our advanced AI algorithms analyze and extract transaction data from your PDF bank statements, then format it into a structured Excel file ready for accounting software.",
    },
    {
      q: "Is my data secure?",
      a: "Absolutely. We use bank-grade security with end-to-end encryption. Your files are processed securely and automatically deleted after conversion. We never store your financial data.",
    },
    {
      q: "What file formats are supported?",
      a: "We support PDF bank statements from any bank worldwide. The output is always in Excel (XLSX) format, perfectly formatted for accounting software like QuickBooks, Xero, and others.",
    },
    {
      q: "How many conversions can I do?",
      a: "Anonymous users get 1 free conversion to try our service. Free registered users get 15 conversions. Professional users get unlimited conversions with priority processing.",
    },
    {
      q: "What banks are supported?",
      a: "We support bank statements from thousands of banks worldwide including Chase, Bank of America, Wells Fargo, Citibank, HSBC, and many others. Our AI adapts to different formats automatically.",
    },
    {
      q: "How accurate is the conversion?",
      a: "Our conversion accuracy is 99.9%. Every transaction is precisely extracted with date, description, amount, and balance. If you encounter any issues, our support team will fix it immediately.",
    },
    {
      q: "Can I convert multi-page statements?",
      a: "Yes! Our system handles multi-page bank statements perfectly, extracting every single transaction across all pages into a comprehensive Excel file.",
    },
  ];

  return (
    <section id="faq" className="w-full py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header - Apple Style */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900 mb-6">
            Frequently asked questions
          </h2>
          <p className="text-xl font-light text-gray-700 max-w-2xl mx-auto">
            Everything you need to know about our bank statement converter.
          </p>
        </div>

        {/* FAQ Items - Apple Style */}
        <div className="space-y-4">
          {qas.map((item, index) => (
            <details 
              key={index} 
              className="group bg-gray-50 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-200"
            >
              <summary className="cursor-pointer select-none px-8 py-6 font-semibold text-lg text-gray-900 hover:text-blue-600 transition-colors duration-200 list-none">
                <div className="flex items-center justify-between">
                  <span>{item.q}</span>
                  <svg 
                    className="w-5 h-5 text-gray-400 group-open:rotate-45 transition-transform duration-200" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </summary>
              <div className="px-8 pb-6 text-gray-700 leading-relaxed">
                {item.a}
              </div>
            </details>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">
            Still have questions? We're here to help.
          </p>
          <a 
            href="#contact" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors duration-200"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
}