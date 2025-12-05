import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"
import { SUPPORTED_LANGUAGES } from "@/app/api/translate/route"
import { categorizePhrase, CATEGORY_COLORS, suggestIcon, suggestEmotion } from "@/lib/categorize-phrase"

interface Command {
  type:
    | "create_button"
    | "delete_button"
    | "update_button"
    | "navigate"
    | "change_voice"
    | "help"
    | "conversation"
    | "focus_learning"
    | "restore_buttons"
    | "show_story"
    | "change_language"
    | "toggle_watch_first"
    | "toggle_model_mode"
    | "show_modeling_stats"
    | "show_me_how"
    | "get_modeling_suggestion"
    | "change_icon"
    | "restore_button"
  payload?: Record<string, unknown>
}

interface ButtonWithPosition {
  id: string
  label: string
  text: string
  row: number
  col: number
  index: number
  color?: string
  category?: string
  icon?: string
}

interface GridInfo {
  columns: number
  rows: number
  totalButtons: number
}

async function understandUserIntent(
  userMessage: string,
  buttons: ButtonWithPosition[],
  gridInfo: GridInfo,
  deletionHistory?: ButtonWithPosition[],
): Promise<Command | null> {
  console.log("[v0] Understanding user intent:", userMessage)

  // Build a rich description of the grid with all attributes
  const buttonsByRow: Record<number, ButtonWithPosition[]> = {}
  for (const b of buttons) {
    if (!buttonsByRow[b.row]) buttonsByRow[b.row] = []
    buttonsByRow[b.row].push(b)
  }
  for (const row of Object.keys(buttonsByRow)) {
    buttonsByRow[Number(row)].sort((a, b) => a.col - b.col)
  }

  // Create detailed button descriptions including visual attributes
  const buttonDescriptions = buttons.map((b) => ({
    id: b.id,
    label: b.label,
    text: b.text,
    row: b.row,
    col: b.col,
    color: b.color || "teal",
    icon: b.icon || "default",
    category: b.category || "general",
  }))

  const gridDescription = Object.entries(buttonsByRow)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([row, btns]) => {
      const rowNum = Number(row)
      const rowPosition = rowNum === 1 ? "TOP/FIRST" : rowNum === gridInfo.rows ? "BOTTOM/LAST/FINAL" : `ROW ${rowNum}`
      return `${rowPosition} ROW (row ${row}): ${btns.map((b) => `[${b.label}] id="${b.id}" col=${b.col} color=${b.color || "teal"}`).join(" → ")}`
    })
    .join("\n")

  const recentlyDeleted =
    deletionHistory && deletionHistory.length > 0
      ? `\n\nRECENTLY DELETED (can be restored): ${deletionHistory.map((b) => `"${b.label}" (id: ${b.id})`).join(", ")}`
      : ""

  const prompt = `You are an AI assistant for InnerVoice, an AAC app. Your job is to understand what the user wants and return a structured command.

CURRENT BUTTON GRID (${gridInfo.rows} rows × ${gridInfo.columns} columns, ${buttons.length} buttons):

${gridDescription}
${recentlyDeleted}

COMPLETE BUTTON DATA:
${JSON.stringify(buttonDescriptions, null, 2)}

USER REQUEST: "${userMessage}"

UNDERSTANDING NATURAL LANGUAGE:
People describe buttons in MANY ways. You must understand:

POSITION REFERENCES:
- "last/final/bottom row" = row ${gridInfo.rows}
- "first/top row" = row 1
- "second row" = row 2
- "last button", "rightmost", "end of row" = highest col in that row
- "first button", "leftmost", "start of row" = col 1
- "second button", "second from left" = col 2
- "middle button" = center column
- "second to last", "before the last" = second highest col

FUZZY LABEL MATCHING:
- "the hungry button" → matches "I'm hungry"
- "the sad one" → matches "I'm sad"
- "morning button" → matches "Good morning"
- "bathroom button" → matches "I need to use the bathroom"
- "the goodbye one" → matches "Bye!"

COLOR REFERENCES:
- "the orange button" → match by color
- "the blue one on the left" → color + position
- "pink buttons" → all buttons with pink color

VISUAL/ICON REFERENCES:
- "the smiley face button" → happy/smile icon
- "the heart one" → love/heart icon
- "the question mark" → question/help icon

ACTION WORDS TO RECOGNIZE:
DELETE: remove, delete, get rid of, erase, take away, trash, kill, drop, lose
CREATE: make, create, add, new, I need, I want
UPDATE: change, edit, modify, update, fix, rename
RESTORE: bring back, restore, undo, get back, return

RESPOND WITH ONLY VALID JSON (no markdown, no explanation):

For DELETE:
{"action": "delete_button", "buttonId": "exact-id", "buttonLabel": "the label", "confidence": "high/medium/low", "reason": "why this button"}

For CREATE:
{"action": "create_button", "text": "button text", "category": "Social/Requests/Commands/Refusals/Questions/Feelings"}

For RESTORE:
{"action": "restore_button", "buttonId": "id-to-restore", "buttonLabel": "the label"}

For VOICE CHANGE:
{"action": "change_voice", "voice": "male/female", "speed": "slow/normal/fast"}

For HELP/QUESTION:
{"action": "help", "topic": "what they asked about"}

For UNCLEAR (need more info):
{"action": "clarify", "question": "ask ONE simple question"}

For CONVERSATION (not a command):
{"action": "conversation", "response": "your friendly response"}

IMPORTANT:
- If the user says "that button" or "the one" without context, ask which one
- If multiple buttons could match, pick the MOST LIKELY one based on context
- For position-based requests, use the grid layout above
- Always return the EXACT button ID from the data, never make up IDs
- Be generous in interpretation - if it could reasonably mean a button, find it`

  try {
    const { text: responseText } = await generateText({
      model: "anthropic/claude-sonnet-4-5-20250929",
      prompt,
      maxTokens: 300,
    })

    console.log("[v0] LLM raw response:", responseText)

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*?\}/)
    if (!jsonMatch) {
      console.log("[v0] No JSON found in response")
      return null
    }

    const parsed = JSON.parse(jsonMatch[0])
    console.log("[v0] Parsed intent:", parsed)

    switch (parsed.action) {
      case "delete_button":
        if (parsed.buttonId) {
          // Verify the button exists
          const exists = buttons.some((b) => b.id === parsed.buttonId)
          if (exists) {
            return {
              type: "delete_button",
              payload: {
                target: parsed.buttonId,
                buttonLabel: parsed.buttonLabel,
                confidence: parsed.confidence,
                reason: parsed.reason,
              },
            }
          } else {
            console.log("[v0] Button ID not found:", parsed.buttonId)
          }
        }
        break

      case "create_button":
        if (parsed.text) {
          const category = parsed.category || categorizePhrase(parsed.text)
          const color = CATEGORY_COLORS[category] || "#14b8a6"
          const icon = suggestIcon(parsed.text, category)
          const emotion = suggestEmotion(parsed.text, category)
          return {
            type: "create_button",
            payload: { text: parsed.text, category, color, icon, emotion },
          }
        }
        break

      case "restore_button":
        if (parsed.buttonId) {
          return {
            type: "restore_button",
            payload: { target: parsed.buttonId, buttonLabel: parsed.buttonLabel },
          }
        }
        break

      case "change_voice":
        return {
          type: "change_voice",
          payload: { voice: parsed.voice, speed: parsed.speed },
        }

      case "help":
        return { type: "help", payload: { topic: parsed.topic } }

      case "clarify":
        // Return as conversation with the clarifying question
        return {
          type: "conversation",
          payload: { response: parsed.question, needsClarification: true },
        }

      case "conversation":
        return {
          type: "conversation",
          payload: { response: parsed.response },
        }
    }
  } catch (error) {
    console.error("[v0] LLM understanding error:", error)
  }

  return null
}

