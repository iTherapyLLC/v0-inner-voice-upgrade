// Phase 10: Diphthongs
// Two vowel sounds in one syllable (gliding sound)
// oi/oy, ou/ow, au/aw, oo (both sounds)

import type { Phase, LiteracyItem } from "@/types/literacy"

function createItems(
  realWords: string[],
  nonsenseWords: string[],
  type: string
): LiteracyItem[] {
  const allWords = [...realWords, ...nonsenseWords]
  return allWords.map((word, idx) => ({
    id: `phase10-${type}-${idx}`,
    content: word,
    type: "word" as const,
    isNonsense: nonsenseWords.includes(word),
  }))
}

// OI words (/oi/ as in oil)
const oiRealWords = [
  "oil", "boil", "coil", "foil", "soil", "toil", "spoil", "broil",
  "coin", "join", "point", "joint", "moist", "hoist", "voice", "choice",
  "noise", "avoid", "poison", "toilet",
]
const oiNonsenseWords = [
  "boin", "doit", "foin", "goit", "loid", "moin", "noit", "poid",
  "stoin", "bloit", "cloin", "gloid",
]

// OY words (/oi/ as in boy)
const oyRealWords = [
  "boy", "toy", "joy", "coy", "soy", "ploy", "cloy", "troy",
  "enjoy", "employ", "annoy", "destroy", "royal", "loyal", "oyster",
]
const oyNonsenseWords = [
  "broy", "doy", "foy", "goy", "loy", "moy", "noy", "poy",
  "gloy", "stoy", "floy", "snoy",
]

// OU words (/ou/ as in out)
const ouRealWords = [
  "out", "ouch", "our", "hour", "house", "mouse", "blouse", "spouse",
  "loud", "cloud", "proud", "shout", "scout", "snout", "trout", "sprout",
  "count", "mount", "found", "sound", "round", "ground", "pound", "bound",
  "mouth", "south", "couch", "pouch", "slouch", "crouch", "grouch",
]
const ouNonsenseWords = [
  "boud", "dout", "foud", "gout", "lound", "mout", "nout", "poud",
  "blout", "clound", "flout", "glouch", "stoud", "snoud",
]

// OW words (/ou/ as in cow)
const owRealWords = [
  "cow", "how", "now", "wow", "bow", "vow", "row", "plow",
  "brown", "crown", "drown", "frown", "town", "down", "gown", "clown",
  "owl", "howl", "growl", "prowl", "scowl", "crowd", "powder", "flower",
  "tower", "power", "shower", "vowel", "towel", "allow", "eyebrow",
]
const owNonsenseWords = [
  "brow", "drow", "glow", "mow", "stow", "trow", "flowl", "plown",
  "clow", "snown", "glowl", "browl",
]

// AU words (/aw/ as in sauce)
const auRealWords = [
  "auto", "audit", "author", "August", "autumn", "sauce", "cause", "pause",
  "fault", "vault", "haunt", "launch", "haul", "maul", "fraud", "astronaut",
  "because", "applause", "sausage", "laundry", "daughter", "naughty", "caught", "taught",
]
const auNonsenseWords = [
  "baut", "daut", "fauld", "gault", "laup", "mause", "naunt", "pauch",
  "sault", "staul", "claunt", "glaup",
]

// AW words (/aw/ as in saw)
const awRealWords = [
  "saw", "law", "raw", "jaw", "paw", "claw", "draw", "straw",
  "dawn", "fawn", "lawn", "yawn", "spawn", "crawl", "brawl", "shawl",
  "hawk", "squawk", "awkward", "awesome", "awful", "awning", "strawberry",
]
const awNonsenseWords = [
  "baw", "daw", "gaw", "maw", "taw", "vaw", "brawl", "clawn",
  "frawl", "glawn", "spawl", "stawl",
]

// OO (short, as in book)
const ooShortRealWords = [
  "book", "cook", "look", "hook", "took", "brook", "shook", "crook",
  "good", "wood", "hood", "stood", "foot", "soot", "wool", "woof",
]
const ooShortNonsenseWords = [
  "bood", "dook", "fook", "gook", "lood", "mook", "nood", "pook",
  "stook", "blook", "clood", "flook",
]

// OO (long, as in moon)
const ooLongRealWords = [
  "moon", "soon", "noon", "spoon", "broom", "room", "zoom", "bloom",
  "cool", "pool", "tool", "fool", "drool", "school", "food", "mood",
  "roof", "proof", "tooth", "booth", "smooth", "goose", "loose", "moose",
  "boot", "hoot", "root", "shoot", "scoop", "troop", "loop",
]
const ooLongNonsenseWords = [
  "boon", "dool", "foom", "goot", "loof", "mool", "noot", "poom",
  "stoom", "bloot", "clool", "floon", "gloof",
]

