/**
 * Spiral Review System for Lightspeed Literacy
 *
 * Implements spaced repetition and adaptive difficulty for optimal learning:
 * - Items are reviewed at increasing intervals after mastery
 * - Struggling items are reviewed more frequently
 * - Mastered items decay over time and need maintenance
 * - Difficulty adapts based on performance
 */

import type { DrillAttempt, DrillProgress, LiteracyProgress, DrillType } from "@/types/literacy"
import { calculateAccuracy, getItemsForReteaching } from "./mastery"

// ============================================
// SPACED REPETITION INTERVALS (in days)
// ============================================

const REVIEW_INTERVALS = [1, 3, 7, 14, 30, 60, 90] // Days between reviews
const MASTERY_DECAY_DAYS = 14 // Days before mastered items need review

// ============================================
// DIFFICULTY LEVELS
// ============================================

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'adaptive'

interface DifficultySettings {
  timeLimit: number // Seconds per item
  attemptsBeforeHint: number
  showHints: boolean
  repeatOnError: boolean
  errorTolerance: number // 0-1, higher = more forgiving
}

const DIFFICULTY_PRESETS: Record<DifficultyLevel, DifficultySettings> = {
  easy: {
    timeLimit: 30,
    attemptsBeforeHint: 1,
    showHints: true,
    repeatOnError: true,
    errorTolerance: 0.8,
  },
  medium: {
    timeLimit: 20,
    attemptsBeforeHint: 2,
    showHints: true,
    repeatOnError: true,
    errorTolerance: 0.7,
  },
  hard: {
    timeLimit: 10,
    attemptsBeforeHint: 3,
    showHints: false,
    repeatOnError: false,
    errorTolerance: 0.6,
  },
  adaptive: {
    timeLimit: 20,
    attemptsBeforeHint: 2,
    showHints: true,
    repeatOnError: true,
    errorTolerance: 0.7,
  },
}

// ============================================
// REVIEW ITEM TRACKING
// ============================================

export interface ReviewItem {
  itemId: string
  drillType: DrillType
  lessonId: string
  phaseId: string
  lastReviewDate: number
  nextReviewDate: number
  reviewCount: number
  consecutiveCorrect: number
  accuracy: number
  difficulty: DifficultyLevel
  isOverdue: boolean
}

export interface SpiralReviewState {
  items: Map<string, ReviewItem>
  lastUpdated: number
}

// ============================================
// CORE FUNCTIONS
// ============================================

/**
 * Calculate when an item should next be reviewed based on performance
 */
export function calculateNextReviewDate(
  lastReviewDate: number,
  consecutiveCorrect: number,
  accuracy: number
): number {
  // Determine interval index based on consecutive correct answers
  const intervalIndex = Math.min(consecutiveCorrect, REVIEW_INTERVALS.length - 1)
  let intervalDays = REVIEW_INTERVALS[intervalIndex]

  // Adjust interval based on accuracy
  if (accuracy < 70) {
    // Struggling - review sooner
    intervalDays = Math.max(1, Math.floor(intervalDays * 0.5))
  } else if (accuracy >= 95) {
    // Excellent - can wait longer
    intervalDays = Math.floor(intervalDays * 1.5)
  }

  return lastReviewDate + (intervalDays * 24 * 60 * 60 * 1000)
}

/**
 * Get items that are due for review (overdue or due today)
 */
export function getItemsDueForReview(
  reviewState: SpiralReviewState,
  maxItems: number = 10
): ReviewItem[] {
  const now = Date.now()
  const dueItems: ReviewItem[] = []

  reviewState.items.forEach((item) => {
    if (item.nextReviewDate <= now) {
      dueItems.push({ ...item, isOverdue: true })
    }
  })

  // Sort by: 1) Most overdue first, 2) Lowest accuracy
  dueItems.sort((a, b) => {
    const overdueA = now - a.nextReviewDate
    const overdueB = now - b.nextReviewDate
    if (Math.abs(overdueA - overdueB) > 24 * 60 * 60 * 1000) {
      return overdueB - overdueA
    }
    return a.accuracy - b.accuracy
  })

  return dueItems.slice(0, maxItems)
}

