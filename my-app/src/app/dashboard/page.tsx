'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import FileUpload from '../components/FileUpload'
import ConversionStats from '../components/ConversionStats'
import LoadingSpinner from '../components/LoadingSpinner'
import { User, FileText, CreditCard, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect to home if not authenticated
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <LoadingSpinner
        fullScreen={true} 
        size="lg" 
        text="Loading your dashboard..." 
      />
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-4">
            <a href="/" className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center hover:scale-105 transition-transform duration-200">
              <FileText className="h-6 w-6 text-white" />
            </a>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-base text-gray-600">Welcome back, <span className="font-semibold">{user.name || user.email}</span> 👋</p>
            </div>
          </div>
            <div className="flex items-center space-x-4">
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                ← Back to Home
              </a>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-6 py-3 border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-md"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Current Plan</p>
                <p className="text-2xl font-bold text-gray-900 capitalize flex items-center gap-2">
                  {user.plan}
                  {user.plan === 'FREE' && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span>}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Credits Available</p>
                <p className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  {user.credits}
                  {user.credits > 0 ? 
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Ready</span> :
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Empty</span>
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Conversions</p>
                <p className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  0
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">All Time</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Conversion Statistics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Conversion Statistics</h2>
          <ConversionStats />
        </div>

        {/* File Upload Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Convert Bank Statement</h2>
          <FileUpload />
        </div>

        {/* Recent Conversions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Conversions</h3>
          </div>
          <div className="p-6">
            <div className="text-center text-gray-500">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p>No conversions yet. Upload your first bank statement to get started!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
