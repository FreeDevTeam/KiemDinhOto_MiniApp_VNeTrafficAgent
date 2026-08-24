"use client"

import { CarFront, CircleGauge, Disc3, Gauge, Lightbulb, Wind } from "lucide-react"
import type { InspectionData } from "@/lib/inspection"
import { cn } from "@/lib/utils"

type QuestionKey = "emissionSmoke" | "dashboardLight" | "brakeNoise" | "steeringIssue" | "engineIssue" | "exteriorIssue"

type Question = {
  key: QuestionKey
  icon: typeof Wind
  title: string
  detail?: string
  checks?: string[]
}

const QUESTIONS: Question[] = [
  { key: "emissionSmoke", icon: Wind, title: "Khí thải", detail: "Khi nạp ga lớn, xe có ra khói đen hoặc xanh bất thường không?" },
  { key: "dashboardLight", icon: Lightbulb, title: "Hệ thống đèn", checks: ["Đèn pha và đèn cốt sáng/tối bình thường", "Đèn xi-nhan trái, phải và đèn sự cố hoạt động", "Đèn phanh sáng khi nhấn phanh", "Đèn lùi sáng khi cài số lùi", "Tất cả đèn báo trên bảng điều khiển hoạt động bình thường"] },
  { key: "brakeNoise", icon: Disc3, title: "Kiểm tra hệ thống phanh", checks: ["Phanh chính nhạy, không có tiếng kêu lạ", "Phanh tay chắc chắn khi kéo", "Đèn báo ABS hoạt động bình thường", "Dầu phanh đủ mức, không bị rò rỉ"] },
  { key: "steeringIssue", icon: CarFront, title: "Kiểm tra hệ thống lái", checks: ["Vô-lăng không có độ rơ, quay mượt mà", "Không có tiếng kêu lạ khi đi qua ổ gà", "Lốp xe đủ áp suất, không mòn bất thường", "Mâm xe không bị cong, móp"] },
  { key: "engineIssue", icon: Gauge, title: "Kiểm tra động cơ", checks: ["Động cơ khởi động dễ dàng, không có tiếng kêu lạ", "Dầu động cơ đủ mức, không đen quá", "Nước làm mát đủ mức, không bị rò rỉ", "Ắc quy đạt khoảng 12.6V khi không chạy", "Hệ thống xả không có khói đen hoặc mùi lạ"] },
  { key: "exteriorIssue", icon: CarFront, title: "Kiểm tra nội thất và ngoại thất", checks: ["Kính chắn gió không vỡ, nứt hoặc bị mờ", "Đủ gương chiếu hậu và gương hoạt động tốt", "Cửa xe, khóa cửa mở đóng dễ dàng", "Ghế ngồi điều chỉnh được, dây an toàn tốt", "Còi xe có tiếng rõ ràng"] },
]

function CheckButtons({ value, smoke, onChange }: { value: boolean | null; smoke?: boolean; onChange: (value: boolean) => void }) {
  const good = smoke ? value === false : value === true
  const bad = smoke ? value === true : value === false
  return (
    <div className="flex shrink-0 gap-2" role="group" aria-label="Kết quả kiểm tra">
      <button type="button" onClick={() => onChange(smoke ? false : true)} aria-pressed={good} className={cn("rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors", good ? "bg-success text-success-foreground" : "bg-secondary text-muted-foreground hover:text-foreground")}>{smoke ? "Không có" : "OK"}</button>
      <button type="button" onClick={() => onChange(smoke ? true : false)} aria-pressed={bad} className={cn("rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors", bad ? "bg-destructive text-destructive-foreground" : "bg-secondary text-muted-foreground hover:text-foreground")}>{smoke ? "Có" : "Có lỗi"}</button>
    </div>
  )
}

export function StepTechnical({ data, update }: { data: InspectionData; update: (patch: Partial<InspectionData>) => void }) {
  const setCheck = (key: QuestionKey, itemKey: string, value: boolean) => {
    const checks = { ...data.technicalChecks, [itemKey]: value }
    update({ technicalChecks: checks, [key]: key === "emissionSmoke" ? value : value === false })
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1.5"><h1 className="text-2xl font-bold tracking-tight text-balance">Tự khám xe tại nhà</h1><p className="text-sm leading-relaxed text-muted-foreground">Kiểm tra nhanh những hạng mục quan trọng trước khi đưa xe đi đăng kiểm.</p></header>
      <div className="flex flex-col gap-3">
        {QUESTIONS.map((question) => {
          const Icon = question.icon
          const smoke = question.key === "emissionSmoke"
          const sectionValue = data[question.key]
          const items = question.checks ?? [question.detail ?? ""]
          return <section key={question.key} className={cn("rounded-xl border bg-card p-4 shadow-sm transition-colors", sectionValue === false ? "border-input" : sectionValue === true ? (smoke ? "border-destructive/60" : "border-success/60") : "border-input")}>
            <div className="mb-3 flex items-center gap-3"><span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", sectionValue === true && smoke ? "bg-destructive/15 text-destructive" : "bg-primary/10 text-primary")}><Icon className="size-5" /></span><h2 className="text-sm font-semibold">{question.title}</h2></div>
            <div className="flex flex-col gap-2 border-t pt-3">{items.map((item, index) => { const itemKey = `${question.key}-${index}`; const value = data.technicalChecks[itemKey] ?? null; return <div key={itemKey} className="flex items-center justify-between gap-3 text-sm leading-relaxed"><span className="flex min-w-0 gap-2 text-muted-foreground"><span className="font-semibold text-primary">{question.checks ? `${index + 1}.` : ""}</span><span>{item}</span></span><CheckButtons value={value} smoke={smoke} onChange={(next) => setCheck(question.key, itemKey, next)} /></div> })}</div>
          </section>
        })}
      </div>
    </div>
  )
}
