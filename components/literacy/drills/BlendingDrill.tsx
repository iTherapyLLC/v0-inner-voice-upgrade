"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, CheckCircle, XCircle, Sparkles } from "lucide-react"
import type { DrillConfig, BlendingWord } from "@/types/literacy"
import { useElevenLabs } from "@/hooks/use-elevenlabs"
import { useLiteracyStore } from "@/lib/literacy-store"

interface BlendingDrillProps {
  config: DrillConfig
  lessonId: string
  onComplete: () => void
}

export function BlendingDrill({ config, lessonId, onComplete }: BlendingDrillProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showFeedback, setShowFeedback] = useState<"correct" | "incorrect" | null>(null)
  const [letterIndex, setLetterIndex] = useState(0)
  const [isBlending, setIsBlending] = useState(false)
  const { speak, isSpeaking } = useElevenLabs()
  const { recordAttempt, getDrillProgress } = useLiteracyStore()

  const words = config.blendingWords || []
  const currentWord = words[currentIndex]
  const letters = currentWord ? currentWord.word.split("") : []
  const progress = getDrillProgress(lessonId, config.type)

  const speakLetter = useCallback(async (letter: string) => {
    // Speak the letter sound (phoneme)
    await speak(letter)
  }, [speak])

  const speakWord = useCallback(async (word: string) => {
    await speak(word)
  }, [speak])

  useEffect(() => {
    // Auto-play first letter when word appears
    if (currentWord && letterIndex === 0 && !isBlending) {
      setTimeout(() => {
        speakLetter(letters[0])
      }, 500)
    }
  }, [currentIndex, currentWord, letterIndex, isBlending, letters, speakLetter])

  const handleNextLetter = () => {
    if (letterIndex < letters.length - 1) {
      const nextIndex = letterIndex + 1
      setLetterIndex(nextIndex)
      speakLetter(letters[nextIndex])
    } else {
      // All letters shown, time to blend
      setIsBlending(true)
      setTimeout(() => {
        speakWord(currentWord.word)
      }, 300)
    }
  }

  const handleResponse = (isCorrect: boolean) => {
    if (showFeedback || isSpeaking) return

    // Record attempt
    recordAttempt(lessonId, config.type, {
      itemId: currentWord.word,
      correct: isCorrect,
      timestamp: Date.now(),
    })

    setShowFeedback(isCorrect ? "correct" : "incorrect")

    if (isCorrect) {
      speak("Great job!")

      setTimeout(() => {
        setShowFeedback(null)
        setLetterIndex(0)
        setIsBlending(false)
        
        // Check if we've completed the drill
        if (currentIndex >= words.length - 1) {
          onComplete()
        } else {
          setCurrentIndex(prev => prev + 1)
        }
      }, 1500)
    } else {
      speak("Let's try that again!")

      setTimeout(() => {
        setShowFeedback(null)
        setLetterIndex(0)
        setIsBlending(false)
      }, 1500)
    }
  }

  const handleReplay = () => {
    if (!isSpeaking) {
      if (isBlending) {
        speakWord(currentWord.word)
      } else {
        speakLetter(letters[letterIndex])
      }
    }
  }

  const accuracy = progress ? progress.accuracy : 0
  const masteryAchieved = progress ? progress.masteryAchieved : false

  if (!currentWord) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-6">
      {/* Progress Indicator */}
      <div className="mb-8 text-center">
        <div className="text-sm text-gray-600 mb-2">
          Word {currentIndex + 1} of {words.length}
        </div>
        <div className="flex gap-2 justify-center">
          {words.map((_, idx) => (
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

      {/* Word Type Indicator */}
      <div className={`mb-4 px-4 py-2 rounded-full font-bold text-sm ${
        currentWord.type === "nonsense" 
          ? "bg-purple-100 text-purple-700" 
          : "bg-blue-100 text-blue-700"
      }`}>
        {currentWord.type === "nonsense" ? "Nonsense Word" : "Real Word"}
      </div>

      {/* Main Display Area */}
      <div className="bg-white rounded-3xl shadow-2xl p-12 mb-8 min-w-[500px]">
        {/* Letter Display */}
        <div className="flex justify-center gap-4 mb-8">
          {letters.map((letter, idx) => (
            <div
              key={idx}
              className={`
                w-20 h-24 flex items-center justify-center rounded-2xl text-5xl font-bold transition-all
                ${idx <= letterIndex 
                  ? "bg-gradient-to-br from-primary to-secondary text-white scale-110 shadow-lg" 
                  : "bg-gray-100 text-gray-300"
                }
              `}
            >
              {letter.toUpperCase()}
            </div>
          ))}
        </div>

        {/* Pattern Label */}
        {currentWord.pattern && (
          <div className="text-center text-gray-500 text-sm mb-4">
            Pattern: {currentWord.pattern}
          </div>
        )}

        {/* CVC Labels */}
        <div className="flex justify-center gap-4 mb-6">
          {letters.map((_, idx) => (
            <div
              key={idx}
              className="w-20 text-center text-xs font-bold text-gray-400"
            >
              {idx === 0 || idx === letters.length - 1 ? "C" : "V"}
            </div>
          ))}
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          {!isBlending && (
            <Button
              onClick={handleNextLetter}
              disabled={isSpeaking}
              size="lg"
              className="gap-2"
            >
              <Volume2 className="w-5 h-5" />
              {letterIndex < letters.length - 1 ? "Next Letter" : "Blend It!"}
            </Button>
          )}
          <Button
            onClick={handleReplay}
            disabled={isSpeaking}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <Volume2 className="w-5 h-5" />
            Hear Again
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
                <span>Great job!</span>
              </>
            ) : (
              <>
                <XCircle className="w-8 h-8" />
                <span>Let's try that again!</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Response Buttons - Only show after blending */}
      {isBlending && !showFeedback && (
        <div className="flex gap-4">
          <Button
            onClick={() => handleResponse(true)}
            disabled={showFeedback !== null || isSpeaking}
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 text-xl"
          >
            I Read It! ✓
          </Button>
          <Button
            onClick={() => handleResponse(false)}
            disabled={showFeedback !== null || isSpeaking}
            size="lg"
            variant="outline"
            className="px-8 py-6 text-xl"
          >
            Try Again ✗
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

      {/* Nonsense Word Indicator */}
      {currentWord.type === "nonsense" && (
        <div className="mt-4 flex items-center gap-2 text-purple-600 text-sm">
          <Sparkles className="w-4 h-4" />
          <span>This is a made-up word for practice!</span>
        </div>
      )}
    </div>
  )
}
