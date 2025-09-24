'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from './AuthModal'

interface Plan {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  popular?: boolean;
}

export default function Pricing() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register')
  const { user } = useAuth()

  const plans: Plan[] = [
    {
      name: "Demo",
      price: "Free",
      description: "Try our converter with no commitment",
      features: [
        "1 conversion every 24 hours",
        "No registration required",
        "Basic PDF to Excel conversion",
        "Works with all major banks",
        "Instant download"
      ],
      cta: "Try now",
    },
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for personal use",
      features: [
        "15 free conversions",
        "Free account registration",
        "All bank formats supported",
        "Conversion history tracking",
        "Email support",
        "99.9% accuracy guarantee"
      ],
      cta: "Get started free",
      highlighted: true,
      popular: true,
    },
    {
      name: "Professional",
      price: "Custom",
      description: "For businesses and accounting firms",
      features: [
        "Unlimited conversions",
        "Priority processing",
        "Bulk file processing",
        "API access",
        "Dedicated support",
        "Custom integrations",
        "Advanced analytics",
        "White-label solution"
      ],
      cta: "Contact sales",
    },
  ];

  const handlePlanClick = (planName: string) => {
    if (planName === 'Demo') {
      // Scroll to converter
      const converter = document.querySelector('[data-testid="file-upload"]') || document.querySelector('section')
      converter?.scrollIntoView({ behavior: 'smooth' })
    } else if (planName === 'Starter') {
      if (user) {
        window.location.href = '/dashboard'
      } else {
        setAuthMode('register')
        setIsAuthModalOpen(true)
      }
    } else {
      // For Professional plan, redirect to contact
      window.location.href = '/contact'
    }
  }

  return (
    <>
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Header - Apple Style */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900 mb-6">
              Choose your plan
            </h2>
            <p className="text-xl font-light text-gray-700 max-w-3xl mx-auto">
              Start with our free demo, upgrade to get more conversions, or contact us for enterprise solutions.
            </p>
          </div>

          {/* Plans Grid - Apple Style */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-3xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                  plan.highlighted 
                    ? 'border-blue-200 shadow-xl ring-1 ring-blue-100' 
                    : 'border-gray-200 shadow-lg hover:border-gray-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-light text-gray-900">{plan.price}</span>
                      {plan.price !== 'Free' && plan.price !== 'Custom' && (
                        <span className="text-gray-500 ml-1">/month</span>
                      )}
                    </div>
                    <p className="text-gray-700">{plan.description}</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handlePlanClick(plan.name)}
                    className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-200 ${
                      plan.highlighted
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                        : 'bg-gray-50 text-gray-900 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Message - Apple Style */}
          <div className="text-center mt-16">
            <p className="text-gray-600">
              All plans include bank-grade security and 99.9% accuracy guarantee
            </p>
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