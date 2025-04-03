// services/googleAuthService.ts
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// Only using the drive.file scope which is less restrictive and doesn't require verification
const SCOPES = [
  'https://www.googleapis.com/auth/drive.file'  // For creating and managing files created by the app
];

// Initialize Google Auth Provider with drive.file scope
const googleProvider = new GoogleAuthProvider();
SCOPES.forEach(scope => googleProvider.addScope(scope));

interface TokenData {
  token: string;
  user: any;
  expiresAt: number;
}

/**
 * Request Google Drive permissions
 * @returns Promise with token data
 */
export const requestGooglePermissions = async () => {
  const provider = new GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/drive.file");

  const result = await signInWithPopup(auth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const token = credential?.accessToken;

  if (!token) throw new Error("No access token received");

  const tokenData = {
    token, // your app expects this key
    user: auth.currentUser?.uid || "unknown",
    expiresAt: Date.now() + 3600 * 1000, // set expiry to 1 hour
  };

  localStorage.setItem("google_token", JSON.stringify(tokenData));
  return tokenData;
};


/**
 * Check if we have a valid Google API token
 * @returns Whether we have a valid token
 */
export const hasValidGoogleToken = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const tokenDataStr = localStorage.getItem('googleTokenData');
  if (!tokenDataStr) return false;
  
  try {
    const tokenData = JSON.parse(tokenDataStr) as TokenData;
    const now = new Date().getTime();
    
    return !!(tokenData.token && tokenData.expiresAt && tokenData.expiresAt > now);
  } catch (e) {
    return false;
  }
};

/**
 * Save Google token data to localStorage
 * @param tokenData The token data to save
 */
export const saveGoogleTokenData = (tokenData: TokenData): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('googleTokenData', JSON.stringify(tokenData));
  }
};

/**
 * Get the saved Google access token
 * @returns The access token or null if not available
 */
export const getGoogleAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("google_token");
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return parsed.token || null;
  } catch {
    return null;
  }
};



/**
 * Clear any saved Google token data
 */
export const clearGoogleTokenData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('googleTokenData');
  }
};