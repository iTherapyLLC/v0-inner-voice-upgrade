"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { Copy, Check, Share2, Heart, Home } from "lucide-react"

export default function SharePage() {
  const router = useRouter()
  const { createShareSession, messages } = useAppStore()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState("")

  useEffect(() => {
    // Create a new share session
    const id = createShareSession()
    setSessionId(id)

    // Build share URL
    if (typeof window !== "undefined") {
      setShareUrl(`${window.location.origin}/shared/${id}`)
    }
  }, [])

  const handleCopy = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share && shareUrl) {
      try {
        await navigator.share({
          title: "InnerVoice - Watch what I said today!",
          text: "Check out what I communicated today using InnerVoice!",
          url: shareUrl,
        })
      } catch {
        // User cancelled or error
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-orange-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 mb-4 shadow-xl">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-foreground mb-2">Share with Family</h1>
          <p className="text-lg text-muted-foreground">
            Send this link to grandma, grandpa, or anyone who wants to see what you said today!
          </p>
        </div>

        {/* Share link card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-pink-200 mb-6">
          <p className="text-sm font-medium text-muted-foreground mb-3">Your sharing link:</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-muted rounded-xl px-4 py-3 overflow-hidden">
              <p className="text-sm font-mono truncate">{shareUrl || "Creating link..."}</p>
            </div>
            <Button
              onClick={handleCopy}
              className="rounded-xl h-12 w-12 flex-shrink-0"
              variant={copied ? "default" : "outline"}
            >
              {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            </Button>
          </div>
          {copied && <p className="text-sm text-green-600 font-medium mt-2">Copied! Ready to share.</p>}
        </div>

        {/* Native share button */}
        {"share" in navigator && (
          <Button
            onClick={handleNativeShare}
            className="w-full rounded-2xl py-6 text-lg font-bold bg-gradient-to-r from-pink-400 to-orange-400 hover:from-pink-500 hover:to-orange-500 shadow-xl mb-4"
          >
            <Share2 className="mr-3 h-6 w-6" />
            Share with Family
          </Button>
        )}

        {/* Recent phrases preview */}
        {messages.length > 0 && (
          <div className="bg-white/60 rounded-2xl p-5 mb-6">
            <p className="text-sm font-bold text-foreground mb-3">Recently said:</p>
            <div className="space-y-2">
              {messages.slice(-5).map((msg, i) => (
                <div key={i} className="bg-white rounded-xl px-4 py-2 text-sm">
                  {msg.text}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="bg-white/60 rounded-2xl p-5 mb-6">
          <p className="text-sm font-bold text-foreground mb-3">How it works:</p>
          <ol className="text-sm text-muted-foreground space-y-2">
            <li>1. Copy the link above</li>
            <li>2. Send it to grandma, grandpa, or anyone</li>
            <li>3. They can see and hear everything you say!</li>
            <li>4. Link expires in 24 hours</li>
          </ol>
        </div>

        {/* Go home */}
        <Button
          onClick={() => router.push("/")}
          variant="outline"
          className="w-full rounded-2xl py-4 text-lg font-bold border-2"
        >
          <Home className="mr-2 h-5 w-5" />
          Go Home
        </Button>
      </div>
    </div>
  )
}
