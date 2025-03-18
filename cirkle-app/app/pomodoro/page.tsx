"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeIcon, PauseIcon, PlayIcon } from "lucide-react";

export default function Pomodoro() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputMinutes, setInputMinutes] = useState(25);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            setIsActive(false);
            return;
          }
          setMinutes((prev) => prev - 1);
          setSeconds(59);
        } else {
          setSeconds((prev) => prev - 1);
        }
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, minutes, seconds]);

  const toggleTimer = () => {
    if (isOnBreak) {
      setIsOnBreak(false);
    }
    setIsActive((prev) => !prev);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsOnBreak(false);
    setMinutes(inputMinutes);
    setSeconds(0);
  };

  const handleBreak = () => {
    if (isOnBreak) {
      setIsOnBreak(false);
      setIsActive(true);
    } else {
      setIsOnBreak(true);
      setIsActive(false);
    }
  };

  const handleMinutesClick = () => {
    if (!isActive && !isOnBreak) {
      setIsEditing(true);
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setInputMinutes(value);
    }
  };

  const handleMinutesBlur = () => {
    setIsEditing(false);
    setMinutes(inputMinutes);
    setSeconds(0);
  };

  return (
    <main className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-cream rounded-lg p-8 border border-tan/20">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#3b2f2f]">Pomodoro</h1>
          <div className="flex space-x-2">
            <Link href="/welcome">
              <Button variant="ghost" size="icon" className="rounded-full">
                <HomeIcon className="h-5 w-5 text-[#3b2f2f]" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="relative w-48 h-48 flex items-center justify-center border-4 border-[#924747] rounded-full mb-6">
            <div className="text-4xl font-bold text-[#924747]">
              {isEditing ? (
                <input
                  type="number"
                  value={inputMinutes}
                  onChange={handleMinutesChange}
                  onBlur={handleMinutesBlur}
                  className="w-16 p-1 border rounded text-center"
                  min={1}
                />
              ) : (
                <span onClick={handleMinutesClick} className="cursor-pointer">
                  {String(minutes).padStart(2, "0")}:
                  {String(seconds).padStart(2, "0")}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-4 bg-cream rounded-full border border-[#924747] p-1"
              onClick={toggleTimer}
            >
              {isActive ? (
                <PauseIcon className="h-4 w-4 text-[#924747]" />
              ) : (
                <PlayIcon className="h-4 w-4 text-[#924747]" />
              )}
            </Button>
          </div>

          {isOnBreak && (
            <div className="text-red-500 mt-2">
              On Break
            </div>
          )}

          <div className="w-full flex flex-col space-y-2">
            <Button
              variant="outline"
              className="w-full border-[#3b2f2f] text-[#3b2f2f] bg-transparent hover:bg-[#3b2f2f]/10 rounded-md"
              onClick={handleBreak}
            >
              {isOnBreak ? 'Resume' : 'Break'}
            </Button>
            <Button
              variant="outline"
              className="w-full border-[#3b2f2f] text-[#3b2f2f] bg-transparent hover:bg-[#3b2f2f]/10 rounded-md"
              onClick={resetTimer}
            >
              Reset Timer
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
