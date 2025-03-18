"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HomeIcon, TimerIcon, PlusIcon, ClipboardIcon, CheckIcon } from "lucide-react";

export default function GroupPage() {
  const { groupName } = useParams();
  const [copied, setCopied] = useState(false);
  const [groupCode, setGroupCode] = useState("");

  useEffect(() => {
    // Generate a random 4-digit code when the page loads
    setGroupCode(Math.floor(1000 + Math.random() * 9000).toString());
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(groupCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <main className="min-h-screen bg-[#FAF3E9] flex flex-col items-center p-8">
      {/* Top Navigation */}
      <div className="w-full max-w-6xl flex justify-between items-center">
        {/* Navigation Buttons */}
        <div className="flex items-center space-x-6">
          <Link href="/welcome" className="flex items-center space-x-2 text-black font-medium text-lg">
            <HomeIcon className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <Link href="/pomodoro" className="flex items-center space-x-2 text-black font-medium text-lg">
            <TimerIcon className="h-5 w-5" />
            <span>Pomodoro</span>
          </Link>
        </div>

        {/* Overlapping User Avatars */}
        <div className="flex -space-x-2">
          {["A", "E", "C", "D", "F", "G"].map((letter, index) => (
            <div
              key={index}
              className="w-8 h-8 flex items-center justify-center text-black font-bold rounded-full border border-white"
              style={{
                backgroundColor: index % 2 === 0 ? "#FFD1DC" : "#D0C3FF",
              }}
            >
              {letter}
            </div>
          ))}
        </div>
      </div>

      {/* Group Title and Copyable Code */}
      <div className="max-w-6xl w-full mt-8">
        <div className="flex items-center">
          <h1 className="text-6xl font-bold text-[#3B2F2F]">{decodeURIComponent(groupName)}</h1>
          <span className="ml-4 text-xl text-[#79747e] flex items-center">
            #{groupCode}
            <button onClick={copyToClipboard} className="ml-2">
              {copied ? (
                <CheckIcon className="h-5 w-5 text-green-500" />
              ) : (
                <ClipboardIcon className="h-5 w-5 cursor-pointer" />
              )}
            </button>
          </span>
        </div>
        <div className="w-full h-[3px] bg-[#3B2F2F] mt-4"></div>
      </div>

      {/* Notes & File Uploads Section */}
      <div className="max-w-6xl w-full mt-10">
        {/* Notes Section */}
        <h2 className="text-3xl font-bold text-[#B78D75]">Notes</h2>
        <div className="flex gap-6 mt-4">
          <Button className="w-[200px] h-[100px] flex flex-col items-center justify-center bg-[#924747] text-white rounded-xl shadow-md">
            <PlusIcon className="h-6 w-6" />
          </Button>
        </div>

        {/* File Uploads Section */}
        <h2 className="text-3xl font-bold text-[#B78D75] mt-10">File Uploads</h2>
        <div className="flex gap-6 mt-4">
          <Button className="w-[200px] h-[100px] flex flex-col items-center justify-center bg-[#924747] text-white rounded-xl shadow-md">
            <PlusIcon className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </main>
  );
}
