/**
 * SSML Generator for Lightspeed Literacy
 * 
 * Generates Speech Synthesis Markup Language (SSML) for accurate
 * pronunciation of phonemes using IPA notation with ElevenLabs TTS.
 * 
 * This is critical for literacy instruction where students need to
 * hear the exact sound of a phoneme, not the letter name.
 */

import { LiteracyItem } from '../types/literacy';

/**
 * Generates SSML with IPA phoneme pronunciation
 * 
 * @param item - The literacy item to generate SSML for
 * @param mode - 'phoneme' for pure sound, 'descriptive' for "[letter] says [sound]"
 * @returns SSML string ready for TTS
 * 
 * @example
 * // For auditory drill (phoneme only):
 * generateSSML(shortA, 'phoneme')
 * // Returns: <speak><phoneme alphabet="ipa" ph="æ">a</phoneme></speak>
 * 
 * // For visual drill (descriptive):
 * generateSSML(shortA, 'descriptive')
 * // Returns: <speak>The letter A says <phoneme alphabet="ipa" ph="æ">a</phoneme></speak>
 */
export function generateSSML(
  item: LiteracyItem,
  mode: 'phoneme' | 'descriptive' | 'word' = 'phoneme'
): string {
  const { content, ipa, phoneme, grapheme, audioHint } = item;
  
  // Fallback if no IPA provided
  const ipaNotation = ipa || content;
  const displayText = grapheme || content;
  
  switch (mode) {
    case 'phoneme':
      // Pure phoneme sound (for auditory drills)
      return `<speak><phoneme alphabet="ipa" ph="${ipaNotation}">${displayText}</phoneme></speak>`;
    
    case 'descriptive':
      // Descriptive hint (for visual/air writing drills)
      if (audioHint) {
        // Use custom audio hint if provided
        return `<speak>${audioHint}</speak>`;
      } else {
        // Generic format
        return `<speak><phoneme alphabet="ipa" ph="${ipaNotation}">${displayText}</phoneme></speak>`;
      }
    
    case 'word':
      // Full word pronunciation (for blending/TTS drills)
      const wordIPA = item.exampleIPA || ipa || content;
      return `<speak><phoneme alphabet="ipa" ph="${wordIPA}">${displayText}</phoneme></speak>`;
    
    default:
      return `<speak>${displayText}</speak>`;
  }
}

/**
 * Generates SSML for a blending word with letter-by-letter breakdown
 * 
 * @param word - The word to blend (e.g., "cat")
 * @param letterIPAs - Array of IPA notations for each letter
 * @returns SSML string with pauses between letters
 * 
 * @example
 * generateBlendingSSML("cat", ["k", "æ", "t"])
 * // Speaks: /k/ ... /æ/ ... /t/ ... cat
 */
export function generateBlendingSSML(
  word: string,
  letterIPAs: string[]
): string {
  const letters = word.split('');
  
  // Build letter-by-letter with pauses
  const letterParts = letters.map((letter, i) => {
    const ipaValue = letterIPAs[i] || letter;
    return `<phoneme alphabet="ipa" ph="${ipaValue}">${letter}</phoneme><break time="500ms"/>`;
  }).join('');
  
  // Full word pronunciation
  const fullWordIPA = letterIPAs.join('');
  const fullWord = `<phoneme alphabet="ipa" ph="${fullWordIPA}">${word}</phoneme>`;
  
  return `<speak>${letterParts}${fullWord}</speak>`;
}

/**
 * Generates SSML for letter name + sound
 * 
 * @param letter - The letter to pronounce
 * @param ipa - IPA notation for the sound
 * @returns SSML string
 * 
 * @example
 * generateLetterNameAndSoundSSML("A", "æ")
 * // Returns: <speak>A <break time="300ms"/> <phoneme alphabet="ipa" ph="æ">a</phoneme></speak>
 */
export function generateLetterNameAndSoundSSML(
  letter: string,
  ipa: string
): string {
  return `<speak>${letter.toUpperCase()}<break time="300ms"/><phoneme alphabet="ipa" ph="${ipa}">${letter.toLowerCase()}</phoneme></speak>`;
}

/**
 * Escapes special XML characters in text for SSML safety
 */
function escapeXML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Validates IPA notation (basic check)
 */
export function isValidIPA(ipa: string): boolean {
  // IPA uses Unicode range U+0250 to U+02AF (IPA Extensions)
  // Plus common diacritics and base Latin
  const ipaRegex = /^[\u0250-\u02AF\u0300-\u036Fa-zɑɛɪʌæəθðʃʒŋʧʤ]+$/;
  return ipaRegex.test(ipa);
}

/**
 * Generates prosody-controlled SSML for emphasis
 * Useful for highlighting specific sounds during instruction
 */
export function generateEmphasisSSML(
  text: string,
  ipa: string,
  emphasis: 'strong' | 'moderate' | 'reduced' = 'moderate'
): string {
  return `<speak><emphasis level="${emphasis}"><phoneme alphabet="ipa" ph="${ipa}">${text}</phoneme></emphasis></speak>`;
}

/**
 * Generates SSML with custom rate/pitch for air writing drills
 * Allows slowing down pronunciation for kinesthetic learning
 */
export function generateAirWritingSSML(
  letter: string,
  ipa: string,
  speed: 'slow' | 'medium' | 'fast' = 'medium'
): string {
  const rateMap = {
    slow: '70%',
    medium: '100%',
    fast: '130%'
  };
  
  return `<speak><prosody rate="${rateMap[speed]}">${letter} says <phoneme alphabet="ipa" ph="${ipa}">${letter.toLowerCase()}</phoneme></prosody></speak>`;
}
