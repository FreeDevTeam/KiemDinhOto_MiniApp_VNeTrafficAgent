export type ResultChannel = "zalo" | "sms" | "email"

export type CheckxePayload = { licensePlate: string; vehicleType: string; vehicleSubType: string; phoneNumber: string; otp?: string }
export type FineCheckResult = { status: "clear" | "fined"; licensePlate: string; vehicleType: string; plateColor: string; violation?: { error: string; time: string; location: string }; detection?: { unit: string; address: string; phone: string }; resolution?: { unit: string; address: string; phone: string } }
export class AuthenticationFailedError extends Error { code = "AUTHENTICATION_FAILED"; constructor() { super("AUTHENTICATION_FAILED") } }

const CACHE_KEY = "dangkiemonline:last-checkxe"
export type CachedCheckxe = CheckxePayload & { resultChannel: ResultChannel }

export async function checkVehicle(payload: CheckxePayload): Promise<FineCheckResult> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const plate = payload.licensePlate.replace(/[.\-\s]/g, "").toUpperCase()
  if (plate === "50A88888" && payload.otp !== "123456") throw new AuthenticationFailedError()
  if (plate === "30A99999" || plate === "50A88888") return { status: "clear", licensePlate: payload.licensePlate, vehicleType: "Ô tô", plateColor: "Nền mầu trắng, chữ và số màu đen" }
  return { status: "fined", licensePlate: payload.licensePlate || "30L-408.53", vehicleType: "Ô tô", plateColor: "Nền mầu trắng, chữ và số màu đen", violation: { error: "16824.6.5.đ.01.Điều khiển xe chạy quá tốc độ quy định từ 10 km/h đến 20 km/h", time: "19:38, 24/07/2026", location: "Km278+400, cao tốc Pháp Vân - Cao Bồ - Mai Sơn - QL45 - Nghi Sơn" }, detection: { unit: "Đội Cảnh sát giao thông đường bộ cao tốc số 3 - Phòng Hướng dẫn TTKS GTĐBĐS - Cục Cảnh Sát Giao Thông", address: "Thôn Hoàng Nê, Xã Ý Yên, Ninh Bình", phone: "02283899666" }, resolution: { unit: "Đội CSGT ĐB số 6 - Phòng Cảnh sát giao thông - Công an Thành phố Hà Nội", address: "số 2 Phạm Hùng, Phường Từ Liêm, Hà Nội", phone: "02437683373" } }
}
export function getCachedCheckxe(): CachedCheckxe | null { if (typeof window === "undefined") return null; try { const value = window.localStorage.getItem(CACHE_KEY); return value ? JSON.parse(value) : null } catch { return null } }
export function saveCachedCheckxe(value: CachedCheckxe) { if (typeof window !== "undefined") window.localStorage.setItem(CACHE_KEY, JSON.stringify(value)) }
export function clearCachedCheckxe() { if (typeof window !== "undefined") window.localStorage.removeItem(CACHE_KEY) }
