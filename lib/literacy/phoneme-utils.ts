// Phoneme utility for accurate TTS pronunciation in literacy drills

import type { LiteracyItem } from "@/types/literacy"

/**
 * CV (Consonant-Vowel) open syllable pronunciation rules:
 * In open syllables, vowels say their "long" or "name" sounds
 * - A says /ah/ (as in "ma", "pa")
 * - E says /ee/ (as in "me", "be")
 * - I says /eye/ (as in "my", "hi")
 * - O says /oh/ (as in "go", "no")
 * - U says /oo/ or /you/ (as in "mu", "tu")
 */

const CV_PRONUNCIATION_MAP: Record<string, string> = {
  // A vowel CV syllables - pronounced /ah/
  ma: "mah",
  pa: "pah",
  ba: "bah",
  da: "dah",
  na: "nah",
  ta: "tah",
  sa: "sah",
  la: "lah",
  fa: "fah",
  ga: "gah",
  ha: "hah",
  ja: "jah",
  ka: "kah",
  ra: "rah",
  va: "vah",
  wa: "wah",
  ya: "yah",
  za: "zah",

  // E vowel CV syllables - pronounced /ee/
  me: "mee",
  be: "bee",
  de: "dee",
  fe: "fee",
  ge: "gee",
  he: "hee",
  je: "jee",
  ke: "kee",
  le: "lee",
  ne: "nee",
  pe: "pee",
  re: "ree",
  se: "see",
  te: "tee",
  ve: "vee",
  we: "wee",
  ze: "zee",

  // I vowel CV syllables - pronounced /eye/
  mi: "my",
  bi: "by",
  di: "die",
  fi: "fie",
  gi: "guy",
  hi: "hi",
  ki: "kie",
  li: "lie",
  ni: "nigh",
  pi: "pie",
  ri: "rye",
  si: "sigh",
  ti: "tie",
  vi: "vie",
  wi: "why",
  zi: "zye",

  // O vowel CV syllables - pronounced /oh/
  go: "go",
  so: "so",
  no: "no",
  do: "doe",
  bo: "bow",
  fo: "foe",
  ho: "hoe",
  jo: "joe",
  ko: "koe",
  lo: "low",
  mo: "mow",
  po: "poe",
  ro: "row",
  to: "toe",
  vo: "voe",
  wo: "woe",
  yo: "yo",
  zo: "zoe",

  // U vowel CV syllables - pronounced /oo/ or /you/
  mu: "moo",
  bu: "boo",
  du: "doo",
  fu: "foo",
  gu: "goo",
  hu: "who",
  ju: "joo",
  ku: "koo",
  lu: "loo",
  nu: "noo",
  pu: "poo",
  ru: "roo",
  su: "sue",
  tu: "too",
  vu: "view",
  wu: "woo",
  yu: "you",
  zu: "zoo",
}

