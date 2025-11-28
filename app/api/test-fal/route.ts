import { NextResponse } from "next/server"
import { fal } from "@fal-ai/client"

export async function GET() {
  const debugInfo: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    falKeyExists: !!process.env.FAL_KEY,
    falKeyPrefix: process.env.FAL_KEY?.substring(0, 8) || "NOT_SET",
  }

  console.log("[v0] === FAL.AI TEST ===")
  console.log("[v0] FAL_KEY exists:", !!process.env.FAL_KEY)

  if (!process.env.FAL_KEY) {
    return NextResponse.json({
      success: false,
      error: "FAL_KEY environment variable is not set",
      debug: debugInfo,
    })
  }

  try {
    // Configure fal.ai
    fal.config({
      credentials: process.env.FAL_KEY,
    })

    console.log("[v0] Calling fal.ai flux-pro/v1.1 with test prompt...")

    const result = await fal.subscribe("fal-ai/flux-pro/v1.1", {
      input: {
        prompt: "A happy cartoon child waving hello, anime style, bright colors, simple background",
        image_size: "square_hd",
        num_images: 1,
        safety_tolerance: "5",
      },
      logs: true,
    })

    console.log("[v0] fal.ai raw result type:", typeof result)
    console.log("[v0] fal.ai raw result keys:", Object.keys(result as object))
    console.log("[v0] fal.ai raw result:", JSON.stringify(result).substring(0, 500))

    const data = (result as any).data || result
    console.log("[v0] data keys:", Object.keys(data as object))

    const imageUrl = data?.images?.[0]?.url || null
    console.log("[v0] Extracted imageUrl:", imageUrl)

    return NextResponse.json({
      success: !!imageUrl,
      imageUrl,
      debug: {
        ...debugInfo,
        model: "fal-ai/flux-pro/v1.1",
        resultKeys: Object.keys(result as object),
        dataKeys: Object.keys(data as object),
        hasImages: !!data?.images,
        imagesCount: data?.images?.length || 0,
        firstImage: data?.images?.[0] || null,
      },
    })
  } catch (error) {
    console.error("[v0] fal.ai test error:", error)
    return NextResponse.json({
      success: false,
      error: String(error),
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      errorStack: error instanceof Error ? error.stack : undefined,
      debug: debugInfo,
    })
  }
}
