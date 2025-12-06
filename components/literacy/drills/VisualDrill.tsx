"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, CheckCircle, XCircle, Mic, MicOff, HelpCircle, Sparkles } from "lucide-react"
import type { DrillConfig, LiteracyItem } from "@/types/literacy"
import { useElevenLabs } from "@/hooks/use-elevenlabs"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import { useLiteracyStore } from "@/lib/literacy-store"
import { getSyllableForTTS, verifyCVPronunciation } from "@/lib/literacy/phoneme-utils"

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
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0)
  const [isVerifying, setIsVerifying] = useState(false)
  const { speak, isSpeaking } = useElevenLabs()
  const { recordAttempt, getDrillProgress } = useLiteracyStore()

  const currentItem = config.items[currentIndex]
  const progress = getDrillProgress(lessonId, config.type)
  const currentColor = letterColors[currentIndex % letterColors.length]

  const handleSpeechResult = useCallback(
    (result: { transcript: string; confidence: number }) => {
      if (!currentItem || showFeedback) return

      setIsVerifying(true)

      const verification = verifyCVPronunciation(currentItem.content, result.transcript)

      recordAttempt(lessonId, config.type, {
        itemId: currentItem.id,
        correct: verification.isCorrect,
        timestamp: Date.now(),
      })

      setFeedbackMessage(verification.feedback)
      setShowFeedback(verification.isCorrect ? "correct" : "incorrect")

      if (verification.isCorrect) {
        const newConsecutive = consecutiveCorrect + 1
        setConsecutiveCorrect(newConsecutive)
        speak(verification.feedback)

        setTimeout(() => {
          setShowFeedback(null)
          setFeedbackMessage("")
          setIsVerifying(false)

          if (currentIndex >= config.items.length - 1) {
            onComplete()
          } else {
            setCurrentIndex((prev) => prev + 1)
          }
        }, 2000)
      } else {
        setConsecutiveCorrect(0)
        speak(verification.feedback)

        setTimeout(() => {
          setShowFeedback(null)
          setFeedbackMessage("")
          setIsVerifying(false)
          speakItem(currentItem)
        }, 3000)
      }
    },
    [
      currentItem,
      showFeedback,
      lessonId,
      config.type,
      consecutiveCorrect,
      currentIndex,
      config.items.length,
      onComplete,
      recordAttempt,
      speak,
    ],
  )

  const {
    isListening,
    isSupported: speechSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    onResult: handleSpeechResult,
    onError: (error) => {
      console.error("Speech recognition error:", error)
      setIsVerifying(false)
    },
  })

  const speakItem = useCallback(
    async (item: LiteracyItem) => {
      const textToSpeak = getSyllableForTTS(item)
      await speak(textToSpeak)
    },
    [speak],
  )

  useEffect(() => {
    if (currentItem) {
      speakItem(currentItem)
    }
  }, [currentIndex, currentItem, speakItem])

  const handleReplay = () => {
    if (!isSpeaking) {
      speakItem(currentItem)
    }
  }

  const handleReadAloud = () => {
    if (!speechSupported) {
      handleManualResponse(true)
      return
    }

    if (isListening) {
      stopListening()
    } else {
      resetTranscript()
      startListening()
    }
  }

  const handleManualResponse = (isCorrect: boolean) => {
    if (showFeedback || isSpeaking) return

    recordAttempt(lessonId, config.type, {
      itemId: currentItem.id,
      correct: isCorrect,
      timestamp: Date.now(),
    })

    setShowFeedback(isCorrect ? "correct" : "incorrect")
    setFeedbackMessage(isCorrect ? "Great job!" : "Try again!")

    if (isCorrect) {
      const newConsecutive = consecutiveCorrect + 1
      setConsecutiveCorrect(newConsecutive)
      speak("Correct!")

      setTimeout(() => {
        setShowFeedback(null)
        setFeedbackMessage("")

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
        setFeedbackMessage("")
        speakItem(currentItem)
      }, 1500)
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
        <div
          className={`absolute inset-0 bg-gradient-to-br ${currentColor} opacity-20 blur-3xl scale-150 rounded-full`}
        />

        <div className="relative bg-white/95 backdrop-blur-sm rounded-[2rem] shadow-2xl p-12 min-w-[420px] text-center border border-white/50 overflow-hidden">
          <div className="mb-4 relative">
            <div
              className={`text-[10rem] leading-none font-bold bg-gradient-to-br ${currentColor} bg-clip-text text-transparent select-none drop-shadow-sm`}
            >
              {currentItem.content}
            </div>
          </div>

          <Button
            onClick={handleReplay}
            disabled={isSpeaking || isListening}
            variant="outline"
            size="lg"
            className="gap-3 px-6 py-5 text-lg font-semibold border-2 hover:bg-muted/50 hover:border-primary/30 transition-all btn-tactile bg-transparent"
          >
            <Volume2 className={`w-6 h-6 ${isSpeaking ? "animate-pulse text-primary" : ""}`} />
            Hear the Sound
          </Button>

          {isListening && (
            <div className="mt-6 flex flex-col items-center gap-3 animate-pulse">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Mic className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <span className="text-lg font-semibold text-primary">Listening...</span>
              <span className="text-sm text-muted-foreground">Say the syllable aloud!</span>
            </div>
          )}

          {showFeedback && (
            <div
              className={`absolute inset-0 flex items-center justify-center backdrop-blur-sm rounded-[2rem] animate-bounce-in ${
                showFeedback === "correct" ? "bg-emerald-500/90" : "bg-rose-500/90"
              }`}
            >
              <div className="text-center text-white px-6">
                {showFeedback === "correct" ? (
                  <>
                    <CheckCircle className="w-20 h-20 mx-auto mb-4" />
                    <span className="text-3xl font-bold">{feedbackMessage || "Correct!"}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-20 h-20 mx-auto mb-4" />
                    <span className="text-2xl font-bold">{feedbackMessage || "Try again!"}</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={handleReadAloud}
          disabled={showFeedback !== null || isSpeaking || isVerifying}
          size="lg"
          className={`px-8 py-7 text-xl font-bold shadow-lg btn-tactile gap-3 min-w-[280px] ${
            isListening
              ? "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-rose-200"
              : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-200"
          } text-white`}
        >
          {isListening ? (
            <>
              <MicOff className="w-6 h-6" strokeWidth={3} />
              Stop Listening
            </>
          ) : (
            <>
              <Mic className="w-6 h-6" strokeWidth={3} />
              Read These Letters Aloud
            </>
          )}
        </Button>
        <Button
          onClick={() => handleManualResponse(false)}
          disabled={showFeedback !== null || isSpeaking || isListening}
          size="lg"
          variant="outline"
          className="px-8 py-7 text-xl font-semibold border-2 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 btn-tactile gap-3"
        >
          <HelpCircle className="w-6 h-6" />I Need Help
        </Button>
      </div>

      {!speechSupported && (
        <div className="mt-4 text-sm text-muted-foreground text-center max-w-md">
          Speech recognition is not supported in your browser. Try using Chrome or Edge for the best experience.
        </div>
      )}

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
