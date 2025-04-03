// services/googleAuthService.ts
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const googleProvider = new GoogleAuthProvider();
SCOPES.forEach(scope => googleProvider.addScope(scope));

interface TokenData {
  token: string;
  user: string;
  expiresAt: number;
}

// ✅ 1. Request permissions and save token
export const requestGooglePermissions = async (): Promise<TokenData> => {
  const provider = new GoogleAuthProvider();
  SCOPES.forEach(scope => provider.addScope(scope));

  const result = await signInWithPopup(auth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const accessToken = credential?.accessToken;

  if (!accessToken) throw new Error("No access token received");

  const tokenData: TokenData = {
    token: accessToken,
    user: auth.currentUser?.uid || "unknown",
    expiresAt: Date.now() + 3600 * 1000, // expires in 1 hour
  };

  localStorage.setItem("googleTokenData", JSON.stringify(tokenData));
  return tokenData;
};

// ✅ 2. Retrieve token
export const getGoogleAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;

  const tokenStr = localStorage.getItem("googleTokenData");
  if (!tokenStr) return null;

  try {
    const parsed: TokenData = JSON.parse(tokenStr);
    return parsed.token || null;
  } catch (err) {
    console.error("Failed to parse token:", err);
    return null;
  }
};

// ✅ 3. Check token validity
export const hasValidGoogleToken = (): boolean => {
  if (typeof window === "undefined") return false;

  const tokenStr = localStorage.getItem("googleTokenData");
  if (!tokenStr) return false;

  try {
    const parsed: TokenData = JSON.parse(tokenStr);
    return !!(parsed.token && parsed.expiresAt && parsed.expiresAt > Date.now());
  } catch (err) {
    return false;
  }
};

// ✅ 4. Optional: clear token
export const clearGoogleTokenData = (): void => {
  localStorage.removeItem("googleTokenData");
};

// ✅ 5. Optional: Save token manually
export const saveGoogleTokenData = (tokenData: TokenData): void => {
  localStorage.setItem("googleTokenData", JSON.stringify(tokenData));
};
