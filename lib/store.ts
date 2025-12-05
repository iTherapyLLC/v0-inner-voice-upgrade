"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Avatar, UserSettings, Message, CommunicationButton } from "@/types"

interface ActionHistoryItem {
  type: "add_button" | "delete_button" | "change_settings"
  data: unknown
  description: string
}

interface ExtendedUserSettings extends UserSettings {
  language: string
  languageName: string
  modelingMode: boolean // Slows down speech, adds emphasis
  watchFirstMode: boolean // Requires observation before imitation
}

interface ModelingStats {
  totalModels: number
  modelsToday: number
  modelsThisWeek: number
  lastModelDate: string
  phraseModels: Record<string, number> // phrase -> count
  dailyHistory: Record<string, number> // date -> count
}

interface DeletionHistoryItem {
  id: string
  label: string
  deletedAt: number
}

interface AppState {
  avatar: Avatar | null
  settings: ExtendedUserSettings
  messages: Message[]
  customButtons: CommunicationButton[]
  deletedDefaultButtons: string[]
  phraseUsage: Record<string, { count: number; lastUsed: number; contexts: string[] }>
  actionHistory: ActionHistoryItem[]
  lastAction: string | null
  sharedSessions: Record<string, { phrases: string[]; createdAt: number; expiresAt: number }>
  translationCache: Record<string, Record<string, { label: string; text: string }>>
  modelingStats: ModelingStats
  deletionHistory: DeletionHistoryItem[] // Add deletion history for restore
  setAvatar: (avatar: Avatar | null) => void
  setSettings: (settings: ExtendedUserSettings) => void
  addMessage: (message: Message) => void
  clearMessages: () => void
  addCustomButton: (button: CommunicationButton) => void
  removeButton: (identifier: string) => boolean
  updateButton: (identifier: string, updates: Partial<CommunicationButton>) => boolean
  restoreDefaults: () => void
  undo: () => void
  canUndo: boolean
  trackPhraseUsage: (phrase: string, context?: string) => void
  getFrequentPhrases: () => string[]
  createShareSession: () => string
  addToShareSession: (sessionId: string, phrase: string) => void
  getShareSession: (sessionId: string) => { phrases: string[]; createdAt: number } | null
  setTranslationCache: (lang: string, translations: Record<string, { label: string; text: string }>) => void
  getTranslation: (lang: string, buttonId: string) => { label: string; text: string } | null
  trackModel: (phrase: string) => void
  getModelingStats: () => ModelingStats
  getMostPracticedPhrases: () => { phrase: string; count: number }[]
  restoreButton: (identifier?: string) => boolean // Add restore function
  getLastDeletedButton: () => { id: string; label: string } | null // Get last deleted for "undo"
}

const defaultSettings: ExtendedUserSettings = {
  voiceId: "EXAVITQu4vr4xnSDxMaL",
  voiceName: "Sarah",
  voiceGender: "female",
  voiceSpeed: "normal",
  emotion: "neutral",
  volume: 1.0,
  language: "en",
  languageName: "English",
  modelingMode: false,
  watchFirstMode: false,
}

