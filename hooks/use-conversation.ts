"use client"

import { useState, useCallback } from "react"
import { useAppStore } from "@/lib/store"
import { defaultButtons } from "@/lib/default-buttons"

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

const GRID_COLUMNS = 6 // Updated to match actual grid (6 columns based on screenshot)

export function useConversation() {
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const customButtons = useAppStore((state) => state.customButtons)
  const deletedDefaultButtons = useAppStore((state) => state.deletedDefaultButtons)
  const deletionHistory = useAppStore((state) => state.deletionHistory) // Get deletion history

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
        const visibleDefaultButtons = defaultButtons.filter((b) => !deletedDefaultButtons.includes(b.id))
        const allVisibleButtons = [...visibleDefaultButtons, ...customButtons]

        const buttonsWithPositions: ButtonWithPosition[] = allVisibleButtons.map((b, index) => ({
          id: b.id,
          label: b.label,
          text: b.text,
          row: Math.floor(index / GRID_COLUMNS) + 1, // 1-indexed row
          col: (index % GRID_COLUMNS) + 1, // 1-indexed column
          index: index + 1, // 1-indexed position
        }))

        const totalRows = Math.ceil(allVisibleButtons.length / GRID_COLUMNS)
        const totalCols = GRID_COLUMNS

        const conversationHistory = messages.slice(-10).map((m) => ({
          role: m.role,
          content: m.content,
        }))

        console.log("[v0] Sending to API - Total buttons:", allVisibleButtons.length)
        console.log("[v0] Grid info - Rows:", totalRows, "Cols:", totalCols)
        console.log(
          "[v0] Last row buttons:",
          buttonsWithPositions.filter((b) => b.row === totalRows).map((b) => b.label),
        )

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
              totalButtons: allVisibleButtons.length,
            },
            conversationHistory,
            deletionHistory: deletionHistory.slice(-5), // Pass recent deletion history
          }),
        })

        const data = await response.json()

        console.log("[v0] API response command:", data.command)

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
    [customButtons, deletedDefaultButtons, deletionHistory, messages], // Add deletionHistory dependency
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
