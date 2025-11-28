import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

// Language codes and names mapping
export const SUPPORTED_LANGUAGES: Record<string, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  zh: "Chinese (Simplified)",
  ja: "Japanese",
  ko: "Korean",
  ar: "Arabic",
  hi: "Hindi",
  ru: "Russian",
  vi: "Vietnamese",
  tl: "Tagalog",
  pl: "Polish",
  uk: "Ukrainian",
  nl: "Dutch",
  sv: "Swedish",
  he: "Hebrew",
  th: "Thai",
}

// Voice language codes for ElevenLabs/speech synthesis
export const VOICE_LANGUAGE_CODES: Record<string, string> = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
  pt: "pt-BR",
  zh: "zh-CN",
  ja: "ja-JP",
  ko: "ko-KR",
  ar: "ar-SA",
  hi: "hi-IN",
  ru: "ru-RU",
  vi: "vi-VN",
  tl: "tl-PH",
  pl: "pl-PL",
  uk: "uk-UA",
  nl: "nl-NL",
  sv: "sv-SE",
  he: "he-IL",
  th: "th-TH",
}

interface TranslationRequest {
  buttons: Array<{ id: string; label: string; text: string }>
  targetLanguage: string
}

export async function POST(request: NextRequest) {
  try {
    const { buttons, targetLanguage }: TranslationRequest = await request.json()

    if (!buttons || !targetLanguage) {
      return NextResponse.json({ error: "Missing buttons or targetLanguage" }, { status: 400 })
    }

    // If translating to English, just return the original
    if (targetLanguage === "en") {
      const translations: Record<string, { label: string; text: string }> = {}
      for (const button of buttons) {
        translations[button.id] = { label: button.label, text: button.text }
      }
      return NextResponse.json({ translations, language: targetLanguage })
    }

    const languageName = SUPPORTED_LANGUAGES[targetLanguage] || targetLanguage

    // Create the translation prompt
    const buttonsJson = buttons.map((b) => ({
      id: b.id,
      label: b.label,
      text: b.text,
    }))

    const { text: responseText } = await generateText({
      model: "anthropic/claude-sonnet-4-20250514",
      system: `You are a professional translator. Translate the following AAC (Augmentative and Alternative Communication) button labels and phrases to ${languageName}.

IMPORTANT RULES:
1. Keep translations natural and conversational - these are for daily communication
2. For labels, keep them SHORT (1-3 words max)
3. For text, translate the full phrase naturally as a native speaker would say it
4. Maintain the same emotion/tone as the original
5. Return ONLY valid JSON, no other text

Output format (JSON only):
{
  "translations": {
    "buttonId": { "label": "translated label", "text": "translated text" },
    ...
  }
}`,
      prompt: `Translate these buttons to ${languageName}:\n${JSON.stringify(buttonsJson, null, 2)}`,
      maxTokens: 4000,
      temperature: 0.3,
    })

    // Parse the response
    try {
      // Extract JSON from response (handle markdown code blocks)
      let jsonStr = responseText
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (jsonMatch) {
        jsonStr = jsonMatch[1]
      }

      const parsed = JSON.parse(jsonStr.trim())
      return NextResponse.json({
        translations: parsed.translations,
        language: targetLanguage,
        languageName,
      })
    } catch {
      console.error("Failed to parse translation response:", responseText)
      return NextResponse.json({ error: "Failed to parse translation response" }, { status: 500 })
    }
  } catch (error) {
    console.error("Translation error:", error)
    return NextResponse.json({ error: "Translation failed" }, { status: 500 })
  }
}
