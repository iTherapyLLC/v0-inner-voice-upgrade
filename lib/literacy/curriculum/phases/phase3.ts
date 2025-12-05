// Phase 3: CVC-e (Magic E / Silent E) Patterns
// Long vowel sounds with silent E

import type { Phase } from "@/types/literacy"

export const phase3: Phase = {
  id: "phase-3",
  number: 3,
  title: "Magic E Patterns",
  description: "Learn CVC-e patterns with long vowel sounds",
  prerequisites: ["phase-2"],
  lessons: [
    {
      id: "lesson-3-1",
      phaseId: "phase-3",
      title: "CVC-e with Long A",
      description: "Learn magic E words with long A sound",
      drills: [
        {
          type: "visual",
          items: [
            { id: "cvce-cake", type: "word", content: "cake", audioHint: "This word has a magic E: cake", syllablePattern: "CVC-e" },
            { id: "cvce-make", type: "word", content: "make", audioHint: "This word has a magic E: make", syllablePattern: "CVC-e" },
            { id: "cvce-lake", type: "word", content: "lake", audioHint: "This word has a magic E: lake", syllablePattern: "CVC-e" },
            { id: "cvce-bake", type: "word", content: "bake", audioHint: "This word has a magic E: bake", syllablePattern: "CVC-e" },
            { id: "cvce-take", type: "word", content: "take", audioHint: "This word has a magic E: take", syllablePattern: "CVC-e" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: [
            { id: "cvce-cake-aud", type: "word", content: "cake", audioHint: "This word has a magic E: cake", syllablePattern: "CVC-e" },
            { id: "cvce-make-aud", type: "word", content: "make", audioHint: "This word has a magic E: make", syllablePattern: "CVC-e" },
            { id: "cvce-lake-aud", type: "word", content: "lake", audioHint: "This word has a magic E: lake", syllablePattern: "CVC-e" },
            { id: "cvce-bake-aud", type: "word", content: "bake", audioHint: "This word has a magic E: bake", syllablePattern: "CVC-e" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: [],
          blendingWords: [
            { word: "cake", type: "real", pattern: "CVC-e" },
            { word: "make", type: "real", pattern: "CVC-e" },
            { word: "lake", type: "real", pattern: "CVC-e" },
            { word: "bake", type: "real", pattern: "CVC-e" },
            { word: "take", type: "real", pattern: "CVC-e" },
            { word: "sake", type: "real", pattern: "CVC-e" },
            { word: "dake", type: "nonsense", pattern: "CVC-e" },
            { word: "gake", type: "nonsense", pattern: "CVC-e" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
    {
      id: "lesson-3-2",
      phaseId: "phase-3",
      title: "CVC-e with Long I",
      description: "Learn magic E words with long I sound",
      drills: [
        {
          type: "visual",
          items: [
            { id: "cvce-bike", type: "word", content: "bike", audioHint: "This word has a magic E: bike", syllablePattern: "CVC-e" },
            { id: "cvce-like", type: "word", content: "like", audioHint: "This word has a magic E: like", syllablePattern: "CVC-e" },
            { id: "cvce-hike", type: "word", content: "hike", audioHint: "This word has a magic E: hike", syllablePattern: "CVC-e" },
            { id: "cvce-time", type: "word", content: "time", audioHint: "This word has a magic E: time", syllablePattern: "CVC-e" },
            { id: "cvce-dime", type: "word", content: "dime", audioHint: "This word has a magic E: dime", syllablePattern: "CVC-e" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: [
            { id: "cvce-bike-aud", type: "word", content: "bike", audioHint: "This word has a magic E: bike", syllablePattern: "CVC-e" },
            { id: "cvce-like-aud", type: "word", content: "like", audioHint: "This word has a magic E: like", syllablePattern: "CVC-e" },
            { id: "cvce-hike-aud", type: "word", content: "hike", audioHint: "This word has a magic E: hike", syllablePattern: "CVC-e" },
            { id: "cvce-time-aud", type: "word", content: "time", audioHint: "This word has a magic E: time", syllablePattern: "CVC-e" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: [],
          blendingWords: [
            { word: "bike", type: "real", pattern: "CVC-e" },
            { word: "like", type: "real", pattern: "CVC-e" },
            { word: "hike", type: "real", pattern: "CVC-e" },
            { word: "time", type: "real", pattern: "CVC-e" },
            { word: "dime", type: "real", pattern: "CVC-e" },
            { word: "kite", type: "real", pattern: "CVC-e" },
            { word: "nime", type: "nonsense", pattern: "CVC-e" },
            { word: "vike", type: "nonsense", pattern: "CVC-e" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
      prerequisites: ["lesson-3-1"],
    },
    {
      id: "lesson-3-3",
      phaseId: "phase-3",
      title: "CVC-e with Long O",
      description: "Learn magic E words with long O sound",
      drills: [
        {
          type: "visual",
          items: [
            { id: "cvce-home", type: "word", content: "home", audioHint: "This word has a magic E: home", syllablePattern: "CVC-e" },
            { id: "cvce-bone", type: "word", content: "bone", audioHint: "This word has a magic E: bone", syllablePattern: "CVC-e" },
            { id: "cvce-tone", type: "word", content: "tone", audioHint: "This word has a magic E: tone", syllablePattern: "CVC-e" },
            { id: "cvce-note", type: "word", content: "note", audioHint: "This word has a magic E: note", syllablePattern: "CVC-e" },
            { id: "cvce-vote", type: "word", content: "vote", audioHint: "This word has a magic E: vote", syllablePattern: "CVC-e" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: [
            { id: "cvce-home-aud", type: "word", content: "home", audioHint: "This word has a magic E: home", syllablePattern: "CVC-e" },
            { id: "cvce-bone-aud", type: "word", content: "bone", audioHint: "This word has a magic E: bone", syllablePattern: "CVC-e" },
            { id: "cvce-tone-aud", type: "word", content: "tone", audioHint: "This word has a magic E: tone", syllablePattern: "CVC-e" },
            { id: "cvce-note-aud", type: "word", content: "note", audioHint: "This word has a magic E: note", syllablePattern: "CVC-e" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: [],
          blendingWords: [
            { word: "home", type: "real", pattern: "CVC-e" },
            { word: "bone", type: "real", pattern: "CVC-e" },
            { word: "tone", type: "real", pattern: "CVC-e" },
            { word: "note", type: "real", pattern: "CVC-e" },
            { word: "vote", type: "real", pattern: "CVC-e" },
            { word: "cone", type: "real", pattern: "CVC-e" },
            { word: "pone", type: "nonsense", pattern: "CVC-e" },
            { word: "dote", type: "nonsense", pattern: "CVC-e" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
      prerequisites: ["lesson-3-2"],
    },
    {
      id: "lesson-3-4",
      phaseId: "phase-3",
      title: "CVC-e with Long U",
      description: "Learn magic E words with long U sound",
      drills: [
        {
          type: "visual",
          items: [
            { id: "cvce-cute", type: "word", content: "cute", audioHint: "This word has a magic E: cute", syllablePattern: "CVC-e" },
            { id: "cvce-mute", type: "word", content: "mute", audioHint: "This word has a magic E: mute", syllablePattern: "CVC-e" },
            { id: "cvce-tube", type: "word", content: "tube", audioHint: "This word has a magic E: tube", syllablePattern: "CVC-e" },
            { id: "cvce-cube", type: "word", content: "cube", audioHint: "This word has a magic E: cube", syllablePattern: "CVC-e" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: [
            { id: "cvce-cute-aud", type: "word", content: "cute", audioHint: "This word has a magic E: cute", syllablePattern: "CVC-e" },
            { id: "cvce-mute-aud", type: "word", content: "mute", audioHint: "This word has a magic E: mute", syllablePattern: "CVC-e" },
            { id: "cvce-tube-aud", type: "word", content: "tube", audioHint: "This word has a magic E: tube", syllablePattern: "CVC-e" },
            { id: "cvce-cube-aud", type: "word", content: "cube", audioHint: "This word has a magic E: cube", syllablePattern: "CVC-e" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: [],
          blendingWords: [
            { word: "cute", type: "real", pattern: "CVC-e" },
            { word: "mute", type: "real", pattern: "CVC-e" },
            { word: "tube", type: "real", pattern: "CVC-e" },
            { word: "cube", type: "real", pattern: "CVC-e" },
            { word: "duke", type: "real", pattern: "CVC-e" },
            { word: "fute", type: "nonsense", pattern: "CVC-e" },
            { word: "nube", type: "nonsense", pattern: "CVC-e" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
      prerequisites: ["lesson-3-3"],
    },
  ],
}
