// lib/firestore.ts
import { 
    collection, 
    addDoc, 
    getDoc, 
    getDocs, 
    doc, 
    query, 
    where, 
    updateDoc, 
    serverTimestamp
  } from 'firebase/firestore';
  import { db } from './firebase';  // Import db directly from firebase.ts
  
  const GROUPS_COLLECTION = 'groups';
  
  /**
   * Create a new group
   * @param groupData The group data (name)
   * @param userId The user ID of the creator
   * @returns The created group with its ID
   */
  export const createGroup = async (groupData: { name: string }, userId: string) => {
    try {
      // Create new group document
      const newGroup = {
        ...groupData,
        createdBy: userId,
        members: { [userId]: true }, // Object with user IDs as keys for quick lookups
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        resources: {
          documents: [],
          files: []
        }
      };
      
      // Add to Firestore and get document reference
      const docRef = await addDoc(collection(db, GROUPS_COLLECTION), newGroup);
      const groupId = docRef.id;
      
      console.log(`Group created with ID: ${groupId}`);
      
      // Return group with its ID
      return { 
        id: groupId, 
        ...groupData,
        createdBy: userId,
        members: { [userId]: true },
        createdAt: new Date(), // Use JavaScript Date for immediate use (serverTimestamp not available right away)
        resources: {
          documents: [],
          files: []
        }
      };
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  };
  
  /**
   * Get a group by ID
   * @param groupId The group ID
   * @returns The group document or null if not found
   */
  export const getGroupById = async (groupId: string) => {
    try {
      console.log(`Fetching group with ID: ${groupId}`);
      const docRef = doc(db, GROUPS_COLLECTION, groupId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        console.log(`Group found: ${docSnap.data().name}`);
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        console.log(`Group not found for ID: ${groupId}`);
        return null;
      }
    } catch (error) {
      console.error('Error getting group:', error);
      throw error;
    }
  };
  
  /**
   * Join a group using its ID
   * @param groupId The group ID to join
   * @param userId The user ID of the joiner
   * @returns Success status
   */
  export const joinGroup = async (groupId: string, userId: string) => {
    try {
      console.log(`User ${userId} attempting to join group ${groupId}`);
      
      // Check if group exists
      const group = await getGroupById(groupId);
      
      if (!group) {
        console.error(`Group ${groupId} not found`);
        throw new Error('Group not found');
      }
      
      // Check if user is already a member
      if (group.members && group.members[userId]) {
        console.log(`User ${userId} is already a member of group ${groupId}`);
        return false;
      }
      
      // Add user to the group's members
      const groupRef = doc(db, GROUPS_COLLECTION, groupId);
      await updateDoc(groupRef, {
        [`members.${userId}`]: true,
        updatedAt: serverTimestamp()
      });
      
      console.log(`User ${userId} successfully joined group ${groupId}`);
      return true;
    } catch (error) {
      console.error('Error joining group:', error);
      throw error;
    }
  };
  
  /**
   * Get all groups a user is a member of
   * @param userId The user ID
   * @returns Array of groups
   */
  export const getUserGroups = async (userId: string) => {
    try {
      console.log(`Fetching groups for user ${userId}`);
      const groupsQuery = query(
        collection(db, GROUPS_COLLECTION),
        where(`members.${userId}`, '==', true)
      );
      
      const querySnapshot = await getDocs(groupsQuery);
      const groups: any[] = [];
      
      querySnapshot.forEach((doc) => {
        groups.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log(`Found ${groups.length} groups for user ${userId}`);
      return groups;
    } catch (error) {
      console.error('Error getting user groups:', error);
      throw error;
    }
  };