"use client"

import type React from "react"
import { useMemo } from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppStore } from "@/lib/store"
import { useElevenLabs } from "@/hooks/use-elevenlabs"
import { preloadContextImage } from "@/lib/context-image-cache"
import { cn } from "@/lib/utils"
import { LearningModal } from "@/components/learning-modal"
import { X } from "lucide-react"
import {
  WaveIcon,
  SunIcon,
  EyeIcon,
  SmileIcon,
  ByeIcon,
  PleaseIcon,
  HungryIcon,
  ThirstyIcon,
  HelpIcon,
  MoreIcon,
  StopIcon,
  WaitIcon,
  YesIcon,
  NoIcon,
  ThankYouIcon,
  SorryIcon,
  LoveIcon,
  HugIcon,
  TiredIcon,
  SadIcon,
  AngryIcon,
  ScaredIcon,
  HappyIcon,
  ExcitedIcon,
  BoredIcon,
  SickIcon,
  PainIcon,
  BathroomIcon,
  WhatIcon,
  WhereIcon,
  WhenIcon,
  WhoIcon,
  WhyIcon,
  HowIcon,
  ListenIcon,
  PlayIcon,
  FinishedIcon,
  CommentIcon,
  MoonIcon,
} from "@/components/icons"
import type { Emotion, CommunicationButton } from "@/types"
import { Send } from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  wave: WaveIcon,
  sun: SunIcon,
  eye: EyeIcon,
  smile: SmileIcon,
  bye: ByeIcon,
  please: PleaseIcon,
  hungry: HungryIcon,
  thirsty: ThirstyIcon,
  help: HelpIcon,
  more: MoreIcon,
  stop: StopIcon,
  wait: WaitIcon,
  yes: YesIcon,
  no: NoIcon,
  thank_you: ThankYouIcon,
  sorry: SorryIcon,
  love: LoveIcon,
  hug: HugIcon,
  tired: TiredIcon,
  sad: SadIcon,
  angry: AngryIcon,
  scared: ScaredIcon,
  happy: HappyIcon,
  excited: ExcitedIcon,
  bored: BoredIcon,
  sick: SickIcon,
  pain: PainIcon,
  bathroom: BathroomIcon,
  what: WhatIcon,
  where: WhereIcon,
  when: WhenIcon,
  who: WhoIcon,
  why: WhyIcon,
  how: HowIcon,
  listen: ListenIcon,
  play: PlayIcon,
  finished: FinishedIcon,
  comment: CommentIcon,
  moon: MoonIcon,
}

