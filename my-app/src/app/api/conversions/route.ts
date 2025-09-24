import { NextRequest, NextResponse } from 'next/server'

// Dynamic import to prevent build-time errors
let verifyIdToken: any, getUserByUid: any, getFirestore: any

async function initializeFirebaseAdmin() {
  try {
    console.log('Attempting to initialize Firebase Admin for conversions...')
    
    // Check if environment variables are available
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
      console.error('Firebase environment variables not available')
      return false
    }
    
    const firebaseAdmin = await import('@/lib/firebase-admin')
    const firebaseFirestore = await import('firebase-admin/firestore')
    
    verifyIdToken = firebaseAdmin.verifyIdToken
    getUserByUid = firebaseAdmin.getUserByUid
    getFirestore = firebaseFirestore.getFirestore
    
    console.log('Firebase Admin initialized successfully for conversions')
    return true
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error)
    return false
  }
}

export async function GET(request: NextRequest) {
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

    const db = getFirestore()
    
    // Get user's conversion history
    const conversionsRef = db.collection('conversions')
    const query = conversionsRef
      .where('userId', '==', user.id)
      .limit(50) // Limit to last 50 conversions

    const snapshot = await query.get()
    
    const conversions = snapshot.docs.map((doc: any) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      } as any
    }).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Calculate statistics
    const totalConversions = conversions.length
    const successfulConversions = conversions.filter((c: any) => c.status === 'completed').length
    const totalTransactions = conversions.reduce((sum: number, c: any) => sum + (c.transactionCount || 0), 0)
    const averageProcessingTime = conversions.length > 0 
      ? conversions.reduce((sum: number, c: any) => sum + (c.processingTime || 0), 0) / conversions.length / 1000
      : 0

    return NextResponse.json({
      conversions,
      stats: {
        totalConversions,
        successfulConversions,
        totalTransactions,
        averageProcessingTime: Math.round(averageProcessingTime * 100) / 100,
        successRate: totalConversions > 0 ? Math.round((successfulConversions / totalConversions) * 100) : 0,
        lastConversionDate: conversions.length > 0 ? conversions[0].createdAt : null
      }
    })

  } catch (error) {
    console.error('Error fetching conversions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversions' },
      { status: 500 }
    )
  }
}
