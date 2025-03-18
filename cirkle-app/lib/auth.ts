// lib/auth.ts
import { 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut, 
    User,
    UserCredential 
  } from 'firebase/auth';
  import { auth } from './firebase';
  
  // Initialize Google Auth Provider
  const googleProvider = new GoogleAuthProvider();
  
  /**
   * Sign in with Google
   * @returns Promise with UserCredential
   */
  export const signInWithGoogle = async (): Promise<UserCredential> => {
    try {
      // Always force select account to ensure user picks a Google account every time
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      });
      
      return await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };
  
  /**
   * Sign out the current user
   */
  export const signOutUser = async (): Promise<void> => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };
  
  /**
   * Get the current user
   * @returns The current user or null if not signed in
   */
  export const getCurrentUser = (): User | null => {
    return auth.currentUser;
  };
  
  // The line below would persist the auth state but we're commenting it out
  // for development purposes to force login each time
  // export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  //   return auth.onAuthStateChanged(callback);
  // };