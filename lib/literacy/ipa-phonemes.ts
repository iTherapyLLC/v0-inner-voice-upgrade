/**
 * IPA Phoneme Mapping for Literacy Drills
 *
 * This module provides accurate International Phonetic Alphabet (IPA) representations
 * for English phonemes used in the Lightspeed Literacy curriculum.
 *
 * ElevenLabs supports SSML with <phoneme> tags for precise pronunciation:
 * <phoneme alphabet="ipa" ph="bæt">bat</phoneme>
 */

// ============================================
// SINGLE LETTER PHONEMES
// ============================================

export const CONSONANT_PHONEMES: Record<string, { ipa: string; example: string; description: string }> = {
  b: { ipa: 'b', example: 'bat', description: 'voiced bilabial plosive' },
  c: { ipa: 'k', example: 'cat', description: 'voiceless velar plosive (hard c)' },
  d: { ipa: 'd', example: 'dog', description: 'voiced alveolar plosive' },
  f: { ipa: 'f', example: 'fish', description: 'voiceless labiodental fricative' },
  g: { ipa: 'ɡ', example: 'go', description: 'voiced velar plosive (hard g)' },
  h: { ipa: 'h', example: 'hat', description: 'voiceless glottal fricative' },
  j: { ipa: 'dʒ', example: 'jam', description: 'voiced postalveolar affricate' },
  k: { ipa: 'k', example: 'kite', description: 'voiceless velar plosive' },
  l: { ipa: 'l', example: 'lamp', description: 'alveolar lateral approximant' },
  m: { ipa: 'm', example: 'map', description: 'bilabial nasal' },
  n: { ipa: 'n', example: 'nest', description: 'alveolar nasal' },
  p: { ipa: 'p', example: 'pen', description: 'voiceless bilabial plosive' },
  q: { ipa: 'kw', example: 'queen', description: 'voiceless velar plosive + w' },
  r: { ipa: 'ɹ', example: 'run', description: 'alveolar approximant' },
  s: { ipa: 's', example: 'sun', description: 'voiceless alveolar fricative' },
  t: { ipa: 't', example: 'top', description: 'voiceless alveolar plosive' },
  v: { ipa: 'v', example: 'van', description: 'voiced labiodental fricative' },
  w: { ipa: 'w', example: 'wet', description: 'labio-velar approximant' },
  x: { ipa: 'ks', example: 'box', description: 'voiceless velar plosive + s' },
  y: { ipa: 'j', example: 'yes', description: 'palatal approximant' },
  z: { ipa: 'z', example: 'zoo', description: 'voiced alveolar fricative' },
}

export const SHORT_VOWEL_PHONEMES: Record<string, { ipa: string; example: string; description: string }> = {
  a: { ipa: 'æ', example: 'cat', description: 'near-open front unrounded vowel' },
  e: { ipa: 'ɛ', example: 'bed', description: 'open-mid front unrounded vowel' },
  i: { ipa: 'ɪ', example: 'sit', description: 'near-close near-front unrounded vowel' },
  o: { ipa: 'ɒ', example: 'hot', description: 'open back rounded vowel' },
  u: { ipa: 'ʌ', example: 'cup', description: 'open-mid back unrounded vowel' },
}

export const LONG_VOWEL_PHONEMES: Record<string, { ipa: string; example: string; description: string }> = {
  a: { ipa: 'eɪ', example: 'cake', description: 'diphthong: close-mid front to near-close' },
  e: { ipa: 'iː', example: 'me', description: 'close front unrounded vowel (long)' },
  i: { ipa: 'aɪ', example: 'bike', description: 'diphthong: open front to near-close' },
  o: { ipa: 'oʊ', example: 'go', description: 'diphthong: close-mid back to near-close' },
  u: { ipa: 'uː', example: 'blue', description: 'close back rounded vowel (long)' },
}

// ============================================
// CV SYLLABLE IPA MAPPINGS
// ============================================

