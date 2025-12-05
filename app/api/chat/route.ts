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
  // Build a rich grid description with visual and semantic details
  const gridDescription = buttons
    .map((b) => {
      const colorInfo = b.color ? `, color: ${b.color}` : ""
      const categoryInfo = b.category ? `, category: ${b.category}` : ""
      return `- "${b.label}" (id: ${b.id}) at row ${b.row}, column ${b.col}${colorInfo}${categoryInfo}`
    })
    .join("\n")

  // Group buttons by row for easier spatial understanding
  const buttonsByRow: Record<number, ButtonWithPosition[]> = {}
  for (const b of buttons) {
    if (!buttonsByRow[b.row]) buttonsByRow[b.row] = []
    buttonsByRow[b.row].push(b)
  }

  const rowDescriptions = Object.entries(buttonsByRow)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([row, btns]) => {
      const sorted = btns.sort((a, b) => a.col - b.col)
      return `Row ${row}: ${sorted.map((b) => `"${b.label}"`).join(" | ")}`
    })
    .join("\n")

  const prompt = `You are helping identify a button in an AAC communication app grid.

GRID LAYOUT (${gridInfo.rows} rows x ${gridInfo.columns} columns, ${gridInfo.totalButtons} buttons total):

VISUAL LAYOUT (left to right):
${rowDescriptions}

DETAILED BUTTON DATA:
${gridDescription}

SPATIAL RULES:
- Row 1 = TOP row, Row ${gridInfo.rows} = BOTTOM/LAST row
- Column 1 = LEFTMOST, Column ${gridInfo.columns} = RIGHTMOST
- "last row" = row ${gridInfo.rows}
- "first row" = row 1
- "second button" = column 2 (counting from left)
- "last button in a row" = rightmost button in that row
- "on the left" = earlier columns (1, 2)
- "on the right" = later columns
- "next to X" = adjacent to button X (same row, col +/- 1)
- "below X" = same column, row + 1
- "above X" = same column, row - 1

FUZZY/SEMANTIC MATCHING:
- "the hungry button" matches "I'm hungry"
- "the food button" could match "I'm hungry" or "Can I have a snack?"
- "the bathroom button" matches "I need to use the bathroom"
- "the help button" matches "I need help" or "Help me"
- "the orange one" = look for buttons with orange color
- "the feelings button" = look for emotion-related buttons

USER REQUEST: "${text}"

Which button is the user referring to? Consider:
1. Exact name match
2. Partial/fuzzy name match
3. Grid position (row/column references)
4. Color references
5. Semantic meaning (what the button is about)
6. Spatial references (next to, below, above)

Respond with ONLY a JSON object:
{"buttonId": "the-exact-button-id", "buttonLabel": "the button label", "confidence": "high|medium|low", "reason": "brief explanation"}

If you cannot determine which button with reasonable confidence, respond with:
{"buttonId": null, "error": "brief reason", "suggestions": ["possible button 1", "possible button 2"]}`

  try {
    console.log("[v0] LLM resolution request for:", text)
    const { text: responseText } = await generateText({
      model: "anthropic/claude-sonnet-4-5-20250929",
      prompt,
      maxTokens: 150,
    })

    console.log("[v0] LLM resolution response:", responseText)

    // Parse the JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      if (parsed.buttonId && parsed.buttonId !== null) {
        console.log(
          "[v0] LLM resolved button:",
          parsed.buttonLabel,
          "ID:",
          parsed.buttonId,
          "Confidence:",
          parsed.confidence,
        )
        return {
          type: actionType === "delete" ? "delete_button" : "update_button",
          payload: {
            target: parsed.buttonId,
            buttonLabel: parsed.buttonLabel,
            resolvedByLLM: true,
            confidence: parsed.confidence,
            reason: parsed.reason,
          },
        }
      } else if (parsed.error) {
        console.log("[v0] LLM could not resolve button:", parsed.error, "Suggestions:", parsed.suggestions)
      }
    }
  } catch (error) {
    console.error("[v0] LLM resolution failed:", error)
  }

  return null
}

