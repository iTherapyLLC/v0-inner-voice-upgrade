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
    <div className="flex flex-col items-center justify-center min-h-[600px] p-6 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      {/* Progress Indicator */}
      <div className="mb-8 text-center">
        <div className="text-sm font-bold text-blue-600 mb-2">
          👀 Item {currentIndex + 1} of {config.items.length} 👀
        </div>
        <div className="flex gap-2 justify-center">
          {config.items.map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                idx < currentIndex
                  ? "bg-green-500 scale-110 shadow-lg"
                  : idx === currentIndex
                  ? "bg-blue-500 scale-125 animate-pulse"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Display Area */}
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-12 mb-8 min-w-[450px] text-center border-4 border-blue-200">
        <div className="mb-6">
          <div className="letter-interactive text-9xl font-bold mb-6 select-none" style={{ 
            background: 'linear-gradient(135deg, rgb(37, 99, 235), rgb(147, 51, 234), rgb(236, 72, 153))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: '#8b5cf6' /* Fallback for accessibility */
          }}>
            {currentItem.content}
          </div>
          <Button
            onClick={handleReplay}
            disabled={isSpeaking}
            variant="outline"
            size="lg"
            className="gap-2 border-2 border-blue-300 hover:bg-blue-50 shadow-lg px-6 py-6 text-lg"
          >
            <Volume2 className="w-6 h-6" />
            🔊 Hear the Sound
          </Button>
        </div>

        {/* Feedback Display */}
        {showFeedback && (
          <div
            className={`flex items-center justify-center gap-3 text-2xl font-bold animate-bounce-in ${
              showFeedback === "correct" ? "text-green-600" : "text-orange-600"
            }`}
          >
            {showFeedback === "correct" ? (
              <>
                <CheckCircle className="w-10 h-10" />
                <span>🎉 Correct! 🎉</span>
              </>
            ) : (
              <>
                <XCircle className="w-10 h-10" />
                <span>💪 Try again! 💪</span>
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
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-10 py-8 text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
        >
          ✅ I Know This Sound! ✓
        </Button>
        <Button
          onClick={() => handleResponse(false)}
          disabled={showFeedback !== null || isSpeaking}
          size="lg"
          variant="outline"
          className="px-10 py-8 text-xl border-2 border-orange-300 hover:bg-orange-50 shadow-lg"
        >
          🤔 I Need Help
        </Button>
      </div>

      {/* Stats Display */}
      <div className="mt-8 flex gap-6 text-base font-bold bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
        <div className="text-blue-700">
          <span className="font-semibold">🎯 Accuracy:</span> {accuracy}%
        </div>
        <div className="text-purple-700">
          <span className="font-semibold">🔥 Streak:</span> {consecutiveCorrect}/{config.consecutiveCorrect}
        </div>
        {masteryAchieved && (
          <div className="text-green-600 font-bold flex items-center gap-1 animate-wiggle">
            <CheckCircle className="w-5 h-5" />
            ⭐ Mastered! ⭐
          </div>
        )}
      </div>
    </div>
  )
}
