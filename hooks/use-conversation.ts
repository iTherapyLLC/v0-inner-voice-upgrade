"use client"

import { useState, useCallback } from "react"
import { useAppStore } from "@/lib/store"

interface Command {
  type: "create_button" | "delete_button" | "update_button" | "navigate" | "change_voice" | "help" | "conversation"
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

interface ButtonWithPosition {
  id: string
  label: string
  text: string
  row: number
  col: number
  index: number
}

const GRID_COLUMNS = 4 // Default 4 columns in the grid

export function useConversation() {
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const customButtons = useAppStore((state) => state.customButtons)

  const sendMessage = useCallback(
    async (message: string, context?: string): Promise<SendMessageResult> => {
      setIsLoading(true)
      setError(null)

      const userMessage: ConversationMessage = {
        role: "user",
        content: message,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])

      try {
        const buttonsWithPositions: ButtonWithPosition[] = customButtons.map((b, index) => ({
          id: b.id,
          label: b.label,
          text: b.text,
          row: Math.floor(index / GRID_COLUMNS) + 1, // 1-indexed row
          col: (index % GRID_COLUMNS) + 1, // 1-indexed column
          index: index + 1, // 1-indexed position
        }))

        const totalRows = Math.ceil(customButtons.length / GRID_COLUMNS)
        const totalCols = GRID_COLUMNS

        const conversationHistory = messages.slice(-6).map((m) => ({
          role: m.role,
          content: m.content,
        }))

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            context,
            currentButtons: buttonsWithPositions,
            gridInfo: {
              columns: totalCols,
              rows: totalRows,
              totalButtons: customButtons.length,
            },
            conversationHistory,
          }),
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
    },
    [customButtons, messages],
  )

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
