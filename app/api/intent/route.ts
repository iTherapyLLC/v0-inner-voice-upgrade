import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { userInput, context } = await req.json()

    const systemPrompt = `You are InnerVoice, a smart AAC assistant. Parse the user's request and return JSON.

CURRENT BUTTONS ON BOARD:
${context?.currentButtons?.map((b: { label: string; text: string }) => `- "${b.label}" (says: "${b.text}")`).join("\n") || "No custom buttons yet"}

USER SAID: "${userInput}"

ACTIONS YOU CAN TAKE:
1. "create_button" - Make a new button
2. "delete_button" - Remove an existing button (MUST match a button name from the list above)
3. "update_button" - Change an existing button's text, label, or icon
4. "change_voice" - Modify voice settings
5. "navigate" - Go to another page
6. "help" - Provide assistance

CRITICAL RULES FOR DELETE:
- ONLY delete if user clearly says "remove", "delete", "get rid of", or "take away"
- The deleteTarget MUST exactly match a button label or text from the CURRENT BUTTONS list
- If the button doesn't exist in the list, return action: "help" and explain the button wasn't found
- NEVER create a button when user asks to delete

CRITICAL RULES FOR UPDATE:
- Use when user says "change", "edit", "modify", "rename", or "update" a button
- updateTarget must match an existing button
- Include newLabel, newText, or newIcon as needed

Return ONLY this JSON structure:
{
  "action": "create_button" | "delete_button" | "update_button" | "change_voice" | "navigate" | "help",
  "phrase": "full phrase for new button text",
  "label": "short 1-3 word label for new button",
  "category": "social" | "requests" | "commands" | "refusals" | "questions" | "feelings",
  "emotion": "happy" | "calm" | "excited" | "frustrated" | "neutral",
  "icon": "heart" | "hand" | "star" | "home" | "help" | "stop" | "play" | "sparkles" | "smile" | "thumbs-up",
  "deleteTarget": "exact label of button to delete",
  "updateTarget": "exact label of button to update",
  "newLabel": "new label if updating",
  "newText": "new text/phrase if updating",
  "newIcon": "new icon if updating",
  "voiceChange": "faster" | "slower" | "boy" | "girl" | null,
  "navigateTo": "home" | "talk" | "avatar" | "voice" | "practice" | "progress" | null,
  "response": "friendly 1-2 sentence confirmation"
}

EXAMPLES:
User: "make a button that says I want water"
→ {"action": "create_button", "phrase": "I want water", "label": "Water", "category": "requests", "emotion": "neutral", "icon": "hand", "response": "Done! I made a Water button for you."}

User: "remove the water button"
→ {"action": "delete_button", "deleteTarget": "Water", "response": "Done! I removed the Water button."}

User: "change the water button to say juice instead"
→ {"action": "update_button", "updateTarget": "Water", "newText": "I want juice", "newLabel": "Juice", "response": "Done! I changed Water to Juice."}

User: "delete that communicates that"
→ {"action": "delete_button", "deleteTarget": "that communicates that", "response": "Done! I removed that button."}

User: "change the icon on help to a star"
→ {"action": "update_button", "updateTarget": "Help", "newIcon": "star", "response": "Done! I changed the Help button icon to a star."}`

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
