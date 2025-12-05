"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, PlayCircle, CheckCircle, Pause } from "lucide-react"
import type { DrillConfig, LiteracyItem } from "@/types/literacy"
import { useElevenLabs } from "@/hooks/use-elevenlabs"
import { useLiteracyStore } from "@/lib/literacy-store"
import { getSyllableForTTS } from "@/lib/literacy/phoneme-utils"

interface AirWritingDrillProps {
  config: DrillConfig
  lessonId: string
  onComplete: () => void
}

export function AirWritingDrill({ config, lessonId, onComplete }: AirWritingDrillProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [hasWatched, setHasWatched] = useState(false)
  const { speak } = useElevenLabs()
  const { recordAttempt, completeDrill } = useLiteracyStore()

  const currentItem = config.items[currentIndex]

  const speakLetter = useCallback(async (item: LiteracyItem) => {
    // Use text for air writing
    const textToSpeak = getSyllableForTTS(item)
    await speak(textToSpeak)
  }, [speak])

  const handlePlayAnimation = async () => {
    setIsAnimating(true)
    setHasWatched(true)
    
    // Speak the letter while animating
    await speakLetter(currentItem)
    
    // Animation runs for 3 seconds
    setTimeout(() => {
      setIsAnimating(false)
    }, 3000)
  }

  const handleNext = () => {
    // Record completion (air writing is completion-based, always correct)
    recordAttempt(lessonId, config.type, {
      itemId: currentItem.id,
      correct: true,
      timestamp: Date.now(),
    })

    setHasWatched(false)
    
    if (currentIndex >= config.items.length - 1) {
      completeDrill(lessonId, config.type)
      onComplete()
    } else {
      setCurrentIndex(prev => prev + 1)
    }
  }

  // Auto-play on mount
  useEffect(() => {
    if (currentItem && !hasWatched) {
      setTimeout(() => {
        handlePlayAnimation()
      }, 500)
    }
  }, [currentIndex, currentItem, hasWatched])

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-6">
      {/* Progress Indicator */}
      <div className="mb-8 text-center">
        <div className="text-sm text-gray-600 mb-2">
          Letter {currentIndex + 1} of {config.items.length}
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
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Watch and Practice</h3>
        <p className="text-gray-600">Watch how to write the letter, then practice in the air!</p>
      </div>

      {/* Animation Display */}
      <div className="bg-white rounded-3xl shadow-2xl p-12 mb-8 min-w-[500px] min-h-[400px] flex flex-col items-center justify-center">
        {/* Letter Display with Animation */}
        <div className="relative mb-6">
          <div
            className={`text-9xl font-bold transition-all duration-300 ${
              isAnimating 
                ? "text-primary scale-110 animate-pulse" 
                : "text-gray-300"
            }`}
            style={{
              fontFamily: 'sans-serif',
            }}
          >
            {currentItem.content}
          </div>
          
          {isAnimating && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full border-4 border-primary rounded-full animate-ping opacity-30" />
            </div>
          )}
        </div>

        {/* Letter Formation Hint */}
        <div className="text-center mb-6">
          <div className="text-lg font-medium text-gray-700 mb-2">
            {currentItem.content.toUpperCase()}
          </div>
          <div className="text-sm text-gray-500">
            {isAnimating ? "Watch carefully..." : "Ready to practice!"}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handlePlayAnimation}
            disabled={isAnimating}
            size="lg"
            className="gap-2"
          >
            {isAnimating ? (
              <>
                <Pause className="w-5 h-5" />
                Animating...
              </>
            ) : (
              <>
                <PlayCircle className="w-5 h-5" />
                Watch Again
              </>
            )}
          </Button>
          
          <Button
            onClick={() => speakLetter(currentItem)}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <Volume2 className="w-5 h-5" />
            Hear Sound
          </Button>
        </div>
      </div>

      {/* Practice Instructions */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6 max-w-lg text-center">
        <h4 className="font-bold text-blue-800 mb-2">Practice Time!</h4>
        <p className="text-blue-700 text-sm">
          Use your finger to "write" the letter {currentItem.content.toUpperCase()} in the air.
          Trace it big and slow, just like you saw in the animation.
        </p>
      </div>

      {/* Next Button */}
      <Button
        onClick={handleNext}
        disabled={!hasWatched}
        size="lg"
        className="px-12 py-6 text-xl gap-2"
      >
        {hasWatched ? (
          <>
            <CheckCircle className="w-6 h-6" />
            I Practiced! Next Letter
          </>
        ) : (
          "Watch the animation first"
        )}
      </Button>

      {/* Kinesthetic Learning Tip */}
      <div className="mt-8 text-center text-sm text-gray-500 max-w-md">
        <p className="font-medium mb-1">💡 Learning Tip</p>
        <p>
          Writing letters in the air helps your brain remember the shape and movement.
          This is called "kinesthetic learning" - learning through movement!
        </p>
      </div>
    </div>
  )
}
