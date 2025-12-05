import type { CommunicationButton } from "@/types"

export type PhraseCategory = "Social" | "Requests" | "Commands" | "Refusals" | "Questions" | "Feelings"

// Category colors matching the existing button colors
export const CATEGORY_COLORS: Record<PhraseCategory, string> = {
  Social: "#14b8a6", // Teal
  Requests: "#f97316", // Orange
  Commands: "#ef4444", // Red
  Refusals: "#8b5cf6", // Purple
  Questions: "#3b82f6", // Blue
  Feelings: "#ec4899", // Pink
}

// Default icons for each category
export const CATEGORY_ICONS: Record<PhraseCategory, string> = {
  Social: "wave",
  Requests: "please",
  Commands: "stop",
  Refusals: "no",
  Questions: "what",
  Feelings: "happy",
}

// Keyword patterns for each category
const CATEGORY_PATTERNS: Record<PhraseCategory, RegExp[]> = {
  // Questions - interrogative structures
  Questions: [
    /^(what|where|when|why|who|how|which)\b/i,
    /\?$/,
    /^(is|are|was|were|do|does|did|can|could|will|would|should|have|has)\s+(it|this|that|there|you|we|they|he|she)\b/i,
    /\bwhat('s| is| are)\b/i,
    /\bwhere('s| is| are)\b/i,
    /\bwhen('s| is| are)\b/i,
    /\bhow (much|many|long|far|old)\b/i,
  ],

  // Commands - imperative structures (directives to others)
  Commands: [
    /^(stop|wait|listen|look|come|go|sit|stand|get|put|give|take|bring|show|tell|help|watch|let|leave)\b/i,
    /^(please\s+)?(stop|wait|listen|come|go)\b/i,
    /\bcome here\b/i,
    /\blisten to me\b/i,
    /\blook at (this|me|that)\b/i,
    /\bget (out|away|up|down)\b/i,
    /\bstop (it|that|doing)\b/i,
  ],

  // Refusals - declining or rejecting
  Refusals: [
    /^no\b/i,
    /\bno thank(s| you)\b/i,
    /\bdon'?t want\b/i,
    /\bi'?m (done|finished|all done)\b/i,
    /\bnot (now|yet|today|anymore)\b/i,
    /\bstop (please|it)\b/i,
    /\bleave me alone\b/i,
    /\bi refuse\b/i,
    /\bi won'?t\b/i,
    /\bnot right now\b/i,
    /\bmaybe later\b/i,
    /\bneed a break\b/i,
    /\btoo much\b/i,
  ],

  // Requests - asking for something
  Requests: [
    /\b(can|could|may|would) (i|you|we)\b/i,
    /\bplease\b/i,
    /\bi (want|need|would like)\b/i,
    /\bget me\b/i,
    /\bgive me\b/i,
    /\bhelp me\b/i,
    /\bi'?m (hungry|thirsty)\b/i,
    /\bcan i have\b/i,
    /\bi need (to|some|a|help)\b/i,
    /\bfor me\b/i,
  ],

  // Feelings - emotional expressions
  Feelings: [
    /\bi'?m (feeling|so)?\s*(happy|sad|angry|scared|tired|excited|bored|frustrated|annoyed|worried|nervous|calm|good|bad|great|fine|okay|ok)\b/i,
    /\bi (feel|love|hate|like|miss)\b/i,
    /\bi'?m (in|not in) (a |the )?mood\b/i,
    /\bfeeling\b/i,
    /\blove you\b/i,
    /\bhad a (good|bad|great|terrible) day\b/i,
    /\bi'?m (so |really )?(happy|sad|mad|upset|excited)\b/i,
  ],

  // Social/Greetings - social niceties
  Social: [
    /^(hi|hello|hey|good morning|good afternoon|good evening|good night|goodbye|bye|thanks|thank you)\b/i,
    /\b(good |have a )?(morning|afternoon|evening|night|day)\b/i,
    /\bbye( bye)?\b/i,
    /\bthank(s| you)\b/i,
    /\bsorry\b/i,
    /\bexcuse me\b/i,
    /\bnice to (meet|see) you\b/i,
    /\bhow are you\b/i,
    /\bsee you (later|soon|tomorrow)\b/i,
    /\bisn'?t (it|this|that) (amazing|great|cool|awesome)\b/i,
    /\bcome check this out\b/i,
    /\blook at this\b/i,
    /\bthis is (fun|great|awesome|cool)\b/i,
  ],
}

// Priority order for category matching (most specific first)
const CATEGORY_PRIORITY: PhraseCategory[] = [
  "Questions", // Check for question marks and interrogative words first
  "Refusals", // Negative expressions are distinct
  "Commands", // Imperatives directed at others
  "Requests", // Polite asks
  "Feelings", // Emotional expressions
  "Social", // Default social/greetings
]

/**
 * Analyzes a phrase and determines its communicative category
 * @param phrase - The phrase text to analyze
 * @returns The detected category
 */
export function categorizePhrase(phrase: string): PhraseCategory {
  const normalizedPhrase = phrase.trim().toLowerCase()

  // Check each category in priority order
  for (const category of CATEGORY_PRIORITY) {
    const patterns = CATEGORY_PATTERNS[category]
    for (const pattern of patterns) {
      if (pattern.test(normalizedPhrase)) {
        return category
      }
    }
  }

  // Default to Social if no specific category detected
  return "Social"
}

/**
 * Determines the appropriate icon based on the phrase content
 * @param phrase - The phrase text
 * @param category - The detected category (optional, will be calculated if not provided)
 * @returns The icon name to use
 */
export function suggestIcon(phrase: string, category?: PhraseCategory): string {
  const normalizedPhrase = phrase.toLowerCase()
  const cat = category || categorizePhrase(phrase)

  // Check for specific phrase patterns that suggest icons
  if (/\bhungry\b/.test(normalizedPhrase)) return "hungry"
  if (/\bthirsty\b/.test(normalizedPhrase)) return "thirsty"
  if (/\bhelp\b/.test(normalizedPhrase)) return "help"
  if (/\bstop\b/.test(normalizedPhrase)) return "stop"
  if (/\bwait\b/.test(normalizedPhrase)) return "wait"
  if (/\blisten\b/.test(normalizedPhrase)) return "listen"
  if (/\blook\b/.test(normalizedPhrase)) return "eye"
  if (/\bhappy\b/.test(normalizedPhrase)) return "happy"
  if (/\bsad\b/.test(normalizedPhrase)) return "sad"
  if (/\blove\b/.test(normalizedPhrase)) return "love"
  if (/\btired\b/.test(normalizedPhrase)) return "wait"
  if (/\bbye|goodbye\b/.test(normalizedPhrase)) return "bye"
  if (/\bmorning\b/.test(normalizedPhrase)) return "sun"
  if (/\bnight\b/.test(normalizedPhrase)) return "moon"
  if (/\bwhat\b/.test(normalizedPhrase)) return "what"
  if (/\bwhere\b/.test(normalizedPhrase)) return "where"
  if (/\bwhen\b/.test(normalizedPhrase)) return "when"
  if (/\bwhy\b/.test(normalizedPhrase)) return "why"
  if (/\bno\b/.test(normalizedPhrase)) return "no"
  if (/\bdone|finished\b/.test(normalizedPhrase)) return "finished"
  if (/\bcome here\b/.test(normalizedPhrase)) return "wave"
  if (/\bplease\b/.test(normalizedPhrase)) return "please"
  if (/\bfun|great|amazing\b/.test(normalizedPhrase)) return "smile"
  if (/\bbathroom\b/.test(normalizedPhrase)) return "wait"

  // Fallback to category default
  return CATEGORY_ICONS[cat]
}

/**
 * Determines the appropriate emotion for TTS based on phrase content
 * @param phrase - The phrase text
 * @param category - The detected category (optional, will be calculated if not provided)
 * @returns The emotion to use for TTS
 */
export function suggestEmotion(phrase: string, category?: PhraseCategory): string {
  const normalizedPhrase = phrase.toLowerCase()
  const cat = category || categorizePhrase(phrase)

  // Check for explicit emotion indicators
  if (/\bhappy|excited|fun|great|love|amazing|awesome\b/.test(normalizedPhrase)) return "happy"
  if (/\bsad|upset|miss\b/.test(normalizedPhrase)) return "sad"
  if (/\bangry|mad|frustrated|annoyed\b/.test(normalizedPhrase)) return "frustrated"
  if (/\btired|sleepy|calm|break\b/.test(normalizedPhrase)) return "calm"
  if (/\bexcited|can't wait|wow\b/.test(normalizedPhrase)) return "excited"
  if (/\bstop|no|don't\b/.test(normalizedPhrase)) return "serious"

  // Default emotions by category
  const categoryEmotions: Record<PhraseCategory, string> = {
    Social: "happy",
    Requests: "neutral",
    Commands: "serious",
    Refusals: "calm",
    Questions: "neutral",
    Feelings: "neutral",
  }

  return categoryEmotions[cat]
}

/**
 * Creates a complete button configuration from a phrase
 * @param phrase - The phrase text
 * @param overrides - Optional overrides for any button property
 * @returns A complete CommunicationButton configuration
 */
export function createButtonFromPhrase(
  phrase: string,
  overrides?: Partial<CommunicationButton>,
): Omit<CommunicationButton, "id"> {
  const category = (overrides?.category as PhraseCategory) || categorizePhrase(phrase)
  const icon = overrides?.icon || suggestIcon(phrase, category)
  const emotion = overrides?.emotion || suggestEmotion(phrase, category)
  const color = CATEGORY_COLORS[category]

  // Generate a short label from the phrase (first few words or truncate)
  const words = phrase.split(" ")
  const label = words.length <= 4 ? phrase : words.slice(0, 4).join(" ") + "..."

  return {
    label: overrides?.label || label,
    text: overrides?.text || phrase,
    category,
    color: overrides?.color || color,
    icon,
    emotion,
    contextHint: overrides?.contextHint || `A child expressing: ${phrase}`,
  }
}
