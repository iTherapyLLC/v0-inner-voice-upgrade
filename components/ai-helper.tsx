"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { X, Send, Sparkles, Mic, MicOff, Undo2 } from "lucide-react"
import { useConversation } from "@/hooks/use-conversation"
import { useElevenLabs } from "@/hooks/use-elevenlabs"
import { useAppStore } from "@/lib/store"
import Image from "next/image"
import type { CommunicationButton } from "@/types"

const AI_HELPER_VOICE_ID = "EXAVITQu4vr4xnSDxMaL"

const VOICE_IDS = {
  female: "EXAVITQu4vr4xnSDxMaL",
  male: "TxGEqnHWrfWFTfGW9XjX",
}

const LANGUAGE_VOICE_IDS: Record<string, string> = {
  en: "EXAVITQu4vr4xnSDxMaL", // Sarah - English
  he: "ODq5zmih8GrVes37Dizd", // Hebrew voice
  es: "EXAVITQu4vr4xnSDxMaL", // Default for now
  fr: "EXAVITQu4vr4xnSDxMaL",
  de: "EXAVITQu4vr4xnSDxMaL",
  ar: "EXAVITQu4vr4xnSDxMaL",
  zh: "EXAVITQu4vr4xnSDxMaL",
  ja: "EXAVITQu4vr4xnSDxMaL",
  ko: "EXAVITQu4vr4xnSDxMaL",
  ru: "EXAVITQu4vr4xnSDxMaL",
}

function HelperIcon({ className, size = 56 }: { className?: string; size?: number }) {
  return (
    <Image
      src="/images/logo.png"
      alt="InnerVoice Helper"
      width={size}
      height={size}
      className={cn("object-contain", className)}
    />
  )
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      <span className="h-2.5 w-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="h-2.5 w-2.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: "150ms" }} />
      <span className="h-2.5 w-2.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  )
}

function MagicSparkle() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent rounded-full animate-ping" />
      <div
        className="absolute top-1/2 right-1/4 w-2 h-2 bg-primary rounded-full animate-ping"
        style={{ animationDelay: "150ms" }}
      />
      <div
        className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-secondary rounded-full animate-ping"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  )
}

function ListeningIndicator() {
  return (
    <div className="flex items-center gap-2 text-primary">
      <div className="flex items-center gap-1">
        <span className="h-3 w-1 rounded-full bg-primary animate-pulse" />
        <span className="h-5 w-1 rounded-full bg-primary animate-pulse" style={{ animationDelay: "100ms" }} />
        <span className="h-4 w-1 rounded-full bg-primary animate-pulse" style={{ animationDelay: "200ms" }} />
        <span className="h-6 w-1 rounded-full bg-primary animate-pulse" style={{ animationDelay: "300ms" }} />
        <span className="h-3 w-1 rounded-full bg-primary animate-pulse" style={{ animationDelay: "400ms" }} />
      </div>
      <span className="text-sm font-bold">Listening...</span>
    </div>
  )
}

interface AIHelperProps {
  onLanguageChange?: (language: string, languageName: string) => void
  onModelingCommand?: (command: { type: string; payload?: Record<string, unknown> }) => void
  onShowMeHow?: (phrase: string) => void
}

function getModelingSuggestion(): string {
  const hour = new Date().getHours()

  if (hour >= 6 && hour < 10) {
    return `Good morning! Try modeling "I'm hungry" and "good morning" at breakfast. These are great phrases to practice during morning routines!`
  } else if (hour >= 10 && hour < 14) {
    return `It's a great time to model "more please" and "all done" during snack or lunch. Mealtime is perfect for practicing requests!`
  } else if (hour >= 14 && hour < 18) {
    return `Afternoon is great for modeling "I need help" or "play with me" during activities. Try these during playtime!`
  } else if (hour >= 18 && hour < 21) {
    return `Evening routines are perfect for "I'm tired" and "goodnight". Model these during dinner or bedtime prep!`
  } else {
    return `Any time is a good time to model! Try practicing "I want" or "help me" — these work in many situations.`
  }
}

