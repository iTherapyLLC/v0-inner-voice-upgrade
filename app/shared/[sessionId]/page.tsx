"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { useElevenLabs } from "@/hooks/use-elevenlabs"
import { Heart, Volume2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function SharedSessionPage() {
  const params = useParams()
  const sessionId = params.sessionId as string
  const { getShareSession } = useAppStore()
  const { speak, isSpeaking } = useElevenLabs()

  const [session, setSession] = useState<{ phrases: string[]; createdAt: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = getShareSession(sessionId)
    setSession(data)
    setLoading(false)
  }, [sessionId])

  const handlePlayPhrase = (phrase: string) => {
    speak(phrase, "EXAVITQu4vr4xnSDxMaL")
  }

  const handleRefresh = () => {
    const data = getShareSession(sessionId)
    setSession(data)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-pink-200 animate-pulse mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-orange-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-200 mb-4">
            <Heart className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Link Expired</h1>
          <p className="text-muted-foreground">This sharing link has expired or doesn't exist. Ask for a new link!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-orange-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <Image src="/images/logo.png" alt="InnerVoice" width={80} height={80} className="mx-auto" />
          </div>
          <h1 className="text-3xl font-black text-foreground mb-2">Look what I said today!</h1>
          <p className="text-lg text-muted-foreground">Tap any message to hear it spoken aloud</p>
        </div>

        {/* Refresh button */}
        <div className="flex justify-center mb-6">
          <Button onClick={handleRefresh} variant="outline" className="rounded-full bg-transparent">
            <RefreshCw className="mr-2 h-4 w-4" />
            Check for new messages
          </Button>
        </div>

        {/* Phrases */}
        {session.phrases.length === 0 ? (
          <div className="text-center py-12 bg-white/60 rounded-3xl">
            <Heart className="w-12 h-12 text-pink-300 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">No messages yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {session.phrases.map((phrase, index) => (
              <button
                key={index}
                onClick={() => handlePlayPhrase(phrase)}
                disabled={isSpeaking}
                className="w-full bg-white rounded-2xl p-6 shadow-lg border-2 border-pink-100 hover:border-pink-300 hover:shadow-xl transition-all text-left flex items-center gap-4 disabled:opacity-50"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center">
                  <Volume2 className="w-6 h-6 text-white" />
                </div>
                <p className="text-xl font-semibold text-foreground">{phrase}</p>
              </button>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>Powered by InnerVoice</p>
          <p>Helping everyone find their voice</p>
        </div>
      </div>
    </div>
  )
}
