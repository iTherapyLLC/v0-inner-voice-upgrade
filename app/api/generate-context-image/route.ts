import { type NextRequest, NextResponse } from "next/server"
import { fal } from "@fal-ai/client"

// Simple in-memory cache
const imageCache = new Map<string, string>()

export async function POST(req: NextRequest) {
  try {
    const { phrase, category, emotion, contextHint } = await req.json()

    console.log("[v0] === IMAGE GENERATION START ===")
    console.log("[v0] Phrase:", phrase)
    console.log("[v0] FAL_KEY exists:", !!process.env.FAL_KEY)
    console.log("[v0] FAL_KEY first 10 chars:", process.env.FAL_KEY?.substring(0, 10))

    if (!phrase) {
      return NextResponse.json({ error: "Phrase is required" }, { status: 400 })
    }

    if (!process.env.FAL_KEY) {
      console.log("[v0] ERROR: FAL_KEY not configured!")
      return NextResponse.json({
        imageUrl: null,
        isPlaceholder: true,
        error: "FAL_KEY not configured",
      })
    }

    // Configure fal.ai with credentials
    fal.config({
      credentials: process.env.FAL_KEY,
    })

    // Check cache first
    const cacheKey = `${phrase}-${category || "general"}`
    if (imageCache.has(cacheKey)) {
      console.log("[v0] Returning cached image")
      return NextResponse.json({ imageUrl: imageCache.get(cacheKey) })
    }

    // Build the prompt
    const sceneDescription = contextHint || generateSimplePrompt(phrase, category, emotion)

    const imagePrompt = `Anime style illustration, warm and friendly: ${sceneDescription}. Soft pastel colors, expressive characters, child-friendly. No text.`

    console.log("[v0] Prompt:", imagePrompt.substring(0, 100) + "...")
    console.log("[v0] Calling fal.ai with flux-pro/v1.1 (paid)...")

    const result = await fal.subscribe("fal-ai/flux-pro/v1.1", {
      input: {
        prompt: imagePrompt,
        image_size: "square_hd",
        num_images: 1,
        safety_tolerance: "5", // String "1"-"6", higher = more permissive
      },
      logs: true,
      onQueueUpdate: (update) => {
        console.log("[v0] Queue status:", update.status)
      },
    })

    console.log("[v0] fal.ai raw result:", JSON.stringify(result).substring(0, 300))

    // Extract image URL - fal.ai returns { images: [{ url: "...", content_type: "..." }] }
    const resultData = result.data as { images?: Array<{ url: string }> }

    console.log("[v0] Result data:", JSON.stringify(resultData).substring(0, 300))

    if (resultData?.images && resultData.images.length > 0 && resultData.images[0].url) {
      const imageUrl = resultData.images[0].url
      console.log("[v0] SUCCESS! Image URL:", imageUrl)

      // Cache it
      imageCache.set(cacheKey, imageUrl)

      return NextResponse.json({ imageUrl })
    }

    // If we get here, the structure was unexpected
    console.log("[v0] Unexpected result structure")
    return NextResponse.json({
      imageUrl: null,
      isPlaceholder: true,
      error: "Unexpected response structure",
      debug: JSON.stringify(result).substring(0, 500),
    })
  } catch (error) {
    console.error("[v0] ERROR:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      {
        imageUrl: null,
        isPlaceholder: true,
        error: errorMessage,
      },
      { status: 500 },
    )
  }
}

function generateSimplePrompt(phrase: string, category?: string, emotion?: string): string {
  const lowerPhrase = phrase.toLowerCase()

  // Simple keyword matching for common phrases
  if (lowerPhrase.includes("hello") || lowerPhrase.includes("hi") || lowerPhrase.includes("good morning")) {
    return "A happy anime child waving hello with a big smile, sunny morning scene"
  }
  if (lowerPhrase.includes("hungry") || lowerPhrase.includes("eat") || lowerPhrase.includes("food")) {
    return "An anime child pointing at food with hopeful eyes, kitchen scene with delicious food"
  }
  if (lowerPhrase.includes("help")) {
    return "An anime child looking up at a friendly adult for help, warm supportive scene"
  }
  if (lowerPhrase.includes("play") || lowerPhrase.includes("fun")) {
    return "Happy anime children playing together with toys, bright playroom"
  }
  if (lowerPhrase.includes("tired") || lowerPhrase.includes("sleep")) {
    return "A sleepy anime child yawning, cozy bedroom with soft pillows"
  }
  if (lowerPhrase.includes("happy") || lowerPhrase.includes("excited")) {
    return "An anime child jumping with joy, sparkles around them"
  }
  if (lowerPhrase.includes("sad") || lowerPhrase.includes("cry")) {
    return "An anime child being comforted by a caring adult, gentle supportive scene"
  }
  if (lowerPhrase.includes("look") || lowerPhrase.includes("see")) {
    return "An anime child excitedly pointing at something amazing, sharing a discovery"
  }
  if (lowerPhrase.includes("want") || lowerPhrase.includes("please") || lowerPhrase.includes("can i")) {
    return "An anime child politely asking for something with hopeful expression"
  }
  if (lowerPhrase.includes("thank")) {
    return "An anime child showing gratitude with a warm smile and slight bow"
  }
  if (lowerPhrase.includes("sorry")) {
    return "An anime child with an apologetic expression, making amends"
  }
  if (lowerPhrase.includes("no") || lowerPhrase.includes("stop") || lowerPhrase.includes("don't")) {
    return "An anime child calmly but clearly saying no, setting a boundary respectfully"
  }

  // Default - create a scene based on the phrase
  return `A warm anime scene showing a situation where someone would say "${phrase}". Friendly characters, supportive environment.`
}
