// Phase 1: Foundational Concepts
// Alphabet, Vowels, Consonants, Syllables

import type { Phase } from "@/types/literacy"

export const phase1: Phase = {
  id: "phase-1",
  number: 1,
  title: "Foundational Concepts",
  description: "Learn the alphabet, vowels, consonants, and syllables",
  lessons: [
    {
      id: "lesson-1-1",
      phaseId: "phase-1",
      title: "The Alphabet",
      description: "Learn all 26 letters of the alphabet",
      drills: [
        {
          type: "visual",
          items: [
            { id: "a", type: "letter", content: "A", audioHint: "A says ah, as in cat", phoneme: "short a", ipa: "æ", carrierSyllable: "ah", carrierWord: "cat" },
            { id: "b", type: "letter", content: "B", audioHint: "B says buh, as in bat", phoneme: "b", ipa: "b", carrierSyllable: "buh", carrierWord: "bat" },
            { id: "c", type: "letter", content: "C", audioHint: "C says kuh, as in cat", phoneme: "hard c", ipa: "k", carrierSyllable: "kuh", carrierWord: "cat" },
            { id: "d", type: "letter", content: "D", audioHint: "D says duh, as in dog", phoneme: "d", ipa: "d", carrierSyllable: "duh", carrierWord: "dog" },
            { id: "e", type: "letter", content: "E", audioHint: "E says eh, as in bed", phoneme: "short e", ipa: "ɛ", carrierSyllable: "eh", carrierWord: "bed" },
            { id: "f", type: "letter", content: "F", audioHint: "F says fuh, as in fan", phoneme: "f", ipa: "f", carrierSyllable: "fuh", carrierWord: "fan" },
            { id: "g", type: "letter", content: "G", audioHint: "G says guh, as in gas", phoneme: "hard g", ipa: "g", carrierSyllable: "guh", carrierWord: "gas" },
            { id: "h", type: "letter", content: "H", audioHint: "H says huh, as in hat", phoneme: "h", ipa: "h", carrierSyllable: "huh", carrierWord: "hat" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: [
            { id: "a-aud", type: "sound", content: "A", audioHint: "A says ah, as in cat", phoneme: "short a", ipa: "æ", carrierSyllable: "ah", carrierWord: "cat" },
            { id: "b-aud", type: "sound", content: "B", audioHint: "B says buh, as in bat", phoneme: "b", ipa: "b", carrierSyllable: "buh", carrierWord: "bat" },
            { id: "c-aud", type: "sound", content: "C", audioHint: "C says kuh, as in cat", phoneme: "hard c", ipa: "k", carrierSyllable: "kuh", carrierWord: "cat" },
            { id: "d-aud", type: "sound", content: "D", audioHint: "D says duh, as in dog", phoneme: "d", ipa: "d", carrierSyllable: "duh", carrierWord: "dog" },
            { id: "e-aud", type: "sound", content: "E", audioHint: "E says eh, as in bed", phoneme: "short e", ipa: "ɛ", carrierSyllable: "eh", carrierWord: "bed" },
            { id: "f-aud", type: "sound", content: "F", audioHint: "F says fuh, as in fan", phoneme: "f", ipa: "f", carrierSyllable: "fuh", carrierWord: "fan" },
            { id: "g-aud", type: "sound", content: "G", audioHint: "G says guh, as in gas", phoneme: "hard g", ipa: "g", carrierSyllable: "guh", carrierWord: "gas" },
            { id: "h-aud", type: "sound", content: "H", audioHint: "H says huh, as in hat", phoneme: "h", ipa: "h", carrierSyllable: "huh", carrierWord: "hat" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "air-writing",
          items: [
            { id: "a-air", type: "letter", content: "A", audioHint: "A says ah, as in cat", phoneme: "short a", ipa: "æ", carrierSyllable: "ah", carrierWord: "cat" },
            { id: "b-air", type: "letter", content: "B", audioHint: "B says buh, as in bat", phoneme: "b", ipa: "b", carrierSyllable: "buh", carrierWord: "bat" },
            { id: "c-air", type: "letter", content: "C", audioHint: "C says kuh, as in cat", phoneme: "hard c", ipa: "k", carrierSyllable: "kuh", carrierWord: "cat" },
          ],
          masteryThreshold: 100,
          consecutiveCorrect: 1,
        },
      ],
    },
    {
      id: "lesson-1-2",
      phaseId: "phase-1",
      title: "Vowels",
      description: "Identify the 5 vowels: A, E, I, O, U",
      drills: [
        {
          type: "visual",
          items: [
            { id: "vowel-a", type: "letter", content: "A", audioHint: "A is a vowel, says ah, as in cat", phoneme: "short a", ipa: "æ", carrierSyllable: "ah", carrierWord: "cat" },
            { id: "vowel-e", type: "letter", content: "E", audioHint: "E is a vowel, says eh, as in bed", phoneme: "short e", ipa: "ɛ", carrierSyllable: "eh", carrierWord: "bed" },
            { id: "vowel-i", type: "letter", content: "I", audioHint: "I is a vowel, says ih, as in sit", phoneme: "short i", ipa: "ɪ", carrierSyllable: "ih", carrierWord: "sit" },
            { id: "vowel-o", type: "letter", content: "O", audioHint: "O is a vowel, says ah, as in hot", phoneme: "short o", ipa: "ɑ", carrierSyllable: "ah", carrierWord: "hot" },
            { id: "vowel-u", type: "letter", content: "U", audioHint: "U is a vowel, says uh, as in cup", phoneme: "short u", ipa: "ʌ", carrierSyllable: "uh", carrierWord: "cup" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
      ],
      prerequisites: ["lesson-1-1"],
    },
    {
      id: "lesson-1-3",
      phaseId: "phase-1",
      title: "Consonants",
      description: "Identify consonants (all letters except A, E, I, O, U)",
      drills: [
        {
          type: "visual",
          items: [
            { id: "cons-b", type: "letter", content: "B", audioHint: "B is a consonant, says buh, as in bat", phoneme: "b", ipa: "b", carrierSyllable: "buh", carrierWord: "bat" },
            { id: "cons-c", type: "letter", content: "C", audioHint: "C is a consonant, says kuh, as in cat", phoneme: "hard c", ipa: "k", carrierSyllable: "kuh", carrierWord: "cat" },
            { id: "cons-d", type: "letter", content: "D", audioHint: "D is a consonant, says duh, as in dog", phoneme: "d", ipa: "d", carrierSyllable: "duh", carrierWord: "dog" },
            { id: "cons-f", type: "letter", content: "F", audioHint: "F is a consonant, says fuh, as in fan", phoneme: "f", ipa: "f", carrierSyllable: "fuh", carrierWord: "fan" },
            { id: "cons-g", type: "letter", content: "G", audioHint: "G is a consonant, says guh, as in gas", phoneme: "hard g", ipa: "g", carrierSyllable: "guh", carrierWord: "gas" },
            { id: "cons-h", type: "letter", content: "H", audioHint: "H is a consonant, says huh, as in hat", phoneme: "h", ipa: "h", carrierSyllable: "huh", carrierWord: "hat" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
      ],
      prerequisites: ["lesson-1-2"],
    },
  ],
}
