"use client"

import { useEffect, useCallback } from "react"
import confetti from "canvas-confetti"

interface ConfettiProps {
  trigger?: boolean
  variant?: "standard" | "stars" | "emoji"
}

export function Confetti({ trigger = false, variant = "standard" }: ConfettiProps) {
  const fireConfetti = useCallback(() => {
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    if (variant === "stars") {
      // Star confetti
      const interval: NodeJS.Timeout = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#FFD700', '#FFA500', '#FFFF00']
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#FFD700', '#FFA500', '#FFFF00']
        })
      }, 250)
    } else if (variant === "emoji") {
      // Emoji confetti
      const scalar = 2
      const star = confetti.shapeFromText({ text: '⭐', scalar })
      const heart = confetti.shapeFromText({ text: '❤️', scalar })
      const sparkle = confetti.shapeFromText({ text: '✨', scalar })

      confetti({
        particleCount: 50,
        spread: 100,
        origin: { y: 0.6 },
        shapes: [star, heart, sparkle],
        scalar
      })
    } else {
      // Standard confetti burst
      const interval: NodeJS.Timeout = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#FF69B4', '#87CEEB', '#90EE90', '#FFD700', '#FF6347']
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#FF69B4', '#87CEEB', '#90EE90', '#FFD700', '#FF6347']
        })
      }, 250)
    }
  }, [variant])

  useEffect(() => {
    if (trigger) {
      fireConfetti()
    }
  }, [trigger, fireConfetti])

  return null
}

// Helper function to trigger confetti programmatically
export function triggerConfetti(variant: "standard" | "stars" | "emoji" = "standard") {
  const event = new CustomEvent('confetti', { detail: { variant } })
  window.dispatchEvent(event)
}
