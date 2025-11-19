import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Prefer Vite env vars; fallback to existing values if not provided
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDzqU0HkUu1D4pfa6-TYQp6zLrmZ9tGD4M',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'pet-care-a8832.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'pet-care-a8832',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'pet-care-a8832.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '975049661053',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:975049661053:web:374ca3937621848c08af14',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-QVD9J4R4QN',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Auth exports
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)

export default app