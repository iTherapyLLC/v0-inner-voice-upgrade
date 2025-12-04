"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, CheckCircle, XCircle, Ear } from "lucide-react"
import type { DrillConfig, LiteracyItem } from "@/types/literacy"
import { useElevenLabs } from "@/hooks/use-elevenlabs"
import { useLiteracyStore } from "@/lib/literacy-store"

interface TextToSpeechDrillProps {
  config: DrillConfig
  lessonId: string
  onComplete: () => void
}

export function TextToSpeechDrill({ config, lessonId, onComplete }: TextToSpeechDrillProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showFeedback, setShowFeedback] = useState<"correct" | "incorrect" | null>(null)
  const [hasListened, setHasListened] = useState(false)
  const { speak, isSpeaking } = useElevenLabs()
  const { recordAttempt, getDrillProgress } = useLiteracyStore()

  const currentItem = config.items[currentIndex]
  const progress = getDrillProgress(lessonId, config.type)

  const speakText = useCallback(async (item: LiteracyItem) => {
    setHasListened(true)
    await speak(item.content)
  }, [speak])

  useEffect(() => {
    // Automatically speak the text when the item appears
    if (currentItem && !hasListened) {
      setTimeout(() => {
        speakText(currentItem)
      }, 500)
    }
  }, [currentIndex, currentItem, hasListened, speakText])

  const handleResponse = (isCorrect: boolean) => {
    if (showFeedback) return

    // Record attempt
    recordAttempt(lessonId, config.type, {
      itemId: currentItem.id,
      correct: isCorrect,
      timestamp: Date.now(),
    })

    setShowFeedback(isCorrect ? "correct" : "incorrect")

    if (isCorrect) {
      speak("Great listening!")

      setTimeout(() => {
        setShowFeedback(null)
        setHasListened(false)
        
        // Check if we've completed the drill
        if (currentIndex >= config.items.length - 1) {
          onComplete()
        } else {
          setCurrentIndex(prev => prev + 1)
        }
      }, 1500)
    } else {
      speak("Try listening again!")

      setTimeout(() => {
        setShowFeedback(null)
        // Replay the audio
        speakText(currentItem)
      }, 1500)
    }
  }

  const handleReplay = () => {
    if (!isSpeaking) {
      speakText(currentItem)
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

      {/* Instructions */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Listen Carefully</h3>
        <p className="text-gray-600">Listen to what I say, then answer the question</p>
      </div>

      {/* Listen Button */}
      <div className="bg-white rounded-3xl shadow-2xl p-12 mb-8 min-w-[500px] text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full mb-4">
            <Ear className="w-12 h-12 text-white" />
          </div>
          <Button
            onClick={handleReplay}
            disabled={isSpeaking}
            size="lg"
            className="gap-2 px-8 py-6 text-xl"
          >
            <Volume2 className="w-6 h-6" />
            {isSpeaking ? "Speaking..." : hasListened ? "Listen Again" : "Listen"}
          </Button>
        </div>

        {/* Visual Hint (if available) */}
        {currentItem.visualHint && (
          <div className="text-gray-500 text-sm mb-4">
            {currentItem.visualHint}
          </div>
        )}

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
                <span>Great listening!</span>
              </>
            ) : (
              <>
                <XCircle className="w-8 h-8" />
                <span>Try listening again!</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Response Buttons */}
      <div className="text-center mb-6">
        <p className="text-lg font-medium text-gray-700 mb-4">Did you hear it clearly?</p>
        <div className="flex gap-4">
          <Button
            onClick={() => handleResponse(true)}
            disabled={showFeedback !== null || !hasListened}
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 text-xl"
          >
            Yes, I Heard It! ✓
          </Button>
          <Button
            onClick={() => handleResponse(false)}
            disabled={showFeedback !== null || !hasListened}
            size="lg"
            variant="outline"
            className="px-8 py-6 text-xl"
          >
            Play Again ✗
          </Button>
        </div>
      </div>

      {/* Stats Display */}
      <div className="mt-8 flex gap-6 text-sm text-gray-600">
        <div>
          <span className="font-semibold">Accuracy:</span> {accuracy}%
        </div>
        {masteryAchieved && (
          <div className="text-green-600 font-bold flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Mastered!
          </div>
        )}
      </div>

      {/* Listening Skills Tip */}
      <div className="mt-8 text-center text-sm text-gray-500 max-w-md">
        <p className="font-medium mb-1">🎧 Listening Skills</p>
        <p>
          Good listening is an important part of reading! Pay attention to each sound you hear.
        </p>
      </div>
    </div>
  )
}