function parseObviousCommand(text: string, deletionHistory?: ButtonWithPosition[]): Command | null {
  const lower = text.toLowerCase().trim()

  // Watch First mode - very specific patterns
  if (/(?:turn on|enable)\s*watch first/i.test(lower) || /watch first\s*on/i.test(lower)) {
    return { type: "toggle_watch_first", payload: { enabled: true } }
  }
  if (/(?:turn off|disable)\s*watch first/i.test(lower) || /watch first\s*off/i.test(lower)) {
    return { type: "toggle_watch_first", payload: { enabled: false } }
  }

  // Restore all buttons
  if (/(?:show|restore|bring back)\s*all\s*(?:my\s*)?buttons?/i.test(lower) || /^unfocus$/i.test(lower)) {
    return { type: "restore_buttons" }
  }

  // Focus/practice word
  const focusMatch = lower.match(/(?:focus|practice|zoom)\s*(?:on\s*)?\s*[""']?(\w+)[""']?\s*$/i)
  if (focusMatch && focusMatch[1]) {
    return { type: "focus_learning", payload: { word: focusMatch[1].trim() } }
  }

  // Language change
  for (const [code, name] of Object.entries(SUPPORTED_LANGUAGES)) {
    if (lower.includes(`speak ${name.toLowerCase()}`) || lower.includes(`change to ${name.toLowerCase()}`)) {
      return { type: "change_language", payload: { languageCode: code, languageName: name } }
    }
  }

  return null
}

