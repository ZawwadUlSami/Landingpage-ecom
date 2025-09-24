'use client'

import { useState, useEffect } from 'react'
import { FileText, Download, Clock, CheckCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface ConversionStats {
  totalConversions: number
  successfulConversions: number
  totalTransactions: number
  averageProcessingTime: number
  successRate: number
  lastConversionDate?: string
}

interface Conversion {
  id: string
  fileName: string
  fileSize: number
  status: string
  transactionCount: number
  createdAt: string
  processingTime?: number
}

export default function ConversionStats() {
  const [stats, setStats] = useState<ConversionStats>({
    totalConversions: 0,
    successfulConversions: 0,
    totalTransactions: 0,
    averageProcessingTime: 0,
    successRate: 0
  })
  const [conversions, setConversions] = useState<Conversion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { firebaseUser } = useAuth()

  useEffect(() => {
    const loadStats = async () => {
      if (!firebaseUser) {
        setIsLoading(false)
        return
      }

      try {
        const idToken = await firebaseUser.getIdToken()
        const response = await fetch('/api/conversions', {
          headers: {
            'Authorization': `Bearer ${idToken}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setStats(data.stats)
          setConversions(data.conversions)
        } else {
          const errorText = await response.text()
          console.error('Failed to fetch conversion stats:', response.status, errorText)
          // Set default empty stats
          setStats({
            totalConversions: 0,
            successfulConversions: 0,
            totalTransactions: 0,
            averageProcessingTime: 0,
            successRate: 0
          })
        }
      } catch (error) {
        console.error('Failed to load stats:', error)
        setStats({
          totalConversions: 0,
          successfulConversions: 0,
          totalTransactions: 0,
          averageProcessingTime: 0,
          successRate: 0
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [firebaseUser])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse shadow-lg">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Conversions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalConversions.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.successRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Download className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Processing Time</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageProcessingTime}s</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Conversions Table */}
      {conversions.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Conversions</h3>
            <p className="text-sm text-gray-600 mt-1">Your latest file conversions</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {conversions.slice(0, 10).map((conversion) => (
                  <tr key={conversion.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm font-medium text-gray-900">{conversion.fileName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(conversion.fileSize / 1024 / 1024).toFixed(2)} MB
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {conversion.transactionCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        conversion.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {conversion.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(conversion.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
