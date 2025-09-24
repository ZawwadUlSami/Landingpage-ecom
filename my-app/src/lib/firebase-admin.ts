import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

// Check if all required environment variables are present
console.log('Checking Firebase Admin environment variables:')
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? 'Present' : 'MISSING')
console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? 'Present' : 'MISSING')
console.log('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? 'Present (length: ' + process.env.FIREBASE_PRIVATE_KEY.length + ')' : 'MISSING')

if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
  console.error('Missing Firebase Admin environment variables')
  console.error('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID || 'MISSING')
  console.error('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL || 'MISSING')
  console.error('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? 'Present' : 'MISSING')
  throw new Error('Missing Firebase Admin environment variables')
}

const firebaseAdminConfig: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
}

// Initialize Firebase Admin
const app = getApps().length === 0 
  ? initializeApp({
      credential: cert(firebaseAdminConfig),
      projectId: process.env.FIREBASE_PROJECT_ID,
    })
  : getApps()[0]

export const adminAuth = getAuth(app)
export const adminDb = getFirestore(app)

// Verify Firebase ID token
export async function verifyIdToken(idToken: string) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    return decodedToken
  } catch (error) {
    console.error('Error verifying ID token:', error)
    return null
  }
}

// Get user by UID
export async function getUserByUid(uid: string) {
  try {
    const userDoc = await adminDb.collection('users').doc(uid).get()
    
    if (userDoc.exists) {
      const userData = userDoc.data()
      return {
        id: uid,
        email: userData?.email,
        name: userData?.name,
        credits: userData?.credits || 0,
        plan: userData?.plan || 'FREE',
        createdAt: userData?.createdAt?.toDate(),
        updatedAt: userData?.updatedAt?.toDate(),
      }
    }
    
    return null
  } catch (error) {
    console.error('Error getting user by UID:', error)
    return null
  }
}

// Update user credits
export async function updateUserCredits(uid: string, newCredits: number) {
  try {
    await adminDb.collection('users').doc(uid).update({
      credits: newCredits,
      updatedAt: new Date(),
    })
    return true
  } catch (error) {
    console.error('Error updating user credits:', error)
    return false
  }
}

export default app
