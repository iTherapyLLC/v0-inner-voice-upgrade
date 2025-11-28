import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { userInput, context } = await req.json()

    const systemPrompt = `You are InnerVoice, the world's most intuitive AAC assistant for exhausted parents and gestalt language learners.

Current context:
- Child's name: ${context?.childName || "the child"}
- Recent phrases used: ${context?.recentPhrases?.join(", ") || "none yet"}
- Current voice: ${context?.voice || "Sarah calm"}
- Button size: ${context?.buttonSize || "large"}

The parent/educator just said: "${userInput}"

Determine what they want and return ONLY valid JSON:

{
  "action": "create_button" | "delete_button" | "change_voice" | "change_size" | "rescue" | "grandma_link" | "undo" | "navigate" | "help" | "unknown",
  "phrase": "the full phrase for the button (if creating)",
  "label": "short 1-3 word button label",
  "category": "social" | "requests" | "commands" | "refusals" | "questions" | "feelings",
  "emotion": "happy" | "calm" | "excited" | "frustrated" | "neutral",
  "voiceChange": "faster" | "slower" | "boy" | "girl" | null,
  "sizeChange": "huge" | "big" | "normal" | null,
  "deleteTarget": "label of button to delete if action is delete_button",
  "navigateTo": "home" | "talk" | "avatar" | "voice" | null,
  "response": "friendly confirmation message to show the user"
}

RULES:
- If they say ANYTHING like "make a button", "add one for", "I need one that says" → action: create_button
- Infer the best category automatically based on the phrase meaning
- Infer emotion from phrase content
- Generate a short, clear label (1-3 words max)
- If unclear, make your best guess - NEVER ask clarifying questions
- response should be warm, brief, confirming what you did
- For navigation: "take me to buttons" or "go to talk" → action: navigate
- For voice changes: "make it faster", "use a boy voice" → action: change_voice
- For rescue/help during meltdown: "help", "emergency", "meltdown" → action: rescue`

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      messages: [{ role: "user", content: systemPrompt }],
    })

    const responseText = message.content[0].type === "text" ? message.content[0].text : ""

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const intent = JSON.parse(jsonMatch[0])
      return NextResponse.json(intent)
    }

    return NextResponse.json({ action: "unknown", response: "I didn't quite catch that. Try again?" })
  } catch (error) {
    console.error("Intent parsing error:", error)
    return NextResponse.json({ action: "unknown", response: "Something went wrong. Try again?" }, { status: 500 })
  }
}
