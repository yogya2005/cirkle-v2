import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOutIcon, TimerIcon, PlusIcon, SunIcon, RocketIcon } from "lucide-react";

export default function Welcome() {
  return (
    <main className="min-h-screen bg-[#FAF3E9] flex flex-col items-center p-8">
      {/* Sign Out & Pomodoro Button */}
      <div className="w-full flex justify-end items-center gap-4 max-w-5xl">
        <Link href="/logout" className="flex items-center text-black font-medium text-lg">
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
          <Link href="/create-circle">
            <Button className="w-[240px] h-[140px] flex flex-col items-center justify-center bg-[#924747] hover:bg-[#924747]/90 text-white rounded-xl shadow-md">
            <img src="/plus.png" alt="Plus Icon" className="h-8 w-8" />
              <span className="text-lg font-semibold">Add or Join</span>
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
