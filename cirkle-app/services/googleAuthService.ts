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
export const requestGooglePermissions = async (): Promise<TokenData> => {
  try {
    // Force account selection to get a fresh token with the right scope
    googleProvider.setCustomParameters({
      prompt: 'consent'
    });
    
    // Sign in with popup to get Google Auth result with token
    const result = await signInWithPopup(auth, googleProvider);
    
    // Get the OAuth access token
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential) {
      throw new Error('No credential returned from Google Auth');
    }
    
    const token = credential.accessToken;
    if (!token) {
      throw new Error('No token returned from Google Auth');
    }
    
    // Return relevant auth data
    return {
      user: result.user,
      token,
      expiresAt: new Date().getTime() + 3600 * 1000, // Token expires in 1 hour
    };
  } catch (error) {
    console.error('Error requesting Google permissions:', error);
    throw error;
  }
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
  if (!hasValidGoogleToken() || typeof window === 'undefined') {
    return null;
  }
  
  const tokenDataStr = localStorage.getItem('googleTokenData');
  if (!tokenDataStr) return null;
  
  try {
    const tokenData = JSON.parse(tokenDataStr) as TokenData;
    return tokenData.token;
  } catch (e) {
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