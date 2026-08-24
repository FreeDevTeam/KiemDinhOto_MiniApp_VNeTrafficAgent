export type RegistrationStatus = "vneid" | "notarized" | "cavet" | "bank"
export type InsuranceStatus = "expired" | "none" | "valid"
export type DriverLicenseSource = "vneid" | "card"
export type OwnerIdSource = "vneid" | "card" | "company"

export type VehicleCategory = "private" | "commercial" | "truck" | "tractor" | "special"

export type ResultChannel = "zalo" | "sms" | "email"

export type InspectionData = {
  plate: string
  vehicleCategory: VehicleCategory | ""
  vehicleType: string
  phoneNumber: string
  resultChannel: ResultChannel
  registration: RegistrationStatus | null
  chassisNumber: string
  vehicleVerificationCccd: string
  vehicleVerificationPassword: string
  vehicleVerified: boolean
  driverLicenseSource: DriverLicenseSource | null
  driverLicenseNumber: string
  driverLicenseVerificationCccd: string
  driverLicenseVerified: boolean
  driverLicenseImageUrl: string
  driverLicensePreview: string
  insurance: InsuranceStatus | null
  insuranceCertificateNumber: string
  insuranceExpiryDate: string
  insuranceCompany: string
  physicalInsurance: boolean | null
  insuranceVerified: boolean
  insuranceImageUrl: string
  insurancePreview: string
  ownerIdSource: OwnerIdSource | null
  emissionSmoke: boolean | null
  dashboardLight: boolean | null
  brakeNoise: boolean | null
  steeringIssue: boolean | null
  engineIssue: boolean | null
  exteriorIssue: boolean | null
  technicalChecks: Record<string, boolean | null>
}

export const initialData: InspectionData = {
  plate: "",
  vehicleCategory: "",
  vehicleType: "",
  phoneNumber: "",
  resultChannel: "zalo",
  registration: null,
  chassisNumber: "",
  vehicleVerificationCccd: "",
  vehicleVerificationPassword: "",
  vehicleVerified: false,
  driverLicenseSource: null,
  driverLicenseNumber: "",
  driverLicenseVerificationCccd: "",
  driverLicenseVerified: false,
  driverLicenseImageUrl: "",
  driverLicensePreview: "",
  insurance: null,
  insuranceCertificateNumber: "",
  insuranceExpiryDate: "",
  insuranceCompany: "",
  physicalInsurance: null,
  insuranceVerified: false,
  insuranceImageUrl: "",
  insurancePreview: "",
  ownerIdSource: null,
  emissionSmoke: null,
  dashboardLight: null,
  brakeNoise: null,
  steeringIssue: null,
  engineIssue: null,
  exteriorIssue: null,
  technicalChecks: {},
}

export type LeadCategory = "insurance" | "emission" | "maintenance" | "document"

export type Issue = {
  id: string
  category: LeadCategory
  severity: "critical" | "warning"
  title: string
  detail: string
  cta: string
  ctaVariant: "primary" | "outline"
}

/**
 * Computes the "health report": an expected pass rate (0-100) and the list of
 * issues (leads) surfaced from the self-check answers.
 */
export function computeReport(data: InspectionData): {
  score: number
  issues: Issue[]
} {
  let score = 100
  const issues: Issue[] = []

  if (data.insurance === "expired") {
    score -= 30
    issues.push({
      id: "insurance",
      category: "insurance",
      severity: "critical",
      title: "Bảo hiểm TNDS đã hết hạn hoặc không rõ",
      detail:
        "Không có bảo hiểm trách nhiệm dân sự còn hiệu lực, xe sẽ bị từ chối kiểm định ngay tại cổng.",
      cta: "Mua nhanh & Nhận ấn chỉ điện tử",
      ctaVariant: "primary",
    })
  }

  if (data.emissionSmoke) {
    score -= 22
    issues.push({
      id: "emission",
      category: "emission",
      severity: "critical",
      title: "Rủi ro trượt khí thải cao",
      detail:
        "Xe có khói đen/xanh bất thường — nguy cơ rớt tiêu chuẩn khí thải rất cao.",
      cta: "Tìm garage xử lý khí thải gần nhất",
      ctaVariant: "outline",
    })
  }

  if (data.dashboardLight) {
    score -= 18
    issues.push({
      id: "dashboard",
      category: "maintenance",
      severity: "critical",
      title: "Đèn cảnh báo trên taplo đang sáng",
      detail:
        "Đèn Check Engine / ABS báo lỗi hệ thống. Hầu hết trung tâm sẽ đánh trượt hạng mục này.",
      cta: "Đặt lịch kiểm tra & xử lý lỗi taplo",
      ctaVariant: "outline",
    })
  }

  if (data.brakeNoise) {
    score -= 12
    issues.push({
      id: "brake",
      category: "maintenance",
      severity: "warning",
      title: "Hệ thống phanh có dấu hiệu bất thường",
      detail: "Tiếng kêu hoặc nhao lái khi phanh cho thấy má phanh mòn / lệch lực phanh — hạng mục kiểm tra bắt buộc.",
      cta: "Đặt lịch kiểm tra phanh",
      ctaVariant: "outline",
    })
  }

  if (data.steeringIssue) {
    score -= 10
    issues.push({ id: "steering", category: "maintenance", severity: "warning", title: "Hệ thống lái cần được kiểm tra", detail: "Độ rơ vô-lăng, lốp hoặc hệ thống treo có dấu hiệu bất thường.", cta: "Đặt lịch kiểm tra hệ thống lái", ctaVariant: "outline" })
  }

  if (data.engineIssue) {
    score -= 10
    issues.push({ id: "engine", category: "maintenance", severity: "warning", title: "Động cơ có dấu hiệu bất thường", detail: "Hãy kiểm tra dầu, nước làm mát, ắc quy và hệ thống xả trước khi đăng kiểm.", cta: "Đặt lịch kiểm tra động cơ", ctaVariant: "outline" })
  }

  if (data.exteriorIssue) {
    score -= 6
    issues.push({ id: "exterior", category: "maintenance", severity: "warning", title: "Nội thất hoặc ngoại thất cần kiểm tra", detail: "Kiểm tra kính, gương, cửa, ghế, dây an toàn và còi xe.", cta: "Xem hướng dẫn xử lý", ctaVariant: "outline" })
  }

  if (data.registration === "bank") {
    issues.push({
      id: "document",
      category: "document",
      severity: "warning",
      title: "Xe đang thế chấp ngân hàng",
      detail:
        "Bạn cần xin Giấy biên nhận giữ bản chính đăng ký xe (còn hiệu lực) từ ngân hàng để thay cho cà vẹt gốc.",
      cta: "Xem hướng dẫn xin giấy biên nhận",
      ctaVariant: "outline",
    })
  }

  score = Math.max(15, Math.min(100, Math.round(score)))

  return { score, issues }
}

export function getScoreStatus(score: number): {
  label: string
  tone: "success" | "warning" | "danger"
} {
  if (score >= 85) return { label: "Khả năng đậu cao", tone: "success" }
  if (score >= 60) return { label: "Nguy cơ rớt trung bình", tone: "warning" }
  return { label: "Nguy cơ rớt cao", tone: "danger" }
}
