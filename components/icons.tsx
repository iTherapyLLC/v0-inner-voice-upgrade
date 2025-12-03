export function WaveIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Open palm with spread fingers - clearly a hand waving hello */}
      <path
        d="M24 40c-6 0-10-4-10-10V18c0-1.5 1.2-3 3-3s3 1.5 3 3v8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Index finger */}
      <path d="M20 26V12c0-1.5 1.2-3 3-3s3 1.5 3 3v14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Middle finger */}
      <path d="M26 26V10c0-1.5 1.2-3 3-3s3 1.5 3 3v16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Ring finger */}
      <path
        d="M32 26V12c0-1.5 1.2-3 3-3s3 1.5 3 3v18c0 6-4 10-10 10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Motion lines to show waving */}
      <path
        d="M8 14c2-2 4-3 6-3M6 20c2 0 4-1 5-2M8 26c2 1 4 1 5 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  )
}

export function SunriseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 36h32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M12 36c0-8 5-14 12-14s12 6 12 14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M24 14V8M34 18l4-4M14 18l-4-4M40 28h4M4 28h4"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="24" cy="26" r="6" fill="currentColor" opacity="0.3" />
    </svg>
  )
}

export function HappyFaceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
      <circle cx="16" cy="20" r="3" fill="currentColor" />
      <circle cx="32" cy="20" r="3" fill="currentColor" />
      <path d="M14 30c2 4 6 6 10 6s8-2 10-6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function SadFaceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
      <circle cx="16" cy="20" r="3" fill="currentColor" />
      <circle cx="32" cy="20" r="3" fill="currentColor" />
      <path d="M14 34c2-4 6-6 10-6s8 2 10 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M16 16l-2-4M32 16l2-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  )
}

export function ExcitedIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
      <ellipse cx="16" cy="20" rx="3" ry="4" fill="currentColor" />
      <ellipse cx="32" cy="20" rx="3" ry="4" fill="currentColor" />
      <ellipse cx="24" cy="32" rx="8" ry="6" stroke="currentColor" strokeWidth="3" />
      <path d="M8 8l4 4M40 8l-4 4M4 20l6 0M38 20l6 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function SleepyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
      <path d="M12 20h8M28 20h8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="24" cy="32" rx="4" ry="3" stroke="currentColor" strokeWidth="3" />
      <text x="36" y="12" fill="currentColor" fontSize="10" fontWeight="bold">
        Z
      </text>
      <text x="40" y="8" fill="currentColor" fontSize="8" fontWeight="bold">
        z
      </text>
    </svg>
  )
}

export function HelpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
      <path
        d="M24 34v-2M24 28c0-4 6-4 6-8 0-3-3-6-6-6s-6 3-6 6"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="24" cy="34" r="2" fill="currentColor" />
    </svg>
  )
}

export function FoodIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="24" cy="32" rx="18" ry="8" stroke="currentColor" strokeWidth="3" />
      <path d="M6 32V28c0-12 8-20 18-20s18 8 18 20v4" stroke="currentColor" strokeWidth="3" />
      <circle cx="16" cy="24" r="3" fill="currentColor" opacity="0.5" />
      <circle cx="28" cy="20" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="32" cy="26" r="2" fill="currentColor" opacity="0.5" />
    </svg>
  )
}

export function DrinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 8h20l-4 32H18L14 8z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M16 16h16" stroke="currentColor" strokeWidth="3" />
      <ellipse cx="24" cy="28" rx="4" ry="6" fill="currentColor" opacity="0.3" />
      <circle cx="32" cy="6" r="2" fill="currentColor" />
      <path d="M32 6c4 0 6 2 6 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function PauseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
      <rect x="16" y="14" width="5" height="20" rx="2" fill="currentColor" />
      <rect x="27" y="14" width="5" height="20" rx="2" fill="currentColor" />
    </svg>
  )
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
      <path d="M14 24l7 7 13-14" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function CrossIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
      <path d="M16 16l16 16M32 16l-16 16" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