const defaultButtons: CommunicationButton[] = [
  // Social/Greetings
  {
    id: "hey",
    label: "Hey!",
    text: "Hey! Come check this out with me!",
    category: "Social",
    color: "#14b8a6",
    icon: "wave",
    emotion: "excited",
    contextHint: "A child excitedly waving to get someone's attention, pointing at something interesting",
  },
  {
    id: "good-morning",
    label: "Good morning",
    text: "Good morning! I hope you have a great day!",
    category: "Social",
    color: "#14b8a6",
    icon: "sun",
    emotion: "happy",
    contextHint: "A child waking up in bed, stretching with sunshine coming through the window",
  },
  {
    id: "look",
    label: "Look!",
    text: "Look at this! Isn't it amazing?",
    category: "Social",
    color: "#14b8a6",
    icon: "eye",
    emotion: "excited",
    contextHint: "A child pointing excitedly at something wonderful, eyes wide with amazement",
  },
  {
    id: "this-is-fun",
    label: "This is fun",
    text: "This is so much fun! I love it!",
    category: "Social",
    color: "#14b8a6",
    icon: "smile",
    emotion: "happy",
    contextHint: "A child playing and laughing, having a wonderful time with a favorite activity",
  },
  {
    id: "bye",
    label: "Bye!",
    text: "Bye bye! See you later!",
    category: "Social",
    color: "#14b8a6",
    icon: "bye",
    emotion: "happy",
    contextHint: "A child waving goodbye with a smile as someone leaves",
  },
  // Requests
  {
    id: "can-i-have",
    label: "Can I have...",
    text: "Excuse me, can I please have some of that?",
    category: "Requests",
    color: "#f97316",
    icon: "please",
    emotion: "neutral",
    contextHint: "A child politely pointing at something they want, looking hopeful",
  },
  {
    id: "hungry",
    label: "I'm hungry",
    text: "I'm feeling hungry. Can I have something to eat?",
    category: "Requests",
    color: "#f97316",
    icon: "hungry",
    emotion: "neutral",
    contextHint: "A child holding their tummy, looking at food on the table",
  },
  {
    id: "hungry-breakfast",
    label: "I'm hungry for breakfast",
    text: "I'm hungry for breakfast. Can I have something to eat?",
    category: "Requests",
    color: "#f97316",
    icon: "hungry",
    emotion: "neutral",
    contextHint:
      "A child sitting at the breakfast table in the morning, looking at cereal and toast, holding their tummy",
  },
  {
    id: "bathroom",
    label: "I need to use the bathroom",
    text: "I need to use the bathroom please.",
    category: "Requests",
    color: "#f97316",
    icon: "wait",
    emotion: "neutral",
    contextHint: "A child doing the potty dance, crossing their legs, pointing toward the bathroom door",
  },
  {
    id: "snack",
    label: "Can I have a snack?",
    text: "Can I have a snack please? I'm a little hungry.",
    category: "Requests",
    color: "#f97316",
    icon: "hungry",
    emotion: "neutral",
    contextHint: "A child looking in the pantry or at snacks on the counter, looking hopeful",
  },
  {
    id: "thirsty",
    label: "I'm thirsty",
    text: "I'm really thirsty. Can I have a drink please?",
    category: "Requests",
    color: "#f97316",
    icon: "thirsty",
    emotion: "neutral",
    contextHint: "A child reaching for a cup of water, looking thirsty",
  },
  {
    id: "help",
    label: "Help me",
    text: "I need some help with this. Can you show me how?",
    category: "Requests",
    color: "#f97316",
    icon: "help",
    emotion: "neutral",
    contextHint: "A child looking puzzled at a task, reaching out to an adult for assistance",
  },
  {
    id: "need-help",
    label: "I need help",
    text: "I need help with this please.",
    category: "Requests",
    color: "#f97316",
    icon: "help",
    emotion: "neutral",
    contextHint: "A child looking at something they can't do alone, reaching out for assistance",
  },
  // Commands
  {
    id: "stop",
    label: "Stop",
    text: "Please stop. I need you to stop right now.",
    category: "Commands",
    color: "#ef4444",
    icon: "stop",
    emotion: "frustrated",
    contextHint: "A child holding up their hand in a stop gesture, looking serious",
  },
  {
    id: "wait",
    label: "Wait",
    text: "Wait, hold on! I'm not ready yet.",
    category: "Commands",
    color: "#ef4444",
    icon: "wait",
    emotion: "neutral",
    contextHint: "A child gesturing to pause, needing a moment to get ready",
  },
  {
    id: "come-here",
    label: "Come here",
    text: "Come here please! I want to show you something.",
    category: "Commands",
    color: "#ef4444",
    icon: "wave",
    emotion: "excited",
    contextHint: "A child beckoning someone to come closer, excited to share something",
  },
  {
    id: "listen",
    label: "Listen",
    text: "Hey, listen to me for a second. This is important.",
    category: "Commands",
    color: "#ef4444",
    icon: "listen",
    emotion: "neutral",
    contextHint: "A child trying to get attention, cupping hands near their mouth",
  },
  // Refusals
  {
    id: "no-thanks",
    label: "No thank you",
    text: "No thank you, I don't want that right now.",
    category: "Refusals",
    color: "#8b5cf6",
    icon: "no",
    emotion: "calm",
    contextHint: "A child politely shaking their head, declining something offered",
  },
  {
    id: "im-done",
    label: "I'm done",
    text: "I'm all done now. I don't want any more.",
    category: "Refusals",
    color: "#8b5cf6",
    icon: "finished",
    emotion: "calm",
    contextHint: "A child pushing away their plate or stopping an activity, satisfied",
  },
  {
    id: "not-now",
    label: "Not now",
    text: "Not right now. Maybe later, okay?",
    category: "Refusals",
    color: "#8b5cf6",
    icon: "wait",
    emotion: "calm",
    contextHint: "A child gesturing 'later' while focused on something else",
  },
  {
    id: "break",
    label: "I need a break",
    text: "I need to take a break. This is too much right now.",
    category: "Refusals",
    color: "#8b5cf6",
    icon: "wait",
    emotion: "calm",
    contextHint: "A child sitting down to rest, taking deep breaths",
  },
  // Questions
  {
    id: "what-doing",
    label: "What's that?",
    text: "What is that? Can you tell me about it?",
    category: "Questions",
    color: "#3b82f6",
    icon: "what",
    emotion: "neutral",
    contextHint: "A curious child pointing at something unfamiliar, tilting their head",
  },
  {
    id: "where-going",
    label: "Where?",
    text: "Where are we going? I want to know!",
    category: "Questions",
    color: "#3b82f6",
    icon: "where",
    emotion: "excited",
    contextHint: "A child looking around curiously, wondering about the destination",
  },
  {
    id: "when",
    label: "When?",
    text: "When is it going to happen? I can't wait!",
    category: "Questions",
    color: "#3b82f6",
    icon: "when",
    emotion: "excited",
    contextHint: "An eager child checking the clock or calendar, anticipating something",
  },
  {
    id: "why",
    label: "Why?",
    text: "Why? I want to understand. Can you explain?",
    category: "Questions",
    color: "#3b82f6",
    icon: "why",
    emotion: "neutral",
    contextHint: "A thoughtful child with a questioning expression, seeking to learn",
  },
  // Feelings
  {
    id: "happy",
    label: "I'm happy",
    text: "I'm feeling so happy right now! This is great!",
    category: "Feelings",
    color: "#ec4899",
    icon: "happy",
    emotion: "happy",
    contextHint: "A joyful child with a big smile, arms spread wide in happiness",
  },
  {
    id: "sad",
    label: "I'm sad",
    text: "I'm feeling sad. I need a hug.",
    category: "Feelings",
    color: "#ec4899",
    icon: "sad",
    emotion: "sad",
    contextHint: "A sad child being comforted by a caring adult with a gentle hug",
  },
  {
    id: "tired",
    label: "I'm tired",
    text: "I'm tired. I need to rest.",
    category: "Feelings",
    color: "#ec4899",
    icon: "wait",
    emotion: "calm",
    contextHint: "A sleepy child rubbing their eyes, yawning, ready for bed",
  },
  {
    id: "love-you",
    label: "I love you",
    text: "I love you so much! You're the best!",
    category: "Feelings",
    color: "#ec4899",
    icon: "love",
    emotion: "happy",
    contextHint: "A child giving a warm hug to someone they love, hearts floating around",
  },
  {
    id: "good-night",
    label: "Good night",
    text: "Good night! Sleep well!",
    category: "Social",
    color: "#14b8a6",
    icon: "moon",
    emotion: "calm",
    contextHint: "A child in pajamas waving goodnight, getting into bed with a stuffed animal",
  },
  {
    id: "good-day",
    label: "I had a good day",
    text: "I had a good day today! It was fun!",
    category: "Feelings",
    color: "#ec4899",
    icon: "smile",
    emotion: "happy",
    contextHint: "A happy child at the end of the day, smiling about the fun things they did",
  },
]

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
    emotion: Emotion
    contextHint?: string
  }>({
    isOpen: false,
    text: "",
    label: "",
    category: "",
    emotion: "neutral",
    contextHint: undefined,
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
      preloadContextImage(button.text, button.emotion)
    })
  }, [selectedCategory])

  useEffect(() => {
    const priorityPhrases = [
      { text: "Hey! Come check this out with me!", emotion: "excited" },
      { text: "I need some help with this. Can you show me how?", emotion: "neutral" },
      { text: "No thank you, I don't want that right now.", emotion: "calm" },
      { text: "I'm feeling so happy right now! This is great!", emotion: "happy" },
      { text: "What are we going to do today? I want to know!", emotion: "excited" },
      { text: "I need to take a break. This is too much right now.", emotion: "calm" },
    ]

    priorityPhrases.forEach(({ text, emotion }) => {
      preloadContextImage(text, emotion)
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
        // All buttons are cached
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
  }, [settings.language, allButtons.length, getTranslation, setTranslationCache]) // Use settings.language directly

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

    setLearningModal({
      isOpen: true,
      text: display.text,
      label: display.label,
      category: button.category,
      emotion: button.emotion as Emotion,
      contextHint: button.contextHint,
    })

    setTimeout(() => setLastClickedId(null), 200)
  }

  const handleAddMessage = (text: string, label: string, category: string, emotion: Emotion, contextHint?: string) => {
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

    // Find a matching button
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
      // Briefly highlight and then open the learning modal
      setShowMeHowPhrase(matchingButton.id)
      setTimeout(() => {
        setShowMeHowPhrase(null)
        handleButtonClick(matchingButton)
      }, 1000)
    }
  }

  const handleModelingCommand = (command: { type: string; payload?: Record<string, unknown> }) => {
    // Settings are already updated in AI helper, this is for any additional UI updates
    if (command.type === "toggle_watch_first" || command.type === "toggle_model_mode") {
      // Could show a toast or animation here
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="pt-6 pb-4 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-muted-foreground">
          What do you want to <span className="text-primary">say?</span>
        </h1>
      </div>

      {/* Watch First and Slow Speech toggles */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setSettings({ ...settings, watchFirstMode: !settings.watchFirstMode })}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all",
            settings.watchFirstMode
              ? "bg-green-100 text-green-700 border-2 border-green-300"
              : "bg-white text-muted-foreground border border-border/50 hover:bg-muted",
          )}
        >
          <span className={cn("w-2 h-2 rounded-full", settings.watchFirstMode ? "bg-green-500" : "bg-gray-300")} />
          Watch First
        </button>
        <button
          onClick={() => setSettings({ ...settings, modelingMode: !settings.modelingMode })}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all",
            settings.modelingMode
              ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
              : "bg-white text-muted-foreground hover:bg-muted border border-border/50",
          )}
        >
          <span className={cn("w-2 h-2 rounded-full", settings.modelingMode ? "bg-blue-500" : "bg-gray-300")} />
          Slow Speech
        </button>
      </div>

      {/* Text input and Say It button */}
      <div className="max-w-2xl mx-auto mb-6 px-4">
        <div className="flex gap-3">
          <Input
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Or type anything you want to say..."
            className="flex-1 h-14 text-lg rounded-full border-2 border-primary/20 focus:border-primary px-6"
            onKeyDown={(e) => e.key === "Enter" && handleSpeakCustom()}
          />
          <Button
            onClick={handleSpeakCustom}
            disabled={!customText.trim() || isSpeaking || isLoading}
            className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-lg font-bold shadow-lg"
          >
            <Send className="w-5 h-5 mr-2" />
            Say It
          </Button>
        </div>
      </div>

      {/* Buttons Grid */}
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
            const IconComponent = iconMap[button.icon] || X
            const display = getButtonDisplay(button)
            const isShowMeHow = showMeHowPhrase === button.id

            return (
              <button
                key={button.id}
                onClick={() => handleButtonClick(button)}
                style={{ borderColor: button.color }}
                className={cn(
                  "group relative p-6 rounded-3xl bg-white border-4 shadow-md transition-all",
                  "hover:shadow-xl hover:scale-105 active:scale-95",
                  "flex flex-col items-center gap-3",
                  lastClickedId === button.id && "animate-pulse",
                  focusedWords.length > 0 && filteredButtons.length <= 3 && "p-8",
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
                    "font-bold text-lg text-center",
                    focusedWords.length > 0 && filteredButtons.length <= 3 && "text-2xl",
                  )}
                  style={{ color: button.color }}
                >
                  {display.label}
                </span>
                {isShowMeHow && (
                  <div className="absolute -top-2 -right-2 bg-accent text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce">
                    Watch me!
                  </div>
                )}
              </button>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <X className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">I couldn't find a button for that word</h3>
          <p className="text-muted-foreground mb-6">Try saying "show only help" or another word that's on a button</p>
          <Button onClick={() => setFocusedWords([])} className="bg-primary">
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
          watchFirstMode={settings.watchFirstMode}
          onClose={() => setLearningModal((prev) => ({ ...prev, isOpen: false }))}
          onWatchComplete={() => {
            // Track modeling completion
            if (settings.watchFirstMode) {
              trackModel(learningModal.text)
            }
          }}
        />
      )}
    </div>
  )
}
