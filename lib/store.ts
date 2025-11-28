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
  setAvatar: (avatar: Avatar | null) => void
  setSettings: (settings: ExtendedUserSettings) => void
  addMessage: (message: Message) => void
  clearMessages: () => void
  addCustomButton: (button: CommunicationButton) => void
  removeButton: (buttonId: string) => void
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

      removeButton: (buttonId) => {
        const state = get()
        const button = state.customButtons.find((b) => b.id === buttonId)
        set({
          customButtons: state.customButtons.filter((b) => b.id !== buttonId),
          deletedDefaultButtons: state.customButtons.some((b) => b.id === buttonId)
            ? state.deletedDefaultButtons
            : [...state.deletedDefaultButtons, buttonId],
          actionHistory: button
            ? [
                ...state.actionHistory.slice(-9),
                { type: "delete_button", data: button, description: `Deleted "${button.label}"` },
              ]
            : state.actionHistory,
          lastAction: button ? `Deleted "${button.label}"` : null,
        })
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
      }),
    },
  ),
)