async function resolveGridDeleteWithLLM(
  text: string,
  buttons: ButtonWithPosition[],
  gridInfo: GridInfo,
): Promise<Command | null> {
  const gridDescription = buttons.map((b) => `- "${b.label}" (id: ${b.id}) at row ${b.row}, column ${b.col}`).join("\n")

  const prompt = `You are helping resolve a button deletion request for an AAC communication app.

GRID LAYOUT (${gridInfo.rows} rows x ${gridInfo.columns} columns):
${gridDescription}

RULES:
- Row 1 is the TOP row, Row ${gridInfo.rows} is the BOTTOM/LAST row
- Column 1 is the LEFTMOST, Column ${gridInfo.columns} is the RIGHTMOST
- "last row" = row ${gridInfo.rows}
- "first row" = row 1
- "second row" = row 2
- "last button in a row" = rightmost button (highest column number) in that row
- "first button in a row" = leftmost button (column 1) in that row
- "second button" = column 2
- "on the left" typically means earlier columns (1, 2)
- "on the right" typically means later columns

USER REQUEST: "${text}"

Which button should be deleted? Respond with ONLY a JSON object like this:
{"buttonId": "the-exact-button-id", "buttonLabel": "the button label"}

If you cannot determine which button, respond with:
{"buttonId": null, "error": "brief reason"}`

  try {
    const { text: responseText } = await generateText({
      model: "anthropic/claude-sonnet-4-5-20250929",
      prompt,
      maxTokens: 100,
    })

    // Parse the JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      if (parsed.buttonId && parsed.buttonId !== null) {
        console.log("[v0] LLM resolved grid delete:", parsed)
        return {
          type: "delete_button",
          payload: {
            target: parsed.buttonId,
            buttonLabel: parsed.buttonLabel,
            isGridPosition: true,
            resolvedByLLM: true,
          },
        }
      }
    }
  } catch (error) {
    console.error("[v0] LLM grid resolution failed:", error)
  }

  return null
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
    /how (?:am i|are we) doing/i,
    /(?:my|our) progress/i,
  ]

  for (const pattern of statsPatterns) {
    if (pattern.test(lower)) {
      return { type: "show_modeling_stats" }
    }
  }

  const showMeHowPatterns = [
    /show me how (?:to )?(?:use |say |model )?[""']?(.+?)[""']?$/i,
    /(?:demonstrate|model) [""']?(.+?)[""']?$/i,
    /how do (?:i|you) (?:use|say|model) [""']?(.+?)[""']?$/i,
  ]

  for (const pattern of showMeHowPatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      return { type: "show_me_how", payload: { phrase: match[1].trim() } }
    }
  }

  const suggestionPatterns = [
    /what should (?:i|we) (?:say|model|teach) (?:next|now)/i,
    /(?:give|suggest|recommend) (?:me )?(?:a )?(?:next )?(?:word|phrase|button)/i,
    /what (?:word|phrase) (?:should|could) (?:i|we) (?:try|practice|model)/i,
  ]

  for (const pattern of suggestionPatterns) {
    if (pattern.test(lower)) {
      return { type: "get_modeling_suggestion" }
    }
  }

  const restorePatterns = [
    /(?:bring|get) (?:back|restore) (?:my |all |the )?buttons?/i,
    /(?:show|restore|reset) (?:all )?(?:my )?(?:the )?buttons?/i,
    /(?:i want|show me) all (?:my |the )?buttons/i,
    /(?:unfocus|unzoom|zoom out)/i,
    /(?:exit|leave) focus/i,
    /(?:go back to |return to )?normal (?:view|mode)/i,
  ]

  for (const pattern of restorePatterns) {
    if (pattern.test(lower)) {
      return { type: "restore_buttons" }
    }
  }

  const focusPatterns = [
    /(?:show|focus(?: on)?|practice|learn|just show)(?: only| just)?\s*[""']?(?:the\s+)?([^""']+?)[""']?\s*(?:button|word)?$/i,
    /(?:i want to|let'?s|can we) (?:focus on|practice|work on|learn)\s*[""']?([^""']+?)[""']?\s*(?:button|word)?$/i,
    /only (?:show|display)\s*[""']?([^""']+?)[""']?\s*(?:button|word)?$/i,
    /zoom (?:in )?on\s*[""']?([^""']+?)[""']?\s*(?:button|word)?$/i,
  ]

  for (const pattern of focusPatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const word = match[1].trim().replace(/[""']/g, "")
      if (word.length > 0 && word.length < 50) {
        return { type: "focus_learning", payload: { word } }
      }
    }
  }

  const storyPatterns = [
    /(?:show|play|tell|watch|start)(?: me)?(?: a)? (?:story|video|social story) (?:about|for|on)\s+[""']?(.+?)[""']?\s*$/i,
    /(?:i need|need)(?: a)? (?:story|video) (?:about|for)\s+[""']?(.+?)[""']?\s*$/i,
    /(?:what happens|prepare me for|help with)\s+(?:at |when |going to )?[""']?(.+?)[""']?\s*$/i,
  ]

  for (const pattern of storyPatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      return { type: "show_story", payload: { topic: match[1].trim() } }
    }
  }

  const languagePatterns = [
    /(?:switch|change|translate)(?: (?:to|into))?\s+(\w+)/i,
    /(?:speak|talk)(?: in)?\s+(\w+)/i,
    /(?:i want|use|set)(?: it)?(?: (?:to|in))?\s+(\w+)/i,
  ]

  for (const pattern of languagePatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const langInput = match[1].toLowerCase()
      const lang = Object.values(SUPPORTED_LANGUAGES).find(
        (l) => l.name.toLowerCase() === langInput || l.code.toLowerCase() === langInput,
      )
      if (lang) {
        return {
          type: "change_language",
          payload: { language: lang.code, languageName: lang.name },
        }
      }
    }
  }

  // Button creation patterns
  const createButtonPatterns = [
    /(?:create|make|add)(?: a)?(?: new)? button (?:for |that says? |called |named )?[""']?(.+?)[""']?$/i,
    /(?:i need|add|create)(?: a)? [""'](.+?)[""'] button/i,
    /(?:can you |please )?(?:make|create|add)(?: me)?(?: a)? button (?:for |that says? )?[""']?(.+?)[""']?$/i,
    /button (?:for|that says?) [""']?(.+?)[""']?$/i,
    /add [""'](.+?)[""'] to (?:my |the )?buttons?/i,
  ]

  for (const pattern of createButtonPatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const buttonText = match[1].trim().replace(/[""']/g, "")
      if (buttonText.length > 0 && buttonText.length < 100) {
        const category = categorizePhrase(buttonText)
        const color = CATEGORY_COLORS[category] || "default"
        const icon = suggestIcon(buttonText, category)
        const emotion = suggestEmotion(buttonText, category)
        return {
          type: "create_button",
          payload: { text: buttonText, category, color, icon, emotion },
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
      if (conversationHistory && conversationHistory.length > 0) {
        for (let i = conversationHistory.length - 1; i >= 0; i--) {
          const msg = conversationHistory[i]
          if (msg.role === "assistant") {
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

  const directDeleteMatch = text.match(
    /(?:delete|remove|get rid of|erase|trash)(?: the)?\s*[""']?(.+?)[""']?\s*(?:button)?$/i,
  )
  if (directDeleteMatch && directDeleteMatch[1] && buttons) {
    const target = directDeleteMatch[1]
      .trim()
      .toLowerCase()
      .replace(/button$/i, "")
      .trim()

    // Try exact match first
    const exactMatch = buttons.find((b) => b.label.toLowerCase() === target || b.text.toLowerCase() === target)
    if (exactMatch) {
      return {
        type: "delete_button",
        payload: {
          target: exactMatch.id,
          buttonLabel: exactMatch.label,
        },
      }
    }

    // Try partial/contains match
    const partialMatch = buttons.find(
      (b) =>
        b.label.toLowerCase().includes(target) ||
        target.includes(b.label.toLowerCase()) ||
        b.text.toLowerCase().includes(target) ||
        target.includes(b.text.toLowerCase()),
    )
    if (partialMatch) {
      return {
        type: "delete_button",
        payload: {
          target: partialMatch.id,
          buttonLabel: partialMatch.label,
          fuzzyMatch: true,
        },
      }
    }
  }

  const gridDeletePatterns = [
    /(?:delete|remove|get rid of|please get rid of)(?: the)? (first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|last|middle|1st|2nd|3rd|4th|5th|6th|7th|8th|9th|10th|\d+(?:st|nd|rd|th)?)(?:\s+(?:button|one))? (?:in|on|from)(?: the)? (first|second|third|fourth|fifth|sixth|last|top|bottom|middle|1st|2nd|3rd|4th|5th|6th|7th|8th|9th|10th|\d+(?:st|nd|rd|th)?) row/i,
    /(?:delete|remove|get rid of|please get rid of)(?: the)? (first|second|third|fourth|fifth|sixth|last|middle)(?:\s+(?:one|button))? (?:in|on|from)(?: the)? (first|second|third|fourth|fifth|sixth|last|top|bottom|middle) row/i,
    /(?:delete|remove)(?: the)? button (?:at|in) row (\d+),? (?:column|col) (\d+)/i,
    /(?:delete|remove)(?: the)? button (?:in|at) position (\d+)/i,
  ]

  for (const pattern of gridDeletePatterns) {
    const match = text.match(pattern)
    if (match && buttons && buttons.length > 0 && gridInfo && gridInfo.rows > 0) {
      console.log("[v0] Grid delete pattern matched:", match)

      // Handle "delete the second button in the second row"
      if (match[1] && match[2]) {
        const colPositionRaw = match[1].toLowerCase()
        const rowPositionRaw = match[2].toLowerCase()

        let targetRow: number
        const rowNum = ordinalToNumber(rowPositionRaw)

        if (rowPositionRaw === "last" || rowPositionRaw === "bottom" || rowNum === -1) {
          targetRow = gridInfo.rows
        } else if (rowPositionRaw === "first" || rowPositionRaw === "top" || rowNum === 1) {
          targetRow = 1
        } else if (rowPositionRaw === "middle" || rowNum === -2) {
          targetRow = Math.ceil(gridInfo.rows / 2)
        } else if (!isNaN(rowNum) && rowNum > 0) {
          targetRow = rowNum
        } else {
          targetRow = gridInfo.rows // fallback to last row
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
          return {
            type: "delete_button",
            payload: {
              target: null,
              error: `I couldn't find any buttons in row ${targetRow}. The grid has ${gridInfo.rows} rows.`,
            },
          }
        }

        // Sort by column to ensure correct order
        buttonsInRow.sort((a, b) => a.col - b.col)

        let targetButton: ButtonWithPosition | undefined
        const colNum = ordinalToNumber(colPositionRaw)

        if (colPositionRaw === "last" || colNum === -1) {
          targetButton = buttonsInRow[buttonsInRow.length - 1]
        } else if (colPositionRaw === "first" || colNum === 1) {
          targetButton = buttonsInRow[0]
        } else if (colPositionRaw === "middle" || colNum === -2) {
          targetButton = buttonsInRow[Math.floor(buttonsInRow.length / 2)]
        } else if (!isNaN(colNum) && colNum > 0 && colNum <= buttonsInRow.length) {
          targetButton = buttonsInRow[colNum - 1]
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
        } else {
          return {
            type: "delete_button",
            payload: {
              target: null,
              error: `Row ${targetRow} only has ${buttonsInRow.length} buttons, so there is no button at position ${colNum}.`,
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

  // Removed explicit delete patterns as they are now handled by the general delete request detection and LLM resolution.
  // The following patterns are now implicitly covered by the logic above.

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

  return null
}

function getCommandResponse(command: Command): string {
  switch (command.type) {
    case "create_button":
      return `Done! I made a button that says "${command.payload?.text}". You'll see it on the Talk page!`
    case "delete_button": {
      const label = command.payload?.buttonLabel || command.payload?.target
      if (command.payload?.resolvedByLLM) {
        return `Done! I removed the "${label}" button for you.`
      }
      if (command.payload?.isGridPosition) {
        return `Done! I removed the "${label}" button for you.`
      }
      if (command.payload?.fromConversation) {
        return `Done! I removed the "${label}" button that you just made.`
      }
      if (command.payload?.fuzzyMatch) {
        return `Done! I removed the "${label}" button for you.`
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
      return `Okay, I changed the voice for you!`
    case "focus_learning":
      return `Let's focus on "${command.payload?.word}"! I've hidden the other buttons so we can practice just this one.`
    case "restore_buttons":
      return `Welcome back! All your buttons are here now.`
    case "show_story":
      return `Let me show you a story about ${command.payload?.topic}. Stories can help us understand new situations!`
    case "change_language":
      return `I've switched the app to ${command.payload?.languageName}!`
    case "toggle_watch_first":
      return command.payload?.enabled
        ? `Watch First mode is now ON! I'll show you videos before letting you tap buttons.`
        : `Watch First mode is now OFF. You can tap buttons freely!`
    case "toggle_model_mode":
      return command.payload?.enabled
        ? `Modeling mode is now ON! I'll slow down so you can learn by watching.`
        : `Modeling mode is now OFF. Back to normal speed!`
    case "show_modeling_stats":
      return `Here are your modeling stats!`
    case "show_me_how":
      return `Let me show you how to model "${command.payload?.phrase}"!`
    case "get_modeling_suggestion":
      return `Here's a suggestion for what to model next!`
    case "help":
      return `I'm here to help! I can make buttons, change the voice, show you modeling tips, or anything else you need. Just ask!`
    default:
      return `I'm here to help you and your child communicate!`
  }
}

function ordinalToNumber(ordinal: string): number {
  const ordinalMap: Record<string, number> = {
    first: 1,
    "1st": 1,
    second: 2,
    "2nd": 2,
    third: 3,
    "3rd": 3,
    fourth: 4,
    "4th": 4,
    fifth: 5,
    "5th": 5,
    sixth: 6,
    "6th": 6,
    seventh: 7,
    "7th": 7,
    eighth: 8,
    "8th": 8,
    ninth: 9,
    "9th": 9,
    tenth: 10,
    "10th": 10,
    last: -1,
    middle: -2,
  }

  const lower = ordinal.toLowerCase().trim()
  if (ordinalMap[lower] !== undefined) {
    return ordinalMap[lower]
  }

  // Try to parse numeric ordinals like "11th", "12th", etc.
  const numMatch = lower.match(/^(\d+)(?:st|nd|rd|th)?$/)
  if (numMatch) {
    return Number.parseInt(numMatch[1], 10)
  }

  return Number.NaN
}

async function extractCommand(
  text: string,
  buttons?: ButtonWithPosition[],
  gridInfo?: { rows: number; cols: number },
  conversationHistory?: Array<{ role: string; content: string }>,
): Promise<Command | null> {}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, customButtons, conversationHistory, grid } = body

    if (!text) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 })
    }

    // Parse buttons from the grid with positions
    const buttons: ButtonWithPosition[] | undefined = customButtons?.map(
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

    console.log(
      "[v0] API received - Buttons:",
      buttons?.length || 0,
      "Grid rows:",
      grid?.rows,
      "Grid cols:",
      grid?.columns,
    )

    // Log last row buttons for debugging
    if (buttons && grid) {
      const lastRow = grid.rows
      const lastRowButtons = buttons.filter((b: ButtonWithPosition) => b.row === lastRow)
      console.log(
        "[v0] Last row (",
        lastRow,
        ") buttons:",
        lastRowButtons.map((b) => `- "${b.label}" at row ${b.row}, column ${b.col} (position ${b.index})`),
      )
    }

    // First try simple pattern matching
    let command = parseCommand(text, buttons, grid, conversationHistory)
    console.log("[v0] Pattern matching result:", command?.type || "null")

    const lower = text.toLowerCase()
    const isDeleteRequest = /(?:delete|remove|get rid of|erase|take away|trash|kill|destroy)/i.test(lower)
    const isUpdateRequest = /(?:change|update|edit|modify)/i.test(lower) && /button/i.test(lower)

    if (command === null && buttons && buttons.length > 0 && grid) {
      if (isDeleteRequest) {
        console.log("[v0] Pattern matching returned null for delete request, using LLM resolution")
        command = await resolveButtonWithLLM(text, buttons, grid, "delete")
      } else if (isUpdateRequest) {
        console.log("[v0] Pattern matching returned null for update request, using LLM resolution")
        command = await resolveButtonWithLLM(text, buttons, grid, "update")
      }
    }

    // If still null, default to conversation
    if (command === null) {
      command = { type: "conversation" }
    }

    console.log("[v0] Final command:", command.type, command.payload ? JSON.stringify(command.payload) : "")

    if (command && command.type !== "conversation" && command.type !== "help") {
      return NextResponse.json({
        response: getCommandResponse(command),
        command,
      })
    }

    // For conversation or help, use the main LLM
    const gridDescription =
      grid && buttons
        ? `
CURRENT BUTTON GRID (${grid.rows} rows x ${grid.columns} columns, ${grid.totalButtons} total buttons):
${buttons.map((b: ButtonWithPosition) => `- "${b.label}" (id: ${b.id}) at row ${b.row}, column ${b.col}`).join("\n")}

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
