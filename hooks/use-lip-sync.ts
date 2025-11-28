"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { type VisemeType, textToVisemes, VISEME_SHAPES } from "@/lib/viseme/definitions"

interface LipSyncState {
  currentViseme: VisemeType
  isAnimating: boolean
  progress: number
}

interface UseLipSyncOptions {
  speed?: number
  onComplete?: () => void
}

export function useLipSync(options: UseLipSyncOptions = {}) {
  const { speed = 150, onComplete } = options

  const [state, setState] = useState<LipSyncState>({
    currentViseme: "rest",
    isAnimating: false,
    progress: 0,
  })

  const animationRef = useRef<number | null>(null)
  const visemesRef = useRef<VisemeType[]>([])
  const startTimeRef = useRef<number>(0)
  const durationRef = useRef<number>(0)

  const stop = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    setState({
      currentViseme: "rest",
      isAnimating: false,
      progress: 0,
    })
  }, [])

  const animate = useCallback(
    (text: string, playbackSpeed = 1) => {
      stop()

      const visemes = textToVisemes(text)
      visemesRef.current = visemes

      // Calculate duration based on text length and speed
      const wordsCount = text.split(/\s+/).length
      const baseDuration = (wordsCount / speed) * 60 * 1000
      durationRef.current = baseDuration / playbackSpeed
      startTimeRef.current = performance.now()

      setState((prev) => ({ ...prev, isAnimating: true, progress: 0 }))

      const tick = () => {
        const elapsed = performance.now() - startTimeRef.current
        const progress = Math.min(elapsed / durationRef.current, 1)

        // Get current viseme based on progress
        const visemeIndex = Math.floor(progress * visemesRef.current.length)
        const currentViseme = visemesRef.current[Math.min(visemeIndex, visemesRef.current.length - 1)] || "rest"

        setState({
          currentViseme,
          isAnimating: progress < 1,
          progress,
        })

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(tick)
        } else {
          setState((prev) => ({ ...prev, currentViseme: "rest", isAnimating: false }))
          onComplete?.()
        }
      }

      animationRef.current = requestAnimationFrame(tick)
    },
    [speed, stop, onComplete],
  )

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return {
    ...state,
    currentShape: VISEME_SHAPES[state.currentViseme],
    animate,
    stop,
  }
}
