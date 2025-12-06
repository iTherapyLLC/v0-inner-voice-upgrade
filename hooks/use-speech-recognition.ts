"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import type { SpeechRecognition, SpeechRecognitionEvent, SpeechRecognitionErrorEvent } from "web-speech-api"

interface SpeechRecognitionResult {
  transcript: string
  confidence: number
}

interface UseSpeechRecognitionOptions {
  onResult?: (result: SpeechRecognitionResult) => void
  onError?: (error: string) => void
  language?: string
  continuous?: boolean
}

interface SpeechRecognitionHook {
  isListening: boolean
  isSupported: boolean
  transcript: string
  confidence: number
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
}

// Extend Window interface for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}): SpeechRecognitionHook {
  const { onResult, onError, language = "en-US", continuous = false } = options

  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [confidence, setConfidence] = useState(0)

  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognitionAPI) {
        setIsSupported(true)

        const recognition = new SpeechRecognitionAPI()
        recognition.continuous = continuous
        recognition.interimResults = false
        recognition.lang = language
        recognition.maxAlternatives = 1

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const result = event.results[event.results.length - 1]
          if (result.isFinal) {
            const transcriptText = result[0].transcript
            const confidenceValue = result[0].confidence

            setTranscript(transcriptText)
            setConfidence(confidenceValue)
            setIsListening(false)

            onResult?.({
              transcript: transcriptText,
              confidence: confidenceValue,
            })
          }
        }

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
          onError?.(event.error)
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current = recognition
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [continuous, language, onError, onResult])

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript("")
      setConfidence(0)
      setIsListening(true)
      try {
        recognitionRef.current.start()
      } catch (error) {
        // Recognition might already be running
        console.error("Error starting speech recognition:", error)
        setIsListening(false)
      }
    }
  }, [isListening])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }, [isListening])

  const resetTranscript = useCallback(() => {
    setTranscript("")
    setConfidence(0)
  }, [])

  return {
    isListening,
    isSupported,
    transcript,
    confidence,
    startListening,
    stopListening,
    resetTranscript,
  }
}
