// lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBD2wZR7yaELlkfca9D-a746nkacRgXAoc",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "cirkle-376bf.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "cirkle-376bf",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "cirkle-376bf.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1046629939214",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1046629939214:web:b7540671448a709824245f"
};

// Initialize Firebase - ensure it's only initialized once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Get Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

console.log("Firebase initialized successfully with app:", app.name);

export { app, auth, db };