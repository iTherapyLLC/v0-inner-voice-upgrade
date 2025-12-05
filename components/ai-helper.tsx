"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { X, Send, Sparkles, Mic, MicOff, Undo2, Keyboard, Plus, Trash2, Volume2, HelpCircle } from "lucide-react"
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

const QUICK_ACTIONS = [
  { label: "Add a button", icon: Plus, prompt: "Make a button for" },
  { label: "Delete a button", icon: Trash2, prompt: "Delete the" },
  { label: "Change voice", icon: Volume2, prompt: "Change the voice to" },
  { label: "Help me", icon: HelpCircle, prompt: "How do I" },
]

function HelperIcon({ className, size = 56 }: { className?: string; size?: number }) {
  // Logo has approximately 3:2 aspect ratio (wider than tall)
  const width = size
  const height = Math.round(size * 0.67) // 2/3 of width to maintain aspect ratio
  return (
    <Image
      src="/images/logo.png"
      alt="InnerVoice Helper"
      width={width}
      height={height}
      className={cn("object-contain", className)}
    />
  )
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-2 py-2">
      <span className="h-4 w-4 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="h-4 w-4 rounded-full bg-secondary animate-bounce" style={{ animationDelay: "150ms" }} />
      <span className="h-4 w-4 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  )
}

function MagicSparkle() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-accent rounded-full animate-ping" />
      <div
        className="absolute top-1/2 right-1/4 w-3 h-3 bg-primary rounded-full animate-ping"
        style={{ animationDelay: "150ms" }}
      />
      <div
        className="absolute bottom-1/4 left-1/2 w-3 h-3 bg-secondary rounded-full animate-ping"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  )
}

