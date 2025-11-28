"use client"

import type React from "react"

import { useState, useCallback, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { AnimatedMouth } from "@/components/animated-mouth"
import { useLipSync } from "@/hooks/use-lip-sync"
import { useElevenLabs } from "@/hooks/use-elevenlabs"
import { PlayIcon, RefreshIcon } from "@/components/icons"
import { Pause, RotateCcw } from "lucide-react"

interface SpeechTherapyPlayerProps {
  text: string
  onComplete?: () => void
  autoPlay?: boolean
  showControls?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

const SIZE_MAP = {
  sm: 180,
  md: 280,
  lg: 380,
}

function AnimatedText({
  text,
  isPlaying,
  audioRef,
}: {
  text: string
  isPlaying: boolean
  audioRef: React.RefObject<HTMLAudioElement | null>
}) {
  const [currentWordIndex, setCurrentWordIndex] = useState(-1)
  const words = text.split(/\s+/)
  const animationRef = useRef<number | null>(null)

  // 200ms lead time for visual anticipation
  const LEAD_TIME_SECONDS = 0.2

  useEffect(() => {
    if (!isPlaying) {
      setCurrentWordIndex(-1)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      return
    }

    const syncWords = () => {
      const audio = audioRef.current
      if (!audio || audio.paused) {
        animationRef.current = requestAnimationFrame(syncWords)
        return
      }

      const duration = audio.duration || 1
      const currentTime = audio.currentTime + LEAD_TIME_SECONDS
      const progress = Math.min(currentTime / duration, 1)
      const wordIndex = Math.floor(progress * words.length)

      setCurrentWordIndex(Math.min(wordIndex, words.length - 1))

      if (!audio.ended) {
        animationRef.current = requestAnimationFrame(syncWords)
      }
    }

    // Start with first word immediately
    setCurrentWordIndex(0)
    animationRef.current = requestAnimationFrame(syncWords)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, words.length, audioRef])

  return (
    <div className="flex flex-wrap justify-center gap-x-3 gap-y-2">
      {words.map((word, index) => {
        const isActive = index === currentWordIndex
        const isPast = index < currentWordIndex
        const isFuture = index > currentWordIndex

        return (
          <span key={index} className="inline-block">
            <span
              className={`
                inline-block text-3xl md:text-4xl font-bold transition-all duration-150
                ${
                  isActive
                    ? "text-primary scale-110 drop-shadow-[0_0_8px_rgba(20,184,166,0.6)]"
                    : isPast
                      ? "text-foreground"
                      : "text-muted-foreground/50"
                }
              `}
              style={{
                transform: isActive ? "scale(1.15)" : isPast ? "scale(1)" : "scale(0.95)",
              }}
            >
              {word}
            </span>
            {index < words.length - 1 && " "}
          </span>
        )
      })}
    </div>
  )
}

export function SpeechTherapyPlayer({
  text,
  onComplete,
  autoPlay = false,
  showControls = true,
  size = "md",
  className = "",
}: SpeechTherapyPlayerProps) {
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1)
  const [isLooping, setIsLooping] = useState(false)
  const [practiceCount, setPracticeCount] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const { speak, stop: stopSpeech, isSpeaking, isLoading } = useElevenLabs()
  const {
    currentViseme,
    currentShape,
    animate: animateMouth,
    stop: stopMouth,
    isAnimating,
  } = useLipSync({
    speed: 150 * playbackSpeed,
    onComplete: () => {
      if (isLooping) {
        setTimeout(() => play(), 500)
      } else {
        onComplete?.()
      }
    },
  })

  const play = useCallback(async () => {
    // Start mouth animation
    animateMouth(text, playbackSpeed)

    // Start speech and get audio reference
    const audio = await speak(text)
    if (audio instanceof HTMLAudioElement) {
      audioRef.current = audio
    }

    // Track practice count
    setPracticeCount((prev) => {
      const newCount = prev + 1
      if (newCount >= 3 && !showCelebration) {
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 2000)
      }
      return newCount
    })
  }, [text, playbackSpeed, speak, animateMouth, showCelebration])

  const pause = useCallback(() => {
    stopSpeech()
    stopMouth()
    audioRef.current = null
  }, [stopSpeech, stopMouth])

  const restart = useCallback(() => {
    pause()
    setTimeout(() => play(), 100)
  }, [pause, play])

  // Auto-play on mount if enabled
  useEffect(() => {
    if (autoPlay && text) {
      play()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const isPlaying = isSpeaking || isAnimating || isLoading
  const mouthSize = SIZE_MAP[size]

  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      {/* Celebration animation */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50">
          <div className="text-4xl md:text-6xl font-black text-primary animate-bounce">Great job!</div>
        </div>
      )}

      {/* Animated Mouth - Anatomically accurate */}
      <div className="relative bg-gradient-to-b from-amber-50 to-orange-50 rounded-3xl p-6 shadow-lg">
        <AnimatedMouth viseme={currentViseme} shape={currentShape} size={mouthSize} className={isPlaying ? "" : ""} />

        {/* Speaking indicator dots */}
        {isPlaying && (
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-primary"
                style={{
                  animation: "bounce 0.6s infinite",
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Current viseme label for learning */}
        {isPlaying && currentViseme !== "rest" && (
          <div className="absolute top-2 right-2 bg-primary/10 text-primary text-xs font-mono px-2 py-1 rounded">
            {currentViseme.toUpperCase()}
          </div>
        )}
      </div>

      {/* Text display with word-by-word animation */}
      <div className="text-center max-w-lg px-4">
        <AnimatedText text={text} isPlaying={isPlaying} audioRef={audioRef} />
        {practiceCount > 0 && (
          <p className="text-sm text-muted-foreground mt-3">
            Practiced {practiceCount} time{practiceCount !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Controls */}
      {showControls && (
        <div className="flex flex-col items-center gap-4">
          {/* Play/Pause buttons */}
          <div className="flex items-center gap-3">
            <Button
              onClick={isPlaying ? pause : play}
              size="lg"
              className="h-16 w-16 rounded-full shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <PlayIcon className="h-8 w-8" />
              )}
            </Button>

            <Button
              onClick={restart}
              variant="outline"
              size="lg"
              className="h-14 w-14 rounded-full bg-white shadow"
              disabled={isLoading}
            >
              <RotateCcw className="h-6 w-6" />
            </Button>
          </div>

          {/* Speed controls */}
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow">
            <span className="text-sm text-muted-foreground font-medium">Speed:</span>
            {[0.5, 0.75, 1].map((speed) => (
              <Button
                key={speed}
                variant={playbackSpeed === speed ? "default" : "ghost"}
                size="sm"
                onClick={() => setPlaybackSpeed(speed)}
                className="rounded-full px-3 h-8"
              >
                {speed === 1 ? "Normal" : `${speed}x`}
              </Button>
            ))}
          </div>

          {/* Loop toggle */}
          <Button
            variant={isLooping ? "default" : "outline"}
            size="sm"
            onClick={() => setIsLooping(!isLooping)}
            className="rounded-full shadow"
          >
            <RefreshIcon className="h-4 w-4 mr-2" />
            {isLooping ? "Loop On" : "Loop Off"}
          </Button>
        </div>
      )}
    </div>
  )
}
