// services/userService.ts
import { 
    doc, 
    getDoc, 
    setDoc, 
    collection, 
    query, 
    where, 
    getDocs,
    serverTimestamp
  } from 'firebase/firestore';
  import { User } from 'firebase/auth';
  import { db } from '@/lib/firebase';
  
  const USERS_COLLECTION = 'users';
  
  interface UserData {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
    groups?: string[];
    createdAt?: any;
    updatedAt?: any;
    [key: string]: any;
  }
  
  /**
   * Get user data by ID
   * @param userId The user ID
   * @returns The user data or null if not found
   */
  export const getUserById = async (userId: string): Promise<UserData | null> => {
    try {
      console.log(`Getting user data for ID: ${userId}`);
      const userRef = doc(db, USERS_COLLECTION, userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        console.log(`User found for ID: ${userId}`);
        return { id: userSnap.id, ...userSnap.data() } as UserData;
      }
      
      console.log(`No user found for ID: ${userId}`);
      return null;
    } catch (error) {
      console.error(`Error getting user ${userId}:`, error);
      throw error;
    }
  };
  
  /**
   * Create or update user data
   * @param userId The user ID
   * @param userData The user data to store
   * @returns The created/updated user data
   */
  export const updateUserData = async (userId: string, userData: Partial<UserData>): Promise<UserData> => {
    try {
      console.log(`Updating user data for ID: ${userId}`);
      const userRef = doc(db, USERS_COLLECTION, userId);
      
      // Merge with existing data if it exists
      await setDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      console.log(`Successfully updated user data for ID: ${userId}`);
      return { id: userId, ...userData } as UserData;
    } catch (error) {
      console.error(`Error updating user data for ${userId}:`, error);
      throw error;
    }
  };
  
  /**
   * Create or update a user profile with authentication info
   * @param user The Firebase auth user object
   * @returns The created/updated user profile
   */
  export const createUserProfile = async (user: User): Promise<UserData> => {
    try {
      const { uid, displayName, email, photoURL } = user;
      console.log(`Creating/updating user profile for ${displayName || 'unnamed user'} (${uid})`);
      
      const userRef = doc(db, USERS_COLLECTION, uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        // Create new user profile
        console.log(`Creating new user profile for ${uid}`);
        const userData: UserData = {
          uid,
          displayName,
          email,
          photoURL,
          groups: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        await setDoc(userRef, userData);
        console.log(`Successfully created new user profile for ${uid}`);
        return { id: uid, ...userData };
      } else {
        // Update existing user profile
        console.log(`Updating existing user profile for ${uid}`);
        const userData = {
          displayName,
          email,
          photoURL,
          updatedAt: serverTimestamp()
        };
        
        await setDoc(userRef, userData, { merge: true });
        console.log(`Successfully updated user profile for ${uid}`);
        return { id: uid, ...userSnap.data(), ...userData } as UserData;
      }
    } catch (error) {
      console.error(`Error creating/updating user profile:`, error);
      throw error;
    }
  };
  
  /**
   * Get email addresses for a list of user IDs
   * @param userIds The user IDs to look up
   * @returns Array of email addresses (may contain null for users without emails)
   */
  export const getUserEmails = async (userIds: string[]): Promise<(string | null)[]> => {
    try {
      console.log(`Looking up emails for ${userIds.length} users`);
      const emails: (string | null)[] = [];
      
      // Process in batches to avoid excessive reads
      const batchSize = 10;
      for (let i = 0; i < userIds.length; i += batchSize) {
        const batch = userIds.slice(i, i + batchSize);
        const userDocs = await Promise.all(
          batch.map(userId => getUserById(userId))
        );
        
        userDocs.forEach(user => {
          if (user && user.email) {
            emails.push(user.email);
          } else {
            emails.push(null);
          }
        });
      }
      
      console.log(`Found ${emails.filter(Boolean).length} valid emails out of ${userIds.length} users`);
      return emails;
    } catch (error) {
      console.error(`Error getting user emails:`, error);
      throw error;
    }
  };