export function AIHelper({ onLanguageChange, onModelingCommand, onShowMeHow }: AIHelperProps = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [showHint, setShowHint] = useState(true)
  const [showMagic, setShowMagic] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const recognitionRef = useRef<any | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()

  const {
    addCustomButton,
    removeButton,
    updateButton,
    setSettings,
    settings,
    undo,
    canUndo,
    lastAction,
    customButtons,
  } = useAppStore()

  const { messages, isLoading, sendMessage } = useConversation()
  const { speak, isSpeaking } = useElevenLabs()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        setSpeechSupported(true)
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = "en-US"

        recognition.onresult = (event: { results: { transcript: string }[][] }) => {
          const transcript = event.results[0][0].transcript
          setInput(transcript)
          setIsListening(false)
          setTimeout(() => {
            handleSend(transcript)
          }, 300)
        }

        recognition.onerror = () => {
          setIsListening(false)
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current = recognition
      }
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch {
        setIsListening(false)
      }
    }
  }, [isListening])

  const executeCommand = useCallback(
    (command: { type: string; payload?: Record<string, unknown> }) => {
      setShowMagic(true)
      setTimeout(() => setShowMagic(false), 1000)

      switch (command.type) {
        case "create_button": {
          const buttonText = command.payload?.text as string
          const buttonLabel = command.payload?.label as string
          const buttonIcon = command.payload?.icon as string
          const buttonCategory = command.payload?.category as string
          const buttonColor = command.payload?.color as string
          const buttonEmotion = command.payload?.emotion as string

          if (buttonText) {
            const newButton: CommunicationButton = {
              id: `custom-${Date.now()}`,
              label: buttonLabel || (buttonText.length > 20 ? buttonText.substring(0, 20) + "..." : buttonText),
              text: buttonText,
              category: buttonCategory || "Social",
              color: buttonColor || "#14b8a6", // Use color from categorization or default to teal
              icon: buttonIcon || "sparkles",
              emotion: buttonEmotion || "neutral",
            }
            console.log("[v0] Creating button with auto-categorization:", {
              text: buttonText,
              category: buttonCategory,
              color: buttonColor,
              icon: buttonIcon,
              emotion: buttonEmotion,
            })
            addCustomButton(newButton)
          }
          break
        }
        case "delete_button": {
          const targetId = command.payload?.target as string

          if (targetId) {
            console.log("[v0] Attempting to delete button with ID:", targetId)
            const success = removeButton(targetId)
            if (!success) {
              console.log("[v0] Delete failed - button not found:", targetId)
            } else {
              console.log("[v0] Successfully deleted button:", targetId)
            }
          } else {
            console.log("[v0] No target ID provided for deletion")
          }
          break
        }
        case "update_button": {
          const target = command.payload?.target as string
          const updates: Partial<CommunicationButton> = {}
          if (command.payload?.newLabel) updates.label = command.payload.newLabel as string
          if (command.payload?.newText) updates.text = command.payload.newText as string
          if (command.payload?.newIcon) updates.icon = command.payload.newIcon as string
          if (target && Object.keys(updates).length > 0) {
            updateButton(target, updates)
          }
          break
        }
        case "navigate": {
          const path = command.payload?.path as string
          if (path) {
            router.push(path)
          }
          break
        }
        case "change_voice": {
          const gender = command.payload?.gender as string
          const speed = command.payload?.speed as string
          if (gender) {
            setSettings({
              ...settings,
              voiceId: VOICE_IDS[gender as keyof typeof VOICE_IDS] || settings.voiceId,
              voiceGender: gender as "male" | "female",
            })
          }
          if (speed) {
            setSettings({
              ...settings,
              voiceSpeed: speed as "slow" | "normal" | "fast",
            })
          }
          break
        }
        case "change_language": {
          const language = command.payload?.language as string
          const languageName = command.payload?.languageName as string
          if (language && languageName) {
            setSettings({
              ...settings,
              language,
              languageName,
            })
            if (onLanguageChange) {
              onLanguageChange(language, languageName)
            }
          }
          break
        }
        case "toggle_watch_first": {
          const enabled = command.payload?.enabled as boolean
          setSettings({
            ...settings,
            watchFirstMode: enabled,
          })
          if (onModelingCommand) {
            onModelingCommand(command)
          }
          break
        }
        case "toggle_model_mode": {
          const enabled = command.payload?.enabled as boolean
          setSettings({
            ...settings,
            modelingMode: enabled,
          })
          if (onModelingCommand) {
            onModelingCommand(command)
          }
          break
        }
        case "show_modeling_stats": {
          router.push("/progress")
          break
        }
        case "show_me_how": {
          const phrase = command.payload?.phrase as string
          if (phrase && onShowMeHow) {
            onShowMeHow(phrase)
          }
          break
        }
        case "get_modeling_suggestion": {
          break
        }
      }
    },
    [
      addCustomButton,
      removeButton,
      updateButton,
      router,
      setSettings,
      settings,
      onLanguageChange,
      onModelingCommand,
      onShowMeHow,
      customButtons,
    ],
  )

  const handleSend = useCallback(
    async (textToSend?: string) => {
      const messageText = textToSend || input
      if (!messageText.trim()) return

      setInput("")

      const response = await sendMessage(messageText)

      if (response?.command) {
        executeCommand(response.command)
      }

      if (response?.command?.type === "get_modeling_suggestion") {
        const suggestion = getModelingSuggestion()
        speak(suggestion, AI_HELPER_VOICE_ID)
      } else if (response?.response) {
        speak(response.response, AI_HELPER_VOICE_ID)
      }
    },
    [input, sendMessage, executeCommand, speak],
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleUndo = () => {
    if (canUndo) {
      undo()
      speak("Done! I undid that for you.", AI_HELPER_VOICE_ID)
    }
  }

  return (
    <>
      {!isOpen && showHint && (
        <div className="fixed bottom-28 right-4 z-40 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="bg-white rounded-2xl shadow-lg p-4 max-w-[240px] border-2 border-primary/20 relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowHint(false)
              }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-2 text-primary font-bold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>I can help!</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Ask me to make buttons, change the voice, show modeling tips, or anything else!
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => {
          setIsOpen(!isOpen)
          setShowHint(false)
        }}
        className={cn(
          "fixed bottom-4 right-4 z-50 w-16 h-16 rounded-full shadow-lg transition-all duration-300",
          "bg-gradient-to-br from-primary via-secondary to-accent",
          "hover:scale-110 active:scale-95",
          "flex items-center justify-center",
          isOpen && "rotate-45",
        )}
      >
        {isOpen ? <X className="w-8 h-8 text-white" /> : <HelperIcon size={40} className="rounded-full" />}
      </button>

      {isOpen && (
        <div
          className={cn(
            "fixed bottom-24 right-4 z-50 w-[340px] max-h-[70vh] rounded-3xl shadow-2xl overflow-hidden",
            "bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10",
            "border-2 border-white/50 backdrop-blur-sm",
            "animate-in slide-in-from-bottom-4 fade-in duration-300",
          )}
        >
          {showMagic && <MagicSparkle />}

          <div className="bg-gradient-to-r from-primary to-secondary p-4 text-white">
            <div className="flex items-center gap-3">
              <HelperIcon size={48} className="rounded-full border-2 border-white/30" />
              <div className="flex-1">
                <h3 className="font-bold text-lg">Your Helper</h3>
                <p className="text-white/80 text-sm">Ask me anything - I'll do it right away!</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                aria-label="Close helper"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <div className="h-[300px] overflow-y-auto p-4 space-y-3 bg-white/50">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <HelperIcon size={64} className="mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground text-sm">
                  Say "make a button for thank you" or "turn on watch first mode"!
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm",
                    msg.role === "user"
                      ? "bg-primary text-white rounded-br-md"
                      : "bg-white text-foreground rounded-bl-md border border-border/50",
                  )}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-md px-4 py-2.5 shadow-sm border border-border/50">
                  <ThinkingDots />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {canUndo && lastAction && (
            <div className="px-4 py-2 bg-accent/10 border-t border-accent/20">
              <button
                onClick={handleUndo}
                className="flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors"
              >
                <Undo2 className="w-4 h-4" />
                <span>Undo: {lastAction}</span>
              </button>
            </div>
          )}

          <div className="p-3 bg-white border-t border-border/30">
            <div className="flex items-center gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? "Listening..." : "Say what you need..."}
                className="flex-1 rounded-full border-2 border-primary/20 focus:border-primary bg-muted/30"
                disabled={isListening}
              />

              {speechSupported && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleListening}
                  className={cn(
                    "rounded-full w-11 h-11 shrink-0",
                    isListening ? "bg-primary text-white animate-pulse" : "bg-primary/10 text-primary",
                  )}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
              )}

              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="rounded-full w-11 h-11 shrink-0 bg-primary hover:bg-primary/90"
                size="icon"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>

            {isListening && (
              <div className="mt-2 flex justify-center">
                <ListeningIndicator />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
