"use client"

import type React from "react"

import { useEffect, useState, useRef, useCallback } from "react"
import { X, Sparkles, Eye, Volume2 } from "lucide-react"
import type { Emotion } from "@/types"
import { cn } from "@/lib/utils"
import { getCachedImage, setCachedImage } from "@/lib/context-image-cache"
import { useAppStore } from "@/lib/store"
import * as Icons from "lucide-react"

interface ButtonData {
  id: string
  label: string
  text: string
  icon: string
  color: string
  category: string
  emotion: string
  contextHint?: string
}

interface LearningModalProps {
  isOpen: boolean
  text: string
  label?: string
  category?: string
  emotion: Emotion
  contextHint?: string
  contextImageUrl?: string
  onClose: () => void
  watchFirstMode?: boolean
  onWatchComplete?: () => void
  buttons?: ButtonData[]
  onButtonClick?: (button: ButtonData) => void
  activeButtonId?: string
}

function AnimatedWord({
  word,
  isActive,
  isPast,
}: {
  word: string
  isActive: boolean
  isPast: boolean
}) {
  return (
    <span
      className={cn(
        "inline-block transition-all duration-150 ease-out px-1 rounded",
        isActive && "font-bold text-primary scale-110",
        isPast && "text-foreground",
        !isActive && !isPast && "text-muted-foreground/50",
      )}
    >
      {word}
    </span>
  )
}

