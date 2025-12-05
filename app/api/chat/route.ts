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
}

interface GridInfo {
  columns: number
  rows: number
  totalButtons: number
}

async function resolveButtonWithLLM(
  text: string,
  buttons: ButtonWithPosition[],
  gridInfo: GridInfo,
  actionType: "delete" | "update" | "find" = "delete",
): Promise<Command | null> {
  console.log("[v0] LLM resolution starting for:", text)
  console.log("[v0] Grid size:", gridInfo.rows, "x", gridInfo.columns, "with", buttons.length, "buttons")

  // Group buttons by row for the prompt
  const buttonsByRow: Record<number, ButtonWithPosition[]> = {}
  for (const b of buttons) {
    if (!buttonsByRow[b.row]) buttonsByRow[b.row] = []
    buttonsByRow[b.row].push(b)
  }

  // Sort each row by column
  for (const row of Object.keys(buttonsByRow)) {
    buttonsByRow[Number(row)].sort((a, b) => a.col - b.col)
  }

  const rowDescriptions = Object.entries(buttonsByRow)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([row, btns]) => {
      return `Row ${row}: ${btns.map((b) => `"${b.label}" (id:${b.id}, col:${b.col})`).join(" | ")}`
    })
    .join("\n")

  const prompt = `You are helping identify a button to ${actionType} in an AAC communication app.

GRID LAYOUT (${gridInfo.rows} rows x ${gridInfo.columns} columns max, ${buttons.length} total buttons):

${rowDescriptions}

IMPORTANT RULES:
- Row 1 = TOP/FIRST row
- Row ${gridInfo.rows} = BOTTOM/LAST/FINAL row
- Column 1 = LEFTMOST/FIRST
- Last column in a row = RIGHTMOST/LAST button in that row
- "last button on final row" = rightmost button in row ${gridInfo.rows}
- "second button" = column 2
- "middle button" = center column of that row

USER REQUEST: "${text}"

Think step by step:
1. What row is being referenced? (first, last, second, etc.)
2. What column/position in that row? (first, last, second, etc.)
3. Which button matches?

Respond with ONLY valid JSON (no markdown, no explanation):
{"buttonId": "exact-id-from-list", "label": "the label", "reason": "brief reason"}

If unsure, respond: {"buttonId": null, "error": "why"}`

  try {
    const { text: responseText } = await generateText({
      model: "anthropic/claude-sonnet-4-5-20250929",
      prompt,
      maxTokens: 150,
    })

    console.log("[v0] LLM raw response:", responseText)

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*?\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      console.log("[v0] LLM parsed response:", parsed)

      if (parsed.buttonId && parsed.buttonId !== null) {
        // Verify the button ID exists
        const buttonExists = buttons.some((b) => b.id === parsed.buttonId)
        if (buttonExists) {
          console.log("[v0] LLM successfully resolved to button:", parsed.buttonId)
          return {
            type: actionType === "delete" ? "delete_button" : "update_button",
            payload: {
              target: parsed.buttonId,
              buttonLabel: parsed.label,
              resolvedByLLM: true,
              reason: parsed.reason,
            },
          }
        } else {
          console.log("[v0] LLM returned non-existent button ID:", parsed.buttonId)
        }
      } else if (parsed.error) {
        console.log("[v0] LLM could not resolve:", parsed.error)
      }
    } else {
      console.log("[v0] Could not parse JSON from LLM response")
    }
  } catch (error) {
    console.error("[v0] LLM resolution error:", error)
  }

  return null
}

