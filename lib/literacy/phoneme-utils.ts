// Phoneme utility for accurate TTS pronunciation in literacy drills

import type { LiteracyItem } from "@/types/literacy"

/**
 * Get the best text representation for TTS pronunciation of syllables and words
 * Uses audioHint if available, otherwise falls back to content
 */
export function getSyllableForTTS(item: LiteracyItem): string {
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
