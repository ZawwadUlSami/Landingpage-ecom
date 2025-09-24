import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
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
