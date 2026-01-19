"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Lumi - The InnerVoice Learning Companion
// A friendly owl mascot that encourages learning

export type MascotMood =
  | "happy"      // Default, welcoming
  | "excited"    // Correct answer, achievements
  | "thinking"   // Processing, waiting
  | "encouraging"// After mistake, supportive
  | "celebrating"// Big achievements, streaks
  | "sleeping"   // Idle for too long
  | "waving"     // Greeting

interface LumiProps {
  mood?: MascotMood
  message?: string
  size?: "sm" | "md" | "lg"
  position?: "left" | "right" | "center"
  showSpeechBubble?: boolean
  className?: string
  onClick?: () => void
}

export function Lumi({
  mood = "happy",
  message,
  size = "md",
  position = "right",
  showSpeechBubble = true,
  className = "",
  onClick
}: LumiProps) {
  const [currentMood, setCurrentMood] = useState(mood)
  const [isBlinking, setIsBlinking] = useState(false)

  // Random blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7 && currentMood !== "sleeping") {
        setIsBlinking(true)
        setTimeout(() => setIsBlinking(false), 150)
      }
    }, 2000)
    return () => clearInterval(blinkInterval)
  }, [currentMood])

  useEffect(() => {
    setCurrentMood(mood)
  }, [mood])

  const sizeStyles = {
    sm: { width: 60, height: 70 },
    md: { width: 100, height: 120 },
    lg: { width: 150, height: 180 },
  }

  const positionStyles = {
    left: "left-4",
    right: "right-4",
    center: "left-1/2 -translate-x-1/2",
  }

  const { width, height } = sizeStyles[size]

  // Eye expressions based on mood
  const getEyeStyle = () => {
    if (isBlinking) return { scaleY: 0.1 }
    switch (currentMood) {
      case "excited":
      case "celebrating":
        return { scaleY: 1.2, scaleX: 1.1 }
      case "sleeping":
        return { scaleY: 0.1 }
      case "thinking":
        return { scaleY: 0.8, x: 2 }
      case "encouraging":
        return { scaleY: 0.9 }
      default:
        return { scaleY: 1, scaleX: 1 }
    }
  }

  // Body animation based on mood
  const getBodyAnimation = () => {
    switch (currentMood) {
      case "excited":
        return {
          y: [0, -8, 0],
          rotate: [-3, 3, -3],
          transition: { duration: 0.4, repeat: Infinity }
        }
      case "celebrating":
        return {
          y: [0, -15, 0],
          scale: [1, 1.1, 1],
          transition: { duration: 0.5, repeat: Infinity }
        }
      case "thinking":
        return {
          rotate: [-2, 2],
          transition: { duration: 2, repeat: Infinity, repeatType: "reverse" as const }
        }
      case "sleeping":
        return {
          y: [0, 2, 0],
          transition: { duration: 2, repeat: Infinity }
        }
      case "waving":
        return {
          rotate: [-5, 5, -5],
          transition: { duration: 0.8, repeat: 3 }
        }
      case "encouraging":
        return {
          scale: [1, 1.05, 1],
          transition: { duration: 1, repeat: Infinity }
        }
      default:
        return {
          y: [0, -3, 0],
          transition: { duration: 3, repeat: Infinity }
        }
    }
  }

  // Speech bubble messages based on mood
  const getDefaultMessage = () => {
    switch (currentMood) {
      case "excited":
        return "Great job!"
      case "celebrating":
        return "Amazing!"
      case "thinking":
        return "Hmm..."
      case "encouraging":
        return "You can do it!"
      case "sleeping":
        return "zzZ"
      case "waving":
        return "Hi there!"
      default:
        return "Let's learn!"
    }
  }

  const displayMessage = message || getDefaultMessage()

  return (
    <div className={`relative ${className}`}>
      {/* Speech Bubble */}
      <AnimatePresence>
        {showSpeechBubble && displayMessage && currentMood !== "sleeping" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className={`absolute -top-2 ${position === "left" ? "left-full ml-2" : position === "right" ? "right-full mr-2" : "-top-16"} z-10`}
          >
            <div className="relative bg-white rounded-2xl px-4 py-2 shadow-lg border-2 border-amber-200 max-w-[150px]">
              <motion.p
                className="text-sm font-semibold text-gray-700 text-center"
                key={displayMessage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {displayMessage}
              </motion.p>
              {/* Speech bubble tail */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-b-2 border-r-2 border-amber-200 rotate-45
                  ${position === "left" ? "-left-1.5" : position === "right" ? "-right-1.5 rotate-[225deg]" : "left-1/2 -translate-x-1/2 -bottom-1.5 rotate-[135deg]"}`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lumi the Owl */}
      <motion.div
        className="cursor-pointer select-none"
        onClick={onClick}
        animate={getBodyAnimation()}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{ width, height }}
      >
        <svg
          viewBox="0 0 100 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          {/* Body - Warm gradient */}
          <motion.ellipse
            cx="50"
            cy="75"
            rx="40"
            ry="40"
            fill="url(#bodyGradient)"
          />

          {/* Belly */}
          <ellipse
            cx="50"
            cy="85"
            rx="28"
            ry="28"
            fill="url(#bellyGradient)"
          />

          {/* Wing Left */}
          <motion.path
            d="M15 65 Q5 80 15 95 Q25 90 25 75 Z"
            fill="url(#wingGradient)"
            animate={currentMood === "waving" ? { rotate: [0, -20, 0] } : {}}
            style={{ originX: "25px", originY: "80px" }}
          />

          {/* Wing Right */}
          <motion.path
            d="M85 65 Q95 80 85 95 Q75 90 75 75 Z"
            fill="url(#wingGradient)"
            animate={currentMood === "waving" ? { rotate: [0, 20, 0], transition: { duration: 0.4, repeat: Infinity } } : {}}
            style={{ originX: "75px", originY: "80px" }}
          />

          {/* Head - Slightly overlapping body */}
          <motion.circle
            cx="50"
            cy="40"
            r="35"
            fill="url(#headGradient)"
          />

          {/* Ear Tufts */}
          <motion.path
            d="M25 15 Q30 5 35 20 Q30 18 25 15"
            fill="url(#tuftGradient)"
            animate={{ rotate: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.path
            d="M75 15 Q70 5 65 20 Q70 18 75 15"
            fill="url(#tuftGradient)"
            animate={{ rotate: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />

          {/* Face disk */}
          <ellipse
            cx="50"
            cy="42"
            rx="28"
            ry="25"
            fill="#FEF3C7"
          />

          {/* Eye backgrounds */}
          <circle cx="38" cy="38" r="12" fill="white" />
          <circle cx="62" cy="38" r="12" fill="white" />

          {/* Eyes (pupils) */}
          <motion.g animate={getEyeStyle()}>
            <motion.circle
              cx="38"
              cy="38"
              r="7"
              fill="#1F2937"
              animate={currentMood === "thinking" ? { cx: [38, 40, 38] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.circle
              cx="62"
              cy="38"
              r="7"
              fill="#1F2937"
              animate={currentMood === "thinking" ? { cx: [62, 64, 62] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.g>

          {/* Eye shine */}
          {currentMood !== "sleeping" && (
            <>
              <circle cx="35" cy="35" r="2" fill="white" />
              <circle cx="59" cy="35" r="2" fill="white" />
            </>
          )}

          {/* Beak */}
          <path
            d="M45 48 L50 58 L55 48 Z"
            fill="#F59E0B"
          />

          {/* Blush marks */}
          {(currentMood === "happy" || currentMood === "excited" || currentMood === "celebrating") && (
            <>
              <ellipse cx="25" cy="48" rx="6" ry="3" fill="#FCA5A5" opacity="0.6" />
              <ellipse cx="75" cy="48" rx="6" ry="3" fill="#FCA5A5" opacity="0.6" />
            </>
          )}

          {/* Feet */}
          <ellipse cx="40" cy="113" rx="8" ry="4" fill="#F59E0B" />
          <ellipse cx="60" cy="113" rx="8" ry="4" fill="#F59E0B" />

          {/* Celebration stars (only when celebrating) */}
          {currentMood === "celebrating" && (
            <>
              <motion.path
                d="M10 20 L12 26 L18 26 L13 30 L15 36 L10 32 L5 36 L7 30 L2 26 L8 26 Z"
                fill="#FBBF24"
                animate={{ scale: [0, 1.2, 1], rotate: [0, 180], opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
              />
              <motion.path
                d="M85 15 L87 21 L93 21 L88 25 L90 31 L85 27 L80 31 L82 25 L77 21 L83 21 Z"
                fill="#FBBF24"
                animate={{ scale: [0, 1.2, 1], rotate: [0, -180], opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
              />
              <motion.path
                d="M50 5 L52 11 L58 11 L53 15 L55 21 L50 17 L45 21 L47 15 L42 11 L48 11 Z"
                fill="#FBBF24"
                animate={{ scale: [0, 1.2, 1], y: [0, -5, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
              />
            </>
          )}

          {/* Z's when sleeping */}
          {currentMood === "sleeping" && (
            <motion.text
              x="70"
              y="25"
              fill="#6B7280"
              fontSize="14"
              fontWeight="bold"
              animate={{ opacity: [0, 1, 0], y: [0, -10] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              z
            </motion.text>
          )}

          {/* Gradients */}
          <defs>
            <linearGradient id="bodyGradient" x1="50" y1="35" x2="50" y2="115" gradientUnits="userSpaceOnUse">
              <stop stopColor="#D97706" />
              <stop offset="1" stopColor="#92400E" />
            </linearGradient>
            <linearGradient id="headGradient" x1="50" y1="5" x2="50" y2="75" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59E0B" />
              <stop offset="1" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="bellyGradient" x1="50" y1="57" x2="50" y2="113" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FEF3C7" />
              <stop offset="1" stopColor="#FDE68A" />
            </linearGradient>
            <linearGradient id="wingGradient" x1="20" y1="65" x2="20" y2="95" gradientUnits="userSpaceOnUse">
              <stop stopColor="#B45309" />
              <stop offset="1" stopColor="#78350F" />
            </linearGradient>
            <linearGradient id="tuftGradient" x1="30" y1="5" x2="30" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#92400E" />
              <stop offset="1" stopColor="#78350F" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  )
}

// Predefined encouraging messages
export const LUMI_MESSAGES = {
  greeting: [
    "Hi there!",
    "Ready to learn?",
    "Let's go!",
    "Hello friend!",
  ],
  correct: [
    "Great job!",
    "Awesome!",
    "Perfect!",
    "You got it!",
    "Amazing!",
    "Fantastic!",
  ],
  incorrect: [
    "Try again!",
    "Almost!",
    "Keep going!",
    "You can do it!",
    "One more try!",
  ],
  streak: [
    "On fire!",
    "Unstoppable!",
    "Wow!",
    "Keep it up!",
  ],
  encouragement: [
    "You're doing great!",
    "Keep learning!",
    "Don't give up!",
    "I believe in you!",
  ],
  celebration: [
    "You did it!",
    "Champion!",
    "Super star!",
    "Incredible!",
  ],
}

// Helper to get random message
export function getRandomLumiMessage(category: keyof typeof LUMI_MESSAGES): string {
  const messages = LUMI_MESSAGES[category]
  return messages[Math.floor(Math.random() * messages.length)]
}

// Hook for managing Lumi state
export function useLumi() {
  const [mood, setMood] = useState<MascotMood>("happy")
  const [message, setMessage] = useState<string>("")

  const celebrate = (customMessage?: string) => {
    setMood("celebrating")
    setMessage(customMessage || getRandomLumiMessage("celebration"))
    setTimeout(() => {
      setMood("happy")
      setMessage("")
    }, 3000)
  }

  const encourage = (customMessage?: string) => {
    setMood("encouraging")
    setMessage(customMessage || getRandomLumiMessage("encouragement"))
    setTimeout(() => {
      setMood("happy")
      setMessage("")
    }, 2500)
  }

  const excited = (customMessage?: string) => {
    setMood("excited")
    setMessage(customMessage || getRandomLumiMessage("correct"))
    setTimeout(() => {
      setMood("happy")
      setMessage("")
    }, 2000)
  }

  const think = () => {
    setMood("thinking")
    setMessage("Hmm...")
  }

  const wave = () => {
    setMood("waving")
    setMessage(getRandomLumiMessage("greeting"))
    setTimeout(() => {
      setMood("happy")
      setMessage("")
    }, 2500)
  }

  const reset = () => {
    setMood("happy")
    setMessage("")
  }

  return {
    mood,
    message,
    setMood,
    setMessage,
    celebrate,
    encourage,
    excited,
    think,
    wave,
    reset,
  }
}

export default Lumi
