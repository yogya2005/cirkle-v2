"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileTextIcon, UploadIcon, HomeIcon } from "lucide-react"
import { useState } from "react"

export default function CMPT276() {
  const [activeTab, setActiveTab] = useState<"notes" | "files">("notes")

  return (
    <main className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-cream rounded-lg p-8 border border-tan/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-[#3b2f2f]">CMPT 276</h1>
            <span className="ml-2 text-xs text-[#79747e]">WEEK 2</span>
          </div>
          <Link href="/welcome">
            <Button variant="ghost" size="icon" className="rounded-full">
              <HomeIcon className="h-5 w-5 text-[#3b2f2f]" />
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-medium text-[#3b2f2f] mb-3">Notes</h2>

          <div className="flex space-x-2 mb-3">
            <Button
              variant={activeTab === "notes" ? "default" : "outline"}
              className={activeTab === "notes" ? "bg-[#924747] text-white" : "border-[#3b2f2f] text-[#3b2f2f]"}
              onClick={() => setActiveTab("notes")}
            >
              Notes
            </Button>
            <Button
              variant={activeTab === "files" ? "default" : "outline"}
              className={activeTab === "files" ? "bg-[#924747] text-white" : "border-[#3b2f2f] text-[#3b2f2f]"}
              onClick={() => setActiveTab("files")}
            >
              Files
            </Button>
          </div>

          {activeTab === "notes" && (
            <div className="space-y-2">
              <Button className="w-full justify-start bg-[#924747] hover:bg-[#924747]/90 text-white rounded-md">
                <FileTextIcon className="h-4 w-4 mr-2" />
                Lecture 1
              </Button>
              <Button className="w-full justify-start bg-[#3b2f2f] hover:bg-[#3b2f2f]/90 text-white rounded-md">
                <FileTextIcon className="h-4 w-4 mr-2" />
                Lecture 2
              </Button>
            </div>
          )}

          {activeTab === "files" && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-[#3b2f2f] mb-2">File Uploads</h3>
              <Button className="w-full justify-start bg-[#924747] hover:bg-[#924747]/90 text-white rounded-md">
                <UploadIcon className="h-4 w-4 mr-2" />
                Upload File
              </Button>
              <Button className="w-full justify-start bg-[#3b2f2f] hover:bg-[#3b2f2f]/90 text-white rounded-md">
                <UploadIcon className="h-4 w-4 mr-2" />
                Import URL
              </Button>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-[#f3edf7] rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-[#3b2f2f]">Uses</h3>
            <Button variant="ghost" size="sm" className="text-xs text-[#924747]">
              Close
            </Button>
          </div>
          <div className="mt-2">
            <p className="text-sm text-[#3b2f2f]">Docs API</p>
          </div>
        </div>
      </div>
    </main>
  )
}

