"use client"

import React, { useEffect, useState, useCallback, useRef } from "react"
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from "framer-motion"

// ============================================
// TYPEWRITER TEXT ANIMATION
// ============================================
interface TypewriterProps {
  text: string
  speed?: number
  delay?: number
  className?: string
  onComplete?: () => void
  cursor?: boolean
}

export function Typewriter({
  text,
  speed = 50,
  delay = 0,
  className = "",
  onComplete,
  cursor = true
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    setDisplayedText("")
    setIsComplete(false)

    const timeout = setTimeout(() => {
      let index = 0
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1))
          index++
        } else {
          clearInterval(interval)
          setIsComplete(true)
          onComplete?.()
        }
      }, speed)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timeout)
  }, [text, speed, delay, onComplete])

  return (
    <span className={className}>
      {displayedText}
      {cursor && !isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="inline-block w-0.5 h-[1em] bg-current ml-0.5 align-middle"
        />
      )}
    </span>
  )
}

// ============================================
// ANIMATED LETTER (bounce/float when learned)
// ============================================
interface AnimatedLetterProps {
  letter: string
  isLearned?: boolean
  delay?: number
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  color?: string
}

export function AnimatedLetter({
  letter,
  isLearned = false,
  delay = 0,
  className = "",
  size = "lg",
  color
}: AnimatedLetterProps) {
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl",
    xl: "text-8xl"
  }

  return (
    <motion.span
      className={`inline-block font-bold ${sizeClasses[size]} ${className}`}
      style={{ color }}
      initial={{ scale: 0, rotate: -180 }}
      animate={isLearned ? {
        scale: [1, 1.2, 1],
        rotate: [0, 10, -10, 0],
        y: [0, -20, 0],
      } : { scale: 1, rotate: 0 }}
      transition={{
        delay,
        duration: isLearned ? 0.8 : 0.5,
        repeat: isLearned ? Infinity : 0,
        repeatDelay: 2,
        type: "spring",
        stiffness: 200,
      }}
      whileHover={{
        scale: 1.3,
        rotate: [0, -5, 5, 0],
        transition: { duration: 0.3 }
      }}
    >
      {letter}
    </motion.span>
  )
}

// ============================================
// FLOATING ANIMATION (for decorative elements)
// ============================================
interface FloatingProps {
  children: React.ReactNode
  duration?: number
  distance?: number
  delay?: number
  className?: string
}

export function Floating({
  children,
  duration = 3,
  distance = 10,
  delay = 0,
  className = ""
}: FloatingProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-distance, distance, -distance],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  )
}

// ============================================
// BOUNCE IN ANIMATION
// ============================================
interface BounceInProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function BounceIn({ children, delay = 0, className = "" }: BounceInProps) {
  return (
    <motion.div
      className={className}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        delay,
        type: "spring",
        stiffness: 400,
        damping: 15,
      }}
    >
      {children}
    </motion.div>
  )
}

// ============================================
// SQUISH BUTTON
// ============================================
interface SquishButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
  variant?: "primary" | "secondary" | "success" | "danger"
  size?: "sm" | "md" | "lg"
  glowColor?: string
}

export function SquishButton({
  children,
  onClick,
  disabled = false,
  className = "",
  variant = "primary",
  size = "md",
  glowColor
}: SquishButtonProps) {
  const variantStyles = {
    primary: "bg-gradient-to-r from-primary to-orange-500 text-white shadow-primary/30",
    secondary: "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-gray-500/30",
    success: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/30",
    danger: "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-rose-500/30",
  }

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  return (
    <motion.button
      className={`
        rounded-xl font-bold shadow-lg transition-colors
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : {
        scale: 1.05,
        boxShadow: glowColor
          ? `0 0 30px ${glowColor}`
          : "0 10px 40px rgba(0,0,0,0.2)"
      }}
      whileTap={disabled ? {} : {
        scale: 0.92,
        rotateX: 10,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 15,
      }}
    >
      {children}
    </motion.button>
  )
}

// ============================================
// 3D TILT CARD
// ============================================
interface TiltCardProps {
  children: React.ReactNode
  className?: string
  intensity?: number
  glare?: boolean
  onClick?: () => void
}

export function TiltCard({
  children,
  className = "",
  intensity = 15,
  glare = true,
  onClick
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-0.5, 0.5], [intensity, -intensity])
  const rotateY = useTransform(x, [-0.5, 0.5], [-intensity, intensity])

  const glareX = useTransform(x, [-0.5, 0.5], [0, 100])
  const glareY = useTransform(y, [-0.5, 0.5], [0, 100])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) / rect.width)
    y.set((e.clientY - centerY) / rect.height)
  }, [x, y])

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ z: 50 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
      {glare && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-inherit"
          style={{
            background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.3) 0%, transparent 60%)`,
            borderRadius: "inherit",
          }}
        />
      )}
    </motion.div>
  )
}

