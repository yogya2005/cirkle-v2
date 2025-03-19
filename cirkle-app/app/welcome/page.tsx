"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOutIcon, TimerIcon, ArrowLeftIcon } from "lucide-react";
// Import Firebase auth and Firestore functions
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createGroup, getUserGroups, joinGroup, getGroupById } from "@/lib/firestore";

export default function Welcome() {
  const [modelOpen, setModelOpen] = useState(false);
  const [showGroupInput, setShowGroupInput] = useState(false);
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupIdToJoin, setGroupIdToJoin] = useState("");
  const [groups, setGroups] = useState<any[]>([]); 
  const [loading, setLoading] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Load user's groups from Firestore when the component mounts
  useEffect(() => {
    const fetchGroups = async () => {
      if (!auth.currentUser) return;
      
      try {
        setLoadingGroups(true);
        const userGroups = await getUserGroups(auth.currentUser.uid);
        setGroups(userGroups);
      } catch (err) {
        console.error('Error fetching groups:', err);
      } finally {
        setLoadingGroups(false);
      }
    };

    fetchGroups();
  }, []);

  // Function to handle group creation
  const handleCreateGroup = async () => {
    if (groupName.trim() === "") {
      setError("Please enter a group name");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      if (!auth.currentUser) {
        setError("You must be logged in to create a group");
        return;
      }
      
      // Create group in Firestore
      const newGroup = await createGroup({ name: groupName }, auth.currentUser.uid);
      
      // Add to local state
      setGroups((prevGroups) => [...prevGroups, newGroup]);
      
      // Show success message
      setSuccess(`Group "${groupName}" created successfully! ID: ${newGroup.id}`);
      
      // Clear input
      setGroupName("");
      
      // Close modal and form after a delay
      setTimeout(() => {
        // Navigate to the new group page
        router.push(`/group/${encodeURIComponent(groupName)}`);
        
        // Close modal and reset input
        setModelOpen(false);
        setShowGroupInput(false);
        setSuccess(null);
      }, 1500);
      
    } catch (err) {
      console.error('Error creating group:', err);
      setError("Failed to create group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle joining a group
  const handleJoinGroup = async () => {
    if (groupIdToJoin.trim() === "") {
      setError("Please enter a group ID");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      if (!auth.currentUser) {
        setError("You must be logged in to join a group");
        return;
      }
      
      // First check if the group exists
      const group = await getGroupById(groupIdToJoin.trim());
      
      if (!group) {
        setError("Group not found. Please check the ID and try again.");
        return;
      }
      
      // Join group in Firestore
      const joined = await joinGroup(groupIdToJoin.trim(), auth.currentUser.uid);
      
      if (joined) {
        // Show success message
        setSuccess(`Successfully joined the group "${group.name}"!`);
        
        // Refresh groups list
        const userGroups = await getUserGroups(auth.currentUser.uid);
        setGroups(userGroups);
        
        // Clear input
        setGroupIdToJoin("");
        
        // Close modal and form after a delay
        setTimeout(() => {
          // Navigate to the group page
          router.push(`/group/${encodeURIComponent(group.name)}`);
          
          // Close modal and reset input
          setModelOpen(false);
          setShowJoinInput(false);
          setSuccess(null);
        }, 1500);
      } else {
        setError("You're already a member of this group.");
      }
    } catch (err: any) {
      console.error('Error joining group:', err);
      setError(err.message || "Failed to join group. Please verify the group ID and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
      // Redirect to home page after sign out
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF3E9] flex flex-col items-center p-8">
      {/* Sign Out & Pomodoro Button */}
      <div className="w-full flex justify-end items-center gap-4 max-w-5xl">
        <Button 
          onClick={handleSignOut} 
          variant="ghost" 
          className="flex items-center text-black font-medium text-lg"
        >
          <LogOutIcon className="h-5 w-5 mr-2" />
          Sign Out
        </Button>

        <Link href="/pomodoro">
          <Button className="flex items-center gap-2 bg-[#924747] hover:bg-[#924747]/90 text-white rounded-full px-6 py-3 text-lg font-medium">
            <TimerIcon className="h-5 w-5" />
            Start a Pomodoro
          </Button>
        </Link>
      </div>

      {/* Welcome Heading */}
      <div className="text-center mt-8">
        <h1 className="text-7xl font-bold text-[#3B2F2F]">Welcome, {auth.currentUser?.displayName?.split(' ')[0] || 'User'}!</h1>
        <div className="flex justify-center">
          <div className="w-full h-[3px] bg-[#3B2F2F] mt-4"></div>
        </div>
      </div>

      {/* Your Cirkles Section */}
      <div className="max-w-5xl w-full mt-10">
        <h2 className="text-5xl font-bold text-[#B78D75]">Your Cirkles</h2>

        {loadingGroups ? (
          <p className="mt-4">Loading your groups...</p>
        ) : (
          <div className="flex gap-6 mt-6 flex-wrap">
            {/* Static CMPT 276 Button */}
            <Link href="/cmpt276">
              <Button className="w-[240px] h-[140px] flex flex-col items-center justify-center bg-[#924747] hover:bg-[#924747]/90 text-white rounded-xl shadow-md">
                <img src="/sun.png" alt="Sun Icon" className="h-8 w-8" />
                <span className="text-lg font-semibold">CMPT 276</span>
              </Button>
            </Link>

            {/* Dynamically Created Groups */}
            {groups.map((group) => (
              <Link key={group.id} href={`/group/${encodeURIComponent(group.name)}`}>
                <Button className="w-[240px] h-[140px] flex flex-col items-center justify-center bg-[#924747] hover:bg-[#924747]/90 text-white rounded-xl shadow-md">
                  <img src="/sun.png" alt="Sun Icon" className="h-8 w-8" />
                  <span className="text-lg font-semibold">{group.name}</span>
                </Button>
              </Link>
            ))}

            {/* Add or Join Group Button */}
            <Button
              onClick={() => setModelOpen(true)}
              className="w-[240px] h-[140px] flex flex-col items-center justify-center bg-[#924747] hover:bg-[#924747]/90 text-white rounded-xl shadow-md"
            >
              <img src="/plus.png" alt="Plus Icon" className="h-8 w-8" />
              <span className="text-lg font-semibold">Add or Join</span>
            </Button>
          </div>
        )}
      </div>

      {/* Modal */}
      {modelOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-b from-[#EDE0D4] to-[#FAF3E9] w-[320px] p-6 rounded-2xl shadow-lg relative">
            {/* Back Button */}
            <button
              onClick={() => {
                if (showGroupInput || showJoinInput) {
                  setShowGroupInput(false);
                  setShowJoinInput(false);
                  setGroupName("");
                  setGroupIdToJoin("");
                  setError(null);
                  setSuccess(null);
                } else {
                  setModelOpen(false);
                }
              }}
              className="absolute top-4 left-4 text-black"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>

            {/* Error message if any */}
            {error && (
              <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
            )}

            {/* Success message if any */}
            {success && (
              <p className="text-green-500 text-sm mb-4 text-center">{success}</p>
            )}

            {/* Create Group Form */}
            {showGroupInput ? (
              <div className="flex flex-col gap-6 mt-8">
                <h2 className="text-xl font-semibold text-[#3B2F2F] text-center">
                  Enter Group Name
                </h2>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Group Name"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#924747]"
                />
                <Button
                  onClick={handleCreateGroup}
                  disabled={loading}
                  className="bg-[#924747] hover:bg-[#924747]/90 text-white rounded-full px-6 py-3 text-lg font-medium w-full"
                >
                  {loading ? 'Creating...' : 'Create Group'}
                </Button>
              </div>
            ) : showJoinInput ? (
              <div className="flex flex-col gap-6 mt-8">
                <h2 className="text-xl font-semibold text-[#3B2F2F] text-center">
                  Enter Group ID
                </h2>
                <input
                  type="text"
                  value={groupIdToJoin}
                  onChange={(e) => setGroupIdToJoin(e.target.value)}
                  placeholder="Group ID"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#924747]"
                />
                <Button
                  onClick={handleJoinGroup}
                  disabled={loading}
                  className="bg-[#924747] hover:bg-[#924747]/90 text-white rounded-full px-6 py-3 text-lg font-medium w-full"
                >
                  {loading ? 'Joining...' : 'Join Group'}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-6 mt-8">
                <Button
                  onClick={() => setShowGroupInput(true)}
                  className="bg-[#924747] hover:bg-[#924747]/90 text-white rounded-full px-6 py-3 text-lg font-medium w-full"
                >
                  Create a Group
                </Button>
                <Button 
                  onClick={() => setShowJoinInput(true)}
                  className="bg-[#924747] hover:bg-[#924747]/90 text-white rounded-full px-6 py-3 text-lg font-medium w-full"
                >
                  Join an Existing Group
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}