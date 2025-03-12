"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HomeIcon, PauseIcon, PlayIcon, SettingsIcon } from "lucide-react"

export default function Pomodoro() {
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(timerRef.current as NodeJS.Timeout)
            setIsActive(false)
            // Timer completed
            return
          }
          setMinutes(minutes - 1)
          setSeconds(59)
        } else {
          setSeconds(seconds - 1)
        }
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isActive, minutes, seconds])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setMinutes(25)
    setSeconds(0)
  }

  return (
    <main className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-cream rounded-lg p-8 border border-tan/20">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#3b2f2f]">Pomodoro</h1>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setShowSettings(!showSettings)}>
              <SettingsIcon className="h-5 w-5 text-[#3b2f2f]" />
            </Button>
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
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
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

          {showSettings && (
            <div className="w-full bg-[#f3edf7] rounded-lg p-4 mb-4">
              <h3 className="text-sm font-medium text-[#3b2f2f] mb-2">Settings</h3>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#3b2f2f]">WORK MINUTES</span>
                  <span className="text-xs font-medium text-[#3b2f2f]">25</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#3b2f2f]">SHORT BREAK</span>
                  <span className="text-xs font-medium text-[#3b2f2f]">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#3b2f2f]">LONG BREAK</span>
                  <span className="text-xs font-medium text-[#3b2f2f]">15</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#3b2f2f]">SESSIONS</span>
                  <span className="text-xs font-medium text-[#3b2f2f]">4</span>
                </div>
              </div>
            </div>
          )}

          <div className="w-full">
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
  )
}

