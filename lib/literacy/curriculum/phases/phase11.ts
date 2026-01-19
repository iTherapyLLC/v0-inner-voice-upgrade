// Phase 11: Consonant-le Syllables
// Final syllable pattern where consonant + le makes its own syllable
// -ble, -cle, -dle, -fle, -gle, -kle, -ple, -tle, -zle

import type { Phase, LiteracyItem } from "@/types/literacy"

function createItems(
  realWords: string[],
  nonsenseWords: string[],
  type: string
): LiteracyItem[] {
  const allWords = [...realWords, ...nonsenseWords]
  return allWords.map((word, idx) => ({
    id: `phase11-${type}-${idx}`,
    content: word,
    type: "word" as const,
    isNonsense: nonsenseWords.includes(word),
  }))
}

// -ble words
const bleRealWords = [
  "table", "cable", "fable", "stable", "able", "noble", "bubble", "double",
  "trouble", "rubble", "pebble", "wobble", "gobble", "bobble", "dribble", "nibble",
  "scribble", "tremble", "humble", "tumble", "stumble", "crumble", "grumble", "rumble",
  "mumble", "fumble", "jumble", "marble", "terrible", "horrible", "possible", "flexible",
]
const bleNonsenseWords = [
  "bable", "dable", "gable", "lable", "mable", "nuble", "puble", "suble",
  "tuble", "bluble", "clable", "fluble", "glable", "stuble",
]

// -cle words
const cleRealWords = [
  "uncle", "circle", "bicycle", "icicle", "article", "particle", "miracle", "obstacle",
  "spectacle", "tentacle", "vehicle", "chronicle", "cubicle", "muscle", "recycle",
]
const cleNonsenseWords = [
  "bacle", "dacle", "facle", "gacle", "lacle", "macle", "nacle", "pacle",
  "sacle", "tacle", "vacle", "blacle", "clacle",
]

// -dle words
const dleRealWords = [
  "middle", "riddle", "fiddle", "paddle", "saddle", "waddle", "puddle", "muddle",
  "cuddle", "huddle", "toddle", "waddle", "needle", "poodle", "doodle", "noodle",
  "candle", "handle", "bundle", "kindle", "spindle", "swindle", "cradle", "ladle",
]
const dleNonsenseWords = [
  "badle", "dadle", "fadle", "gadle", "ladle", "madle", "nadle", "padle",
  "sadle", "tadle", "vadle", "bladle", "cladle",
]

// -fle words
const fleRealWords = [
  "raffle", "waffle", "baffle", "rifle", "trifle", "stifle", "shuffle", "muffle",
  "ruffle", "truffle", "sniffle", "piffle",
]
const fleNonsenseWords = [
  "bafle", "dafle", "gafle", "lafle", "mafle", "nafle", "pafle", "safle",
  "tafle", "vafle", "blafle", "clafle",
]

// -gle words
const gleRealWords = [
  "giggle", "wiggle", "jiggle", "juggle", "struggle", "snuggle", "smuggle", "toggle",
  "goggle", "boggle", "ogle", "bugle", "beagle", "eagle", "angle", "tangle",
  "mangle", "dangle", "jingle", "mingle", "single", "tingle", "bungle", "jungle",
]
const gleNonsenseWords = [
  "bagle", "dagle", "fagle", "lagle", "magle", "nagle", "pagle", "sagle",
  "tagle", "vagle", "blagle", "clagle",
]

// -kle words
const kleRealWords = [
  "ankle", "sparkle", "wrinkle", "twinkle", "crinkle", "sprinkle", "trickle", "pickle",
  "tickle", "fickle", "sickle", "prickle", "buckle", "chuckle", "knuckle", "freckle",
]
const kleNonsenseWords = [
  "bakle", "dakle", "fakle", "gakle", "lakle", "makle", "nakle", "pakle",
  "sakle", "takle", "vakle", "blakle",
]

// -ple words
const pleRealWords = [
  "apple", "maple", "staple", "purple", "simple", "dimple", "pimple", "ripple",
  "nipple", "tipple", "triple", "cripple", "example", "temple", "sample", "trample",
  "crumple", "rumple", "people", "steeple", "topple", "couple", "supple",
]
const pleNonsenseWords = [
  "baple", "daple", "faple", "gaple", "laple", "maple", "naple", "saple",
  "taple", "vaple", "blaple", "claple",
]

