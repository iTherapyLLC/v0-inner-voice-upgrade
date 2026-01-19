// Phase 8: Vowel Teams
// Two vowels working together to make one sound
// ai, ay, ea, ee, ie, oa, oe, ue, ui

import type { Phase, LiteracyItem } from "@/types/literacy"

function createItems(
  realWords: string[],
  nonsenseWords: string[],
  type: string
): LiteracyItem[] {
  const allWords = [...realWords, ...nonsenseWords]
  return allWords.map((word, idx) => ({
    id: `phase8-${type}-${idx}`,
    content: word,
    type: "word" as const,
    isNonsense: nonsenseWords.includes(word),
  }))
}

// AI words (long a)
const aiRealWords = [
  "rain", "mail", "tail", "nail", "sail", "fail", "pail", "rail",
  "wait", "bait", "main", "pain", "gain", "brain", "train", "plain",
  "chain", "stain", "drain", "grain", "snail", "trail",
]
const aiNonsenseWords = [
  "dail", "gail", "hail", "jain", "kain", "tain", "vain", "frain",
  "blain", "clain", "spail", "strail",
]

// AY words (long a at end)
const ayRealWords = [
  "day", "say", "may", "way", "pay", "lay", "hay", "bay",
  "play", "stay", "gray", "pray", "tray", "clay", "spray", "sway",
  "today", "away", "okay", "delay", "display", "relay",
]
const ayNonsenseWords = [
  "fay", "glay", "blay", "cray", "dray", "fray", "kray", "ploy",
  "sloy", "bloy", "croy", "droy",
]

// EA words (long e)
const eaRealWords = [
  "sea", "tea", "pea", "eat", "meat", "beat", "heat", "seat",
  "read", "bead", "lead", "team", "beam", "seam", "ream", "cream",
  "dream", "stream", "clean", "lean", "mean", "bean", "jeans", "peach",
  "teach", "reach", "beach", "each", "speak", "weak", "sneak", "streak",
]
const eaNonsenseWords = [
  "fea", "gea", "kea", "veat", "leat", "nead", "pead", "steap",
  "gleam", "bleam", "cleak", "dreak", "fleam", "preach",
]

// EE words (long e)
const eeRealWords = [
  "see", "bee", "fee", "tree", "free", "three", "knee", "flee",
  "feet", "meet", "beet", "seed", "feed", "need", "weed", "deed",
  "keep", "deep", "sleep", "sweep", "creep", "steep", "green", "queen",
  "screen", "between", "teeth", "sheet", "sweet", "street", "speech", "cheek",
]
const eeNonsenseWords = [
  "gee", "kee", "vee", "deet", "leet", "beed", "geed", "jeed",
  "dreep", "gleek", "sneer", "pleed", "streen", "fleep",
]

// OA words (long o)
const oaRealWords = [
  "boat", "coat", "goat", "moat", "float", "throat", "road", "load",
  "toad", "soap", "soak", "oak", "cloak", "croak", "toast", "roast",
  "coast", "boast", "foam", "roam", "loan", "moan", "groan",
]
const oaNonsenseWords = [
  "foat", "doat", "gload", "boad", "poad", "foak", "doak", "ploast",
  "stoam", "bloam", "floan", "groat",
]

// OE words (long o)
const oeRealWords = [
  "toe", "hoe", "foe", "doe", "goes", "toes", "hoes",
]
const oeNonsenseWords = [
  "boe", "goe", "moe", "noe", "poe", "roe",
]

// UE words (long u)
const ueRealWords = [
  "blue", "true", "clue", "glue", "flue", "due", "sue", "cue",
  "argue", "rescue", "venue", "value", "tissue", "statue",
]
const ueNonsenseWords = [
  "brue", "drue", "frue", "grue", "prue", "sque", "trew",
]

// UI words (long u or short i)
const uiRealWords = [
  "fruit", "suit", "juice", "cruise", "bruise", "build", "guild", "guilt",
]
const uiNonsenseWords = [
  "bruit", "druit", "fuit", "guit", "pruit", "truit",
]

