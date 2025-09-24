import { Upload, FileText, Download, CheckCircle } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      title: "Upload Your Bank Statement",
      description: "Simply drag and drop your PDF bank statement or click to select from your device.",
      icon: Upload,
      badge: "Step 1",
      color: "blue",
    },
    {
      title: "AI Processing",
      description: "Our advanced algorithms analyze and extract transaction data from your PDF with high accuracy.",
      icon: FileText,
      badge: "Step 2", 
      color: "green",
    },
    {
      title: "Data Extraction",
      description: "We identify dates, descriptions, amounts, and balances from thousands of different bank formats.",
      icon: CheckCircle,
      badge: "Step 3",
      color: "purple",
    },
    {
      title: "Download Excel File",
      description: "Get your clean, organized Excel file with all transactions properly formatted and ready to use.",
      icon: Download,
      badge: "Step 4",
      color: "orange",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: { bg: 'bg-blue-50', icon: 'text-blue-600', badge: 'text-blue-600' },
      green: { bg: 'bg-green-50', icon: 'text-green-600', badge: 'text-green-600' },
      purple: { bg: 'bg-purple-50', icon: 'text-purple-600', badge: 'text-purple-600' },
      orange: { bg: 'bg-orange-50', icon: 'text-orange-600', badge: 'text-orange-600' },
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900 mb-6">
            How it works
          </h2>
          <p className="text-xl font-light text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Our streamlined process makes converting bank statements quick and effortless. 
            No technical knowledge required.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const colorClasses = getColorClasses(step.color);
            return (
              <div key={step.title} className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${colorClasses.bg} rounded-full mb-6`}>
                  <step.icon className={`w-8 h-8 ${colorClasses.icon}`} />
                </div>
                <div className={`text-sm font-semibold ${colorClasses.badge} mb-3`}>{step.badge}</div>
                <h3 className="font-semibold mb-4 text-xl text-gray-900">{step.title}</h3>
                <p className="text-gray-700 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
        
        {/* Process Flow Connector */}
        <div className="hidden lg:flex justify-center mt-12">
          <div className="flex items-center space-x-4 text-gray-400">
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="text-sm font-light">Simple • Fast • Accurate</div>
            <div className="w-8 h-px bg-gray-300"></div>
          </div>
        </div>
      </div>
    </section>
  );
}


