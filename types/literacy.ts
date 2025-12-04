// Literacy curriculum types for Lightspeed Literacy module

export type DrillType = 
  | "auditory"    // Hear sound → write/type letter
  | "visual"      // See letter → say sound
  | "air-writing" // Watch letter animation, trace
  | "blending"    // Sequential letter presentation for decoding
  | "speech-to-text" // Speak → system transcribes
  | "text-to-speech" // System speaks → student responds

export type WordType = "real" | "nonsense"

export interface LiteracyItem {
  id: string
  type: "letter" | "sound" | "word" | "pattern"
  content: string
  audioHint?: string // e.g., "B says /b/"
  visualHint?: string
}

export interface BlendingWord {
  word: string
  type: WordType
  pattern?: string // e.g., "CVC"
}

export interface DrillConfig {
  type: DrillType
  items: LiteracyItem[]
  blendingWords?: BlendingWord[]
  masteryThreshold: number // Percentage (0-100)
  consecutiveCorrect: number // Number of consecutive correct needed
}

export interface Lesson {
  id: string
  phaseId: string
  title: string
  description: string
  drills: DrillConfig[]
  prerequisites?: string[] // Lesson IDs that must be completed first
}

export interface Phase {
  id: string
  number: number
  title: string
  description: string
  lessons: Lesson[]
  prerequisites?: string[] // Phase IDs that must be completed first
}

export interface Curriculum {
  phases: Phase[]
}

export interface DrillAttempt {
  itemId: string
  correct: boolean
  timestamp: number
  responseTime?: number
}

export interface DrillProgress {
  drillType: DrillType
  lessonId: string
  attempts: DrillAttempt[]
  completed: boolean
  masteryAchieved: boolean
  accuracy: number
  lastAttempt: number
}

export interface LessonProgress {
  lessonId: string
  drills: Record<string, DrillProgress>
  completed: boolean
  masteryAchieved: boolean
  startedAt: number
  completedAt?: number
}

export interface PhaseProgress {
  phaseId: string
  lessons: Record<string, LessonProgress>
  completed: boolean
  masteryAchieved: boolean
  unlocked: boolean
}

export interface LiteracyProgress {
  phases: Record<string, PhaseProgress>
  currentPhaseId: string
  currentLessonId: string
  totalTimeSpent: number // milliseconds
  lastActivity: number
}

export const MASTERY_THRESHOLDS: Record<DrillType, number> = {
  "visual": 90,
  "auditory": 85,
  "air-writing": 100, // Completion-based
  "blending": 85,
  "speech-to-text": 80,
  "text-to-speech": 85,
}

export const CONSECUTIVE_CORRECT_REQUIRED = 3