export const CV_SYLLABLE_IPA: Record<string, string> = {
  // Short A syllables (/æ/ sound)
  ba: 'bæ', ca: 'kæ', da: 'dæ', fa: 'fæ', ga: 'ɡæ',
  ha: 'hæ', ja: 'dʒæ', ka: 'kæ', la: 'læ', ma: 'mæ',
  na: 'næ', pa: 'pæ', ra: 'ɹæ', sa: 'sæ', ta: 'tæ',
  va: 'væ', wa: 'wæ', ya: 'jæ', za: 'zæ',

  // Long A syllables (/eɪ/ sound) - open syllable rule
  'ba_long': 'beɪ', 'ca_long': 'keɪ', 'da_long': 'deɪ',
  'fa_long': 'feɪ', 'ga_long': 'ɡeɪ', 'ha_long': 'heɪ',

  // Short E syllables (/ɛ/ sound)
  be: 'bɛ', ce: 'sɛ', de: 'dɛ', fe: 'fɛ', ge: 'dʒɛ',
  he: 'hɛ', je: 'dʒɛ', ke: 'kɛ', le: 'lɛ', me: 'mɛ',
  ne: 'nɛ', pe: 'pɛ', re: 'ɹɛ', se: 'sɛ', te: 'tɛ',
  ve: 'vɛ', we: 'wɛ', ye: 'jɛ', ze: 'zɛ',

  // Long E syllables (/iː/ sound) - open syllable rule
  'be_long': 'biː', 'ce_long': 'siː', 'de_long': 'diː',
  'fe_long': 'fiː', 'ge_long': 'dʒiː', 'he_long': 'hiː',
  'ke_long': 'kiː', 'le_long': 'liː', 'me_long': 'miː',
  'ne_long': 'niː', 'pe_long': 'piː', 're_long': 'ɹiː',
  'se_long': 'siː', 'te_long': 'tiː', 've_long': 'viː',
  'we_long': 'wiː', 'ze_long': 'ziː',

  // Short I syllables (/ɪ/ sound)
  bi: 'bɪ', ci: 'sɪ', di: 'dɪ', fi: 'fɪ', gi: 'ɡɪ',
  hi: 'hɪ', ji: 'dʒɪ', ki: 'kɪ', li: 'lɪ', mi: 'mɪ',
  ni: 'nɪ', pi: 'pɪ', ri: 'ɹɪ', si: 'sɪ', ti: 'tɪ',
  vi: 'vɪ', wi: 'wɪ', yi: 'jɪ', zi: 'zɪ',

  // Long I syllables (/aɪ/ sound) - open syllable rule
  'bi_long': 'baɪ', 'di_long': 'daɪ', 'fi_long': 'faɪ',
  'hi_long': 'haɪ', 'ki_long': 'kaɪ', 'li_long': 'laɪ',
  'mi_long': 'maɪ', 'ni_long': 'naɪ', 'pi_long': 'paɪ',
  'ri_long': 'ɹaɪ', 'si_long': 'saɪ', 'ti_long': 'taɪ',
  'vi_long': 'vaɪ', 'wi_long': 'waɪ', 'zi_long': 'zaɪ',

  // Short O syllables (/ɒ/ sound)
  bo: 'bɒ', co: 'kɒ', do: 'dɒ', fo: 'fɒ', go: 'ɡɒ',
  ho: 'hɒ', jo: 'dʒɒ', ko: 'kɒ', lo: 'lɒ', mo: 'mɒ',
  no: 'nɒ', po: 'pɒ', ro: 'ɹɒ', so: 'sɒ', to: 'tɒ',
  vo: 'vɒ', wo: 'wɒ', yo: 'jɒ', zo: 'zɒ',

  // Long O syllables (/oʊ/ sound) - open syllable rule
  'bo_long': 'boʊ', 'co_long': 'koʊ', 'do_long': 'doʊ',
  'fo_long': 'foʊ', 'go_long': 'ɡoʊ', 'ho_long': 'hoʊ',
  'lo_long': 'loʊ', 'mo_long': 'moʊ', 'no_long': 'noʊ',
  'po_long': 'poʊ', 'ro_long': 'ɹoʊ', 'so_long': 'soʊ',
  'to_long': 'toʊ', 'wo_long': 'woʊ', 'yo_long': 'joʊ',

  // Short U syllables (/ʌ/ sound)
  bu: 'bʌ', cu: 'kʌ', du: 'dʌ', fu: 'fʌ', gu: 'ɡʌ',
  hu: 'hʌ', ju: 'dʒʌ', ku: 'kʌ', lu: 'lʌ', mu: 'mʌ',
  nu: 'nʌ', pu: 'pʌ', ru: 'ɹʌ', su: 'sʌ', tu: 'tʌ',
  vu: 'vʌ', wu: 'wʌ', yu: 'jʌ', zu: 'zʌ',

  // Long U syllables (/uː/ sound) - open syllable rule
  'bu_long': 'buː', 'cu_long': 'kuː', 'du_long': 'duː',
  'fu_long': 'fuː', 'gu_long': 'ɡuː', 'hu_long': 'huː',
  'lu_long': 'luː', 'mu_long': 'muː', 'nu_long': 'nuː',
  'pu_long': 'puː', 'ru_long': 'ɹuː', 'su_long': 'suː',
  'tu_long': 'tuː', 'wu_long': 'wuː', 'yu_long': 'juː',
}

