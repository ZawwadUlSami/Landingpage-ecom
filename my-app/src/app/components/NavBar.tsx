'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from './AuthModal'

export default function NavBar() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const { user, logout } = useAuth()

  const handleGetStarted = () => {
    if (user) {
      window.location.href = '/dashboard'
    } else {
      setAuthMode('register')
      setIsAuthModalOpen(true)
    }
  }

  const handleLogin = () => {
    setAuthMode('login')
    setIsAuthModalOpen(true)
  }

  return (
    <>
      {/* Premium Apple-style Navigation */}
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo - Apple Style */}
          <a href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-semibold text-xl text-gray-900">
              Bank Statement Converter
            </span>
          </a>

          {/* Desktop Navigation - Apple Style */}
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-gray-700 hover:text-gray-900 transition-colors font-medium" href="#features">Features</a>
            <a className="text-gray-700 hover:text-gray-900 transition-colors font-medium" href="#pricing">Pricing</a>
            <a className="text-gray-700 hover:text-gray-900 transition-colors font-medium" href="#about">About</a>
            <a className="text-gray-700 hover:text-gray-900 transition-colors font-medium" href="#contact">Contact</a>
          </nav>

          {/* Auth Buttons - Apple Style */}
          <div className="flex items-center gap-4">
                {user ? (
              <>
                <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-full">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      {(user?.name || user?.email)?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name || user?.email?.split('@')[0]}
                  </span>
                </div>
                <a
                  href="/dashboard"
                  className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Dashboard
                </a>
                <button
                  onClick={logout}
                  className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="px-5 py-2.5 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Sign in
                </button>
                <button
                  onClick={handleGetStarted}
                  className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Get started
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
}