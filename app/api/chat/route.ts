import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"
import { SUPPORTED_LANGUAGES } from "@/app/api/translate/route"

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
  payload?: Record<string, unknown>
}

interface ButtonWithPosition {
  id: string
  label: string
  text: string
  row: number
  col: number
  index: number
}

interface GridInfo {
  columns: number
  rows: number
  totalButtons: number
}

function parseCommand(
  text: string,
  buttons?: ButtonWithPosition[],
  gridInfo?: GridInfo,
  conversationHistory?: { role: string; content: string }[],
): Command | null {
  const lower = text.toLowerCase()

  const watchFirstOnPatterns = [
    /(?:turn on|enable|start|activate) watch first/i,
    /watch first (?:mode )?on/i,
    /(?:i want to|let me) watch first/i,
  ]

  for (const pattern of watchFirstOnPatterns) {
    if (pattern.test(lower)) {
      return { type: "toggle_watch_first", payload: { enabled: true } }
    }
  }

  const watchFirstOffPatterns = [
    /(?:turn off|disable|stop|deactivate) watch first/i,
    /watch first (?:mode )?off/i,
    /(?:no more|stop) watch(?:ing)? first/i,
  ]

  for (const pattern of watchFirstOffPatterns) {
    if (pattern.test(lower)) {
      return { type: "toggle_watch_first", payload: { enabled: false } }
    }
  }

  const modelModeOnPatterns = [
    /(?:turn on|enable|start|activate) model(?:ing)? mode/i,
    /model(?:ing)? mode on/i,
    /(?:slow down|slower) (?:for )?(?:learning|modeling)/i,
  ]

  for (const pattern of modelModeOnPatterns) {
    if (pattern.test(lower)) {
      return { type: "toggle_model_mode", payload: { enabled: true } }
    }
  }

  const modelModeOffPatterns = [
    /(?:turn off|disable|stop|deactivate) model(?:ing)? mode/i,
    /model(?:ing)? mode off/i,
    /(?:normal|regular) speed/i,
  ]

  for (const pattern of modelModeOffPatterns) {
    if (pattern.test(lower)) {
      return { type: "toggle_model_mode", payload: { enabled: false } }
    }
  }

  const statsPatterns = [
    /(?:show|display|what are|tell me) (?:my )?(?:modeling )?stats/i,
    /how (?:much|many) (?:have i|did i|did we) (?:model|practice)/i,
    /modeling (?:progress|tracker|dashboard)/i,
    /how am i doing/i,
  ]

  for (const pattern of statsPatterns) {
    if (pattern.test(lower)) {
      return { type: "show_modeling_stats" }
    }
  }

  const showMeHowPatterns = [
    /(?:show me how|demonstrate|teach me)(?: to)?(?: model)?\s*(?:asking for |saying |the phrase |to say )?[""']?(.+?)[""']?$/i,
    /how (?:do i|should i|can i) (?:model|teach)\s*[""']?(.+?)[""']?$/i,
    /(?:demonstrate|show)(?: me)? modeling (?:for|of)\s*[""']?(.+?)[""']?$/i,
  ]

  for (const pattern of showMeHowPatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      return {
        type: "show_me_how",
        payload: { phrase: match[1].trim().replace(/[""']/g, "") },
      }
    }
  }

  // Updated modeling suggestion patterns
  const modelingSuggestionPatterns = [
    /(?:what|which) (?:should|can|could) (?:i|we) (?:model|teach|practice)/i,
    /(?:give|suggest|show) (?:me )?(?:a )?(?:modeling )(?:tip|idea|suggestion)/i,
    /(?:any|some) (?:modeling )?(?:ideas|tips|suggestions)/i,
    /what (?:word|phrase|button) should (?:i|we) (?:use|practice)/i,
  ]

  for (const pattern of modelingSuggestionPatterns) {
    if (pattern.test(lower)) {
      return { type: "get_modeling_suggestion" }
    }
  }

  // Language change patterns optimized using SUPPORTED_LANGUAGES
  for (const [code, name] of Object.entries(SUPPORTED_LANGUAGES)) {
    const patterns = [
      new RegExp(`(?:switch|change|translate|set)(?: (?:the )?(?:app|language))?(?: to)? ${name}`, "i"),
      new RegExp(`(?:speak|talk)(?: (?:in|to))? ${name}`, "i"),
      new RegExp(`${name} (?:language|mode|please)`, "i"),
    ]

    for (const pattern of patterns) {
      if (pattern.test(lower)) {
        return {
          type: "change_language",
          payload: { language: code, languageName: name },
        }
      }
    }
  }

  // Show story patterns
  const storyPatterns = [
    /(?:show|play|tell)(?: me)?(?: a)? (?:story|video) (?:about|for|on)\s*(.+?)$/i,
    /(?:i'm|i am|feeling) (?:nervous|scared|worried) about\s*(.+?)$/i,
    /(?:help me understand|what happens at|what's it like at)\s*(.+?)$/i,
    /(?:visual story|social story)(?: about| for)?\s*(.+?)$/i,
  ]

  // Updated story patterns
  const updatedStoryPatterns = [
    /(?:show|tell|play)(?: me)?(?: a)? (?:story|video|scenario) (?:about|for|on)\s*(.+?)$/i,
    /(?:i'm|i am|we're|we are) (?:going to|about to)(?: the| a)?\s*(.+?)$/i,
    /(?:help|prepare)(?: me| us)? (?:for|with)(?: the| a)?\s*(.+?)$/i,
    /(?:practice|learn)(?: for| about)(?: the| a)?\s*(.+?)$/i,
  ]

  for (const pattern of updatedStoryPatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const topic = match[1].trim().toLowerCase()
      let scenarioId = "playground" // Default to playground

      if (topic.includes("doctor") || topic.includes("hospital") || topic.includes("sick")) scenarioId = "doctor-visit"
      else if (topic.includes("dentist") || topic.includes("teeth") || topic.includes("tooth"))
        scenarioId = "dentist-visit"
      else if (topic.includes("playground") || topic.includes("park") || topic.includes("play"))
        scenarioId = "playground"
      else if (topic.includes("school") || topic.includes("class") || topic.includes("teacher"))
        scenarioId = "first-day-school"
      else if (topic.includes("haircut") || topic.includes("barber") || topic.includes("salon"))
        scenarioId = "getting-haircut"
      else if (topic.includes("grocery") || topic.includes("store") || topic.includes("shop"))
        scenarioId = "grocery-store"
      else if (topic.includes("eat") || topic.includes("food") || topic.includes("meal") || topic.includes("dinner"))
        scenarioId = "mealtime"
      else if (topic.includes("overwhelm") || topic.includes("too much") || topic.includes("calm"))
        scenarioId = "feelings-overwhelmed"
      else if (topic.includes("change") || topic.includes("plan") || topic.includes("different"))
        scenarioId = "schedule-change"
      else if (topic.includes("new") || topic.includes("meet") || topic.includes("friend"))
        scenarioId = "meeting-new-people"

      return {
        type: "show_story",
        payload: { scenario: scenarioId, topic },
      }
    }
  }

  const cleanWords = (raw: string): string[] => {
    const fillerWords = [
      "the",
      "a",
      "an",
      "button",
      "buttons",
      "word",
      "words",
      "for",
      "called",
      "named",
      "that",
      "says",
      "one",
      "only",
      "just",
      "please",
      "can",
      "you",
    ]

    const corrections: Record<string, string> = {
      hay: "hey",
      "bye-bye": "bye",
      by: "bye",
      thankyou: "thank you",
      goodmorning: "good morning",
      im: "i'm",
      dont: "don't",
      cant: "can't",
      wont: "won't",
    }

    let cleaned = raw.toLowerCase().replace(/[""'!?.]/g, "")

    for (const [wrong, right] of Object.entries(corrections)) {
      cleaned = cleaned.replace(new RegExp(`\\b${wrong}\\b`, "g"), right)
    }

    return cleaned
      .split(/\s*(?:and|,)\s*/)
      .flatMap((phrase) => {
        const trimmed = phrase.trim()
        if (trimmed.includes(" ") && trimmed.split(" ").length <= 3) {
          return [trimmed, ...trimmed.split(/\s+/)]
        }
        return trimmed.split(/\s+/)
      })
      .map((w) => w.trim())
      .filter((w) => w.length > 0 && !fillerWords.includes(w))
  }

  const focusPatterns = [
    /(?:remove|hide|clear) (?:all|everything)(?: (?:buttons?|words?))?(?: except| but| besides)(?: for)?\s*[""']?(.+?)[""']?$/i,
    /(?:show|display|keep) (?:only|just)(?: the)?\s*[""']?(.+?)[""']?$/i,
    /(?:only|just) (?:show|display|keep)(?: the)?\s*[""']?(.+?)[""']?$/i,
    /(?:focus on|isolate|show me just|let me see only)\s*[""']?(.+?)[""']?$/i,
    /(?:let'?s (?:learn|practice)|teach me|i (?:want to|need to) (?:learn|practice))\s*[""']?(.+?)[""']?$/i,
    /(?:i just need|give me only|all i need is)\s*[""']?(.+?)[""']?$/i,
  ]

  for (const pattern of focusPatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const wordsRaw = match[1].trim().replace(/[""']/g, "")
      const words = cleanWords(wordsRaw)
      if (words.length > 0) {
        return {
          type: "focus_learning",
          payload: { words },
        }
      }
    }
  }

  const restorePatterns = [
    /(?:bring back|restore|show all|reset|put (?:my )?(?:words|buttons) back|show (?:all )?(?:my )?buttons(?: again)?|clear focus|exit (?:focus|learn)|done (?:learning|practicing))/i,
  ]

  for (const pattern of restorePatterns) {
    if (pattern.test(lower)) {
      return { type: "restore_buttons" }
    }
  }

  const createPatterns = [
    /(?:make|create|add|new|give me|we need|i need)(?: a)?(?: new)? (?:button|word|phrase|thing)(?: (?:for|that says?|saying|called|named))?\s*[""']?(.+?)[""']?$/i,
    /(?:make|create|add)(?: a)?(?: button)?(?: that says?|saying|for)\s*[""']?(.+?)[""']?$/i,
    /add [""']?(.+?)[""']? (?:button|to (?:the )?(?:board|buttons))/i,
    /i need(?: a button for)? [""']?(.+?)[""']?$/i,
    /(?:can you |please )?(?:make|add|create) [""']?(.+?)[""']?$/i,
  ]

  for (const pattern of createPatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const buttonText = match[1].trim().replace(/[""']/g, "")
      if (buttonText.length > 0 && buttonText.length < 200) {
        return {
          type: "create_button",
          payload: { text: buttonText },
        }
      }
    }
  }

  const updatePatterns = [
    /(?:change|edit|modify|rename|update)(?: the)? [""']?(.+?)[""']? (?:button)?(?: to say| to| into)\s*[""']?(.+?)[""']?$/i,
    /(?:make|change)(?: the)? [""']?(.+?)[""']? (?:button )?say\s*[""']?(.+?)[""']?$/i,
    /(?:rename|change)(?: the)? [""']?(.+?)[""']? (?:button )?(to|into)\s*[""']?(.+?)[""']?$/i,
  ]

  for (const pattern of updatePatterns) {
    const match = text.match(pattern)
    if (match && match[1] && match[2]) {
      const target = match[1].trim().replace(/[""']/g, "")
      const newText = match[2].trim().replace(/[""']/g, "")
      if (target.length > 0 && newText.length > 0) {
        return {
          type: "update_button",
          payload: { target, newText, newLabel: newText.length > 20 ? newText.substring(0, 20) : newText },
        }
      }
    }
  }

  const gridDeletePatterns = [
    /(?:delete|remove|get rid of|please get rid of)(?: the)? (first|last|middle|1st|2nd|3rd|\d+(?:st|nd|rd|th)?)(?:\s+(?:button|one))? (?:in|on|from)(?: the)? (first|last|top|bottom|middle|\d+(?:st|nd|rd|th)?) row/i,
    /(?:delete|remove|get rid of|please get rid of)(?: the)? (first|last|middle)(?:\s+(?:one|button))? (?:in|on|from)(?: the)? (first|last|top|bottom|middle) row/i,
    /(?:delete|remove)(?: the)? button (?:at|in) row (\d+),? (?:column|col) (\d+)/i,
    /(?:delete|remove)(?: the)? button (?:in|at) position (\d+)/i,
  ]

  for (const pattern of gridDeletePatterns) {
    const match = text.match(pattern)
    if (match && buttons && buttons.length > 0 && gridInfo && gridInfo.rows > 0) {
      console.log("[v0] Grid delete pattern matched:", match)

      // Handle "delete the last button in the last row"
      if (match[1] && match[2]) {
        const colPosition = match[1].toLowerCase()
        const rowPosition = match[2].toLowerCase()

        let targetRow: number
        if (rowPosition === "last" || rowPosition === "bottom") {
          targetRow = gridInfo.rows
        } else if (rowPosition === "first" || rowPosition === "top") {
          targetRow = 1
        } else if (rowPosition === "middle") {
          targetRow = Math.ceil(gridInfo.rows / 2)
        } else {
          const rowNum = Number.parseInt(rowPosition.replace(/\D/g, ""), 10)
          targetRow = isNaN(rowNum) ? gridInfo.rows : rowNum
        }

        console.log("[v0] Target row:", targetRow)

        // Get buttons in that row
        const buttonsInRow = buttons.filter((b) => b.row === targetRow)
        console.log(
          "[v0] Buttons in row",
          targetRow,
          ":",
          buttonsInRow.map((b) => b.label),
        )

        if (buttonsInRow.length === 0) {
          return Response.json({
            response: `I couldn't find any buttons in row ${targetRow}. The grid has ${gridInfo.rows} rows.`,
            command: null,
          })
        }

        // Sort by column to ensure correct order
        buttonsInRow.sort((a, b) => a.col - b.col)

        let targetButton: ButtonWithPosition | undefined
        if (colPosition === "last") {
          targetButton = buttonsInRow[buttonsInRow.length - 1]
        } else if (colPosition === "first" || colPosition === "1st") {
          targetButton = buttonsInRow[0]
        } else if (colPosition === "middle") {
          targetButton = buttonsInRow[Math.floor(buttonsInRow.length / 2)]
        } else {
          const colNum = Number.parseInt(colPosition.replace(/\D/g, ""), 10)
          if (!isNaN(colNum) && colNum > 0 && colNum <= buttonsInRow.length) {
            targetButton = buttonsInRow[colNum - 1]
          }
        }

        console.log("[v0] Target button:", targetButton?.label, "ID:", targetButton?.id)

        if (targetButton) {
          return {
            type: "delete_button",
            payload: {
              target: targetButton.id,
              buttonLabel: targetButton.label,
              isGridPosition: true,
              row: targetRow,
              col: targetButton.col,
            },
          }
        }
      }

      // Handle "delete button at row X, column Y"
      if (match[1] && match[2] && /\d+/.test(match[1]) && /\d+/.test(match[2])) {
        const rowNum = Number.parseInt(match[1], 10)
        const colNum = Number.parseInt(match[2], 10)
        const targetButton = buttons.find((b) => b.row === rowNum && b.col === colNum)
        if (targetButton) {
          return {
            type: "delete_button",
            payload: {
              target: targetButton.id,
              buttonLabel: targetButton.label,
              isGridPosition: true,
              row: rowNum,
              col: colNum,
            },
          }
        }
      }

      // Handle "delete button in position X"
      if (match[1] && /\d+/.test(match[1]) && !match[2]) {
        const position = Number.parseInt(match[1], 10)
        const targetButton = buttons.find((b) => b.index === position)
        if (targetButton) {
          return {
            type: "delete_button",
            payload: {
              target: targetButton.id,
              buttonLabel: targetButton.label,
              isGridPosition: true,
              position,
            },
          }
        }
      }
    }
  }

  const contextualDeletePatterns = [
    /(?:delete|remove|get rid of)(?: it| that| that one| the one i just (?:made|created|added))?$/i,
    /(?:delete|remove)(?: the)? (?:button|one) (?:i|you|we) just (?:made|created|added)/i,
    /(?:undo|remove)(?: the)? last (?:button|one|action)/i,
    /(?:delete|remove)(?: the)? (?:last|previous|most recent)(?: button)?$/i,
  ]

  for (const pattern of contextualDeletePatterns) {
    if (pattern.test(lower)) {
      // Look at conversation history to find what was recently created
      if (conversationHistory && conversationHistory.length > 0) {
        for (let i = conversationHistory.length - 1; i >= 0; i--) {
          const msg = conversationHistory[i]
          if (msg.role === "assistant") {
            // Look for "made a button" or similar in assistant responses
            const createdMatch = msg.content.match(
              /(?:made|created|added)(?: a)? (?:button|one)(?: (?:for|that says?|called))?\s*[""']?([^""']+)[""']?/i,
            )
            if (createdMatch && createdMatch[1]) {
              const createdLabel = createdMatch[1].trim().toLowerCase()
              const targetButton = buttons?.find(
                (b) => b.label.toLowerCase() === createdLabel || b.text.toLowerCase() === createdLabel,
              )
              if (targetButton) {
                return {
                  type: "delete_button",
                  payload: {
                    target: targetButton.id,
                    buttonLabel: targetButton.label,
                    fromConversation: true,
                  },
                }
              }
            }
          }
        }
      }

      // Fallback to last button by index
      if (buttons && buttons.length > 0) {
        const lastButton = buttons[buttons.length - 1]
        return {
          type: "delete_button",
          payload: {
            target: lastButton.id,
            buttonLabel: lastButton.label,
            isPositional: true,
          },
        }
      }
    }
  }

  const deletePatterns = [
    /(?:delete|remove|get rid of|take away)(?: the)? [""']?(.+?)[""']? (?:button)?$/i,
    /(?:delete|remove)(?: the)?(?: button)?(?: (?:for|that says?|called|named))?\s*[""']?(.+?)[""']?$/i,
    /(?:delete|remove)(?: the)? (last|first|previous|top|bottom|recent|latest)(?: button)?(?: (?:i|you|we) (?:made|created|added))?$/i,
    // /(?:delete|remove)(?: the)? (?:button )?(?:i|you|we) just (?:made|created|added)$/i, // This is now handled by contextualDeletePatterns
    // /(?:undo|remove)(?: the)? last (?:button|one)$/i, // This is now handled by contextualDeletePatterns
  ]

  for (const pattern of deletePatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const target = match[1].trim().replace(/[""']/g, "").toLowerCase()
      const positionalTerms = ["last", "first", "previous", "top", "bottom", "recent", "latest"]

      if (positionalTerms.includes(target)) {
        // Find the actual button to delete
        if (buttons && buttons.length > 0) {
          let targetButton: ButtonWithPosition | undefined

          if (target === "last" || target === "previous" || target === "recent" || target === "latest") {
            targetButton = buttons[buttons.length - 1]
          } else if (target === "first" || target === "top") {
            targetButton = buttons[0]
          } else if (target === "bottom") {
            targetButton = buttons[buttons.length - 1]
          }

          if (targetButton) {
            return {
              type: "delete_button",
              payload: {
                target: targetButton.id,
                buttonLabel: targetButton.label,
                isPositional: true,
              },
            }
          }
        }

        return {
          type: "delete_button",
          payload: { target, isPositional: true },
        }
      }

      if (buttons && buttons.length > 0) {
        // Exact match first
        let targetButton = buttons.find((b) => b.label.toLowerCase() === target || b.text.toLowerCase() === target)

        // Partial match if no exact match
        if (!targetButton) {
          targetButton = buttons.find(
            (b) =>
              b.label.toLowerCase().includes(target) ||
              target.includes(b.label.toLowerCase()) ||
              b.text.toLowerCase().includes(target) ||
              target.includes(b.text.toLowerCase()),
          )
        }

        if (targetButton) {
          return {
            type: "delete_button",
            payload: {
              target: targetButton.id,
              buttonLabel: targetButton.label,
            },
          }
        }
      }

      return {
        type: "delete_button",
        payload: { target },
      }
    }
  }

  const iconChangePatterns = [
    /(?:change|update|set|make)(?: the)? (?:icon|image|picture)(?: (?:on|for|of))?(?: the)? [""']?(.+?)[""']? (?:button )?(to|into|as)\s*(?:a |an )?[""']?(.+?)[""']?$/i,
    /(?:change|update|make)(?: the)? [""']?(.+?)[""']? (?:button )?(?:icon|image|picture)(?: to| into)?\s*(?:a |an )?[""']?(.+?)[""']?$/i,
    /(?:use|put|set)\s*(?:a |an )?[""']?(.+?)[""']?\s*(?:icon|image|picture)\s*(?:on|for)\s*(?:the)?\s*[""']?(.+?)[""']?(?:\s*button)?$/i,
  ]

  for (const pattern of iconChangePatterns) {
    const match = text.match(pattern)
    if (match) {
      let target: string, newIcon: string
      if (match[3]) {
        target = match[1].trim().replace(/[""']/g, "")
        newIcon = match[3].trim().replace(/[""']/g, "")
      } else {
        target = match[1].trim().replace(/[""']/g, "")
        newIcon = match[2].trim().replace(/[""']/g, "")
      }
      if (target && newIcon) {
        return {
          type: "change_icon",
          payload: { target, newIcon },
        }
      }
    }
  }

  if (lower.includes("go to") || lower.includes("take me to") || lower.includes("open")) {
    if (lower.includes("home") || lower.includes("start")) {
      return { type: "navigate", payload: { path: "/" } }
    }
    if (
      lower.includes("talk") ||
      lower.includes("speak") ||
      lower.includes("communicate") ||
      lower.includes("button")
    ) {
      return { type: "navigate", payload: { path: "/communicate" } }
    }
    if (lower.includes("avatar") || lower.includes("face") || lower.includes("picture")) {
      return { type: "navigate", payload: { path: "/avatar" } }
    }
    if (lower.includes("voice") || lower.includes("setting") || lower.includes("sound")) {
      return { type: "navigate", payload: { path: "/settings" } }
    }
    if (lower.includes("story") || lower.includes("stories") || lower.includes("video")) {
      return { type: "navigate", payload: { path: "/stories" } }
    }
    if (lower.includes("progress") || lower.includes("stats") || lower.includes("modeling")) {
      return { type: "navigate", payload: { path: "/progress" } }
    }
  }

  if (lower.includes("voice") && (lower.includes("change") || lower.includes("make") || lower.includes("switch"))) {
    if (lower.includes("boy") || lower.includes("male") || lower.includes("man")) {
      return { type: "change_voice", payload: { gender: "male" } }
    }
    if (lower.includes("girl") || lower.includes("female") || lower.includes("woman")) {
      return { type: "change_voice", payload: { gender: "female" } }
    }
    if (lower.includes("fast") || lower.includes("quick")) {
      return { type: "change_voice", payload: { speed: "fast" } }
    }
    if (lower.includes("slow")) {
      return { type: "change_voice", payload: { speed: "slow" } }
    }
  }

  if (lower.includes("help") || lower.includes("how do") || lower.includes("what can") || lower.includes("stuck")) {
    return { type: "help" }
  }

  return { type: "conversation" }
}

function getCommandResponse(command: Command): string {
  switch (command.type) {
    case "create_button":
      return `Done! I made a button that says "${command.payload?.text}". You'll see it on the Talk page!`
    case "delete_button": {
      const label = command.payload?.buttonLabel || command.payload?.target
      if (command.payload?.isGridPosition) {
        return `Done! I removed the "${label}" button from row ${command.payload?.row}.`
      }
      if (command.payload?.fromConversation) {
        return `Done! I removed the "${label}" button that you just made.`
      }
      return `Okay, I removed the "${label}" button for you.`
    }
    case "update_button":
      return `Got it! I changed that button to say "${command.payload?.newText}".`
    case "change_icon":
      return `Done! I changed the icon on the "${command.payload?.target}" button.`
    case "navigate":
      return `Taking you there now!`
    case "change_voice":
      if (command.payload?.gender) {
        return `Okay, I switched to a ${command.payload.gender} voice!`
      }
      return `Got it, I adjusted the voice speed!`
    case "change_language":
      return `Switching to ${command.payload?.languageName}! All buttons and speech will translate automatically.`
    case "focus_learning":
      return `Okay, I'm showing just those buttons so you can practice! Say "bring back my buttons" when you're ready for everything again.`
    case "restore_buttons":
      return `All your buttons are back! Ready to communicate!`
    case "show_story":
      return `Here's a visual story to help with that situation!`
    case "toggle_watch_first":
      return command.payload?.enabled
        ? `Watch First mode is on! You'll see me demonstrate each phrase before you try.`
        : `Watch First mode is off. You're ready to communicate on your own!`
    case "toggle_model_mode":
      return command.payload?.enabled
        ? `Modeling mode is on! I'll slow down and show you how to use each phrase.`
        : `Modeling mode is off. Back to normal speed!`
    case "show_modeling_stats":
      return `Let's see how you're doing with modeling practice!`
    case "show_me_how":
      return `Let me show you how to model "${command.payload?.phrase}"!`
    case "get_modeling_suggestion":
      return "" // This will be replaced with the actual suggestion
    case "help":
      return `I can help you create buttons, change the voice, navigate, or practice conversations! Just tell me what you need.`
    default:
      return `I'm here to help!`
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, context, currentButtons, gridInfo, conversationHistory } = await request.json()

    const text = message?.trim() || ""
    const lower = text.toLowerCase()

    const buttons: ButtonWithPosition[] = currentButtons || []
    const grid = gridInfo || { columns: 6, rows: 0, totalButtons: 0 }

    console.log("[v0] API received - Buttons:", buttons.length, "Grid rows:", grid.rows, "Grid cols:", grid.columns)

    if (buttons.length > 0) {
      const lastRow = Math.max(...buttons.map((b) => b.row))
      const lastRowButtons = buttons.filter((b) => b.row === lastRow)
      console.log(
        "[v0] Last row (",
        lastRow,
        ") buttons:",
        lastRowButtons.map((b) => `${b.label} (col ${b.col})`),
      )
    }

    const command = parseCommand(text, buttons, grid, conversationHistory)

    if (command && command.type !== "conversation" && command.type !== "help") {
      return NextResponse.json({
        response: getCommandResponse(command),
        command,
      })
    }

    const gridDescription =
      grid && buttons
        ? `
CURRENT BUTTON GRID (${grid.rows} rows x ${grid.columns} columns, ${grid.totalButtons} total buttons):
${buttons
  .map((b: ButtonWithPosition) => `- "${b.label}" at row ${b.row}, column ${b.col} (position ${b.index})`)
  .join("\n")}

GRID UNDERSTANDING:
- Row 1 is the TOP row, Row ${grid.rows} is the BOTTOM/LAST row
- Column 1 is the LEFTMOST, Column ${grid.columns} is the RIGHTMOST
- "Last button in the last row" = rightmost button in the bottom row
- "First button" = top-left, position 1
- Users may say "that one" or "the one I just made" - check conversation history
`
        : ""

    const systemPrompt = `You are a magical helper for Inner Voice, an app that helps children and adults learn to communicate.

YOUR PERSONALITY:
- Warm, encouraging, like a favorite teacher or helpful friend
- Use simple, clear language a child or stressed parent could understand
- Never use technical jargon
- Be brief - 1-2 sentences max

${gridDescription}

WHAT YOU CAN DO (tell people about these!):
- Create buttons instantly: "Just tell me what you want the button to say!"
- DELETE buttons: "Say 'delete the bathroom button' or 'remove the last button in the bottom row'"
- DELETE by position: "delete the last button", "remove the first one in row 2", "delete button at row 3, column 2"
- EDIT buttons: "Say 'change the hello button to say hi there' or 'change the icon on good morning to a sun'"
- Change the voice: "I can make it a boy voice or girl voice, faster or slower"
- Help navigate: "I can take you to any part of the app"
- Practice conversations: "Want to practice talking? I'm here!"
- Focus on one word: "Say 'show only help' to practice just that word!"
- Restore all buttons: "Say 'bring back my buttons' when you're ready"
- Show visual stories: "Say 'show me a story about the dentist' to watch a calming video!"
- Change language: "Say 'switch to Spanish' to translate the whole app!"
- MODELING MODE: "Say 'turn on watch first mode' to learn by watching first!"
- Modeling stats: "Say 'show my modeling stats' to see your progress!"
- Modeling tips: "Say 'show me how to model help' for demonstration!"

BUTTON EDITING - YOU CAN:
- Delete by name: "delete the hungry button", "remove good morning"
- Delete by grid position: "delete the last button in the last row", "remove the first button in row 2"
- Delete by position number: "delete button 5", "remove the 3rd button"
- Edit text: "change 'hello' to 'hi there'", "rename the water button to juice"
- Edit icons: "change the icon on good morning to a sunrise", "put a star icon on the thank you button"
- Understand context: If someone says "remove it" or "delete that one", look at recent conversation for what they mean

LIGHT SPEED LITERACY CURRICULUM:
Inner Voice incorporates Light Speed Literacy, a multi-sensory phonics-based curriculum designed by speech-language pathologists and dyslexia specialists.

If you don't understand a request, ask for clarification in a friendly way. Never say "I can't do that" - instead suggest alternatives!`

    const { text: responseText } = await generateText({
      model: "anthropic/claude-sonnet-4-5-20250929",
      system: systemPrompt,
      prompt: text,
      maxTokens: 200,
    })

    return NextResponse.json({
      response: responseText,
      command: null,
    })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return NextResponse.json({ response: "Sorry, something went wrong.", command: null }, { status: 500 })
  }
}
