"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeftIcon, CheckIcon, PlayIcon } from "@/components/icons"
import { useElevenLabs } from "@/hooks/use-elevenlabs"
import { InnerVoiceLogo } from "@/components/innervoice-logo"

// Sample story data
const STORIES = [
  {
    id: "kenji-drink",
    title: "Kenji Gets a Drink",
    description: "Learn to ask for what you need",
    thumbnail: "/anime-boy-thirsty-sunny-day.jpg",
    panels: [
      {
        imagePrompt: "anime boy playing outside in sunny backyard, looking hot and thirsty, Ghibli style",
        narration: "Kenji was playing outside. The sun was hot and he felt very thirsty.",
        scenario: "Kenji needs a drink. What should he say?",
        options: ["DRINK", "HELP", "STOP", "MORE"],
        correctOption: "DRINK",
      },
      {
        imagePrompt: "anime mom smiling handing glass of water to happy boy in kitchen, warm lighting, Ghibli style",
        narration: "Kenji said DRINK to his mom. She smiled and got him water.",
        scenario: "The water was good! Kenji wants more. What should he say?",
        options: ["MORE", "ALL DONE", "HELP", "STOP"],
        correctOption: "MORE",
      },
      {
        imagePrompt: "anime boy drinking water happily, satisfied expression, mom watching fondly, Ghibli style",
        narration: "Mom poured more water. Kenji drank it all. His tummy was full.",
        scenario: "Kenji is not thirsty anymore. What should he say?",
        options: ["ALL DONE", "MORE", "DRINK", "HELP"],
        correctOption: "ALL DONE",
      },
    ],
  },
  {
    id: "brave-helper",
    title: "The Brave Helper",
    description: "Asking for help when stuck",
    thumbnail: "/anime-child-puzzle-pieces-colorful.jpg",
    panels: [
      {
        imagePrompt: "anime child looking puzzled at difficult puzzle on table, cozy room, Ghibli style",
        narration: "Maya was working on a big puzzle. Some pieces were really hard to find.",
        scenario: "Maya is stuck and needs assistance. What should she say?",
        options: ["HELP", "MORE", "STOP", "DRINK"],
        correctOption: "HELP",
      },
      {
        imagePrompt: "anime dad kneeling beside child helping with puzzle, warm family moment, Ghibli style",
        narration: "Maya said HELP. Dad came over and helped her find the right pieces.",
        scenario: "They finished a section! Maya wants to keep going. What should she say?",
        options: ["MORE", "ALL DONE", "STOP", "HELP"],
        correctOption: "MORE",
      },
      {
        imagePrompt: "anime child and dad high-fiving over completed puzzle, celebration, Ghibli style",
        narration: "Together they finished the whole puzzle! Maya felt so proud.",
        scenario: "The puzzle is complete! What should Maya say?",
        options: ["ALL DONE", "HELP", "MORE", "DRINK"],
        correctOption: "ALL DONE",
      },
    ],
  },
  {
    id: "ice-cream-wait",
    title: "Waiting for Ice Cream",
    description: "Practicing patience",
    thumbnail: "/anime-ice-cream-shop-colorful.jpg",
    panels: [
      {
        imagePrompt: "anime family standing in line at ice cream shop, child looking eager, Ghibli style",
        narration: "The family went to get ice cream. There was a long line at the shop.",
        scenario: "Mom says they need to be patient. What should Kenji practice?",
        options: ["WAIT", "MORE", "HELP", "STOP"],
        correctOption: "WAIT",
      },
      {
        imagePrompt: "anime child waiting patiently in line, ice cream counter getting closer, Ghibli style",
        narration: "Kenji waited nicely. The line moved forward slowly but surely.",
        scenario: "Almost there! Should Kenji keep waiting?",
        options: ["WAIT", "STOP", "ALL DONE", "DRINK"],
        correctOption: "WAIT",
      },
      {
        imagePrompt: "anime child happily eating colorful ice cream cone, big smile, Ghibli style",
        narration: "Finally! Kenji got his favorite ice cream. Waiting was worth it!",
        scenario: "Kenji finished his ice cream. What should he say?",
        options: ["ALL DONE", "MORE", "WAIT", "HELP"],
        correctOption: "ALL DONE",
      },
    ],
  },
  {
    id: "making-friend",
    title: "Making a Friend",
    description: "Starting conversations",
    thumbnail: "/anime-children-playground-friendly.jpg",
    panels: [
      {
        imagePrompt: "anime child watching other kids play at playground, wanting to join, Ghibli style",
        narration: "At the playground, Hana saw kids playing. She wanted to join them.",
        scenario: "Hana wants to say hello. What should she say?",
        options: ["HI", "STOP", "ALL DONE", "HELP"],
        correctOption: "HI",
      },
      {
        imagePrompt: "anime children inviting new friend to play together, smiling faces, Ghibli style",
        narration: "Hana said HI! The other kids smiled and asked her to play.",
        scenario: "They ask if Hana wants to play. What should she say?",
        options: ["YES", "NO", "STOP", "WAIT"],
        correctOption: "YES",
      },
      {
        imagePrompt: "anime children playing happily together on playground, new friends, Ghibli style",
        narration: "Hana played with her new friends. They had so much fun together!",
        scenario: "Time to go home. Hana wants to say goodbye. What should she say?",
        options: ["BYE", "MORE", "HELP", "YES"],
        correctOption: "BYE",
      },
    ],
  },
]

