"use client"

import { ArrowRight, CheckCircle2, Phone, ShieldAlert } from "lucide-react"
import { computeReport, getScoreStatus, type InspectionData, type Issue } from "@/lib/inspection"
import { ScoreGauge } from "@/components/score-gauge"
import { cn } from "@/lib/utils"

function IssueRow({ issue }: { issue: Issue }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border p-4",
        issue.severity === "critical"
          ? "border-destructive/30 bg-destructive/[0.04]"
          : "border-warning/40 bg-warning/[0.06]",
      )}
    >
      <div className="flex items-start gap-2.5">
        <span
          className={cn(
            "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
            issue.severity === "critical"
              ? "bg-destructive text-destructive-foreground"
              : "bg-warning text-warning-foreground",
          )}
        >
          !
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold leading-snug">{issue.title}</span>
          <span className="text-xs leading-relaxed text-muted-foreground">{issue.detail}</span>
        </div>
      </div>
      <button
        type="button"
        className={cn(
          "group flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
          issue.ctaVariant === "primary"
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "border border-primary/30 bg-card text-primary hover:bg-primary/5",
        )}
      >
        {issue.cta}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  )
}

export function StepResult({ data }: { data: InspectionData }) {
  const { score, issues } = computeReport(data)
  const status = getScoreStatus(score)

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col items-center gap-1 text-center">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Sức khỏe đăng kiểm {data.plate ? `· ${data.plate}` : ""}
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-balance">Tỷ lệ đậu đăng kiểm dự kiến</h1>
      </header>

      <ScoreGauge score={score} tone={status.tone} label={status.label} />

      {issues.length > 0 ? (
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-4 text-destructive" />
            <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">
              Các hạng mục cần xử lý gấp
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {issues.map((issue) => (
              <IssueRow key={issue.id} issue={issue} />
            ))}
          </div>
        </section>
      ) : (
        <section className="flex flex-col items-center gap-2 rounded-xl border border-success/40 bg-success/[0.06] p-6 text-center">
          <CheckCircle2 className="size-8 text-success" />
          <p className="text-sm font-semibold">Xe của bạn sẵn sàng đi đăng kiểm!</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Không phát hiện lỗi nghiêm trọng. Đừng quên mang đủ giấy tờ khi ra trung tâm.
          </p>
        </section>
      )}

      {/* 24/7 rescue hotline */}
      <a
        href="tel:1900xxxx"
        className="flex items-center justify-between gap-3 rounded-xl border border-input bg-secondary/60 px-4 py-3"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Phone className="size-4" />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-tight">Cứu hộ 24/7: 1900-xxxx</span>
            <span className="text-xs text-muted-foreground">Lưu ngay phòng sự cố trên đường đi đăng kiểm</span>
          </div>
        </div>
        <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
      </a>
    </div>
  )
}
