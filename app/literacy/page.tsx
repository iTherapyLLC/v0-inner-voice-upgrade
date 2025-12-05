"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Trophy, TrendingUp, Lock, CheckCircle, Star, Sparkles } from "lucide-react"
import { useLiteracyStore } from "@/lib/literacy-store"
import { curriculum } from "@/lib/literacy/curriculum"
import { cn } from "@/lib/utils"

export default function LiteracyPage() {
  const { progress, getPhaseProgress } = useLiteracyStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating stars */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            <Star 
              className="text-yellow-200/40" 
              size={12 + Math.random() * 20}
              fill="currentColor"
            />
          </div>
        ))}
        
        {/* Floating letters */}
        {['A', 'B', 'C', 'D', 'E'].map((letter, i) => (
          <div
            key={letter}
            className="absolute text-white/10 font-bold animate-float"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 20}%`,
              fontSize: `${40 + Math.random() * 30}px`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          >
            {letter}
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-purple-200 shadow-lg relative z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-2">
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
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-transparent bg-clip-text animate-gradient">
            ✨ Lightspeed Literacy ✨
          </h1>
          <div className="w-24" /> {/* Spacer */}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        {/* Welcome Section */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 md:p-8 mb-8 text-center border-4 border-white/50 hover:scale-105 transition-transform duration-300">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-full mb-4 animate-pulse-glow">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-transparent bg-clip-text mb-3 animate-bounce-in">
            Welcome to Reading Adventures! 🎉
          </h2>
          <p className="text-gray-700 text-xl mb-6 font-semibold">
            🌟 Learn to read with fun, multi-sensory activities! 🌟
          </p>
          
          {/* Progress Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-2xl p-4 transform hover:scale-110 transition-transform shadow-lg">
              <Trophy className="w-8 h-8 text-white mx-auto mb-2 animate-wiggle" />
              <div className="text-3xl font-bold text-white">
                {Object.values(progress.phases).filter(p => p.completed).length}
              </div>
              <div className="text-xs text-white/90 font-semibold">Phases Done</div>
            </div>
            <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl p-4 transform hover:scale-110 transition-transform shadow-lg">
              <Star className="w-8 h-8 text-white mx-auto mb-2 animate-wiggle" />
              <div className="text-3xl font-bold text-white">
                {Object.values(progress.phases)
                  .flatMap(p => Object.values(p.lessons))
                  .filter(l => l.masteryAchieved).length}
              </div>
              <div className="text-xs text-white/90 font-semibold">Skills Mastered</div>
            </div>
            <div className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl p-4 transform hover:scale-110 transition-transform shadow-lg">
              <Sparkles className="w-8 h-8 text-white mx-auto mb-2 animate-wiggle" />
              <div className="text-3xl font-bold text-white">
                {curriculum.phases.length}
              </div>
              <div className="text-xs text-white/90 font-semibold">Total Phases</div>
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
                  "bg-white/95 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden transition-all border-4",
                  isUnlocked 
                    ? "hover:shadow-2xl hover:scale-105 border-white/50" 
                    : "opacity-60 border-gray-300"
                )}
              >
                <div
                  className={cn(
                    "p-6",
                    isUnlocked
                      ? "bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100"
                      : "bg-gray-100"
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold text-purple-600 bg-white/80 px-3 py-1 rounded-full">
                          ⭐ PHASE {phase.number} ⭐
                        </span>
                        {isCompleted && (
                          <CheckCircle className="w-6 h-6 text-green-500 animate-bounce-in" />
                        )}
                        {!isUnlocked && (
                          <Lock className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <h3 className="text-3xl font-bold text-gray-800 mb-2">{phase.title}</h3>
                      <p className="text-gray-700 text-lg">{phase.description}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {isUnlocked && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-700 mb-2 font-semibold">
                        <span>🎯 {lessonsCompleted} of {totalLessons} lessons completed</span>
                        <span className="text-purple-600 font-bold">{totalLessons > 0 ? Math.round((lessonsCompleted / totalLessons) * 100) : 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                        <div
                          className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 h-3 rounded-full transition-all duration-500 shadow-lg"
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
                              "block p-4 rounded-2xl border-3 transition-all transform hover:scale-105 shadow-md hover:shadow-xl",
                              lessonCompleted
                                ? "border-green-400 bg-gradient-to-br from-green-50 to-green-100"
                                : "border-purple-300 bg-gradient-to-br from-white to-purple-50 hover:border-purple-400"
                            )}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-bold text-purple-600 bg-white px-2 py-1 rounded-full">
                                    📚 LESSON {lessonIndex + 1}
                                  </span>
                                  {lessonMastered && (
                                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 animate-wiggle" />
                                  )}
                                  {lessonCompleted && !lessonMastered && (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                  )}
                                </div>
                                <h4 className="font-bold text-gray-800 text-lg">{lesson.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  )}

                  {!isUnlocked && (
                    <div className="text-center py-6">
                      <Lock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 text-lg font-semibold">
                        🔒 Complete previous phases to unlock! 🔒
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center text-white text-lg font-semibold bg-purple-600/30 backdrop-blur-md rounded-2xl p-4 border-2 border-white/30">
          <p>✨ Complete each lesson to unlock the next phase! ✨</p>
          <p className="mt-1">🎨 All activities are designed for multi-sensory learning 🎨</p>
        </div>
      </main>
    </div>
  )
}
