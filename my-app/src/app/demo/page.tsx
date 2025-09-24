'use client'

import FileUpload from '../components/FileUpload'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Bank Statement Converter - Demo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Demo Mode</span>
              <Link
                href="/"
                className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
              >
                Register for Full Access
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">Demo Mode</h2>
          <p className="text-blue-800">
            You're currently in demo mode. You can upload and convert PDF bank statements, 
            but your conversions won't be saved. Register for free to get 5 conversions per day 
            and access to your conversion history.
          </p>
        </div>

        {/* File Upload Section */}
        <div className="mb-8">
          <FileUpload />
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg mb-3">Secure Processing</h3>
            <p className="text-gray-600 text-sm">
              Your files are processed securely and deleted after conversion. 
              We never store your financial data.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg mb-3">High Accuracy</h3>
            <p className="text-gray-600 text-sm">
              Our algorithms are trained on thousands of bank statement formats 
              to ensure accurate data extraction.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg mb-3">Instant Results</h3>
            <p className="text-gray-600 text-sm">
              Get your Excel file in seconds. No waiting, no delays. 
              Perfect for urgent financial analysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
