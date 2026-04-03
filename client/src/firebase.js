import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import { getAuth, signInAnonymously } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyD6jc8bia7RNAdAVUbbbkrYhfKd9usCZRg',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'finance-dashboard-cc996.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'finance-dashboard-cc996',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'finance-dashboard-cc996.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '247466466348',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:247466466348:web:67e25941c3f8933e668589',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-ZP6WB50YQK',
}

export const firebaseApp = initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp)

let authPromise = null

async function tryAnonymousSignIn() {
  if (auth.currentUser) {
    return auth.currentUser
  }

  if (!authPromise) {
    authPromise = signInAnonymously(auth)
      .then((result) => result.user)
      .catch((error) => {
        console.warn('Anonymous Firebase auth is unavailable. Falling back to unauthenticated mode.', error)
        return null
      })
      .finally(() => {
        authPromise = null
      })
  }

  return authPromise
}

export async function getAuthToken() {
  // Standalone mode: Return a placeholder token to bypass backend auth entirely
  return 'standalone-token'
}

export const setupAnalytics = async () => {
  const supported = await isSupported()

  if (!supported || !firebaseConfig.measurementId) {
    return null
  }

  return getAnalytics(firebaseApp)
}
