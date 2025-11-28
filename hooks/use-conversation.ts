"use client"

import { useState, useCallback } from "react"

interface Command {
  type: "create_button" | "delete_button" | "navigate" | "change_voice" | "help" | "conversation"
  payload?: Record<string, unknown>
}

interface ConversationMessage {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface SendMessageResult {
  response: string | null
  command: Command | null
}

export function useConversation() {
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (message: string, context?: string): Promise<SendMessageResult> => {
    setIsLoading(true)
    setError(null)

    const userMessage: ConversationMessage = {
      role: "user",
      content: message,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, context }),
      })

      const data = await response.json()

      const assistantMessage: ConversationMessage = {
        role: "assistant",
        content: data.response || "I'm here to help!",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])

      return {
        response: data.response || null,
        command: data.command || null,
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setError(errorMessage)

      // Still add a helpful message even on error
      const fallbackMessage: ConversationMessage = {
        role: "assistant",
        content: "I'm here to help! Try asking me to make a button or change the voice.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, fallbackMessage])

      return { response: null, command: null }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  }
}
