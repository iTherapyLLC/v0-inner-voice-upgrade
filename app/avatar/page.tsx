"use client"
import Link from "next/link"
import Script from "next/script"

export default function AvatarPage() {
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
        />
      </div>

      {/* D-ID Script */}
      <Script
        src="https://agent.d-id.com/v2/index.js"
        type="module"
        data-mode="full"
        data-client-key="Z29vZ2xlLW9hdXRoMnwxMTc2MjkyNzc2MTg2NDkyMTg5ODQ"
        data-agent-id="v2_agt_oQPIDPlv"
        data-name="did-agent"
        data-monitor="true"
        data-target-id="did-agent-container"
        strategy="afterInteractive"
      />
    </div>
  )
}
