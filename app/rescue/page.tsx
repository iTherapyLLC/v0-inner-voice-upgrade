"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useElevenLabs } from "@/hooks/use-elevenlabs"
import { Heart, Volume2, Home, Wind } from "lucide-react"

const CALMING_PHRASES = [
  "It's okay. You're safe.",
  "Take a deep breath with me.",
  "I'm here with you.",
  "This feeling will pass.",
  "You're doing great.",
]

const BREATHING_STEPS = [
  { text: "Breathe in...", duration: 4000, scale: 1.5 },
  { text: "Hold...", duration: 4000, scale: 1.5 },
  { text: "Breathe out...", duration: 6000, scale: 1 },
]

export default function RescuePage() {
  const router = useRouter()
  const { speak, isSpeaking } = useElevenLabs()
  const [breathingStep, setBreathingStep] = useState(0)
  const [isBreathing, setIsBreathing] = useState(false)
  const [circleScale, setCircleScale] = useState(1)

  // Auto-speak calming phrase on load
  useEffect(() => {
    speak("It's okay. You're safe. Let's take some deep breaths together.", "EXAVITQu4vr4xnSDxMaL")
  }, [])

  // Breathing exercise
  useEffect(() => {
    if (!isBreathing) return

    const step = BREATHING_STEPS[breathingStep]
    setCircleScale(step.scale)

    // Speak the instruction
    speak(step.text, "EXAVITQu4vr4xnSDxMaL")

    const timer = setTimeout(() => {
      setBreathingStep((prev) => (prev + 1) % BREATHING_STEPS.length)
    }, step.duration)

    return () => clearTimeout(timer)
  }, [isBreathing, breathingStep])

  const handleCalmingPhrase = (phrase: string) => {
    speak(phrase, "EXAVITQu4vr4xnSDxMaL")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 flex flex-col items-center justify-center p-6">
      {/* Breathing circle */}
      <div className="relative mb-12">
        <div
          className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-300 to-purple-300 flex items-center justify-center transition-transform duration-[4000ms] ease-in-out shadow-2xl"
          style={{ transform: `scale(${circleScale})` }}
        >
          <Heart className="w-20 h-20 text-white drop-shadow-lg" />
        </div>
        {isBreathing && (
          <p className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-2xl font-bold text-foreground whitespace-nowrap">
            {BREATHING_STEPS[breathingStep].text}
          </p>
        )}
      </div>

      {/* Breathing toggle */}
      <Button
        onClick={() => setIsBreathing(!isBreathing)}
        className="mb-12 rounded-full px-8 py-6 text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 shadow-xl"
      >
        <Wind className="mr-3 h-6 w-6" />
        {isBreathing ? "Stop Breathing Exercise" : "Start Breathing Exercise"}
      </Button>

      {/* Calming phrases */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full mb-12">
        {CALMING_PHRASES.map((phrase) => (
          <Button
            key={phrase}
            onClick={() => handleCalmingPhrase(phrase)}
            disabled={isSpeaking}
            className="rounded-2xl p-6 text-lg font-semibold bg-white/80 hover:bg-white text-foreground shadow-lg border-2 border-blue-200 hover:border-blue-400 transition-all h-auto"
          >
            <Volume2 className="mr-3 h-5 w-5 text-blue-500 flex-shrink-0" />
            <span className="text-left">{phrase}</span>
          </Button>
        ))}
      </div>

      {/* Go home */}
      <Button
        onClick={() => router.push("/")}
        variant="outline"
        className="rounded-full px-8 py-4 text-lg font-bold border-2"
      >
        <Home className="mr-2 h-5 w-5" />
        Go Home
      </Button>
    </div>
  )
}
