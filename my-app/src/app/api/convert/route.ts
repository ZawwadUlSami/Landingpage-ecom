import { NextRequest, NextResponse } from 'next/server'
import { PDFProcessor } from '@/lib/pdfProcessor'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

// Dynamic import to prevent build-time errors
let verifyIdToken: any, getUserByUid: any, updateUserCredits: any, getFirestore: any

async function initializeFirebaseAdmin() {
  try {
    const firebaseAdmin = await import('@/lib/firebase-admin')
    const firebaseFirestore = await import('firebase-admin/firestore')
    
    verifyIdToken = firebaseAdmin.verifyIdToken
    getUserByUid = firebaseAdmin.getUserByUid
    updateUserCredits = firebaseAdmin.updateUserCredits
    getFirestore = firebaseFirestore.getFirestore
    
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

    // Validate file
    const validation = PDFProcessor.validatePDF({
      fieldname: 'file',
      originalname: file.name,
      encoding: '7bit',
      mimetype: file.type,
      size: file.size,
      buffer: Buffer.from(await file.arrayBuffer()),
    } as any)

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    // Save uploaded file
    const fileId = uuidv4()
    const pdfPath = join(uploadsDir, `${fileId}.pdf`)
    const excelPath = join(uploadsDir, `${fileId}.xlsx`)

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(pdfPath, buffer)

    // Process PDF
    console.log('Starting PDF processing...')
    const processingStartTime = Date.now()
    const result = await PDFProcessor.processPDF(pdfPath, excelPath)
    const processingEndTime = Date.now()
    const processingTime = processingEndTime - processingStartTime
    console.log('PDF processing result:', result)

    if (result.success && result.excelBuffer) {
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
        transactionCount: result.transactions?.length || 0,
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
      return new NextResponse(result.excelBuffer as BodyInit, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${file.name.replace('.pdf', '.xlsx')}"`,
        },
      })
    } else {
      return NextResponse.json(
        { error: result.error || 'Conversion failed' },
        { status: 500 }
      )
    }
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