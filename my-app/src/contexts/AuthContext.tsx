'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import toast from 'react-hot-toast'

export interface User {
  id: string
  email: string
  name?: string
  credits: number
  plan: string
  createdAt?: Date
  updatedAt?: Date
}

interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name?: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateUserCredits: (newCredits: number) => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch user data from Firestore
  const fetchUserData = async (firebaseUser: FirebaseUser): Promise<User | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      
      if (userDoc.exists()) {
        const userData = userDoc.data()
        return {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          name: userData.name || firebaseUser.displayName || undefined,
          credits: userData.credits || 0,
          plan: userData.plan || 'FREE',
          createdAt: userData.createdAt?.toDate(),
          updatedAt: userData.updatedAt?.toDate(),
        }
      } else {
        // Create user document if it doesn't exist
        const newUser: Omit<User, 'id'> = {
          email: firebaseUser.email!,
          name: firebaseUser.displayName || undefined,
          credits: 15, // Free users get 15 credits
          plan: 'FREE',
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        await setDoc(doc(db, 'users', firebaseUser.uid), {
          ...newUser,
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        return {
          id: firebaseUser.uid,
          ...newUser,
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      return null
    }
  }

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      await signInWithEmailAndPassword(auth, email, password)
      toast.success('Successfully signed in!')
    } catch (error: any) {
      console.error('Sign in error:', error)
      toast.error(error.message || 'Failed to sign in')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Sign up with email and password
  const signUp = async (email: string, password: string, name?: string) => {
    try {
      setLoading(true)
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update display name if provided
      if (name) {
        await updateProfile(firebaseUser, { displayName: name })
      }

      // Create user document in Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        email: firebaseUser.email,
        name: name || null,
        credits: 15, // Free users get 15 credits
        plan: 'FREE',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      toast.success('Account created successfully!')
    } catch (error: any) {
      console.error('Sign up error:', error)
      toast.error(error.message || 'Failed to create account')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      console.log('Starting Google sign-in...')
      const provider = new GoogleAuthProvider()
      
      // Add custom parameters to avoid COOP issues
      provider.setCustomParameters({
        prompt: 'select_account'
      })

      try {
        console.log('Provider created, attempting popup...')
        const { user: firebaseUser } = await signInWithPopup(auth, provider)
        console.log('Google sign-in successful:', firebaseUser?.email)

        // Check if user document exists, create if not
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        
        if (!userDoc.exists()) {
          // Create user document for new Google user
          await setDoc(doc(db, 'users', firebaseUser.uid), {
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            credits: 15, // Free users get 15 credits
            plan: 'FREE',
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        }

        toast.success('Successfully signed in with Google!')
      } catch (popupError: any) {
        console.log('Popup failed, trying redirect method...', popupError)
        
        // If popup fails due to COOP or other issues, use redirect
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.code === 'auth/popup-closed-by-user' ||
            popupError.message?.includes('Cross-Origin-Opener-Policy')) {
          
          console.log('Using redirect method due to popup restrictions')
          await signInWithRedirect(auth, provider)
          // Note: The redirect will handle the rest, including user creation
          return
        }
        
        // Re-throw other errors
        throw popupError
      }
    } catch (error: any) {
      console.error('Google sign in error:', error)
      toast.error(error.message || 'Failed to sign in with Google')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      setFirebaseUser(null)
      toast.success('Successfully signed out!')
    } catch (error: any) {
      console.error('Sign out error:', error)
      toast.error(error.message || 'Failed to sign out')
      throw error
    }
  }

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
      toast.success('Password reset email sent!')
    } catch (error: any) {
      console.error('Password reset error:', error)
      toast.error(error.message || 'Failed to send password reset email')
      throw error
    }
  }

  // Update user credits
  const updateUserCredits = async (newCredits: number) => {
    if (!firebaseUser || !user) return

    try {
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        credits: newCredits,
        updatedAt: new Date(),
      })

      setUser(prev => prev ? { ...prev, credits: newCredits } : null)
    } catch (error) {
      console.error('Error updating user credits:', error)
      throw error
    }
  }

  // Refresh user data
  const refreshUser = async () => {
    if (!firebaseUser) return

    try {
      const userData = await fetchUserData(firebaseUser)
      setUser(userData)
    } catch (error) {
      console.error('Error refreshing user data:', error)
    }
  }

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setFirebaseUser(firebaseUser)
        const userData = await fetchUserData(firebaseUser)
        setUser(userData)
      } else {
        setFirebaseUser(null)
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Handle redirect result from Google sign-in
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth)
        if (result?.user) {
          console.log('Google sign-in redirect successful:', result.user.email)
          
          // Check if user document exists, create if not
          const userDoc = await getDoc(doc(db, 'users', result.user.uid))
          
          if (!userDoc.exists()) {
            // Create user document for new Google user
            await setDoc(doc(db, 'users', result.user.uid), {
              email: result.user.email,
              name: result.user.displayName,
              credits: 15, // Free users get 15 credits
              plan: 'FREE',
              createdAt: new Date(),
              updatedAt: new Date(),
            })
          }
          
          toast.success('Successfully signed in with Google!')
        }
      } catch (error: any) {
        console.error('Redirect result error:', error)
        if (error.message && !error.message.includes('No redirect operation')) {
          toast.error('Google sign-in failed. Please try again.')
        }
      }
    }

    handleRedirectResult()
  }, [])

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    resetPassword,
    updateUserCredits,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
