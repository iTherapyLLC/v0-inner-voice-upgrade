// Phase 2: CVCV Syllable Patterns
// Building words from syllables

import type { Phase } from "@/types/literacy"

export const phase2: Phase = {
  id: "phase-2",
  number: 2,
  title: "CVCV Syllable Patterns",
  description: "Learn to build and read CVCV words",
  prerequisites: ["phase-1"],
  lessons: [
    {
      id: "lesson-2-1",
      phaseId: "phase-2",
      title: "CVCV Patterns",
      description: "Learn common CVCV words",
      drills: [
        {
          type: "visual",
          items: [
            { id: "cvcv-mama", type: "syllable", content: "mama", audioHint: "Read this word: mama", syllablePattern: "CVCV" },
            { id: "cvcv-dada", type: "syllable", content: "dada", audioHint: "Read this word: dada", syllablePattern: "CVCV" },
            { id: "cvcv-baby", type: "syllable", content: "baby", audioHint: "Read this word: baby", syllablePattern: "CVCV" },
            { id: "cvcv-taco", type: "syllable", content: "taco", audioHint: "Read this word: taco", syllablePattern: "CVCV" },
            { id: "cvcv-sofa", type: "syllable", content: "sofa", audioHint: "Read this word: sofa", syllablePattern: "CVCV" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
        {
          type: "auditory",
          items: [
            { id: "cvcv-mama-aud", type: "syllable", content: "mama", audioHint: "Read this word: mama", syllablePattern: "CVCV" },
            { id: "cvcv-dada-aud", type: "syllable", content: "dada", audioHint: "Read this word: dada", syllablePattern: "CVCV" },
            { id: "cvcv-baby-aud", type: "syllable", content: "baby", audioHint: "Read this word: baby", syllablePattern: "CVCV" },
            { id: "cvcv-taco-aud", type: "syllable", content: "taco", audioHint: "Read this word: taco", syllablePattern: "CVCV" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
      ],
    },
    {
      id: "lesson-2-2",
      phaseId: "phase-2",
      title: "Building Words from CV+VC",
      description: "Combine CV and VC syllables to make words",
      drills: [
        {
          type: "visual",
          items: [
            { id: "cvvc-man", type: "word", content: "man", audioHint: "Read the word: man", syllablePattern: "CVC" },
            { id: "cvvc-bat", type: "word", content: "bat", audioHint: "Read the word: bat", syllablePattern: "CVC" },
            { id: "cvvc-sit", type: "word", content: "sit", audioHint: "Read the word: sit", syllablePattern: "CVC" },
            { id: "cvvc-top", type: "word", content: "top", audioHint: "Read the word: top", syllablePattern: "CVC" },
            { id: "cvvc-sun", type: "word", content: "sun", audioHint: "Read the word: sun", syllablePattern: "CVC" },
            { id: "cvvc-bed", type: "word", content: "bed", audioHint: "Read the word: bed", syllablePattern: "CVC" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
        {
          type: "blending",
          items: [],
          blendingWords: [
            { word: "bat", type: "real", pattern: "CVC" },
            { word: "man", type: "real", pattern: "CVC" },
            { word: "sit", type: "real", pattern: "CVC" },
            { word: "top", type: "real", pattern: "CVC" },
            { word: "sun", type: "real", pattern: "CVC" },
            { word: "bed", type: "real", pattern: "CVC" },
            { word: "bam", type: "nonsense", pattern: "CVC" },
            { word: "dit", type: "nonsense", pattern: "CVC" },
            { word: "sop", type: "nonsense", pattern: "CVC" },
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
      title: "Blending Practice with CVCV",
      description: "Practice blending CVCV words",
      drills: [
        {
          type: "blending",
          items: [],
          blendingWords: [
            { word: "mama", type: "real", pattern: "CVCV" },
            { word: "dada", type: "real", pattern: "CVCV" },
            { word: "baby", type: "real", pattern: "CVCV" },
            { word: "taco", type: "real", pattern: "CVCV" },
            { word: "sofa", type: "real", pattern: "CVCV" },
            { word: "babi", type: "nonsense", pattern: "CVCV" },
            { word: "dama", type: "nonsense", pattern: "CVCV" },
            { word: "lato", type: "nonsense", pattern: "CVCV" },
          ],
          masteryThreshold: 85,
          consecutiveCorrect: 3,
        },
        {
          type: "visual",
          items: [
            { id: "blend-mama", type: "syllable", content: "mama", audioHint: "Read this word: mama", syllablePattern: "CVCV" },
            { id: "blend-baby", type: "syllable", content: "baby", audioHint: "Read this word: baby", syllablePattern: "CVCV" },
            { id: "blend-taco", type: "syllable", content: "taco", audioHint: "Read this word: taco", syllablePattern: "CVCV" },
            { id: "blend-sofa", type: "syllable", content: "sofa", audioHint: "Read this word: sofa", syllablePattern: "CVCV" },
          ],
          masteryThreshold: 90,
          consecutiveCorrect: 3,
        },
      ],
      prerequisites: ["lesson-2-2"],
    },
  ],
}
