"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  BookOpen,
  Target,
  TrendingUp,
  AlertCircle,
  Flame,
  Clock,
  Star,
  RefreshCw,
  Brain,
  Zap,
} from "lucide-react"
import { useLiteracyStore } from "@/lib/literacy-store"
import { curriculum } from "@/lib/literacy/curriculum"
import { calculateProgressStats, getItemsForReteaching } from "@/lib/literacy/mastery"
import { generateLearningInsights, type LearningInsights } from "@/lib/literacy/spiral-review"
import { useMemo } from "react"

export default function DashboardPage() {
  const { progress } = useLiteracyStore()

  // Calculate overall stats
  const allDrills = Object.values(progress.phases)
    .flatMap(phase => Object.values(phase.lessons))
    .flatMap(lesson => Object.values(lesson.drills))

  const allAttempts = allDrills.flatMap(drill => drill.attempts)

  const stats = calculateProgressStats(allDrills)

  // Generate learning insights
  const insights = useMemo<LearningInsights>(() => {
    // Create a mock review state for insights calculation
    const mockReviewState = {
      items: new Map(),
      lastUpdated: Date.now(),
    }
    return generateLearningInsights(allAttempts, mockReviewState)
  }, [allAttempts])

  // Calculate estimated time to complete current phase
  const currentPhase = curriculum.phases.find(p => p.id === progress.currentPhaseId)
  const completedLessonsInPhase = currentPhase
    ? Object.keys(progress.phases[progress.currentPhaseId]?.lessons || {}).filter(
        lessonId => progress.phases[progress.currentPhaseId]?.lessons[lessonId]?.completed
      ).length
    : 0
  const totalLessonsInPhase = currentPhase?.lessons.length || 0
  const remainingLessons = totalLessonsInPhase - completedLessonsInPhase
  const estimatedMinutesPerLesson = 10 // Average
  const estimatedTimeRemaining = remainingLessons * estimatedMinutesPerLesson

  // Get items that need reteaching
  const needsWork: { lessonId: string; lessonTitle: string; items: string[] }[] = []
  
  Object.values(progress.phases).forEach(phase => {
    Object.entries(phase.lessons).forEach(([lessonId, lesson]) => {
      const lessonInfo = curriculum.phases
        .flatMap(p => p.lessons)
        .find(l => l.id === lessonId)
      
      if (lessonInfo) {
        Object.values(lesson.drills).forEach(drill => {
          const drillConfig = lessonInfo.drills.find(d => d.type === drill.drillType)
          if (drillConfig) {
            const allItemIds = drillConfig.items.map(i => i.id)
            const reteachItems = getItemsForReteaching(drill.attempts, allItemIds)
            if (reteachItems.length > 0) {
              needsWork.push({
                lessonId,
                lessonTitle: lessonInfo.title,
                items: reteachItems,
              })
            }
          }
        })
      }
    })
  })

  // Calculate last activity date
  const lastActivityDate = progress.lastActivity
    ? new Date(progress.lastActivity).toLocaleDateString()
    : "Never"

  const totalTimeMinutes = Math.floor(progress.totalTimeSpent / 60000)

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/literacy" className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            Back to Literacy
          </Link>
          <h1 className="text-2xl font-bold text-primary">Parent Dashboard</h1>
          <div className="w-24" /> {/* Spacer */}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Practice</div>
                <div className="text-2xl font-bold text-gray-800">{stats.totalAttempts}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Questions answered across all lessons
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Overall Accuracy</div>
                <div className="text-2xl font-bold text-gray-800">{stats.overallAccuracy}%</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Average across all drill types
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Skills Mastered</div>
                <div className="text-2xl font-bold text-gray-800">{stats.masteredDrills}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Drills completed with mastery
            </div>
          </div>
        </div>

        {/* Streak & Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-2xl p-4 text-center">
            <Flame className="w-8 h-8 mx-auto mb-2" />
            <div className="text-3xl font-bold">{insights.streakDays}</div>
            <div className="text-sm opacity-90">Day Streak</div>
          </div>

          <div className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white rounded-2xl p-4 text-center">
            <Brain className="w-8 h-8 mx-auto mb-2" />
            <div className="text-3xl font-bold">{insights.retentionRate}%</div>
            <div className="text-sm opacity-90">Retention</div>
          </div>

          <div className="bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-2xl p-4 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2" />
            <div className="text-3xl font-bold">{insights.consistencyScore}%</div>
            <div className="text-sm opacity-90">Consistency</div>
          </div>

          <div className="bg-gradient-to-br from-purple-400 to-pink-500 text-white rounded-2xl p-4 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2" />
            <div className="text-3xl font-bold">{estimatedTimeRemaining}</div>
            <div className="text-sm opacity-90">Min to Phase End</div>
          </div>
        </div>

        {/* Learning Insights */}
        {(insights.strongAreas.length > 0 || insights.weakAreas.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {insights.strongAreas.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-md border-l-4 border-green-500">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-green-500" />
                  <h3 className="font-bold text-gray-800">Strong Areas</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {insights.strongAreas.slice(0, 8).map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                    >
                      {item}
                    </span>
                  ))}
                  {insights.strongAreas.length > 8 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                      +{insights.strongAreas.length - 8} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {insights.weakAreas.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-md border-l-4 border-orange-500">
                <div className="flex items-center gap-2 mb-4">
                  <RefreshCw className="w-5 h-5 text-orange-500" />
                  <h3 className="font-bold text-gray-800">Needs More Practice</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {insights.weakAreas.slice(0, 8).map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                    >
                      {item}
                    </span>
                  ))}
                  {insights.weakAreas.length > 8 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                      +{insights.weakAreas.length - 8} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Activity Summary */}
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Activity Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">Last Activity</div>
              <div className="text-xl font-bold text-gray-800">{lastActivityDate}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Time Spent</div>
              <div className="text-xl font-bold text-gray-800">{totalTimeMinutes} minutes</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600 mb-1">Current Phase</div>
              <div className="text-xl font-bold text-gray-800">
                {curriculum.phases.find(p => p.id === progress.currentPhaseId)?.title || "Not Started"}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600 mb-1">Phases Unlocked</div>
              <div className="text-xl font-bold text-gray-800">
                {Object.values(progress.phases).filter(p => p.unlocked).length} of {curriculum.phases.length}
              </div>
            </div>
          </div>
        </div>

        {/* Areas Needing Attention */}
        {needsWork.length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-800">Recommendations for Practice</h2>
            </div>
            
            <div className="space-y-4">
              {needsWork.slice(0, 5).map((item, index) => (
                <div key={index} className="p-4 bg-orange-50 border-2 border-orange-200 rounded-xl">
                  <div className="font-semibold text-gray-800 mb-2">{item.lessonTitle}</div>
                  <div className="text-sm text-gray-600">
                    {item.items.length} item{item.items.length !== 1 ? 's' : ''} need more practice
                  </div>
                  <Link href={`/literacy/lesson/${item.lessonId}`}>
                    <Button size="sm" className="mt-3" variant="outline">
                      Practice This Lesson
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success Message */}
        {needsWork.length === 0 && stats.masteredDrills > 0 && (
          <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-3xl p-8 text-center mb-8">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-2">Excellent Progress!</h3>
            <p className="text-lg">
              All practiced skills are on track. Keep up the great work!
            </p>
          </div>
        )}

        {/* Progress by Drill Type */}
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Progress by Drill Type</h2>
          
          <div className="space-y-4">
            {["visual", "auditory", "blending", "air-writing", "speech-to-text", "text-to-speech"].map(drillType => {
              const drillsOfType = allDrills.filter(d => d.drillType === drillType)
              const masteredOfType = drillsOfType.filter(d => d.masteryAchieved).length
              const totalOfType = drillsOfType.length
              const avgAccuracy = drillsOfType.length > 0
                ? Math.round(drillsOfType.reduce((sum, d) => sum + d.accuracy, 0) / drillsOfType.length)
                : 0

              if (totalOfType === 0) return null

              return (
                <div key={drillType} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-gray-800 capitalize">
                      {drillType.replace("-", " ")} Drill
                    </div>
                    <div className="text-sm text-gray-600">
                      {masteredOfType}/{totalOfType} mastered
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                        style={{ width: `${(masteredOfType / totalOfType) * 100}%` }}
                      />
                    </div>
                    <div className="text-sm font-medium text-gray-600 w-16 text-right">
                      {avgAccuracy}%
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Offline Practice Recommendations */}
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Offline Practice Tips</h2>
          
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Reading Together:</strong> Practice reading CVC words in books and point out patterns you've learned.
            </p>
            <p>
              <strong>Letter Hunt:</strong> Find letters around the house and practice their sounds.
            </p>
            <p>
              <strong>Nonsense Word Game:</strong> Make up silly nonsense words and blend them together - it's great practice!
            </p>
            <p>
              <strong>Air Writing:</strong> Practice writing letters in the air or in sand/shaving cream for kinesthetic learning.
            </p>
            <p>
              <strong>Sound Scavenger Hunt:</strong> Find objects that start with sounds you're learning.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link href="/literacy" className="flex-1">
            <Button size="lg" className="w-full text-lg py-6">
              Back to Learning
            </Button>
          </Link>
          <Link href="/literacy/progress" className="flex-1">
            <Button size="lg" variant="outline" className="w-full text-lg py-6">
              Student View
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
