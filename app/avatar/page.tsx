"use client"

import Script from "next/script"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeftIcon } from "@/components/icons"

export default function AvatarPage() {
  const [loadError, setLoadError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Set a timeout to detect if D-ID fails to load
    const timeout = setTimeout(() => {
      const avatarContainer = document.getElementById("did-avatar")
      // If container is still empty after 10 seconds, show error state
      if (avatarContainer && avatarContainer.children.length === 0) {
        setLoadError(true)
        setIsLoading(false)
      }
    }, 10000)

    // Listen for successful load
    const checkLoaded = setInterval(() => {
      const avatarContainer = document.getElementById("did-avatar")
      if (avatarContainer && avatarContainer.children.length > 0) {
        setIsLoading(false)
        clearTimeout(timeout)
        clearInterval(checkLoaded)
      }
    }, 500)

    return () => {
      clearTimeout(timeout)
      clearInterval(checkLoaded)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header */}
      <div className="p-4 flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-xl font-semibold text-foreground flex-1 text-center pr-24">Avatar Assistant</h1>
      </div>

      {/* Loading State */}
      {isLoading && !loadError && (
        <div className="flex flex-col items-center justify-center h-[70vh] gap-6">
          <div className="relative w-24 h-24">
            <Image src="/images/logo.png" alt="InnerVoice" fill className="object-contain animate-pulse" />
          </div>
          <p className="text-lg text-muted-foreground">Loading avatar assistant...</p>
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      )}

      {/* Error State */}
      {loadError && (
        <div className="flex flex-col items-center justify-center h-[70vh] gap-6 px-4">
          <div className="relative w-24 h-24 opacity-50">
            <Image src="/images/logo.png" alt="InnerVoice" fill className="object-contain" />
          </div>
          <div className="text-center max-w-md">
            <h2 className="text-xl font-semibold text-foreground mb-2">Avatar Currently Unavailable</h2>
            <p className="text-muted-foreground mb-6">
              The avatar assistant is temporarily unavailable. This may be due to network issues or service maintenance.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setLoadError(false)
                  setIsLoading(true)
                  window.location.reload()
                }}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
              <Link
                href="/communicate"
                className="px-6 py-3 bg-background border-2 border-primary text-primary rounded-full font-medium hover:bg-primary/10 transition-colors"
              >
                Use Communication Board
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* D-ID Avatar Container */}
      <div id="did-avatar" className={`w-full h-[calc(100vh-80px)] ${isLoading || loadError ? "hidden" : ""}`} />

      <Script
        type="module"
        src="https://agent.d-id.com/v2/index.js"
        data-mode="full"
        data-client-key="Z29vZ2xlLW9hdXRoMnwxMDkyMTg2Nzc5OTg4NDg4NTg2Mzg6YTUwS3hNYURwbE5YNUJqSWw5aDZw"
        data-agent-id="v2_agt_oQPIDPlv"
        data-name="did-agent"
        data-monitor="true"
        data-target-id="did-avatar"
        strategy="afterInteractive"
        onError={() => {
          setLoadError(true)
          setIsLoading(false)
        }}
      />
    </div>
  )
}