export function ThinkingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
      <circle cx="16" cy="22" r="3" fill="currentColor" />
      <circle cx="32" cy="22" r="3" fill="currentColor" />
      <path d="M18 32h12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="38" cy="10" r="2" fill="currentColor" />
      <circle cx="42" cy="6" r="1.5" fill="currentColor" />
      <circle cx="44" cy="2" r="1" fill="currentColor" />
    </svg>
  )
}

export function HeartHandsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M24 38l-12-12c-3-3-3-8 0-11s8-3 11 0l1 1 1-1c3-3 8-3 11 0s3 8 0 11L24 38z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M8 26c-2 1-4 3-4 6v8M40 26c2 1 4 3 4 6v8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function GoodbyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M32 8c2 0 4 2 4 4v12M28 6c2 0 4 2 4 4v10M24 8c2 0 4 2 4 4v8M20 12c2 0 4 2 4 4v4M12 20c0-2 2-4 4-4h4c0-2 2-4 4-4"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 20v14c0 4 3 8 10 8s10-4 10-8V20"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M36 32l4 4M36 36l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="4" opacity="0.2" />
      <path
        d="M24 6c10 0 18 8 18 18"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        className="animate-spin-slow origin-center"
      />
      <circle cx="24" cy="8" r="4" fill="currentColor" />
      <circle cx="36" cy="16" r="3" fill="currentColor" opacity="0.7" />
      <circle cx="40" cy="28" r="2" fill="currentColor" opacity="0.4" />
    </svg>
  )
}

export function SpeakingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="24" r="14" stroke="currentColor" strokeWidth="3" />
      <path d="M32 16c4 2 6 5 6 8s-2 6-6 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M36 12c6 3 10 8 10 12s-4 9-10 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="16" cy="22" r="2" fill="currentColor" />
      <circle cx="24" cy="22" r="2" fill="currentColor" />
      <path d="M14 28c2 2 4 3 6 3s4-1 6-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function AvatarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="16" r="10" stroke="currentColor" strokeWidth="3" />
      <path d="M8 44c0-10 7-16 16-16s16 6 16 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="20" cy="14" r="2" fill="currentColor" />
      <circle cx="28" cy="14" r="2" fill="currentColor" />
      <path d="M20 20c1 1 3 2 4 2s3-1 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function ChatBubbleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 10h32c2 0 4 2 4 4v18c0 2-2 4-4 4H20l-8 8v-8H8c-2 0-4-2-4-4V14c0-2 2-4 4-4z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="23" r="2" fill="currentColor" />
      <circle cx="24" cy="23" r="2" fill="currentColor" />
      <circle cx="32" cy="23" r="2" fill="currentColor" />
    </svg>
  )
}

export function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 8v32c4-2 8-2 12 0 4-2 8-2 12 0 4-2 8-2 12 0z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M20 8v32M28 8v32" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <path
        d="M12 16h4M32 16h4M12 24h4M32 24h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  )
}

export function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="3" />
      <path
        d="M24 4v6M24 38v6M4 24h6M38 24h6M10 10l4 4M34 34l4 4M10 38l4-4M34 14l4-4"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M24 4l4 12h12l-10 7 4 13-10-8-10 8 4-13h12L24 4z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="12" r="2" fill="currentColor" />
      <circle cx="40" cy="8" r="3" fill="currentColor" />
      <circle cx="38" cy="38" r="2" fill="currentColor" />
    </svg>
  )
}

export function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 22L24 8l16 14v18c0 2-2 4-4 4H12c-2 0-4-2-4-4V22z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M18 44V28h12v16" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="24" cy="18" r="3" fill="currentColor" opacity="0.5" />
    </svg>
  )
}

export function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 38h12M20 42h8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M16 28c-2-2-4-5-4-10 0-7 5-12 12-12s12 5 12 12c0 5-2 8-4 10v6H16v-6z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M18 24l5 3v-6l-5 3z" fill="currentColor" opacity="0.7" />
    </svg>
  )
}

export function VideoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="10" width="32" height="28" rx="4" stroke="currentColor" strokeWidth="3" />
      <path d="M36 20l8-6v20l-8-6V20z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="20" cy="24" r="6" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      <path d="M18 24l5 3v-6l-5 3z" fill="currentColor" opacity="0.7" />
    </svg>
  )
}

