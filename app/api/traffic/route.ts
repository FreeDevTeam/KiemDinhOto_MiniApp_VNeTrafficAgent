import { NextResponse } from "next/server"

const API_URL = "https://station-bridge-crawler-csgt.captain.ttdk.com.vn"
const API_KEY = "0a4bcb9b-bae6-43d2-aec7-d15cade09675"

export async function POST(request: Request) {
  const body = await request.json() as { action?: "login" | "lookup"; username?: string; otp?: string; token?: string; plateNumber?: string; vehicleType?: number; phoneNumber?: string }
  const path = body.action === "lookup" ? "/ThirdParty/EAgentTraffic/user/lookupWarningForVehicle" : "/ThirdParty/EAgentTraffic/user/requestLogin"
  const upstream = await fetch(`${API_URL}${path}`, { method: "POST", headers: { apikey: API_KEY, authorization: body.token ? `Bearer ${body.token}` : "", "Content-Type": "application/json" }, body: JSON.stringify(body.action === "lookup" ? { plateNumber: body.plateNumber, vehicleType: body.vehicleType, phoneNumber: body.phoneNumber } : { username: body.username, ...(body.otp ? { otp: body.otp } : {}) }), cache: "no-store" })
  const response = await upstream.json().catch(() => ({ statusCode: upstream.status, error: "UPSTREAM_ERROR", message: "Không đọc được phản hồi API" }))
  return NextResponse.json(response, { status: upstream.status })
}
