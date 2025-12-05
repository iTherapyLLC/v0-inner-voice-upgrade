// Phoneme utility for accurate TTS pronunciation in literacy drills

import type { LiteracyItem } from "@/types/literacy"

/**
 * Carrier syllables for consonants
 * Maps consonant letters to syllable and example word for natural TTS
 */
export const CARRIER_SYLLABLES: Record<string, { syllable: string; word: string }> = {
  "b": { syllable: "buh", word: "bat" },
  "c": { syllable: "kuh", word: "cat" },
  "d": { syllable: "duh", word: "dog" },
  "f": { syllable: "fuh", word: "fan" },
  "g": { syllable: "guh", word: "gas" },
  "h": { syllable: "huh", word: "hat" },
  "j": { syllable: "juh", word: "jam" },
  "k": { syllable: "kuh", word: "kit" },
  "l": { syllable: "luh", word: "lap" },
  "m": { syllable: "muh", word: "map" },
  "n": { syllable: "nuh", word: "nap" },
  "p": { syllable: "puh", word: "pan" },
  "q": { syllable: "kwuh", word: "quiz" },
  "r": { syllable: "ruh", word: "rat" },
  "s": { syllable: "suh", word: "sat" },
  "t": { syllable: "tuh", word: "tap" },
  "v": { syllable: "vuh", word: "van" },
  "w": { syllable: "wuh", word: "wag" },
  "x": { syllable: "ks", word: "box" },
  "y": { syllable: "yuh", word: "yam" },
  "z": { syllable: "zuh", word: "zip" },
}

/**
 * Carrier syllables for vowels
 * Maps vowel letters to syllable and example word for natural TTS
 */
export const VOWEL_CARRIERS: Record<string, { syllable: string; word: string }> = {
  "a": { syllable: "ah", word: "cat" },
  "e": { syllable: "eh", word: "bed" },
  "i": { syllable: "ih", word: "sit" },
  "o": { syllable: "ah", word: "hot" },
  "u": { syllable: "uh", word: "cup" },
}

/**
 * Get syllable-based text for TTS that produces clear, natural audio
 * Uses carrier syllables and example words instead of isolated IPA phonemes
 */
export function getSyllableForTTS(item: LiteracyItem): string {
  const letter = item.content.toLowerCase()
  
  if (item.type === "letter" || item.type === "sound") {
    // Check for consonant carrier
    const consonant = CARRIER_SYLLABLES[letter]
    if (consonant) {
      return `${item.content.toUpperCase()} says ${consonant.syllable}, as in ${consonant.word}`
    }
    
    // Check for vowel carrier
    const vowel = VOWEL_CARRIERS[letter]
    if (vowel) {
      return `${item.content.toUpperCase()} says ${vowel.syllable}, as in ${vowel.word}`
    }
  }
  
  // Fall back to audioHint or content
  return item.audioHint || item.content
}

/**
 * Get the best text representation for TTS pronunciation
 * Prefers IPA notation when available for accuracy, falls back to audioHint
 * DEPRECATED: Use getSyllableForTTS instead for better audio quality
 */
export function getPhonemeForTTS(item: LiteracyItem): string {
  // If IPA is provided, use it directly for most accurate pronunciation
  // ElevenLabs and other TTS engines handle IPA notation well
  if (item.ipa) {
    return item.ipa
  }
  
  // Fall back to audioHint which may contain slash notation like "/æ/"
  if (item.audioHint) {
    return item.audioHint
  }
  
  // Last resort: use the content itself
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
 * Get full descriptive audio hint for TTS
 * E.g., "The letter A says æ" or "Short a sound: æ"
 */
export function getDescriptiveAudioHint(item: LiteracyItem): string {
  const phoneme = item.ipa || item.audioHint || item.content
  
  if (item.type === "letter") {
    return `The letter ${item.content} says ${phoneme}`
  } else if (item.type === "sound") {
    const description = item.phoneme || "sound"
    return `${description}: ${phoneme}`
  }
  
  return phoneme
}

/**
 * IPA pronunciation dictionary for common graphemes
 * Maps grapheme+context to IPA for contextual sounds
 */
export const IPA_DICTIONARY: Record<string, string> = {
  // Short vowels
  "a_short": "æ",
  "e_short": "ɛ",
  "i_short": "ɪ",
  "o_short": "ɑ",
  "u_short": "ʌ",
  
  // Long vowels
  "a_long": "eɪ",
  "e_long": "i",
  "i_long": "aɪ",
  "o_long": "oʊ",
  "u_long": "ju",
  
  // Consonants (hard sounds)
  "c_hard": "k",
  "g_hard": "g",
  
  // Consonants (soft sounds)
  "c_soft": "s",
  "g_soft": "dʒ",
  
  // Common consonants
  "b": "b",
  "d": "d",
  "f": "f",
  "h": "h",
  "j": "dʒ",
  "k": "k",
  "l": "l",
  "m": "m",
  "n": "n",
  "p": "p",
  "r": "r",
  "s": "s",
  "t": "t",
  "v": "v",
  "w": "w",
  "x": "ks",
  "y": "j",
  "z": "z",
  
  // Digraphs
  "ch": "tʃ",
  "sh": "ʃ",
  "th_voiced": "ð",
  "th_unvoiced": "θ",
  "wh": "hw",
  "ph": "f",
  
  // R-controlled vowels
  "ar": "ɑr",
  "er": "ɜr",
  "ir": "ɜr",
  "or": "ɔr",
  "ur": "ɜr",
  
  // Vowel teams
  "ai": "eɪ",
  "ay": "eɪ",
  "ea": "i",
  "ee": "i",
  "oa": "oʊ",
  "ow": "aʊ",
  "oi": "ɔɪ",
  "oy": "ɔɪ",
  "ou": "aʊ",
  "oo_long": "u",
  "oo_short": "ʊ",
}

/**
 * Look up IPA notation from dictionary
 */
export function lookupIPA(grapheme: string, context?: string): string | undefined {
  const key = context ? `${grapheme}_${context}` : grapheme
  return IPA_DICTIONARY[key.toLowerCase()]
}
