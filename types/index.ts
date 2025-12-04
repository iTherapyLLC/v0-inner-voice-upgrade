export interface Avatar {
  id: string
  name: string
  imageUrl: string
  type: "preset" | "custom" | "hedra"
}

export type VoiceGender = "female" | "male"
export type VoiceSpeed = "slow" | "normal" | "fast"
export type Emotion =
  | "neutral"
  | "happy"
  | "sad"
  | "excited"
  | "calm"
  | "serious"
  | "angry"
  | "fearful"
  | "disgusted"
  | "surprised"

export interface UserSettings {
  voiceId: string
  voiceName: string
  voiceGender: VoiceGender
  voiceSpeed: VoiceSpeed
  emotion: Emotion
  volume: number
}

export interface CommunicationButton {
  id: string
  label: string
  text: string
  icon: string
  category: string
  color?: string // Added missing color property that buttons use
  emotion?: Emotion // Optional emotion for this specific button
  contextHint?: string // Description of the visual scene to illustrate this phrase
}

export interface Message {
  id: string
  text: string
  timestamp: Date
  isUser: boolean
}

export interface HedraSession {
  sessionId: string
  avatarUrl: string
  status: "connecting" | "connected" | "disconnected" | "error"
}

export const FEMALE_VOICES = [
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah", description: "Warm & friendly" },
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel", description: "Calm & clear" },
  { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi", description: "Confident" },
  { id: "MF3mGyEYCl7XYWbV9V6O", name: "Elli", description: "Young & bright" },
]

export const MALE_VOICES = [
  { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh", description: "Deep & warm" },
  { id: "VR6AewLTigWG4xSOukaG", name: "Arnold", description: "Strong & bold" },
  { id: "pNInz6obpgDQGcFmaJgB", name: "Adam", description: "Clear & natural" },
  { id: "yoZ06aMxZJJ28mfd3POQ", name: "Sam", description: "Friendly guy" },
]

export const SPEED_VALUES: Record<VoiceSpeed, number> = {
  slow: 0.75,
  normal: 1.0,
  fast: 1.2,
}

export const EMOTION_STABILITY: Record<Emotion, number> = {
  neutral: 0.5,
  happy: 0.3,
  sad: 0.35,
  excited: 0.2,
  calm: 0.7,
  serious: 0.6,
  angry: 0.25,
  fearful: 0.3,
  disgusted: 0.4,
  surprised: 0.25,
}
