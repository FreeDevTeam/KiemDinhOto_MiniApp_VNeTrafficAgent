"use client"

import { useState } from "react"
import { Check, FileCheck2, LockKeyhole, X } from "lucide-react"
import type { InspectionData } from "@/lib/inspection"
import { verifyDocument } from "@/lib/document-api"

export function StepDocuments({ data, update }: { data: InspectionData; update: (patch: Partial<InspectionData>) => void }) {
  const [open, setOpen] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const verify = async () => {
    if (!agreed || !data.vehicleVerificationCccd.trim()) return
    setLoading(true); setError("")
    try {
      await verifyDocument("vehicle", { chassisNumber: data.chassisNumber, cccd: data.vehicleVerificationCccd, account: data.vehicleVerificationCccd })
      update({ vehicleVerified: true }); setOpen(false)
    } catch (err) { setError(err instanceof Error ? err.message : "Kết nối thất bại") } finally { setLoading(false) }
  }
  return <div className="flex flex-col gap-5">
    <header className="flex flex-col gap-1.5"><h1 className="text-2xl font-bold tracking-tight text-balance">Kết nối tài khoản giao thông</h1><p className="text-sm leading-relaxed text-muted-foreground">Kết nối tài khoản giao thông để trợ lý tự động tra cứu mỗi ngày</p></header>
    <section className="flex flex-col gap-4 rounded-xl border border-input bg-card p-4 shadow-sm"><div className="flex items-center gap-2"><span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><FileCheck2 className="size-5" /></span><div><h2 className="text-sm font-semibold">Tự động tra cứu thông tin với Trợ lý ảo</h2><p className="text-xs text-muted-foreground">Trợ lý ảo sẽ đại diện bạn kết nối và tự động tra cứu dữ liệu mỗi ngày.</p></div></div><p className="text-sm leading-relaxed text-muted-foreground">Kết nối tài khoản giao thông để nhận thông báo miễn phí khi xe có vi phạm. Dữ liệu của bạn được bảo mật và chỉ sử dụng cho mục đích tra cứu.</p><button type="button" onClick={() => { setError(""); setAgreed(false); setOpen(true) }} disabled={!data.chassisNumber.trim()} className="h-11 rounded-xl bg-primary text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40">Kết nối ngay</button>{data.vehicleVerified && <p className="flex items-center gap-1 text-xs font-semibold text-success"><Check className="size-4" />Đã kết nối và sẵn sàng tra cứu</p>}</section>
    {open && <div className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground/40 p-4 sm:items-center"><section role="dialog" aria-modal="true" aria-labelledby="assistant-title" className="w-full max-w-md rounded-2xl bg-card p-5 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><LockKeyhole className="size-5" /></div><h2 id="assistant-title" className="text-lg font-bold">Tự động tra cứu thông tin với Trợ lý ảo</h2></div><button type="button" onClick={() => setOpen(false)} aria-label="Đóng popup" className="rounded-lg p-2 hover:bg-secondary"><X className="size-5" /></button></div><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Trợ lý ảo sẽ đại diện bạn kết nối và tự động tra cứu dữ liệu cho phiên này. Dữ liệu được bảo mật tuyệt đối.</p><input value={data.vehicleVerificationCccd} onChange={(e) => update({ vehicleVerificationCccd: e.target.value })} placeholder="Nhập số CCCD" aria-label="Số CCCD" className="mt-4 h-11 w-full rounded-xl border border-input px-3 text-sm" /><label className="mt-4 flex items-start gap-2 text-xs"><input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 size-4 accent-primary" /><span>Tôi đồng ý ủy quyền và đã đọc <a href="#terms" className="font-semibold text-primary underline">Thỏa thuận ủy quyền &amp; Bảo mật dữ liệu</a>.</span></label>{error && <p role="alert" className="mt-3 text-sm font-semibold text-destructive">{error}</p>}<button type="button" onClick={verify} disabled={!agreed || !data.vehicleVerificationCccd.trim() || loading} className="mt-4 h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-40">{loading ? "Đang kết nối..." : "Ủy quyền và kết nối"}</button></section></div>}
  </div>
}