const defaultModelingStats: ModelingStats = {
  totalModels: 0,
  modelsToday: 0,
  modelsThisWeek: 0,
  lastModelDate: "",
  phraseModels: {},
  dailyHistory: {},
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      avatar: null,
      settings: defaultSettings,
      messages: [],
      customButtons: [],
      deletedDefaultButtons: [],
      phraseUsage: {},
      actionHistory: [],
      lastAction: null,
      sharedSessions: {},
      translationCache: {},
      modelingStats: defaultModelingStats,
      deletionHistory: [], // Initialize deletion history

      setAvatar: (avatar) => set({ avatar }),

      setSettings: (settings) => {
        const prev = get().settings
        set((state) => ({
          settings,
          actionHistory: [
            ...state.actionHistory.slice(-9),
            { type: "change_settings", data: prev, description: "Changed settings" },
          ],
          lastAction: "Changed settings",
        }))
      },

      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),

      clearMessages: () => set({ messages: [] }),

      addCustomButton: (button) =>
        set((state) => ({
          customButtons: [...state.customButtons, button],
          actionHistory: [
            ...state.actionHistory.slice(-9),
            { type: "add_button", data: button, description: `Created "${button.label}"` },
          ],
          lastAction: `Created "${button.label}"`,
        })),

      removeButton: (identifier) => {
        const state = get()
        const normalizedId = identifier.toLowerCase().trim()

        // Check custom buttons first
        const customButton = state.customButtons.find(
          (b) =>
            b.id === identifier ||
            b.id.toLowerCase() === normalizedId ||
            b.label.toLowerCase().trim() === normalizedId ||
            b.text.toLowerCase().trim() === normalizedId,
        )

        if (customButton) {
          set({
            customButtons: state.customButtons.filter((b) => b.id !== customButton.id),
            deletionHistory: [
              ...state.deletionHistory.slice(-19),
              { id: customButton.id, label: customButton.label, deletedAt: Date.now() },
            ],
            actionHistory: [
              ...state.actionHistory.slice(-9),
              { type: "delete_button", data: customButton, description: `Deleted "${customButton.label}"` },
            ],
            lastAction: `Deleted "${customButton.label}"`,
          })
          return true
        }

        // Check if it's already in deletedDefaultButtons
        if (state.deletedDefaultButtons.includes(identifier)) {
          return true // Already deleted
        }

        // For default buttons, add to deletedDefaultButtons
        // We need to find the button label for the history
        const defaultButtonLabels: Record<string, string> = {
          "good-day": "I had a good day",
          "good-morning": "Good morning",
          "hungry-breakfast": "I'm hungry for breakfast",
          hungry: "I'm hungry",
          thirsty: "I'm thirsty",
          // ... add more as needed, or import from default-buttons
        }

        const buttonLabel = defaultButtonLabels[identifier] || identifier

        set({
          deletedDefaultButtons: [...state.deletedDefaultButtons, identifier],
          deletionHistory: [
            ...state.deletionHistory.slice(-19),
            { id: identifier, label: buttonLabel, deletedAt: Date.now() },
          ],
          lastAction: `Deleted "${buttonLabel}"`,
        })
        return true // Return true since we successfully marked it for deletion
      },

      updateButton: (identifier, updates) => {
        const state = get()
        const normalizedId = identifier.toLowerCase().trim()
        const buttonIndex = state.customButtons.findIndex(
          (b) =>
            b.id === identifier ||
            b.label.toLowerCase().trim() === normalizedId ||
            b.text.toLowerCase().trim() === normalizedId,
        )

        if (buttonIndex === -1) return false

        const oldButton = state.customButtons[buttonIndex]
        const updatedButton = { ...oldButton, ...updates }
        const newCustomButtons = [...state.customButtons]
        newCustomButtons[buttonIndex] = updatedButton

        set({
          customButtons: newCustomButtons,
          actionHistory: [
            ...state.actionHistory.slice(-9),
            { type: "add_button", data: oldButton, description: `Updated "${oldButton.label}"` },
          ],
          lastAction: `Updated "${oldButton.label}"`,
        })
        return true
      },

      restoreDefaults: () =>
        set({
          customButtons: [],
          deletedDefaultButtons: [],
        }),

      get canUndo() {
        return get().actionHistory.length > 0
      },

      undo: () => {
        const state = get()
        const lastAction = state.actionHistory[state.actionHistory.length - 1]
        if (!lastAction) return

        switch (lastAction.type) {
          case "add_button": {
            const button = lastAction.data as CommunicationButton
            set({
              customButtons: state.customButtons.filter((b) => b.id !== button.id),
              actionHistory: state.actionHistory.slice(0, -1),
              lastAction: null,
            })
            break
          }
          case "delete_button": {
            const button = lastAction.data as CommunicationButton
            set({
              customButtons: [...state.customButtons, button],
              deletedDefaultButtons: state.deletedDefaultButtons.filter((id) => id !== button.id),
              actionHistory: state.actionHistory.slice(0, -1),
              lastAction: null,
            })
            break
          }
          case "change_settings": {
            const prevSettings = lastAction.data as ExtendedUserSettings
            set({
              settings: prevSettings,
              actionHistory: state.actionHistory.slice(0, -1),
              lastAction: null,
            })
            break
          }
        }
      },

      trackPhraseUsage: (phrase: string, context?: string) => {
        set((state) => {
          const existing = state.phraseUsage[phrase] || { count: 0, lastUsed: 0, contexts: [] }
          return {
            phraseUsage: {
              ...state.phraseUsage,
              [phrase]: {
                count: existing.count + 1,
                lastUsed: Date.now(),
                contexts: context ? [...existing.contexts.slice(-4), context] : existing.contexts,
              },
            },
          }
        })
      },

      getFrequentPhrases: () => {
        const usage = get().phraseUsage
        const now = Date.now()
        const oneDay = 24 * 60 * 60 * 1000

        return Object.entries(usage)
          .filter(([, data]) => now - data.lastUsed < oneDay * 7)
          .sort((a, b) => b[1].count - a[1].count)
          .slice(0, 6)
          .map(([phrase]) => phrase)
      },

      createShareSession: () => {
        const sessionId = Math.random().toString(36).substring(2, 10)
        const now = Date.now()
        set((state) => ({
          sharedSessions: {
            ...state.sharedSessions,
            [sessionId]: {
              phrases: [],
              createdAt: now,
              expiresAt: now + 24 * 60 * 60 * 1000,
            },
          },
        }))
        return sessionId
      },

      addToShareSession: (sessionId: string, phrase: string) => {
        set((state) => {
          const session = state.sharedSessions[sessionId]
          if (!session) return state
          return {
            sharedSessions: {
              ...state.sharedSessions,
              [sessionId]: {
                ...session,
                phrases: [...session.phrases, phrase],
              },
            },
          }
        })
      },

      getShareSession: (sessionId: string) => {
        const session = get().sharedSessions[sessionId]
        if (!session || Date.now() > session.expiresAt) return null
        return session
      },

      setTranslationCache: (lang: string, translations: Record<string, { label: string; text: string }>) => {
        set((state) => ({
          translationCache: {
            ...state.translationCache,
            [lang]: {
              ...(state.translationCache[lang] || {}),
              ...translations,
            },
          },
        }))
      },

      getTranslation: (lang: string, buttonId: string) => {
        const cache = get().translationCache[lang]
        return cache?.[buttonId] || null
      },

      trackModel: (phrase: string) => {
        const today = new Date().toISOString().split("T")[0]
        const state = get()

        const now = new Date()
        const weekStart = new Date(now)
        weekStart.setDate(now.getDate() - now.getDay())
        const weekStartStr = weekStart.toISOString().split("T")[0]

        let modelsThisWeek = 0
        Object.entries(state.modelingStats.dailyHistory).forEach(([date, count]) => {
          if (date >= weekStartStr) {
            modelsThisWeek += count
          }
        })

        const modelsToday = state.modelingStats.lastModelDate === today ? state.modelingStats.modelsToday + 1 : 1

        set({
          modelingStats: {
            totalModels: state.modelingStats.totalModels + 1,
            modelsToday,
            modelsThisWeek: modelsThisWeek + 1,
            lastModelDate: today,
            phraseModels: {
              ...state.modelingStats.phraseModels,
              [phrase]: (state.modelingStats.phraseModels[phrase] || 0) + 1,
            },
            dailyHistory: {
              ...state.modelingStats.dailyHistory,
              [today]: (state.modelingStats.dailyHistory[today] || 0) + 1,
            },
          },
        })
      },

      getModelingStats: () => {
        const state = get()
        const today = new Date().toISOString().split("T")[0]

        const now = new Date()
        const weekStart = new Date(now)
        weekStart.setDate(now.getDate() - now.getDay())
        const weekStartStr = weekStart.toISOString().split("T")[0]

        let modelsThisWeek = 0
        Object.entries(state.modelingStats.dailyHistory).forEach(([date, count]) => {
          if (date >= weekStartStr) {
            modelsThisWeek += count
          }
        })

        return {
          ...state.modelingStats,
          modelsToday: state.modelingStats.lastModelDate === today ? state.modelingStats.modelsToday : 0,
          modelsThisWeek,
        }
      },

      getMostPracticedPhrases: () => {
        const state = get()
        return Object.entries(state.modelingStats.phraseModels)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([phrase, count]) => ({ phrase, count }))
      },

      restoreButton: (identifier?: string) => {
        const state = get()

        // If no identifier provided, restore the last deleted button
        if (!identifier) {
          const lastDeleted = state.deletionHistory[state.deletionHistory.length - 1]
          if (!lastDeleted) return false
          identifier = lastDeleted.id
        }

        const normalizedId = identifier.toLowerCase().trim()

        // Check if it's in deletedDefaultButtons
        if (state.deletedDefaultButtons.some((id) => id === identifier || id.toLowerCase() === normalizedId)) {
          set({
            deletedDefaultButtons: state.deletedDefaultButtons.filter(
              (id) => id !== identifier && id.toLowerCase() !== normalizedId,
            ),
            deletionHistory: state.deletionHistory.filter((d) => d.id !== identifier),
            lastAction: `Restored button`,
          })
          return true
        }

        // Check actionHistory for deleted custom buttons
        const deletedCustom = state.actionHistory.find(
          (a) =>
            a.type === "delete_button" &&
            ((a.data as CommunicationButton).id === identifier ||
              (a.data as CommunicationButton).label.toLowerCase().trim() === normalizedId),
        )

        if (deletedCustom) {
          const button = deletedCustom.data as CommunicationButton
          set({
            customButtons: [...state.customButtons, button],
            deletionHistory: state.deletionHistory.filter((d) => d.id !== button.id),
            lastAction: `Restored "${button.label}"`,
          })
          return true
        }

        return false
      },

      getLastDeletedButton: () => {
        const state = get()
        const lastDeleted = state.deletionHistory[state.deletionHistory.length - 1]
        return lastDeleted ? { id: lastDeleted.id, label: lastDeleted.label } : null
      },
    }),
    {
      name: "innervoice-storage",
      partialize: (state) => ({
        avatar: state.avatar,
        settings: state.settings,
        customButtons: state.customButtons,
        deletedDefaultButtons: state.deletedDefaultButtons,
        phraseUsage: state.phraseUsage,
        sharedSessions: state.sharedSessions,
        translationCache: state.translationCache,
        modelingStats: state.modelingStats,
        deletionHistory: state.deletionHistory, // Persist deletion history
      }),
    },
  ),
)
