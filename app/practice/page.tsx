"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useElevenLabs } from "@/hooks/use-elevenlabs"
import { InnerVoiceLogo } from "@/components/innervoice-logo"
import { SparklesIcon } from "@/components/icons"
import { PRACTICE_IMAGES } from "@/lib/image-manifest"
import { useRoutePreload } from "@/hooks/use-progressive-image"

// Practice scenarios with cached image paths
// Images are pre-generated in Studio Ghibli anime style and stored in /public/images/practice/
const SCENARIOS = [
  {
    prompt: "You're thirsty. What do you say?",
    options: ["DRINK", "EAT", "PLAY", "HELP"],
    correct: "DRINK",
    cachedImage: PRACTICE_IMAGES.scenarios[0].image,
    imagePrompt: "A child looking thirsty on a sunny day, reaching for a glass of water, Ghibli anime style",
    emotion: "hopeful",
  },
  {
    prompt: "You want to stop doing something. What do you say?",
    options: ["MORE", "STOP", "GO", "WANT"],
    correct: "STOP",
    cachedImage: PRACTICE_IMAGES.scenarios[1].image,
    imagePrompt: "A child holding up their hand in a 'stop' gesture, gentle expression, Ghibli anime style",
    emotion: "calm",
  },
  {
    prompt: "You're hungry. What do you say?",
    options: ["SLEEP", "PLAY", "EAT", "LOOK"],
    correct: "EAT",
    cachedImage: PRACTICE_IMAGES.scenarios[2].image,
    imagePrompt: "A child sitting at a table looking hungry with an empty plate, Ghibli anime style, warm kitchen",
    emotion: "hopeful",
  },
  {
    prompt: "You need assistance. What do you say?",
    options: ["BYE", "NO", "HELP", "YES"],
    correct: "HELP",
    cachedImage: PRACTICE_IMAGES.scenarios[3].image,
    imagePrompt: "A child raising their hand asking for help from a kind adult, Ghibli anime style, classroom",
    emotion: "hopeful",
  },
  {
    prompt: "You want more of something. What do you say?",
    options: ["STOP", "MORE", "ALL DONE", "WAIT"],
    correct: "MORE",
    cachedImage: PRACTICE_IMAGES.scenarios[4].image,
    imagePrompt: "A happy child holding out their bowl for more food, Ghibli anime style, cozy dining room",
    emotion: "happy",
  },
]

const LEAD_TIME_SECONDS = 0.2 // Highlight word slightly before it's spoken

