// Phase 1: Open Syllables (CV) and Closed Syllables (VC)
// Research-aligned syllable-first approach

import type { Phase } from "@/types/literacy"

export const phase1: Phase = {
  id: "phase-1",
  number: 1,
  title: "Open and Closed Syllables",
  description: "Learn CV syllables (open) and VC syllables (closed/rimes)",
  lessons: [
    {
      id: "lesson-1-1",
      phaseId: "phase-1",
      title: "CV Syllables (Open Syllables)",
      description: "Learn natural syllables like ma, pa, ba, go, me",
      drills: [
        {
          type: "visual",
          items: [
            { id: "cv-ma", type: "syllable", content: "ma", audioHint: "Listen to this syllable: ma", syllablePattern: "CV" },
            { id: "cv-pa", type: "syllable", content: "pa", audioHint: "Listen to this syllable: pa", syllablePattern: "CV" },
            { id: "cv-ba", type: "syllable", content: "ba", audioHint: "Listen to this syllable: ba", syllablePattern: "CV" },
            { id: "cv-da", type: "syllable", content: "da", audioHint: "Listen to this syllable: da", syllablePattern: "CV" },
            { id: "cv-na", type: "syllable", content: "na", audioHint: "Listen to this syllable: na", syllablePattern: "CV" },
            { id: "cv-ta", type: "syllable", content: "ta", audioHint: "Listen to this syllable: ta", syllablePattern: "CV" },
            { id: "cv-sa", type: "syllable", content: "sa", audioHint: "Listen to this syllable: sa", syllablePattern: "CV" },
            { id: "cv-la", type: "syllable", content: "la", audioHint: "Listen to this syllable: la", syllablePattern: "CV" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: [
            { id: "cv-me", type: "syllable", content: "me", audioHint: "Say it with me: me", syllablePattern: "CV" },
            { id: "cv-be", type: "syllable", content: "be", audioHint: "Say it with me: be", syllablePattern: "CV" },
            { id: "cv-go", type: "syllable", content: "go", audioHint: "This syllable is: go", syllablePattern: "CV" },
            { id: "cv-so", type: "syllable", content: "so", audioHint: "This syllable is: so", syllablePattern: "CV" },
            { id: "cv-no", type: "syllable", content: "no", audioHint: "This syllable is: no", syllablePattern: "CV" },
            { id: "cv-do", type: "syllable", content: "do", audioHint: "This syllable is: do", syllablePattern: "CV" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "air-writing",
          items: [
            { id: "cv-ma-air", type: "syllable", content: "ma", audioHint: "Write the syllable: ma", syllablePattern: "CV" },
            { id: "cv-go-air", type: "syllable", content: "go", audioHint: "Write the syllable: go", syllablePattern: "CV" },
            { id: "cv-me-air", type: "syllable", content: "me", audioHint: "Write the syllable: me", syllablePattern: "CV" },
          ],
          masteryThreshold: 100,
          consecutiveCorrect: 1,
        },
      ],
    },
    {
      id: "lesson-1-2",
      phaseId: "phase-1",
      title: "VC Syllables (Closed Syllables / Rimes)",
      description: "Learn word endings like -at, -in, -up, -an, -it, -on",
      drills: [
        {
          type: "visual",
          items: [
            { id: "vc-at", type: "syllable", content: "at", audioHint: "This is the word part: at", syllablePattern: "VC" },
            { id: "vc-in", type: "syllable", content: "in", audioHint: "Listen: in", syllablePattern: "VC" },
            { id: "vc-up", type: "syllable", content: "up", audioHint: "This is the word part: up", syllablePattern: "VC" },
            { id: "vc-an", type: "syllable", content: "an", audioHint: "Listen: an", syllablePattern: "VC" },
            { id: "vc-it", type: "syllable", content: "it", audioHint: "This is the word part: it", syllablePattern: "VC" },
            { id: "vc-on", type: "syllable", content: "on", audioHint: "Listen: on", syllablePattern: "VC" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: [
            { id: "vc-am", type: "syllable", content: "am", audioHint: "Say it with me: am", syllablePattern: "VC" },
            { id: "vc-ed", type: "syllable", content: "ed", audioHint: "Say it with me: ed", syllablePattern: "VC" },
            { id: "vc-op", type: "syllable", content: "op", audioHint: "This is the word part: op", syllablePattern: "VC" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "air-writing",
          items: [
            { id: "vc-at-air", type: "syllable", content: "at", audioHint: "Write the word part: at", syllablePattern: "VC" },
            { id: "vc-in-air", type: "syllable", content: "in", audioHint: "Write the word part: in", syllablePattern: "VC" },
            { id: "vc-up-air", type: "syllable", content: "up", audioHint: "Write the word part: up", syllablePattern: "VC" },
          ],
          masteryThreshold: 100,
          consecutiveCorrect: 1,
        },
      ],
      prerequisites: ["lesson-1-1"],
    },
    {
      id: "lesson-1-3",
      phaseId: "phase-1",
      title: "Combining CV + VC",
      description: "Practice blending known syllables together",
      drills: [
        {
          type: "blending",
          items: [],
          blendingWords: [
            { word: "mat", type: "real", pattern: "CVC" },
            { word: "bat", type: "real", pattern: "CVC" },
            { word: "sat", type: "real", pattern: "CVC" },
            { word: "pat", type: "real", pattern: "CVC" },
            { word: "pin", type: "real", pattern: "CVC" },
            { word: "tin", type: "real", pattern: "CVC" },
            { word: "win", type: "real", pattern: "CVC" },
            { word: "bin", type: "real", pattern: "CVC" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
      prerequisites: ["lesson-1-2"],
    },
  ],
}
