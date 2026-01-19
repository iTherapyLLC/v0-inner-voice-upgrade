"use client"

import type React from "react"
import { useState, useEffect, useMemo, useRef } from "react"
import { LearningModal } from "@/components/learning-modal"
import { useAppStore } from "@/lib/store"
import { useElevenLabs } from "@/hooks/use-elevenlabs"
import type { CommunicationButton } from "@/types"
import { cn } from "@/lib/utils"
import {
  WaveIcon,
  SunIcon,
  MoonIcon,
  EyeIcon,
  SmileIcon,
  HungryIcon,
  ThirstyIcon,
  HelpIcon,
  StopIcon,
  WaitIcon,
  ListenIcon,
  NoIcon,
  FinishedIcon,
  WhatIcon,
  WhereIcon,
  WhenIcon,
  WhyIcon,
  HappyIcon,
  SadIcon,
  LoveIcon,
  SparklesIcon,
  ByeIcon,
  PleaseIcon,
  MessageCircle,
} from "@/components/icons"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { defaultButtons } from "@/lib/default-buttons"
import { preloadContextImage } from "@/lib/preload-context-image"
import { getCommunicateButtonImage, shouldUseCachedImage } from "@/lib/image-manifest"
import { preloadImages } from "@/lib/image-preloader"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  wave: WaveIcon,
  sun: SunIcon,
  moon: MoonIcon,
  eye: EyeIcon,
  smile: SmileIcon,
  hungry: HungryIcon,
  thirsty: ThirstyIcon,
  help: HelpIcon,
  stop: StopIcon,
  wait: WaitIcon,
  listen: ListenIcon,
  no: NoIcon,
  finished: FinishedIcon,
  what: WhatIcon,
  where: WhereIcon,
  when: WhenIcon,
  why: WhyIcon,
  happy: HappyIcon,
  sad: SadIcon,
  love: LoveIcon,
  sparkles: SparklesIcon,
  bye: ByeIcon,
  please: PleaseIcon,
  message_circle: MessageCircle,
}

const categories = ["All", "Social", "Requests", "Commands", "Refusals", "Questions", "Feelings"]