function ListeningIndicator() {
  return (
    <div className="flex flex-col items-center gap-3 text-primary py-4">
      <div className="flex items-center gap-1.5">
        <span className="h-6 w-2 rounded-full bg-primary animate-pulse" />
        <span className="h-10 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "100ms" }} />
        <span className="h-8 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "200ms" }} />
        <span className="h-12 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "300ms" }} />
        <span className="h-6 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "400ms" }} />
      </div>
      <span className="text-lg font-bold">I'm listening...</span>
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
  const [showTextInput, setShowTextInput] = useState(false)
  const recognitionRef = useRef<any | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()

  const {
    addCustomButton,
    removeButton,
    restoreButton,
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
    if (isOpen && inputRef.current && showTextInput) {
      inputRef.current.focus()
    }
  }, [isOpen, showTextInput])

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
              color: buttonColor || "#14b8a6",
              icon: buttonIcon || "sparkles",
              emotion: buttonEmotion || "neutral",
            }
            addCustomButton(newButton)
          }
          break
        }
        case "delete_button": {
          const targetId = command.payload?.target as string
          if (targetId) {
            removeButton(targetId)
          }
          break
        }
        case "restore_button": {
          const targetId = command.payload?.target as string
          restoreButton(targetId)
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
      restoreButton,
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

  const handleQuickAction = (prompt: string) => {
    setInput(prompt + " ")
    setShowTextInput(true)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  return (
    <>
      {!isOpen && showHint && (
        <div className="fixed bottom-32 right-4 z-40 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="bg-white rounded-3xl shadow-xl p-5 max-w-[280px] border-3 border-primary/30 relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowHint(false)
              }}
              className="absolute -top-3 -right-3 w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors shadow-md"
              aria-label="Close hint"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-2 text-primary font-bold mb-2 text-lg">
              <Sparkles className="w-6 h-6" />
              <span>I can help!</span>
            </div>
            <p className="text-base text-muted-foreground leading-relaxed">
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
          "fixed bottom-6 right-6 z-50 w-20 h-20 md:w-24 md:h-24 rounded-full shadow-2xl transition-all duration-300",
          "bg-gradient-to-br from-primary via-secondary to-accent",
          "hover:scale-110 active:scale-95",
          "flex items-center justify-center",
          "ring-4 ring-white/50",
          isOpen && "rotate-45",
        )}
        aria-label={isOpen ? "Close helper" : "Open helper"}
      >
        {isOpen ? (
          <X className="w-10 h-10 md:w-12 md:h-12 text-white" />
        ) : (
          <HelperIcon size={52} className="rounded-full" />
        )}
      </button>

      {isOpen && (
        <div
          className={cn(
            "fixed bottom-32 md:bottom-36 right-4 z-50 w-[360px] max-w-[calc(100vw-2rem)] max-h-[70vh] rounded-3xl shadow-2xl overflow-hidden",
            "bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10",
            "border-3 border-white/50 backdrop-blur-sm",
            "animate-in slide-in-from-bottom-4 fade-in duration-300",
            "flex flex-col",
          )}
        >
          {showMagic && <MagicSparkle />}

          <div className="bg-gradient-to-r from-primary to-secondary p-5 text-white shrink-0">
            <div className="flex items-center gap-4">
              <HelperIcon size={56} className="rounded-full border-3 border-white/30" />
              <div className="flex-1">
                <h3 className="font-bold text-xl">Your Helper</h3>
                <p className="text-white/80 text-base">Ask me anything - I'll do it right away!</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                aria-label="Close helper"
              >
                <X className="w-7 h-7 text-white" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/50 min-h-[200px]">
            {messages.length === 0 && !isListening && (
              <div className="text-center py-4">
                <HelperIcon size={64} className="mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground text-base mb-4">Tap the microphone and say what you need!</p>
                <div className="grid grid-cols-2 gap-3">
                  {QUICK_ACTIONS.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleQuickAction(action.prompt)}
                      className="flex items-center gap-2 p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 border-2 border-primary/20"
                    >
                      <action.icon className="w-6 h-6 text-primary" />
                      <span className="font-semibold text-sm text-foreground">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isListening && (
              <div className="flex justify-center py-8">
                <ListeningIndicator />
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-5 py-3 shadow-sm",
                    msg.role === "user"
                      ? "bg-primary text-white rounded-br-md"
                      : "bg-white text-foreground rounded-bl-md border-2 border-border/50",
                  )}
                >
                  <p className="text-base leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-md px-5 py-3 shadow-sm border-2 border-border/50">
                  <ThinkingDots />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {canUndo && lastAction && (
            <div className="px-4 py-3 bg-accent/10 border-t-2 border-accent/20 shrink-0">
              <button
                onClick={handleUndo}
                className="flex items-center gap-3 w-full p-3 rounded-xl bg-white hover:bg-accent/10 transition-colors"
              >
                <Undo2 className="w-6 h-6 text-accent" />
                <span className="font-semibold text-base text-accent">Undo: {lastAction}</span>
              </button>
            </div>
          )}

          <div className="p-4 bg-white border-t-2 border-border/30 shrink-0">
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowTextInput(false)}
                  className={cn(
                    "flex-1 h-14 rounded-2xl text-base font-semibold gap-2 transition-all",
                    !showTextInput
                      ? "bg-primary text-white shadow-lg"
                      : "bg-muted text-muted-foreground hover:bg-muted/80",
                  )}
                >
                  <Mic className="w-6 h-6" />
                  Voice
                </Button>
                <Button
                  onClick={() => {
                    setShowTextInput(true)
                    setTimeout(() => inputRef.current?.focus(), 100)
                  }}
                  className={cn(
                    "flex-1 h-14 rounded-2xl text-base font-semibold gap-2 transition-all",
                    showTextInput
                      ? "bg-primary text-white shadow-lg"
                      : "bg-muted text-muted-foreground hover:bg-muted/80",
                  )}
                >
                  <Keyboard className="w-6 h-6" />
                  Type
                </Button>
              </div>

              {showTextInput ? (
                <div className="flex items-center gap-3">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type what you need..."
                    className="flex-1 rounded-2xl border-3 border-primary/30 focus:border-primary bg-muted/30 px-5 py-4 text-lg min-h-[56px]"
                    disabled={isListening}
                  />
                  <Button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading}
                    className="rounded-full w-14 h-14 shrink-0 bg-primary hover:bg-primary/90"
                    size="icon"
                    aria-label="Send message"
                  >
                    <Send className="w-7 h-7" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={toggleListening}
                  disabled={!speechSupported}
                  className={cn(
                    "w-full rounded-2xl h-20 text-xl font-bold gap-4 transition-all",
                    isListening
                      ? "bg-primary text-white animate-pulse shadow-lg shadow-primary/30"
                      : "bg-primary/10 text-primary hover:bg-primary/20 border-2 border-primary/30",
                  )}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-8 h-8" />
                      Tap when done
                    </>
                  ) : (
                    <>
                      <Mic className="w-8 h-8" />
                      Tap and speak
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
