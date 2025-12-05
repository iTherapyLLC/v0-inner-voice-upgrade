"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Trophy, TrendingUp, Lock, CheckCircle, Star } from "lucide-react"
import { useLiteracyStore } from "@/lib/literacy-store"
import { curriculum } from "@/lib/literacy/curriculum"
import { cn } from "@/lib/utils"

export default function LiteracyPage() {
  const { progress, getPhaseProgress } = useLiteracyStore()

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-primary">Lightspeed Literacy</h1>
          <div className="w-24" /> {/* Spacer */}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Welcome Section */}
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Welcome to Reading Adventures!</h2>
          <p className="text-gray-600 text-lg mb-6">
            Learn to read with fun, multi-sensory activities designed by reading specialists
          </p>
          
          {/* Progress Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
              <Trophy className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-green-700">
                {Object.values(progress.phases).filter(p => p.completed).length}
              </div>
              <div className="text-xs text-green-600">Phases Done</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
              <Star className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-blue-700">
                {Object.values(progress.phases)
                  .flatMap(p => Object.values(p.lessons))
                  .filter(l => l.masteryAchieved).length}
              </div>
              <div className="text-xs text-blue-600">Skills Mastered</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
              <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-purple-700">
                {curriculum.phases.length}
              </div>
              <div className="text-xs text-purple-600">Total Phases</div>
            </div>
          </div>
        </div>

        {/* Curriculum Phases */}
        <div className="space-y-6">
          {curriculum.phases.map((phase, index) => {
            const phaseProgress = getPhaseProgress(phase.id)
            const isUnlocked = phaseProgress?.unlocked || index === 0
            const isCompleted = phaseProgress?.completed || false
            const lessonsCompleted = phaseProgress
              ? Object.values(phaseProgress.lessons).filter(l => l.completed).length
              : 0
            const totalLessons = phase.lessons.length

            return (
              <div
                key={phase.id}
                className={cn(
                  "bg-white rounded-2xl shadow-md overflow-hidden transition-all",
                  isUnlocked ? "hover:shadow-lg" : "opacity-60"
                )}
              >
                <div
                  className={cn(
                    "p-6",
                    isUnlocked
                      ? "bg-gradient-to-r from-primary/10 to-secondary/10"
                      : "bg-gray-100"
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold text-gray-500">PHASE {phase.number}</span>
                        {isCompleted && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        {!isUnlocked && (
                          <Lock className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{phase.title}</h3>
                      <p className="text-gray-600">{phase.description}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {isUnlocked && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>{lessonsCompleted} of {totalLessons} lessons completed</span>
                        <span>{totalLessons > 0 ? Math.round((lessonsCompleted / totalLessons) * 100) : 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                          style={{ width: `${totalLessons > 0 ? (lessonsCompleted / totalLessons) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Lessons */}
                  {isUnlocked && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      {phase.lessons.map((lesson, lessonIndex) => {
                        const lessonProgress = phaseProgress?.lessons[lesson.id]
                        const lessonCompleted = lessonProgress?.completed || false
                        const lessonMastered = lessonProgress?.masteryAchieved || false

                        return (
                          <Link
                            key={lesson.id}
                            href={`/literacy/lesson/${lesson.id}`}
                            className={cn(
                              "block p-4 rounded-xl border-2 transition-all",
                              lessonCompleted
                                ? "border-green-300 bg-green-50 hover:bg-green-100"
                                : "border-gray-200 bg-white hover:border-primary hover:bg-primary/5"
                            )}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-bold text-gray-500">
                                    LESSON {lessonIndex + 1}
                                  </span>
                                  {lessonMastered && (
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                  )}
                                  {lessonCompleted && !lessonMastered && (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  )}
                                </div>
                                <h4 className="font-bold text-gray-800">{lesson.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  )}

                  {!isUnlocked && (
                    <div className="text-center py-4">
                      <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">
                        Complete previous phases to unlock
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Complete each lesson to unlock the next phase</p>
          <p className="mt-1">All activities are designed for multi-sensory learning</p>
        </div>
      </main>
    </div>
  )
}
