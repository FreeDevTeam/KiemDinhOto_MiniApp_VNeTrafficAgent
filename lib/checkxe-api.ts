export type ResultChannel = "zalo" | "sms" | "email"

export type CheckxePayload = {
  licensePlate: string
  vehicleType: string
  vehicleSubType: string
  phoneNumber: string
}

const CACHE_KEY = "dangkiemonline:last-checkxe"

export type CachedCheckxe = CheckxePayload & { resultChannel: ResultChannel }

export async function checkVehicle(payload: CheckxePayload) {
  const response = await fetch("https://ttdk.com.vn/Checkxe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!response.ok) throw new Error("Không thể kết nối hệ thống kiểm tra. Vui lòng thử lại.")
  return response.headers.get("content-type")?.includes("application/json") ? response.json() : response.text()
}

export function getCachedCheckxe(): CachedCheckxe | null {
  if (typeof window === "undefined") return null
  try {
    const value = window.localStorage.getItem(CACHE_KEY)
    return value ? (JSON.parse(value) as CachedCheckxe) : null
  } catch { return null }
}

export function saveCachedCheckxe(value: CachedCheckxe) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(CACHE_KEY, JSON.stringify(value))
}

export function clearCachedCheckxe() {
  if (typeof window !== "undefined") window.localStorage.removeItem(CACHE_KEY)
}
