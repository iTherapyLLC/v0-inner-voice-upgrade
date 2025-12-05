"use client"

import { motion } from "framer-motion"
import { Star, Sparkles, Heart } from "lucide-react"

const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

interface FloatingElementsProps {
  density?: "low" | "medium" | "high"
}

export function FloatingElements({ density = "medium" }: FloatingElementsProps) {
  const elementCount = {
    low: 10,
    medium: 20,
    high: 30
  }[density]

  const getRandomElement = (index: number) => {
    const type = index % 3
    if (type === 0) return <Star className="text-yellow-300/40" size={16 + Math.random() * 12} fill="currentColor" />
    if (type === 1) return <Sparkles className="text-pink-300/40" size={16 + Math.random() * 12} />
    return <Heart className="text-red-300/40" size={16 + Math.random() * 12} fill="currentColor" />
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Floating stars and sparkles */}
      {[...Array(elementCount)].map((_, i) => (
        <motion.div
          key={`icon-${i}`}
          className="absolute"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            opacity: 0.3 + Math.random() * 0.3,
            scale: 0.8 + Math.random() * 0.4
          }}
          animate={{
            y: [null, -20 - Math.random() * 40, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 4 + Math.random() * 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2
          }}
        >
          {getRandomElement(i)}
        </motion.div>
      ))}

      {/* Floating letters */}
      {[...Array(Math.floor(elementCount / 2))].map((_, i) => {
        const letter = alphabet[Math.floor(Math.random() * alphabet.length)]
        return (
          <motion.div
            key={`letter-${i}`}
            className="absolute text-white/10 font-bold"
            style={{
              fontSize: `${40 + Math.random() * 40}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0.1 }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.2, 0.1],
              rotate: [-5, 5, -5]
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3
            }}
          >
            {letter}
          </motion.div>
        )
      })}
    </div>
  )
}