export const phase8: Phase = {
  id: "phase8",
  title: "Vowel Teams",
  description: "Two vowels work together to make one sound",
  order: 8,
  lessons: [
    // Lesson 1: AI and AY (long a)
    {
      id: "phase8-lesson1",
      title: "Long A: AI and AY",
      description: "When two vowels go walking, the first one does the talking",
      order: 1,
      drills: [
        {
          type: "visual",
          items: createItems(
            [...aiRealWords.slice(0, 8), ...ayRealWords.slice(0, 8)],
            [...aiNonsenseWords.slice(0, 4), ...ayNonsenseWords.slice(0, 4)],
            "ai-ay"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: createItems(
            [...aiRealWords.slice(0, 8), ...ayRealWords.slice(0, 8)],
            [...aiNonsenseWords.slice(0, 4), ...ayNonsenseWords.slice(0, 4)],
            "ai-ay"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: createItems(
            [...aiRealWords.slice(0, 6), ...ayRealWords.slice(0, 6)],
            [...aiNonsenseWords.slice(0, 3), ...ayNonsenseWords.slice(0, 3)],
            "ai-ay"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
    // Lesson 2: EA (long e)
    {
      id: "phase8-lesson2",
      title: "Long E: EA",
      description: "EA makes the long e sound",
      order: 2,
      drills: [
        {
          type: "visual",
          items: createItems(eaRealWords.slice(0, 16), eaNonsenseWords.slice(0, 8), "ea"),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: createItems(eaRealWords.slice(0, 16), eaNonsenseWords.slice(0, 8), "ea"),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: createItems(eaRealWords.slice(0, 10), eaNonsenseWords.slice(0, 5), "ea"),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
    // Lesson 3: EE (long e)
    {
      id: "phase8-lesson3",
      title: "Long E: EE",
      description: "EE makes the long e sound",
      order: 3,
      drills: [
        {
          type: "visual",
          items: createItems(eeRealWords.slice(0, 16), eeNonsenseWords.slice(0, 8), "ee"),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: createItems(eeRealWords.slice(0, 16), eeNonsenseWords.slice(0, 8), "ee"),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: createItems(eeRealWords.slice(0, 10), eeNonsenseWords.slice(0, 5), "ee"),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
    // Lesson 4: OA and OE (long o)
    {
      id: "phase8-lesson4",
      title: "Long O: OA and OE",
      description: "OA and OE make the long o sound",
      order: 4,
      drills: [
        {
          type: "visual",
          items: createItems(
            [...oaRealWords.slice(0, 12), ...oeRealWords],
            [...oaNonsenseWords.slice(0, 6), ...oeNonsenseWords.slice(0, 3)],
            "oa-oe"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: createItems(
            [...oaRealWords.slice(0, 12), ...oeRealWords],
            [...oaNonsenseWords.slice(0, 6), ...oeNonsenseWords.slice(0, 3)],
            "oa-oe"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: createItems(
            [...oaRealWords.slice(0, 8), ...oeRealWords.slice(0, 4)],
            [...oaNonsenseWords.slice(0, 4), ...oeNonsenseWords.slice(0, 2)],
            "oa-oe"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
    // Lesson 5: UE and UI (long u)
    {
      id: "phase8-lesson5",
      title: "Long U: UE and UI",
      description: "UE and UI make the long u sound",
      order: 5,
      drills: [
        {
          type: "visual",
          items: createItems(
            [...ueRealWords, ...uiRealWords],
            [...ueNonsenseWords, ...uiNonsenseWords],
            "ue-ui"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: createItems(
            [...ueRealWords, ...uiRealWords],
            [...ueNonsenseWords, ...uiNonsenseWords],
            "ue-ui"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: createItems(
            [...ueRealWords.slice(0, 8), ...uiRealWords.slice(0, 4)],
            [...ueNonsenseWords.slice(0, 4), ...uiNonsenseWords.slice(0, 2)],
            "ue-ui"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
    // Lesson 6: Vowel Teams Review
    {
      id: "phase8-lesson6",
      title: "Vowel Teams Review",
      description: "Practice all vowel teams together",
      order: 6,
      drills: [
        {
          type: "visual",
          items: createItems(
            [
              ...aiRealWords.slice(0, 4), ...ayRealWords.slice(0, 4),
              ...eaRealWords.slice(0, 4), ...eeRealWords.slice(0, 4),
              ...oaRealWords.slice(0, 4), ...ueRealWords.slice(0, 2),
            ],
            [
              ...aiNonsenseWords.slice(0, 2), ...ayNonsenseWords.slice(0, 2),
              ...eaNonsenseWords.slice(0, 2), ...eeNonsenseWords.slice(0, 2),
              ...oaNonsenseWords.slice(0, 2), ...ueNonsenseWords.slice(0, 1),
            ],
            "review"
          ),
          masteryThreshold: 90,
          consecutiveCorrect: 4,
        },
        {
          type: "auditory",
          items: createItems(
            [
              ...aiRealWords.slice(0, 4), ...ayRealWords.slice(0, 4),
              ...eaRealWords.slice(0, 4), ...eeRealWords.slice(0, 4),
              ...oaRealWords.slice(0, 4), ...ueRealWords.slice(0, 2),
            ],
            [
              ...aiNonsenseWords.slice(0, 2), ...ayNonsenseWords.slice(0, 2),
              ...eaNonsenseWords.slice(0, 2), ...eeNonsenseWords.slice(0, 2),
              ...oaNonsenseWords.slice(0, 2), ...ueNonsenseWords.slice(0, 1),
            ],
            "review"
          ),
          masteryThreshold: 90,
          consecutiveCorrect: 4,
        },
        {
          type: "air-writing",
          items: [
            { id: "phase8-aw-1", content: "ai", type: "syllable" },
            { id: "phase8-aw-2", content: "ay", type: "syllable" },
            { id: "phase8-aw-3", content: "ea", type: "syllable" },
            { id: "phase8-aw-4", content: "ee", type: "syllable" },
            { id: "phase8-aw-5", content: "oa", type: "syllable" },
            { id: "phase8-aw-6", content: "oe", type: "syllable" },
            { id: "phase8-aw-7", content: "ue", type: "syllable" },
            { id: "phase8-aw-8", content: "ui", type: "syllable" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
  ],
}