export function LearningModal({
  isOpen,
  text,
  label,
  category,
  emotion = "neutral",
  contextHint,
  contextImageUrl,
  onClose,
  watchFirstMode = false,
  onWatchComplete,
  buttons = [],
  onButtonClick,
  activeButtonId,
}: LearningModalProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [contextImage, setContextImage] = useState<string | null>(null)
  const [isLoadingImage, setIsLoadingImage] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Making magic...")
  const [imageFailed, setImageFailed] = useState(false)
  const [speechComplete, setSpeechComplete] = useState(false)
  const [imageShown, setImageShown] = useState(false)
  const [canClose, setCanClose] = useState(true)
  const [imageRendered, setImageRendered] = useState(false)
  const [watchFirstPhase, setWatchFirstPhase] = useState<"watch" | "try" | "done">("watch")
  const [showWatchPrompt, setShowWatchPrompt] = useState(false)

  const hasInitializedRef = useRef(false)
  const currentTextRef = useRef("")
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const imageUrlRef = useRef<string | null>(null)
  const blobUrlRef = useRef<string | null>(null)

  const { settings, trackModel } = useAppStore()
  const isModelingMode = settings.modelingMode
  const isWatchFirst = watchFirstMode || settings.watchFirstMode

  const words = text ? text.split(" ") : []

  const syncWordsToAudio = useCallback(() => {
    if (!audioRef.current || !isPlaying) return

    const audio = audioRef.current
    const duration = audio.duration || 2
    const LEAD_TIME_SECONDS = 0.2
    const adjustedTime = audio.currentTime + LEAD_TIME_SECONDS
    const progress = Math.min(adjustedTime / duration, 1)

    const totalWords = words.length
    const wordIndex = Math.min(Math.floor(progress * totalWords), totalWords - 1)

    if (wordIndex !== currentWordIndex && wordIndex >= 0) {
      setCurrentWordIndex(wordIndex)
    }

    if (!audio.paused && !audio.ended) {
      animationFrameRef.current = requestAnimationFrame(syncWordsToAudio)
    }
  }, [words, isPlaying, currentWordIndex])

  useEffect(() => {
    if (isOpen && text && text !== currentTextRef.current) {
      currentTextRef.current = text
      hasInitializedRef.current = false
      setContextImage(null)
      imageUrlRef.current = null
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
        blobUrlRef.current = null
      }
      setCurrentWordIndex(-1)
      setIsPlaying(false)
      setImageFailed(false)
      setSpeechComplete(false)
      setImageShown(false)
      setCanClose(true)
      setIsLoadingImage(false)
      setImageRendered(false)
      setWatchFirstPhase(isWatchFirst ? "watch" : "done")
      setShowWatchPrompt(isWatchFirst)

      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }

    if (!isOpen) {
      currentTextRef.current = ""
      hasInitializedRef.current = false
    }
  }, [isOpen, text, isWatchFirst])

  useEffect(() => {
    if (!isOpen || !text || hasInitializedRef.current) return
    hasInitializedRef.current = true

    trackModel(label || text)

    if (isWatchFirst) {
      setShowWatchPrompt(true)
      speakWatchMe().then(() => {
        setShowWatchPrompt(false)
        startSpeechImmediately()
      })
    } else {
      startSpeechImmediately()
    }

    loadContextImage()
  }, [isOpen, text, isWatchFirst])

  useEffect(() => {
    if (!isLoadingImage) return

    const messages = ["Making magic...", "Painting your picture...", "Adding sparkles...", "Almost ready..."]
    let index = 0
    const interval = setInterval(() => {
      index = (index + 1) % messages.length
      setLoadingMessage(messages[index])
    }, 1500)

    return () => clearInterval(interval)
  }, [isLoadingImage])

  const speakWatchMe = async () => {
    try {
      const response = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: "Watch me!",
          voiceId: settings.voiceId,
        }),
      })

      if (response.ok) {
        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)
        await new Promise<void>((resolve) => {
          audio.onended = () => {
            URL.revokeObjectURL(audioUrl)
            resolve()
          }
          audio.play()
        })
      }
    } catch {
      // Silent fail
    }
    await new Promise((resolve) => setTimeout(resolve, 300))
  }

  const speakNowYouTry = async () => {
    try {
      const response = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: "Now you try! Tap the button again.",
          voiceId: settings.voiceId,
        }),
      })

      if (response.ok) {
        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl)
          if (onWatchComplete) {
            onWatchComplete()
          }
        }
        audio.play()
      }
    } catch {
      // Silent fail
    }
  }

  const startSpeechImmediately = async () => {
    setIsPlaying(true)
    setCurrentWordIndex(0)

    try {
      const response = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          voiceId: settings.voiceId,
          speed: isModelingMode ? 0.85 : 1.0,
        }),
      })

      if (response.ok) {
        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)
        audioRef.current = audio

        audio.onplay = () => {
          animationFrameRef.current = requestAnimationFrame(syncWordsToAudio)
        }

        audio.ontimeupdate = () => {
          if (!audio.paused && !audio.ended) {
            const duration = audio.duration || 2
            const LEAD_TIME_SECONDS = 0.2
            const adjustedTime = audio.currentTime + LEAD_TIME_SECONDS
            const progress = Math.min(adjustedTime / duration, 1)
            const wordIndex = Math.min(Math.floor(progress * words.length), words.length - 1)
            if (wordIndex !== currentWordIndex && wordIndex >= 0) {
              setCurrentWordIndex(wordIndex)
            }
          }
        }

        audio.onended = () => {
          setCurrentWordIndex(words.length)
          setIsPlaying(false)
          setSpeechComplete(true)
          URL.revokeObjectURL(audioUrl)
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
          }
        }

        audio.onerror = () => {
          setIsPlaying(false)
          setSpeechComplete(true)
          setCurrentWordIndex(words.length)
        }

        audio.play().catch(() => {
          fallbackSpeak(text)
        })
      } else {
        fallbackSpeak(text)
      }
    } catch {
      fallbackSpeak(text)
    }
  }

  const fallbackSpeak = (textToSpeak: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak)
      utterance.rate = isModelingMode ? 0.75 : 0.9

      let wordIdx = 0
      utterance.onboundary = (event) => {
        if (event.name === "word") {
          setCurrentWordIndex(wordIdx)
          wordIdx++
        }
      }

      utterance.onend = () => {
        setCurrentWordIndex(words.length)
        setIsPlaying(false)
        setSpeechComplete(true)
      }

      window.speechSynthesis.speak(utterance)
    } else {
      setCurrentWordIndex(words.length)
      setIsPlaying(false)
      setSpeechComplete(true)
    }
  }

  const loadContextImage = async () => {
    setIsLoadingImage(true)
    setImageFailed(false)

    const cacheKey = `${text}-${emotion}`
    const cached = getCachedImage(cacheKey)

    if (cached && cached.startsWith("data:")) {
      setContextImage(cached)
      imageUrlRef.current = cached
      setIsLoadingImage(false)
      setImageShown(true)
      setImageRendered(true)
      return
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 45000)

      const response = await fetch("/api/generate-context-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phrase: text,
          label: label || text,
          category: category || "general",
          emotion,
          contextHint,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error("API error")
      }

      const data = await response.json()

      if (data.imageUrl) {
        imageUrlRef.current = data.imageUrl
        setContextImage(data.imageUrl)
        setImageShown(true)
        setIsLoadingImage(false)

        fetch(`/api/proxy-image?url=${encodeURIComponent(data.imageUrl)}`)
          .then((res) => res.json())
          .then((proxyData) => {
            if (proxyData.dataUrl) {
              setCachedImage(cacheKey, proxyData.dataUrl)
            }
          })
          .catch(() => {})
      } else {
        throw new Error("No image URL in response")
      }
    } catch (err) {
      setImageFailed(true)
      setIsLoadingImage(false)
      setImageShown(true)
    }
  }

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }

    onClose()
  }

  const handleReplay = () => {
    if (isPlaying) return
    setCurrentWordIndex(-1)
    setSpeechComplete(false)
    startSpeechImmediately()
  }

  const handleButtonClickInModal = (button: ButtonData) => {
    if (onButtonClick) {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      onButtonClick(button)
    }
  }

  if (!isOpen) return null

  const emotionColors: Record<Emotion, { bg: string; text: string; gradient: string }> = {
    happy: { bg: "bg-yellow-100", text: "text-yellow-700", gradient: "from-yellow-400 to-orange-400" },
    excited: { bg: "bg-pink-100", text: "text-pink-700", gradient: "from-pink-400 to-rose-400" },
    calm: { bg: "bg-blue-100", text: "text-blue-700", gradient: "from-blue-400 to-cyan-400" },
    sad: { bg: "bg-indigo-100", text: "text-indigo-700", gradient: "from-indigo-400 to-purple-400" },
    neutral: { bg: "bg-teal-100", text: "text-teal-700", gradient: "from-teal-400 to-emerald-400" },
    frustrated: { bg: "bg-red-100", text: "text-red-700", gradient: "from-red-400 to-orange-400" },
  }

  const colors = emotionColors[emotion] || emotionColors.neutral
  const displayImage = contextImage || imageUrlRef.current

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
      >
        <X className="w-5 h-5 text-foreground" />
      </button>

      <div className="relative h-[40vh] min-h-[200px] max-h-[350px] overflow-hidden flex items-center justify-center bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-4 left-8 w-16 h-16 rounded-full bg-yellow-200/40 blur-xl animate-pulse" />
          <div className="absolute bottom-8 right-12 w-20 h-20 rounded-full bg-teal-200/30 blur-xl animate-pulse delay-700" />
          <div className="absolute top-1/2 left-4 w-12 h-12 rounded-full bg-rose-200/40 blur-lg animate-pulse delay-300" />
          <div className="absolute bottom-4 left-1/3 w-14 h-14 rounded-full bg-orange-200/30 blur-xl animate-pulse delay-500" />
        </div>

        {showWatchPrompt && (
          <div className="absolute inset-0 z-20 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-3xl p-6 text-center animate-bounce">
              <Eye className="w-12 h-12 text-primary mx-auto mb-2" />
              <p className="text-xl font-bold text-foreground">Watch me!</p>
            </div>
          </div>
        )}

        {watchFirstPhase === "try" && (
          <div className="absolute top-4 left-4 z-10 bg-accent text-white px-4 py-2 rounded-full font-bold animate-pulse">
            Now you try!
          </div>
        )}

        {displayImage ? (
          <img
            src={displayImage || "/placeholder.svg"}
            alt={`Context for: ${text}`}
            className="max-w-full max-h-full object-contain relative z-10 drop-shadow-lg"
            onLoad={() => {
              setImageRendered(true)
              setIsLoadingImage(false)
            }}
            onError={() => {
              setImageFailed(true)
              setContextImage(null)
              imageUrlRef.current = null
            }}
          />
        ) : isLoadingImage ? (
          <div
            className={`h-full w-full bg-gradient-to-br ${colors.gradient} flex flex-col items-center justify-center`}
          >
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4" />
            <Sparkles className="w-8 h-8 text-white/80 mb-2" />
            <p className="text-white text-lg font-medium">{loadingMessage}</p>
          </div>
        ) : (
          <div className={`h-full w-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}>
            <div className={`${colors.bg} px-6 py-3 rounded-xl`}>
              <span className={`text-xl font-bold ${colors.text}`}>{label || text.split(" ")[0]}</span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border-b border-border px-4 py-3 flex items-center justify-center gap-4">
        <div className="flex flex-wrap justify-center gap-x-1 text-lg md:text-xl font-semibold">
          {words.map((word, index) => (
            <AnimatedWord
              key={`${word}-${index}`}
              word={word}
              isActive={index === currentWordIndex}
              isPast={index < currentWordIndex}
            />
          ))}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            handleReplay()
          }}
          disabled={isPlaying}
          className={cn(
            "flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
            isPlaying
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-primary/10 hover:bg-primary/20 text-primary",
          )}
        >
          <Volume2 className="w-4 h-4" />
          <span className="hidden sm:inline">Hear Again</span>
        </button>
      </div>

      {buttons.length > 0 && (
        <div className="flex-1 overflow-y-auto bg-muted/30 p-3">
          <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 max-w-4xl mx-auto">
            {buttons.map((button) => {
              const IconComponent =
                (Icons as Record<string, React.ComponentType<{ className?: string }>>)[button.icon] ||
                Icons.MessageCircle
              const isActive = button.id === activeButtonId

              return (
                <button
                  key={button.id}
                  onClick={() => handleButtonClickInModal(button)}
                  style={{ borderColor: button.color }}
                  className={cn(
                    "p-2 rounded-xl bg-white border-2 shadow-sm transition-all",
                    "hover:shadow-md hover:scale-105 active:scale-95",
                    "flex flex-col items-center gap-1",
                    isActive && "ring-2 ring-primary ring-offset-1 scale-105",
                  )}
                >
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: button.color }}
                  >
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <span
                    className="text-[10px] sm:text-xs font-semibold text-center leading-tight line-clamp-2"
                    style={{ color: button.color }}
                  >
                    {button.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="bg-background border-t border-border px-4 py-2 text-center flex-shrink-0">
        <p className="text-xs text-muted-foreground">
          {isPlaying ? "Listening..." : "Tap another button or X to close"}
        </p>
      </div>
    </div>
  )
}
