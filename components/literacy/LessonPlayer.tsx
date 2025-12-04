"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, CheckCircle, Sparkles, Star } from "lucide-react"
import type { Lesson } from "@/types/literacy"
import { VisualDrill } from "@/components/literacy/drills/VisualDrill"
import { BlendingDrill } from "@/components/literacy/drills/BlendingDrill"
import { AuditoryDrill } from "@/components/literacy/drills/AuditoryDrill"
import { AirWritingDrill } from "@/components/literacy/drills/AirWritingDrill"
import { TextToSpeechDrill } from "@/components/literacy/drills/TextToSpeechDrill"
import { useLiteracyStore } from "@/lib/literacy-store"

interface LessonPlayerProps {
  lesson: Lesson
}

export function LessonPlayer({ lesson }: LessonPlayerProps) {
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0)
  const [completed, setCompleted] = useState(false)
  const router = useRouter()
  const { completeDrill, completeLesson, getDrillProgress } = useLiteracyStore()

  const currentDrill = lesson.drills[currentDrillIndex]

  const handleDrillComplete = () => {
    completeDrill(lesson.id, currentDrill.type)

    if (currentDrillIndex < lesson.drills.length - 1) {
      setCurrentDrillIndex((prev) => prev + 1)
    } else {
      completeLesson(lesson.id)
      setCompleted(true)
    }
  }

  const handleBackToLiteracy = () => {
    router.push("/literacy")
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Decorative floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-amber-200/40 rounded-full blur-2xl animate-float" />
          <div
            className="absolute top-40 right-20 w-32 h-32 bg-teal-200/30 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute bottom-32 left-1/4 w-24 h-24 bg-rose-200/40 rounded-full blur-2xl animate-float"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-[2rem] shadow-2xl p-12 text-center max-w-2xl relative border border-white/50">
          {/* Celebration stars */}
          <div className="absolute -top-4 -left-4">
            <Star className="w-8 h-8 text-amber-400 fill-amber-400 animate-bounce-in" />
          </div>
          <div className="absolute -top-2 -right-6">
            <Sparkles className="w-10 h-10 text-teal-400 animate-bounce-in" style={{ animationDelay: "0.2s" }} />
          </div>

          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mb-6 shadow-lg shadow-emerald-200">
            <CheckCircle className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Lesson Complete!</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Great work on <span className="font-bold text-primary">{lesson.title}</span>!
          </p>

          <div className="space-y-4">
            <Button
              onClick={handleBackToLiteracy}
              size="lg"
              className="w-full text-xl py-6 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 shadow-lg shadow-primary/25 btn-tactile"
            >
              <Home className="w-6 h-6 mr-2" />
              Continue Learning
            </Button>
            <Link href="/">
              <Button
                variant="outline"
                size="lg"
                className="w-full text-xl py-6 border-2 hover:bg-muted/50 bg-transparent"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/50 to-teal-50/30 relative">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/50 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/literacy"
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Literacy
          </Link>
          <div className="text-center flex-1">
            <h1 className="text-xl font-bold text-foreground">{lesson.title}</h1>
            <p className="text-sm text-muted-foreground">{lesson.description}</p>
          </div>
          <div className="w-32" />
        </div>
      </header>

      <div className="bg-white/60 backdrop-blur-sm border-b border-white/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-muted-foreground">
              Drill {currentDrillIndex + 1} of {lesson.drills.length}
            </span>
            <span className="text-sm font-semibold text-primary">
              {Math.round(((currentDrillIndex + 1) / lesson.drills.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-400 via-primary to-amber-400 h-3 rounded-full transition-all duration-500 ease-out animate-gradient"
              style={{ width: `${((currentDrillIndex + 1) / lesson.drills.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-md border border-white/50">
          <div className="w-2.5 h-2.5 bg-gradient-to-r from-primary to-amber-500 rounded-full animate-pulse" />
          <span className="text-sm font-bold text-foreground capitalize">
            {currentDrill.type.replace("-", " ")} Drill
          </span>
        </div>
      </div>

      {/* Main Drill Area */}
      <main className="container mx-auto px-4 pb-8">
        {currentDrill.type === "visual" && (
          <VisualDrill config={currentDrill} lessonId={lesson.id} onComplete={handleDrillComplete} />
        )}
        {currentDrill.type === "blending" && (
          <BlendingDrill config={currentDrill} lessonId={lesson.id} onComplete={handleDrillComplete} />
        )}
        {currentDrill.type === "auditory" && (
          <AuditoryDrill config={currentDrill} lessonId={lesson.id} onComplete={handleDrillComplete} />
        )}
        {currentDrill.type === "air-writing" && (
          <AirWritingDrill config={currentDrill} lessonId={lesson.id} onComplete={handleDrillComplete} />
        )}
        {currentDrill.type === "text-to-speech" && (
          <TextToSpeechDrill config={currentDrill} lessonId={lesson.id} onComplete={handleDrillComplete} />
        )}
        {currentDrill.type === "speech-to-text" && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Speech-to-Text Drill - Coming Soon</p>
          </div>
        )}
      </main>
    </div>
  )
}
