import Link from "next/link";
import { Button } from "@/components/ui/button";


export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAF3E9] flex flex-col items-center justify-center p-8 text-center">
      {/* Large Heading */}
      <h1 className="text-7xl font-bold text-[#cda584] leading-tight">
        Welcome To <br /> Cirkle!
      </h1>

      {/* Subtitle */}
      <p className="mt-4 text-2xl font-semibold text-[#A98973] tracking-wide">
        COLLABORATIVE STUDY FOR{" "}
        <span className="text-[#924747] italic">'BETTER RESULTS'</span>
      </p>

      {/* Google Login Button */}
      <div className="mt-12">
        <Button className="flex items-center space-x-3 bg-[#924747] hover:bg-[#924747]/90 text-white px-6 py-3 rounded-full text-xl">
          <img src="/google.png" alt="Google Icon" className="text-2xl h-5 w-5"/>
          <span>Login with Google</span>
        </Button>
      </div>
    </main>
  );
}
