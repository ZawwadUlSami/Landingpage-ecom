'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, Download, AlertCircle, CheckCircle2, CreditCard, Sparkles } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

interface FileUploadProps {
  onConversionComplete?: () => void
}

export default function FileUpload({ onConversionComplete }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [processingStep, setProcessingStep] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)
  const { user, updateUserCredits, firebaseUser } = useAuth()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setUploadedFile(file)
      setUploadProgress(0)
      setProcessingStep('')
      setIsCompleted(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const handleConvert = async () => {
    if (!uploadedFile) {
      toast.error('Please upload a file first')
      return
    }

    // Check if user is logged in and has credits
    if (user && (user.credits ?? 0) <= 0) {
      toast.error('Insufficient credits. Please upgrade your plan.')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setProcessingStep('Preparing file...')
    setIsCompleted(false)

    try {
      const formData = new FormData()
      formData.append('file', uploadedFile)

      setProcessingStep('Uploading file...')
      setUploadProgress(25)

      // Use anonymous API if no user, otherwise use authenticated API
      const endpoint = user ? '/api/convert' : '/api/convert-anonymous'
      const headers: HeadersInit = {}
      
      if (user && firebaseUser) {
        // Get Firebase ID token
        const idToken = await firebaseUser.getIdToken()
        headers['Authorization'] = `Bearer ${idToken}`
      }

      setProcessingStep('Processing PDF...')
      setUploadProgress(50)

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: formData,
      })

      setProcessingStep('Generating Excel file...')
      setUploadProgress(75)

      if (response.ok) {
        // Get the filename from the response headers or use a default
        const contentDisposition = response.headers.get('content-disposition')
        const filename = contentDisposition
          ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
          : uploadedFile.name.replace('.pdf', '.xlsx')

        // Create blob and download
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        setProcessingStep('Download complete!')
        setUploadProgress(100)
        setIsCompleted(true)
        toast.success('File converted successfully!')
        
        // Update user credits if logged in
        if (user) {
          await updateUserCredits(user.credits - 1)
        }
        
        onConversionComplete?.()
        
        // Reset after a delay
        setTimeout(() => {
          setUploadProgress(0)
          setProcessingStep('')
          setIsCompleted(false)
          setUploadedFile(null)
        }, 3000)
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Conversion failed')
        setProcessingStep('')
        setUploadProgress(0)
        setIsCompleted(false)
      }
    } catch (error) {
      console.error('Conversion error:', error)
      toast.error('Network error. Please try again.')
      setProcessingStep('')
      setUploadProgress(0)
      setIsCompleted(false)
    } finally {
      setIsUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Premium Apple-style Container */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        
        {/* File Upload Area - Apple Style */}
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all duration-300 group m-8
            ${isDragActive
              ? 'border-blue-400 bg-blue-50 scale-[0.98]'
              : uploadedFile
              ? 'border-green-400 bg-green-50'
              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
        >
          <input {...getInputProps()} />
          
          {uploadedFile ? (
            <div className="text-green-600 flex flex-col items-center">
              <CheckCircle2 className="h-16 w-16 mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">File ready for conversion</h3>
              <p className="text-lg text-gray-600">Click "Convert to Excel" below to process your file</p>
            </div>
          ) : isDragActive ? (
            <div className="text-blue-600 flex flex-col items-center">
              <Upload className="h-16 w-16 mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Drop your PDF here</h3>
              <p className="text-lg text-gray-600">Release to upload your bank statement</p>
            </div>
          ) : (
            <div className="text-gray-700 flex flex-col items-center">
              <Upload className="h-16 w-16 mb-6 group-hover:text-blue-500 transition-colors duration-300" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Drag and drop your bank statement
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                or <span className="text-blue-600 font-medium group-hover:underline">click to browse</span> from your computer
              </p>
              
              {/* Requirements - Apple style */}
              <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>PDF format</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Max 10MB</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>All banks</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* File Info - Apple Style */}
        {uploadedFile && (
          <div className="mx-8 mb-6 p-6 bg-gray-50 rounded-2xl">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <File className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-lg">{uploadedFile.name}</p>
                <p className="text-gray-600">{formatFileSize(uploadedFile.size)}</p>
              </div>
            </div>
          </div>
        )}

        {/* User Credits Info - Apple Style */}
        {user && (
          <div className="mx-8 mb-6 p-6 bg-blue-50 rounded-2xl">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {user.credits} credits remaining
                </p>
                <p className="text-gray-600 text-sm">
                  Each conversion uses 1 credit • Get 15 free when you sign up
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar - Apple Style */}
        {isUploading && (
          <div className="mx-8 mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-3">
              <span className="font-medium">{processingStep}</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Convert Button - Apple Style */}
        <div className="p-8 pt-0">
          <button
            onClick={handleConvert}
            disabled={!uploadedFile || isUploading || Boolean(user && (user?.credits ?? 0) <= 0)}
            className="group relative w-full bg-blue-600 text-white py-5 px-8 rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl hover:bg-blue-700 transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:scale-100"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>Converting your file...</span>
              </>
            ) : isCompleted ? (
              <>
                <CheckCircle2 className="h-6 w-6 text-green-300" />
                <span>Conversion complete!</span>
              </>
            ) : (
              <>
                <Download className="h-6 w-6" />
                <span>Convert to Excel</span>
              </>
            )}
          </button>
        </div>

        {/* Warnings - Apple Style */}
        {user && (user.credits ?? 0) <= 0 && (
          <div className="mx-8 mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-800">Out of credits</h4>
                <p className="text-red-700 text-sm mt-1">
                  You've used all your credits. Upgrade your plan to continue converting files.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Demo Info - Apple Style */}
        {!user && (
          <div className="mx-8 mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-800">Free demo mode</h4>
                <p className="text-green-700 text-sm mt-1">
                  You're using our free demo. <span className="font-medium">Register to get 15 free conversions</span> and track your conversion history.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}