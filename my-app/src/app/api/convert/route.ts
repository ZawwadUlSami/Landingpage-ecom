import { NextRequest, NextResponse } from 'next/server'
import { TextractPDFProcessor } from '@/lib/textractPdfProcessor'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'
import { v4 as uuidv4 } from 'uuid'

// Dynamic import to prevent build-time errors
let verifyIdToken: any, getUserByUid: any, updateUserCredits: any, getFirestore: any

async function initializeFirebaseAdmin() {
  try {
    console.log('Attempting to initialize Firebase Admin...')
    
    // Check if environment variables are available
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
      console.error('Firebase environment variables not available')
      return false
    }
    
    const firebaseAdmin = await import('@/lib/firebase-admin')
    const firebaseFirestore = await import('firebase-admin/firestore')
    
    verifyIdToken = firebaseAdmin.verifyIdToken
    getUserByUid = firebaseAdmin.getUserByUid
    updateUserCredits = firebaseAdmin.updateUserCredits
    getFirestore = firebaseFirestore.getFirestore
    
    console.log('Firebase Admin initialized successfully')
    return true
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    // Initialize Firebase Admin dynamically
    const firebaseInitialized = await initializeFirebaseAdmin()
    
    if (!firebaseInitialized) {
      return NextResponse.json(
        { error: 'Firebase Admin not available' },
        { status: 503 }
      )
    }

    const idToken = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!idToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const decodedToken = await verifyIdToken(idToken)
    if (!decodedToken) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const user = await getUserByUid(decodedToken.uid)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user has credits
    if (user.credits <= 0) {
      return NextResponse.json(
        { error: 'Insufficient credits. Please upgrade your plan.' },
        { status: 402 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file (basic validation)
    if (!file.type.includes('pdf')) {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      )
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 50MB.' },
        { status: 400 }
      )
    }

    // Use system temp directory (works in serverless environments)
    const tempDir = tmpdir()

    // Save uploaded file
    const fileId = uuidv4()
    const pdfPath = join(tempDir, `${fileId}.pdf`)
    const excelPath = join(tempDir, `${fileId}.xlsx`)

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(pdfPath, buffer)

    // Process PDF with Textract
    console.log('Starting Textract PDF processing...')
    const processingStartTime = Date.now()
    const processor = new TextractPDFProcessor()
    const excelBuffer = await processor.processPDF(pdfPath, excelPath)
    const processingEndTime = Date.now()
    const processingTime = processingEndTime - processingStartTime
    console.log('Textract processing completed in', processingTime, 'ms')

    // Deduct credit from user
    await updateUserCredits(user.id, user.credits - 1)

      // Store conversion history in Firestore
      const db = getFirestore()
      const conversionData = {
        userId: user.id,
        fileName: file.name,
        fileSize: file.size,
        originalFileName: file.name,
        convertedFileName: file.name.replace('.pdf', '.xlsx'),
        status: 'completed',
        transactionCount: 0, // Will be updated when we add transaction counting
        processingTime: processingTime,
        createdAt: new Date(),
        updatedAt: new Date(),
        fileId: fileId,
      }

      try {
        await db.collection('conversions').add(conversionData)
        console.log('Conversion history saved successfully')
      } catch (historyError) {
        console.error('Failed to save conversion history:', historyError)
        // Don't fail the conversion if history saving fails
      }

    // Return Excel file directly from buffer
    return new NextResponse(excelBuffer as BodyInit, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${file.name.replace('.pdf', '.xlsx')}"`,
      },
    })
  } catch (error) {
    console.error('Conversion error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Internal server error'

    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}