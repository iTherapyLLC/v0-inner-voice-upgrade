// Phase 2: Closed Syllables & Short Vowels
// Short A, I, O, U, E

import type { Phase } from "@/types/literacy"

export const phase2: Phase = {
  id: "phase-2",
  number: 2,
  title: "Closed Syllables & Short Vowels",
  description: "Master short vowel sounds in closed syllables",
  prerequisites: ["phase-1"],
  lessons: [
    {
      id: "lesson-2-1",
      phaseId: "phase-2",
      title: "Short A",
      description: "Learn the short /a/ sound as in 'cat'",
      drills: [
        {
          type: "visual",
          items: [
            { id: "short-a-1", type: "sound", content: "a", audioHint: "Short a says /a/ as in apple", phoneme: "short a", ipa: "æ" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: [
            { id: "short-a-aud-1", type: "sound", content: "a", audioHint: "/a/", phoneme: "short a", ipa: "æ" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: [],
          blendingWords: [
            { word: "cat", type: "real", pattern: "CVC" },
            { word: "bat", type: "real", pattern: "CVC" },
            { word: "sat", type: "real", pattern: "CVC" },
            { word: "mat", type: "real", pattern: "CVC" },
            { word: "rat", type: "real", pattern: "CVC" },
            { word: "hat", type: "real", pattern: "CVC" },
            { word: "dat", type: "nonsense", pattern: "CVC" },
            { word: "gat", type: "nonsense", pattern: "CVC" },
            { word: "lat", type: "nonsense", pattern: "CVC" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
    {
      id: "lesson-2-2",
      phaseId: "phase-2",
      title: "Short I",
      description: "Learn the short /i/ sound as in 'sit'",
      drills: [
        {
          type: "visual",
          items: [
            { id: "short-i-1", type: "sound", content: "i", audioHint: "Short i says /i/ as in igloo", phoneme: "short i", ipa: "ɪ" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: [],
          blendingWords: [
            { word: "sit", type: "real", pattern: "CVC" },
            { word: "bit", type: "real", pattern: "CVC" },
            { word: "hit", type: "real", pattern: "CVC" },
            { word: "pit", type: "real", pattern: "CVC" },
            { word: "fit", type: "real", pattern: "CVC" },
            { word: "dit", type: "nonsense", pattern: "CVC" },
            { word: "git", type: "nonsense", pattern: "CVC" },
            { word: "mit", type: "nonsense", pattern: "CVC" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
      prerequisites: ["lesson-2-1"],
    },
    {
      id: "lesson-2-3",
      phaseId: "phase-2",
      title: "Short O",
      description: "Learn the short /o/ sound as in 'hot'",
      drills: [
        {
          type: "visual",
          items: [
            { id: "short-o-1", type: "sound", content: "o", audioHint: "Short o says /o/ as in octopus", phoneme: "short o", ipa: "ɑ" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: [],
          blendingWords: [
            { word: "hot", type: "real", pattern: "CVC" },
            { word: "pot", type: "real", pattern: "CVC" },
            { word: "dot", type: "real", pattern: "CVC" },
            { word: "got", type: "real", pattern: "CVC" },
            { word: "lot", type: "real", pattern: "CVC" },
            { word: "bot", type: "nonsense", pattern: "CVC" },
            { word: "jot", type: "nonsense", pattern: "CVC" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
      prerequisites: ["lesson-2-2"],
    },
    {
      id: "lesson-2-4",
      phaseId: "phase-2",
      title: "Short U",
      description: "Learn the short /u/ sound as in 'cup'",
      drills: [
        {
          type: "visual",
          items: [
            { id: "short-u-1", type: "sound", content: "u", audioHint: "Short u says /u/ as in umbrella", phoneme: "short u", ipa: "ʌ" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: [],
          blendingWords: [
            { word: "cup", type: "real", pattern: "CVC" },
            { word: "pup", type: "real", pattern: "CVC" },
            { word: "sun", type: "real", pattern: "CVC" },
            { word: "run", type: "real", pattern: "CVC" },
            { word: "fun", type: "real", pattern: "CVC" },
            { word: "bup", type: "nonsense", pattern: "CVC" },
            { word: "tun", type: "nonsense", pattern: "CVC" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
      prerequisites: ["lesson-2-3"],
    },
    {
      id: "lesson-2-5",
      phaseId: "phase-2",
      title: "Short E",
      description: "Learn the short /e/ sound as in 'bed'",
      drills: [
        {
          type: "visual",
          items: [
            { id: "short-e-1", type: "sound", content: "e", audioHint: "Short e says /e/ as in elephant", phoneme: "short e", ipa: "ɛ" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: [],
          blendingWords: [
            { word: "bed", type: "real", pattern: "CVC" },
            { word: "red", type: "real", pattern: "CVC" },
            { word: "fed", type: "real", pattern: "CVC" },
            { word: "led", type: "real", pattern: "CVC" },
            { word: "wed", type: "real", pattern: "CVC" },
            { word: "ped", type: "nonsense", pattern: "CVC" },
            { word: "ged", type: "nonsense", pattern: "CVC" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
      prerequisites: ["lesson-2-4"],
    },
  ],
}
