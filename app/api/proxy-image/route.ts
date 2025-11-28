import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json()

    console.log("[v0] Proxy image request for:", imageUrl?.substring(0, 100))

    if (!imageUrl) {
      return NextResponse.json({ error: "No image URL provided" }, { status: 400 })
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; InnerVoice/1.0)",
        Accept: "image/*",
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    console.log("[v0] Proxy fetch response status:", response.status)

    if (!response.ok) {
      console.log("[v0] Proxy fetch failed:", response.statusText)
      return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 })
    }

    const contentType = response.headers.get("content-type") || "image/jpeg"
    const arrayBuffer = await response.arrayBuffer()

    console.log("[v0] Proxy got image, size:", arrayBuffer.byteLength, "type:", contentType)

    // Convert to base64 data URL for guaranteed mobile compatibility
    const base64 = Buffer.from(arrayBuffer).toString("base64")
    const dataUrl = `data:${contentType};base64,${base64}`

    console.log("[v0] Proxy returning base64, length:", dataUrl.length)

    return NextResponse.json({ dataUrl })
  } catch (error) {
    console.error("[v0] Proxy image error:", error)
    return NextResponse.json({ error: "Failed to proxy image" }, { status: 500 })
  }
}
