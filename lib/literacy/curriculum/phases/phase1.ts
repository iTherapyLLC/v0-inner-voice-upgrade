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
            { id: "a", type: "letter", content: "A", audioHint: "A says /a/", phoneme: "short a", ipa: "æ" },
            { id: "b", type: "letter", content: "B", audioHint: "B says /b/", phoneme: "b", ipa: "b" },
            { id: "c", type: "letter", content: "C", audioHint: "C says /k/", phoneme: "hard c", ipa: "k" },
            { id: "d", type: "letter", content: "D", audioHint: "D says /d/", phoneme: "d", ipa: "d" },
            { id: "e", type: "letter", content: "E", audioHint: "E says /e/", phoneme: "short e", ipa: "ɛ" },
            { id: "f", type: "letter", content: "F", audioHint: "F says /f/", phoneme: "f", ipa: "f" },
            { id: "g", type: "letter", content: "G", audioHint: "G says /g/", phoneme: "hard g", ipa: "g" },
            { id: "h", type: "letter", content: "H", audioHint: "H says /h/", phoneme: "h", ipa: "h" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: [
            { id: "a-aud", type: "sound", content: "A", audioHint: "/a/", phoneme: "short a", ipa: "æ" },
            { id: "b-aud", type: "sound", content: "B", audioHint: "/b/", phoneme: "b", ipa: "b" },
            { id: "c-aud", type: "sound", content: "C", audioHint: "/k/", phoneme: "hard c", ipa: "k" },
            { id: "d-aud", type: "sound", content: "D", audioHint: "/d/", phoneme: "d", ipa: "d" },
            { id: "e-aud", type: "sound", content: "E", audioHint: "/e/", phoneme: "short e", ipa: "ɛ" },
            { id: "f-aud", type: "sound", content: "F", audioHint: "/f/", phoneme: "f", ipa: "f" },
            { id: "g-aud", type: "sound", content: "G", audioHint: "/g/", phoneme: "hard g", ipa: "g" },
            { id: "h-aud", type: "sound", content: "H", audioHint: "/h/", phoneme: "h", ipa: "h" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "air-writing",
          items: [
            { id: "a-air", type: "letter", content: "A", audioHint: "A says /a/", phoneme: "short a", ipa: "æ" },
            { id: "b-air", type: "letter", content: "B", audioHint: "B says /b/", phoneme: "b", ipa: "b" },
            { id: "c-air", type: "letter", content: "C", audioHint: "C says /k/", phoneme: "hard c", ipa: "k" },
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
            { id: "vowel-a", type: "letter", content: "A", audioHint: "A is a vowel", phoneme: "short a", ipa: "æ" },
            { id: "vowel-e", type: "letter", content: "E", audioHint: "E is a vowel", phoneme: "short e", ipa: "ɛ" },
            { id: "vowel-i", type: "letter", content: "I", audioHint: "I is a vowel", phoneme: "short i", ipa: "ɪ" },
            { id: "vowel-o", type: "letter", content: "O", audioHint: "O is a vowel", phoneme: "short o", ipa: "ɑ" },
            { id: "vowel-u", type: "letter", content: "U", audioHint: "U is a vowel", phoneme: "short u", ipa: "ʌ" },
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
            { id: "cons-b", type: "letter", content: "B", audioHint: "B is a consonant", phoneme: "b", ipa: "b" },
            { id: "cons-c", type: "letter", content: "C", audioHint: "C is a consonant", phoneme: "hard c", ipa: "k" },
            { id: "cons-d", type: "letter", content: "D", audioHint: "D is a consonant", phoneme: "d", ipa: "d" },
            { id: "cons-f", type: "letter", content: "F", audioHint: "F is a consonant", phoneme: "f", ipa: "f" },
            { id: "cons-g", type: "letter", content: "G", audioHint: "G is a consonant", phoneme: "hard g", ipa: "g" },
            { id: "cons-h", type: "letter", content: "H", audioHint: "H is a consonant", phoneme: "h", ipa: "h" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
      ],
      prerequisites: ["lesson-1-2"],
    },
  ],
}