export default function CommunicatePage() {
  const {
    settings,
    customButtons,
    deletedDefaultButtons,
    addCustomButton,
    removeButton,
    setTranslationCache,
    getTranslation,
    setSettings,
    phraseUsage,
    trackModel,
  } = useAppStore()
  const { speak, isSpeaking, isLoading } = useElevenLabs()
  const [customText, setCustomText] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [lastClickedId, setLastClickedId] = useState<string | null>(null)

  const [editMode, setEditMode] = useState(false)

  const [isAddingButton, setIsAddingButton] = useState(false)
  const [newButtonText, setNewButtonText] = useState("")
  const [newButtonCategory, setNewButtonCategory] = useState("Social")

  const [learningModal, setLearningModal] = useState<{
    isOpen: boolean
    text: string
    label: string
    category: string
    emotion: string
    contextHint?: string
    buttonId?: string
    cachedImagePath?: string | null
  }>({
    isOpen: false,
    text: "",
    label: "",
    category: "",
    emotion: "neutral",
    contextHint: undefined,
    buttonId: undefined,
    cachedImagePath: null,
  })

  const [focusedWords, setFocusedWords] = useState<string[]>([])
  const [translatedButtons, setTranslatedButtons] = useState<Record<string, { label: string; text: string }>>({})
  const previousLanguageRef = useRef<string>(settings.language || "en")
  const [showMeHowPhrase, setShowMeHowPhrase] = useState<string | null>(null)
  const [isTranslating, setIsTranslating] = useState(false)

  const currentLanguage = settings.language || "en"

  const allButtons = useMemo(() => {
    return [...defaultButtons.filter((b) => !deletedDefaultButtons.includes(b.id)), ...customButtons]
  }, [deletedDefaultButtons, customButtons])

  const getFilteredButtons = () => {
    let buttons = allButtons

    if (selectedCategory !== "All") {
      buttons = buttons.filter((b) => b.category === selectedCategory)
    }

    if (focusedWords.length > 0) {
      const normalizeForMatch = (str: string): string => {
        return str
          .toLowerCase()
          .replace(/[!?.,'""']/g, "")
          .trim()
      }

      const isSimilar = (word1: string, word2: string): boolean => {
        if (word1 === word2) return true
        if (word1.startsWith(word2) || word2.startsWith(word1)) return true

        let differences = 0
        const longer = word1.length >= word2.length ? word1 : word2
        const shorter = word1.length < word2.length ? word1 : word2

        for (let i = 0; i < longer.length; i++) {
          if (shorter[i] !== longer[i]) differences++
        }

        return differences <= (longer.length <= 4 ? 1 : 2)
      }

      buttons = allButtons.filter((b) =>
        focusedWords.some((word) => {
          const normalizedWord = normalizeForMatch(word)
          const normalizedLabel = normalizeForMatch(b.label)

          const labelWords = normalizedLabel.split(/\s+/)

          return (
            isSimilar(normalizedLabel, normalizedWord) ||
            labelWords.some((labelWord) => isSimilar(labelWord, normalizedWord))
          )
        }),
      )
    }

    return buttons
  }

  const filteredButtons = getFilteredButtons()

  useEffect(() => {
    filteredButtons.forEach((button) => {
      preloadContextImage(button.text, button.emotion, button.id)
    })
  }, [selectedCategory, filteredButtons])

  // Preload cached images for default communicate buttons
  useEffect(() => {
    const defaultButtonImages = defaultButtons
      .map(b => getCommunicateButtonImage(b.id))
      .filter((path): path is string => path !== null)

    // Preload first 10 most important cached images
    preloadImages(defaultButtonImages.slice(0, 10))
  }, [])

  useEffect(() => {
    const priorityPhrases = [
      { text: "Hey! Come check this out with me!", emotion: "excited", id: "hey" },
      { text: "I need some help with this. Can you show me how?", emotion: "neutral", id: "help" },
      { text: "No thank you, I don't want that right now.", emotion: "calm", id: "no" },
      { text: "I'm feeling so happy right now! This is great!", emotion: "happy", id: "happy" },
      { text: "What are we going to do today? I want to know!", emotion: "excited", id: "what" },
      { text: "I need to take a break. This is too much right now.", emotion: "calm", id: "wait" },
    ]

    priorityPhrases.forEach(({ text, emotion, id }) => {
      preloadContextImage(text, emotion, id)
    })
  }, [])

  useEffect(() => {
    const translateButtons = async () => {
      const lang = settings.language || "en"

      if (lang === "en") {
        setTranslatedButtons({})
        previousLanguageRef.current = "en"
        return
      }

      if (lang === previousLanguageRef.current && Object.keys(translatedButtons).length > 0) {
        return
      }

      previousLanguageRef.current = lang

      const cachedTranslations: Record<string, { label: string; text: string }> = {}
      const buttonsToTranslate: { id: string; label: string; text: string }[] = []

      allButtons.forEach((button) => {
        const cached = getTranslation(lang, button.id)
        if (cached) {
          cachedTranslations[button.id] = cached
        } else {
          buttonsToTranslate.push({ id: button.id, label: button.label, text: button.text })
        }
      })

      if (Object.keys(cachedTranslations).length > 0) {
        setTranslatedButtons(cachedTranslations)
      }

      if (buttonsToTranslate.length === 0) {
        return
      }

      setIsTranslating(true)

      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            buttons: buttonsToTranslate,
            targetLanguage: lang,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const newTranslations = { ...cachedTranslations, ...data.translations }
          setTranslatedButtons(newTranslations)
          setTranslationCache(lang, data.translations)
        }
      } catch (error) {
        console.error("Translation error:", error)
      } finally {
        setIsTranslating(false)
      }
    }

    translateButtons()
  }, [settings.language, allButtons.length, getTranslation, setTranslationCache])

  const getButtonDisplay = (button: CommunicationButton) => {
    const lang = settings.language || "en"
    if (lang === "en" || !translatedButtons[button.id]) {
      return { label: button.label, text: button.text }
    }
    return translatedButtons[button.id]
  }

  const handleButtonClick = (button: CommunicationButton) => {
    setLastClickedId(button.id)

    const display = getButtonDisplay(button)

    // Check if this button has a cached image (default buttons only)
    const cachedImagePath = shouldUseCachedImage(button.id)
      ? getCommunicateButtonImage(button.id)
      : null

    setLearningModal({
      isOpen: true,
      text: display.text,
      label: display.label,
      category: button.category,
      emotion: button.emotion,
      contextHint: button.contextHint,
      buttonId: button.id,
      cachedImagePath,
    })

    setTimeout(() => setLastClickedId(null), 200)
  }

  const handleAddMessage = (text: string, label: string, category: string, emotion: string, contextHint?: string) => {
    const msg = { role: "user" as const, content: text, timestamp: new Date() }
    addCustomButton(msg)
  }

  const handleSpeakCustom = async () => {
    if (!customText.trim()) return
    await speak(customText, settings.voiceId)
    const msg = { role: "user" as const, content: customText, timestamp: new Date() }
    addCustomButton(msg)
    setCustomText("")
  }

  const handleLanguageChange = async (language: string, languageName: string) => {
    setSettings({
      ...settings,
      language,
      languageName,
    })
  }

  const handleAICommand = (command: { type: string; payload?: Record<string, unknown> }) => {
    if (command.type === "focus_learning") {
      const words = command.payload?.words as string[]
      if (words && words.length > 0) {
        setFocusedWords(words)
      }
    } else if (command.type === "restore_buttons") {
      setFocusedWords([])
    }
  }

  const handleShowMeHow = (phrase: string) => {
    const normalizedPhrase = phrase
      .toLowerCase()
      .replace(/[!?.,'""']/g, "")
      .trim()

    const matchingButton = allButtons.find((b) => {
      const normalizedLabel = b.label
        .toLowerCase()
        .replace(/[!?.,'""']/g, "")
        .trim()
      const normalizedText = b.text
        .toLowerCase()
        .replace(/[!?.,'""']/g, "")
        .trim()

      return (
        normalizedLabel.includes(normalizedPhrase) ||
        normalizedPhrase.includes(normalizedLabel) ||
        normalizedText.includes(normalizedPhrase)
      )
    })

    if (matchingButton) {
      setShowMeHowPhrase(matchingButton.id)
      setTimeout(() => {
        setShowMeHowPhrase(null)
        handleButtonClick(matchingButton)
      }, 1000)
    }
  }

  const handleModelingCommand = (command: { type: string; payload?: Record<string, unknown> }) => {
    if (command.type === "toggle_watch_first" || command.type === "toggle_model_mode") {
    }
  }

  return (
    <div className="bg-gradient-to-b from-background via-background to-muted/20 px-4 pb-8">
      <div className="pt-6 pb-4 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-muted-foreground">
          What do you want to <span className="text-primary">say?</span>
        </h1>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setSettings({ ...settings, watchFirstMode: !settings.watchFirstMode })}
          className={cn(
            "flex items-center gap-3 px-6 py-4 rounded-full text-base font-bold transition-all min-h-[60px]",
            settings.watchFirstMode
              ? "bg-green-100 text-green-700 border-3 border-green-400 shadow-lg"
              : "bg-white text-muted-foreground border-2 border-border/50 hover:bg-muted",
          )}
        >
          <span className={cn("w-4 h-4 rounded-full", settings.watchFirstMode ? "bg-green-500" : "bg-gray-300")} />
          Watch First
        </button>
        <button
          onClick={() => setSettings({ ...settings, modelingMode: !settings.modelingMode })}
          className={cn(
            "flex items-center gap-3 px-6 py-4 rounded-full text-base font-bold transition-all min-h-[60px]",
            settings.modelingMode
              ? "bg-blue-100 text-blue-700 border-3 border-blue-400 shadow-lg"
              : "bg-white text-muted-foreground hover:bg-muted border-2 border-border/50",
          )}
        >
          <span className={cn("w-4 h-4 rounded-full", settings.modelingMode ? "bg-blue-500" : "bg-gray-300")} />
          Slow Speech
        </button>
      </div>

      <div className="max-w-2xl mx-auto mb-6">
        <div className="flex gap-3">
          <Input
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Or type anything you want to say..."
            className="flex-1 h-16 text-lg rounded-full border-3 border-primary/30 focus:border-primary px-6"
            onKeyDown={(e) => e.key === "Enter" && handleSpeakCustom()}
          />
          <Button
            onClick={handleSpeakCustom}
            disabled={!customText.trim() || isSpeaking || isLoading}
            className="h-16 px-8 rounded-full bg-primary hover:bg-primary/90 text-lg font-bold shadow-lg min-w-[120px]"
          >
            <Send className="w-6 h-6 mr-2" />
            Say It
          </Button>
        </div>
      </div>

      {filteredButtons.length > 0 ? (
        <div
          className={cn(
            "grid gap-4",
            focusedWords.length > 0 && filteredButtons.length <= 3
              ? "grid-cols-1 max-w-md mx-auto"
              : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
          )}
        >
          {filteredButtons.map((button) => {
            const IconComponent = iconMap[button.icon] || MessageCircle
            const display = getButtonDisplay(button)
            const isShowMeHow = showMeHowPhrase === button.id

            return (
              <button
                key={button.id}
                onClick={() => handleButtonClick(button)}
                style={{ borderColor: button.color }}
                className={cn(
                  "group relative p-6 rounded-3xl bg-white border-4 shadow-md transition-all min-h-[120px]",
                  "hover:shadow-xl hover:scale-105 active:scale-95",
                  "flex flex-col items-center justify-center gap-3",
                  lastClickedId === button.id && "animate-pulse",
                  focusedWords.length > 0 && filteredButtons.length <= 3 && "p-8 min-h-[160px]",
                  isShowMeHow && "ring-4 ring-accent ring-offset-4 animate-pulse scale-110",
                )}
              >
                <div
                  className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                    focusedWords.length > 0 && filteredButtons.length <= 3 && "w-24 h-24",
                  )}
                  style={{ backgroundColor: button.color }}
                >
                  <IconComponent
                    className={cn(
                      "w-10 h-10 text-white",
                      focusedWords.length > 0 && filteredButtons.length <= 3 && "w-14 h-14",
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "font-bold text-lg text-center leading-tight",
                    focusedWords.length > 0 && filteredButtons.length <= 3 && "text-2xl",
                  )}
                  style={{ color: button.color }}
                >
                  {display.label}
                </span>
                {isShowMeHow && (
                  <div className="absolute -top-2 -right-2 bg-accent text-white px-4 py-2 rounded-full text-base font-bold animate-bounce">
                    Watch me!
                  </div>
                )}
              </button>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-28 h-28 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <MessageCircle className="w-14 h-14 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3">I couldn't find a button for that word</h3>
          <p className="text-lg text-muted-foreground mb-6">
            Try saying "show only help" or another word that's on a button
          </p>
          <Button onClick={() => setFocusedWords([])} className="bg-primary text-lg px-8 py-6 h-auto rounded-full">
            Show All Buttons
          </Button>
        </div>
      )}

      {/* Learning Modal */}
      {learningModal.isOpen && (
        <LearningModal
          isOpen={learningModal.isOpen}
          text={learningModal.text}
          label={learningModal.label}
          category={learningModal.category}
          emotion={learningModal.emotion}
          contextHint={learningModal.contextHint}
          cachedImagePath={learningModal.cachedImagePath}
          watchFirstMode={settings.watchFirstMode}
          onClose={() => setLearningModal((prev) => ({ ...prev, isOpen: false }))}
          onWatchComplete={() => {
            if (settings.watchFirstMode) {
              trackModel(learningModal.text)
            }
          }}
          buttons={filteredButtons.map((b) => ({
            id: b.id,
            label: getButtonDisplay(b).label,
            text: getButtonDisplay(b).text,
            icon: b.icon,
            color: b.color,
            category: b.category,
            emotion: b.emotion,
            contextHint: b.contextHint,
          }))}
          onButtonClick={(button) => {
            const originalButton = filteredButtons.find((b) => b.id === button.id)
            if (originalButton) {
              handleButtonClick(originalButton)
            }
          }}
          activeButtonId={filteredButtons.find((b) => getButtonDisplay(b).text === learningModal.text)?.id}
        />
      )}
    </div>
  )
}
