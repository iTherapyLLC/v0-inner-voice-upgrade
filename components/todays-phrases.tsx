"use client"

import { useAppStore } from "@/lib/store"
import { useElevenLabs } from "@/hooks/use-elevenlabs"
import { Sparkles, Clock, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface TodaysPhrasesProps {
  onPhraseClick?: (phrase: string) => void
}

export function TodaysPhrases({ onPhraseClick }: TodaysPhrasesProps) {
  const { getFrequentPhrases, settings } = useAppStore()
  const { speak, isSpeaking } = useElevenLabs()

  const frequentPhrases = getFrequentPhrases()

  // Get time-based suggestions
  const hour = new Date().getHours()
  let timeSuggestions: string[] = []

  if (hour >= 6 && hour < 10) {
    timeSuggestions = ["Good morning!", "I'm hungry for breakfast", "I need to use the bathroom"]
  } else if (hour >= 11 && hour < 14) {
    timeSuggestions = ["I'm hungry for lunch", "Can I have a snack?", "I want to go outside"]
  } else if (hour >= 17 && hour < 20) {
    timeSuggestions = ["What's for dinner?", "I'm tired", "Can we watch something?"]
  } else if (hour >= 20 || hour < 6) {
    timeSuggestions = ["I'm sleepy", "Goodnight!", "Can I have water?"]
  }

  // Combine frequent + time-based, dedupe
  const allSuggestions = [...new Set([...frequentPhrases, ...timeSuggestions])].slice(0, 6)

  if (allSuggestions.length === 0) return null

  const handleClick = (phrase: string) => {
    speak(phrase, settings.voiceId)
    onPhraseClick?.(phrase)
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-5 w-5 text-accent" />
        <h2 className="text-lg font-bold text-foreground">Quick phrases for you</h2>
        <Clock className="h-4 w-4 text-muted-foreground ml-auto" />
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {allSuggestions.map((phrase) => {
          const isFrequent = frequentPhrases.includes(phrase)
          return (
            <button
              key={phrase}
              onClick={() => handleClick(phrase)}
              disabled={isSpeaking}
              className={cn(
                "flex-shrink-0 rounded-2xl px-5 py-3 font-semibold transition-all",
                "border-2 shadow-md hover:shadow-lg active:scale-95",
                isFrequent
                  ? "bg-accent/10 border-accent text-accent-foreground"
                  : "bg-card border-primary/20 text-foreground hover:border-primary/40",
                isSpeaking && "opacity-50",
              )}
            >
              {isFrequent && <TrendingUp className="inline-block w-4 h-4 mr-2" />}
              {phrase}
            </button>
          )
        })}
      </div>
    </div>
  )
}
