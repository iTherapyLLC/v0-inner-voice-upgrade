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
  payload?: Record<string, unknown>
}

interface ConversationHistoryItem {
  role: "user" | "assistant"
  content: string
}

interface ButtonContext {
  id: string
  label: string
  text: string
  index?: number // Position in the list (0-based)
}

function findButtonByPosition(
  buttons: ButtonContext[],
  position: string,
  conversationHistory: ConversationHistoryItem[],
): string | null {
  const posLower = position.toLowerCase().trim()

  // Handle "last button I made" or "previous button" - search conversation history
  if (
    posLower.includes("last") &&
    (posLower.includes("made") || posLower.includes("created") || posLower.includes("added"))
  ) {
    // Search conversation history for the most recent button creation
    for (let i = conversationHistory.length - 1; i >= 0; i--) {
      const msg = conversationHistory[i]
      if (msg.role === "assistant") {
        // Look for patterns like "I made a button that says 'X'" or "Created 'X'"
        const createdMatch = msg.content.match(
          /(?:made|created|added)(?: a)? button (?:that says |for |called |named )?[""']?([^""']+)[""']?/i,
        )
        if (createdMatch && createdMatch[1]) {
          return createdMatch[1].trim()
        }
        // Also check for "button that says X"
        const saysMatch = msg.content.match(/button that says [""']?([^""']+)[""']?/i)
        if (saysMatch && saysMatch[1]) {
          return saysMatch[1].trim()
        }
      }
    }
    // If not found in history, return the most recently added button (last in array)
    if (buttons.length > 0) {
      return buttons[buttons.length - 1].label
    }
    return null
  }

  // Handle positional references
  if (buttons.length === 0) return null

  // First / top button
  if (
    posLower === "first" ||
    posLower === "top" ||
    posLower === "first button" ||
    posLower === "top button" ||
    posLower === "the first" ||
    posLower === "the top"
  ) {
    return buttons[0].label
  }

  // Last / bottom button
  if (
    posLower === "last" ||
    posLower === "bottom" ||
    posLower === "last button" ||
    posLower === "bottom button" ||
    posLower === "the last" ||
    posLower === "the bottom"
  ) {
    return buttons[buttons.length - 1].label
  }

  // Middle button(s)
  if (posLower === "middle" || posLower === "middle button" || posLower === "the middle") {
    const middleIndex = Math.floor(buttons.length / 2)
    return buttons[middleIndex].label
  }

  // Second button
  if (posLower === "second" || posLower === "second button" || posLower === "the second") {
    return buttons.length > 1 ? buttons[1].label : null
  }

  // Third button
  if (posLower === "third" || posLower === "third button" || posLower === "the third") {
    return buttons.length > 2 ? buttons[2].label : null
  }

  // Nth button (e.g., "button 3", "3rd button")
  const nthMatch = posLower.match(/(?:button )?(\d+)(?:st|nd|rd|th)?(?: button)?/)
  if (nthMatch && nthMatch[1]) {
    const index = Number.parseInt(nthMatch[1], 10) - 1 // Convert to 0-based
    if (index >= 0 && index < buttons.length) {
      return buttons[index].label
    }
  }

  // Second to last
  if (posLower.includes("second") && posLower.includes("last")) {
    return buttons.length > 1 ? buttons[buttons.length - 2].label : null
  }

  return null
}

function findButtonByLabel(buttons: ButtonContext[], search: string): ButtonContext | null {
  const searchLower = search.toLowerCase().trim()

  // Exact match first
  const exactMatch = buttons.find((b) => b.label.toLowerCase() === searchLower || b.text.toLowerCase() === searchLower)
  if (exactMatch) return exactMatch

  // Partial match (contains)
  const partialMatch = buttons.find(
    (b) =>
      b.label.toLowerCase().includes(searchLower) ||
      b.text.toLowerCase().includes(searchLower) ||
      searchLower.includes(b.label.toLowerCase()),
  )
  if (partialMatch) return partialMatch

  // Word match (any word matches)
  const searchWords = searchLower.split(/\s+/)
  const wordMatch = buttons.find((b) => {
    const labelWords = b.label.toLowerCase().split(/\s+/)
    const textWords = b.text.toLowerCase().split(/\s+/)
    return searchWords.some((sw) => labelWords.includes(sw) || textWords.includes(sw))
  })

  return wordMatch || null
}

function parseCommand(
  text: string,
  currentButtons?: ButtonContext[],
  conversationHistory?: ConversationHistoryItem[],
): Command | null {
  const lower = text.toLowerCase()
  const buttons = currentButtons || []
  const history = conversationHistory || []

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

  const suggestionPatterns = [
    /(?:what|how) should i model (?:today|now|next)/i,
    /(?:give me|suggest)(?: a)? modeling (?:idea|suggestion|tip)/i,
    /what (?:phrase|word|button) should i (?:model|practice|teach)/i,
  ]

  for (const pattern of suggestionPatterns) {
    if (pattern.test(lower)) {
      return { type: "get_modeling_suggestion" }
    }
  }

  const languagePatterns = [
    /(?:switch|change|go|return)\s*back\s*(?:to)?\s*(\w+)$/i,
    /back\s*to\s*(\w+)$/i,
    /(?:switch|change)(?: (?:to|into))?\s*(\w+)$/i,
    /(?:i (?:want|need|speak)|let's (?:use|try)|use)\s*(\w+)$/i,
    /(?:convert|put)(?: everything)?(?: (?:to|into|in))?\s*(\w+)$/i,
    /(?:make it|everything in|switch to)\s*(\w+)$/i,
    /(\w+)\s*(?:language|mode|please)$/i,
  ]

  const languageNameToCode: Record<string, string> = {
    english: "en",
    spanish: "es",
    espanol: "es",
    español: "es",
    french: "fr",
    français: "fr",
    francais: "fr",
    german: "de",
    deutsch: "de",
    italian: "it",
    italiano: "it",
    portuguese: "pt",
    português: "pt",
    portugues: "pt",
    chinese: "zh",
    mandarin: "zh",
    japanese: "ja",
    korean: "ko",
    arabic: "ar",
    hindi: "hi",
    russian: "ru",
    vietnamese: "vi",
    tagalog: "tl",
    filipino: "tl",
    polish: "pl",
    ukrainian: "uk",
    dutch: "nl",
    swedish: "sv",
    hebrew: "he",
    thai: "th",
  }

  for (const pattern of languagePatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const langInput = match[1].toLowerCase().trim()
      const langCode = languageNameToCode[langInput] || langInput

      if (SUPPORTED_LANGUAGES[langCode] || languageNameToCode[langInput]) {
        const finalCode = languageNameToCode[langInput] || langCode
        return {
          type: "change_language",
          payload: {
            language: finalCode,
            languageName: SUPPORTED_LANGUAGES[finalCode] || langInput,
          },
        }
      }
    }
  }

  const storyPatterns = [
    /(?:show|play|tell)(?: me)?(?: a)? (?:story|video) (?:about|for|on)\s*(.+?)$/i,
    /(?:i'm|i am|feeling) (?:nervous|scared|worried) about\s*(.+?)$/i,
    /(?:help me understand|what happens at|what's it like at)\s*(.+?)$/i,
    /(?:visual story|social story)(?: about| for)?\s*(.+?)$/i,
  ]

  for (const pattern of storyPatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const topic = match[1].trim().toLowerCase()
      let scenarioId = topic
      if (topic.includes("dentist") || topic.includes("teeth")) scenarioId = "dentist"
      else if (topic.includes("doctor") || topic.includes("checkup")) scenarioId = "doctor"
      else if (topic.includes("school") || topic.includes("class")) scenarioId = "school"
      else if (topic.includes("playground") || topic.includes("park") || topic.includes("play"))
        scenarioId = "playground"
      else if (topic.includes("birthday") || topic.includes("party")) scenarioId = "birthday"
      else if (topic.includes("bed") || topic.includes("sleep") || topic.includes("night")) scenarioId = "bedtime"
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
    /(?:make|create|add|new|give me|i need|we need|put)(?: a)?(?: new)? (?:button|word|phrase|thing)(?: (?:for|that says?|saying|called|named))?\s*[""']?(.+?)[""']?$/i,
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

  const deletePatterns = [
    /(?:delete|remove|get rid of|take away|undo)(?: the)? (?:last|previous|recent)(?: button)?(?: (?:i|we|you) (?:made|created|added))?/i,
    /(?:delete|remove|get rid of|take away)(?: the)? (first|last|top|bottom|middle|second|third|\d+(?:st|nd|rd|th)?)(?: button)?$/i,
    /(?:delete|remove|get rid of|take away)(?: the)? [""']?(.+?)[""']? (?:button)?$/i,
    /(?:delete|remove)(?: the)?(?: button)?(?: (?:for|that says?|called|named))?\s*[""']?(.+?)[""']?$/i,
  ]

  const lastMadePattern =
    /(?:delete|remove|get rid of|take away|undo)(?: the)? (?:last|previous|recent)(?: button)?(?: (?:i|we|you) (?:made|created|added))?/i
  if (lastMadePattern.test(lower)) {
    const targetLabel = findButtonByPosition(buttons, "last made", history)
    if (targetLabel) {
      return {
        type: "delete_button",
        payload: { target: targetLabel },
      }
    }
  }

  const positionalPattern =
    /(?:delete|remove|get rid of|take away)(?: the)? (first|last|top|bottom|middle|second|third|\d+(?:st|nd|rd|th)?)(?: button)?$/i
  const positionalMatch = text.match(positionalPattern)
  if (positionalMatch && positionalMatch[1]) {
    const targetLabel = findButtonByPosition(buttons, positionalMatch[1], history)
    if (targetLabel) {
      return {
        type: "delete_button",
        payload: { target: targetLabel },
      }
    }
  }

  for (const pattern of deletePatterns.slice(2)) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const searchTerm = match[1].trim().replace(/[""']/g, "")
      const foundButton = findButtonByLabel(buttons, searchTerm)
      const target = foundButton?.label || searchTerm
      return {
        type: "delete_button",
        payload: { target },
      }
    }
  }

  const navPatterns = [
    { pattern: /(?:go to|open|show me|take me to)(?: the)? (?:home|main|start)/i, path: "/" },
    { pattern: /(?:go to|open|show me|take me to)(?: the)? (?:talk|communicate|speak|board)/i, path: "/communicate" },
    { pattern: /(?:go to|open|show me|take me to)(?: the)? (?:watch|video|learn)/i, path: "/watch" },
    { pattern: /(?:go to|open|show me|take me to)(?: the)? (?:practice|exercise)/i, path: "/practice" },
    { pattern: /(?:go to|open|show me|take me to)(?: the)? (?:play|game|story)/i, path: "/story-mode" },
    { pattern: /(?:go to|open|show me|take me to)(?: the)? (?:progress|stats|analytics)/i, path: "/progress" },
    { pattern: /(?:go to|open|show me|take me to)(?: the)? (?:avatar|character)/i, path: "/avatar" },
    {
      pattern: /(?:go to|open|show me|take me to)(?: the)? (?:settings|options|preferences|voice)/i,
      path: "/settings",
    },
  ]

  for (const { pattern, path } of navPatterns) {
    if (pattern.test(lower)) {
      return { type: "navigate", payload: { path } }
    }
  }

  const voicePatterns = [
    { pattern: /(?:i want|use|give me|switch to|change to)(?: a)? (?:boy|male|man|guy)(?:'s)? voice/i, gender: "male" },
    {
      pattern: /(?:i want|use|give me|switch to|change to)(?: a)? (?:girl|female|woman|lady)(?:'s)? voice/i,
      gender: "female",
    },
    { pattern: /(?:make it|speak) (?:slower|slow)/i, speed: "slow" },
    { pattern: /(?:make it|speak) (?:faster|fast|quick)/i, speed: "fast" },
    { pattern: /(?:normal|regular|default) speed/i, speed: "normal" },
  ]

  for (const { pattern, gender, speed } of voicePatterns) {
    if (pattern.test(lower)) {
      return { type: "change_voice", payload: { gender, speed } }
    }
  }

  return null
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message, context, currentButtons, conversationHistory } = body as {
      message: string
      context?: string
      currentButtons?: ButtonContext[]
      conversationHistory?: ConversationHistoryItem[]
    }

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const command = parseCommand(message, currentButtons, conversationHistory)

    let buttonsContextStr = ""
    if (currentButtons && currentButtons.length > 0) {
      buttonsContextStr =
        `\n\nCURRENT BUTTONS (${currentButtons.length} total):\n` +
        currentButtons.map((b, i) => `${i + 1}. "${b.label}" (says: "${b.text}")`).join("\n")
    }

    let historyContextStr = ""
    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-6)
      historyContextStr =
        "\n\nRECENT CONVERSATION:\n" +
        recentHistory.map((h) => `${h.role === "user" ? "User" : "Helper"}: ${h.content}`).join("\n")
    }

    const systemPrompt = `You are a magical helper for Inner Voice, an app that helps children and adults learn to communicate.

YOUR PERSONALITY:
- Warm, encouraging, like a favorite teacher or helpful friend
- Use simple, clear language a child or stressed parent could understand
- Never use technical jargon
- Be brief - 1-2 sentences max

WHAT YOU CAN DO (tell people about these!):
- Create buttons instantly: "Just tell me what you want the button to say!"
- Delete buttons: "I can remove any button - just say which one!"
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

BUTTON MANAGEMENT INTELLIGENCE:
When users ask to delete buttons, understand these references:
- "the last button I made" = the most recently created button in our conversation
- "the first/top button" = button at position 1
- "the last/bottom button" = the final button in the list
- "the middle button" = button in the middle of the list
- Any label or partial text = fuzzy match to find the right button

When confirming actions, be specific:
- "Done! I removed the 'come here' button for you."
- "I made a button that says 'I need help'. You'll see it on the Talk page!"

LANGUAGE TRANSLATION:
When users switch languages, ALL content translates - buttons, labels, everything. 
Just confirm: "Switched to Spanish! Everything is now in español."

LIGHT SPEED LITERACY CURRICULUM:
Inner Voice incorporates Light Speed Literacy, a multi-sensory phonics-based curriculum designed by speech-language pathologists and dyslexia specialists. Key concepts you know:

1. LETTERS & SOUNDS: Letters (graphemes) represent sounds (phonemes). The English alphabet has 26 letters.

2. VOWELS: a, e, i, o, u (sometimes y). Vowels are the loudest sounds in English.

3. CONSONANTS: Any letter that is not a vowel. Made by moving tongue, lips, and teeth to constrict air.

4. SYLLABLES: A word or part of a word with a "talking" vowel. Can be stressed (louder/longer) or unstressed (quiet/short).

5. SYLLABLE TYPES:
   - CLOSED SYLLABLES: End with consonant, vowel is short (e.g., "it", "cat")
   - OPEN SYLLABLES: End with vowel, vowel is long (e.g., "hi", "me")  
   - SILENT-E SYLLABLES: The e jumps over consonant, makes vowel long (e.g., "make", "bike")
   - VOWEL TEAMS: When two vowels go walking, first one does talking (e.g., "pie", "boat")
   - R-CONTROLLED: The r controls the vowel sound (e.g., "car", "her", "bird")
   - CONSONANT-LE: Unstressed syllable at end (e.g., "maple", "apple")

6. SPECIAL RULES:
   - Soft c/g: c and g say /s/ and /j/ before i, y, or e (e.g., "city", "gem")
   - -ck: Always /k/ after short vowel (e.g., "back")
   - Past tense -ed: Says /t/, /d/, or /əd/ depending on final sound
   - -ing: Can make preceding vowel long (e.g., "timing")

7. TEACHING FRAMEWORK (for each concept):
   - Review previous concepts for mastery before new content
   - Auditory Drill (hearing sounds)
   - Visual Drill (seeing patterns)
   - Air Writing (kinesthetic learning)
   - Blending Drill (combining sounds)
   - Speech-to-text and text-to-speech exercises

You can help parents and therapists understand these concepts and suggest appropriate literacy activities!

CONTEXT:
- Users are often stressed parents, overwhelmed teachers, or people learning to communicate
- They don't want to learn technology - they want solutions
- If they seem frustrated, be extra supportive and offer specific help
${buttonsContextStr}
${historyContextStr}

Remember: You're like magic. They ask, you help. Instantly. Be specific about what you did!`

    const { text } = await generateText({
      model: "anthropic/claude-sonnet-4-5-20250514",
      system: systemPrompt,
      prompt: context ? `Context: ${context}\n\nUser: ${message}` : message,
      maxTokens: 200,
      temperature: 0.7,
    })

    return NextResponse.json({ response: text, command })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 })
  }
}
