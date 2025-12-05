"use client"

import { motion } from "framer-motion"

interface KidIllustrationsProps {
  variant?: "reading" | "celebrating" | "learning"
  className?: string
}

export function KidIllustrations({ variant = "reading", className = "" }: KidIllustrationsProps) {
  const illustrations = {
    reading: (
      <svg
        viewBox="0 0 200 200"
        className={`w-full h-full ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cute kid reading a book */}
        <motion.g
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Head */}
          <circle cx="100" cy="70" r="30" fill="#FFD4A3" />
          {/* Hair */}
          <path d="M70 60 Q70 40 100 40 Q130 40 130 60" fill="#8B4513" />
          {/* Eyes */}
          <circle cx="90" cy="70" r="3" fill="#000" />
          <circle cx="110" cy="70" r="3" fill="#000" />
          {/* Smile */}
          <path d="M85 80 Q100 85 115 80" stroke="#000" strokeWidth="2" fill="none" />
          {/* Body */}
          <rect x="75" y="95" width="50" height="60" rx="10" fill="#FF69B4" />
          {/* Book */}
          <rect x="60" y="110" width="40" height="30" rx="3" fill="#87CEEB" stroke="#4169E1" strokeWidth="2" />
          <line x1="80" y1="110" x2="80" y2="140" stroke="#4169E1" strokeWidth="2" />
          {/* Stars around */}
          <motion.path
            d="M50 50 L52 55 L57 55 L53 58 L55 63 L50 60 L45 63 L47 58 L43 55 L48 55 Z"
            fill="#FFD700"
            animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.path
            d="M145 85 L147 90 L152 90 L148 93 L150 98 L145 95 L140 98 L142 93 L138 90 L143 90 Z"
            fill="#FFD700"
            animate={{ rotate: [0, -360], scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          />
        </motion.g>
      </svg>
    ),
    celebrating: (
      <svg
        viewBox="0 0 200 200"
        className={`w-full h-full ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Celebrating kid with arms up */}
        <motion.g
          initial={{ y: 10 }}
          animate={{ y: [10, 0, 10] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {/* Head */}
          <circle cx="100" cy="60" r="25" fill="#FFD4A3" />
          {/* Hair */}
          <ellipse cx="100" cy="45" rx="28" ry="15" fill="#654321" />
          {/* Eyes - closed happy */}
          <path d="M85 60 Q90 58 95 60" stroke="#000" strokeWidth="2" fill="none" />
          <path d="M105 60 Q110 58 115 60" stroke="#000" strokeWidth="2" fill="none" />
          {/* Big smile */}
          <path d="M85 70 Q100 78 115 70" stroke="#000" strokeWidth="2" fill="none" />
          {/* Body */}
          <rect x="80" y="80" width="40" height="50" rx="10" fill="#90EE90" />
          {/* Arms up */}
          <motion.rect
            x="55" y="85" width="20" height="8" rx="4" fill="#FFD4A3"
            animate={{ rotate: [-20, -30, -20] }}
            style={{ transformOrigin: "75px 89px" }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
          <motion.rect
            x="125" y="85" width="20" height="8" rx="4" fill="#FFD4A3"
            animate={{ rotate: [20, 30, 20] }}
            style={{ transformOrigin: "125px 89px" }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
          {/* Confetti */}
          {[...Array(8)].map((_, i) => (
            <motion.circle
              key={i}
              cx={80 + i * 10}
              cy={40 - i * 5}
              r="2"
              fill={['#FF69B4', '#FFD700', '#87CEEB', '#90EE90'][i % 4]}
              animate={{
                y: [0, 20, 40],
                opacity: [1, 0.5, 0],
                rotate: [0, 360]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </motion.g>
      </svg>
    ),
    learning: (
      <svg
        viewBox="0 0 200 200"
        className={`w-full h-full ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Thoughtful learning kid */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Head */}
          <circle cx="100" cy="65" r="28" fill="#FFD4A3" />
          {/* Hair with pigtails */}
          <circle cx="70" cy="60" r="12" fill="#8B4513" />
          <circle cx="130" cy="60" r="12" fill="#8B4513" />
          <path d="M72 50 Q100 35 128 50" fill="#8B4513" />
          {/* Eyes */}
          <circle cx="90" cy="65" r="4" fill="#000" />
          <circle cx="110" cy="65" r="4" fill="#000" />
          {/* Thoughtful expression */}
          <path d="M90 78 Q100 76 110 78" stroke="#000" strokeWidth="2" fill="none" />
          {/* Body */}
          <rect x="78" y="88" width="44" height="55" rx="10" fill="#DDA0DD" />
          {/* Pencil in hand */}
          <rect x="120" y="100" width="25" height="4" rx="2" fill="#FFD700" />
          <rect x="143" y="98" width="8" height="8" fill="#FF69B4" />
          {/* Light bulb thought */}
          <motion.g
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <circle cx="140" cy="40" r="10" fill="#FFD700" opacity="0.8" />
            <path d="M135 50 L137 60 L143 60 L145 50" fill="#FFD700" opacity="0.6" />
          </motion.g>
        </motion.g>
      </svg>
    )
  }

  return illustrations[variant]
}
