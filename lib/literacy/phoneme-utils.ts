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
// Expanded to include common speech recognition variations
const CV_ACCEPTABLE_RESPONSES: Record<string, string[]> = {
  // A vowel CV syllables - pronounced /ah/
  ma: ["mah", "ma", "muh", "maa", "mar", "my", "mom", "mat", "mas"],
  pa: ["pah", "pa", "puh", "paa", "par", "pot", "pat", "pas", "paw"],
  ba: ["bah", "ba", "buh", "baa", "bar", "bot", "bat", "but", "bob", "bop", "bad", "bag", "bath"],
  da: ["dah", "da", "duh", "daa", "dar", "dot", "dad", "dat", "das"],
  na: ["nah", "na", "nuh", "naa", "nar", "not", "nat", "nas", "nap"],
  ta: ["tah", "ta", "tuh", "taa", "tar", "tot", "tat", "tas", "tap"],
  sa: ["sah", "sa", "suh", "saa", "sar", "sat", "sad", "sas", "saw"],
  la: ["lah", "la", "luh", "laa", "lar", "lot", "lat", "las", "law"],
  fa: ["fah", "fa", "fuh", "faa", "far", "fat", "fas", "fad"],
  ga: ["gah", "ga", "guh", "gaa", "gar", "got", "gat", "gas", "god"],
  ha: ["hah", "ha", "huh", "haa", "har", "hot", "hat", "has", "had"],
  ja: ["jah", "ja", "juh", "jaa", "jar", "jot", "jat", "jas"],
  ka: ["kah", "ka", "kuh", "kaa", "kar", "cot", "cat", "cas", "car"],
  ra: ["rah", "ra", "ruh", "raa", "rar", "rot", "rat", "ras", "raw"],
  va: ["vah", "va", "vuh", "vaa", "var", "vat", "vas"],
  wa: ["wah", "wa", "wuh", "waa", "war", "wot", "wat", "was", "what"],
  ya: ["yah", "ya", "yuh", "yaa", "yar", "yat", "yas"],
  za: ["zah", "za", "zuh", "zaa", "zar", "zat", "zas"],

  // E vowel CV syllables - pronounced /ee/
  me: ["mee", "me", "mi", "may", "meet", "meal", "mean", "meat"],
  be: ["bee", "be", "bi", "bay", "beat", "bead", "bean", "beak"],
  de: ["dee", "de", "di", "day", "deal", "dean", "deep"],
  fe: ["fee", "fe", "fi", "fay", "feet", "feel", "feed"],
  ge: ["gee", "ge", "gi", "jee", "gay", "geek", "gene"],
  he: ["hee", "he", "hi", "hay", "heat", "heal", "heap", "heed"],
  je: ["jee", "je", "ji", "jay", "jean", "jeep"],
  ke: ["kee", "ke", "ki", "kay", "key", "keen", "keep"],
  le: ["lee", "le", "li", "lay", "lead", "lean", "leap", "leaf"],
  ne: ["nee", "ne", "ni", "nay", "need", "neat", "knee"],
  pe: ["pee", "pe", "pi", "pay", "pea", "peak", "peat", "peel"],
  re: ["ree", "re", "ri", "ray", "read", "real", "reap"],
  se: ["see", "se", "si", "say", "sea", "seal", "seat", "seed"],
  te: ["tee", "te", "ti", "tay", "tea", "teal", "team", "teen"],
  ve: ["vee", "ve", "vi", "vay", "veal"],
  we: ["wee", "we", "wi", "way", "weak", "wean", "weep"],
  ze: ["zee", "ze", "zi", "zay", "zeal", "zebra"],

  // I vowel CV syllables - pronounced /eye/
  mi: ["my", "mi", "mie", "mai", "mine", "might", "mike", "mile"],
  bi: ["by", "bi", "bie", "bye", "buy", "bike", "bite", "bind"],
  di: ["die", "di", "dye", "dai", "dine", "dive", "dial"],
  fi: ["fie", "fi", "fye", "fai", "phi", "fine", "find", "five", "file", "fight"],
  gi: ["guy", "gi", "gai", "guai", "guide", "grind"],
  hi: ["hi", "high", "hai", "hie", "hide", "hike", "hind", "height"],
  ki: ["ky", "ki", "kai", "kye", "kind", "kite", "kyle"],
  li: ["lie", "li", "lai", "lye", "life", "like", "line", "light", "lime"],
  ni: ["nigh", "ni", "nye", "nai", "night", "nine", "nice", "knife"],
  pi: ["pie", "pi", "pai", "pye", "pine", "pile", "pipe", "pike"],
  ri: ["rye", "ri", "rai", "rie", "ride", "rise", "ripe", "right", "rice"],
  si: ["sigh", "si", "sai", "sye", "side", "sign", "site", "sight", "size"],
  ti: ["tie", "ti", "tai", "tye", "tide", "time", "tire", "tight", "type"],
  vi: ["vie", "vi", "vai", "vye", "vine", "vibe", "vile", "viper"],
  wi: ["why", "wi", "wai", "wye", "wide", "wife", "wine", "wild", "white", "wipe"],
  zi: ["zye", "zi", "zai", "zie"],

  // O vowel CV syllables - pronounced /oh/
  go: ["go", "goh", "gow", "goal", "goat", "gold", "grow"],
  so: ["so", "soh", "sow", "soul", "sold", "show", "slow"],
  no: ["no", "noh", "know", "nose", "note", "node", "snow"],
  do: ["doe", "do", "doh", "dough", "dose", "dome", "don't"],
  bo: ["bow", "bo", "boh", "beau", "boat", "bold", "bone", "both", "bowl"],
  fo: ["foe", "fo", "foh", "foam", "fold", "folk"],
  ho: ["hoe", "ho", "hoh", "whoa", "home", "hope", "hold", "hole", "host"],
  jo: ["joe", "jo", "joh", "joke", "jones"],
  ko: ["ko", "koh", "co", "code", "cold", "coat"],
  lo: ["low", "lo", "loh", "load", "loan", "lone"],
  mo: ["mow", "mo", "moh", "mode", "most", "mold", "moat"],
  po: ["poe", "po", "poh", "pole", "post", "poke"],
  ro: ["row", "ro", "roh", "road", "role", "rose", "roll", "rope"],
  to: ["toe", "to", "toh", "told", "tone", "toast"],
  vo: ["vo", "voh", "vote", "vogue"],
  wo: ["woe", "wo", "woh", "whoa", "woke", "won't"],
  yo: ["yo", "yoh", "yoke", "yoga"],
  zo: ["zoe", "zo", "zoh", "zone"],

  // U vowel CV syllables - pronounced /oo/ or /you/
  mu: ["moo", "mu", "mew", "move", "mood", "moon", "moose"],
  bu: ["boo", "bu", "bew", "boot", "boom", "boost", "book"],
  du: ["doo", "du", "dew", "do", "due", "duke", "dune", "doom"],
  fu: ["foo", "fu", "few", "phew", "food", "fuel", "fuse"],
  gu: ["goo", "gu", "gew", "goose", "goop"],
  hu: ["who", "hu", "hoo", "hew", "huge", "hue", "whom"],
  ju: ["joo", "ju", "jew", "june", "juice", "jude"],
  ku: ["coo", "ku", "koo", "queue", "cool", "coup"],
  lu: ["loo", "lu", "lew", "loom", "loop", "lose", "luke"],
  nu: ["noo", "nu", "new", "knew", "noon", "news", "nude"],
  pu: ["poo", "pu", "pew", "pool", "poop"],
  ru: ["roo", "ru", "rue", "room", "roof", "root", "rule"],
  su: ["sue", "su", "soo", "soon", "soup", "suit"],
  tu: ["too", "tu", "two", "to", "tube", "tune", "tool", "tooth"],
  vu: ["view", "vu", "voo"],
  wu: ["woo", "wu", "womb", "wound"],
  yu: ["you", "yu", "yoo", "youth", "use"],
  zu: ["zoo", "zu", "zew", "zoom"],
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
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
      }
    }
  }

  return matrix[b.length][a.length]
}

/**
 * Check if two strings are similar using Levenshtein distance
 * Returns true if edit distance is within threshold
 */
function isSimilar(a: string, b: string, maxDistance: number = 2): boolean {
  if (a === b) return true
  if (Math.abs(a.length - b.length) > maxDistance) return false
  return levenshteinDistance(a, b) <= maxDistance
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

  // Check for Levenshtein distance similarity (allows for minor speech recognition errors)
  for (const acceptable of allAcceptable) {
    // For short syllables (2-3 chars), allow 1 edit distance
    // For longer words, allow 2 edit distance
    const maxDist = acceptable.length <= 3 ? 1 : 2
    if (isSimilar(lowerSpoken, acceptable, maxDist)) {
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

  // Additional lenient check: if spoken starts with correct consonant and is short
  const consonant = lowerSyllable[0]
  if (lowerSpoken.startsWith(consonant) && lowerSpoken.length <= 4) {
    return {
      isCorrect: true,
      confidence: "low",
      feedback: "Good effort! Keep practicing!",
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
