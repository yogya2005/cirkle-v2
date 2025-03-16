"use client";
import {useState} from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOutIcon, TimerIcon, ArrowLeftIcon } from "lucide-react";

export default function Welcome() {
  const [modelOpen, setModelOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#FAF3E9] flex flex-col items-center p-8">
      {/* Sign Out & Pomodoro Button */}
      <div className="w-full flex justify-end items-center gap-4 max-w-5xl">
        {/* this link isn't working*/}
        <Link href="/page" className="flex items-center text-black font-medium text-lg">
          <LogOutIcon className="h-5 w-5 mr-2" />
          Sign Out
        </Link>

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
          <div className="w-full max-w-5xl h-[3px] bg-[#3B2F2F] mt-4"></div>
        </div>
      </div>

      {/* Your Cirkles Section */}
      <div className="max-w-5xl w-full mt-10">
        <h2 className="text-5xl font-bold text-[#B78D75]">Your Cirkles</h2>

        <div className="flex gap-6 mt-6">
          {/* CMPT 276 */}
          <Link href="/cmpt276">
            <Button className="w-[240px] h-[140px] flex flex-col items-center justify-center bg-[#924747] hover:bg-[#924747]/90 text-white rounded-xl shadow-md">
            <img src="/sun.png" alt="Sun Icon" className="h-8 w-8" />
              <span className="text-lg font-semibold">CMPT 276</span>
            </Button>
          </Link>

          {/* Add or Join */}
            <Button onClick={() => setModelOpen(true)} className="w-[240px] h-[140px] flex flex-col items-center justify-center bg-[#924747] hover:bg-[#924747]/90 text-white rounded-xl shadow-md">
            <img src="/plus.png" alt="Plus Icon" className="h-8 w-8" />
              <span className="text-lg font-semibold">Add or Join</span>
            </Button>
         
        </div>
      </div>

      {/* Modal */}
      {modelOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-b from-[#EDE0D4] to-[#FAF3E9] w-[320px] p-6 rounded-2xl shadow-lg relative">
            {/* Close Button */}
            <button onClick={() => setModelOpen(false)} className="absolute top-4 left-4 text-black">
              <ArrowLeftIcon className="h-6 w-6" />
            </button>

            {/* Buttons Inside Model */}
            <div className="flex flex-col gap-6 mt-8">
              <Button className="bg-[#924747] hover:bg-[#924747]/90 text-white rounded-full px-6 py-3 text-lg font-medium w-full">
                Create a Group
              </Button>
              <Button className="bg-[#924747] hover:bg-[#924747]/90 text-white rounded-full px-6 py-3 text-lg font-medium w-full">
                Join an Existing Group
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
