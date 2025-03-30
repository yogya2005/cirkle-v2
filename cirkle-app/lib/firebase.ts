// lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Debug - log partial API key to ensure it's loaded (remove in production)
if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  const apiKeyPreview = process.env.NEXT_PUBLIC_FIREBASE_API_KEY.substring(0, 5) + '...';
  console.log(`Firebase config loaded with API key: ${apiKeyPreview}`);
} else {
  console.warn('Firebase API key not found in environment variables');
}

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google Auth provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { app, auth, db, storage, googleProvider };