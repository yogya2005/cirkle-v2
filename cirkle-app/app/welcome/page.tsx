import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CircleIcon, FileTextIcon, TimerIcon } from "lucide-react"

export default function Welcome() {
  return (
    <main className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-cream rounded-lg p-8 border border-tan/20">
        <div className="flex flex-col items-start space-y-6">
          <h1 className="text-2xl font-bold text-[#3b2f2f]">Welcome, Yogya!</h1>

          <div className="w-full">
            <h2 className="text-lg font-medium text-[#3b2f2f] mb-3">Your Cirkles</h2>

            <div className="grid grid-cols-3 gap-3">
              <Link href="/cmpt276">
                <Button className="w-full h-16 flex flex-col items-center justify-center bg-[#924747] hover:bg-[#924747]/90 text-white rounded-md">
                  <FileTextIcon className="h-5 w-5 mb-1" />
                  <span className="text-xs">CMPT 276</span>
                </Button>
              </Link>

              <Link href="/pomodoro">
                <Button className="w-full h-16 flex flex-col items-center justify-center bg-[#924747] hover:bg-[#924747]/90 text-white rounded-md">
                  <TimerIcon className="h-5 w-5 mb-1" />
                  <span className="text-xs">Pomodoro</span>
                </Button>
              </Link>

              <Link href="/circle">
                <Button className="w-full h-16 flex flex-col items-center justify-center bg-[#924747] hover:bg-[#924747]/90 text-white rounded-md">
                  <CircleIcon className="h-5 w-5 mb-1" />
                  <span className="text-xs">Circle</span>
                </Button>
              </Link>
            </div>
          </div>

          <div className="w-full pt-4">
            <Link href="/create-circle">
              <Button
                variant="outline"
                className="w-full border-[#3b2f2f] text-[#3b2f2f] bg-transparent hover:bg-[#3b2f2f]/10 rounded-md"
              >
                Create New Circle
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