function getCommandResponse(command: Command): string {
  switch (command.type) {
    case "create_button":
      return `Done! I made a button that says "${command.payload?.text}". You'll see it on the Talk page!`
    case "delete_button": {
      const label = command.payload?.buttonLabel || command.payload?.target
      return `Done! I removed the "${label}" button for you.`
    }
    case "update_button":
      return `Got it! I changed that button.`
    case "change_icon":
      return `Done! I changed the icon!`
    case "navigate":
      return `Taking you there now!`
    case "change_voice":
      return `Okay, I changed the voice for you!`
    case "focus_learning":
      return `Let's focus on "${command.payload?.word}"! I've hidden the other buttons so we can practice.`
    case "restore_buttons":
      return `All your buttons are back!`
    case "change_language":
      return `I've switched to ${command.payload?.languageName}!`
    case "toggle_watch_first":
      return command.payload?.enabled ? `Watch First mode is ON!` : `Watch First mode is OFF.`
    case "toggle_model_mode":
      return command.payload?.enabled ? `Modeling mode is ON!` : `Modeling mode is OFF.`
    case "help":
      return `I can help you make buttons, delete buttons, change the voice, and more. Just tell me what you need in your own words!`
    case "restore_button":
      return `Done! I brought back the "${command.payload?.buttonLabel}" button.`
    case "conversation":
      return (command.payload?.response as string) || `I'm here to help!`
    default:
      return `I'm here to help!`
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const message = body.message || body.text
    const currentButtons = body.currentButtons || body.customButtons || []
    const gridInfo = body.gridInfo || body.grid
    const conversationHistory = body.conversationHistory || []
    const deletionHistory = body.deletionHistory || []

    console.log("[v0] ========== NEW REQUEST ==========")
    console.log("[v0] User message:", message)

    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 })
    }

    // Build button list with positions
    const buttons: ButtonWithPosition[] = currentButtons.map(
      (
        b: {
          id: string
          label: string
          text: string
          row: number
          col: number
          color?: string
          category?: string
          icon?: string
        },
        i: number,
      ) => ({
        id: b.id,
        label: b.label,
        text: b.text,
        row: b.row,
        col: b.col,
        index: i + 1,
        color: b.color,
        category: b.category,
        icon: b.icon,
      }),
    )

    const grid: GridInfo = {
      rows: gridInfo?.rows || Math.max(...buttons.map((b) => b.row), 1),
      columns: gridInfo?.columns || 6,
      totalButtons: buttons.length,
    }

    console.log("[v0] Buttons:", buttons.length, "Grid:", grid.rows, "x", grid.columns)

    // Step 1: Check for obvious commands that don't need LLM
    const obviousCommand = parseObviousCommand(message, deletionHistory)
    if (obviousCommand) {
      console.log("[v0] Obvious command matched:", obviousCommand.type)
      return NextResponse.json({
        response: getCommandResponse(obviousCommand),
        command: obviousCommand,
      })
    }

    // Step 2: Use LLM to understand user intent (the magic!)
    console.log("[v0] Using LLM to understand intent...")
    const command = await understandUserIntent(message, buttons, grid, deletionHistory)

    if (command) {
      console.log("[v0] LLM understood command:", command.type)
      return NextResponse.json({
        response: getCommandResponse(command),
        command,
      })
    }

    // Step 3: Fallback - LLM couldn't understand, ask for clarification
    console.log("[v0] LLM could not understand, using fallback")
    return NextResponse.json({
      response: "I'm not sure what you mean. Could you tell me which button you're talking about?",
      command: { type: "conversation" },
    })
  } catch (error) {
    console.error("[v0] POST error:", error)
    return NextResponse.json(
      {
        response: "Oops! Something went wrong. Please try again.",
        command: { type: "conversation" },
      },
      { status: 500 },
    )
  }
}
