"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { X, Sparkles, Star, Heart, Sun, Eye } from "lucide-react"
import type { Emotion } from "@/types"
import { cn } from "@/lib/utils"
import { getCachedImage, setCachedImage } from "@/lib/context-image-cache"
import { useAppStore } from "@/lib/store"

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
}: LearningModalProps) {
  const [displayedWords, setDisplayedWords] = useState<string[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [contextImage, setContextImage] = useState<string | null>(null)
  const [isLoadingImage, setIsLoadingImage] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Making magic...")
  const [imageFailed, setImageFailed] = useState(false)
  const [speechComplete, setSpeechComplete] = useState(false)
  const [imageShown, setImageShown] = useState(false)
  const [canClose, setCanClose] = useState(false)
  const [imageRendered, setImageRendered] = useState(false)
  const [watchFirstPhase, setWatchFirstPhase] = useState<"watch" | "try" | "done">("watch")
  const [showWatchPrompt, setShowWatchPrompt] = useState(false)

  const hasInitializedRef = useRef(false)
  const currentTextRef = useRef("")
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const wordIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const imageUrlRef = useRef<string | null>(null)
  const blobUrlRef = useRef<string | null>(null)

  const { settings, trackModel } = useAppStore()
  const isModelingMode = settings.modelingMode
  const isWatchFirst = watchFirstMode || settings.watchFirstMode

  const words = text ? text.split(" ") : []

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
      setDisplayedWords([])
      setIsPlaying(false)
      setImageFailed(false)
      setSpeechComplete(false)
      setImageShown(false)
      setCanClose(false)
      setIsLoadingImage(false)
      setImageRendered(false)
      setWatchFirstPhase(isWatchFirst ? "watch" : "done")
      setShowWatchPrompt(isWatchFirst)

      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (wordIntervalRef.current) {
        clearInterval(wordIntervalRef.current)
        wordIntervalRef.current = null
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
      // Say "Watch me!" then start after a delay
      speakWatchMe().then(() => {
        setShowWatchPrompt(false)
        startSpeech()
        loadContextImage()
      })
    } else {
      startSpeech()
      loadContextImage()
    }
  }, [isOpen, text, isWatchFirst])

  // ... existing loading message effect ...
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

  useEffect(() => {
    const canCloseNow = speechComplete && (imageRendered || imageFailed || imageShown)
    if (canCloseNow && !canClose) {
      if (isWatchFirst && watchFirstPhase === "watch") {
        setTimeout(() => {
          setWatchFirstPhase("try")
          speakNowYouTry()
        }, 500)
      } else {
        setTimeout(() => setCanClose(true), 1500)
      }
    }
  }, [speechComplete, imageRendered, imageFailed, imageShown, canClose, isWatchFirst, watchFirstPhase])

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
    // Small delay after "Watch me!"
    await new Promise((resolve) => setTimeout(resolve, 500))
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
          setCanClose(true)
          if (onWatchComplete) {
            onWatchComplete()
          }
        }
        audio.play()
      }
    } catch {
      setCanClose(true)
    }
  }

  const startSpeech = async () => {
    setIsPlaying(true)
    setDisplayedWords([])

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

        audio.onended = () => {
          setDisplayedWords(words)
          setIsPlaying(false)
          setSpeechComplete(true)
          URL.revokeObjectURL(audioUrl)
        }

        audio.play()

        const totalDuration = (audio.duration || 2) * 1000
        const wordDelay = (isModelingMode ? totalDuration * 1.2 : totalDuration) / words.length

        let wordIndex = 0
        wordIntervalRef.current = setInterval(() => {
          if (wordIndex < words.length) {
            setDisplayedWords((prev) => [...prev, words[wordIndex]])
            wordIndex++
          } else {
            if (wordIntervalRef.current) {
              clearInterval(wordIntervalRef.current)
            }
          }
        }, wordDelay)
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
      utterance.onend = () => {
        setDisplayedWords(words)
        setIsPlaying(false)
        setSpeechComplete(true)
      }
      window.speechSynthesis.speak(utterance)

      let wordIndex = 0
      const wordDelay = (textToSpeak.length * (isModelingMode ? 100 : 80)) / words.length
      wordIntervalRef.current = setInterval(() => {
        if (wordIndex < words.length) {
          setDisplayedWords((prev) => [...prev, words[wordIndex]])
          wordIndex++
        } else {
          if (wordIntervalRef.current) {
            clearInterval(wordIntervalRef.current)
          }
        }
      }, wordDelay)
    }
  }

  const loadContextImage = async () => {
    console.log("[v0] loadContextImage called")
    setIsLoadingImage(true)
    setImageFailed(false)

    const cacheKey = `${text}-${emotion}`
    const cached = getCachedImage(cacheKey)

    // Only use cached image if it's a data URL (base64)
    if (cached && cached.startsWith("data:")) {
      console.log("[v0] Using cached base64 image")
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

      console.log("[v0] Fetching from /api/generate-context-image...")
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
        console.log("[v0] API response not ok:", response.status)
        throw new Error("API error")
      }

      const data = await response.json()
      console.log("[v0] API response data:", JSON.stringify(data).substring(0, 200))

      if (data.imageUrl) {
        console.log("[v0] Setting contextImage state to:", data.imageUrl.substring(0, 50) + "...")
        imageUrlRef.current = data.imageUrl
        setContextImage(data.imageUrl)
        setImageShown(true)
        setIsLoadingImage(false)
        console.log("[v0] State updates called - contextImage should now be set")

        // Also try to cache via proxy in the background
        fetch(`/api/proxy-image?url=${encodeURIComponent(data.imageUrl)}`)
          .then((res) => res.json())
          .then((proxyData) => {
            if (proxyData.dataUrl) {
              console.log("[v0] Caching base64 version for future use")
              setCachedImage(cacheKey, proxyData.dataUrl)
            }
          })
          .catch(() => {
            // Proxy failed, that's ok - direct URL is already showing
          })
      } else {
        console.log("[v0] No imageUrl in response, data:", data)
        throw new Error("No image URL in response")
      }
    } catch (err) {
      console.log("[v0] Image generation failed:", err)
      setImageFailed(true)
      setIsLoadingImage(false)
      setImageShown(true)
    }
  }

  const handleClose = () => {
    if (!canClose && !imageFailed) return

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (wordIntervalRef.current) {
      clearInterval(wordIntervalRef.current)
      wordIntervalRef.current = null
    }
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }

    onClose()
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

  console.log("[v0] Render - contextImage:", contextImage ? contextImage.substring(0, 30) + "..." : "null")
  console.log("[v0] Render - imageUrlRef.current:", imageUrlRef.current ? "set" : "null")
  console.log("[v0] Render - displayImage:", displayImage ? "TRUTHY" : "FALSY")
  console.log("[v0] Render - isLoadingImage:", isLoadingImage)

  return (
    <div className="fixed inset-0 z-50 flex flex-col" onClick={canClose ? handleClose : undefined}>
      {/* Image Section - Scrollable */}
      <div className="relative flex-1 min-h-0 overflow-hidden">
        {/* Close button - always visible */}
        <button
          onClick={handleClose}
          className={cn(
            "absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center transition-opacity",
            !canClose && !imageFailed ? "opacity-50 cursor-not-allowed" : "hover:bg-white",
          )}
          disabled={!canClose && !imageFailed}
        >
          <X className="w-6 h-6 text-foreground" />
        </button>

        {showWatchPrompt && (
          <div className="absolute inset-0 z-20 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-3xl p-8 text-center animate-bounce">
              <Eye className="w-16 h-16 text-primary mx-auto mb-4" />
              <p className="text-2xl font-bold text-foreground">Watch me!</p>
            </div>
          </div>
        )}

        {watchFirstPhase === "try" && (
          <div className="absolute top-4 left-4 z-10 bg-accent text-white px-4 py-2 rounded-full font-bold animate-pulse">
            Now you try!
          </div>
        )}

        {displayImage ? (
          <div className="h-full overflow-auto bg-gray-100">
            <img
              src={displayImage || "/placeholder.svg"}
              alt={`Context for: ${text}`}
              className="w-full h-auto min-h-full object-contain"
              onLoad={() => {
                console.log("[v0] Image onLoad fired")
                setImageRendered(true)
                setIsLoadingImage(false)
              }}
              onError={(e) => {
                console.log("[v0] Image onError fired:", e)
                setImageFailed(true)
                setContextImage(null)
                imageUrlRef.current = null
              }}
            />
            {imageRendered && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                Scroll to see more
              </div>
            )}
          </div>
        ) : isLoadingImage ? (
          <div className={`h-full bg-gradient-to-br ${colors.gradient} flex flex-col items-center justify-center p-8`}>
            {/* Loading animation */}
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 bg-white/60 rounded-full"
                    style={{
                      transform: `rotate(${i * 45}deg) translateY(-30px)`,
                      animation: `pulse 1s ease-in-out ${i * 0.1}s infinite`,
                    }}
                  />
                ))}
              </div>
              <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            </div>

            {/* Sparkle icon */}
            <Sparkles className="w-12 h-12 text-white/80 mb-4 animate-pulse" />

            {/* Loading message */}
            <p className="text-white text-xl font-medium">{loadingMessage}</p>

            {/* Bouncing dots */}
            <div className="flex gap-2 mt-4">
              <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>

            {/* Floating elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[Star, Heart, Sparkles, Sun].map((Icon, i) => (
                <Icon
                  key={i}
                  className={cn(
                    "absolute text-white/30 w-8 h-8",
                    i === 0 && "top-[15%] left-[20%] animate-float",
                    i === 1 && "top-[25%] right-[15%] animate-float-delayed",
                    i === 2 && "bottom-[30%] left-[15%] animate-float",
                    i === 3 && "bottom-[20%] right-[20%] animate-float-delayed",
                  )}
                />
              ))}
            </div>
          </div>
        ) : (
          // Fallback gradient with decorative elements
          <div className={`h-full bg-gradient-to-br ${colors.gradient} relative overflow-hidden`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`${colors.bg} px-8 py-4 rounded-2xl shadow-lg`}>
                <span className={`text-2xl font-bold ${colors.text}`}>{label || text.split(" ")[0]}</span>
              </div>
            </div>
            {/* Decorative floating elements */}
            <div className="absolute inset-0 pointer-events-none">
              {[Star, Heart, Sparkles, Sun].map((Icon, i) => (
                <Icon
                  key={i}
                  className={cn(
                    "absolute text-white/30",
                    i === 0 && "top-[10%] left-[15%] w-12 h-12 animate-float",
                    i === 1 && "top-[20%] right-[20%] w-8 h-8 animate-float-delayed",
                    i === 2 && "bottom-[25%] left-[25%] w-10 h-10 animate-float",
                    i === 3 && "bottom-[15%] right-[15%] w-14 h-14 animate-float-delayed",
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Avatar Section */}
      <div className="bg-background py-4 flex justify-center items-center border-t-4 border-primary">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden border-4 border-primary/20">
            <Image src="/images/logo.png" alt="Speaking Avatar" width={80} height={80} className="object-contain" />
          </div>
          {isPlaying && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white rounded-full px-3 py-1 shadow-md border border-primary/20">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
                <span className="text-xs font-medium text-muted-foreground ml-1">Speaking...</span>
              </div>
            </div>
          )}
          {!isPlaying && speechComplete && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white rounded-full px-3 py-1 shadow-md border border-primary/20">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-xs font-medium text-muted-foreground ml-1">Done!</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Text Display Section */}
      <div className="bg-background px-6 py-6 flex-shrink-0">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-relaxed">
            {displayedWords.length > 0 ? displayedWords.join(" ") : <span className="text-primary">|</span>}
          </h2>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-background border-t border-border px-6 py-3 text-center flex-shrink-0">
        <p className="text-sm text-muted-foreground">
          {!canClose && !imageFailed
            ? isLoadingImage
              ? "Loading your picture..."
              : "Almost done..."
            : watchFirstPhase === "try"
              ? "Now tap the button to try it yourself!"
              : "Tap anywhere to close"}
        </p>
      </div>
    </div>
  )
}
