"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { AIHelper } from "@/components/ai-helper"
import { Play, ArrowLeft, Volume2, VolumeX, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useElevenLabs } from "@/hooks/use-elevenlabs"

interface Scenario {
  id: string
  title: string
  description: string
}

interface StoryButton {
  label: string
  phrase: string
}

interface SlideData {
  imageUrl: string
  narration: string
}

interface StoryData {
  title: string
  description: string
  buttons: StoryButton[]
}

function AnimatedNarration({
  text,
  isPlaying,
  isSpeaking,
  audioDuration,
}: {
  text: string
  isPlaying: boolean
  isSpeaking: boolean
  audioDuration: number
}) {
  const [currentWordIndex, setCurrentWordIndex] = useState(-1)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)

  const words = text.split(/\s+/).filter((w) => w.length > 0)

  // Lead time offset - highlight word slightly before it's spoken
  const LEAD_TIME_MS = 200

  useEffect(() => {
    if (!isPlaying || !isSpeaking || words.length === 0) {
      if (!isSpeaking && currentWordIndex >= words.length - 1) {
        // Keep last state after speech ends
        return
      }
      if (!isPlaying) {
        setCurrentWordIndex(-1)
      }
      return
    }

    startTimeRef.current = performance.now()

    const animate = () => {
      const elapsed = performance.now() - startTimeRef.current + LEAD_TIME_MS
      const duration = audioDuration > 0 ? audioDuration * 1000 : words.length * 280
      const progress = Math.min(elapsed / duration, 1)
      const wordIndex = Math.min(Math.floor(progress * words.length), words.length - 1)

      setCurrentWordIndex(wordIndex)

      if (progress < 1 && isSpeaking) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, isSpeaking, words.length, audioDuration])

  // Reset when slide changes
  useEffect(() => {
    setCurrentWordIndex(-1)
    startTimeRef.current = 0
  }, [text])

  return (
    <p className="text-white text-lg md:text-xl text-center max-w-2xl mx-auto flex flex-wrap justify-center gap-x-2 gap-y-1">
      {words.map((word, idx) => {
        const isActive = idx === currentWordIndex
        const isPast = idx < currentWordIndex
        const isFuture = idx > currentWordIndex && currentWordIndex >= 0

        return (
          <span
            key={`${idx}-${word}`}
            className={cn(
              "transition-all duration-150 inline-block",
              isActive && "scale-110 font-bold text-primary drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]",
              isPast && "text-white/90",
              isFuture && "text-white/50",
              !isActive && !isPast && !isFuture && "text-white",
            )}
            style={{
              transform: isActive ? "scale(1.15)" : isPast ? "scale(1)" : "scale(0.95)",
              textShadow: isActive ? "0 0 20px rgba(255,255,255,0.9), 0 0 40px rgba(56,178,172,0.6)" : "none",
            }}
          >
            {word}
          </span>
        )
      })}
    </p>
  )
}