// ============================================
// CVC WORD IPA MAPPINGS
// ============================================

export const CVC_WORD_IPA: Record<string, string> = {
  // Short A words
  cat: 'kæt', bat: 'bæt', hat: 'hæt', mat: 'mæt', sat: 'sæt',
  rat: 'ɹæt', pat: 'pæt', fat: 'fæt', vat: 'væt', can: 'kæn',
  man: 'mæn', pan: 'pæn', ran: 'ɹæn', tan: 'tæn', van: 'væn',
  fan: 'fæn', cap: 'kæp', map: 'mæp', nap: 'næp', tap: 'tæp',
  zap: 'zæp', gap: 'ɡæp', lap: 'læp', rap: 'ɹæp', sap: 'sæp',
  bad: 'bæd', dad: 'dæd', had: 'hæd', mad: 'mæd', sad: 'sæd',
  bag: 'bæɡ', rag: 'ɹæɡ', tag: 'tæɡ', wag: 'wæɡ', jag: 'dʒæɡ',

  // Short E words
  bed: 'bɛd', red: 'ɹɛd', fed: 'fɛd', led: 'lɛd', wed: 'wɛd',
  pet: 'pɛt', wet: 'wɛt', set: 'sɛt', get: 'ɡɛt', let: 'lɛt',
  met: 'mɛt', net: 'nɛt', bet: 'bɛt', jet: 'dʒɛt', vet: 'vɛt',
  hen: 'hɛn', pen: 'pɛn', ten: 'tɛn', den: 'dɛn', men: 'mɛn',
  beg: 'bɛɡ', leg: 'lɛɡ', peg: 'pɛɡ', keg: 'kɛɡ',

  // Short I words
  big: 'bɪɡ', pig: 'pɪɡ', dig: 'dɪɡ', wig: 'wɪɡ', fig: 'fɪɡ',
  jig: 'dʒɪɡ', rig: 'ɹɪɡ', bit: 'bɪt', sit: 'sɪt', hit: 'hɪt',
  fit: 'fɪt', kit: 'kɪt', lit: 'lɪt', pit: 'pɪt', wit: 'wɪt',
  pin: 'pɪn', bin: 'bɪn', din: 'dɪn', fin: 'fɪn', kin: 'kɪn',
  sin: 'sɪn', tin: 'tɪn', win: 'wɪn', kid: 'kɪd', did: 'dɪd',
  hid: 'hɪd', lid: 'lɪd', bid: 'bɪd', rid: 'ɹɪd',

  // Short O words
  dog: 'dɒɡ', log: 'lɒɡ', fog: 'fɒɡ', hog: 'hɒɡ', jog: 'dʒɒɡ',
  cog: 'kɒɡ', bog: 'bɒɡ', cot: 'kɒt', dot: 'dɒt', hot: 'hɒt',
  got: 'ɡɒt', lot: 'lɒt', not: 'nɒt', pot: 'pɒt', rot: 'ɹɒt',
  top: 'tɒp', hop: 'hɒp', mop: 'mɒp', pop: 'pɒp', cop: 'kɒp',
  bob: 'bɒb', job: 'dʒɒb', mob: 'mɒb', rob: 'ɹɒb', sob: 'sɒb',
  cod: 'kɒd', nod: 'nɒd', pod: 'pɒd', rod: 'ɹɒd', god: 'ɡɒd',

  // Short U words
  bug: 'bʌɡ', mug: 'mʌɡ', rug: 'ɹʌɡ', hug: 'hʌɡ', jug: 'dʒʌɡ',
  tug: 'tʌɡ', dug: 'dʌɡ', pug: 'pʌɡ', cut: 'kʌt', nut: 'nʌt',
  but: 'bʌt', gut: 'ɡʌt', hut: 'hʌt', jut: 'dʒʌt', rut: 'ɹʌt',
  bun: 'bʌn', fun: 'fʌn', gun: 'ɡʌn', nun: 'nʌn', run: 'ɹʌn',
  sun: 'sʌn', pun: 'pʌn', bus: 'bʌs', pus: 'pʌs', cub: 'kʌb',
  hub: 'hʌb', pub: 'pʌb', rub: 'ɹʌb', sub: 'sʌb', tub: 'tʌb',
  cup: 'kʌp', pup: 'pʌp', sup: 'sʌp', bud: 'bʌd', mud: 'mʌd',
}

