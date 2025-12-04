// Mastery calculation logic for Lightspeed Literacy

import type { DrillAttempt, DrillProgress, DrillType } from "@/types/literacy"
import { MASTERY_THRESHOLDS, CONSECUTIVE_CORRECT_REQUIRED } from "@/types/literacy"

/**
 * Calculate accuracy percentage from attempts
 */
export function calculateAccuracy(attempts: DrillAttempt[]): number {
  if (attempts.length === 0) return 0
  
  const correct = attempts.filter(a => a.correct).length
  return Math.round((correct / attempts.length) * 100)
}

/**
 * Check if mastery threshold is met for a drill type
 */
export function isMasteryAchieved(
  drillType: DrillType,
  attempts: DrillAttempt[]
): boolean {
  if (attempts.length < CONSECUTIVE_CORRECT_REQUIRED) return false
  
  // Check for consecutive correct answers
  const lastAttempts = attempts.slice(-CONSECUTIVE_CORRECT_REQUIRED)
  const allCorrect = lastAttempts.every(a => a.correct)
  
  if (!allCorrect) return false
  
  // Check overall accuracy threshold
  const accuracy = calculateAccuracy(attempts)
  const threshold = MASTERY_THRESHOLDS[drillType]
  
  return accuracy >= threshold
}

/**
 * Get items that need reteaching (failed attempts)
 */
export function getItemsForReteaching(
  attempts: DrillAttempt[],
  allItemIds: string[]
): string[] {
  const itemAccuracy = new Map<string, { correct: number; total: number }>()
  
  // Calculate per-item accuracy
  attempts.forEach(attempt => {
    const stats = itemAccuracy.get(attempt.itemId) || { correct: 0, total: 0 }
    stats.total++
    if (attempt.correct) stats.correct++
    itemAccuracy.set(attempt.itemId, stats)
  })
  
  // Return items with less than 70% accuracy or not yet attempted
  const needReteaching: string[] = []
  
  allItemIds.forEach(itemId => {
    const stats = itemAccuracy.get(itemId)
    if (!stats || (stats.correct / stats.total) < 0.7) {
      needReteaching.push(itemId)
    }
  })
  
  return needReteaching
}

/**
 * Calculate recommended practice items (spiral review)
 */
export function getReviewItems(
  attempts: DrillAttempt[],
  allItemIds: string[],
  maxItems: number = 5
): string[] {
  const itemStats = new Map<string, { 
    correct: number
    total: number
    lastAttempt: number 
  }>()
  
  // Analyze each item's performance
  attempts.forEach(attempt => {
    const stats = itemStats.get(attempt.itemId) || { 
      correct: 0, 
      total: 0, 
      lastAttempt: 0 
    }
    stats.total++
    if (attempt.correct) stats.correct++
    stats.lastAttempt = Math.max(stats.lastAttempt, attempt.timestamp)
    itemStats.set(attempt.itemId, stats)
  })
  
  // Sort by: 1) lowest accuracy, 2) oldest last attempt
  const sorted = allItemIds
    .map(itemId => {
      const stats = itemStats.get(itemId) || { correct: 0, total: 0, lastAttempt: 0 }
      const accuracy = stats.total > 0 ? stats.correct / stats.total : 0
      return { itemId, accuracy, lastAttempt: stats.lastAttempt }
    })
    .sort((a, b) => {
      // Prioritize lower accuracy
      if (Math.abs(a.accuracy - b.accuracy) > 0.1) {
        return a.accuracy - b.accuracy
      }
      // Then by staleness (older items first)
      return a.lastAttempt - b.lastAttempt
    })
  
  return sorted.slice(0, maxItems).map(item => item.itemId)
}

/**
 * Check if a lesson is unlocked based on prerequisites
 */
export function isLessonUnlocked(
  lessonId: string,
  prerequisites: string[] | undefined,
  completedLessons: Set<string>
): boolean {
  if (!prerequisites || prerequisites.length === 0) return true
  
  return prerequisites.every(prereqId => completedLessons.has(prereqId))
}

/**
 * Calculate overall progress statistics
 */
export function calculateProgressStats(drillProgresses: DrillProgress[]): {
  totalAttempts: number
  totalCorrect: number
  overallAccuracy: number
  masteredDrills: number
} {
  let totalAttempts = 0
  let totalCorrect = 0
  let masteredDrills = 0
  
  drillProgresses.forEach(drill => {
    totalAttempts += drill.attempts.length
    totalCorrect += drill.attempts.filter(a => a.correct).length
    if (drill.masteryAchieved) masteredDrills++
  })
  
  const overallAccuracy = totalAttempts > 0 
    ? Math.round((totalCorrect / totalAttempts) * 100)
    : 0
  
  return {
    totalAttempts,
    totalCorrect,
    overallAccuracy,
    masteredDrills,
  }
}
