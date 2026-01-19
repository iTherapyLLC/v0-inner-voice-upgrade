import { type NextRequest, NextResponse } from "next/server"
import {
  generateLiteracySSML,
  generateBlendingSSML,
  getPhoneticSpelling,
  supportsSSML,
} from "@/lib/literacy/ipa-phonemes"

const EMOTION_SETTINGS = {
  happy: { stability: 0.3, similarity_boost: 0.7, style: 0.7 },
  calm: { stability: 0.8, similarity_boost: 0.5, style: 0.2 },
  excited: { stability: 0.2, similarity_boost: 0.8, style: 0.8 },
  frustrated: { stability: 0.6, similarity_boost: 0.4, style: 0.5 },
  sad: { stability: 0.7, similarity_boost: 0.4, style: 0.3 },
  neutral: { stability: 0.5, similarity_boost: 0.5, style: 0.0 },
}

// Literacy-specific pronunciation modes
type LiteracyMode = 'letter' | 'syllable' | 'word' | 'blend' | 'sentence' | null

const LANGUAGE_VOICE_IDS: Record<string, string> = {
  en: "EXAVITQu4vr4xnSDxMaL", // Sarah - English
  he: "ODq5zmih8GrVes37Dizd", // Hebrew voice (if available, fallback to multilingual)
  es: "EXAVITQu4vr4xnSDxMaL", // Use multilingual model
  fr: "EXAVITQu4vr4xnSDxMaL",
  de: "EXAVITQu4vr4xnSDxMaL",
  ar: "EXAVITQu4vr4xnSDxMaL",
  zh: "EXAVITQu4vr4xnSDxMaL",
  ja: "EXAVITQu4vr4xnSDxMaL",
  ko: "EXAVITQu4vr4xnSDxMaL",
  ru: "EXAVITQu4vr4xnSDxMaL",
}

export async function POST(req: NextRequest) {
  try {
    const {
      text,
      voiceId = "EXAVITQu4vr4xnSDxMaL",
      speed = 1.0,
      emotion = "neutral",
      language = "en",
      // Literacy-specific options
      literacyMode = null as LiteracyMode,
      isLongVowel = false,
      useSSML = false,
    } = await req.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const emotionSettings = EMOTION_SETTINGS[emotion as keyof typeof EMOTION_SETTINGS] || EMOTION_SETTINGS.neutral

    // Use turbo model for SSML support, or multilingual for non-English
    let modelId = "eleven_monolingual_v1"
    if (language !== "en") {
      modelId = "eleven_multilingual_v2"
    } else if (useSSML || literacyMode) {
      // Use turbo v2 for SSML support with literacy drills
      modelId = "eleven_turbo_v2"
    }

    const effectiveVoiceId = language !== "en" ? LANGUAGE_VOICE_IDS[language] || voiceId : voiceId

    // Process text for literacy modes
    let processedText = text
    if (literacyMode && supportsSSML(modelId)) {
      switch (literacyMode) {
        case 'letter':
          processedText = generateLiteracySSML(text, 'letter', { isLongVowel, speed })
          break
        case 'syllable':
          processedText = generateLiteracySSML(text, 'syllable', { isLongVowel, speed })
          break
        case 'word':
          processedText = generateLiteracySSML(text, 'word', { speed })
          break
        case 'blend':
          processedText = generateBlendingSSML(text)
          break
        case 'sentence':
        default:
          processedText = text
          break
      }
    } else if (literacyMode && !supportsSSML(modelId)) {
      // Fallback to phonetic spelling when SSML not supported
      processedText = getPhoneticSpelling(text)
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${effectiveVoiceId}`, {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text: processedText,
        model_id: modelId,
        voice_settings: {
          ...emotionSettings,
          speed: speed,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("ElevenLabs error:", error)
      return NextResponse.json({ error: "Speech generation failed" }, { status: 500 })
    }

    const audioBuffer = await response.arrayBuffer()

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    })
  } catch (error) {
    console.error("Speech API error:", error)
    return NextResponse.json({ error: "Failed to generate speech" }, { status: 500 })
  }
}
