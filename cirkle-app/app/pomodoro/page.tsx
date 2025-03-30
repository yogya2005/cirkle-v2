// app/pomodoro/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeIcon, PauseIcon, PlayIcon, SettingsIcon, CheckIcon } from "lucide-react";
import ProtectedRoute from "@/components/protected-route";
import { useAuth } from "@/hooks/useAuth";
import { useGroups } from "@/hooks/useGroups";
import { getGroupScores, updateUserScore } from "@/services/pomodoroService";

interface ScoreEntry {
  userId: string;
  userName: string;
  userEmail: string;
  score: number;
}

export default function Pomodoro() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputMinutes, setInputMinutes] = useState(25);
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  
  const { user } = useAuth();
  const { groups, loading: groupsLoading } = useGroups();
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [timerPointsEarned, setTimerPointsEarned] = useState(0);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Set the selected group based on the URL parameter or first available group
  useEffect(() => {
    const groupIdFromUrl = searchParams.get('groupId');
    
    if (groupIdFromUrl && groups.some(g => g.id === groupIdFromUrl)) {
      setSelectedGroup(groupIdFromUrl);
    } else if (groups.length > 0 && !selectedGroup) {
      setSelectedGroup(groups[0].id);
    }
  }, [groups, searchParams, selectedGroup]);

  // Fetch scores for the selected group
  useEffect(() => {
    const fetchScores = async () => {
      if (!selectedGroup) return;
      
      try {
        const groupScores = await getGroupScores(selectedGroup);
        setScores(groupScores);
      } catch (err) {
        console.error('Error fetching scores:', err);
      }
    };
    
    fetchScores();
  }, [selectedGroup]);

  // Timer logic
  useEffect(() => {
    if (isActive) {
      initialTimeRef.current = initialTimeRef.current || minutes * 60 + seconds;
      
      timerRef.current = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            setIsActive(false);
            
            // Calculate points earned if not on break and update score
            if (!isOnBreak && user && selectedGroup) {
              const pointsEarned = Math.floor(initialTimeRef.current / 60);
              setTimerPointsEarned(pointsEarned);
              
              updateUserScore(
                selectedGroup,
                user.uid,
                user.displayName || 'Unknown User',
                user.email || '',
                pointsEarned
              ).then(newScore => {
                // Update local scores
                setScores(prev => {
                  const newScores = [...prev];
                  const userScoreIndex = newScores.findIndex(s => s.userId === user.uid);
                  
                  if (userScoreIndex >= 0) {
                    newScores[userScoreIndex].score = newScore;
                  } else {
                    newScores.push({
                      userId: user.uid,
                      userName: user.displayName || 'Unknown User',
                      userEmail: user.email || '',
                      score: newScore
                    });
                  }
                  
                  return newScores.sort((a, b) => b.score - a.score);
                });
              });
            }
            
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
  }, [isActive, minutes, seconds, isOnBreak, user, selectedGroup]);

  const toggleTimer = () => {
    if (isOnBreak) setIsOnBreak(false);
    setIsActive(!isActive);
    
    // Reset initial time reference when starting a new timer
    if (!isActive) {
      initialTimeRef.current = 0;
      setTimerPointsEarned(0);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsOnBreak(false);
    setMinutes(inputMinutes);
    setSeconds(0);
    initialTimeRef.current = 0;
    setTimerPointsEarned(0);
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
    if (!isActive && !isOnBreak) setIsEditing(true);
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

  const handleGroupChange = (groupId: string) => {
    setSelectedGroup(groupId);
  };

  // Show loading state while groups are loading
  if (groupsLoading) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
        <div className="max-w-5xl w-full bg-cream rounded-lg p-8 border border-tan/20 flex relative">
          {/* Home Button */}
          <Link href="/welcome">
            <Button variant="ghost" size="icon" className="absolute top-4 left-4 rounded-full border border-[#3b2f2f]">
              <HomeIcon className="h-5 w-5 text-[#3b2f2f]" />
            </Button>
          </Link>

          {/* Timer Section */}
          <div className="flex-1 flex flex-col items-center justify-center">
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
                    autoFocus
                  />
                ) : (
                  <span onClick={handleMinutesClick} className="cursor-pointer">
                    {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
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
              <div className="text-red-500 mt-2">On Break</div>
            )}

            {timerPointsEarned > 0 && !isActive && !isOnBreak && (
              <div className="text-green-500 mt-2">
                +{timerPointsEarned} points earned!
              </div>
            )}

            <div className="w-full flex flex-col space-y-2">
              <Button
                variant="outline"
                className="w-full border-[#3b2f2f] text-[#3b2f2f] bg-transparent hover:bg-[#3b2f2f]/10 rounded-md"
                onClick={handleBreak}
              >
                {isOnBreak ? "Resume" : "Break"}
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

          {/* Sidebar */}
          <div className="w-1/3 ml-8">
            {/* Group Selection */}
            <h2 className="text-xl font-bold text-[#3b2f2f] mb-4">Groups</h2>
            <div className="flex flex-col space-y-2 mb-8">
              {groups.length > 0 ? (
                groups.map((group) => (
                  <Button
                    key={group.id}
                    variant={selectedGroup === group.id ? "default" : "outline"}
                    className={`w-full ${
                      selectedGroup === group.id
                        ? "bg-[#3b2f2f] text-white"
                        : "border-[#3b2f2f] text-[#3b2f2f] bg-transparent hover:bg-[#3b2f2f]/10"
                    } rounded-md flex justify-between items-center`}
                    onClick={() => handleGroupChange(group.id)}
                  >
                    {group.name}
                    {selectedGroup === group.id && <CheckIcon className="h-4 w-4 ml-2" />}
                  </Button>
                ))
              ) : (
                <p className="text-[#3b2f2f] text-sm">
                  No groups found. Create or join a group to track your progress.
                </p>
              )}
            </div>

            {/* Leaderboard */}
            <h2 className="text-xl font-bold text-[#3b2f2f] mb-4">Leaderboard</h2>
            {scores.length > 0 ? (
              <ul className="space-y-2">
                {scores.map((entry, index) => (
                  <li key={entry.userId} className="flex justify-between text-[#3b2f2f]">
                    <span>{entry.userName.split(' ')[0]}</span>
                    <span>{entry.score} pts</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#3b2f2f] text-sm">
                No scores yet. Complete a pomodoro session to earn points!
              </p>
            )}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}