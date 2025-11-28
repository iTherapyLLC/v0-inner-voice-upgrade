import type React from "react"
import type { Metadata, Viewport } from "next"
import { Nunito } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AIHelper } from "@/components/ai-helper"

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-nunito",
})

export const metadata: Metadata = {
  title: "InnerVoice - Your Friendly Communication Companion",
  description:
    "A joyful app that helps you communicate with confidence. Express yourself with customizable avatars, fun interactions, and friendly features.",
  generator: "v0.app",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "InnerVoice",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/images/logo.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#e74a21",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.className} antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 page-transition">{children}</main>
          <Footer />
        </div>
        <AIHelper />
        <Analytics />
      </body>
    </html>
  )
}