function AnimatedText({
  text,
  isAnimating,
  estimatedDuration,
}: {
  text: string
  isAnimating: boolean
  estimatedDuration: number
}) {
  const [currentWordIndex, setCurrentWordIndex] = useState(-1)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const words = text.split(" ")

  useEffect(() => {
    if (isAnimating && estimatedDuration > 0) {
      startTimeRef.current = Date.now()
      setCurrentWordIndex(0)

      const animate = () => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000
        const adjustedTime = elapsed + LEAD_TIME_SECONDS
        const progress = Math.min(adjustedTime / estimatedDuration, 1)
        const wordIndex = Math.floor(progress * words.length)

        setCurrentWordIndex(Math.min(wordIndex, words.length - 1))

        if (elapsed < estimatedDuration) {
          animationRef.current = requestAnimationFrame(animate)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    } else if (!isAnimating) {
      setCurrentWordIndex(-1)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isAnimating, estimatedDuration, words.length])

  return (
    <span className="flex flex-wrap justify-center gap-x-2">
      {words.map((word, index) => {
        const isActive = index === currentWordIndex
        const isPast = index < currentWordIndex
        const isFuture = index > currentWordIndex || currentWordIndex === -1

        return (
          <span
            key={index}
            className={`
              transition-all duration-150 inline-block
              ${
                isActive
                  ? "scale-110 font-bold text-primary"
                  : isPast
                    ? "opacity-90 font-semibold"
                    : isFuture
                      ? "opacity-50"
                      : ""
              }
            `}
            style={
              isActive
                ? {
                    textShadow: "0 0 12px rgba(20, 184, 166, 0.5)",
                  }
                : undefined
            }
          >
            {word}
          </span>
        )
      })}
    </span>
  )
}

function AnimatedWord({
  word,
  isAnimating,
}: {
  word: string
  isAnimating: boolean
}) {
  return (
    <span
      className={`
        transition-all duration-200 inline-block
        ${isAnimating ? "scale-125 text-primary font-black" : ""}
      `}
      style={
        isAnimating
          ? {
              textShadow: "0 0 20px rgba(20, 184, 166, 0.6)",
            }
          : undefined
      }
    >
      {word}
    </span>
  )
}

export default function PracticePage() {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [shakeButton, setShakeButton] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)

  const [contextImage, setContextImage] = useState<string | null>(null)
  const [isLoadingImage, setIsLoadingImage] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState("Making magic...")
  const imageCache = useRef<Record<number, string>>({})
  const currentScenarioRef = useRef(currentScenario)
  const abortControllerRef = useRef<AbortController | null>(null)

  const { speak, isSpeaking } = useElevenLabs()

  // Keep ref in sync with state
  useEffect(() => {
    currentScenarioRef.current = currentScenario
  }, [currentScenario])
  const [speakingText, setSpeakingText] = useState<string | null>(null)
  const [speakingButton, setSpeakingButton] = useState<string | null>(null)
  const [estimatedDuration, setEstimatedDuration] = useState(0)

  const scenario = SCENARIOS[currentScenario]

  const estimateDuration = useCallback((text: string) => {
    const words = text.split(" ").length
    return words * 0.35 // ~350ms per word for natural speech
  }, [])

  const speakWithAnimation = useCallback(
    async (text: string, isButton = false) => {
      const duration = estimateDuration(text)
      setEstimatedDuration(duration)

      if (isButton) {
        setSpeakingButton(text)
        setSpeakingText(null)
      } else {
        setSpeakingText(text)
        setSpeakingButton(null)
      }

      await speak(text)

      // Clear after estimated duration + buffer
      setTimeout(
        () => {
          setSpeakingText(null)
          setSpeakingButton(null)
        },
        duration * 1000 + 500,
      )
    },
    [speak, estimateDuration],
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      speakWithAnimation(scenario.prompt)
    }, 300)
    return () => clearTimeout(timer)
  }, [currentScenario, scenario.prompt, speakWithAnimation])

  const handleButtonClick = async (option: string) => {
    if (showSuccess || isSpeaking) return

    await speakWithAnimation(option, true)

    if (option === scenario.correct) {
      setShowSuccess(true)
      setShowHint(false)

      setTimeout(() => {
        speakWithAnimation("Great job!")
      }, 800)

      setTimeout(() => {
        if (currentScenario < SCENARIOS.length - 1) {
          setCurrentScenario((prev) => prev + 1)
          setShowSuccess(false)
        } else {
          setCompleted(true)
        }
      }, 2500)
    } else {
      setShakeButton(option)
      setShowHint(true)

      setTimeout(() => {
        speakWithAnimation("Try the green one!")
      }, 600)

      setTimeout(() => setShakeButton(null), 500)
    }
  }

  const loadContextImage = useCallback(async (scenarioIndex: number) => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Clear current image immediately when loading new one
    setContextImage(null)
    setIsLoadingImage(true)

    const currentScenarioData = SCENARIOS[scenarioIndex]

    // Check memory cache first
    if (imageCache.current[scenarioIndex]) {
      if (currentScenarioRef.current === scenarioIndex) {
        setContextImage(imageCache.current[scenarioIndex])
        setIsLoadingImage(false)
      }
      return
    }

    // Try cached image from /public/images/ first
    if (currentScenarioData.cachedImage) {
      try {
        const img = new window.Image()
        const imageLoaded = await new Promise<boolean>((resolve) => {
          img.onload = () => resolve(true)
          img.onerror = () => resolve(false)
          img.src = currentScenarioData.cachedImage
        })

        if (imageLoaded && currentScenarioRef.current === scenarioIndex) {
          imageCache.current[scenarioIndex] = currentScenarioData.cachedImage
          setContextImage(currentScenarioData.cachedImage)
          setIsLoadingImage(false)
          return
        }
      } catch {
        // Fall through to dynamic generation
      }
    }

    // Fallback to dynamic generation if cached image not available
    setLoadingMessage("Making magic...")

    const loadingMessages = ["Making magic...", "Painting the scene...", "Almost there..."]
    let messageIndex = 0
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length
      setLoadingMessage(loadingMessages[messageIndex])
    }, 2000)

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    try {
      const response = await fetch("/api/generate-context-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phrase: currentScenarioData.prompt,
          label: currentScenarioData.correct,
          category: "practice",
          emotion: currentScenarioData.emotion,
          contextHint: currentScenarioData.imagePrompt,
        }),
        signal: abortController.signal,
      })

      if (!response.ok) throw new Error("API error")

      const data = await response.json()
      if (data.imageUrl) {
        imageCache.current[scenarioIndex] = data.imageUrl
        if (currentScenarioRef.current === scenarioIndex) {
          setContextImage(data.imageUrl)
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }
      console.error("Failed to load context image:", err)
    } finally {
      clearInterval(messageInterval)
      if (currentScenarioRef.current === scenarioIndex) {
        setIsLoadingImage(false)
      }
    }
  }, [])

  useEffect(() => {
    loadContextImage(currentScenario)
  }, [currentScenario, loadContextImage])

  // Moved the useEffect for completed scenarios outside the conditional block
  useEffect(() => {
    if (completed) {
      speakWithAnimation("Amazing job! You completed all 5 practice scenarios!")
    }
  }, [completed, speakWithAnimation])

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">
            <SparklesIcon />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            <AnimatedText
              text="Amazing Job!"
              isAnimating={speakingText === "Amazing job! You completed all 5 practice scenarios!"}
              estimatedDuration={estimatedDuration}
            />
          </h1>
          <p className="text-gray-600 mb-8">You completed all 5 practice scenarios!</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between border-b border-amber-200">
        <Link href="/" className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
        <div className="text-lg font-semibold text-gray-700">
          Practice Mode - {currentScenario + 1} of {SCENARIOS.length}
        </div>
        <div className="w-24" /> {/* Spacer for centering */}
      </header>

      {/* Main content - Added two-column layout with image */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Context Image Section */}
        <div className="lg:w-1/2 relative bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center p-4 min-h-[300px] lg:min-h-0">
          {isLoadingImage ? (
            <div className="flex flex-col items-center gap-4">
              <InnerVoiceLogo className="w-20 h-20 animate-pulse" />
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span
                    className="w-2 h-2 bg-coral-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
                <span className="text-gray-600 font-medium">{loadingMessage}</span>
              </div>
            </div>
          ) : contextImage ? (
            <div className="relative w-full h-full max-w-lg max-h-[400px] lg:max-h-full">
              <Image
                src={contextImage || "/placeholder.svg"}
                alt={`Visual context for: ${scenario.prompt}`}
                fill
                className="object-contain rounded-2xl shadow-lg"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <InnerVoiceLogo className="w-20 h-20 animate-pulse" />
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span
                    className="w-2 h-2 bg-coral-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
                <span className="text-gray-600 font-medium">Generating image...</span>
              </div>
            </div>
          )}
        </div>

        {/* Practice Content Section */}
        <div className="lg:w-1/2 flex flex-col items-center justify-center p-6">
          {/* Progress dots */}
          <div className="flex gap-2 mb-6">
            {SCENARIOS.map((_, idx) => (
              <div
                key={idx}
                className={`w-3 h-3 rounded-full transition-colors ${
                  idx < currentScenario ? "bg-green-500" : idx === currentScenario ? "bg-primary" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Scenario prompt */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 max-w-md w-full text-center">
            <p className="text-xl text-gray-800 font-medium">
              <AnimatedText
                text={scenario.prompt}
                isAnimating={speakingText === scenario.prompt}
                estimatedDuration={estimatedDuration}
              />
            </p>
          </div>

          {/* Success message */}
          {showSuccess && (
            <div className="mb-4 text-2xl font-bold text-green-600 animate-bounce flex items-center justify-center gap-2">
              <AnimatedText
                text="Great job!"
                isAnimating={speakingText === "Great job!"}
                estimatedDuration={estimatedDuration}
              />
              <SparklesIcon className="w-6 h-6 text-amber-500" />
            </div>
          )}

          {/* Hint message */}
          {showHint && !showSuccess && (
            <div className="mb-4 text-lg text-amber-600 font-medium">
              <AnimatedText
                text="Try the green one!"
                isAnimating={speakingText === "Try the green one!"}
                estimatedDuration={estimatedDuration}
              />
            </div>
          )}

          {/* AAC Button Grid */}
          <div className="grid grid-cols-2 gap-4 max-w-sm w-full">
            {scenario.options.map((option) => {
              const isCorrect = option === scenario.correct
              const isShaking = shakeButton === option
              const isSpeakingThis = speakingButton === option
              const showGreen = showHint && isCorrect // Only show green after wrong attempt (hint)

              return (
                <button
                  key={option}
                  onClick={() => handleButtonClick(option)}
                  disabled={isSpeaking}
                  className={`
                    relative p-6 rounded-2xl font-bold text-xl transition-all duration-200
                    ${
                      showGreen
                        ? "bg-green-50 border-4 border-green-400 text-green-700 scale-105"
                        : "bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-md"
                    }
                    ${isShaking ? "animate-shake" : ""}
                    ${showSuccess && isCorrect ? "ring-4 ring-green-300 bg-green-50 border-4 border-green-400 text-green-700" : ""}
                    ${isSpeaking ? "cursor-not-allowed opacity-80" : ""}
                  `}
                  style={
                    showGreen
                      ? {
                          animation: "pulse-glow 2s ease-in-out infinite",
                          boxShadow: "0 0 20px rgba(34, 197, 94, 0.4)",
                        }
                      : {}
                  }
                >
                  <AnimatedWord word={option} isAnimating={isSpeakingThis} />
                </button>
              )
            })}
          </div>
        </div>
      </main>

      {/* Inline styles for animations */}
      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.4);
          }
          50% {
            box-shadow: 0 0 30px rgba(34, 197, 94, 0.6);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  )
}
