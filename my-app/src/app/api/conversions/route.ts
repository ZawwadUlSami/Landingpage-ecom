import { NextRequest, NextResponse } from 'next/server'
import { verifyIdToken, getUserByUid } from '@/lib/firebase-admin'
import { getFirestore } from 'firebase-admin/firestore'

export async function GET(request: NextRequest) {
  try {
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
    
    const conversions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
    })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Calculate statistics
    const totalConversions = conversions.length
    const successfulConversions = conversions.filter(c => c.status === 'completed').length
    const totalTransactions = conversions.reduce((sum, c) => sum + (c.transactionCount || 0), 0)
    const averageProcessingTime = conversions.length > 0 
      ? conversions.reduce((sum, c) => sum + (c.processingTime || 0), 0) / conversions.length / 1000
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
