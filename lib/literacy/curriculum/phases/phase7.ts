// Phase 7: Soft C and Soft G
// C says /s/ before e, i, y (ce, ci, cy)
// G says /j/ before e, i, y (ge, gi, gy)

import type { Phase, LiteracyItem } from "@/types/literacy"

// Helper to create items with 40% nonsense words
function createItems(
  realWords: string[],
  nonsenseWords: string[],
  type: "soft-c" | "soft-g" | "mixed"
): LiteracyItem[] {
  const allWords = [...realWords, ...nonsenseWords]
  return allWords.map((word, idx) => ({
    id: `phase7-${type}-${idx}`,
    content: word,
    type: "word" as const,
    isNonsense: nonsenseWords.includes(word),
  }))
}

// Soft C words (c says /s/ before e, i, y)
const softCRealWords = [
  "ace", "ice", "race", "rice", "face", "mice", "nice", "dice",
  "cell", "cent", "city", "cite", "cycle", "cyan", "cede", "cedar",
  "place", "price", "space", "spice", "trace", "twice", "voice", "choice",
  "dance", "fence", "since", "prince", "notice", "office", "pencil", "fancy",
]

const softCNonsenseWords = [
  "cice", "bace", "fice", "mace", "nace", "tace", "vace", "wace",
  "ceel", "ceff", "cill", "ceff", "cyke", "cybe", "ceem", "ceef",
  "plice", "prace", "spece", "stice", "trice", "vrice", "grice", "chice",
]

// Soft G words (g says /j/ before e, i, y)
const softGRealWords = [
  "age", "cage", "page", "rage", "sage", "wage", "stage", "huge",
  "gem", "gel", "gym", "germ", "gene", "giant", "ginger", "giraffe",
  "badge", "bridge", "fudge", "ridge", "wedge", "ledge", "judge", "nudge",
  "change", "range", "orange", "strange", "danger", "angel", "magic", "tragic",
]

const softGNonsenseWords = [
  "bige", "dage", "fage", "lage", "mage", "tage", "vage", "zage",
  "geff", "gep", "gyp", "gerp", "gelf", "gimp", "gilp", "girm",
  "fadge", "gadge", "hadge", "madge", "nadge", "radge", "tadge", "wadge",
]

// Mixed practice
const mixedRealWords = [
  "ace", "age", "ice", "huge", "race", "rage", "cell", "gel",
  "city", "gym", "place", "page", "dance", "change", "prince", "giant",
]

const mixedNonsenseWords = [
  "cige", "gice", "bace", "bage", "fice", "fige", "mace", "mage",
]

export const phase7: Phase = {
  id: "phase7",
  title: "Soft C & Soft G",
  description: "Learn when C says /s/ and G says /j/ (before e, i, y)",
  order: 7,
  lessons: [
    // Lesson 1: Introduction to Soft C
    {
      id: "phase7-lesson1",
      title: "Soft C: /s/ Sound",
      description: "C says /s/ before e, i, or y",
      order: 1,
      drills: [
        {
          type: "visual",
          items: createItems(
            softCRealWords.slice(0, 8),
            softCNonsenseWords.slice(0, 4),
            "soft-c"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: createItems(
            softCRealWords.slice(0, 8),
            softCNonsenseWords.slice(0, 4),
            "soft-c"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: createItems(
            softCRealWords.slice(0, 6),
            softCNonsenseWords.slice(0, 3),
            "soft-c"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
    // Lesson 2: More Soft C Practice
    {
      id: "phase7-lesson2",
      title: "Soft C in Longer Words",
      description: "Practice soft C in multi-syllable words",
      order: 2,
      drills: [
        {
          type: "visual",
          items: createItems(
            softCRealWords.slice(8, 20),
            softCNonsenseWords.slice(4, 10),
            "soft-c"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: createItems(
            softCRealWords.slice(8, 20),
            softCNonsenseWords.slice(4, 10),
            "soft-c"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: createItems(
            softCRealWords.slice(8, 16),
            softCNonsenseWords.slice(4, 8),
            "soft-c"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
    // Lesson 3: Introduction to Soft G
    {
      id: "phase7-lesson3",
      title: "Soft G: /j/ Sound",
      description: "G says /j/ before e, i, or y",
      order: 3,
      drills: [
        {
          type: "visual",
          items: createItems(
            softGRealWords.slice(0, 8),
            softGNonsenseWords.slice(0, 4),
            "soft-g"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: createItems(
            softGRealWords.slice(0, 8),
            softGNonsenseWords.slice(0, 4),
            "soft-g"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: createItems(
            softGRealWords.slice(0, 6),
            softGNonsenseWords.slice(0, 3),
            "soft-g"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
    // Lesson 4: More Soft G Practice
    {
      id: "phase7-lesson4",
      title: "Soft G in Longer Words",
      description: "Practice soft G in multi-syllable words",
      order: 4,
      drills: [
        {
          type: "visual",
          items: createItems(
            softGRealWords.slice(8, 20),
            softGNonsenseWords.slice(4, 10),
            "soft-g"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: createItems(
            softGRealWords.slice(8, 20),
            softGNonsenseWords.slice(4, 10),
            "soft-g"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: createItems(
            softGRealWords.slice(8, 16),
            softGNonsenseWords.slice(4, 8),
            "soft-g"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
    // Lesson 5: Mixed Practice & Review
    {
      id: "phase7-lesson5",
      title: "Soft C & G Review",
      description: "Mixed practice with both soft C and soft G",
      order: 5,
      drills: [
        {
          type: "visual",
          items: createItems(mixedRealWords, mixedNonsenseWords, "mixed"),
          masteryThreshold: 90,
          consecutiveCorrect: 4,
        },
        {
          type: "auditory",
          items: createItems(mixedRealWords, mixedNonsenseWords, "mixed"),
          masteryThreshold: 90,
          consecutiveCorrect: 4,
        },
        {
          type: "blending",
          items: createItems(
            mixedRealWords.slice(0, 10),
            mixedNonsenseWords.slice(0, 4),
            "mixed"
          ),
          masteryThreshold: 90,
          consecutiveCorrect: 4,
        },
        {
          type: "air-writing",
          items: [
            { id: "phase7-aw-1", content: "ce", type: "syllable" },
            { id: "phase7-aw-2", content: "ci", type: "syllable" },
            { id: "phase7-aw-3", content: "cy", type: "syllable" },
            { id: "phase7-aw-4", content: "ge", type: "syllable" },
            { id: "phase7-aw-5", content: "gi", type: "syllable" },
            { id: "phase7-aw-6", content: "gy", type: "syllable" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
  ],
}