// ============================================
// CONFETTI CELEBRATION
// ============================================
interface ConfettiPiece {
  id: number
  x: number
  color: string
  delay: number
  rotation: number
  size: number
}

interface ConfettiProps {
  isActive: boolean
  duration?: number
  particleCount?: number
  colors?: string[]
}

export function Confetti({
  isActive,
  duration = 3000,
  particleCount = 50,
  colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#ff8800", "#88ff00"]
}: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    if (isActive) {
      const newPieces: ConfettiPiece[] = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        rotation: Math.random() * 360,
        size: Math.random() * 8 + 4,
      }))
      setPieces(newPieces)

      const timer = setTimeout(() => setPieces([]), duration)
      return () => clearTimeout(timer)
    }
  }, [isActive, duration, particleCount, colors])

  return (
    <AnimatePresence>
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="fixed pointer-events-none z-50"
          style={{
            left: `${piece.x}%`,
            top: -20,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{
            y: window.innerHeight + 100,
            opacity: [1, 1, 0],
            rotate: piece.rotation + 720,
            x: [0, (Math.random() - 0.5) * 200, (Math.random() - 0.5) * 300],
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 2 + Math.random(),
            delay: piece.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </AnimatePresence>
  )
}

// ============================================
// STAR BURST (success celebration)
// ============================================
interface StarBurstProps {
  isActive: boolean
  x?: number
  y?: number
  starCount?: number
  colors?: string[]
}

export function StarBurst({
  isActive,
  x = 50,
  y = 50,
  starCount = 12,
  colors = ["#fbbf24", "#f59e0b", "#d97706", "#fcd34d"]
}: StarBurstProps) {
  const [stars, setStars] = useState<number[]>([])

  useEffect(() => {
    if (isActive) {
      setStars(Array.from({ length: starCount }, (_, i) => i))
      const timer = setTimeout(() => setStars([]), 1500)
      return () => clearTimeout(timer)
    }
  }, [isActive, starCount])

  return (
    <AnimatePresence>
      {stars.map((i) => {
        const angle = (i / starCount) * 360
        const distance = 80 + Math.random() * 40
        const color = colors[i % colors.length]

        return (
          <motion.div
            key={i}
            className="fixed pointer-events-none z-50"
            style={{
              left: `${x}%`,
              top: `${y}%`,
            }}
            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
            animate={{
              scale: [0, 1.5, 0],
              x: Math.cos(angle * Math.PI / 180) * distance,
              y: Math.sin(angle * Math.PI / 180) * distance,
              opacity: [1, 1, 0],
              rotate: [0, 180],
            }}
            transition={{
              duration: 0.8,
              delay: i * 0.03,
              ease: "easeOut",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={color}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </motion.div>
        )
      })}
    </AnimatePresence>
  )
}

// ============================================
// STREAK FIRE EFFECT
// ============================================
interface StreakFireProps {
  streak: number
  threshold?: number
  className?: string
}

export function StreakFire({ streak, threshold = 3, className = "" }: StreakFireProps) {
  const isOnFire = streak >= threshold
  const intensity = Math.min((streak - threshold + 1) / 5, 1)

  if (!isOnFire) return null

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      {/* Fire glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-orange-500 via-red-500 to-yellow-400 rounded-full blur-xl"
        animate={{
          scale: [1, 1.2 + intensity * 0.3, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Fire icon */}
      <motion.div
        className="relative z-10"
        animate={{
          y: [0, -3, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          className="drop-shadow-lg"
        >
          <motion.path
            d="M12 2C6.5 8 3 12 3 15.5C3 19.64 6.36 23 10.5 23C11.38 23 12.5 22.5 12.5 21.5C12.5 20.5 11.5 20 11.5 19C11.5 17 14 16 14 13C17.5 16 21 18.09 21 15.5C21 12 17.5 8 12 2Z"
            fill="url(#fireGradient)"
            animate={{
              d: [
                "M12 2C6.5 8 3 12 3 15.5C3 19.64 6.36 23 10.5 23C11.38 23 12.5 22.5 12.5 21.5C12.5 20.5 11.5 20 11.5 19C11.5 17 14 16 14 13C17.5 16 21 18.09 21 15.5C21 12 17.5 8 12 2Z",
                "M12 2C6.5 8 3 11 3 15.5C3 19.64 6.36 23 10.5 23C11.38 23 12.5 22.5 12.5 21.5C12.5 20.5 11.5 20 11.5 19C11.5 17 13 15 13 12C17 15 21 17.09 21 15.5C21 12 17.5 8 12 2Z",
              ],
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <defs>
            <linearGradient id="fireGradient" x1="12" y1="2" x2="12" y2="23" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FBBF24" />
              <stop offset="0.5" stopColor="#F97316" />
              <stop offset="1" stopColor="#DC2626" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Streak count */}
      <motion.div
        className="absolute -bottom-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        {streak}
      </motion.div>
    </motion.div>
  )
}

// ============================================
// ANIMATED PROGRESS BAR
// ============================================
interface AnimatedProgressProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
  colors?: string[]
  height?: number
  animated?: boolean
}

export function AnimatedProgress({
  value,
  max = 100,
  className = "",
  showLabel = true,
  colors = ["#10b981", "#14b8a6", "#0ea5e9"],
  height = 12,
  animated = true
}: AnimatedProgressProps) {
  const percentage = Math.min((value / max) * 100, 100)
  const springValue = useSpring(0, { stiffness: 100, damping: 30 })

  useEffect(() => {
    springValue.set(percentage)
  }, [percentage, springValue])

  const width = useTransform(springValue, (v) => `${v}%`)

  return (
    <div className={`relative ${className}`}>
      <div
        className="w-full bg-gray-200 rounded-full overflow-hidden"
        style={{ height }}
      >
        <motion.div
          className="h-full rounded-full relative"
          style={{
            width,
            background: `linear-gradient(90deg, ${colors.join(", ")})`,
          }}
        >
          {animated && (
            <motion.div
              className="absolute inset-0 opacity-50"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
              }}
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          )}
        </motion.div>
      </div>
      {showLabel && (
        <motion.span
          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white drop-shadow"
          style={{ display: percentage > 15 ? "block" : "none" }}
        >
          {Math.round(percentage)}%
        </motion.span>
      )}
    </div>
  )
}

// ============================================
// PULSE GLOW (for active/highlight states)
// ============================================
interface PulseGlowProps {
  children: React.ReactNode
  color?: string
  isActive?: boolean
  className?: string
}

export function PulseGlow({
  children,
  color = "#f97316",
  isActive = true,
  className = ""
}: PulseGlowProps) {
  return (
    <div className={`relative ${className}`}>
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-inherit -z-10"
          style={{
            background: color,
            borderRadius: "inherit",
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
      {children}
    </div>
  )
}

// ============================================
// SHAKE ANIMATION (for errors)
// ============================================
interface ShakeProps {
  children: React.ReactNode
  isShaking: boolean
  className?: string
}

export function Shake({ children, isShaking, className = "" }: ShakeProps) {
  return (
    <motion.div
      className={className}
      animate={isShaking ? {
        x: [0, -10, 10, -10, 10, -5, 5, 0],
      } : {}}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}

// ============================================
// SLIDE IN ANIMATION
// ============================================
interface SlideInProps {
  children: React.ReactNode
  direction?: "left" | "right" | "up" | "down"
  delay?: number
  className?: string
}

export function SlideIn({
  children,
  direction = "up",
  delay = 0,
  className = ""
}: SlideInProps) {
  const directionOffset = {
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
    up: { x: 0, y: 50 },
    down: { x: 0, y: -50 },
  }

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        ...directionOffset[direction]
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0
      }}
      transition={{
        delay,
        duration: 0.5,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  )
}

// ============================================
// STAGGER CHILDREN
// ============================================
interface StaggerContainerProps {
  children: React.ReactNode
  staggerDelay?: number
  className?: string
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className = ""
}: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className = ""
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", stiffness: 300, damping: 20 }
        },
      }}
    >
      {children}
    </motion.div>
  )
}

// Export all animations
export const Animations = {
  Typewriter,
  AnimatedLetter,
  Floating,
  BounceIn,
  SquishButton,
  TiltCard,
  Confetti,
  StarBurst,
  StreakFire,
  AnimatedProgress,
  PulseGlow,
  Shake,
  SlideIn,
  StaggerContainer,
  StaggerItem,
}
