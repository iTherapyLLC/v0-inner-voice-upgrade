import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"
import { SUPPORTED_LANGUAGES } from "@/app/api/translate/route"

interface Command {
  type:
    | "create_button"
    | "delete_button"
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

function parseCommand(text: string): Command | null {
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

  const deletePatterns = [
    /(?:delete|remove|get rid of|take away)(?: the)? [""']?(.+?)[""']? (?:button)?$/i,
    /(?:delete|remove)(?: the)?(?: button)?(?: (?:for|that says?|called|named))?\s*[""']?(.+?)[""']?$/i,
  ]

  for (const pattern of deletePatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      return {
        type: "delete_button",
        payload: { label: match[1].trim().replace(/[""']/g, "") },
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

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    const command = parseCommand(message)

    if (command && command.type !== "conversation" && command.type !== "help") {
      return NextResponse.json({
        response: getCommandResponse(command),
        command,
      })
    }

    const systemPrompt = `You are a magical helper for Inner Voice, an app that helps children and adults learn to communicate.

YOUR PERSONALITY:
- Warm, encouraging, like a favorite teacher or helpful friend
- Use simple, clear language a child or stressed parent could understand
- Never use technical jargon
- Be brief - 1-2 sentences max

WHAT YOU CAN DO (tell people about these!):
- Create buttons instantly: "Just tell me what you want the button to say!"
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

Remember: You're like magic. They ask, you help. Instantly.`

    const { text } = await generateText({
      model: "anthropic/claude-sonnet-4-20250514",
      system: systemPrompt,
      prompt: context ? `Context: ${context}\n\nUser: ${message}` : message,
      maxTokens: 150,
      temperature: 0.7,
    })

    return NextResponse.json({ response: text, command })
  } catch (error) {
    console.error("Error generating response:", error)
    return NextResponse.json(
      {
        response:
          "I'm here to help! You can ask me to make buttons, change the voice, show stories, change language, or just chat with me.",
        error: "ai_error",
      },
      { status: 200 },
    )
  }
}

function getCommandResponse(command: Command): string {
  switch (command.type) {
    case "create_button":
      const text = command.payload?.text as string
      return `Done! I made a button that says "${text}". You'll see it on the Talk page!`

    case "delete_button":
      const label = command.payload?.label as string
      return `Okay, I removed the "${label}" button for you.`

    case "navigate":
      const path = command.payload?.path as string
      const pageName =
        path === "/"
          ? "Home"
          : path === "/communicate"
            ? "Talk"
            : path === "/avatar"
              ? "Avatar"
              : path === "/stories"
                ? "Stories"
                : path === "/progress"
                  ? "Progress"
                  : "Voice"
      return `Taking you to ${pageName} now!`

    case "change_voice":
      if (command.payload?.gender) {
        return `Done! Changed to a ${command.payload.gender} voice.`
      }
      if (command.payload?.speed) {
        return `Done! Made the voice ${command.payload.speed}er.`
      }
      return "Voice updated!"

    case "focus_learning":
      const words = command.payload?.words as string[]
      if (words && words.length === 1) {
        return `Here's "${words[0]}". Tap it when you're ready to say it! Say "bring back my buttons" when you're done learning.`
      } else if (words && words.length > 1) {
        return `Okay, showing just ${words.map((w) => `"${w}"`).join(" and ")}. Tap to practice! Say "bring back my buttons" when done.`
      }
      return "Focused on that word for you!"

    case "restore_buttons":
      return "All your buttons are back! Great job practicing!"

    case "show_story":
      const scenario = command.payload?.scenario as string
      const topic = command.payload?.topic as string
      return `Let me show you a calming story about ${topic}! Taking you to Visual Stories now.`

    case "change_language":
      const languageName = command.payload?.languageName as string
      return `Switching everything to ${languageName} now! Give me just a moment to translate all the buttons.`

    case "toggle_watch_first":
      const watchFirstEnabled = command.payload?.enabled as boolean
      return watchFirstEnabled
        ? `Watch First mode is ON! Now when you tap a button, I'll say "Watch me!" and demonstrate first. Then you try!`
        : `Watch First mode is OFF. Buttons will speak immediately when tapped.`

    case "toggle_model_mode":
      const modelModeEnabled = command.payload?.enabled as boolean
      return modelModeEnabled
        ? `Modeling Mode is ON! I'll speak slower and more clearly to help with learning.`
        : `Modeling Mode is OFF. Back to normal speed!`

    case "show_modeling_stats":
      return `Let me show you your modeling progress! Taking you to the Progress page.`

    case "show_me_how":
      const phrase = command.payload?.phrase as string
      return `Let me show you how to model "${phrase}"! Watch the button light up as I demonstrate.`

    case "get_modeling_suggestion":
      return `Getting a modeling suggestion for you based on the time of day!`

    default:
      return "I'm here to help!"
  }
}
