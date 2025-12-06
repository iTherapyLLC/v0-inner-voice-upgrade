"use client"

import { useState, useRef, useCallback, useEffect } from "react"

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

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: {
    isFinal: boolean
    0: {
      transcript: string
      confidence: number
    }
  }
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  maxAlternatives: number
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  onstart: (() => void) | null
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance
}

// Extend Window interface for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor
    webkitSpeechRecognition: SpeechRecognitionConstructor
  }
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}): SpeechRecognitionHook {
  const { onResult, onError, language = "en-US", continuous = false } = options

  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [confidence, setConfidence] = useState(0)

  const onResultRef = useRef(onResult)
  const onErrorRef = useRef(onError)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

  // Keep refs in sync with latest callbacks
  useEffect(() => {
    onResultRef.current = onResult
    onErrorRef.current = onError
  }, [onResult, onError])

  useEffect(() => {
    if (typeof window === "undefined") return

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognitionAPI) {
      console.log("[v0] Speech recognition not supported in this browser")
      setIsSupported(false)
      return
    }

    setIsSupported(true)
    console.log("[v0] Speech recognition is supported")

    const recognition = new SpeechRecognitionAPI()
    recognition.continuous = continuous
    recognition.interimResults = false
    recognition.lang = language
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      console.log("[v0] Speech recognition started")
      setIsListening(true)
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      console.log("[v0] Speech recognition result received:", event.results)
      const result = event.results[event.results.length - 1]
      if (result.isFinal) {
        const transcriptText = result[0].transcript.trim().toLowerCase()
        const confidenceValue = result[0].confidence

        console.log("[v0] Final transcript:", transcriptText, "Confidence:", confidenceValue)

        setTranscript(transcriptText)
        setConfidence(confidenceValue)
        setIsListening(false)

        onResultRef.current?.({
          transcript: transcriptText,
          confidence: confidenceValue,
        })
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("[v0] Speech recognition error:", event.error, event.message)
      setIsListening(false)
      onErrorRef.current?.(event.error)
    }

    recognition.onend = () => {
      console.log("[v0] Speech recognition ended")
      setIsListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
    }
  }, [continuous, language]) // Removed callbacks from dependency array

  const startListening = useCallback(() => {
    console.log(
      "[v0] startListening called, recognition exists:",
      !!recognitionRef.current,
      "isListening:",
      isListening,
    )

    if (!recognitionRef.current) {
      console.error("[v0] No recognition instance available")
      return
    }

    if (isListening) {
      console.log("[v0] Already listening, ignoring start request")
      return
    }

    setTranscript("")
    setConfidence(0)

    try {
      console.log("[v0] Starting speech recognition...")
      recognitionRef.current.start()
    } catch (error) {
      console.error("[v0] Error starting speech recognition:", error)
      setIsListening(false)

      // If already started, try to stop and restart
      if (error instanceof DOMException && error.name === "InvalidStateError") {
        try {
          recognitionRef.current.stop()
          setTimeout(() => {
            recognitionRef.current?.start()
          }, 100)
        } catch (e) {
          console.error("[v0] Failed to restart recognition:", e)
        }
      }
    }
  }, [isListening])

  const stopListening = useCallback(() => {
    console.log("[v0] stopListening called")
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop()
      } catch (e) {
        console.error("[v0] Error stopping recognition:", e)
      }
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