/**
 * Get items that need immediate reteaching (very low accuracy)
 */
export function getUrgentReteachItems(
  attempts: DrillAttempt[],
  threshold: number = 50
): string[] {
  const itemStats = new Map<string, { correct: number; total: number }>()

  attempts.forEach(attempt => {
    const stats = itemStats.get(attempt.itemId) || { correct: 0, total: 0 }
    stats.total++
    if (attempt.correct) stats.correct++
    itemStats.set(attempt.itemId, stats)
  })

  const urgent: string[] = []
  itemStats.forEach((stats, itemId) => {
    const accuracy = (stats.correct / stats.total) * 100
    if (accuracy < threshold && stats.total >= 3) {
      urgent.push(itemId)
    }
  })

  return urgent
}

/**
 * Update review item after an attempt
 */
export function updateReviewItem(
  item: ReviewItem,
  wasCorrect: boolean,
  attempts: DrillAttempt[]
): ReviewItem {
  const now = Date.now()
  const itemAttempts = attempts.filter(a => a.itemId === item.itemId)
  const accuracy = calculateAccuracy(itemAttempts)

  const newConsecutive = wasCorrect ? item.consecutiveCorrect + 1 : 0

  return {
    ...item,
    lastReviewDate: now,
    nextReviewDate: calculateNextReviewDate(now, newConsecutive, accuracy),
    reviewCount: item.reviewCount + 1,
    consecutiveCorrect: newConsecutive,
    accuracy,
    isOverdue: false,
  }
}

/**
 * Create a new review item from a drill attempt
 */
export function createReviewItem(
  itemId: string,
  drillType: DrillType,
  lessonId: string,
  phaseId: string,
  accuracy: number
): ReviewItem {
  const now = Date.now()

  return {
    itemId,
    drillType,
    lessonId,
    phaseId,
    lastReviewDate: now,
    nextReviewDate: calculateNextReviewDate(now, 0, accuracy),
    reviewCount: 1,
    consecutiveCorrect: accuracy >= 80 ? 1 : 0,
    accuracy,
    difficulty: 'adaptive',
    isOverdue: false,
  }
}

// ============================================
// ADAPTIVE DIFFICULTY
// ============================================

/**
 * Calculate adaptive difficulty based on recent performance
 */
export function calculateAdaptiveDifficulty(
  recentAttempts: DrillAttempt[],
  windowSize: number = 10
): DifficultySettings {
  const recent = recentAttempts.slice(-windowSize)

  if (recent.length < 3) {
    // Not enough data - use medium
    return { ...DIFFICULTY_PRESETS.medium }
  }

  const accuracy = calculateAccuracy(recent)
  const avgResponseTime = calculateAverageResponseTime(recent)

  // Start with medium and adjust
  const settings = { ...DIFFICULTY_PRESETS.medium }

  if (accuracy >= 90) {
    // Doing great - increase challenge
    settings.timeLimit = Math.max(10, settings.timeLimit - 5)
    settings.attemptsBeforeHint = Math.min(4, settings.attemptsBeforeHint + 1)
    settings.errorTolerance = Math.max(0.5, settings.errorTolerance - 0.1)
  } else if (accuracy >= 80) {
    // Good performance - slight increase
    settings.timeLimit = Math.max(15, settings.timeLimit - 2)
  } else if (accuracy < 60) {
    // Struggling - make easier
    settings.timeLimit = Math.min(45, settings.timeLimit + 10)
    settings.attemptsBeforeHint = Math.max(1, settings.attemptsBeforeHint - 1)
    settings.showHints = true
    settings.repeatOnError = true
    settings.errorTolerance = Math.min(0.9, settings.errorTolerance + 0.1)
  } else if (accuracy < 70) {
    // Below threshold - slightly easier
    settings.timeLimit = Math.min(30, settings.timeLimit + 5)
    settings.showHints = true
  }

  // Adjust for response time if available
  if (avgResponseTime > 0) {
    if (avgResponseTime < 2000 && accuracy >= 85) {
      // Fast and accurate - increase challenge
      settings.timeLimit = Math.max(8, settings.timeLimit - 3)
    } else if (avgResponseTime > 10000) {
      // Taking too long - give more time
      settings.timeLimit = Math.min(45, settings.timeLimit + 10)
    }
  }

  return settings
}

