// Phoneme utility for accurate TTS pronunciation in literacy drills

import type { LiteracyItem } from "@/types/literacy"

/**
 * Get syllable-based text for TTS that produces clear, natural audio
 * Uses natural prompts for syllables and words instead of isolated phonemes
 */
export function getSyllableForTTS(item: LiteracyItem): string {
  // For syllables, use simple natural prompts
  if (item.type === "syllable") {
    if (item.syllablePattern === "CV" || item.syllablePattern === "VC") {
      return item.audioHint || `This syllable is: ${item.content}`
    }
  }
  
  // For CVCV words (two-syllable words)
  if (item.syllablePattern === "CVCV") {
    return item.audioHint || `Read this word: ${item.content}`
  }
  
  // For CVC-e words (Magic E)
  if (item.syllablePattern === "CVC-e") {
    return item.audioHint || `This word is: ${item.content}`
  }
  
  // For CVC words
  if (item.syllablePattern === "CVC") {
    return item.audioHint || `Read this word: ${item.content}`
  }
  
  // Fall back to audioHint or content
  return item.audioHint || item.content
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
