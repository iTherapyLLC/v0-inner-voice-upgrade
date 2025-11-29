import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChatBubbleIcon, BookOpenIcon, TargetIcon, PlayIcon } from "@/components/icons"
import Image from "next/image"
import { ShowcaseImages } from "@/components/showcase-images"

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-8 overflow-hidden">
      {/* Soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 via-background to-primary/5" />

      {/* Floating showcase images */}
      <ShowcaseImages />

      {/* Main content - centered */}
      <div className="relative z-20 text-center max-w-2xl">
        {/* Logo */}
        <div className="mb-6">
          <Image
            src="/images/logo.png"
            alt="InnerVoice"
            width={180}
            height={160}
            className="mx-auto animate-float object-contain drop-shadow-xl"
            priority
          />
        </div>

        {/* Title */}
        <h1 className="mb-4 text-5xl font-black tracking-tight md:text-6xl">
          <span className="text-gradient">InnerVoice</span>
        </h1>

        {/* Tagline */}
        <p className="mb-3 text-xl text-foreground font-semibold">Your voice matters.</p>
        <p className="mb-8 text-base text-muted-foreground max-w-md mx-auto">
          Learn to communicate through beautiful stories and interactive adventures
        </p>

        {/* Main CTA */}
        <Button
          asChild
          size="lg"
          className="btn-cta h-20 rounded-full px-12 text-xl md:text-2xl font-black shadow-2xl shadow-primary/30 bg-primary hover:bg-primary/90 mb-6"
        >
          <Link href="/communicate" className="flex items-center gap-3">
            <ChatBubbleIcon className="h-8 w-8" />
            <span>Start Talking</span>
          </Link>
        </Button>

        <p className="text-sm text-muted-foreground mb-8">Tap the button above</p>

        {/* Secondary navigation */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="outline" className="rounded-full px-5 py-2 h-auto border-2 bg-transparent">
            <Link href="/stories" className="flex items-center gap-2">
              <BookOpenIcon className="h-4 w-4" />
              <span>Watch Stories</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-full px-5 py-2 h-auto border-2 border-secondary text-secondary bg-transparent"
          >
            <Link href="/practice" className="flex items-center gap-2">
              <TargetIcon className="h-4 w-4" />
              <span>Practice</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-full px-5 py-2 h-auto border-2 border-accent text-accent-foreground bg-transparent"
          >
            <Link href="/story-mode" className="flex items-center gap-2">
              <PlayIcon className="h-4 w-4" />
              <span>Story Mode</span>
            </Link>
          </Button>
        </div>

        {/* Helper hint */}
        <p className="mt-10 text-sm text-muted-foreground">Need help? Tap the face in the corner</p>
      </div>
    </div>
  )
}
