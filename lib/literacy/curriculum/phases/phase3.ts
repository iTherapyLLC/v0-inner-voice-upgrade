// Phase 3: Consonants
// High-frequency then low-frequency consonants

import type { Phase } from "@/types/literacy"

export const phase3: Phase = {
  id: "phase-3",
  number: 3,
  title: "Consonants",
  description: "Master consonant sounds - high frequency and low frequency",
  prerequisites: ["phase-2"],
  lessons: [
    {
      id: "lesson-3-1",
      phaseId: "phase-3",
      title: "High-Frequency Consonants Part 1",
      description: "Learn T, N, R, S sounds",
      drills: [
        {
          type: "visual",
          items: [
            { id: "cons-t", type: "syllable", content: "T", audioHint: "T says /t/", phoneme: "t", ipa: "t" },
            { id: "cons-n", type: "syllable", content: "N", audioHint: "N says /n/", phoneme: "n", ipa: "n" },
            { id: "cons-r", type: "syllable", content: "R", audioHint: "R says /r/", phoneme: "r", ipa: "r" },
            { id: "cons-s", type: "syllable", content: "S", audioHint: "S says /s/", phoneme: "s", ipa: "s" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: [
            { id: "t-aud", type: "syllable", content: "T", audioHint: "/t/", phoneme: "t", ipa: "t" },
            { id: "n-aud", type: "syllable", content: "N", audioHint: "/n/", phoneme: "n", ipa: "n" },
            { id: "r-aud", type: "syllable", content: "R", audioHint: "/r/", phoneme: "r", ipa: "r" },
            { id: "s-aud", type: "syllable", content: "S", audioHint: "/s/", phoneme: "s", ipa: "s" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
    {
      id: "lesson-3-2",
      phaseId: "phase-3",
      title: "High-Frequency Consonants Part 2",
      description: "Learn L, D, M, P sounds",
      drills: [
        {
          type: "visual",
          items: [
            { id: "cons-l", type: "syllable", content: "L", audioHint: "L says /l/", phoneme: "l", ipa: "l" },
            { id: "cons-d", type: "syllable", content: "D", audioHint: "D says /d/", phoneme: "d", ipa: "d" },
            { id: "cons-m", type: "syllable", content: "M", audioHint: "M says /m/", phoneme: "m", ipa: "m" },
            { id: "cons-p", type: "syllable", content: "P", audioHint: "P says /p/", phoneme: "p", ipa: "p" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: [
            { id: "l-aud", type: "syllable", content: "L", audioHint: "/l/", phoneme: "l", ipa: "l" },
            { id: "d-aud", type: "syllable", content: "D", audioHint: "/d/", phoneme: "d", ipa: "d" },
            { id: "m-aud", type: "syllable", content: "M", audioHint: "/m/", phoneme: "m", ipa: "m" },
            { id: "p-aud", type: "syllable", content: "P", audioHint: "/p/", phoneme: "p", ipa: "p" },
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
      title: "Low-Frequency Consonants",
      description: "Learn Q, X, Z, V sounds",
      drills: [
        {
          type: "visual",
          items: [
            { id: "cons-q", type: "syllable", content: "Q", audioHint: "Q says /kw/", phoneme: "qu", ipa: "kw" },
            { id: "cons-x", type: "syllable", content: "X", audioHint: "X says /ks/", phoneme: "x", ipa: "ks" },
            { id: "cons-z", type: "syllable", content: "Z", audioHint: "Z says /z/", phoneme: "z", ipa: "z" },
            { id: "cons-v", type: "syllable", content: "V", audioHint: "V says /v/", phoneme: "v", ipa: "v" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: [
            { id: "q-aud", type: "syllable", content: "Q", audioHint: "/kw/", phoneme: "qu", ipa: "kw" },
            { id: "x-aud", type: "syllable", content: "X", audioHint: "/ks/", phoneme: "x", ipa: "ks" },
            { id: "z-aud", type: "syllable", content: "Z", audioHint: "/z/", phoneme: "z", ipa: "z" },
            { id: "v-aud", type: "syllable", content: "V", audioHint: "/v/", phoneme: "v", ipa: "v" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
      prerequisites: ["lesson-3-2"],
    },
  ],
}