export const phase10: Phase = {
  id: "phase10",
  title: "Diphthongs",
  description: "Learn vowel sounds that glide from one to another",
  order: 10,
  lessons: [
    // Lesson 1: OI and OY
    {
      id: "phase10-lesson1",
      title: "OI and OY",
      description: "The /oi/ sound as in oil and boy",
      order: 1,
      drills: [
        {
          type: "visual",
          items: createItems(
            [...oiRealWords.slice(0, 10), ...oyRealWords.slice(0, 8)],
            [...oiNonsenseWords.slice(0, 5), ...oyNonsenseWords.slice(0, 4)],
            "oi-oy"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: createItems(
            [...oiRealWords.slice(0, 10), ...oyRealWords.slice(0, 8)],
            [...oiNonsenseWords.slice(0, 5), ...oyNonsenseWords.slice(0, 4)],
            "oi-oy"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: createItems(
            [...oiRealWords.slice(0, 6), ...oyRealWords.slice(0, 5)],
            [...oiNonsenseWords.slice(0, 3), ...oyNonsenseWords.slice(0, 2)],
            "oi-oy"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
    // Lesson 2: OU and OW (/ou/)
    {
      id: "phase10-lesson2",
      title: "OU and OW",
      description: "The /ou/ sound as in out and cow",
      order: 2,
      drills: [
        {
          type: "visual",
          items: createItems(
            [...ouRealWords.slice(0, 12), ...owRealWords.slice(0, 10)],
            [...ouNonsenseWords.slice(0, 6), ...owNonsenseWords.slice(0, 5)],
            "ou-ow"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: createItems(
            [...ouRealWords.slice(0, 12), ...owRealWords.slice(0, 10)],
            [...ouNonsenseWords.slice(0, 6), ...owNonsenseWords.slice(0, 5)],
            "ou-ow"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: createItems(
            [...ouRealWords.slice(0, 8), ...owRealWords.slice(0, 6)],
            [...ouNonsenseWords.slice(0, 4), ...owNonsenseWords.slice(0, 3)],
            "ou-ow"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
    // Lesson 3: AU and AW
    {
      id: "phase10-lesson3",
      title: "AU and AW",
      description: "The /aw/ sound as in sauce and saw",
      order: 3,
      drills: [
        {
          type: "visual",
          items: createItems(
            [...auRealWords.slice(0, 12), ...awRealWords.slice(0, 10)],
            [...auNonsenseWords.slice(0, 6), ...awNonsenseWords.slice(0, 5)],
            "au-aw"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: createItems(
            [...auRealWords.slice(0, 12), ...awRealWords.slice(0, 10)],
            [...auNonsenseWords.slice(0, 6), ...awNonsenseWords.slice(0, 5)],
            "au-aw"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: createItems(
            [...auRealWords.slice(0, 8), ...awRealWords.slice(0, 6)],
            [...auNonsenseWords.slice(0, 4), ...awNonsenseWords.slice(0, 3)],
            "au-aw"
          ),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
    // Lesson 4: OO (short sound)
    {
      id: "phase10-lesson4",
      title: "OO (Short Sound)",
      description: "Short OO as in book and good",
      order: 4,
      drills: [
        {
          type: "visual",
          items: createItems(ooShortRealWords, ooShortNonsenseWords, "oo-short"),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: createItems(ooShortRealWords, ooShortNonsenseWords, "oo-short"),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: createItems(ooShortRealWords.slice(0, 10), ooShortNonsenseWords.slice(0, 5), "oo-short"),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
    // Lesson 5: OO (long sound)
    {
      id: "phase10-lesson5",
      title: "OO (Long Sound)",
      description: "Long OO as in moon and school",
      order: 5,
      drills: [
        {
          type: "visual",
          items: createItems(ooLongRealWords.slice(0, 16), ooLongNonsenseWords.slice(0, 8), "oo-long"),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: createItems(ooLongRealWords.slice(0, 16), ooLongNonsenseWords.slice(0, 8), "oo-long"),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: createItems(ooLongRealWords.slice(0, 10), ooLongNonsenseWords.slice(0, 5), "oo-long"),
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
    // Lesson 6: Diphthongs Review
    {
      id: "phase10-lesson6",
      title: "Diphthongs Review",
      description: "Practice all diphthong patterns",
      order: 6,
      drills: [
        {
          type: "visual",
          items: createItems(
            [
              ...oiRealWords.slice(0, 4), ...oyRealWords.slice(0, 3),
              ...ouRealWords.slice(0, 4), ...owRealWords.slice(0, 3),
              ...auRealWords.slice(0, 3), ...awRealWords.slice(0, 3),
              ...ooShortRealWords.slice(0, 3), ...ooLongRealWords.slice(0, 3),
            ],
            [
              ...oiNonsenseWords.slice(0, 2), ...oyNonsenseWords.slice(0, 1),
              ...ouNonsenseWords.slice(0, 2), ...owNonsenseWords.slice(0, 1),
              ...auNonsenseWords.slice(0, 2), ...awNonsenseWords.slice(0, 1),
              ...ooShortNonsenseWords.slice(0, 2), ...ooLongNonsenseWords.slice(0, 2),
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
              ...oiRealWords.slice(0, 4), ...oyRealWords.slice(0, 3),
              ...ouRealWords.slice(0, 4), ...owRealWords.slice(0, 3),
              ...auRealWords.slice(0, 3), ...awRealWords.slice(0, 3),
              ...ooShortRealWords.slice(0, 3), ...ooLongRealWords.slice(0, 3),
            ],
            [
              ...oiNonsenseWords.slice(0, 2), ...oyNonsenseWords.slice(0, 1),
              ...ouNonsenseWords.slice(0, 2), ...owNonsenseWords.slice(0, 1),
              ...auNonsenseWords.slice(0, 2), ...awNonsenseWords.slice(0, 1),
              ...ooShortNonsenseWords.slice(0, 2), ...ooLongNonsenseWords.slice(0, 2),
            ],
            "review"
          ),
          masteryThreshold: 90,
          consecutiveCorrect: 4,
        },
        {
          type: "air-writing",
          items: [
            { id: "phase10-aw-1", content: "oi", type: "syllable" },
            { id: "phase10-aw-2", content: "oy", type: "syllable" },
            { id: "phase10-aw-3", content: "ou", type: "syllable" },
            { id: "phase10-aw-4", content: "ow", type: "syllable" },
            { id: "phase10-aw-5", content: "au", type: "syllable" },
            { id: "phase10-aw-6", content: "aw", type: "syllable" },
            { id: "phase10-aw-7", content: "oo", type: "syllable" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
  ],
}
