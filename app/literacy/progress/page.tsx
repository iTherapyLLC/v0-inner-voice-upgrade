"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star, Trophy, TrendingUp, Target, CheckCircle, Clock } from "lucide-react"
import { useLiteracyStore } from "@/lib/literacy-store"
import { curriculum } from "@/lib/literacy/curriculum"
import { calculateProgressStats } from "@/lib/literacy/mastery"
import { cn } from "@/lib/utils"

export default function ProgressPage() {
  const { progress, getPhaseProgress } = useLiteracyStore()

  // Calculate overall stats
  const allDrills = Object.values(progress.phases)
    .flatMap(phase => Object.values(phase.lessons))
    .flatMap(lesson => Object.values(lesson.drills))

  const stats = calculateProgressStats(allDrills)

  const completedPhases = Object.values(progress.phases).filter(p => p.completed).length
  const totalPhases = curriculum.phases.length

  const completedLessons = Object.values(progress.phases)
    .flatMap(phase => Object.values(phase.lessons))
    .filter(lesson => lesson.completed).length

  const totalLessons = curriculum.phases.reduce((sum, phase) => sum + phase.lessons.length, 0)

  // Format time spent
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/literacy" className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            Back to Literacy
          </Link>
          <h1 className="text-2xl font-bold text-primary">Your Progress</h1>
          <div className="w-24" /> {/* Spacer */}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-md text-center">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-800">{completedPhases}</div>
            <div className="text-sm text-gray-600">Phases Complete</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-md text-center">
            <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-800">{stats.masteredDrills}</div>
            <div className="text-sm text-gray-600">Skills Mastered</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-md text-center">
            <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-800">{stats.overallAccuracy}%</div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-md text-center">
            <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-800">{completedLessons}</div>
            <div className="text-sm text-gray-600">Lessons Done</div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Activity Summary</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Total Attempts</div>
                  <div className="text-sm text-gray-600">Practice questions answered</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">{stats.totalAttempts}</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Correct Answers</div>
                  <div className="text-sm text-gray-600">Questions answered correctly</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.totalCorrect}</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Time Spent Learning</div>
                  <div className="text-sm text-gray-600">Total practice time</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {formatTime(progress.totalTimeSpent)}
              </div>
            </div>
          </div>
        </div>

        {/* Phase Progress */}
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Progress by Phase</h2>
          
          <div className="space-y-4">
            {curriculum.phases.map((phase) => {
              const phaseProgress = getPhaseProgress(phase.id)
              const lessonsInPhase = Object.values(phaseProgress?.lessons || {})
              const completedInPhase = lessonsInPhase.filter(l => l.completed).length
              const masteredInPhase = lessonsInPhase.filter(l => l.masteryAchieved).length
              const totalInPhase = phase.lessons.length
              const phaseAccuracy = lessonsInPhase.length > 0
                ? Math.round(
                    lessonsInPhase
                      .flatMap(l => Object.values(l.drills))
                      .reduce((sum, d) => sum + d.accuracy, 0) /
                    lessonsInPhase.flatMap(l => Object.values(l.drills)).length
                  )
                : 0

              return (
                <div
                  key={phase.id}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all",
                    phaseProgress?.completed
                      ? "border-green-300 bg-green-50"
                      : phaseProgress?.unlocked
                      ? "border-gray-200 bg-white"
                      : "border-gray-200 bg-gray-50 opacity-60"
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-500">PHASE {phase.number}</span>
                        {phaseProgress?.completed && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        {masteredInPhase > 0 && (
                          <div className="flex items-center gap-1 text-xs text-yellow-600">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            <span>{masteredInPhase} mastered</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-800">{phase.title}</h3>
                    </div>
                    {phaseProgress && (
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-600">
                          {completedInPhase}/{totalInPhase} lessons
                        </div>
                        {phaseAccuracy > 0 && (
                          <div className="text-xs text-gray-500">{phaseAccuracy}% accuracy</div>
                        )}
                      </div>
                    )}
                  </div>

                  {phaseProgress && totalInPhase > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                        style={{ width: `${(completedInPhase / totalInPhase) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Motivation Message */}
        {stats.overallAccuracy >= 80 && (
          <div className="mt-8 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-2xl p-6 text-center">
            <Star className="w-12 h-12 mx-auto mb-3" />
            <h3 className="text-2xl font-bold mb-2">Outstanding Work!</h3>
            <p className="text-lg">
              You're doing an amazing job! Keep up the great work and you'll be a reading star!
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link href="/literacy" className="flex-1">
            <Button size="lg" className="w-full text-lg py-6">
              Continue Learning
            </Button>
          </Link>
          <Link href="/literacy/dashboard" className="flex-1">
            <Button size="lg" variant="outline" className="w-full text-lg py-6">
              Parent Dashboard
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
