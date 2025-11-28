import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChatBubbleIcon, SettingsIcon } from "@/components/icons"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-dots opacity-50" />
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-secondary/5 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl" />

      {/* Main content */}
      <div className="relative z-10 text-center max-w-3xl page-transition">
        {/* Logo with premium floating animation */}
        <div className="mb-10 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 rounded-full blur-3xl scale-150 animate-pulse-glow" />
          <Image
            src="/images/logo.png"
            alt="InnerVoice"
            width={220}
            height={200}
            className="relative mx-auto animate-float object-contain drop-shadow-2xl"
            priority
          />
        </div>

        {/* Welcome heading with animated gradient */}
        <h1 className="mb-6 text-5xl font-black tracking-tight md:text-6xl lg:text-7xl">
          <span className="text-foreground">Welcome to </span>
          <span className="text-gradient">InnerVoice</span>
        </h1>

        {/* Warm, encouraging tagline */}
        <p className="mb-12 text-xl md:text-2xl text-muted-foreground font-medium max-w-xl mx-auto leading-relaxed">
          Your voice matters. Let&apos;s find it together.
        </p>

        {/* Giant, irresistible CTA button */}
        <div className="mb-16">
          <Button
            asChild
            size="lg"
            className="btn-cta h-24 rounded-full px-16 text-2xl md:text-3xl font-black shadow-2xl shadow-primary/30 bg-primary hover:bg-primary animate-pulse-glow"
          >
            <Link href="/communicate" className="flex items-center gap-4">
              <ChatBubbleIcon className="h-10 w-10" />
              <span>Start Talking</span>
            </Link>
          </Button>

          {/* Encouraging nudge */}
          <p
            className="mt-6 text-lg text-muted-foreground font-semibold animate-bounce-in"
            style={{ animationDelay: "0.3s" }}
          >
            Tap the big button above
          </p>
        </div>

        {/* Secondary options - still very prominent */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          <Link href="/settings" className="group">
            <div className="card-premium flex items-center gap-4 rounded-2xl px-8 py-5 border-2 border-accent/20 hover:border-accent/40">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent-foreground group-hover:bg-accent transition-all">
                <SettingsIcon className="h-8 w-8" />
              </div>
              <div className="text-left">
                <p className="text-lg font-bold text-foreground">Change Your Voice</p>
                <p className="text-sm text-muted-foreground">Make it sound like you</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Friendly helper reminder */}
        <div className="mt-16 inline-flex items-center gap-3 rounded-full bg-card/80 px-6 py-3 shadow-lg border border-primary/10">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary via-secondary to-accent">
            <span className="text-white text-lg">?</span>
          </div>
          <p className="text-base font-semibold text-foreground">
            Need help? <span className="text-primary">Tap the friendly face</span> in the corner!
          </p>
        </div>
      </div>
    </div>
  )
}
