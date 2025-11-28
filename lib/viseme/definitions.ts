export type VisemeType =
  | "rest" // Closed mouth, neutral
  | "aa" // "ah" as in "father" - jaw wide open
  | "ae" // "a" as in "cat" - mouth open, tongue flat
  | "ah" // "u" as in "but"
  | "ao" // "aw" as in "law"
  | "aw" // "ow" as in "cow"
  | "ay" // "ay" as in "say"
  | "b" // "b", "p", "m" - lips pressed together
  | "ch" // "ch", "j", "sh" - lips rounded forward
  | "d" // "d", "t", "n" - tongue tip touches roof
  | "ee" // "ee" as in "see" - wide smile, teeth showing
  | "eh" // "e" as in "bed"
  | "er" // "er" as in "her" - lips slightly rounded
  | "f" // "f", "v" - teeth on lower lip
  | "ih" // "i" as in "sit"
  | "k" // "k", "g" - back tongue raised
  | "l" // "l" - tongue tip up behind teeth
  | "oh" // "o" as in "go" - lips rounded
  | "oo" // "oo" as in "too" - lips very rounded
  | "r" // "r" - lips rounded, tongue curled
  | "s" // "s", "z" - teeth close together
  | "th" // "th" - tongue between teeth (CRITICAL)
  | "w" // "w" - lips very rounded and protruded

export interface VisemeShape {
  mouthOpen: number // 0-1: how open the jaw is
  mouthWidth: number // 0-1: horizontal lip stretch (smile vs pucker)
  lipRound: number // 0-1: how rounded/protruded the lips are
  tongueVisible: boolean // Whether tongue should be visible
  teethVisible: boolean // Whether teeth should show
  tonguePosition?: "tip-up" | "tip-out" | "back-raised" | "flat" // Tongue position
  lowerLipTuck?: boolean // For /f/, /v/ sounds
}