// -tle words
const tleRealWords = [
  "little", "bottle", "battle", "cattle", "rattle", "settle", "kettle", "nettle",
  "beetle", "title", "turtle", "gentle", "subtle", "castle", "whistle", "thistle",
  "bristle", "hustle", "bustle", "rustle", "startle", "mantle", "shuttle", "throttle",
]
const tleNonsenseWords = [
  "batle", "datle", "fatle", "gatle", "latle", "matle", "natle", "patle",
  "satle", "vatle", "blatle", "clatle",
]

// -zle words
const zleRealWords = [
  "puzzle", "muzzle", "nuzzle", "guzzle", "fizzle", "drizzle", "sizzle", "frazzle",
  "dazzle", "nozzle", "embezzle",
]
const zleNonsenseWords = [
  "bazle", "dazle", "fazle", "gazle", "lazle", "mazle", "nazle", "pazle",
  "sazle", "tazle", "vazle", "blazle",
]

export const phase11: Phase = {
  id: "phase11",
  title: "Consonant-le",
  description: "Learn syllables ending in consonant + le",
  order: 11,
  lessons: [
    // Lesson 1: -ble
    {
      id: "phase11-lesson1",
      title: "-ble Words",
      description: "Words ending in -ble (table, bubble)",
      order: 1,
      drills: [
        {
          type: "visual",
          items: createItems(bleRealWords.slice(0, 16), bleNonsenseWords.slice(0, 8), "ble"),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: createItems(bleRealWords.slice(0, 16), bleNonsenseWords.slice(0, 8), "ble"),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: createItems(bleRealWords.slice(0, 10), bleNonsenseWords.slice(0, 5), "ble"),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
    // Lesson 2: -tle and -dle
    {
      id: "phase11-lesson2",
      title: "-tle and -dle Words",
      description: "Words ending in -tle (little) and -dle (middle)",
      order: 2,
      drills: [
        {
          type: "visual",
          items: createItems(
            [...tleRealWords.slice(0, 10), ...dleRealWords.slice(0, 10)],
            [...tleNonsenseWords.slice(0, 5), ...dleNonsenseWords.slice(0, 5)],
            "tle-dle"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: createItems(
            [...tleRealWords.slice(0, 10), ...dleRealWords.slice(0, 10)],
            [...tleNonsenseWords.slice(0, 5), ...dleNonsenseWords.slice(0, 5)],
            "tle-dle"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: createItems(
            [...tleRealWords.slice(0, 6), ...dleRealWords.slice(0, 6)],
            [...tleNonsenseWords.slice(0, 3), ...dleNonsenseWords.slice(0, 3)],
            "tle-dle"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
    // Lesson 3: -gle and -kle
    {
      id: "phase11-lesson3",
      title: "-gle and -kle Words",
      description: "Words ending in -gle (giggle) and -kle (sparkle)",
      order: 3,
      drills: [
        {
          type: "visual",
          items: createItems(
            [...gleRealWords.slice(0, 10), ...kleRealWords.slice(0, 8)],
            [...gleNonsenseWords.slice(0, 5), ...kleNonsenseWords.slice(0, 4)],
            "gle-kle"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: createItems(
            [...gleRealWords.slice(0, 10), ...kleRealWords.slice(0, 8)],
            [...gleNonsenseWords.slice(0, 5), ...kleNonsenseWords.slice(0, 4)],
            "gle-kle"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: createItems(
            [...gleRealWords.slice(0, 6), ...kleRealWords.slice(0, 5)],
            [...gleNonsenseWords.slice(0, 3), ...kleNonsenseWords.slice(0, 2)],
            "gle-kle"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
    // Lesson 4: -ple and -fle
    {
      id: "phase11-lesson4",
      title: "-ple and -fle Words",
      description: "Words ending in -ple (apple) and -fle (waffle)",
      order: 4,
      drills: [
        {
          type: "visual",
          items: createItems(
            [...pleRealWords.slice(0, 12), ...fleRealWords],
            [...pleNonsenseWords.slice(0, 6), ...fleNonsenseWords.slice(0, 6)],
            "ple-fle"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: createItems(
            [...pleRealWords.slice(0, 12), ...fleRealWords],
            [...pleNonsenseWords.slice(0, 6), ...fleNonsenseWords.slice(0, 6)],
            "ple-fle"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: createItems(
            [...pleRealWords.slice(0, 8), ...fleRealWords.slice(0, 6)],
            [...pleNonsenseWords.slice(0, 4), ...fleNonsenseWords.slice(0, 3)],
            "ple-fle"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
    // Lesson 5: -cle and -zle
    {
      id: "phase11-lesson5",
      title: "-cle and -zle Words",
      description: "Words ending in -cle (circle) and -zle (puzzle)",
      order: 5,
      drills: [
        {
          type: "visual",
          items: createItems(
            [...cleRealWords, ...zleRealWords],
            [...cleNonsenseWords.slice(0, 6), ...zleNonsenseWords.slice(0, 6)],
            "cle-zle"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: createItems(
            [...cleRealWords, ...zleRealWords],
            [...cleNonsenseWords.slice(0, 6), ...zleNonsenseWords.slice(0, 6)],
            "cle-zle"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: createItems(
            [...cleRealWords.slice(0, 8), ...zleRealWords.slice(0, 6)],
            [...cleNonsenseWords.slice(0, 4), ...zleNonsenseWords.slice(0, 3)],
            "cle-zle"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
    // Lesson 6: Consonant-le Review
    {
      id: "phase11-lesson6",
      title: "Consonant-le Review",
      description: "Practice all consonant-le patterns",
      order: 6,
      drills: [
        {
          type: "visual",
          items: createItems(
            [
              ...bleRealWords.slice(0, 4), ...tleRealWords.slice(0, 4),
              ...dleRealWords.slice(0, 3), ...gleRealWords.slice(0, 3),
              ...kleRealWords.slice(0, 3), ...pleRealWords.slice(0, 3),
              ...fleRealWords.slice(0, 2), ...cleRealWords.slice(0, 2),
              ...zleRealWords.slice(0, 2),
            ],
            [
              ...bleNonsenseWords.slice(0, 2), ...tleNonsenseWords.slice(0, 2),
              ...dleNonsenseWords.slice(0, 2), ...gleNonsenseWords.slice(0, 2),
              ...kleNonsenseWords.slice(0, 1), ...pleNonsenseWords.slice(0, 1),
              ...fleNonsenseWords.slice(0, 1), ...cleNonsenseWords.slice(0, 1),
              ...zleNonsenseWords.slice(0, 1),
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
              ...bleRealWords.slice(0, 4), ...tleRealWords.slice(0, 4),
              ...dleRealWords.slice(0, 3), ...gleRealWords.slice(0, 3),
              ...kleRealWords.slice(0, 3), ...pleRealWords.slice(0, 3),
              ...fleRealWords.slice(0, 2), ...cleRealWords.slice(0, 2),
              ...zleRealWords.slice(0, 2),
            ],
            [
              ...bleNonsenseWords.slice(0, 2), ...tleNonsenseWords.slice(0, 2),
              ...dleNonsenseWords.slice(0, 2), ...gleNonsenseWords.slice(0, 2),
              ...kleNonsenseWords.slice(0, 1), ...pleNonsenseWords.slice(0, 1),
              ...fleNonsenseWords.slice(0, 1), ...cleNonsenseWords.slice(0, 1),
              ...zleNonsenseWords.slice(0, 1),
            ],
            "review"
          ),
          masteryThreshold: 90,
          consecutiveCorrect: 4,
        },
        {
          type: "air-writing",
          items: [
            { id: "phase11-aw-1", content: "ble", type: "syllable" },
            { id: "phase11-aw-2", content: "tle", type: "syllable" },
            { id: "phase11-aw-3", content: "dle", type: "syllable" },
            { id: "phase11-aw-4", content: "gle", type: "syllable" },
            { id: "phase11-aw-5", content: "kle", type: "syllable" },
            { id: "phase11-aw-6", content: "ple", type: "syllable" },
            { id: "phase11-aw-7", content: "fle", type: "syllable" },
            { id: "phase11-aw-8", content: "cle", type: "syllable" },
            { id: "phase11-aw-9", content: "zle", type: "syllable" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
  ],
}
