"use client"

import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

interface CircleButtonProps {
  icon: LucideIcon
  label: string
  variant?: "primary" | "secondary"
  onClick?: () => void
}

export function CircleButton({ icon: Icon, label, variant = "primary", onClick }: CircleButtonProps) {
  const bgColor = variant === "primary" ? "bg-[#924747]" : "bg-[#3b2f2f]"
  const hoverColor = variant === "primary" ? "hover:bg-[#924747]/90" : "hover:bg-[#3b2f2f]/90"

  return (
    <Button
      className={`w-full h-16 flex flex-col items-center justify-center ${bgColor} ${hoverColor} text-white rounded-md`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5 mb-1" />
      <span className="text-xs">{label}</span>
    </Button>
  )
}

