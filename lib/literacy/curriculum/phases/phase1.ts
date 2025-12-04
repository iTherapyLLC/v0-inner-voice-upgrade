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
            { id: "a", type: "letter", content: "A", audioHint: "A says /a/" },
            { id: "b", type: "letter", content: "B", audioHint: "B says /b/" },
            { id: "c", type: "letter", content: "C", audioHint: "C says /k/" },
            { id: "d", type: "letter", content: "D", audioHint: "D says /d/" },
            { id: "e", type: "letter", content: "E", audioHint: "E says /e/" },
            { id: "f", type: "letter", content: "F", audioHint: "F says /f/" },
            { id: "g", type: "letter", content: "G", audioHint: "G says /g/" },
            { id: "h", type: "letter", content: "H", audioHint: "H says /h/" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: [
            { id: "a-aud", type: "sound", content: "A", audioHint: "/a/" },
            { id: "b-aud", type: "sound", content: "B", audioHint: "/b/" },
            { id: "c-aud", type: "sound", content: "C", audioHint: "/k/" },
            { id: "d-aud", type: "sound", content: "D", audioHint: "/d/" },
            { id: "e-aud", type: "sound", content: "E", audioHint: "/e/" },
            { id: "f-aud", type: "sound", content: "F", audioHint: "/f/" },
            { id: "g-aud", type: "sound", content: "G", audioHint: "/g/" },
            { id: "h-aud", type: "sound", content: "H", audioHint: "/h/" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "air-writing",
          items: [
            { id: "a-air", type: "letter", content: "A", audioHint: "A says /a/" },
            { id: "b-air", type: "letter", content: "B", audioHint: "B says /b/" },
            { id: "c-air", type: "letter", content: "C", audioHint: "C says /k/" },
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
            { id: "vowel-a", type: "letter", content: "A", audioHint: "A is a vowel" },
            { id: "vowel-e", type: "letter", content: "E", audioHint: "E is a vowel" },
            { id: "vowel-i", type: "letter", content: "I", audioHint: "I is a vowel" },
            { id: "vowel-o", type: "letter", content: "O", audioHint: "O is a vowel" },
            { id: "vowel-u", type: "letter", content: "U", audioHint: "U is a vowel" },
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
            { id: "cons-b", type: "letter", content: "B", audioHint: "B is a consonant" },
            { id: "cons-c", type: "letter", content: "C", audioHint: "C is a consonant" },
            { id: "cons-d", type: "letter", content: "D", audioHint: "D is a consonant" },
            { id: "cons-f", type: "letter", content: "F", audioHint: "F is a consonant" },
            { id: "cons-g", type: "letter", content: "G", audioHint: "G is a consonant" },
            { id: "cons-h", type: "letter", content: "H", audioHint: "H is a consonant" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
      ],
      prerequisites: ["lesson-1-2"],
    },
  ],
}
