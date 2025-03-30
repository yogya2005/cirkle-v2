// app/group/[groupName]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { HomeIcon, TimerIcon, PlusIcon, ClipboardIcon, CheckIcon, UploadIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getGroupById, getGroupInviteCode } from "@/services/groupService";
import { createGroupDocument, uploadGroupFile } from "@/services/googleDriveService";
import { requestGooglePermissions, hasValidGoogleToken, saveGoogleTokenData } from "@/services/googleAuthService";
import { getUserGroups } from '@/services/groupService';
import ProtectedRoute from "@/components/protected-route";
import { getUserById } from '@/services/userService';
import { Tooltip } from '@/components/ui/tooltip';

export default function GroupPage() {
  const params = useParams();
  const groupName = params.groupName as string;
  const router = useRouter();
  
  const [copied, setCopied] = useState(false);
  const [showCreateDocument, setShowCreateDocument] = useState(false);
  const [documentName, setDocumentName] = useState("");
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [memberData, setMemberData] = useState<{[key: string]: any}>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  // Fetch member data when group loads
  useEffect(() => {
    const fetchMemberData = async () => {
      if (!group || !group.members) return;
      
      const memberIds = Object.keys(group.members).filter(id => group.members[id]);
      const userData: {[key: string]: any} = {};
      
      // Fetch data for each member
      for (const id of memberIds) {
        try {
          const user = await getUserById(id);
          if (user) {
            userData[id] = user;
          }
        } catch (err) {
          console.error(`Error fetching user data for ${id}:`, err);
        }
      }
      
      setMemberData(userData);
    };
    
    if (group) {
      fetchMemberData();
    }
  }, [group]);

  // Fetch group data when component mounts
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        if (!user) {
          router.push('/');
          return;
        }
        
        setLoading(true);
        setError(null);
        
        // Find group by name
        const userGroups = await getUserGroups(user.uid);
        const foundGroup = userGroups.find(g => g.name === decodeURIComponent(groupName));
        
        if (foundGroup) {
          setGroup(foundGroup);
        } else {
          setError('Group not found');
        }
      } catch (err) {
        console.error('Error fetching group data:', err);
        setError('Failed to load group data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [groupName, user, router]);

  const copyToClipboard = () => {
    if (!group) return;
    
    navigator.clipboard.writeText(getGroupInviteCode(group.id)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Handle document creation
  const handleCreateDocument = async () => {
    if (!documentName.trim() || !group || !user) return;
    
    try {
      setIsCreatingDoc(true);
      setError(null);
      
      // Ensure we have Google permissions
      const hasPermissions = await ensureGooglePermissions();
      if (!hasPermissions) {
        setIsCreatingDoc(false);
        return;
      }
      
      // Create the document
      await createGroupDocument(
        group.id, 
        documentName.trim(), 
        group, 
        user.uid
      );
      
      // Reset state
      setDocumentName('');
      setShowCreateDocument(false);
      setSuccessMessage('Document created successfully!');
      
      // Refresh group data to show the new document
      const refreshedGroup = await getGroupById(group.id);
      setGroup(refreshedGroup);
      
      // Clear success message after a delay
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error creating document:', err);
      setError('Failed to create document. Please try again.');
    } finally {
      setIsCreatingDoc(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !group || !user) return;
    
    const file = e.target.files[0];
    
    try {
      setIsUploadingFile(true);
      setError(null);
      
      // Ensure we have Google permissions
      const hasPermissions = await ensureGooglePermissions();
      if (!hasPermissions) {
        setIsUploadingFile(false);
        return;
      }
      
      // Upload the file
      await uploadGroupFile(
        group.id, 
        file, 
        group, 
        user.uid
      );
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setSuccessMessage('File uploaded successfully!');
      
      // Refresh group data to show the new file
      const refreshedGroup = await getGroupById(group.id);
      setGroup(refreshedGroup);
      
      // Clear success message after a delay
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload file. Please try again.');
    } finally {
      setIsUploadingFile(false);
    }
  };

  // Request Google permissions if needed
  const ensureGooglePermissions = async (): Promise<boolean> => {
    if (!hasValidGoogleToken()) {
      try {
        setSuccessMessage('Requesting Google Drive permissions...');
        const tokenData = await requestGooglePermissions();
        saveGoogleTokenData(tokenData);
        setSuccessMessage('Permissions granted successfully!');
        return true;
      } catch (error) {
        console.error('Failed to get Google permissions:', error);
        setError('Please grant permission to access Google Drive to create documents and upload files.');
        setSuccessMessage(null);
        return false;
      }
    }
    return true;
  };

  // Helper function to format date safely
  const formatDate = (timestamp: any): string => {
    if (!timestamp) return 'Unknown';
    
    // If it's a Firebase timestamp with toDate method
    if (timestamp.toDate && typeof timestamp.toDate === 'function') {
      return new Date(timestamp.toDate()).toLocaleDateString();
    }
    
    // If it's a regular Date object or timestamp
    try {
      return new Date(timestamp).toLocaleDateString();
    } catch (err) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAF3E9] flex flex-col items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#FAF3E9] flex flex-col items-center justify-center">
        <div className="text-2xl text-red-500">{error}</div>
        <Link href="/welcome" className="mt-4">
          <Button>Back to Home</Button>
        </Link>
      </main>
    );
  }

  return (
    <ProtectedRoute>
    <main className="min-h-screen bg-[#FAF3E9] flex flex-col items-center p-8">
      {/* Top Navigation */}
      <div className="w-full max-w-6xl flex justify-between items-center">
        {/* Navigation Buttons */}
        <div className="flex items-center space-x-6">
          <Link href="/welcome" className="flex items-center space-x-2 text-black font-medium text-lg">
            <HomeIcon className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <Link href={`/pomodoro?groupId=${group.id}`} className="flex items-center space-x-2 text-black font-medium text-lg">
            <TimerIcon className="h-5 w-5" />
            <span>Pomodoro</span>
          </Link>
        </div>

        {/* Overlapping User Avatars */}
        <div className="flex -space-x-2">
          {group && group.members && Object.keys(group.members)
            .filter(key => group.members[key])
            .map((userId) => {
              const userData = memberData[userId];
              const firstLetter = userData?.displayName?.charAt(0).toUpperCase() || userId.charAt(0).toUpperCase();
              const backgroundColor = userData ? (userId === user?.uid ? "#FFD1DC" : "#D0C3FF") : "#CCCCCC";
              
              return (
                <div
                  key={userId}
                  className="w-8 h-8 flex items-center justify-center text-black font-bold rounded-full border border-white group relative"
                  style={{ backgroundColor }}
                >
                  {firstLetter}
                  
                  {/* Tooltip that appears on hover */}
                  <div className="absolute hidden group-hover:block top-full mt-2 p-2 bg-white shadow-md rounded z-10 text-xs min-w-[150px]">
                    <p className="font-semibold">{userData?.displayName || 'Unknown User'}</p>
                    <p className="text-gray-600">{userData?.email || ''}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="w-full max-w-6xl mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="w-full max-w-6xl mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {/* Group Title and Copyable ID */}
      <div className="max-w-6xl w-full mt-8">
        <div className="flex items-center">
          <h1 className="text-6xl font-bold text-[#3B2F2F]">{decodeURIComponent(groupName)}</h1>
          {group && (
            <span className="ml-4 text-xl text-[#79747e] flex items-center">
              #{getGroupInviteCode(group.id)}
              <button onClick={copyToClipboard} className="ml-2">
                {copied ? (
                  <CheckIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <ClipboardIcon className="h-5 w-5 cursor-pointer" />
                )}
              </button>
            </span>
          )}
        </div>
        <div className="w-full h-[3px] bg-[#3B2F2F] mt-4"></div>
      </div>

      {/* Notes & File Uploads Section */}
      <div className="max-w-6xl w-full mt-10">
        {/* Notes Section */}
        <h2 className="text-3xl font-bold text-[#B78D75]">Notes</h2>
        
        {showCreateDocument ? (
          <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Create New Document</h3>
            <input
              type="text"
              className="w-full p-2 border rounded mb-4"
              placeholder="Document Name"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
            />
            <div className="flex space-x-2">
              <Button 
                onClick={handleCreateDocument}
                disabled={isCreatingDoc || !documentName.trim()}
                className="bg-[#924747]"
              >
                {isCreatingDoc ? 'Creating...' : 'Create Document'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setShowCreateDocument(false);
                  setDocumentName('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-6 mt-4 flex-wrap">
            {/* Display existing documents */}
            {group?.resources?.documents?.map((doc: any) => (
              <a 
                key={doc.id}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-[200px] h-[100px]"
              >
                <Button className="w-full h-full flex flex-col items-center justify-center bg-[#924747] text-white rounded-xl shadow-md">
                  <span className="text-lg font-semibold truncate text-ellipsis overflow-hidden whitespace-nowrap w-full text-center px-2">
                    {doc.name}
                  </span>
                </Button>
              </a>
            ))}
            
            <Button 
              className="w-[200px] h-[100px] flex flex-col items-center justify-center bg-[#924747] text-white rounded-xl shadow-md"
              onClick={() => setShowCreateDocument(true)}
            >
              <PlusIcon className="h-6 w-6" />
            </Button>
          </div>
        )}

        {/* File Uploads Section */}
        <h2 className="text-3xl font-bold text-[#B78D75] mt-10">File Uploads</h2>
        <div className="flex gap-6 mt-4 flex-wrap">
          {/* Display existing files */}
          {group?.resources?.files?.map((file: any) => (
            <a 
              key={file.id}
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-[200px] h-[100px]"
            >
              <Button className="w-full h-full flex flex-col items-center justify-center bg-[#924747] text-white rounded-xl shadow-md">
                <span className="text-lg font-semibold truncate text-ellipsis overflow-hidden whitespace-nowrap w-full text-center px-2">
                  {file.name}
             </span>
          </Button>

            </a>
          ))}
          
          <label className="w-[200px] h-[100px] cursor-pointer">
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
              disabled={isUploadingFile}
            />
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#924747] text-white rounded-xl shadow-md">
              {isUploadingFile ? (
                <span className="text-lg font-semibold">Uploading...</span>
              ) : (
                <>
                  <UploadIcon className="h-6 w-6" />
                  <span className="mt-1">Upload File</span>
                </>
              )}
            </div>
          </label>
        </div>
      </div>
    </main>
    </ProtectedRoute>
  );
}