export const VISEME_SHAPES: Record<VisemeType, VisemeShape> = {
  // Neutral/rest position
  rest: {
    mouthOpen: 0,
    mouthWidth: 0.4,
    lipRound: 0,
    tongueVisible: false,
    teethVisible: false,
  },

  // Open vowels
  aa: {
    mouthOpen: 1.0, // Jaw fully open
    mouthWidth: 0.5,
    lipRound: 0.2,
    tongueVisible: true,
    teethVisible: true,
    tonguePosition: "flat",
  },
  ae: {
    mouthOpen: 0.8,
    mouthWidth: 0.7, // Stretched wide
    lipRound: 0,
    tongueVisible: true,
    teethVisible: true,
    tonguePosition: "flat",
  },
  ah: {
    mouthOpen: 0.7,
    mouthWidth: 0.5,
    lipRound: 0.1,
    tongueVisible: true,
    teethVisible: true,
    tonguePosition: "flat",
  },
  ao: {
    mouthOpen: 0.7,
    mouthWidth: 0.3, // Less wide
    lipRound: 0.6, // More rounded
    tongueVisible: false,
    teethVisible: false,
  },

  // Diphthongs
  aw: {
    mouthOpen: 0.6,
    mouthWidth: 0.2,
    lipRound: 0.8,
    tongueVisible: false,
    teethVisible: false,
  },
  ay: {
    mouthOpen: 0.5,
    mouthWidth: 0.6,
    lipRound: 0,
    tongueVisible: false,
    teethVisible: true,
  },

  // Bilabial stops - LIPS PRESSED TOGETHER
  b: {
    mouthOpen: 0, // Completely closed
    mouthWidth: 0.4,
    lipRound: 0.3,
    tongueVisible: false,
    teethVisible: false,
  },

  // Affricates/Fricatives
  ch: {
    mouthOpen: 0.25,
    mouthWidth: 0.3, // Lips forward
    lipRound: 0.5, // Rounded
    tongueVisible: false,
    teethVisible: true,
  },

  // Alveolar consonants - TONGUE TIP UP
  d: {
    mouthOpen: 0.2,
    mouthWidth: 0.5,
    lipRound: 0,
    tongueVisible: true,
    teethVisible: true,
    tonguePosition: "tip-up",
  },

  // High front vowel - WIDE SMILE
  ee: {
    mouthOpen: 0.15, // Barely open
    mouthWidth: 1.0, // Maximum stretch (smile)
    lipRound: 0,
    tongueVisible: false,
    teethVisible: true, // Teeth showing in smile
  },

  // Mid vowels
  eh: {
    mouthOpen: 0.45,
    mouthWidth: 0.7,
    lipRound: 0,
    tongueVisible: false,
    teethVisible: true,
  },
  er: {
    mouthOpen: 0.3,
    mouthWidth: 0.35,
    lipRound: 0.5,
    tongueVisible: false,
    teethVisible: false,
  },

  // Labiodental - TEETH ON LOWER LIP
  f: {
    mouthOpen: 0.1,
    mouthWidth: 0.5,
    lipRound: 0,
    tongueVisible: false,
    teethVisible: true,
    lowerLipTuck: true, // Critical for /f/, /v/
  },

  ih: {
    mouthOpen: 0.35,
    mouthWidth: 0.6,
    lipRound: 0,
    tongueVisible: false,
    teethVisible: true,
  },

  // Velar consonants - BACK TONGUE RAISED
  k: {
    mouthOpen: 0.35,
    mouthWidth: 0.5,
    lipRound: 0,
    tongueVisible: true,
    teethVisible: false,
    tonguePosition: "back-raised",
  },

  // Lateral - TONGUE TIP UP
  l: {
    mouthOpen: 0.3,
    mouthWidth: 0.5,
    lipRound: 0,
    tongueVisible: true,
    teethVisible: true,
    tonguePosition: "tip-up",
  },

  // Rounded vowels
  oh: {
    mouthOpen: 0.55,
    mouthWidth: 0.25, // Narrower
    lipRound: 0.75, // Very rounded
    tongueVisible: false,
    teethVisible: false,
  },
  oo: {
    mouthOpen: 0.25, // Small opening
    mouthWidth: 0.15, // Very narrow
    lipRound: 1.0, // Maximum lip rounding
    tongueVisible: false,
    teethVisible: false,
  },

  // Rhotic - LIPS ROUNDED, TONGUE CURLED
  r: {
    mouthOpen: 0.25,
    mouthWidth: 0.3,
    lipRound: 0.6,
    tongueVisible: false,
    teethVisible: false,
  },

  // Sibilant - TEETH CLOSE
  s: {
    mouthOpen: 0.08, // Almost closed
    mouthWidth: 0.55, // Slight smile
    lipRound: 0,
    tongueVisible: false,
    teethVisible: true, // Teeth visible and close
  },

  // Dental fricative - TONGUE BETWEEN TEETH (CRITICAL)
  th: {
    mouthOpen: 0.2,
    mouthWidth: 0.5,
    lipRound: 0,
    tongueVisible: true,
    teethVisible: true,
    tonguePosition: "tip-out", // Tongue sticks out
  },

  // Labial glide - MAXIMUM LIP ROUNDING
  w: {
    mouthOpen: 0.2,
    mouthWidth: 0.1, // Very narrow
    lipRound: 1.0, // Maximum pucker
    tongueVisible: false,
    teethVisible: false,
  },
}

// Map text characters/phonemes to visemes
export const TEXT_TO_VISEME: Record<string, VisemeType> = {
  a: "ae",
  b: "b",
  c: "k",
  d: "d",
  e: "eh",
  f: "f",
  g: "k",
  h: "ah",
  i: "ih",
  j: "ch",
  k: "k",
  l: "l",
  m: "b",
  n: "d",
  o: "oh",
  p: "b",
  q: "k",
  r: "r",
  s: "s",
  t: "d",
  u: "oo",
  v: "f",
  w: "w",
  x: "s",
  y: "ee",
  z: "s",
  " ": "rest",
  ".": "rest",
  ",": "rest",
  "!": "rest",
  "?": "rest",
}

// Generate viseme sequence from text
export function textToVisemes(text: string): VisemeType[] {
  const normalized = text.toLowerCase()
  const visemes: VisemeType[] = []

  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i]

    // Check for digraphs (two-letter combinations)
    if (i < normalized.length - 1) {
      const digraph = char + normalized[i + 1]
      if (digraph === "th") {
        visemes.push("th")
        i++
        continue
      }
      if (digraph === "sh" || digraph === "ch") {
        visemes.push("ch")
        i++
        continue
      }
      if (digraph === "ee" || digraph === "ea") {
        visemes.push("ee")
        i++
        continue
      }
      if (digraph === "oo") {
        visemes.push("oo")
        i++
        continue
      }
      if (digraph === "ou" || digraph === "ow") {
        visemes.push("aw")
        i++
        continue
      }
      if (digraph === "ay" || digraph === "ai") {
        visemes.push("ay")
        i++
        continue
      }
    }

    visemes.push(TEXT_TO_VISEME[char] || "rest")
  }

  return visemes
}
