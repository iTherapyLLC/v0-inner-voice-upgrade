"use client"

import { motion } from "framer-motion"

const VISEME_SHAPES = {
  rest: {
    lipWidth: 60,
    lipHeight: 8,
    jawOpen: 0,
    lipRound: 0,
    tongueVisible: false,
    teethVisible: false,
    description: "Relaxed, closed",
  },
  PP: {
    lipWidth: 50,
    lipHeight: 4,
    jawOpen: 0,
    lipRound: 0,
    tongueVisible: false,
    teethVisible: false,
    description: "Lips pressed (P, B, M)",
  },
  FF: {
    lipWidth: 55,
    lipHeight: 6,
    jawOpen: 5,
    lipRound: 0,
    tongueVisible: false,
    teethVisible: true,
    description: "Teeth on lip (F, V)",
  },
  TH: {
    lipWidth: 55,
    lipHeight: 10,
    jawOpen: 8,
    lipRound: 0,
    tongueVisible: true,
    teethVisible: true,
    description: "Tongue between teeth (TH)",
  },
  DD: {
    lipWidth: 55,
    lipHeight: 12,
    jawOpen: 10,
    lipRound: 0,
    tongueVisible: false,
    teethVisible: true,
    description: "Tongue at ridge (T, D, N, L)",
  },
  KK: {
    lipWidth: 50,
    lipHeight: 14,
    jawOpen: 12,
    lipRound: 0,
    tongueVisible: false,
    teethVisible: false,
    description: "Back tongue raised (K, G)",
  },
  CH: {
    lipWidth: 40,
    lipHeight: 16,
    jawOpen: 10,
    lipRound: 50,
    tongueVisible: false,
    teethVisible: false,
    description: "Rounded, tongue up (CH, SH)",
  },
  SS: {
    lipWidth: 50,
    lipHeight: 6,
    jawOpen: 4,
    lipRound: 0,
    tongueVisible: false,
    teethVisible: true,
    description: "Teeth close (S, Z)",
  },
  RR: {
    lipWidth: 45,
    lipHeight: 14,
    jawOpen: 10,
    lipRound: 30,
    tongueVisible: false,
    teethVisible: false,
    description: "Tongue curled (R)",
  },
  AA: {
    lipWidth: 50,
    lipHeight: 30,
    jawOpen: 35,
    lipRound: 0,
    tongueVisible: false,
    teethVisible: true,
    description: "Wide open (AH)",
  },
  EE: {
    lipWidth: 65,
    lipHeight: 12,
    jawOpen: 10,
    lipRound: 0,
    tongueVisible: false,
    teethVisible: true,
    description: "Spread smile (EE)",
  },
  OO: {
    lipWidth: 30,
    lipHeight: 25,
    jawOpen: 20,
    lipRound: 80,
    tongueVisible: false,
    teethVisible: false,
    description: "Rounded (OO)",
  },
  OH: {
    lipWidth: 40,
    lipHeight: 28,
    jawOpen: 28,
    lipRound: 50,
    tongueVisible: false,
    teethVisible: false,
    description: "Open rounded (OH)",
  },
  WW: {
    lipWidth: 25,
    lipHeight: 20,
    jawOpen: 15,
    lipRound: 100,
    tongueVisible: false,
    teethVisible: false,
    description: "Very rounded (W)",
  },
}

type VisemeType = keyof typeof VISEME_SHAPES

interface AnimatedMouthProps {
  viseme?: VisemeType | string
  size?: number
  className?: string
  showLabel?: boolean
}

