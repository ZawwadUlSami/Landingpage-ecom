'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from './AuthModal'
import FileUpload from './FileUpload'

export default function Hero() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const { user } = useAuth()

  const handleGetStarted = () => {
    if (user) {
      window.location.href = '/dashboard'
    } else {
      setAuthMode('register')
      setIsAuthModalOpen(true)
    }
  }

  return (
    <>
      <section className="relative w-full min-h-screen bg-gray-50">
        {/* Premium Apple-style Hero */}
        <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
          
          {/* Main Headline - Apple Style */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-light tracking-tight text-gray-900 leading-[1.05] mb-6">
              Convert bank statements
              <br />
              <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                to Excel instantly
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl font-light text-gray-700 max-w-3xl mx-auto leading-relaxed">
              The world's most trusted bank statement converter. Transform PDF statements from any bank into perfect Excel format in seconds.
            </p>

            {/* Trust indicators - Apple style */}
            <div className="flex items-center justify-center gap-8 mt-12 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>1000+ banks supported</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>99.9% accuracy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Bank-grade security</span>
              </div>
            </div>
          </div>

          {/* Converter Section - Prominent and Clean */}
          <div className="mb-20">
            <FileUpload />
          </div>

          {/* CTA Section - Apple Style */}
              {!user && (
            <div className="text-center">
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-full hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get started free
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <p className="mt-4 text-sm text-gray-600">
                No credit card required • 15 free conversions • Start in seconds
              </p>
            </div>
          )}
        </div>

        {/* Premium Features Grid - Apple Style */}
        <div className="bg-gray-50 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              
              {/* Feature 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Lightning Fast</h3>
                <p className="text-gray-600 leading-relaxed">
                  Convert your bank statements in seconds, not hours. Our advanced AI processes documents instantly.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Perfect Accuracy</h3>
                <p className="text-gray-600 leading-relaxed">
                  99.9% accuracy guaranteed. Every transaction captured with precision for accounting perfection.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Bank-Grade Security</h3>
                <p className="text-gray-600 leading-relaxed">
                  Your financial data is protected with enterprise-level encryption and security protocols.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof - Apple Style */}
        <div className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-sm text-gray-600 mb-8">Trusted by financial professionals worldwide</p>
            <div className="flex items-center justify-center gap-12">
              <span className="text-2xl font-light text-gray-400">Goldman Sachs</span>
              <span className="text-2xl font-light text-gray-400">JP Morgan</span>
              <span className="text-2xl font-light text-gray-400">Deloitte</span>
              <span className="text-2xl font-light text-gray-400">KPMG</span>
              <span className="text-2xl font-light text-gray-400">PwC</span>
            </div>
          </div>
        </div>
      </section>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
}