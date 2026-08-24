import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const STEPS = ["Thông tin", "Giấy tờ", "Kỹ thuật", "Kết quả"]

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="grid grid-cols-4 items-start" aria-label={`Bước ${current + 1} trên ${STEPS.length}`}>
      {STEPS.map((label, i) => {
        const done = i < current
        const active = i === current
        return <div key={label} className="relative flex min-w-0 flex-col items-center text-center">
          {i < STEPS.length - 1 && <span className={cn("absolute left-1/2 top-3.5 h-1 w-full -translate-y-1/2 rounded-full", done ? "bg-primary" : "bg-secondary")} aria-hidden="true" />}
          <span className={cn("relative z-10 flex size-7 items-center justify-center rounded-full text-xs font-semibold", done && "bg-primary text-primary-foreground", active && "bg-primary text-primary-foreground ring-4 ring-primary/15", !done && !active && "bg-secondary text-muted-foreground")}>{done ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}</span>
          <span className={cn("mt-2 w-full text-center text-[11px] font-medium leading-tight", active ? "text-primary" : "text-muted-foreground")}>{label}</span>
        </div>
      })}
    </div>
  )
}
