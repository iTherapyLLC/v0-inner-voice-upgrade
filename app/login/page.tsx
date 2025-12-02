"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { verifyBetaAccess, verifyBetaCode } from "@/app/actions/auth"

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/test_3cIcN4bqz1Ysc7e1Il6AM00"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [betaCode, setBetaCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showSubscribe, setShowSubscribe] = useState(false)
  const [showBetaCodeInput, setShowBetaCodeInput] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setShowSubscribe(false)

    const result = await verifyBetaAccess(email)

    if (result.hasAccess) {
      router.push("/")
    } else if (result.success) {
      setShowSubscribe(true)
      setError("No active subscription found for this email.")
    } else {
      setError(result.message)
    }

    setIsLoading(false)
  }

  const handleBetaCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const result = await verifyBetaCode(betaCode)

    if (result.hasAccess) {
      router.push("/")
    } else {
      setError(result.message)
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#FDF6E9] flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-8 animate-bounce-in">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="InnerVoice" width={60} height={60} className="object-contain" />
          <span className="text-3xl font-bold text-[#2B4C7E]">InnerVoice</span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 animate-bounce-in">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">Welcome to Beta Access</h1>
        <p className="text-gray-500 text-center mb-8">Enter your email to access InnerVoice</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E07A5F] focus:ring-2 focus:ring-[#E07A5F]/20 outline-none transition-all text-gray-800"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm transition-all">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#E07A5F] hover:bg-[#c96a52] text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Verifying...
              </span>
            ) : (
              "Access InnerVoice"
            )}
          </button>
        </form>

        {/* Beta Code Section */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          {!showBetaCodeInput ? (
            <button
              onClick={() => setShowBetaCodeInput(true)}
              className="w-full py-3 text-center text-[#5BA4A4] hover:bg-[#5BA4A4]/10 font-medium transition-all rounded-xl border-2 border-dashed border-[#5BA4A4]/40"
            >
              Have a free beta test code? Click here
            </button>
          ) : (
            <form onSubmit={handleBetaCodeSubmit} className="space-y-4">
              <div>
                <label htmlFor="betaCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Beta Test Code
                </label>
                <input
                  type="text"
                  id="betaCode"
                  value={betaCode}
                  onChange={(e) => setBetaCode(e.target.value.toUpperCase())}
                  placeholder="Enter your code"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#5BA4A4] focus:ring-2 focus:ring-[#5BA4A4]/20 outline-none transition-all text-gray-800 font-mono tracking-wider text-center uppercase"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowBetaCodeInput(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 bg-[#5BA4A4] hover:bg-[#4a8f8f] text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Verifying..." : "Use Code"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Subscribe Section */}
        {showSubscribe && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-gray-600 text-center mb-4">
              Get beta access for only <strong>$9.99/month</strong>
            </p>
            <a
              href={STRIPE_PAYMENT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 bg-[#2B4C7E] hover:bg-[#1f3a5f] text-white font-semibold rounded-xl text-center transition-colors"
            >
              Subscribe Now
            </a>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-gray-400 text-sm text-center">InnerVoice is currently in beta testing</p>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-gray-400 text-sm animate-bounce-in">Teaching communication through understanding</p>
    </div>
  )
}