export function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 8h24v12c0 8-5 14-12 14S12 28 12 20V8z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M12 12H6c0 6 3 10 6 12M36 12h6c0 6-3 10-6 12"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M18 38h12M24 34v4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <rect x="16" y="38" width="16" height="4" rx="2" stroke="currentColor" strokeWidth="3" />
      <circle cx="24" cy="18" r="4" fill="currentColor" opacity="0.3" />
    </svg>
  )
}

export function SlowSpeedIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="28" r="14" stroke="currentColor" strokeWidth="3" />
      <path d="M18 32c2 2 4 3 6 3s4-1 6-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="26" r="2" fill="currentColor" />
      <circle cx="28" cy="26" r="2" fill="currentColor" />
      <path d="M10 18l6 4M38 18l-6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M24 8v6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M20 10l4-4 4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
    </svg>
  )
}

export function NormalSpeedIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="12" r="6" stroke="currentColor" strokeWidth="3" />
      <path d="M14 22c0-2 3-4 6-4s6 2 6 4v4h-12v-4z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M16 26l-2 16M24 26l2 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M28 32h12M28 36h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
    </svg>
  )
}

export function FastSpeedIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="28" cy="10" r="6" stroke="currentColor" strokeWidth="3" />
      <path d="M22 20h12l-4 8h6l-14 16 4-10h-8l4-14z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M8 18h8M6 24h6M8 30h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
    </svg>
  )
}

export function NeutralFaceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
      <circle cx="16" cy="20" r="3" fill="currentColor" />
      <circle cx="32" cy="20" r="3" fill="currentColor" />
      <path d="M16 32h16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function CalmFaceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
      <path d="M12 20h8M28 20h8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M16 30c2 2 5 3 8 3s6-1 8-3" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function SeriousFaceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
      <circle cx="16" cy="20" r="3" fill="currentColor" />
      <circle cx="32" cy="20" r="3" fill="currentColor" />
      <path d="M14 14l6 2M34 14l-6 2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M16 32h16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function FemaleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="16" r="12" stroke="currentColor" strokeWidth="3" />
      <path d="M12 28v16M28 28v16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function MaleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="28" r="12" stroke="currentColor" strokeWidth="3" />
      <path
        d="M30 18L42 6M42 6v12M42 6H30"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="3" />
      <path
        d="M24 4v6M24 38v6M4 24h6M38 24h6M10 10l4 4M34 34l4 4M10 38l4-4M34 14l4-4"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 24c4-10 11-16 20-16s16 6 20 16S8 34 4 24z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="3" />
      <circle cx="24" cy="24" r="4" fill="currentColor" />
    </svg>
  )
}

export function SmileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
      <circle cx="16" cy="20" r="3" fill="currentColor" />
      <circle cx="32" cy="20" r="3" fill="currentColor" />
      <path d="M14 28c2 4 6 6 10 6s8-2 10-6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function ByeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Open palm - same as wave but with different motion lines */}
      <path
        d="M24 40c-6 0-10-4-10-10V18c0-1.5 1.2-3 3-3s3 1.5 3 3v8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Index finger */}
      <path d="M20 26V12c0-1.5 1.2-3 3-3s3 1.5 3 3v14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Middle finger */}
      <path d="M26 26V10c0-1.5 1.2-3 3-3s3 1.5 3 3v16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Ring finger */}
      <path
        d="M32 26V12c0-1.5 1.2-3 3-3s3 1.5 3 3v18c0 6-4 10-10 10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Motion arcs showing a side-to-side goodbye wave */}
      <path d="M6 16c3-4 7-6 10-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <path d="M4 22c4-2 8-3 12-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}

export function PleaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 36V20c0-6 5-10 12-10s12 4 12 10v16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M12 28h24" stroke="currentColor" strokeWidth="3" />
      <circle cx="20" cy="22" r="2" fill="currentColor" />
      <circle cx="28" cy="22" r="2" fill="currentColor" />
    </svg>
  )
}

