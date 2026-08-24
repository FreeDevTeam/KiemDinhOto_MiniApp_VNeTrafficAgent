export type UploadResult = {
  url: string
}

export type VerificationKind = "vehicle" | "license" | "insurance"

export type VerificationPayload = {
  kind: VerificationKind
  [key: string]: string | boolean
}

export type DocumentSubmitPayload = {
  licensePlate: string
  phoneNumber: string
  registrationSource: string
  driverLicenseSource: string
  driverLicenseImageUrl: string
  insuranceStatus: string
  insuranceImageUrl: string
  ownerIdSource: string
}

const UPLOAD_URL = "https://ttdk.com.vn/api/upload"
const VERIFY_URLS: Record<VerificationKind, string> = {
  vehicle: "https://ttdk.com.vn/api/verify-vehicle",
  license: "https://ttdk.com.vn/api/verify-license",
  insurance: "https://ttdk.com.vn/api/verify-insurance",
}

export async function verifyDocument(kind: VerificationKind, payload: Omit<VerificationPayload, "kind">) {
  const response = await fetch(VERIFY_URLS[kind], {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  const result = (await response.json().catch(() => ({}))) as { success?: boolean; verified?: boolean; message?: string; error?: string }
  if (!response.ok || result.success === false || result.verified === false) {
    throw new Error(result.message ?? result.error ?? "Thông tin xác thực không chính xác")
  }
  return result
}

export async function uploadDocumentImage(file: File): Promise<UploadResult> {
  const base64 = await fileToBase64(file)
  const response = await fetch(UPLOAD_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data: base64, fileName: file.name, contentType: file.type }) })
  if (!response.ok) throw new Error("Upload ảnh thất bại")
  const result = (await response.json()) as { url?: string; data?: { url?: string } }
  const url = result.url ?? result.data?.url
  if (!url) throw new Error("API upload không trả về URL ảnh")
  return { url }
}

export async function submitDocuments(payload: DocumentSubmitPayload) {
  try {
    await fetch("https://ttdk.com.vn/Checkxe/documents", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
  } catch {
    // Document collection is intentionally non-blocking.
  }
}

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "")
    reader.onerror = () => reject(reader.error ?? new Error("Không thể đọc ảnh"))
    reader.readAsDataURL(file)
  })
}
