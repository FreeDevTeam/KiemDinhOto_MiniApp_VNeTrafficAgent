"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const TONE_COLOR: Record<string, string> = {
  success: "var(--success)",
  warning: "var(--warning)",
  danger: "var(--destructive)",
}

export function ScoreGauge({
  score,
  tone,
  label,
}: {
  score: number
  tone: "success" | "warning" | "danger"
  label: string
}) {
  const [progress, setProgress] = useState(0)
  const radius = 84
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  useEffect(() => {
    const t = setTimeout(() => setProgress(score), 120)
    return () => clearTimeout(t)
  }, [score])

  return (
    <div className="relative mx-auto flex size-52 items-center justify-center">
      <svg className="size-full -rotate-90" viewBox="0 0 200 200" aria-hidden="true">
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="var(--secondary)"
          strokeWidth="16"
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={TONE_COLOR[tone]}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-5xl font-extrabold tabular-nums">{progress}%</span>
        <span
          className={cn(
            "mt-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
            tone === "success" && "bg-success/15 text-success",
            tone === "warning" && "bg-warning/20 text-warning-foreground",
            tone === "danger" && "bg-destructive/10 text-destructive",
          )}
        >
          {label}
        </span>
      </div>
    </div>
  )
}