// ============================================
// DIGRAPH AND BLEND IPA MAPPINGS
// ============================================

export const DIGRAPH_IPA: Record<string, string> = {
  // Consonant digraphs
  ch: 'tʃ',  // as in "chip"
  sh: 'ʃ',   // as in "ship"
  th: 'θ',   // as in "thin" (voiceless)
  'th_voiced': 'ð', // as in "this" (voiced)
  wh: 'w',   // as in "when" (for most American English)
  ph: 'f',   // as in "phone"
  ck: 'k',   // as in "back"
  ng: 'ŋ',   // as in "ring"

  // Vowel digraphs
  ee: 'iː',  // as in "see"
  ea: 'iː',  // as in "read" (long)
  'ea_short': 'ɛ', // as in "bread"
  ai: 'eɪ',  // as in "rain"
  ay: 'eɪ',  // as in "day"
  oa: 'oʊ',  // as in "boat"
  ow: 'oʊ',  // as in "snow"
  'ow_ou': 'aʊ', // as in "cow"
  ou: 'aʊ',  // as in "out"
  oo: 'uː',  // as in "moon"
  'oo_short': 'ʊ', // as in "book"
  oi: 'ɔɪ',  // as in "coin"
  oy: 'ɔɪ',  // as in "boy"
  au: 'ɔː',  // as in "pause"
  aw: 'ɔː',  // as in "saw"
  ew: 'uː',  // as in "new"
  ie: 'iː',  // as in "field"
  'ie_long_i': 'aɪ', // as in "pie"
}

