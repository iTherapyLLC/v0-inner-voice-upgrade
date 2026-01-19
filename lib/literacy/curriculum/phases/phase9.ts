// Phase 9: R-Controlled Vowels
// When R follows a vowel, it changes the vowel sound
// ar, er, ir, or, ur (bossy r)

import type { Phase, LiteracyItem } from "@/types/literacy"

function createItems(
  realWords: string[],
  nonsenseWords: string[],
  type: string
): LiteracyItem[] {
  const allWords = [...realWords, ...nonsenseWords]
  return allWords.map((word, idx) => ({
    id: `phase9-${type}-${idx}`,
    content: word,
    type: "word" as const,
    isNonsense: nonsenseWords.includes(word),
  }))
}

// AR words (/ar/ as in car)
const arRealWords = [
  "car", "bar", "far", "jar", "star", "scar", "tar", "par",
  "art", "cart", "dart", "part", "start", "smart", "chart", "heart",
  "arm", "farm", "harm", "charm", "alarm", "card", "hard", "yard",
  "dark", "bark", "mark", "park", "spark", "shark", "barn", "yarn",
  "march", "arch", "sharp", "harp", "garden", "market", "carpet",
]
const arNonsenseWords = [
  "gar", "lar", "nar", "tarp", "barp", "carm", "darm", "fark",
  "gark", "lart", "marn", "parm", "shart", "glarp", "snarm",
]

// ER words (/er/ as in her)
const erRealWords = [
  "her", "fern", "germ", "term", "stern", "herd", "nerd", "verb",
  "perch", "clerk", "jerk", "perk", "nerve", "serve", "verse", "merge",
  "after", "better", "letter", "never", "over", "under", "water", "river",
  "winter", "sister", "mister", "dinner", "summer", "hammer", "ladder",
]
const erNonsenseWords = [
  "ber", "der", "ler", "mer", "ner", "perb", "serb", "terb",
  "ferp", "gerp", "lerp", "blern", "cler", "flerm", "plers",
]

// IR words (/er/ as in bird)
const irRealWords = [
  "bird", "dirt", "girl", "first", "third", "shirt", "skirt", "birth",
  "sir", "fir", "stir", "chirp", "firm", "swirl", "twirl", "whirl",
  "circle", "circus", "thirty", "thirsty", "birthday", "confirm",
]
const irNonsenseWords = [
  "bir", "dir", "fird", "gird", "lird", "mird", "nird", "pirt",
  "sirt", "tirl", "virl", "blirp", "clirt", "flirm", "glir",
]

// OR words (/or/ as in for)
const orRealWords = [
  "for", "or", "nor", "corn", "born", "horn", "worn", "torn",
  "fork", "pork", "cork", "stork", "short", "sport", "sort", "port",
  "storm", "form", "worm", "north", "forth", "horse", "force", "porch",
  "order", "border", "corner", "morning", "before", "story", "glory",
]
const orNonsenseWords = [
  "bor", "dor", "gor", "lor", "morn", "forp", "gork", "lort",
  "porm", "sorn", "torp", "blorn", "clork", "florm", "glort",
]

// UR words (/er/ as in fur)
const urRealWords = [
  "fur", "blur", "slur", "spur", "burn", "turn", "churn", "return",
  "hurt", "burst", "nurse", "purse", "curse", "curve", "surf", "turf",
  "church", "urch", "purple", "turtle", "turkey", "curtain", "surprise",
]
const urNonsenseWords = [
  "bur", "cur", "dur", "gur", "lurn", "murn", "purn", "surt",
  "furt", "gurt", "lurt", "blurn", "clurp", "flurt", "glurn",
]