function calculateAverageResponseTime(attempts: DrillAttempt[]): number {
  const withTime = attempts.filter(a => a.responseTime && a.responseTime > 0)
  if (withTime.length === 0) return 0

  const total = withTime.reduce((sum, a) => sum + (a.responseTime || 0), 0)
  return total / withTime.length
}

/**
 * Get difficulty preset
 */
export function getDifficultySettings(level: DifficultyLevel): DifficultySettings {
  return { ...DIFFICULTY_PRESETS[level] }
}

// ============================================
// LESSON ENHANCEMENT WITH REVIEW
// ============================================

export interface EnhancedLessonPlan {
  newItems: string[] // New content to learn
  reviewItems: string[] // Items due for review
  reteachItems: string[] // Items that need reteaching
  totalItems: number
  estimatedMinutes: number
}

/**
 * Generate an enhanced lesson plan that includes review items
 */
export function generateEnhancedLessonPlan(
  newLessonItems: string[],
  reviewState: SpiralReviewState,
  attempts: DrillAttempt[],
  options?: {
    maxReviewItems?: number
    maxReteachItems?: number
    includeReview?: boolean
  }
): EnhancedLessonPlan {
  const {
    maxReviewItems = 5,
    maxReteachItems = 3,
    includeReview = true,
  } = options || {}

  let reviewItems: string[] = []
  let reteachItems: string[] = []

  if (includeReview) {
    // Get items due for review
    const dueItems = getItemsDueForReview(reviewState, maxReviewItems)
    reviewItems = dueItems.map(item => item.itemId)

    // Get items that urgently need reteaching
    reteachItems = getUrgentReteachItems(attempts, 50).slice(0, maxReteachItems)

    // Remove duplicates
    reviewItems = reviewItems.filter(id => !reteachItems.includes(id))
  }

  const totalItems = newLessonItems.length + reviewItems.length + reteachItems.length

  // Estimate time: ~30 seconds per item on average
  const estimatedMinutes = Math.ceil((totalItems * 30) / 60)

  return {
    newItems: newLessonItems,
    reviewItems,
    reteachItems,
    totalItems,
    estimatedMinutes,
  }
}

/**
 * Interleave review items with new content
 * Pattern: 2 new items, 1 review item (maintains engagement)
 */
export function interleaveItems(plan: EnhancedLessonPlan): string[] {
  const result: string[] = []
  const { newItems, reviewItems, reteachItems } = plan

  // Start with reteach items (highest priority)
  result.push(...reteachItems)

  // Interleave new and review items
  let newIndex = 0
  let reviewIndex = 0

  while (newIndex < newItems.length || reviewIndex < reviewItems.length) {
    // Add 2 new items
    for (let i = 0; i < 2 && newIndex < newItems.length; i++) {
      result.push(newItems[newIndex++])
    }

    // Add 1 review item
    if (reviewIndex < reviewItems.length) {
      result.push(reviewItems[reviewIndex++])
    }
  }

  return result
}

// ============================================
// MASTERY DECAY
// ============================================

/**
 * Check for mastered items that need maintenance review
 */
