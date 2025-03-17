import Link from "next/link";
import { Button } from "@/components/ui/button";


export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAF3E9] flex flex-col items-center justify-center p-8 text-center">
      {/* Large Heading */}
      <h1 className="text-9xl font-bold text-[#cda584] leading-tight">
        Welcome To <br /> Cirkle!
      </h1>

      {/* Subtitle */}
      <p className="mt-4 text-4xl font-semibold text-[#A98973] tracking-wide">
        COLLABORATIVE STUDY FOR{" "}
        <span className="text-[#924747] italic">'BETTER RESULTS'</span>
      </p>

      {/* Google Login Button */}
      
      <div className="mt-12">
      <Link href="/welcome">
        <Button className="flex items-center space-x-3 bg-[#924747] hover:bg-[#924747]/90 text-white px-8 py-5 rounded-full text-xl">
          <img src="/google.png" alt="Google Icon" className="text-4xl h-6 w-6"/>
          <span>Login with Google</span>
        </Button>
        </Link>
      </div>
    </main>
  );
}