export function AnimatedMouth({ viseme = "rest", size = 200, className = "", showLabel = false }: AnimatedMouthProps) {
  const currentShape = VISEME_SHAPES[viseme as VisemeType] || VISEME_SHAPES.rest

  const centerX = size / 2
  const centerY = size / 2
  const scale = size / 200

  // Brand colors - coral/salmon theme
  const lipColor = "#C45C5C"
  const tongueColor = "#F5A5A5"
  const teethFill = "#FFFFFF"
  const teethStroke = "#E8E8E8"
  const mouthInterior = "#2D1B1B"
  const strokeWidth = 2.5 * scale

  // Calculate dimensions
  const lipWidth = currentShape.lipWidth * scale
  const jawOpen = currentShape.jawOpen * scale
  const lipRound = currentShape.lipRound / 100
  const isRounded = lipRound > 0.3
  const isVeryRounded = lipRound > 0.7

  // Adjust lip width for rounded shapes (OO, WW pursed lips)
  const effectiveLipWidth = isVeryRounded ? lipWidth * 0.4 : isRounded ? lipWidth * 0.6 : lipWidth

  return (
    <div className={`relative ${className}`}>
      {/* SVG with no background - just the mouth floating */}
      <svg width={size} height={size * 0.6} viewBox={`0 0 ${size} ${size * 0.6}`} className="overflow-visible">
        {/* Mouth interior / cavity - dark inside when open */}
        {jawOpen > 2 && (
          <motion.ellipse
            cx={centerX}
            cy={centerY + jawOpen * 0.3}
            fill={mouthInterior}
            initial={false}
            animate={{
              rx: effectiveLipWidth * 0.85,
              ry: Math.max(jawOpen * 0.6, 4),
              cy: centerY + jawOpen * 0.3,
            }}
            transition={{ duration: 0.08, ease: "easeOut" }}
          />
        )}

        {/* Upper teeth - simple rounded rectangles when visible */}
        {currentShape.teethVisible && jawOpen > 3 && (
          <motion.g initial={false}>
            <motion.rect
              x={centerX - effectiveLipWidth * 0.7}
              y={centerY - 2 * scale}
              rx={2 * scale}
              fill={teethFill}
              stroke={teethStroke}
              strokeWidth={1}
              initial={false}
              animate={{
                x: centerX - effectiveLipWidth * 0.7,
                width: effectiveLipWidth * 1.4,
                height: Math.min(jawOpen * 0.4, 12 * scale),
              }}
              transition={{ duration: 0.08 }}
            />
            {/* Individual tooth separators for larger openings */}
            {jawOpen > 8 && !isRounded && (
              <>
                <line
                  x1={centerX - effectiveLipWidth * 0.35}
                  y1={centerY}
                  x2={centerX - effectiveLipWidth * 0.35}
                  y2={centerY + Math.min(jawOpen * 0.3, 8 * scale)}
                  stroke={teethStroke}
                  strokeWidth={1}
                />
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={centerX}
                  y2={centerY + Math.min(jawOpen * 0.3, 8 * scale)}
                  stroke={teethStroke}
                  strokeWidth={1}
                />
                <line
                  x1={centerX + effectiveLipWidth * 0.35}
                  y1={centerY}
                  x2={centerX + effectiveLipWidth * 0.35}
                  y2={centerY + Math.min(jawOpen * 0.3, 8 * scale)}
                  stroke={teethStroke}
                  strokeWidth={1}
                />
              </>
            )}
          </motion.g>
        )}

        {/* Tongue - clearly visible for TH sounds, peeking between teeth */}
        {currentShape.tongueVisible && (
          <motion.ellipse
            cx={centerX}
            fill={tongueColor}
            stroke="#E08080"
            strokeWidth={strokeWidth * 0.5}
            initial={false}
            animate={{
              cy: viseme === "TH" ? centerY + 2 * scale : centerY + jawOpen * 0.5,
              rx: viseme === "TH" ? 18 * scale : 15 * scale,
              ry: viseme === "TH" ? 8 * scale : 10 * scale,
            }}
            transition={{ duration: 0.08 }}
          />
        )}

        {/* Upper lip with cupid's bow - LINE ART strokes only */}
        <motion.path
          fill="none"
          stroke={lipColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{
            d: isVeryRounded
              ? // Very rounded (OO, W) - small pursed circle
                `M ${centerX - 12 * scale} ${centerY}
                 Q ${centerX - 6 * scale} ${centerY - 10 * scale}, ${centerX} ${centerY - 8 * scale}
                 Q ${centerX + 6 * scale} ${centerY - 10 * scale}, ${centerX + 12 * scale} ${centerY}`
              : isRounded
                ? // Rounded (CH, SH) - medium pursed
                  `M ${centerX - effectiveLipWidth * 0.5} ${centerY}
                 Q ${centerX - effectiveLipWidth * 0.25} ${centerY - 8 * scale}, ${centerX} ${centerY - 6 * scale}
                 Q ${centerX + effectiveLipWidth * 0.25} ${centerY - 8 * scale}, ${centerX + effectiveLipWidth * 0.5} ${centerY}`
                : // Normal lip with cupid's bow (M shape)
                  `M ${centerX - effectiveLipWidth * 0.5} ${centerY}
                 Q ${centerX - effectiveLipWidth * 0.3} ${centerY - 6 * scale}, ${centerX - 4 * scale} ${centerY - 4 * scale}
                 L ${centerX} ${centerY - 2 * scale}
                 L ${centerX + 4 * scale} ${centerY - 4 * scale}
                 Q ${centerX + effectiveLipWidth * 0.3} ${centerY - 6 * scale}, ${centerX + effectiveLipWidth * 0.5} ${centerY}`,
          }}
          transition={{ duration: 0.08, ease: "easeOut" }}
        />

        {/* Lower lip - fuller and rounder - LINE ART strokes only */}
        <motion.path
          fill="none"
          stroke={lipColor}
          strokeWidth={strokeWidth * 1.1}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{
            d: isVeryRounded
              ? // Very rounded (OO, W) - pursed
                `M ${centerX - 12 * scale} ${centerY}
                 Q ${centerX - 6 * scale} ${centerY + 12 * scale}, ${centerX} ${centerY + 14 * scale}
                 Q ${centerX + 6 * scale} ${centerY + 12 * scale}, ${centerX + 12 * scale} ${centerY}`
              : isRounded
                ? // Rounded
                  `M ${centerX - effectiveLipWidth * 0.5} ${centerY}
                 Q ${centerX - effectiveLipWidth * 0.25} ${centerY + jawOpen + 8 * scale}, ${centerX} ${centerY + jawOpen + 10 * scale}
                 Q ${centerX + effectiveLipWidth * 0.25} ${centerY + jawOpen + 8 * scale}, ${centerX + effectiveLipWidth * 0.5} ${centerY}`
                : // Normal fuller lower lip
                  `M ${centerX - effectiveLipWidth * 0.5} ${centerY}
                 Q ${centerX - effectiveLipWidth * 0.25} ${centerY + jawOpen + 10 * scale}, ${centerX} ${centerY + jawOpen + 14 * scale}
                 Q ${centerX + effectiveLipWidth * 0.25} ${centerY + jawOpen + 10 * scale}, ${centerX + effectiveLipWidth * 0.5} ${centerY}`,
          }}
          transition={{ duration: 0.08, ease: "easeOut" }}
        />

        {/* Lip corners - small dots for definition */}
        <motion.circle
          fill={lipColor}
          r={2.5 * scale}
          initial={false}
          animate={{
            cx: centerX - effectiveLipWidth * 0.5,
            cy: centerY,
          }}
          transition={{ duration: 0.08 }}
        />
        <motion.circle
          fill={lipColor}
          r={2.5 * scale}
          initial={false}
          animate={{
            cx: centerX + effectiveLipWidth * 0.5,
            cy: centerY,
          }}
          transition={{ duration: 0.08 }}
        />
      </svg>

      {/* Viseme label for educational display */}
      {showLabel && (
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
          <span className="text-sm font-mono bg-muted px-3 py-1 rounded-full text-muted-foreground font-semibold">
            {viseme.toUpperCase()}
          </span>
          <p className="text-xs text-muted-foreground mt-1.5">{currentShape.description}</p>
        </div>
      )}
    </div>
  )
}

export type { VisemeType }
export { VISEME_SHAPES }
