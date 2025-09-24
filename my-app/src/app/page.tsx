'use client'

import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Pricing from "./components/Pricing";
import FAQ from "./components/FAQ";
import SiteFooter from "./components/SiteFooter";

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-gray-50">
      <NavBar />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <FAQ />
      
      {/* About Section - Apple Style */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900 mb-6">
            Trusted by professionals
          </h2>
          <p className="text-xl font-light text-gray-700 leading-relaxed">
            Bank Statement Converter is built by a team with years of experience in banking and financial technology. 
            We understand the challenges of manual data entry and have created a solution that saves time while 
            maintaining the highest standards of accuracy and security.
          </p>
        </div>
      </section>

      {/* Contact Section - Apple Style */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900 mb-6">
              Get in touch
            </h2>
            <p className="text-xl font-light text-gray-700 max-w-2xl mx-auto">
              Have questions about converting your bank statements? We'd love to help you get started.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-gray-100 transition-all duration-300 group">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Support</h3>
              <p className="text-gray-700 text-sm">Get help with conversions</p>
              <a href="mailto:support@bankstatementconverter.com" className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                support@bankstatementconverter.com
              </a>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-gray-100 transition-all duration-300 group">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sales</h3>
              <p className="text-gray-700 text-sm">Upgrade your plan</p>
              <a href="mailto:sales@bankstatementconverter.com" className="text-green-600 text-sm font-medium hover:text-green-700 transition-colors">
                sales@bankstatementconverter.com
              </a>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-gray-100 transition-all duration-300 group">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 6V9a2 2 0 00-2-2H10a2 2 0 00-2 2v3.1M16 19v-3a2 2 0 00-2-2h-4a2 2 0 00-2 2v3a2 2 0 002 2h4a2 2 0 002-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Partnerships</h3>
              <p className="text-gray-700 text-sm">Business integrations</p>
              <a href="mailto:partners@bankstatementconverter.com" className="text-purple-600 text-sm font-medium hover:text-purple-700 transition-colors">
                partners@bankstatementconverter.com
              </a>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-gray-100 transition-all duration-300 group">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Company</h3>
              <p className="text-gray-700 text-sm">About our mission</p>
              <p className="text-orange-600 text-sm font-medium">
                Bank Statement Converter Ltd.
              </p>
            </div>
          </div>

          {/* Additional Contact Info */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center space-x-6 text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Response within 24 hours</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Available worldwide</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Expert support team</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
