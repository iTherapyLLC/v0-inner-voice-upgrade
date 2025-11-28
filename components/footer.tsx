import Link from "next/link"
import Image from "next/image"
import { HeartHandsIcon } from "@/components/icons"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative border-t border-primary/10 bg-card/80 backdrop-blur-sm py-10 overflow-hidden">
      {/* Subtle gradient accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center gap-6">
          {/* Logo and tagline - more prominent */}
          <div className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="InnerVoice" width={44} height={40} className="h-10 w-auto" />
            <span className="text-xl font-black text-gradient">InnerVoice</span>
          </div>

          {/* Warm tagline */}
          <p className="flex items-center gap-2 text-base text-muted-foreground font-medium">
            Made with <HeartHandsIcon className="h-6 w-6 text-primary animate-pulse" /> for better communication
          </p>

          {/* Navigation */}
          <nav className="flex gap-8">
            <Link
              href="/settings"
              className="btn-tactile text-base font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              Voice Settings
            </Link>
            <Link
              href="/avatar"
              className="btn-tactile text-base font-semibold text-muted-foreground transition-colors hover:text-secondary"
            >
              Avatar
            </Link>
          </nav>

          <p className="text-sm text-muted-foreground/60">&copy; {currentYear} InnerVoice. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
