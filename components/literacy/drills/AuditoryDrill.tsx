"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, CheckCircle, XCircle, Eraser, RotateCcw } from "lucide-react"
import type { DrillConfig, LiteracyItem } from "@/types/literacy"
import { useElevenLabs } from "@/hooks/use-elevenlabs"
import { useLiteracyStore } from "@/lib/literacy-store"
import { getPhonemeForTTS } from "@/lib/literacy/phoneme-utils"

interface AuditoryDrillProps {
  config: DrillConfig
  lessonId: string
  onComplete: () => void
}

export function AuditoryDrill({ config, lessonId, onComplete }: AuditoryDrillProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showFeedback, setShowFeedback] = useState<"correct" | "incorrect" | null>(null)
  const [userInput, setUserInput] = useState("")
  const [isDrawingMode, setIsDrawingMode] = useState(false)
  const { speak, isSpeaking } = useElevenLabs()
  const { recordAttempt, getDrillProgress } = useLiteracyStore()

  const currentItem = config.items[currentIndex]
  const progress = getDrillProgress(lessonId, config.type)

  const speakSound = useCallback(async (item: LiteracyItem) => {
    // For auditory drill, speak ONLY the phoneme/IPA for pure sound recognition
    const phonemeText = getPhonemeForTTS(item)
    await speak(phonemeText)
  }, [speak])

  useEffect(() => {
    // Automatically speak the sound when the item appears
    if (currentItem) {
      setTimeout(() => {
        speakSound(currentItem)
      }, 500)
    }
  }, [currentIndex, currentItem, speakSound])

  const handleSubmit = () => {
    if (showFeedback || !userInput.trim()) return

    const isCorrect = userInput.trim().toUpperCase() === currentItem.content.toUpperCase()

    // Record attempt
    recordAttempt(lessonId, config.type, {
      itemId: currentItem.id,
      correct: isCorrect,
      timestamp: Date.now(),
    })

    setShowFeedback(isCorrect ? "correct" : "incorrect")

    if (isCorrect) {
      speak("That's right!")

      setTimeout(() => {
        setShowFeedback(null)
        setUserInput("")
        
        // Check if we've completed the drill
        if (currentIndex >= config.items.length - 1) {
          onComplete()
        } else {
          setCurrentIndex(prev => prev + 1)
        }
      }, 1500)
    } else {
      speak(`Not quite. The correct letter is ${currentItem.content}`)

      setTimeout(() => {
        setShowFeedback(null)
        setUserInput("")
      }, 2000)
    }
  }

  const handleReplay = () => {
    if (!isSpeaking) {
      speakSound(currentItem)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !showFeedback) {
      handleSubmit()
    }
  }

  const accuracy = progress ? progress.accuracy : 0
  const masteryAchieved = progress ? progress.masteryAchieved : false

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-6">
      {/* Progress Indicator */}
      <div className="mb-8 text-center">
        <div className="text-sm text-gray-600 mb-2">
          Sound {currentIndex + 1} of {config.items.length}
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
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Listen to the Sound</h3>
        <p className="text-gray-600">Then type or write the letter you hear</p>
      </div>

      {/* Audio Playback Button */}
      <Button
        onClick={handleReplay}
        disabled={isSpeaking}
        size="lg"
        className="mb-8 gap-3 px-8 py-6 text-xl"
      >
        <Volume2 className="w-8 h-8" />
        {isSpeaking ? "Playing..." : "Play Sound"}
      </Button>

      {/* Input Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <Button
          onClick={() => setIsDrawingMode(false)}
          variant={!isDrawingMode ? "default" : "outline"}
          size="sm"
        >
          Type
        </Button>
        <Button
          onClick={() => setIsDrawingMode(true)}
          variant={isDrawingMode ? "default" : "outline"}
          size="sm"
        >
          Draw
        </Button>
      </div>

      {/* Input Area */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 min-w-[400px]">
        {!isDrawingMode ? (
          // Keyboard Input Mode
          <div className="text-center">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value.slice(0, 1))}
              onKeyPress={handleKeyPress}
              maxLength={1}
              placeholder="Type letter..."
              className="w-32 h-32 text-center text-6xl font-bold border-4 border-primary rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/30 uppercase"
              autoFocus
              disabled={showFeedback !== null}
            />
          </div>
        ) : (
          // Drawing Mode (simplified - would use WritingCanvas in full implementation)
          <div className="text-center">
            <div className="text-gray-500 mb-4">Drawing mode coming soon!</div>
            <div className="text-sm text-gray-400">Use keyboard mode for now</div>
          </div>
        )}

        {/* Feedback Display */}
        {showFeedback && (
          <div
            className={`mt-6 flex items-center justify-center gap-2 text-xl font-bold ${
              showFeedback === "correct" ? "text-green-600" : "text-red-600"
            }`}
          >
            {showFeedback === "correct" ? (
              <>
                <CheckCircle className="w-8 h-8" />
                <span>That's right!</span>
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

      {/* Action Buttons */}
      {!isDrawingMode && (
        <div className="flex gap-4">
          <Button
            onClick={() => setUserInput("")}
            disabled={!userInput || showFeedback !== null}
            variant="outline"
            size="lg"
            className="px-8 py-6 text-lg gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Clear
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!userInput.trim() || showFeedback !== null || isSpeaking}
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 text-lg"
          >
            Submit Answer
          </Button>
        </div>
      )}

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
    </div>
  )
}