export function HungryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="24" cy="32" rx="18" ry="8" stroke="currentColor" strokeWidth="3" />
      <path d="M6 32V28c0-12 8-20 18-20s18 8 18 20v4" stroke="currentColor" strokeWidth="3" />
      <circle cx="16" cy="24" r="3" fill="currentColor" opacity="0.5" />
      <circle cx="28" cy="20" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="32" cy="26" r="2" fill="currentColor" opacity="0.5" />
    </svg>
  )
}

export function ThirstyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 8h20l-4 32H18L14 8z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M16 16h16" stroke="currentColor" strokeWidth="3" />
      <ellipse cx="24" cy="28" rx="4" ry="6" fill="currentColor" opacity="0.3" />
    </svg>
  )
}

export function MoreIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="3" />
      <path d="M24 14v20M14 24h20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

export function StopIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
      <path d="M16 16l16 16M32 16l-16 16" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

export function WaitIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="3" />
      <path d="M24 12v14l8 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function YesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
      <path d="M14 24l7 7 13-14" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function NoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
      <path d="M16 16l16 16M32 16l-16 16" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

export function ThankYouIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M24 38l-12-12c-3-3-3-8 0-11s8-3 11 0l1 1 1-1c3-3 8-3 11 0s3 8 0 11L24 38z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M24 28v-8M24 16v-2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function SorryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
      <path d="M16 18l4 4M32 18l-4 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M14 34c2-4 6-6 10-6s8 2 10 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function LoveIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M24 42l-14-14c-4-4-4-10 0-14s10-4 14 0c4-4 10-4 14 0s4 10 0 14L24 42z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function HugIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="14" r="8" stroke="currentColor" strokeWidth="3" />
      <path d="M8 44c0-10 7-18 16-18s16 8 16 18" stroke="currentColor" strokeWidth="3" />
      <path d="M4 30c4-2 8 0 10 4M44 30c-4-2-8 0-10 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function TiredIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
      <path d="M12 20h8M28 20h8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="24" cy="32" rx="4" ry="3" stroke="currentColor" strokeWidth="3" />
      <text x="36" y="12" fill="currentColor" fontSize="10" fontWeight="bold">
        Z
      </text>
    </svg>
  )
}

export function SadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
      <circle cx="16" cy="20" r="3" fill="currentColor" />
      <circle cx="32" cy="20" r="3" fill="currentColor" />
      <path d="M14 34c2-4 6-6 10-6s8 2 10 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function AngryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
      <circle cx="16" cy="22" r="3" fill="currentColor" />
      <circle cx="32" cy="22" r="3" fill="currentColor" />
      <path d="M12 14l8 4M36 14l-8 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M14 34c2-4 6-6 10-6s8 2 10 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function ScaredIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
      <ellipse cx="16" cy="20" rx="3" ry="4" fill="currentColor" />
      <ellipse cx="32" cy="20" rx="3" ry="4" fill="currentColor" />
      <ellipse cx="24" cy="34" rx="6" ry="4" stroke="currentColor" strokeWidth="3" />
    </svg>
  )
}

export function HappyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
      <circle cx="16" cy="20" r="3" fill="currentColor" />
      <circle cx="32" cy="20" r="3" fill="currentColor" />
      <path d="M14 28c2 4 6 6 10 6s8-2 10-6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function BoredIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
      <path d="M14 20h6M28 20h6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M18 32h12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function SickIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
      <circle cx="16" cy="20" r="3" fill="currentColor" />
      <circle cx="32" cy="20" r="3" fill="currentColor" />
      <path d="M16 32c2 2 5 3 8 3s6-1 8-3" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="38" cy="30" r="3" fill="currentColor" opacity="0.3" />
      <circle cx="10" cy="30" r="3" fill="currentColor" opacity="0.3" />
    </svg>
  )
}

export function PainIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
      <path d="M14 18l6 4M34 18l-6 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M14 34c2-4 6-6 10-6s8 2 10 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M6 6l4 4M42 6l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  )
}

