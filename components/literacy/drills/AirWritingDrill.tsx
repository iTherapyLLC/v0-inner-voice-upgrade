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
    // Use syllable-based approach for clear, natural pronunciation
    const syllableText = getSyllableForTTS(item)
    await speak(syllableText)
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
    <div className="flex flex-col items-center justify-center min-h-[600px] p-6 bg-gradient-to-br from-green-100 via-yellow-100 to-orange-100">
      {/* Progress Indicator */}
      <div className="mb-8 text-center">
        <div className="text-sm font-bold text-green-600 mb-2">
          ✍️ Letter {currentIndex + 1} of {config.items.length} ✍️
        </div>
        <div className="flex gap-2 justify-center">
          {config.items.map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                idx < currentIndex
                  ? "bg-green-500 scale-110 shadow-lg"
                  : idx === currentIndex
                  ? "bg-yellow-500 scale-125 animate-pulse"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mb-6 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-yellow-600 to-orange-600 text-transparent bg-clip-text mb-2">
          ✨ Watch and Practice! ✨
        </h3>
        <p className="text-gray-700 text-lg font-semibold">Watch how to write the letter, then practice in the air! 🖐️</p>
      </div>

      {/* Animation Display */}
      <div className="bg-gradient-to-br from-white to-yellow-50 rounded-3xl shadow-2xl p-12 mb-8 min-w-[500px] min-h-[400px] flex flex-col items-center justify-center border-4 border-yellow-200">
        {/* Letter Display with Animation */}
        <div className="relative mb-6">
          <div
            className={`text-9xl font-bold transition-all duration-500 ${
              isAnimating 
                ? "bg-gradient-to-r from-green-500 via-yellow-500 to-orange-500 text-transparent bg-clip-text scale-125 animate-pulse" 
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
              <div className="w-full h-full border-4 border-green-400 rounded-full animate-ping opacity-30" />
            </div>
          )}
        </div>

        {/* Letter Formation Hint */}
        <div className="text-center mb-6">
          <div className="text-2xl font-bold text-gray-800 mb-2">
            ✏️ {currentItem.content.toUpperCase()} ✏️
          </div>
          <div className="text-base text-gray-600 font-semibold">
            {isAnimating ? "👀 Watch carefully..." : "✅ Ready to practice!"}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handlePlayAnimation}
            disabled={isAnimating}
            size="lg"
            className="gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg px-8 py-6"
          >
            {isAnimating ? (
              <>
                <Pause className="w-6 h-6" />
                Animating...
              </>
            ) : (
              <>
                <PlayCircle className="w-6 h-6" />
                🎬 Watch Again
              </>
            )}
          </Button>
          
          <Button
            onClick={() => speakLetter(currentItem)}
            variant="outline"
            size="lg"
            className="gap-2 border-2 border-green-300 hover:bg-green-50 shadow-lg px-8 py-6"
          >
            <Volume2 className="w-6 h-6" />
            🔊 Hear Sound
          </Button>
        </div>
      </div>

      {/* Practice Instructions */}
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 border-3 border-blue-300 rounded-2xl p-6 mb-6 max-w-lg text-center shadow-lg">
        <h4 className="font-bold text-blue-800 mb-2 text-xl">🌟 Practice Time! 🌟</h4>
        <p className="text-blue-700 text-base font-semibold">
          Use your finger to "write" the letter {currentItem.content.toUpperCase()} in the air! ✨<br/>
          Trace it big and slow, just like you saw in the animation! 🖐️
        </p>
      </div>

      {/* Next Button */}
      <Button
        onClick={handleNext}
        disabled={!hasWatched}
        size="lg"
        className="px-16 py-8 text-xl gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
      >
        {hasWatched ? (
          <>
            <CheckCircle className="w-7 h-7" />
            ✅ I Practiced! Next Letter ➡️
          </>
        ) : (
          "👀 Watch the animation first"
        )}
      </Button>

      {/* Kinesthetic Learning Tip */}
      <div className="mt-8 text-center text-sm bg-white/80 backdrop-blur-sm rounded-2xl p-4 max-w-md shadow-lg">
        <p className="font-bold mb-1 text-purple-700 text-base">💡 Learning Tip 💡</p>
        <p className="text-gray-700 font-semibold">
          Writing letters in the air helps your brain remember the shape and movement! 🧠<br/>
          This is called "kinesthetic learning" - learning through movement! ✨
        </p>
      </div>
    </div>
  )
}