function AnimatedNarration({
  text,
  isSpeaking,
  onComplete,
}: {
  text: string
  isSpeaking: boolean
  onComplete?: () => void
}) {
  const [currentWordIndex, setCurrentWordIndex] = useState(-1)
  const words = text.split(" ")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Average speaking rate: ~150 words per minute = ~400ms per word
  // Adjust based on ElevenLabs speaking rate
  const msPerWord = 350

  useEffect(() => {
    if (isSpeaking && words.length > 0) {
      // Reset to first word when speech starts
      setCurrentWordIndex(0)

      // Clear any existing interval
      if (intervalRef.current) clearInterval(intervalRef.current)

      // Advance through words at speaking rate
      intervalRef.current = setInterval(() => {
        setCurrentWordIndex((prev) => {
          if (prev >= words.length - 1) {
            if (intervalRef.current) clearInterval(intervalRef.current)
            onComplete?.()
            return prev
          }
          return prev + 1
        })
      }, msPerWord)
    } else if (!isSpeaking) {
      setCurrentWordIndex(-1)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isSpeaking, words.length, onComplete, msPerWord])

  return (
    <p className="text-xl md:text-2xl text-center leading-relaxed">
      {words.map((word, index) => {
        const isActive = isSpeaking && index === currentWordIndex
        const isPast = isSpeaking && index < currentWordIndex
        const isFuture = isSpeaking && index > currentWordIndex

        return (
          <span key={index}>
            <span
              className={`
                inline-block transition-all duration-150
                ${isActive ? "font-bold text-[#E53E3E] scale-110" : ""}
                ${isPast ? "text-foreground font-semibold" : ""}
                ${isFuture ? "text-muted-foreground/60" : ""}
                ${!isSpeaking ? "text-foreground" : ""}
              `}
              style={
                isActive
                  ? {
                      textShadow: "0 0 15px rgba(229, 62, 62, 0.4)",
                      transform: "scale(1.1)",
                      display: "inline-block",
                    }
                  : {}
              }
            >
              {word}
            </span>
            {index < words.length - 1 ? " " : ""}
          </span>
        )
      })}
    </p>
  )
}

function LoadingAnimation() {
  const [messageIndex, setMessageIndex] = useState(0)
  const [dotCount, setDotCount] = useState(1)
  const messages = ["Painting the scene", "Adding magic", "Almost there", "Creating wonders", "Just a moment"]

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 2000)

    const dotInterval = setInterval(() => {
      setDotCount((prev) => (prev % 3) + 1)
    }, 400)

    return () => {
      clearInterval(messageInterval)
      clearInterval(dotInterval)
    }
  }, [messages.length])

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
      <InnerVoiceLogo className="animate-pulse mb-6" size={80} />

      <div className="flex gap-2 mb-6">
        <span
          className="w-4 h-4 bg-[#E53E3E] rounded-full animate-bounce"
          style={{ animationDelay: "0ms", animationDuration: "0.6s" }}
        />
        <span
          className="w-4 h-4 bg-amber-500 rounded-full animate-bounce"
          style={{ animationDelay: "150ms", animationDuration: "0.6s" }}
        />
        <span
          className="w-4 h-4 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "300ms", animationDuration: "0.6s" }}
        />
      </div>

      <p className="text-lg text-muted-foreground font-medium">
        {messages[messageIndex]}
        {".".repeat(dotCount)}
      </p>
    </div>
  )
}

