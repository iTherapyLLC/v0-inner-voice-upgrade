"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  LiteracyProgress,
  PhaseProgress,
  LessonProgress,
  DrillProgress,
  DrillAttempt,
  DrillType,
} from "@/types/literacy"
import { calculateAccuracy, isMasteryAchieved } from "./literacy/mastery"

interface LiteracyState {
  progress: LiteracyProgress
  recordAttempt: (lessonId: string, drillType: DrillType, attempt: DrillAttempt) => void
  completeDrill: (lessonId: string, drillType: DrillType) => void
  completeLesson: (lessonId: string) => void
  unlockPhase: (phaseId: string) => void
  setCurrentLesson: (phaseId: string, lessonId: string) => void
  getDrillProgress: (lessonId: string, drillType: DrillType) => DrillProgress | undefined
  getLessonProgress: (lessonId: string) => LessonProgress | undefined
  getPhaseProgress: (phaseId: string) => PhaseProgress | undefined
  resetProgress: () => void
}

const initialProgress: LiteracyProgress = {
  phases: {
    "phase-1": {
      phaseId: "phase-1",
      lessons: {},
      completed: false,
      masteryAchieved: false,
      unlocked: true, // Phase 1 is always unlocked
    },
  },
  currentPhaseId: "phase-1",
  currentLessonId: "lesson-1-1",
  totalTimeSpent: 0,
  lastActivity: Date.now(),
}

export const useLiteracyStore = create<LiteracyState>()(
  persist(
    (set, get) => ({
      progress: initialProgress,

      recordAttempt: (lessonId: string, drillType: DrillType, attempt: DrillAttempt) => {
        set((state) => {
          const newProgress = { ...state.progress }
          
          // Find the lesson's phase
          let phaseId: string | null = null
          Object.keys(newProgress.phases).forEach((pid) => {
            if (newProgress.phases[pid].lessons[lessonId]) {
              phaseId = pid
            }
          })
          
          if (!phaseId) return state
          
          // Ensure phase exists
          if (!newProgress.phases[phaseId]) {
            newProgress.phases[phaseId] = {
              phaseId,
              lessons: {},
              completed: false,
              masteryAchieved: false,
              unlocked: true,
            }
          }
          
          // Ensure lesson exists
          if (!newProgress.phases[phaseId].lessons[lessonId]) {
            newProgress.phases[phaseId].lessons[lessonId] = {
              lessonId,
              drills: {},
              completed: false,
              masteryAchieved: false,
              startedAt: Date.now(),
            }
          }
          
          const lesson = newProgress.phases[phaseId].lessons[lessonId]
          
          // Ensure drill exists
          if (!lesson.drills[drillType]) {
            lesson.drills[drillType] = {
              drillType,
              lessonId,
              attempts: [],
              completed: false,
              masteryAchieved: false,
              accuracy: 0,
              lastAttempt: Date.now(),
            }
          }
          
          // Add attempt
          const drill = lesson.drills[drillType]
          drill.attempts.push(attempt)
          drill.lastAttempt = Date.now()
          drill.accuracy = calculateAccuracy(drill.attempts)
          drill.masteryAchieved = isMasteryAchieved(drillType, drill.attempts)
          
          newProgress.lastActivity = Date.now()
          
          return { progress: newProgress }
        })
      },

      completeDrill: (lessonId: string, drillType: DrillType) => {
        set((state) => {
          const newProgress = { ...state.progress }
          
          // Find the lesson's phase
          let phaseId: string | null = null
          Object.keys(newProgress.phases).forEach((pid) => {
            if (newProgress.phases[pid].lessons[lessonId]) {
              phaseId = pid
            }
          })
          
          if (!phaseId) return state
          
          const lesson = newProgress.phases[phaseId].lessons[lessonId]
          if (lesson?.drills[drillType]) {
            lesson.drills[drillType].completed = true
          }
          
          return { progress: newProgress }
        })
      },

      completeLesson: (lessonId: string) => {
        set((state) => {
          const newProgress = { ...state.progress }
          
          // Find the lesson's phase
          let phaseId: string | null = null
          Object.keys(newProgress.phases).forEach((pid) => {
            if (newProgress.phases[pid].lessons[lessonId]) {
              phaseId = pid
            }
          })
          
          if (!phaseId) return state
          
          const lesson = newProgress.phases[phaseId].lessons[lessonId]
          if (lesson) {
            lesson.completed = true
            lesson.completedAt = Date.now()
            
            // Check if all drills are mastered
            const allDrillsMastered = Object.values(lesson.drills).every(
              (drill) => drill.masteryAchieved
            )
            lesson.masteryAchieved = allDrillsMastered
          }
          
          return { progress: newProgress }
        })
      },

      unlockPhase: (phaseId: string) => {
        set((state) => {
          const newProgress = { ...state.progress }
          
          if (!newProgress.phases[phaseId]) {
            newProgress.phases[phaseId] = {
              phaseId,
              lessons: {},
              completed: false,
              masteryAchieved: false,
              unlocked: true,
            }
          } else {
            newProgress.phases[phaseId].unlocked = true
          }
          
          return { progress: newProgress }
        })
      },

      setCurrentLesson: (phaseId: string, lessonId: string) => {
        set((state) => ({
          progress: {
            ...state.progress,
            currentPhaseId: phaseId,
            currentLessonId: lessonId,
          },
        }))
      },

      getDrillProgress: (lessonId: string, drillType: DrillType) => {
        const state = get()
        
        // Find the lesson's phase
        let phaseId: string | null = null
        Object.keys(state.progress.phases).forEach((pid) => {
          if (state.progress.phases[pid].lessons[lessonId]) {
            phaseId = pid
          }
        })
        
        if (!phaseId) return undefined
        
        return state.progress.phases[phaseId].lessons[lessonId]?.drills[drillType]
      },

      getLessonProgress: (lessonId: string) => {
        const state = get()
        
        // Find the lesson's phase
        let phaseId: string | null = null
        Object.keys(state.progress.phases).forEach((pid) => {
          if (state.progress.phases[pid].lessons[lessonId]) {
            phaseId = pid
          }
        })
        
        if (!phaseId) return undefined
        
        return state.progress.phases[phaseId].lessons[lessonId]
      },

      getPhaseProgress: (phaseId: string) => {
        return get().progress.phases[phaseId]
      },

      resetProgress: () => {
        set({ progress: initialProgress })
      },
    }),
    {
      name: "literacy-progress",
      partialize: (state) => ({ progress: state.progress }),
    }
  )
)
