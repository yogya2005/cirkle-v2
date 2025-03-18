"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOutIcon, TimerIcon, ArrowLeftIcon } from "lucide-react";
// Import signOut from Firebase auth
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Make sure this path matches your actual Firebase setup file

export default function Welcome() {
  const [modelOpen, setModelOpen] = useState(false);
  const [showGroupInput, setShowGroupInput] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groups, setGroups] = useState<string[]>([]); // Store only group names (codes will be generated in the group page)
  const router = useRouter();

  // Load saved groups from localStorage when the component mounts
  useEffect(() => {
    const savedGroups = JSON.parse(localStorage.getItem("groups") || "[]");
    setGroups(savedGroups.map((group: any) => group.name)); // Store only names
  }, []);

  // Function to handle group creation
  const createGroup = () => {
    if (groupName.trim() === "") return;

    // Add group name to state (code is generated in the group page)
    setGroups((prevGroups) => [...prevGroups, groupName]);

    // Save to localStorage
    const savedGroups = JSON.parse(localStorage.getItem("groups") || "[]");
    localStorage.setItem("groups", JSON.stringify([...savedGroups, { name: groupName }]));

    // Navigate to the new group page
    router.push(`/group/${encodeURIComponent(groupName)}`);

    // Close modal and reset input
    setModelOpen(false);
    setShowGroupInput(false);
    setGroupName("");
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
        {/* Replace Link with Button for sign out */}
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
        <h1 className="text-7xl font-bold text-[#3B2F2F]">Welcome, Yogya!</h1>
        <div className="flex justify-center">
          <div className="w-full h-[3px] bg-[#3B2F2F] mt-4"></div>
        </div>
      </div>

      {/* Your Cirkles Section */}
      <div className="max-w-5xl w-full mt-10">
        <h2 className="text-5xl font-bold text-[#B78D75]">Your Cirkles</h2>

        <div className="flex gap-6 mt-6 flex-wrap">
          {/* Static CMPT 276 Button */}
          <Link href="/cmpt276">
            <Button className="w-[240px] h-[140px] flex flex-col items-center justify-center bg-[#924747] hover:bg-[#924747]/90 text-white rounded-xl shadow-md">
              <img src="/sun.png" alt="Sun Icon" className="h-8 w-8" />
              <span className="text-lg font-semibold">CMPT 276</span>
            </Button>
          </Link>

          {/* Dynamically Created Groups */}
          {groups.map((group, index) => (
            <Link key={index} href={`/group/${encodeURIComponent(group)}`}>
              <Button className="w-[240px] h-[140px] flex flex-col items-center justify-center bg-[#924747] hover:bg-[#924747]/90 text-white rounded-xl shadow-md">
                <img src="/sun.png" alt="Sun Icon" className="h-8 w-8" />
                <span className="text-lg font-semibold">{group}</span>
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
      </div>

      {/* Modal */}
      {modelOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-b from-[#EDE0D4] to-[#FAF3E9] w-[320px] p-6 rounded-2xl shadow-lg relative">
            {/* Back Button */}
            <button
              onClick={() => {
                if (showGroupInput) {
                  setShowGroupInput(false);
                  setGroupName("");
                } else {
                  setModelOpen(false);
                }
              }}
              className="absolute top-4 left-4 text-black"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>

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
                  onClick={createGroup}
                  className="bg-[#924747] hover:bg-[#924747]/90 text-white rounded-full px-6 py-3 text-lg font-medium w-full"
                >
                  Create Group
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
                <Button className="bg-[#924747] hover:bg-[#924747]/90 text-white rounded-full px-6 py-3 text-lg font-medium w-full">
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