// Each CV syllable maps to an array of acceptable pronunciations the user might say
const CV_ACCEPTABLE_RESPONSES: Record<string, string[]> = {
  // A vowel CV syllables - pronounced /ah/
  ma: ["mah", "ma", "muh"],
  pa: ["pah", "pa", "puh"],
  ba: ["bah", "ba", "buh"],
  da: ["dah", "da", "duh"],
  na: ["nah", "na", "nuh"],
  ta: ["tah", "ta", "tuh"],
  sa: ["sah", "sa", "suh"],
  la: ["lah", "la", "luh"],
  fa: ["fah", "fa", "fuh"],
  ga: ["gah", "ga", "guh"],
  ha: ["hah", "ha", "huh"],
  ja: ["jah", "ja", "juh"],
  ka: ["kah", "ka", "kuh"],
  ra: ["rah", "ra", "ruh"],
  va: ["vah", "va", "vuh"],
  wa: ["wah", "wa", "wuh"],
  ya: ["yah", "ya", "yuh"],
  za: ["zah", "za", "zuh"],

  // E vowel CV syllables - pronounced /ee/
  me: ["mee", "me", "mi"],
  be: ["bee", "be", "bi"],
  de: ["dee", "de", "di"],
  fe: ["fee", "fe", "fi"],
  ge: ["gee", "ge", "gi", "jee"],
  he: ["hee", "he", "hi"],
  je: ["jee", "je", "ji"],
  ke: ["kee", "ke", "ki"],
  le: ["lee", "le", "li"],
  ne: ["nee", "ne", "ni"],
  pe: ["pee", "pi", "pai", "pye"],
  re: ["ree", "re", "ri"],
  se: ["see", "se", "si"],
  te: ["tee", "te", "ti"],
  ve: ["vee", "ve", "vi"],
  we: ["wee", "we", "wi"],
  ze: ["zee", "ze", "zi"],

  // I vowel CV syllables - pronounced /eye/
  mi: ["my", "mi", "mie", "mai"],
  bi: ["by", "bi", "bie", "bye", "buy"],
  di: ["die", "di", "dye", "dai"],
  fi: ["fie", "fi", "fye", "fai", "phi"],
  gi: ["guy", "gi", "gai", "guai"],
  hi: ["hi", "high", "hai", "hie"],
  ki: ["ky", "ki", "kai", "kye"],
  li: ["lie", "li", "lai", "lye"],
  ni: ["nigh", "ni", "nye", "nai"],
  pi: ["pie", "pi", "pai", "pye"],
  ri: ["rye", "ri", "rai", "rie"],
  si: ["sigh", "si", "sai", "sye"],
  ti: ["tie", "ti", "tai", "tye"],
  vi: ["vie", "vi", "vai", "vye"],
  wi: ["why", "wi", "wai", "wye"],
  zi: ["zye", "zi", "zai", "zie"],

  // O vowel CV syllables - pronounced /oh/
  go: ["go", "goh", "gow"],
  so: ["so", "soh", "sow"],
  no: ["no", "noh", "know"],
  do: ["doe", "do", "doh", "dough"],
  bo: ["bow", "bo", "boh", "beau"],
  fo: ["foe", "fo", "foh"],
  ho: ["hoe", "ho", "hoh", "whoa"],
  jo: ["joe", "jo", "joh"],
  ko: ["ko", "koh", "co"],
  lo: ["low", "lo", "loh"],
  mo: ["mow", "mo", "moh"],
  po: ["poe", "po", "poh"],
  ro: ["row", "ro", "roh"],
  to: ["toe", "to", "toh"],
  vo: ["vo", "voh"],
  wo: ["woe", "wo", "woh", "whoa"],
  yo: ["yo", "yoh"],
  zo: ["zoe", "zo", "zoh"],

  // U vowel CV syllables - pronounced /oo/ or /you/
  mu: ["moo", "mu", "mew"],
  bu: ["boo", "bu", "bew"],
  du: ["doo", "du", "dew", "do"],
  fu: ["foo", "fu", "few", "phew"],
  gu: ["goo", "gu", "gew"],
  hu: ["who", "hu", "hoo", "hew"],
  ju: ["joo", "ju", "jew"],
  ku: ["coo", "ku", "koo", "queue"],
  lu: ["loo", "lu", "lew"],
  nu: ["noo", "nu", "new", "knew"],
  pu: ["poo", "pu", "pew"],
  ru: ["roo", "ru", "rue"],
  su: ["sue", "su", "soo"],
  tu: ["too", "tu", "two", "to"],
  vu: ["view", "vu", "voo"],
  wu: ["woo", "wu"],
  yu: ["you", "yu", "yoo"],
  zu: ["zoo", "zu", "zew"],
}

/**
 * Check if a syllable is a CV (consonant-vowel) pattern
 */
function isCVSyllable(content: string): boolean {
  if (content.length !== 2) return false
  const consonants = "bcdfghjklmnpqrstvwxyz"
  const vowels = "aeiou"
  return consonants.includes(content[0].toLowerCase()) && vowels.includes(content[1].toLowerCase())
}

/**
 * Get the correct pronunciation for a CV syllable
 * Returns the phonetic spelling for TTS to pronounce correctly
 */
function getCVPronunciation(content: string): string {
  const lowerContent = content.toLowerCase()

  // Check our pronunciation map first
  if (CV_PRONUNCIATION_MAP[lowerContent]) {
    return CV_PRONUNCIATION_MAP[lowerContent]
  }

  // Fallback: generate pronunciation based on vowel rules
  if (isCVSyllable(lowerContent)) {
    const consonant = lowerContent[0]
    const vowel = lowerContent[1]

    switch (vowel) {
      case "a":
        return `${consonant}ah`
      case "e":
        return `${consonant}ee`
      case "i":
        return `${consonant}y` // or use phonetic "eye" sound
      case "o":
        return `${consonant}oh`
      case "u":
        return `${consonant}oo`
      default:
        return content
    }
  }

  return content
}

/**
 * Get the best text representation for TTS pronunciation
 * Handles syllables, words, and patterns
 * Uses audioHint if available, otherwise applies pronunciation rules
 */
export function getSyllableForTTS(item: LiteracyItem): string {
  if (item.syllablePattern === "CV" && item.type === "syllable") {
    const pronunciation = getCVPronunciation(item.content)
    // If there's an audioHint, replace the syllable in it with correct pronunciation
    if (item.audioHint) {
      // Extract just the instruction part and add correct pronunciation
      const content = item.content.toLowerCase()
      const correctPronunciation = pronunciation

      // Replace the syllable in the hint with the correct pronunciation
      if (item.audioHint.includes(content)) {
        return item.audioHint.replace(new RegExp(content, "gi"), correctPronunciation)
      }
      return `${item.audioHint} - ${correctPronunciation}`
    }
    return pronunciation
  }

  // Use audioHint if provided for better context
  if (item.audioHint) {
    return item.audioHint
  }

  // Fall back to the content itself (syllables and words are naturally pronounceable)
  return item.content
}