export const BLEND_IPA: Record<string, string> = {
  // Initial blends
  bl: 'bl', cl: 'kl', fl: 'fl', gl: 'ɡl', pl: 'pl', sl: 'sl',
  br: 'bɹ', cr: 'kɹ', dr: 'dɹ', fr: 'fɹ', gr: 'ɡɹ', pr: 'pɹ', tr: 'tɹ',
  sc: 'sk', sk: 'sk', sm: 'sm', sn: 'sn', sp: 'sp', st: 'st', sw: 'sw',
  scr: 'skɹ', spl: 'spl', spr: 'spɹ', str: 'stɹ', squ: 'skw',
  tw: 'tw', dw: 'dw',

  // Final blends
  ft: 'ft', lt: 'lt', nt: 'nt', pt: 'pt', ct: 'kt',
  ld: 'ld', nd: 'nd', mp: 'mp', nk: 'ŋk', lk: 'lk',
  lp: 'lp', sp_final: 'sp', st_final: 'st', sk_final: 'sk',
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get IPA transcription for a word
 */
export function getWordIPA(word: string): string | null {
  const normalized = word.toLowerCase().trim()
  return CVC_WORD_IPA[normalized] || null
}

/**
 * Get IPA transcription for a syllable
 */
export function getSyllableIPA(syllable: string, isLongVowel = false): string | null {
  const normalized = syllable.toLowerCase().trim()
  const key = isLongVowel ? `${normalized}_long` : normalized
  return CV_SYLLABLE_IPA[key] || CV_SYLLABLE_IPA[normalized] || null
}

/**
 * Get IPA for a single letter (consonant or short vowel)
 */
export function getLetterIPA(letter: string, isLongVowel = false): string | null {
  const normalized = letter.toLowerCase().trim()

  if (CONSONANT_PHONEMES[normalized]) {
    return CONSONANT_PHONEMES[normalized].ipa
  }

  if (isLongVowel && LONG_VOWEL_PHONEMES[normalized]) {
    return LONG_VOWEL_PHONEMES[normalized].ipa
  }

  if (SHORT_VOWEL_PHONEMES[normalized]) {
    return SHORT_VOWEL_PHONEMES[normalized].ipa
  }

  return null
}

/**
 * Wrap text in SSML phoneme tag for ElevenLabs
 */
export function wrapInPhonemeSSML(text: string, ipa: string): string {
  return `<phoneme alphabet="ipa" ph="${ipa}">${text}</phoneme>`
}

/**
 * Generate SSML for a literacy item with proper pronunciation
 */
export function generateLiteracySSML(
  text: string,
  type: 'letter' | 'syllable' | 'word' | 'sentence',
  options?: { isLongVowel?: boolean; speed?: number }
): string {
  const { isLongVowel = false, speed = 1.0 } = options || {}

  let ssml = `<speak>`

  if (speed !== 1.0) {
    ssml += `<prosody rate="${Math.round(speed * 100)}%">`
  }

  switch (type) {
    case 'letter': {
      const ipa = getLetterIPA(text, isLongVowel)
      if (ipa) {
        ssml += wrapInPhonemeSSML(text, ipa)
      } else {
        ssml += text
      }
      break
    }
    case 'syllable': {
      const ipa = getSyllableIPA(text, isLongVowel)
      if (ipa) {
        ssml += wrapInPhonemeSSML(text, ipa)
      } else {
        ssml += text
      }
      break
    }
    case 'word': {
      const ipa = getWordIPA(text)
      if (ipa) {
        ssml += wrapInPhonemeSSML(text, ipa)
      } else {
        ssml += text
      }
      break
    }
    case 'sentence':
    default:
      ssml += text
      break
  }

  if (speed !== 1.0) {
    ssml += `</prosody>`
  }

  ssml += `</speak>`
  return ssml
}

/**
 * Generate blending SSML (sounds out each letter with pauses)
 */
export function generateBlendingSSML(word: string, pauseMs = 400): string {
  const letters = word.toLowerCase().split('')
  let ssml = `<speak>`

  letters.forEach((letter, idx) => {
    const ipa = getLetterIPA(letter)
    if (ipa) {
      ssml += wrapInPhonemeSSML(letter, ipa)
    } else {
      ssml += letter
    }

    if (idx < letters.length - 1) {
      ssml += `<break time="${pauseMs}ms"/>`
    }
  })

  // Add pause then say the whole word
  ssml += `<break time="600ms"/>`
  const wordIpa = getWordIPA(word)
  if (wordIpa) {
    ssml += wrapInPhonemeSSML(word, wordIpa)
  } else {
    ssml += word
  }

  ssml += `</speak>`
  return ssml
}

/**
 * Check if ElevenLabs model supports SSML
 * Note: Only eleven_turbo_v2 and eleven_multilingual_v2 support SSML
 */
export function supportsSSML(modelId: string): boolean {
  return modelId.includes('turbo') || modelId.includes('multilingual_v2')
}

/**
 * Get phonetic spelling for speech synthesis fallback
 * (when SSML is not supported)
 */
export function getPhoneticSpelling(text: string): string {
  const CV_PHONETIC: Record<string, string> = {
    // Open syllable pronunciation (long vowels)
    ma: 'mah', pa: 'pah', ba: 'bah', da: 'dah', na: 'nah',
    ta: 'tah', sa: 'sah', la: 'lah', fa: 'fah', ga: 'gah',
    me: 'mee', be: 'bee', de: 'dee', fe: 'fee', ge: 'jee',
    he: 'hee', ke: 'kee', le: 'lee', ne: 'nee', pe: 'pee',
    mi: 'my', bi: 'by', di: 'dye', fi: 'fye', gi: 'guy',
    hi: 'hi', ki: 'kye', li: 'lye', ni: 'nye', pi: 'pye',
    mo: 'mow', bo: 'bow', do: 'doe', fo: 'foe', go: 'go',
    ho: 'hoe', ko: 'koe', lo: 'low', no: 'no', po: 'poe',
    mu: 'moo', bu: 'boo', du: 'doo', fu: 'foo', gu: 'goo',
    hu: 'who', ku: 'koo', lu: 'loo', nu: 'noo', pu: 'poo',
  }

  return CV_PHONETIC[text.toLowerCase()] || text
}