export const phase9: Phase = {
  id: "phase9",
  title: "R-Controlled Vowels",
  description: "Learn how R changes vowel sounds (Bossy R)",
  order: 9,
  lessons: [
    // Lesson 1: AR
    {
      id: "phase9-lesson1",
      title: "AR: The /ar/ Sound",
      description: "AR as in car, star, arm",
      order: 1,
      drills: [
        {
          type: "visual",
          items: createItems(arRealWords.slice(0, 16), arNonsenseWords.slice(0, 8), "ar"),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: createItems(arRealWords.slice(0, 16), arNonsenseWords.slice(0, 8), "ar"),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: createItems(arRealWords.slice(0, 10), arNonsenseWords.slice(0, 5), "ar"),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
    // Lesson 2: OR
    {
      id: "phase9-lesson2",
      title: "OR: The /or/ Sound",
      description: "OR as in for, corn, horse",
      order: 2,
      drills: [
        {
          type: "visual",
          items: createItems(orRealWords.slice(0, 16), orNonsenseWords.slice(0, 8), "or"),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: createItems(orRealWords.slice(0, 16), orNonsenseWords.slice(0, 8), "or"),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: createItems(orRealWords.slice(0, 10), orNonsenseWords.slice(0, 5), "or"),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
    // Lesson 3: ER
    {
      id: "phase9-lesson3",
      title: "ER: The /er/ Sound",
      description: "ER as in her, fern, after",
      order: 3,
      drills: [
        {
          type: "visual",
          items: createItems(erRealWords.slice(0, 16), erNonsenseWords.slice(0, 8), "er"),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: createItems(erRealWords.slice(0, 16), erNonsenseWords.slice(0, 8), "er"),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: createItems(erRealWords.slice(0, 10), erNonsenseWords.slice(0, 5), "er"),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
    // Lesson 4: IR
    {
      id: "phase9-lesson4",
      title: "IR: The /er/ Sound",
      description: "IR as in bird, girl, first",
      order: 4,
      drills: [
        {
          type: "visual",
          items: createItems(irRealWords.slice(0, 14), irNonsenseWords.slice(0, 7), "ir"),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: createItems(irRealWords.slice(0, 14), irNonsenseWords.slice(0, 7), "ir"),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: createItems(irRealWords.slice(0, 10), irNonsenseWords.slice(0, 5), "ir"),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
    // Lesson 5: UR
    {
      id: "phase9-lesson5",
      title: "UR: The /er/ Sound",
      description: "UR as in fur, burn, nurse",
      order: 5,
      drills: [
        {
          type: "visual",
          items: createItems(urRealWords.slice(0, 14), urNonsenseWords.slice(0, 7), "ur"),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: createItems(urRealWords.slice(0, 14), urNonsenseWords.slice(0, 7), "ur"),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: createItems(urRealWords.slice(0, 10), urNonsenseWords.slice(0, 5), "ur"),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
    // Lesson 6: ER/IR/UR Comparison
    {
      id: "phase9-lesson6",
      title: "ER, IR, UR Review",
      description: "Compare the three /er/ spellings",
      order: 6,
      drills: [
        {
          type: "visual",
          items: createItems(
            [...erRealWords.slice(0, 6), ...irRealWords.slice(0, 6), ...urRealWords.slice(0, 6)],
            [...erNonsenseWords.slice(0, 3), ...irNonsenseWords.slice(0, 3), ...urNonsenseWords.slice(0, 3)],
            "er-ir-ur"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: createItems(
            [...erRealWords.slice(0, 6), ...irRealWords.slice(0, 6), ...urRealWords.slice(0, 6)],
            [...erNonsenseWords.slice(0, 3), ...irNonsenseWords.slice(0, 3), ...urNonsenseWords.slice(0, 3)],
            "er-ir-ur"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: createItems(
            [...erRealWords.slice(0, 4), ...irRealWords.slice(0, 4), ...urRealWords.slice(0, 4)],
            [...erNonsenseWords.slice(0, 2), ...irNonsenseWords.slice(0, 2), ...urNonsenseWords.slice(0, 2)],
            "er-ir-ur"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
    // Lesson 7: All R-Controlled Review
    {
      id: "phase9-lesson7",
      title: "R-Controlled Review",
      description: "Practice all Bossy R patterns",
      order: 7,
      drills: [
        {
          type: "visual",
          items: createItems(
            [
              ...arRealWords.slice(0, 5), ...orRealWords.slice(0, 5),
              ...erRealWords.slice(0, 4), ...irRealWords.slice(0, 3), ...urRealWords.slice(0, 3),
            ],
            [
              ...arNonsenseWords.slice(0, 2), ...orNonsenseWords.slice(0, 2),
              ...erNonsenseWords.slice(0, 2), ...irNonsenseWords.slice(0, 2), ...urNonsenseWords.slice(0, 2),
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
              ...arRealWords.slice(0, 5), ...orRealWords.slice(0, 5),
              ...erRealWords.slice(0, 4), ...irRealWords.slice(0, 3), ...urRealWords.slice(0, 3),
            ],
            [
              ...arNonsenseWords.slice(0, 2), ...orNonsenseWords.slice(0, 2),
              ...erNonsenseWords.slice(0, 2), ...irNonsenseWords.slice(0, 2), ...urNonsenseWords.slice(0, 2),
            ],
            "review"
          ),
          masteryThreshold: 90,
          consecutiveCorrect: 4,
        },
        {
          type: "air-writing",
          items: [
            { id: "phase9-aw-1", content: "ar", type: "syllable" },
            { id: "phase9-aw-2", content: "or", type: "syllable" },
            { id: "phase9-aw-3", content: "er", type: "syllable" },
            { id: "phase9-aw-4", content: "ir", type: "syllable" },
            { id: "phase9-aw-5", content: "ur", type: "syllable" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
  ],
}
