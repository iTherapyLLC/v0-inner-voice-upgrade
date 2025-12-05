// Phase 5: Open Syllables & Long Vowels
// Long A, E, I, O, U

import type { Phase } from "@/types/literacy"

export const phase5: Phase = {
  id: "phase-5",
  number: 5,
  title: "Open Syllables & Long Vowels",
  description: "Learn long vowel sounds in open syllables",
  prerequisites: ["phase-4"],
  lessons: [
    {
      id: "lesson-5-1",
      phaseId: "phase-5",
      title: "Long A",
      description: "Learn the long /ā/ sound as in 'day'",
      drills: [
        {
          type: "visual",
          items: [
            { id: "long-a-1", type: "syllable", content: "a", audioHint: "Long a says /ā/ like in day" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: [],
          blendingWords: [
            { word: "may", type: "real", pattern: "CV" },
            { word: "day", type: "real", pattern: "CV" },
            { word: "say", type: "real", pattern: "CV" },
            { word: "pay", type: "real", pattern: "CV" },
            { word: "way", type: "real", pattern: "CV" },
            { word: "bay", type: "real", pattern: "CV" },
            { word: "hay", type: "real", pattern: "CV" },
            { word: "lay", type: "real", pattern: "CV" },
            // Nonsense words
            { word: "tay", type: "nonsense", pattern: "CV" },
            { word: "nay", type: "nonsense", pattern: "CV" },
            { word: "fay", type: "nonsense", pattern: "CV" },
            { word: "vay", type: "nonsense", pattern: "CV" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
    {
      id: "lesson-5-2",
      phaseId: "phase-5",
      title: "Long E",
      description: "Learn the long /ē/ sound as in 'me'",
      drills: [
        {
          type: "visual",
          items: [
            { id: "long-e-1", type: "syllable", content: "e", audioHint: "Long e says /ē/ like in me" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: [],
          blendingWords: [
            { word: "me", type: "real", pattern: "CV" },
            { word: "he", type: "real", pattern: "CV" },
            { word: "we", type: "real", pattern: "CV" },
            { word: "be", type: "real", pattern: "CV" },
            { word: "she", type: "real", pattern: "CV" },
            // Nonsense words
            { word: "te", type: "nonsense", pattern: "CV" },
            { word: "de", type: "nonsense", pattern: "CV" },
            { word: "fe", type: "nonsense", pattern: "CV" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
      prerequisites: ["lesson-5-1"],
    },
    {
      id: "lesson-5-3",
      phaseId: "phase-5",
      title: "Long I",
      description: "Learn the long /ī/ sound as in 'hi'",
      drills: [
        {
          type: "visual",
          items: [
            { id: "long-i-1", type: "syllable", content: "i", audioHint: "Long i says /ī/ like in hi" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: [],
          blendingWords: [
            { word: "hi", type: "real", pattern: "CV" },
            { word: "my", type: "real", pattern: "CV" },
            { word: "by", type: "real", pattern: "CV" },
            { word: "fly", type: "real", pattern: "CCV" },
            { word: "try", type: "real", pattern: "CCV" },
            { word: "sky", type: "real", pattern: "CCV" },
            // Nonsense words
            { word: "ti", type: "nonsense", pattern: "CV" },
            { word: "py", type: "nonsense", pattern: "CV" },
            { word: "vy", type: "nonsense", pattern: "CV" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
      prerequisites: ["lesson-5-2"],
    },
    {
      id: "lesson-5-4",
      phaseId: "phase-5",
      title: "Long O",
      description: "Learn the long /ō/ sound as in 'go'",
      drills: [
        {
          type: "visual",
          items: [
            { id: "long-o-1", type: "syllable", content: "o", audioHint: "Long o says /ō/ like in go" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: [],
          blendingWords: [
            { word: "go", type: "real", pattern: "CV" },
            { word: "no", type: "real", pattern: "CV" },
            { word: "so", type: "real", pattern: "CV" },
            { word: "pro", type: "real", pattern: "CCV" },
            // Nonsense words
            { word: "bo", type: "nonsense", pattern: "CV" },
            { word: "fo", type: "nonsense", pattern: "CV" },
            { word: "vo", type: "nonsense", pattern: "CV" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
      prerequisites: ["lesson-5-3"],
    },
    {
      id: "lesson-5-5",
      phaseId: "phase-5",
      title: "Long U",
      description: "Learn the long /ū/ sound as in 'you'",
      drills: [
        {
          type: "visual",
          items: [
            { id: "long-u-1", type: "syllable", content: "u", audioHint: "Long u says /ū/ like in you" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: [],
          blendingWords: [
            { word: "flu", type: "real", pattern: "CCV" },
            { word: "true", type: "real", pattern: "CCV" },
            { word: "blue", type: "real", pattern: "CCV" },
            // Nonsense words
            { word: "bu", type: "nonsense", pattern: "CV" },
            { word: "tu", type: "nonsense", pattern: "CV" },
            { word: "nu", type: "nonsense", pattern: "CV" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
      prerequisites: ["lesson-5-4"],
    },
  ],
}
