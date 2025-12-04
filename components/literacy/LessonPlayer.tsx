"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, CheckCircle } from "lucide-react"
import type { Lesson } from "@/types/literacy"
import { VisualDrill } from "@/components/literacy/drills/VisualDrill"
import { BlendingDrill } from "@/components/literacy/drills/BlendingDrill"
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
    // Mark drill as complete
    completeDrill(lesson.id, currentDrill.type)

    // Move to next drill or complete lesson
    if (currentDrillIndex < lesson.drills.length - 1) {
      setCurrentDrillIndex(prev => prev + 1)
    } else {
      // All drills completed
      completeLesson(lesson.id)
      setCompleted(true)
    }
  }

  const handleBackToLiteracy = () => {
    router.push("/literacy")
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-2xl">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Lesson Complete!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Great work on <span className="font-bold text-primary">{lesson.title}</span>!
          </p>
          
          <div className="space-y-4">
            <Button
              onClick={handleBackToLiteracy}
              size="lg"
              className="w-full text-xl py-6"
            >
              <Home className="w-6 h-6 mr-2" />
              Continue Learning
            </Button>
            <Link href="/">
              <Button
                variant="outline"
                size="lg"
                className="w-full text-xl py-6"
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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/literacy" className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            Back to Literacy
          </Link>
          <div className="text-center flex-1">
            <h1 className="text-xl font-bold text-gray-800">{lesson.title}</h1>
            <p className="text-sm text-gray-600">{lesson.description}</p>
          </div>
          <div className="w-32" /> {/* Spacer */}
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Drill {currentDrillIndex + 1} of {lesson.drills.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(((currentDrillIndex + 1) / lesson.drills.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
              style={{ width: `${((currentDrillIndex + 1) / lesson.drills.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Drill Type Indicator */}
      <div className="container mx-auto px-4 py-4">
        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-sm font-bold text-gray-700 capitalize">
            {currentDrill.type.replace("-", " ")} Drill
          </span>
        </div>
      </div>

      {/* Main Drill Area */}
      <main className="container mx-auto px-4 pb-8">
        {currentDrill.type === "visual" && (
          <VisualDrill
            config={currentDrill}
            lessonId={lesson.id}
            onComplete={handleDrillComplete}
          />
        )}
        {currentDrill.type === "blending" && (
          <BlendingDrill
            config={currentDrill}
            lessonId={lesson.id}
            onComplete={handleDrillComplete}
          />
        )}
        {/* Other drill types would be rendered here */}
        {currentDrill.type === "auditory" && (
          <div className="text-center py-20">
            <p className="text-gray-600">Auditory Drill - Coming Soon</p>
          </div>
        )}
        {currentDrill.type === "air-writing" && (
          <div className="text-center py-20">
            <p className="text-gray-600">Air Writing Drill - Coming Soon</p>
          </div>
        )}
        {currentDrill.type === "speech-to-text" && (
          <div className="text-center py-20">
            <p className="text-gray-600">Speech-to-Text Drill - Coming Soon</p>
          </div>
        )}
        {currentDrill.type === "text-to-speech" && (
          <div className="text-center py-20">
            <p className="text-gray-600">Text-to-Speech Drill - Coming Soon</p>
          </div>
        )}
      </main>
    </div>
  )
}