/**
 * Format phoneme text for human-readable display
 */
export function formatPhonemeDisplay(item: LiteracyItem): string {
  if (item.phoneme) {
    return item.phoneme
  }

  if (item.audioHint) {
    return item.audioHint
  }

  return item.content
}

/**
 * Get the phonetic representation for display (e.g., showing /ah/ for "ma")
 */
export function getPhoneticDisplay(item: LiteracyItem): string | null {
  if (item.syllablePattern === "CV" && item.type === "syllable") {
    const vowel = item.content[1]?.toLowerCase()
    switch (vowel) {
      case "a":
        return "/ah/"
      case "e":
        return "/ee/"
      case "i":
        return "/eye/"
      case "o":
        return "/oh/"
      case "u":
        return "/oo/"
      default:
        return null
    }
  }
  return null
}

/**
 * Verify if the user's spoken response matches the expected CV syllable pronunciation
 * Uses fuzzy matching to account for speech recognition variations
 */
export function verifyCVPronunciation(
  syllable: string,
  spokenText: string,
): { isCorrect: boolean; confidence: "high" | "medium" | "low"; feedback: string } {
  const lowerSyllable = syllable.toLowerCase().trim()
  const lowerSpoken = spokenText.toLowerCase().trim()

  // Get acceptable responses for this syllable
  const acceptableResponses = CV_ACCEPTABLE_RESPONSES[lowerSyllable] || []

  // Also add the syllable itself and its TTS pronunciation
  const allAcceptable = [...acceptableResponses, lowerSyllable, CV_PRONUNCIATION_MAP[lowerSyllable] || ""]
    .filter(Boolean)
    .map((s) => s.toLowerCase())

  // Check for exact match first (high confidence)
  if (allAcceptable.includes(lowerSpoken)) {
    return {
      isCorrect: true,
      confidence: "high",
      feedback: "Perfect! You said it exactly right!",
    }
  }

  // Check if spoken text contains any acceptable response (medium confidence)
  for (const acceptable of allAcceptable) {
    if (lowerSpoken.includes(acceptable) || acceptable.includes(lowerSpoken)) {
      return {
        isCorrect: true,
        confidence: "medium",
        feedback: "Great job! You got it!",
      }
    }
  }

  // Check for phonetic similarity using simple heuristics
  const vowel = lowerSyllable[1]
  const expectedVowelSound = getExpectedVowelSound(vowel)

  // Check if the spoken response has the correct vowel sound pattern
  if (hasCorrectVowelSound(lowerSpoken, vowel)) {
    // Check if consonant is close enough
    const consonant = lowerSyllable[0]
    if (lowerSpoken.startsWith(consonant) || lowerSpoken.includes(consonant)) {
      return {
        isCorrect: true,
        confidence: "low",
        feedback: "Good try! That sounds right!",
      }
    }
  }

  // Not correct - provide helpful feedback
  const correctPronunciation = CV_PRONUNCIATION_MAP[lowerSyllable] || lowerSyllable
  return {
    isCorrect: false,
    confidence: "high",
    feedback: `Try again! ${syllable.toUpperCase()} sounds like "${correctPronunciation}". ${expectedVowelSound}`,
  }
}

/**
 * Get the expected vowel sound description for feedback
 */
function getExpectedVowelSound(vowel: string): string {
  switch (vowel.toLowerCase()) {
    case "a":
      return "The A says /ah/."
    case "e":
      return "The E says /ee/."
    case "i":
      return "The I says /eye/."
    case "o":
      return "The O says /oh/."
    case "u":
      return "The U says /oo/."
    default:
      return ""
  }
}

/**
 * Check if spoken text contains the correct vowel sound pattern
 */
function hasCorrectVowelSound(spoken: string, vowel: string): boolean {
  const vowelPatterns: Record<string, string[]> = {
    a: ["ah", "uh", "a"],
    e: ["ee", "ea", "e", "i"],
    i: ["eye", "ie", "igh", "y", "ai"],
    o: ["oh", "oe", "ow", "o"],
    u: ["oo", "ew", "ue", "u", "ou"],
  }

  const patterns = vowelPatterns[vowel.toLowerCase()] || []
  return patterns.some((pattern) => spoken.includes(pattern))
}

/**
 * Get all acceptable pronunciations for a CV syllable (for display/hints)
 */
export function getAcceptablePronunciations(syllable: string): string[] {
  const lowerSyllable = syllable.toLowerCase()
  return CV_ACCEPTABLE_RESPONSES[lowerSyllable] || [lowerSyllable]
}