export function getMasteryMaintenanceItems(
  reviewState: SpiralReviewState,
  maxItems: number = 3
): ReviewItem[] {
  const now = Date.now()
  const decayThreshold = now - (MASTERY_DECAY_DAYS * 24 * 60 * 60 * 1000)

  const needsMaintenance: ReviewItem[] = []

  reviewState.items.forEach((item) => {
    // Only check items with high mastery
    if (item.accuracy >= 85 && item.consecutiveCorrect >= 3) {
      // Check if it's been too long since last review
      if (item.lastReviewDate < decayThreshold) {
        needsMaintenance.push(item)
      }
    }
  })

  // Sort by oldest last review
  needsMaintenance.sort((a, b) => a.lastReviewDate - b.lastReviewDate)

  return needsMaintenance.slice(0, maxItems)
}

// ============================================
// PROGRESS INSIGHTS
// ============================================

export interface LearningInsights {
  strongAreas: string[] // Item IDs with high mastery
  weakAreas: string[] // Item IDs needing work
  consistencyScore: number // 0-100, how consistent the learner is
  retentionRate: number // 0-100, how well they retain learned material
  recommendedFocus: string[] // Suggested areas to focus on
  streakDays: number // Consecutive days of practice
}

/**
 * Generate learning insights from progress data
 */
export function generateLearningInsights(
  attempts: DrillAttempt[],
  reviewState: SpiralReviewState
): LearningInsights {
  const itemStats = new Map<string, { correct: number; total: number; timestamps: number[] }>()

  // Analyze all attempts
  attempts.forEach(attempt => {
    const stats = itemStats.get(attempt.itemId) || { correct: 0, total: 0, timestamps: [] }
    stats.total++
    if (attempt.correct) stats.correct++
    stats.timestamps.push(attempt.timestamp)
    itemStats.set(attempt.itemId, stats)
  })

  // Categorize items
  const strongAreas: string[] = []
  const weakAreas: string[] = []

  itemStats.forEach((stats, itemId) => {
    const accuracy = (stats.correct / stats.total) * 100
    if (accuracy >= 90 && stats.total >= 5) {
      strongAreas.push(itemId)
    } else if (accuracy < 70 && stats.total >= 3) {
      weakAreas.push(itemId)
    }
  })

  // Calculate consistency (practice frequency)
  const practiceDays = new Set(
    attempts.map(a => new Date(a.timestamp).toDateString())
  )
  const consistencyScore = Math.min(100, (practiceDays.size / 7) * 100)

  // Calculate retention rate (accuracy on review items)
  let retentionCorrect = 0
  let retentionTotal = 0
  reviewState.items.forEach((item) => {
    if (item.reviewCount > 1) {
      retentionTotal++
      if (item.accuracy >= 80) retentionCorrect++
    }
  })
  const retentionRate = retentionTotal > 0
    ? Math.round((retentionCorrect / retentionTotal) * 100)
    : 100

  // Calculate streak
  const streakDays = calculateStreak(attempts)

  // Recommended focus
  const recommendedFocus = weakAreas.slice(0, 5)

  return {
    strongAreas,
    weakAreas,
    consistencyScore: Math.round(consistencyScore),
    retentionRate,
    recommendedFocus,
    streakDays,
  }
}

function calculateStreak(attempts: DrillAttempt[]): number {
  if (attempts.length === 0) return 0

  const days = new Set(
    attempts.map(a => new Date(a.timestamp).toDateString())
  )
  const sortedDays = Array.from(days).sort((a, b) =>
    new Date(b).getTime() - new Date(a).getTime()
  )

  let streak = 0
  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  for (const dayStr of sortedDays) {
    const day = new Date(dayStr)
    day.setHours(0, 0, 0, 0)

    const diffDays = Math.floor(
      (currentDate.getTime() - day.getTime()) / (24 * 60 * 60 * 1000)
    )

    if (diffDays <= 1) {
      streak++
      currentDate = day
    } else {
      break
    }
  }

  return streak
}
