import { type NextRequest, NextResponse } from "next/server"

const DEFAULT_VOICE_ID = "TgnhEILA8UwUqIMi20rp" // Custom InnerVoice voice

// ElevenLabs voice IDs - fallback options
const VOICE_IDS = {
  innervoice: "TgnhEILA8UwUqIMi20rp", // Custom InnerVoice voice (DEFAULT)
  rachel: "21m00Tcm4TlvDq8ikWAM",
  drew: "29vD33N1CtxCmqQRPOHJ",
  bella: "EXAVITQu4vr4xnSDxMaL",
  antoni: "ErXwobaYiN019PkySvjV",
  elli: "MF3mGyEYCl7XYWbV9V6O",
  josh: "TxGEqnHWrfWFTfGW9XjX",
  arnold: "VR6AewLTigWG4xSOukaG",
  charlotte: "XB0fDUnXU5powFXDhCwa",
  matilda: "XrExE9yKIg1WjnnlVkGX",
  brian: "nPczCjzI2devNBz1zQrb",
}

export async function POST(request: NextRequest) {
  try {
    const { text, voiceId } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "ElevenLabs API key not configured" }, { status: 500 })
    }

    const selectedVoiceId = voiceId ? VOICE_IDS[voiceId as keyof typeof VOICE_IDS] || voiceId : DEFAULT_VOICE_ID

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`, {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("ElevenLabs API error:", errorText)
      return NextResponse.json({ error: "Failed to generate speech" }, { status: response.status })
    }

    // Return the audio as a stream
    const audioBuffer = await response.arrayBuffer()

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error("Speech synthesis error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Get available voices
export async function GET() {
  const voices = [
    { id: "innervoice", name: "InnerVoice", description: "Custom Voice", gender: "neutral", isDefault: true },
    { id: "rachel", name: "Rachel", description: "Warm & Friendly", gender: "female" },
    { id: "bella", name: "Bella", description: "Soft & Gentle", gender: "female" },
    { id: "charlotte", name: "Charlotte", description: "Elegant & Clear", gender: "female" },
    { id: "matilda", name: "Matilda", description: "Warm & Expressive", gender: "female" },
    { id: "elli", name: "Elli", description: "Young & Bright", gender: "female" },
    { id: "drew", name: "Drew", description: "Calm & Confident", gender: "male" },
    { id: "josh", name: "Josh", description: "Deep & Friendly", gender: "male" },
    { id: "antoni", name: "Antoni", description: "Warm & Welcoming", gender: "male" },
    { id: "brian", name: "Brian", description: "Clear & Natural", gender: "male" },
    { id: "arnold", name: "Arnold", description: "Strong & Bold", gender: "male" },
  ]

  return NextResponse.json({ voices })
}
