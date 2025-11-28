"use client"

import Script from "next/script"

export default function AvatarPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <div id="did-avatar" className="w-full h-screen" />
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
      />
    </div>
  )
}
