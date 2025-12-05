"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, CheckCircle, XCircle, Eraser, RotateCcw } from "lucide-react"
import type { DrillConfig, LiteracyItem } from "@/types/literacy"
import { useElevenLabs } from "@/hooks/use-elevenlabs"
import { useLiteracyStore } from "@/lib/literacy-store"
import { getSyllableForTTS } from "@/lib/literacy/phoneme-utils"

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
    // Use syllable-based approach for clear, natural pronunciation
    const syllableText = getSyllableForTTS(item)
    await speak(syllableText)
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
    <div className="flex flex-col items-center justify-center min-h-[600px] p-6 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
      {/* Progress Indicator */}
      <div className="mb-8 text-center">
        <div className="text-sm font-bold text-purple-600 mb-2">
          🎵 Sound {currentIndex + 1} of {config.items.length} 🎵
        </div>
        <div className="flex gap-2 justify-center">
          {config.items.map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                idx < currentIndex
                  ? "bg-green-500 scale-110 shadow-lg"
                  : idx === currentIndex
                  ? "bg-purple-500 scale-125 animate-pulse"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mb-6 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-transparent bg-clip-text mb-2">
          🎧 Listen to the Sound! 🎧
        </h3>
        <p className="text-gray-700 text-lg font-semibold">Then type or write the letter you hear ✏️</p>
      </div>

      {/* Audio Playback Button */}
      <Button
        onClick={handleReplay}
        disabled={isSpeaking}
        size="lg"
        className="mb-8 gap-3 px-10 py-8 text-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
      >
        <Volume2 className="w-10 h-10 animate-pulse" />
        {isSpeaking ? "Playing... 🔊" : "🔊 Play Sound 🔊"}
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
      <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-2xl p-8 mb-6 min-w-[400px] border-4 border-purple-200">
        {!isDrawingMode ? (
          // Keyboard Input Mode
          <div className="text-center">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value.slice(0, 1))}
              onKeyPress={handleKeyPress}
              maxLength={1}
              placeholder="Type..."
              className="letter-interactive w-40 h-40 text-center text-8xl font-bold border-4 border-purple-400 rounded-3xl focus:outline-none focus:ring-4 focus:ring-purple-300 uppercase bg-white shadow-inner"
              autoFocus
              disabled={showFeedback !== null}
            />
          </div>
        ) : (
          // Drawing Mode (simplified - would use WritingCanvas in full implementation)
          <div className="text-center">
            <div className="text-gray-500 mb-4 text-lg">Drawing mode coming soon!</div>
            <div className="text-sm text-gray-400">Use keyboard mode for now ⌨️</div>
          </div>
        )}

        {/* Feedback Display */}
        {showFeedback && (
          <div
            className={`mt-6 flex items-center justify-center gap-3 text-2xl font-bold animate-bounce-in ${
              showFeedback === "correct" ? "text-green-600" : "text-orange-600"
            }`}
          >
            {showFeedback === "correct" ? (
              <>
                <CheckCircle className="w-10 h-10" />
                <span>🎉 That's right! 🎉</span>
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

      {/* Action Buttons */}
      {!isDrawingMode && (
        <div className="flex gap-4">
          <Button
            onClick={() => setUserInput("")}
            disabled={!userInput || showFeedback !== null}
            variant="outline"
            size="lg"
            className="px-10 py-7 text-lg gap-2 border-2 border-purple-300 hover:bg-purple-50 shadow-lg"
          >
            <RotateCcw className="w-6 h-6" />
            Clear
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!userInput.trim() || showFeedback !== null || isSpeaking}
            size="lg"
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-12 py-7 text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
          >
            ✅ Submit Answer ✅
          </Button>
        </div>
      )}

      {/* Stats Display */}
      <div className="mt-8 flex gap-6 text-base font-bold bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
        <div className="text-purple-700">
          <span className="font-semibold">🎯 Accuracy:</span> {accuracy}%
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
