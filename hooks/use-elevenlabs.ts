"use client"

import { useState, useCallback, useRef } from "react"
import type { VoiceSpeed, Emotion } from "@/types"
import { SPEED_VALUES, EMOTION_STABILITY } from "@/types"
import { useAppStore } from "@/lib/store"

interface SpeakOptions {
  voiceId?: string
  speed?: VoiceSpeed
  emotion?: Emotion
  language?: string
}

export function useElevenLabs() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>("neutral")
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const settings = useAppStore((state) => state.settings)

  const speak = useCallback(
    (text: string, options?: SpeakOptions | string): Promise<void> => {
      return new Promise(async (resolve, reject) => {
        if (!text) {
          resolve()
          return
        }

        // Support both old signature (voiceId string) and new options object
        const opts: SpeakOptions = typeof options === "string" ? { voiceId: options } : options || {}

        const speed = SPEED_VALUES[opts.speed || "normal"]
        const stability = EMOTION_STABILITY[opts.emotion || "neutral"]

        const language = opts.language || settings?.language || "en"

        // Track emotion for avatar sync
        setCurrentEmotion(opts.emotion || "neutral")

        // Stop any current audio
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current = null
        }

        setIsLoading(true)

        try {
          const response = await fetch("/api/speak", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text,
              voiceId: opts.voiceId,
              speed,
              stability,
              language,
            }),
          })

          if (!response.ok) {
            throw new Error("Failed to generate speech")
          }

          const audioBlob = await response.blob()
          const audioUrl = URL.createObjectURL(audioBlob)

          const audio = new Audio(audioUrl)
          audioRef.current = audio

          audio.onplay = () => {
            setIsLoading(false)
            setIsSpeaking(true)
          }

          audio.onended = () => {
            setIsSpeaking(false)
            setCurrentEmotion("neutral")
            URL.revokeObjectURL(audioUrl)
            resolve()
          }

          audio.onerror = () => {
            setIsLoading(false)
            setIsSpeaking(false)
            setCurrentEmotion("neutral")
            reject(new Error("Audio playback error"))
          }

          await audio.play()
        } catch (error) {
          console.error("ElevenLabs speech error:", error)
          setIsLoading(false)
          setIsSpeaking(false)
          setCurrentEmotion("neutral")
          reject(error)
        }
      })
    },
    [settings?.language],
  )

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
      setIsSpeaking(false)
      setCurrentEmotion("neutral")
    }
  }, [])

  return { speak, stop, isSpeaking, isLoading, currentEmotion }
}
