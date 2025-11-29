"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function AvatarPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Check if container exists
    const container = document.getElementById("did-agent-container")
    if (!container) return

    // Create and load the D-ID script
    const script = document.createElement("script")
    script.src = "https://agent.d-id.com/v2/index.js"
    script.type = "module"
    script.setAttribute("data-mode", "full")
    script.setAttribute("data-client-key", "Z29vZ2xlLW9hdXRoMnwxMTc2MjkyNzc2MTg2NDkyMTg5ODQ")
    script.setAttribute("data-agent-id", "v2_agt_oQPIDPlv")
    script.setAttribute("data-name", "did-agent")
    script.setAttribute("data-monitor", "true")
    script.setAttribute("data-target-id", "did-agent-container")

    script.onload = () => {
      setIsLoaded(true)
    }

    script.onerror = () => {
      setHasError(true)
    }

    document.body.appendChild(script)

    return () => {
      // Cleanup on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#FDF6E9]">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <Link href="/" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
          ← Back to Home
        </Link>
        <h1 className="text-xl font-semibold text-[#2D3748]">Avatar Assistant</h1>
        <div className="w-20"></div>
      </div>

      {/* D-ID Agent Container */}
      <div className="flex justify-center p-4">
        <div
          id="did-agent-container"
          className="w-full max-w-4xl h-[600px] bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {hasError && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <p className="text-lg text-gray-600 mb-4">
                Unable to load the avatar assistant. Please check your connection and try again.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-[#E53E3E] text-white rounded-full hover:bg-[#C53030] transition-colors"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
