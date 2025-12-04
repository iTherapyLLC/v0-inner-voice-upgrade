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
            { id: "cons-t", type: "letter", content: "T", audioHint: "T says /t/" },
            { id: "cons-n", type: "letter", content: "N", audioHint: "N says /n/" },
            { id: "cons-r", type: "letter", content: "R", audioHint: "R says /r/" },
            { id: "cons-s", type: "letter", content: "S", audioHint: "S says /s/" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: [
            { id: "t-aud", type: "sound", content: "T", audioHint: "/t/" },
            { id: "n-aud", type: "sound", content: "N", audioHint: "/n/" },
            { id: "r-aud", type: "sound", content: "R", audioHint: "/r/" },
            { id: "s-aud", type: "sound", content: "S", audioHint: "/s/" },
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
            { id: "cons-l", type: "letter", content: "L", audioHint: "L says /l/" },
            { id: "cons-d", type: "letter", content: "D", audioHint: "D says /d/" },
            { id: "cons-m", type: "letter", content: "M", audioHint: "M says /m/" },
            { id: "cons-p", type: "letter", content: "P", audioHint: "P says /p/" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: [
            { id: "l-aud", type: "sound", content: "L", audioHint: "/l/" },
            { id: "d-aud", type: "sound", content: "D", audioHint: "/d/" },
            { id: "m-aud", type: "sound", content: "M", audioHint: "/m/" },
            { id: "p-aud", type: "sound", content: "P", audioHint: "/p/" },
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
            { id: "cons-q", type: "letter", content: "Q", audioHint: "Q says /kw/" },
            { id: "cons-x", type: "letter", content: "X", audioHint: "X says /ks/" },
            { id: "cons-z", type: "letter", content: "Z", audioHint: "Z says /z/" },
            { id: "cons-v", type: "letter", content: "V", audioHint: "V says /v/" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: [
            { id: "q-aud", type: "sound", content: "Q", audioHint: "/kw/" },
            { id: "x-aud", type: "sound", content: "X", audioHint: "/ks/" },
            { id: "z-aud", type: "sound", content: "Z", audioHint: "/z/" },
            { id: "v-aud", type: "sound", content: "V", audioHint: "/v/" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
      prerequisites: ["lesson-3-2"],
    },
  ],
}
