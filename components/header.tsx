"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Menu, X, Globe } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  HomeIcon,
  AvatarIcon,
  ChatBubbleIcon,
  SettingsIcon,
  BookOpenIcon,
  TargetIcon,
  PlayIcon,
  TrophyIcon,
} from "@/components/icons"
import { useAppStore } from "@/lib/store"

const navLinks = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/communicate", label: "Talk", icon: ChatBubbleIcon },
  { href: "/visual-stories", label: "Watch", icon: BookOpenIcon },
  { href: "/practice", label: "Practice", icon: TargetIcon },
  { href: "/story-mode", label: "Play", icon: PlayIcon },
  { href: "/progress", label: "Progress", icon: TrophyIcon },
  { href: "/avatar", label: "Avatar", icon: AvatarIcon },
  { href: "/settings", label: "Voice", icon: SettingsIcon },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { settings } = useAppStore()
  const currentLanguage = settings.languageName || "English"
  const isNonEnglish = settings.language && settings.language !== "en"

  return (
    <header className="sticky top-0 z-50 glass border-b border-primary/10 shadow-lg shadow-primary/5">
      <div className="mx-auto flex h-20 max-w-7xl items-center px-4 md:px-6">
        <Link href="/" className="group flex items-center gap-3 shrink-0 w-[200px]">
          <div className="relative transition-transform group-hover:scale-105 shrink-0">
            <Image
              src="/images/logo.png"
              alt="InnerVoice"
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
              priority
            />
          </div>
          <span className="text-2xl font-black text-gradient">InnerVoice</span>
        </Link>

        <nav className="hidden md:flex md:items-center md:justify-center md:gap-1 flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "btn-tactile flex items-center gap-2 rounded-full px-4 py-3 text-sm font-bold transition-all",
                pathname === link.href
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center justify-end w-[200px] shrink-0">
          {isNonEnglish && (
            <div className="flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2">
              <Globe className="h-4 w-4 text-accent" />
              <span className="text-sm font-bold text-accent">{currentLanguage}</span>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          {isNonEnglish && (
            <div className="flex items-center gap-1 rounded-full bg-accent/20 px-3 py-1.5">
              <Globe className="h-3 w-3 text-accent" />
              <span className="text-xs font-bold text-accent">{currentLanguage}</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="btn-tactile h-14 w-14 rounded-2xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation - extra big, extra friendly */}
      {mobileMenuOpen && (
        <nav className="absolute left-0 right-0 top-full glass border-b border-primary/10 px-4 py-6 md:hidden animate-in slide-in-from-top-2 shadow-xl">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "btn-tactile flex items-center gap-4 rounded-2xl px-6 py-5 text-xl font-bold transition-all",
                  pathname === link.href
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl",
                    pathname === link.href ? "bg-white/20" : "bg-muted",
                  )}
                >
                  <link.icon className="h-7 w-7" />
                </div>
                {link.label}
              </Link>
            ))}

            <div className="mt-4 p-4 rounded-2xl bg-muted/50 text-center">
              <p className="text-sm text-muted-foreground">
                <Globe className="inline h-4 w-4 mr-1" />
                Say "switch to Spanish" or any language to change
              </p>
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
