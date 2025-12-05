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
            { id: "cons-t", type: "letter", content: "T", audioHint: "T says tuh, as in tap", phoneme: "t", ipa: "t", carrierSyllable: "tuh", carrierWord: "tap" },
            { id: "cons-n", type: "letter", content: "N", audioHint: "N says nuh, as in nap", phoneme: "n", ipa: "n", carrierSyllable: "nuh", carrierWord: "nap" },
            { id: "cons-r", type: "letter", content: "R", audioHint: "R says ruh, as in rat", phoneme: "r", ipa: "r", carrierSyllable: "ruh", carrierWord: "rat" },
            { id: "cons-s", type: "letter", content: "S", audioHint: "S says suh, as in sat", phoneme: "s", ipa: "s", carrierSyllable: "suh", carrierWord: "sat" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: [
            { id: "t-aud", type: "sound", content: "T", audioHint: "T says tuh, as in tap", phoneme: "t", ipa: "t", carrierSyllable: "tuh", carrierWord: "tap" },
            { id: "n-aud", type: "sound", content: "N", audioHint: "N says nuh, as in nap", phoneme: "n", ipa: "n", carrierSyllable: "nuh", carrierWord: "nap" },
            { id: "r-aud", type: "sound", content: "R", audioHint: "R says ruh, as in rat", phoneme: "r", ipa: "r", carrierSyllable: "ruh", carrierWord: "rat" },
            { id: "s-aud", type: "sound", content: "S", audioHint: "S says suh, as in sat", phoneme: "s", ipa: "s", carrierSyllable: "suh", carrierWord: "sat" },
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
            { id: "cons-l", type: "letter", content: "L", audioHint: "L says luh, as in lap", phoneme: "l", ipa: "l", carrierSyllable: "luh", carrierWord: "lap" },
            { id: "cons-d", type: "letter", content: "D", audioHint: "D says duh, as in dog", phoneme: "d", ipa: "d", carrierSyllable: "duh", carrierWord: "dog" },
            { id: "cons-m", type: "letter", content: "M", audioHint: "M says muh, as in map", phoneme: "m", ipa: "m", carrierSyllable: "muh", carrierWord: "map" },
            { id: "cons-p", type: "letter", content: "P", audioHint: "P says puh, as in pan", phoneme: "p", ipa: "p", carrierSyllable: "puh", carrierWord: "pan" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: [
            { id: "l-aud", type: "sound", content: "L", audioHint: "L says luh, as in lap", phoneme: "l", ipa: "l", carrierSyllable: "luh", carrierWord: "lap" },
            { id: "d-aud", type: "sound", content: "D", audioHint: "D says duh, as in dog", phoneme: "d", ipa: "d", carrierSyllable: "duh", carrierWord: "dog" },
            { id: "m-aud", type: "sound", content: "M", audioHint: "M says muh, as in map", phoneme: "m", ipa: "m", carrierSyllable: "muh", carrierWord: "map" },
            { id: "p-aud", type: "sound", content: "P", audioHint: "P says puh, as in pan", phoneme: "p", ipa: "p", carrierSyllable: "puh", carrierWord: "pan" },
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
            { id: "cons-q", type: "letter", content: "Q", audioHint: "Q says kwuh, as in quiz", phoneme: "qu", ipa: "kw", carrierSyllable: "kwuh", carrierWord: "quiz" },
            { id: "cons-x", type: "letter", content: "X", audioHint: "X says ks, as in box", phoneme: "x", ipa: "ks", carrierSyllable: "ks", carrierWord: "box" },
            { id: "cons-z", type: "letter", content: "Z", audioHint: "Z says zuh, as in zip", phoneme: "z", ipa: "z", carrierSyllable: "zuh", carrierWord: "zip" },
            { id: "cons-v", type: "letter", content: "V", audioHint: "V says vuh, as in van", phoneme: "v", ipa: "v", carrierSyllable: "vuh", carrierWord: "van" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: [
            { id: "q-aud", type: "sound", content: "Q", audioHint: "Q says kwuh, as in quiz", phoneme: "qu", ipa: "kw", carrierSyllable: "kwuh", carrierWord: "quiz" },
            { id: "x-aud", type: "sound", content: "X", audioHint: "X says ks, as in box", phoneme: "x", ipa: "ks", carrierSyllable: "ks", carrierWord: "box" },
            { id: "z-aud", type: "sound", content: "Z", audioHint: "Z says zuh, as in zip", phoneme: "z", ipa: "z", carrierSyllable: "zuh", carrierWord: "zip" },
            { id: "v-aud", type: "sound", content: "V", audioHint: "V says vuh, as in van", phoneme: "v", ipa: "v", carrierSyllable: "vuh", carrierWord: "van" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
      prerequisites: ["lesson-3-2"],
    },
  ],
}