export default function StoryModePage() {
  const [selectedStory, setSelectedStory] = useState<(typeof STORIES)[0] | null>(null)
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0)
  const [panelImage, setPanelImage] = useState<string | null>(null)
  const [isLoadingImage, setIsLoadingImage] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [showFeedback, setShowFeedback] = useState<"correct" | "hint" | "custom" | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [isSpeakingNarration, setIsSpeakingNarration] = useState(false)
  const [isSpeakingScenario, setIsSpeakingScenario] = useState(false)
  const [typedAnswer, setTypedAnswer] = useState("")
  const [showTextInput, setShowTextInput] = useState(false)
  const [speechPhase, setSpeechPhase] = useState<"idle" | "narration" | "scenario" | "feedback" | "done">("idle")
  const speechStartedForPanel = useRef<number | null>(null)
  const speechCancelledRef = useRef(false)
  const currentPanelIndexRef = useRef<number>(0)
  const [showOptions, setShowOptions] = useState(true)

  const { speak, isSpeaking, stop } = useElevenLabs()
  const imageCache = useRef<Map<string, string>>(new Map())

  const currentPanel = selectedStory?.panels[currentPanelIndex]

  useEffect(() => {
    setPanelImage(null)
    setShowFeedback(null)
    setImageError(false)
    setSpeechPhase("idle")
    setIsSpeakingNarration(false)
    setIsSpeakingScenario(false)
    speechStartedForPanel.current = null
    speechCancelledRef.current = false
    currentPanelIndexRef.current = currentPanelIndex
  }, [currentPanelIndex])

  useEffect(() => {
    if (
      !currentPanel ||
      isLoadingImage ||
      speechPhase !== "idle" ||
      speechStartedForPanel.current === currentPanelIndex
    ) {
      return
    }

    speechStartedForPanel.current = currentPanelIndex
    speechCancelledRef.current = false

    const runSpeechSequence = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))

      if (speechCancelledRef.current) return

      setSpeechPhase("narration")
      setIsSpeakingNarration(true)

      try {
        await speak(currentPanel.narration)
      } catch (error) {
        console.error("Narration speech error:", error)
      }

      if (speechCancelledRef.current) return

      setIsSpeakingNarration(false)

      await new Promise((resolve) => setTimeout(resolve, 600))

      if (speechCancelledRef.current) return

      setSpeechPhase("scenario")
      setIsSpeakingScenario(true)

      try {
        await speak(currentPanel.scenario)
      } catch (error) {
        console.error("Scenario speech error:", error)
      }

      if (speechCancelledRef.current) return

      setIsSpeakingScenario(false)
      setSpeechPhase("done")
    }

    runSpeechSequence()

    return () => {
      speechCancelledRef.current = true
    }
  }, [currentPanel, isLoadingImage, speechPhase, currentPanelIndex, speak])

  const handleTypedSubmit = useCallback(() => {
    if (typedAnswer.trim() && currentPanel) {
      speechCancelledRef.current = true
      stop()
      setIsSpeakingNarration(false)
      setIsSpeakingScenario(false)
      setSpeechPhase("feedback")
      speak(typedAnswer.trim())
      setShowFeedback("custom")
      setShowOptions(false)
    }
  }, [typedAnswer, currentPanel, stop, speak])

  const handleOptionSelect = useCallback(
    (option: string, isCorrect: boolean) => {
      if (!currentPanel) return
      speechCancelledRef.current = true
      stop()
      setIsSpeakingNarration(false)
      setIsSpeakingScenario(false)
      setSpeechPhase("feedback")
      speak(option)
      setShowFeedback(isCorrect ? "correct" : "hint")
      setShowOptions(false)
    },
    [currentPanel, stop, speak],
  )

  const handleStartStory = (story: (typeof STORIES)[0]) => {
    speechCancelledRef.current = true
    stop()
    setSelectedStory(story)
    setCurrentPanelIndex(0)
    setIsComplete(false)
    setSpeechPhase("idle")
    speechStartedForPanel.current = null
    setShowOptions(true)
    setShowFeedback(null)
    setTypedAnswer("")
    setShowTextInput(false)
    setIsLoadingImage(true)
  }

  const handleBackToSelector = () => {
    speechCancelledRef.current = true
    stop()
    setSelectedStory(null)
    setCurrentPanelIndex(0)
    setPanelImage(null)
    setIsComplete(false)
    setSpeechPhase("idle")
    speechStartedForPanel.current = null
    setShowOptions(true)
    setShowFeedback(null)
    setTypedAnswer("")
    setShowTextInput(false)
    setIsLoadingImage(true)
  }

  const handleRestartStory = () => {
    speechCancelledRef.current = true
    stop()
    speechStartedForPanel.current = null
    setSpeechPhase("idle")
    setCurrentPanelIndex(0)
    setIsComplete(false)
    setShowOptions(true)
    setShowFeedback(null)
    setTypedAnswer("")
    setShowTextInput(false)
    setIsLoadingImage(true)
  }

  const generatePanelImage = useCallback(async (prompt: string) => {
    if (!prompt) {
      console.error("[v0] generatePanelImage called without prompt")
      setImageError(true)
      setIsLoadingImage(false)
      return
    }

    if (imageCache.current.has(prompt)) {
      setPanelImage(imageCache.current.get(prompt)!)
      setIsLoadingImage(false)
      setImageError(false)
      return
    }

    setIsLoadingImage(true)
    setPanelImage(null)
    setImageError(false)

    try {
      const response = await fetch("/api/generate-context-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phrase: prompt,
          emotion: "happy",
          category: "story",
          contextHint: prompt,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.imageUrl) {
          imageCache.current.set(prompt, data.imageUrl)
          setPanelImage(data.imageUrl)
        } else {
          setImageError(true)
        }
      } else {
        setImageError(true)
      }
    } catch (error) {
      console.error("[v0] Failed to generate panel image:", error)
      setImageError(true)
    } finally {
      setIsLoadingImage(false)
    }
  }, [])

  useEffect(() => {
    if (currentPanel?.imagePrompt) {
      generatePanelImage(currentPanel.imagePrompt)
    }
  }, [currentPanel?.imagePrompt, generatePanelImage])

  const handleNextPanel = useCallback(() => {
    if (selectedStory && currentPanelIndex < selectedStory.panels.length - 1) {
      speechCancelledRef.current = true
      stop()
      speechStartedForPanel.current = null
      setCurrentPanelIndex((prev) => {
        return prev + 1
      })
      setShowOptions(true)
      setShowFeedback(null)
      setTypedAnswer("")
      setShowTextInput(false)
      setIsLoadingImage(true)
    }
  }, [selectedStory, currentPanelIndex, stop])

  const handlePrevPanel = useCallback(() => {
    if (currentPanelIndex > 0) {
      speechCancelledRef.current = true
      stop()
      speechStartedForPanel.current = null
      setCurrentPanelIndex((prev) => {
        return prev - 1
      })
      setShowOptions(true)
      setShowFeedback(null)
      setTypedAnswer("")
      setShowTextInput(false)
      setIsLoadingImage(true)
    }
  }, [currentPanelIndex, stop])

  const handleRetryImage = useCallback(() => {
    if (currentPanel?.imagePrompt) {
      generatePanelImage(currentPanel.imagePrompt)
    }
  }, [currentPanel?.imagePrompt, generatePanelImage])

  if (!selectedStory) {
    return (
      <main className="flex-1 flex flex-col p-6 md:p-8 bg-[#FDF6E9] min-h-[calc(100vh-140px)]">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <PlayIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">Story Mode</h1>
            <p className="text-xl text-muted-foreground">Control the story with your words</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {STORIES.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="aspect-video relative bg-gradient-to-br from-primary/10 to-primary/5">
                  <Image src={story.thumbnail || "/placeholder.svg"} alt={story.title} fill className="object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-foreground mb-2">{story.title}</h3>
                  <p className="text-muted-foreground mb-4">{story.description}</p>
                  <button
                    onClick={() => handleStartStory(story)}
                    className="w-full py-3 px-6 bg-[#E53E3E] text-white rounded-xl font-semibold hover:bg-[#C53030] transition-colors flex items-center justify-center gap-2"
                  >
                    <PlayIcon className="w-5 h-5" />
                    Start Story
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (isComplete) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-8 bg-[#FDF6E9] min-h-[calc(100vh-140px)]">
        <div className="text-center max-w-lg">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckIcon className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Story Complete!</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Great job finishing "{selectedStory.title}"! You practiced your words perfectly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRestartStory}
              className="py-3 px-8 bg-white border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary/5 transition-colors"
            >
              Read Again
            </button>
            <button
              onClick={handleBackToSelector}
              className="py-3 px-8 bg-[#E53E3E] text-white rounded-xl font-semibold hover:bg-[#C53030] transition-colors"
            >
              Choose Another Story
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 flex flex-col p-4 md:p-6 bg-[#FDF6E9] min-h-[calc(100vh-140px)]">
      <div className="flex items-center justify-between mb-4 max-w-4xl mx-auto w-full">
        <button
          onClick={handleBackToSelector}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Back</span>
        </button>
        <h2 className="font-semibold text-foreground">{selectedStory.title}</h2>
        <span className="text-sm text-muted-foreground">
          Panel {currentPanelIndex + 1} of {selectedStory.panels.length}
        </span>
      </div>

      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        <div className="aspect-video relative rounded-2xl overflow-hidden shadow-lg mb-6 bg-gradient-to-br from-primary/10 to-primary/5">
          {isLoadingImage ? (
            <LoadingAnimation />
          ) : panelImage && !imageError ? (
            <Image
              src={panelImage || "/placeholder.svg"}
              alt="Story panel"
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
              <InnerVoiceLogo className="mb-4 opacity-60" size={60} />
              <p className="text-muted-foreground mb-4">Image could not load</p>
              <button
                onClick={handleRetryImage}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 shadow-md mb-6">
          <AnimatedNarration text={currentPanel?.narration || ""} isSpeaking={isSpeakingNarration} />
        </div>

        <div className="text-center mb-4">
          <AnimatedNarration text={currentPanel?.scenario || ""} isSpeaking={isSpeakingScenario} />
        </div>

        {showFeedback && (
          <div
            className={`text-center mb-4 font-semibold text-lg flex items-center justify-center gap-2 ${
              showFeedback === "correct" ? "text-green-600" : "text-[#E53E3E]"
            }`}
          >
            {showFeedback === "correct" ? (
              <>
                <CheckIcon className="w-6 h-6" />
                Great choice!
              </>
            ) : showFeedback === "custom" ? (
              <p className="text-[#E53E3E]">You said: {typedAnswer}</p>
            ) : (
              "Try the green one!"
            )}
          </div>
        )}

        <div className="text-center mb-4">
          <button
            onClick={() => setShowTextInput(!showTextInput)}
            className="text-sm text-primary hover:text-primary/80 transition-colors underline"
          >
            {showTextInput ? "Use buttons instead" : "Type your answer"}
          </button>
        </div>

        {showTextInput ? (
          <div className="max-w-lg mx-auto w-full mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTypedSubmit()}
                placeholder="Type your answer..."
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-lg"
                disabled={isSpeaking}
              />
              <button
                onClick={handleTypedSubmit}
                disabled={isSpeaking || !typedAnswer.trim()}
                className="px-6 py-3 bg-[#E53E3E] text-white rounded-xl font-semibold hover:bg-[#C53030] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Say it!
              </button>
            </div>
            <p className="text-sm text-muted-foreground mt-2 text-center">Hint: {currentPanel?.options.join(", ")}</p>
          </div>
        ) : (
          showOptions && (
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto w-full">
              {currentPanel?.options.map((option) => {
                const isCorrect = option === currentPanel.correctOption
                return (
                  <button
                    key={option}
                    onClick={() => handleOptionSelect(option, isCorrect)}
                    disabled={isSpeaking}
                    className={`
                    py-4 px-6 rounded-xl font-bold text-xl transition-all
                    ${
                      isCorrect
                        ? "bg-white border-2 border-green-500 text-green-700 shadow-[0_0_15px_rgba(72,187,120,0.4)]"
                        : "bg-white border-2 border-gray-200 text-foreground hover:border-gray-300"
                    }
                    ${isSpeaking ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"}
                  `}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          )
        )}

        <div className="flex justify-center gap-6 mb-6">
          <button
            onClick={handlePrevPanel}
            disabled={currentPanelIndex === 0 || isSpeaking}
            className="px-8 py-3 bg-[#E53E3E] text-white rounded-xl font-semibold hover:bg-[#C53030] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={handleNextPanel}
            disabled={currentPanelIndex >= (selectedStory?.panels.length || 0) - 1 || isSpeaking}
            className="px-8 py-3 bg-[#E53E3E] text-white rounded-xl font-semibold hover:bg-[#C53030] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => {
              if (currentPanelIndex < selectedStory.panels.length - 1) {
                setCurrentPanelIndex((prev) => {
                  return prev + 1
                })
              } else {
                setIsComplete(true)
              }
            }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip this panel
          </button>
        </div>
      </div>
    </main>
  )
}
