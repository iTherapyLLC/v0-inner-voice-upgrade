"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, CheckCircle, XCircle } from "lucide-react"
import type { DrillConfig, LiteracyItem } from "@/types/literacy"
import { useElevenLabs } from "@/hooks/use-elevenlabs"
import { useLiteracyStore } from "@/lib/literacy-store"
import { getSyllableForTTS } from "@/lib/literacy/phoneme-utils"

interface VisualDrillProps {
  config: DrillConfig
  lessonId: string
  onComplete: () => void
}

export function VisualDrill({ config, lessonId, onComplete }: VisualDrillProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showFeedback, setShowFeedback] = useState<"correct" | "incorrect" | null>(null)
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0)
  const { speak, isSpeaking } = useElevenLabs()
  const { recordAttempt, getDrillProgress } = useLiteracyStore()

  const currentItem = config.items[currentIndex]
  const progress = getDrillProgress(lessonId, config.type)

  const speakItem = useCallback(async (item: LiteracyItem) => {
    // Use syllable-based approach for clear, natural pronunciation
    const syllableText = getSyllableForTTS(item)
    await speak(syllableText)
  }, [speak])

  useEffect(() => {
    // Automatically speak the current item when it appears
    if (currentItem) {
      speakItem(currentItem)
    }
  }, [currentIndex, currentItem, speakItem])

  const handleResponse = (isCorrect: boolean) => {
    if (showFeedback || isSpeaking) return

    // Record attempt
    recordAttempt(lessonId, config.type, {
      itemId: currentItem.id,
      correct: isCorrect,
      timestamp: Date.now(),
    })

    setShowFeedback(isCorrect ? "correct" : "incorrect")

    if (isCorrect) {
      const newConsecutive = consecutiveCorrect + 1
      setConsecutiveCorrect(newConsecutive)

      // Provide positive feedback
      speak("Correct!")

      setTimeout(() => {
        setShowFeedback(null)
        
        // Check if we've completed the drill
        if (currentIndex >= config.items.length - 1) {
          onComplete()
        } else {
          setCurrentIndex(prev => prev + 1)
        }
      }, 1500)
    } else {
      setConsecutiveCorrect(0)
      speak("Try again!")

      setTimeout(() => {
        setShowFeedback(null)
        // Repeat the audio hint
        speakItem(currentItem)
      }, 1500)
    }
  }

  const handleReplay = () => {
    if (!isSpeaking) {
      speakItem(currentItem)
    }
  }

  const accuracy = progress ? progress.accuracy : 0
  const masteryAchieved = progress ? progress.masteryAchieved : false

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-6">
      {/* Progress Indicator */}
      <div className="mb-8 text-center">
        <div className="text-sm text-gray-600 mb-2">
          Item {currentIndex + 1} of {config.items.length}
        </div>
        <div className="flex gap-2 justify-center">
          {config.items.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx < currentIndex
                  ? "bg-green-500"
                  : idx === currentIndex
                  ? "bg-primary"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Display Area */}
      <div className="bg-white rounded-3xl shadow-2xl p-12 mb-8 min-w-[400px] text-center">
        <div className="mb-6">
          <div className="text-8xl font-bold text-primary mb-4 select-none">
            {currentItem.content}
          </div>
          <Button
            onClick={handleReplay}
            disabled={isSpeaking}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <Volume2 className="w-5 h-5" />
            Hear the Sound
          </Button>
        </div>

        {/* Feedback Display */}
        {showFeedback && (
          <div
            className={`flex items-center justify-center gap-2 text-xl font-bold ${
              showFeedback === "correct" ? "text-green-600" : "text-red-600"
            }`}
          >
            {showFeedback === "correct" ? (
              <>
                <CheckCircle className="w-8 h-8" />
                <span>Correct!</span>
              </>
            ) : (
              <>
                <XCircle className="w-8 h-8" />
                <span>Try again!</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Response Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={() => handleResponse(true)}
          disabled={showFeedback !== null || isSpeaking}
          size="lg"
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 text-xl"
        >
          I Know This Sound! ✓
        </Button>
        <Button
          onClick={() => handleResponse(false)}
          disabled={showFeedback !== null || isSpeaking}
          size="lg"
          variant="outline"
          className="px-8 py-6 text-xl"
        >
          I Need Help ✗
        </Button>
      </div>

      {/* Stats Display */}
      <div className="mt-8 flex gap-6 text-sm text-gray-600">
        <div>
          <span className="font-semibold">Accuracy:</span> {accuracy}%
        </div>
        <div>
          <span className="font-semibold">Streak:</span> {consecutiveCorrect}/{config.consecutiveCorrect}
        </div>
        {masteryAchieved && (
          <div className="text-green-600 font-bold flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Mastered!
          </div>
        )}
      </div>
    </div>
  )
}