function parseCommand(
  text: string,
  buttons?: ButtonWithPosition[],
  deletionHistory?: ButtonWithPosition[],
): Command | null {
  const lower = text.toLowerCase()

  // Watch First mode
  if (/(?:turn on|enable|start|activate)\s*watch first/i.test(lower) || /watch first\s*(?:mode\s*)?on/i.test(lower)) {
    return { type: "toggle_watch_first", payload: { enabled: true } }
  }
  if (/(?:turn off|disable|stop)\s*watch first/i.test(lower) || /watch first\s*(?:mode\s*)?off/i.test(lower)) {
    return { type: "toggle_watch_first", payload: { enabled: false } }
  }

  // Model mode
  if (/(?:turn on|enable|start)\s*model(?:ing)?\s*mode/i.test(lower)) {
    return { type: "toggle_model_mode", payload: { enabled: true } }
  }
  if (/(?:turn off|disable|stop)\s*model(?:ing)?\s*mode/i.test(lower)) {
    return { type: "toggle_model_mode", payload: { enabled: false } }
  }

  // Restore buttons
  const restorePatterns = [
    /(?:bring|get)\s*(?:that|the|it)\s*back/i,
    /restore\s*(?:the\s*)?(?:last\s*)?(?:button|deleted)/i,
    /undo\s*(?:the\s*)?(?:last\s*)?delete/i,
    /(?:bring|put)\s*back\s*(?:the\s*)?(?:last\s*)?button/i,
  ]

  const isRestoreRequest = restorePatterns.some((p) => p.test(lower))

  if (isRestoreRequest && deletionHistory && deletionHistory.length > 0) {
    const lastDeleted = deletionHistory[deletionHistory.length - 1]
    console.log("[v0] Restore request detected, last deleted:", lastDeleted)

    return {
      type: "restore_button",
      payload: { target: lastDeleted.id, buttonLabel: lastDeleted.label },
    }
  }

  if (isRestoreRequest && (!deletionHistory || deletionHistory.length === 0)) {
    return { type: "conversation" }
  }

  if (
    /(?:bring|get|show|restore)\s*(?:back\s*)?(?:all\s*)?(?:my\s*)?buttons?/i.test(lower) ||
    /unfocus|unzoom/i.test(lower)
  ) {
    return { type: "restore_buttons" }
  }

  // Focus learning - extract word
  const focusMatch = lower.match(/(?:focus|practice|learn|zoom)\s*(?:on\s*)?\s*[""']?([^""']+?)[""']?\s*$/i)
  if (focusMatch && focusMatch[1] && focusMatch[1].length < 50) {
    return { type: "focus_learning", payload: { word: focusMatch[1].trim() } }
  }

  // Create button - extract text
  const createPatterns = [
    /(?:make|create|add)\s*(?:a\s*)?(?:new\s*)?button\s*(?:for|that says?|saying)?\s*[""']?(.+?)[""']?\s*$/i,
    /(?:i\s*(?:need|want)\s*(?:a\s*)?button)\s*(?:for|that says?)?\s*[""']?(.+?)[""']?\s*$/i,
    /button\s*(?:for|that says?)\s*[""']?(.+?)[""']?\s*$/i,
  ]

  for (const pattern of createPatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const buttonText = match[1].trim().replace(/[""']/g, "")
      if (buttonText.length > 0 && buttonText.length < 100) {
        const category = categorizePhrase(buttonText)
        const color = CATEGORY_COLORS[category] || "#14b8a6"
        const icon = suggestIcon(buttonText, category)
        const emotion = suggestEmotion(buttonText, category)
        return {
          type: "create_button",
          payload: { text: buttonText, category, color, icon, emotion },
        }
      }
    }
  }

  // Language change
  const languagePatterns = [
    /(?:change|switch|set)\s*(?:the\s*)?(?:app\s*)?(?:language\s*)?to\s+(\w+)/i,
    /(?:speak|talk)\s*(?:in\s*)?(\w+)/i,
  ]

  for (const pattern of languagePatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const langName = match[1].toLowerCase()
      for (const [code, name] of Object.entries(SUPPORTED_LANGUAGES)) {
        if (name.toLowerCase().includes(langName) || code.toLowerCase() === langName) {
          return { type: "change_language", payload: { languageCode: code, languageName: name } }
        }
      }
    }
  }

  // Voice changes
  if (/(?:change|switch|make)\s*(?:the\s*)?voice/i.test(lower)) {
    if (/female|woman|girl/i.test(lower)) {
      return { type: "change_voice", payload: { voice: "female" } }
    }
    if (/male|man|boy/i.test(lower)) {
      return { type: "change_voice", payload: { voice: "male" } }
    }
    if (/fast|quick/i.test(lower)) {
      return { type: "change_voice", payload: { speed: "fast" } }
    }
    if (/slow/i.test(lower)) {
      return { type: "change_voice", payload: { speed: "slow" } }
    }
  }

  // Help - but NOT if it's about a button
  if (!lower.includes("button") && (/^help$/i.test(lower.trim()) || /what can you do/i.test(lower))) {
    return { type: "help" }
  }

  // Return null for everything else - let LLM handle it
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
      return `Done! I changed the icon on the "${command.payload?.target}" button.`
    case "navigate":
      return `Taking you there now!`
    case "change_voice":
      return `Okay, I changed the voice for you!`
    case "focus_learning":
      return `Let's focus on "${command.payload?.word}"! I've hidden the other buttons so we can practice just this one.`
    case "restore_buttons":
      return `Welcome back! All your buttons are here now.`
    case "change_language":
      return `I've switched the app to ${command.payload?.languageName}!`
    case "toggle_watch_first":
      return command.payload?.enabled ? `Watch First mode is now ON!` : `Watch First mode is now OFF.`
    case "toggle_model_mode":
      return command.payload?.enabled ? `Modeling mode is now ON!` : `Modeling mode is now OFF.`
    case "help":
      return `I'm here to help! I can make buttons, delete buttons, change the voice, and more. Just tell me what you need!`
    case "restore_button":
      return `Done! I restored the "${command.payload?.buttonLabel}" button for you.`
    default:
      return `I'm here to help!`
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, currentButtons, conversationHistory, gridInfo, deletionHistory } = body

    console.log("[v0] ========== NEW REQUEST ==========")
    console.log("[v0] User message:", message)

    if (!message) {
      console.log("[v0] ERROR: No message in request body. Body keys:", Object.keys(body))
      return NextResponse.json({ error: "Missing message" }, { status: 400 })
    }

    const buttons: ButtonWithPosition[] = (currentButtons || []).map(
      (
        b: { id: string; label: string; text: string; row: number; col: number; color?: string; category?: string },
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
      }),
    )

    const grid: GridInfo = {
      rows: gridInfo?.rows || 1,
      columns: gridInfo?.columns || 6,
      totalButtons: buttons.length,
    }

    console.log("[v0] Buttons received:", buttons.length)
    console.log("[v0] Grid info:", grid)

    const lastRowButtons = buttons.filter((b) => b.row === grid.rows)
    console.log(
      "[v0] Last row buttons:",
      lastRowButtons.map((b) => `"${b.label}" (col ${b.col})`),
    )

    let command = parseCommand(message, buttons, deletionHistory)
    console.log("[v0] Pattern match result:", command?.type || "null")

    const lower = message.toLowerCase()
    const isDeleteRequest = /delete|remove|get rid of|erase|take away|trash/i.test(lower)
    const isUpdateRequest = /change|update|edit|modify/i.test(lower) && /button/i.test(lower)

    if (command === null && buttons.length > 0) {
      if (isDeleteRequest) {
        console.log("[v0] Attempting LLM resolution for DELETE request")
        command = await resolveButtonWithLLM(message, buttons, grid, "delete")
        console.log(
          "[v0] LLM resolution result:",
          command?.type || "null",
          command?.payload ? JSON.stringify(command.payload) : "",
        )
      } else if (isUpdateRequest) {
        console.log("[v0] Attempting LLM resolution for UPDATE request")
        command = await resolveButtonWithLLM(message, buttons, grid, "update")
        console.log("[v0] LLM resolution result:", command?.type || "null")
      }
    }

    if (command !== null && command.type !== "conversation") {
      console.log("[v0] Returning command:", command.type)
      return NextResponse.json({
        response: getCommandResponse(command),
        command,
      })
    }

    console.log("[v0] Using conversational AI fallback")

    const systemPrompt = `You are a helpful assistant for InnerVoice, an AAC (Augmentative and Alternative Communication) app. You help teachers, parents, and therapists.

You can help with:
- Creating buttons: "make a button for I'm hungry"
- Deleting buttons: "remove the goodbye button"
- Changing voice settings
- General questions about AAC and communication

Current grid has ${buttons.length} buttons in ${grid.rows} rows.

Be warm, friendly, and concise. If you're not sure what the user wants, ask for clarification.`

    try {
      const { text: aiResponse } = await generateText({
        model: "anthropic/claude-sonnet-4-5-20250929",
        system: systemPrompt,
        prompt: message,
        maxTokens: 200,
      })

      console.log("[v0] Conversational response:", aiResponse.substring(0, 100))

      return NextResponse.json({
        response: aiResponse,
        command: { type: "conversation" },
      })
    } catch (aiError) {
      console.error("[v0] Conversational AI error:", aiError)
      return NextResponse.json({
        response: "I'm here to help! What would you like to do?",
        command: { type: "conversation" },
      })
    }
  } catch (error) {
    console.error("[v0] POST handler error:", error)
    return NextResponse.json(
      {
        response: "Sorry, something went wrong. Please try again.",
        command: { type: "conversation" },
      },
      { status: 500 },
    )
  }
}