export default function StoriesPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [slideshow, setSlideshow] = useState<SlideData[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [storyData, setStoryData] = useState<StoryData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [showButtons, setShowButtons] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null)
  const waitingForSpeechRef = useRef(false)
  const [audioDuration, setAudioDuration] = useState(0)

  const { speak, stop: stopSpeech, isSpeaking, isLoading: isSpeechLoading } = useElevenLabs()

  useEffect(() => {
    fetch("/api/generate-story-video")
      .then((res) => res.json())
      .then((data) => setScenarios(data.scenarios || []))
      .catch((err) => console.error("Failed to load scenarios:", err))
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).__innerVoiceAutoPlayStory) {
      const scenario = (window as any).__innerVoiceAutoPlayStory
      delete (window as any).__innerVoiceAutoPlayStory
      generateStory(scenario)
    }
  }, [])

  useEffect(() => {
    if (!isLoading) {
      setLoadingProgress(0)
      return
    }

    const messages = [
      "Creating your story...",
      "Drawing scene 1 of 5...",
      "Drawing scene 2 of 5...",
      "Drawing scene 3 of 5...",
      "Drawing scene 4 of 5...",
      "Drawing scene 5 of 5...",
      "Almost ready...",
    ]
    let messageIndex = 0
    let progress = 0

    const messageInterval = setInterval(() => {
      messageIndex = Math.min(messageIndex + 1, messages.length - 1)
      setLoadingMessage(messages[messageIndex])
    }, 8000)

    const progressInterval = setInterval(() => {
      progress = Math.min(progress + 1.5, 95)
      setLoadingProgress(progress)
    }, 1000)

    setLoadingMessage(messages[0])

    return () => {
      clearInterval(messageInterval)
      clearInterval(progressInterval)
    }
  }, [isLoading])

  const speakNarration = useCallback(
    async (text: string) => {
      if (isMuted) return
      waitingForSpeechRef.current = true
      // Estimate duration: ~280ms per word for natural speech
      const words = text.split(/\s+/).filter((w) => w.length > 0)
      setAudioDuration(words.length * 0.28)
      await speak(text, { speed: "normal", emotion: "calm" })
    },
    [isMuted, speak],
  )

  useEffect(() => {
    if (waitingForSpeechRef.current && !isSpeaking && !isSpeechLoading && isPlaying) {
      waitingForSpeechRef.current = false

      slideTimerRef.current = setTimeout(() => {
        if (currentSlide < slideshow.length - 1) {
          setCurrentSlide((prev) => prev + 1)
        } else {
          setIsPlaying(false)
          setShowButtons(true)
        }
      }, 1000)
    }

    return () => {
      if (slideTimerRef.current) {
        clearTimeout(slideTimerRef.current)
      }
    }
  }, [isSpeaking, isSpeechLoading, isPlaying, currentSlide, slideshow.length])

  useEffect(() => {
    if (isPlaying && slideshow.length > 0 && slideshow[currentSlide]) {
      speakNarration(slideshow[currentSlide].narration)
    }
  }, [currentSlide, isPlaying, slideshow, speakNarration])

  const generateStory = async (scenarioId: string) => {
    setSelectedScenario(scenarioId)
    setIsLoading(true)
    setError(null)
    setSlideshow([])
    setCurrentSlide(0)
    setStoryData(null)
    setError(null)
    setShowButtons(false)
    setIsPlaying(false)

    try {
      const response = await fetch("/api/generate-story-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: scenarioId }),
      })

      const data = await response.json()
      setLoadingProgress(100)

      if (data.slideshow && data.slideshow.length > 0) {
        setSlideshow(data.slideshow)
        setStoryData(data.storyData)
        setTimeout(() => {
          setIsPlaying(true)
        }, 500)
      } else if (data.error) {
        setError(data.error)
        if (data.storyData) {
          setStoryData(data.storyData)
          setShowButtons(true)
        }
      }
    } catch (err) {
      setError("Failed to create story. Please try again.")
      console.error("Story generation error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleButtonSpeak = (phrase: string) => {
    speak(phrase, { speed: "normal", emotion: "happy" })
  }

  const goBack = () => {
    setSelectedScenario(null)
    setSlideshow([])
    setCurrentSlide(0)
    setStoryData(null)
    setError(null)
    setShowButtons(false)
    setIsPlaying(false)
    stopSpeech()
  }

  const nextSlide = () => {
    if (currentSlide < slideshow.length - 1) {
      stopSpeech()
      waitingForSpeechRef.current = false
      setCurrentSlide((prev) => prev + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      stopSpeech()
      waitingForSpeechRef.current = false
      setCurrentSlide((prev) => prev - 1)
    }
  }

  const togglePlay = () => {
    if (isPlaying) {
      stopSpeech()
      waitingForSpeechRef.current = false
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (!isMuted) {
      stopSpeech()
    }
    setIsMuted(!isMuted)
  }

  if (!selectedScenario) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 pb-24">
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Visual Stories</h1>
            <p className="text-muted-foreground">Watch stories to learn what to expect in different situations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => generateStory(scenario.id)}
                className="bg-white rounded-2xl p-6 shadow-sm border-2 border-transparent hover:border-primary hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground mb-1">{scenario.title}</h3>
                    <p className="text-sm text-muted-foreground">{scenario.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <AIHelper />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
            <div
              className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"
              style={{ animationDuration: "1.5s" }}
            ></div>
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">{Math.round(loadingProgress)}%</span>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">{loadingMessage}</h2>
          <p className="text-muted-foreground text-sm">This usually takes about 30-60 seconds</p>
          <div className="mt-4 w-full bg-primary/10 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        <Button variant="ghost" size="icon" onClick={goBack} className="bg-black/50 text-white hover:bg-black/70">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={toggleMute} className="bg-black/50 text-white hover:bg-black/70">
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => generateStory(selectedScenario)}
            className="bg-black/50 text-white hover:bg-black/70"
          >
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {slideshow.length > 0 ? (
          <>
            <div className="flex-1 relative">
              <img
                src={slideshow[currentSlide].imageUrl || "/placeholder.svg"}
                alt={`Scene ${currentSlide + 1}`}
                className="w-full h-full object-contain"
              />

              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className={cn(
                  "absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center transition-opacity",
                  currentSlide === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-black/70",
                )}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                disabled={currentSlide === slideshow.length - 1}
                className={cn(
                  "absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center transition-opacity",
                  currentSlide === slideshow.length - 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-black/70",
                )}
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-16">
                <AnimatedNarration
                  text={slideshow[currentSlide].narration}
                  isPlaying={isPlaying}
                  isSpeaking={isSpeaking}
                  audioDuration={audioDuration}
                />
              </div>

              <button
                onClick={togglePlay}
                className="absolute bottom-24 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
              >
                {isPlaying ? (
                  <div className="flex gap-1">
                    <div className="w-1 h-4 bg-white rounded"></div>
                    <div className="w-1 h-4 bg-white rounded"></div>
                  </div>
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </button>
            </div>

            <div className="bg-black py-3 flex justify-center gap-2">
              {slideshow.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    stopSpeech()
                    waitingForSpeechRef.current = false
                    setCurrentSlide(idx)
                    setIsPlaying(false)
                    speakNarration(slideshow[idx].narration)
                  }}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    idx === currentSlide ? "w-6 bg-primary" : "bg-white/40 hover:bg-white/60",
                  )}
                />
              ))}
            </div>
          </>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center text-white">
            <div className="text-center p-8">
              <p className="text-xl mb-4">{error}</p>
              <Button onClick={() => generateStory(selectedScenario)}>Try Again</Button>
            </div>
          </div>
        ) : null}
      </div>

      {showButtons && storyData && (
        <div className="bg-gradient-to-t from-amber-50 to-white p-6 animate-in slide-in-from-bottom duration-500">
          <h3 className="text-lg font-semibold text-center mb-4">Practice these phrases:</h3>
          <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
            {storyData.buttons.map((btn, idx) => (
              <Button
                key={idx}
                onClick={() => handleButtonSpeak(btn.phrase)}
                variant="outline"
                className="h-auto py-3 px-4 text-left flex flex-col items-start gap-1 hover:bg-primary/5 hover:border-primary"
              >
                <span className="font-medium">{btn.label}</span>
                <span className="text-xs text-muted-foreground">{btn.phrase}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      <AIHelper />
    </div>
  )
}
