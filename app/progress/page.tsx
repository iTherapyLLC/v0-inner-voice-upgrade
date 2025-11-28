"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Trophy, Star, TrendingUp, Calendar, Sparkles, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function ProgressPage() {
  const { getModelingStats, getMostPracticedPhrases, settings } = useAppStore()
  const [stats, setStats] = useState(getModelingStats())
  const [topPhrases, setTopPhrases] = useState(getMostPracticedPhrases())
  const [showContext, setShowContext] = useState(false)

  useEffect(() => {
    setStats(getModelingStats())
    setTopPhrases(getMostPracticedPhrases())
  }, [getModelingStats, getMostPracticedPhrases])

  // Calculate therapy comparison (2 models per week in therapy = 84 years to match 18-month-old)
  // Average 18-month-old hears ~10,000 words/day, let's say 100 unique phrase models
  // 2 models/week in therapy = 104/year vs ~36,500/year natural exposure
  const therapyModelsPerWeek = 2
  const multiplier = stats.modelsThisWeek > 0 ? Math.round(stats.modelsThisWeek / therapyModelsPerWeek) : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Link href="/communicate">
          <Button variant="ghost" className="mb-4 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Talk
          </Button>
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full mb-4">
            <Trophy className="w-5 h-5" />
            <span className="font-bold">Modeling Progress</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">You're Doing Amazing!</h1>
          <p className="text-muted-foreground">Every model counts toward language learning</p>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Today</span>
            </div>
            <div className="text-4xl font-bold text-primary">{stats.modelsToday}</div>
            <div className="text-sm text-muted-foreground">models</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-secondary/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-secondary" />
              <span className="text-sm font-medium text-muted-foreground">This Week</span>
            </div>
            <div className="text-4xl font-bold text-secondary">{stats.modelsThisWeek}</div>
            <div className="text-sm text-muted-foreground">models</div>
          </div>
        </div>

        {/* Multiplier Card */}
        {multiplier > 0 && (
          <div className="bg-gradient-to-r from-accent to-primary text-white rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-6 h-6" />
              <span className="font-bold text-lg">Amazing Progress!</span>
            </div>
            <p className="text-2xl font-bold mb-1">{multiplier}x more language input than therapy alone!</p>
            <p className="text-white/80 text-sm">
              You've provided {stats.modelsThisWeek} models this week vs. the typical 2 in therapy sessions.
            </p>
          </div>
        )}

        {/* Total Models */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-8 text-center">
          <Star className="w-8 h-8 text-accent mx-auto mb-2" />
          <div className="text-5xl font-bold text-foreground mb-1">{stats.totalModels}</div>
          <div className="text-muted-foreground">Total Models Ever</div>
        </div>

        {/* Top Phrases */}
        {topPhrases.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-md mb-8">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-accent" />
              Most Practiced Phrases
            </h2>
            <div className="space-y-3">
              {topPhrases.map((item, index) => (
                <div key={item.phrase} className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-bold text-white",
                      index === 0 ? "bg-accent" : index === 1 ? "bg-primary" : "bg-secondary",
                    )}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium truncate">{item.phrase}</div>
                    <div className="text-sm text-muted-foreground">{item.count} times</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 84 Year Context (expandable) */}
        <button
          onClick={() => setShowContext(!showContext)}
          className="w-full text-left bg-blue-50 rounded-2xl p-4 border border-blue-200"
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-blue-800">Why does modeling matter?</span>
            <span className="text-blue-600">{showContext ? "−" : "+"}</span>
          </div>
          {showContext && (
            <div className="mt-3 text-sm text-blue-700 space-y-2">
              <p>
                Research shows that AAC users need constant modeling to learn language. If they only see their device
                modeled twice a week in therapy, it would take <strong>84 years</strong> to match the language input a
                typical 18-month-old receives!
              </p>
              <p>
                Every time you model a phrase with InnerVoice, you're closing that gap. The avatar speaks, the button
                highlights, and the picture shows context — that's language learning happening!
              </p>
              <p className="font-medium">You're making a real difference. Keep going!</p>
            </div>
          )}
        </button>

        {/* Mode Status */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-md">
          <h2 className="font-bold text-lg mb-4">Current Settings</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Watch First Mode</span>
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium",
                  settings.watchFirstMode ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600",
                )}
              >
                {settings.watchFirstMode ? "ON" : "OFF"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Modeling Mode (Slower Speech)</span>
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium",
                  settings.modelingMode ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600",
                )}
              >
                {settings.modelingMode ? "ON" : "OFF"}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Tell your helper "turn on watch first mode" or "turn on modeling mode" to change these!
          </p>
        </div>
      </main>
    </div>
  )
}
