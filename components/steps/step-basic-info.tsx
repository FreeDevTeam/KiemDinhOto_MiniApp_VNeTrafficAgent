import { CarFront, Info } from "lucide-react"
import type { InspectionData, ResultChannel, VehicleCategory } from "@/lib/inspection"
import { cn } from "@/lib/utils"

const VEHICLE_TYPES: Record<VehicleCategory, string[]> = {
  private: ["Xe dưới 6 chỗ", "Xe từ 6 đến 11 chỗ", "Xe trên 11 chỗ"],
  commercial: ["Xe dưới 6 chỗ", "Xe từ 6 đến 11 chỗ", "Xe trên 11 chỗ"],
  truck: ["Xe tải dưới 3 tấn", "Xe tải từ 3 đến 8 tấn", "Xe tải trên 8 tấn"],
  tractor: ["Đầu kéo kéo sơ-mi rơ-moóc"],
  special: ["Xe chuyên dụng"],
}

const CATEGORY_LABELS: Record<VehicleCategory, string> = {
  private: "Xe không kinh doanh vận tải",
  commercial: "Xe kinh doanh vận tải",
  truck: "Xe tải",
  tractor: "Xe đầu kéo",
  special: "Xe chuyên dụng",
}

const CHANNELS: { value: ResultChannel; label: string }[] = [
  { value: "zalo", label: "Zalo" },
  { value: "sms", label: "SMS" },
]

export function StepBasicInfo({ data, update }: { data: InspectionData; update: (patch: Partial<InspectionData>) => void }) {
  const types = data.vehicleCategory ? VEHICLE_TYPES[data.vehicleCategory] : []

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1.5 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-balance">Thông tin xe</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">Nhập thông tin để kiểm tra các hạng mục đăng kiểm quan trọng.</p>
      </header>

      <div className="flex flex-col gap-2">
        <label htmlFor="plate" className="text-sm font-semibold">Biển số xe</label>
        <div className="mx-auto w-full max-w-[280px] rounded-xl border-[3px] border-foreground bg-card p-1 shadow-sm">
          <input id="plate" value={data.plate} onChange={(e) => update({ plate: e.target.value.toUpperCase() })} placeholder="51K-123.45" inputMode="text" autoComplete="off" className="w-full rounded-lg bg-card py-2.5 text-center font-mono text-2xl font-extrabold tracking-widest text-foreground placeholder:text-muted-foreground/40 focus:outline-none" />
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-input bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2 text-primary"><CarFront className="size-5" /><span className="text-sm font-semibold text-foreground">Loại xe</span></div>
        <p className="flex items-center gap-1 text-xs leading-relaxed text-muted-foreground"><Info className="size-3 shrink-0" />Chọn đúng hạng mục để áp dụng tiêu chí phù hợp.</p>
        <div className="flex flex-col gap-2">
          <label htmlFor="vehicle-category" className="text-sm font-semibold">Hạng mục</label>
          <select id="vehicle-category" value={data.vehicleCategory} onChange={(e) => update({ vehicleCategory: e.target.value as VehicleCategory, vehicleType: "" })} className={cn("h-12 w-full rounded-xl border border-input bg-card px-4 text-base font-medium focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15", data.vehicleCategory ? "text-foreground" : "text-muted-foreground")}>
            <option value="" disabled>Chọn hạng mục xe</option>
            {(Object.keys(CATEGORY_LABELS) as VehicleCategory[]).map((category) => <option key={category} value={category}>{CATEGORY_LABELS[category]}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="vehicle-type" className="text-sm font-semibold">Phân loại</label>
          <select id="vehicle-type" value={data.vehicleType} disabled={!data.vehicleCategory} onChange={(e) => update({ vehicleType: e.target.value })} className={cn("h-12 w-full rounded-xl border border-input bg-card px-4 text-base font-medium focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50", data.vehicleType ? "text-foreground" : "text-muted-foreground")}>
            <option value="" disabled>Chọn phân loại xe</option>
            {types.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-input bg-card p-4 shadow-sm">
        <h3 className="text-sm font-semibold">Cách nhận kết quả</h3>
        <div className="flex flex-wrap gap-4" role="radiogroup" aria-label="Kênh nhận kết quả">
          {CHANNELS.map((channel) => <label key={channel.value} className="flex cursor-pointer items-center gap-2 text-sm font-medium"><input type="radio" name="result-channel" value={channel.value} checked={data.resultChannel === channel.value} onChange={() => update({ resultChannel: channel.value })} className="size-4 accent-primary" />{channel.label}</label>)}
        </div>
        <div className="flex flex-col gap-2"><label htmlFor="phone" className="text-sm font-semibold">Số điện thoại</label><input id="phone" value={data.phoneNumber} onChange={(e) => update({ phoneNumber: e.target.value.replace(/[^0-9]/g, "") })} placeholder="Nhập số điện thoại" inputMode="tel" autoComplete="tel" className="h-12 rounded-xl border border-input bg-card px-4 text-base focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15" /></div>
      </div>
    </div>
  )
}
