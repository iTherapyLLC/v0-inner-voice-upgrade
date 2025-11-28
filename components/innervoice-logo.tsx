import Image from "next/image"

interface InnerVoiceLogoProps {
  className?: string
  size?: number
}

export function InnerVoiceLogo({ className = "", size = 48 }: InnerVoiceLogoProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <Image src="/images/logo.png" alt="InnerVoice Logo" fill className="object-contain" priority />
    </div>
  )
}
