"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, CheckCircle, XCircle, Check, HelpCircle, Sparkles } from "lucide-react"
import type { DrillConfig, LiteracyItem } from "@/types/literacy"
import { useElevenLabs } from "@/hooks/use-elevenlabs"
import { useLiteracyStore } from "@/lib/literacy-store"
import { getDescriptiveAudioHint } from "@/lib/literacy/phoneme-utils"

interface VisualDrillProps {
  config: DrillConfig
  lessonId: string
  onComplete: () => void
}

const letterColors = [
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-sky-500 to-blue-600",
  "from-violet-500 to-purple-600",
  "from-fuchsia-500 to-pink-600",
]

export function VisualDrill({ config, lessonId, onComplete }: VisualDrillProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showFeedback, setShowFeedback] = useState<"correct" | "incorrect" | null>(null)
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0)
  const { speak, isSpeaking } = useElevenLabs()
  const { recordAttempt, getDrillProgress } = useLiteracyStore()

  const currentItem = config.items[currentIndex]
  const progress = getDrillProgress(lessonId, config.type)

  const currentColor = letterColors[currentIndex % letterColors.length]

  const speakItem = useCallback(
    async (item: LiteracyItem) => {
      const fullHint = getDescriptiveAudioHint(item)
      await speak(fullHint)
    },
    [speak],
  )

  useEffect(() => {
    if (currentItem) {
      speakItem(currentItem)
    }
  }, [currentIndex, currentItem, speakItem])

  const handleResponse = (isCorrect: boolean) => {
    if (showFeedback || isSpeaking) return

    recordAttempt(lessonId, config.type, {
      itemId: currentItem.id,
      correct: isCorrect,
      timestamp: Date.now(),
    })

    setShowFeedback(isCorrect ? "correct" : "incorrect")

    if (isCorrect) {
      const newConsecutive = consecutiveCorrect + 1
      setConsecutiveCorrect(newConsecutive)
      speak("Correct!")

      setTimeout(() => {
        setShowFeedback(null)

        if (currentIndex >= config.items.length - 1) {
          onComplete()
        } else {
          setCurrentIndex((prev) => prev + 1)
        }
      }, 1500)
    } else {
      setConsecutiveCorrect(0)
      speak("Try again!")

      setTimeout(() => {
        setShowFeedback(null)
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
      <div className="mb-8 text-center">
        <div className="text-sm font-semibold text-muted-foreground mb-3">
          Item {currentIndex + 1} of {config.items.length}
        </div>
        <div className="flex gap-2 justify-center">
          {config.items.map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                idx < currentIndex
                  ? "bg-gradient-to-r from-emerald-400 to-teal-500 scale-100"
                  : idx === currentIndex
                    ? "bg-gradient-to-r from-primary to-amber-500 scale-125 shadow-lg shadow-primary/30"
                    : "bg-muted scale-100"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="relative mb-8">
        {/* Glow effect behind card */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${currentColor} opacity-20 blur-3xl scale-150 rounded-full`}
        />

        <div className="relative bg-white/95 backdrop-blur-sm rounded-[2rem] shadow-2xl p-12 min-w-[420px] text-center border border-white/50 overflow-hidden">
          {/* Decorative corner accent */}
          <div
            className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${currentColor} opacity-10 rounded-bl-[100px]`}
          />

          <div className="mb-8 relative">
            <div
              className={`text-[10rem] leading-none font-bold bg-gradient-to-br ${currentColor} bg-clip-text text-transparent select-none drop-shadow-sm`}
            >
              {currentItem.content}
            </div>
          </div>

          <Button
            onClick={handleReplay}
            disabled={isSpeaking}
            variant="outline"
            size="lg"
            className="gap-3 px-6 py-5 text-lg font-semibold border-2 hover:bg-muted/50 hover:border-primary/30 transition-all btn-tactile bg-transparent"
          >
            <Volume2 className={`w-6 h-6 ${isSpeaking ? "animate-pulse text-primary" : ""}`} />
            Hear the Sound
          </Button>

          {showFeedback && (
            <div
              className={`absolute inset-0 flex items-center justify-center backdrop-blur-sm rounded-[2rem] animate-bounce-in ${
                showFeedback === "correct" ? "bg-emerald-500/90" : "bg-rose-500/90"
              }`}
            >
              <div className="text-center text-white">
                {showFeedback === "correct" ? (
                  <>
                    <CheckCircle className="w-20 h-20 mx-auto mb-4" />
                    <span className="text-3xl font-bold">Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-20 h-20 mx-auto mb-4" />
                    <span className="text-3xl font-bold">Try again!</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={() => handleResponse(true)}
          disabled={showFeedback !== null || isSpeaking}
          size="lg"
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-7 text-xl font-bold shadow-lg shadow-emerald-200 btn-tactile gap-3"
        >
          <Check className="w-6 h-6" strokeWidth={3} />I Know This Sound!
        </Button>
        <Button
          onClick={() => handleResponse(false)}
          disabled={showFeedback !== null || isSpeaking}
          size="lg"
          variant="outline"
          className="px-8 py-7 text-xl font-semibold border-2 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 btn-tactile gap-3"
        >
          <HelpCircle className="w-6 h-6" />I Need Help
        </Button>
      </div>

      <div className="mt-10 flex gap-6 items-center">
        <div className="bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-sm border border-white/50">
          <span className="text-sm text-muted-foreground">Accuracy: </span>
          <span
            className={`text-sm font-bold ${accuracy >= 80 ? "text-emerald-600" : accuracy >= 50 ? "text-amber-600" : "text-rose-600"}`}
          >
            {accuracy}%
          </span>
        </div>
        <div className="bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-sm border border-white/50">
          <span className="text-sm text-muted-foreground">Streak: </span>
          <span className="text-sm font-bold text-primary">
            {consecutiveCorrect}/{config.consecutiveCorrect}
          </span>
        </div>
        {masteryAchieved && (
          <div className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 font-bold flex items-center gap-2 px-5 py-2.5 rounded-full shadow-sm border border-amber-200">
            <Sparkles className="w-4 h-4" />
            Mastered!
          </div>
        )}
      </div>
    </div>
  )
}
