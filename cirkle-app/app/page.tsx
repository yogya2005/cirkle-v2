import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-cream rounded-lg p-8 border border-tan/20">
        <div className="flex flex-col items-start space-y-4">
          <h1 className="text-3xl font-bold text-[#cda584]">Welcome To Cirkle!</h1>
          <p className="text-sm text-[#3b2f2f] opacity-70">YOUR COMPLETE STUDY/WORK INTERFACE</p>

          <div className="w-full pt-6">
            <Link href="/welcome">
              <Button className="w-full bg-[#924747] hover:bg-[#924747]/90 text-white rounded-md">Get Started</Button>
            </Link>
          </div>

          <div className="w-full">
            <Link href="/login">
              <Button
                variant="outline"
                className="w-full border-[#3b2f2f] text-[#3b2f2f] bg-transparent hover:bg-[#3b2f2f]/10 rounded-md"
              >
                I Already Have an Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

