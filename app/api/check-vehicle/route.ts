import { NextResponse } from "next/server"

const API_URL = "https://station-bridge-crawler-csgt.captain.ttdk.com.vn"

type RequestBody = { bienSoXe: string; cccd: string; otp?: string }

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    })
    const payload = await response.json()
    return NextResponse.json(payload, { status: response.status })
  } catch {
    return NextResponse.json({ success: false, data: { ok: false, errorCode: "UNEXPECTED_ERROR", message: "Failed to fetch" } }, { status: 502 })
  }
}