export function BathroomIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="8" width="24" height="32" rx="4" stroke="currentColor" strokeWidth="3" />
      <path d="M12 28h24" stroke="currentColor" strokeWidth="3" />
      <circle cx="24" cy="18" r="4" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export function WhatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
      <path d="M18 18c0-4 3-6 6-6s6 2 6 6c0 3-2 4-4 5v3" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="34" r="2" fill="currentColor" />
    </svg>
  )
}

export function WhereIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M24 44l-12-16c-4-6-4-14 2-18s14-2 18 4c2 3 2 7 0 10L24 44z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="20" r="6" stroke="currentColor" strokeWidth="3" />
    </svg>
  )
}

export function WhenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="3" />
      <path d="M24 12v14l8 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="24" r="3" fill="currentColor" />
    </svg>
  )
}

export function WhoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="14" r="8" stroke="currentColor" strokeWidth="3" />
      <path d="M10 42c0-8 6-14 14-14s14 6 14 14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="14" r="3" fill="currentColor" opacity="0.3" />
    </svg>
  )
}

export function WhyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
      <path
        d="M18 16c0-2 3-4 6-4s6 2 6 4-2 3-4 4c-1 1-2 2-2 4v2"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="24" cy="34" r="2" fill="currentColor" />
    </svg>
  )
}

export function HowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 24c0-10 7-18 16-18s16 8 16 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M16 24v12M32 24v12M24 28v8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="12" r="4" fill="currentColor" opacity="0.3" />
    </svg>
  )
}

export function ListenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 24c0-10 7-18 16-18s16 8 16 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M8 24v8c0 2 2 4 4 4h2v-12H8zM40 24v8c0 2-2 4-4 4h-2v-12h6z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
      <path d="M18 14l16 10-16 10V14z" fill="currentColor" />
    </svg>
  )
}

export function FinishedIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
      <path d="M14 24l7 7 13-14" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M24 4v4M24 40v4M4 24h4M40 24h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
      />
    </svg>
  )
}

export function CommentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 10h32c2 0 4 2 4 4v18c0 2-2 4-4 4H20l-8 8v-8H8c-2 0-4-2-4-4V14c0-2 2-4 4-4z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M14 20h20M14 28h12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function BookOpenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 10c4-2 10-2 18 2 8-4 14-4 18-2v28c-4-2-10-2-18 2-8-4-14-4-18-2V10z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M24 12v28" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 16h6M12 22h6M12 28h6M30 16h6M30 22h6M30 28h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  )
}

export function TargetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="3" />
      <circle cx="24" cy="24" r="12" stroke="currentColor" strokeWidth="2" opacity="0.6" />
      <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      <circle cx="24" cy="24" r="2" fill="currentColor" />
    </svg>
  )
}

export function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 24c0-9 7-16 16-16 6 0 11 3 14 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M40 24c0 9-7 16-16 16-6 0-11-3-14-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M38 8v8h-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 40v-8h8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function MouthIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer lips */}
      <ellipse cx="24" cy="24" rx="18" ry="12" stroke="currentColor" strokeWidth="3" />
      {/* Inner mouth */}
      <ellipse cx="24" cy="26" rx="12" ry="6" fill="currentColor" opacity="0.3" />
      {/* Teeth hint */}
      <path d="M14 22h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      {/* Tongue */}
      <ellipse cx="24" cy="28" rx="6" ry="3" fill="currentColor" opacity="0.5" />
      {/* Sound waves */}
      <path d="M40 18c2 2 3 4 3 6s-1 4-3 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <path
        d="M44 14c3 3 5 6 5 10s-2 7-5 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
      />
    </svg>
  )
}

export function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M38 24H10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 14L10 24l10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function MicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="4" width="16" height="26" rx="8" stroke="currentColor" strokeWidth="3" />
      <path d="M10 22c0 8 6 14 14 14s14-6 14-14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M24 36v8M18 44h12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M20 12h8M20 18h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
    </svg>
  )
}

export function VolumeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 18v12h8l10 10V8L16 18H8z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M32 16c2 2 3 5 3 8s-1 6-3 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M36 12c4 3 6 7 6 12s-2 9-6 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}
