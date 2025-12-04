"use client"
import { useAppStore } from "@/lib/store"
import type React from "react"

import { useElevenLabs } from "@/hooks/use-elevenlabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  SpeakingIcon,
  SlowSpeedIcon,
  NormalSpeedIcon,
  FastSpeedIcon,
  NeutralFaceIcon,
  HappyFaceIcon,
  ExcitedIcon,
  CalmFaceIcon,
  SadFaceIcon,
  SeriousFaceIcon,
  FemaleIcon,
  MaleIcon,
} from "@/components/icons"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { FEMALE_VOICES, MALE_VOICES, type VoiceSpeed, type Emotion } from "@/types"

const VOICE_PREVIEW_PHRASES: Record<string, string> = {
  // Female voices
  EXAVITQu4vr4xnSDxMaL: "Hi, I'm Sarah! I have a warm and friendly voice.",
  "21m00Tcm4TlvDq8ikWAM": "Hello, I'm Rachel. My voice is calm and clear.",
  AZnzlk1XvdvUeBnXmlld: "Hey there, I'm Domi. I sound confident and strong!",
  MF3mGyEYCl7XYWbV9V6O: "Hi! I'm Elli, and I'm young and bright!",
  // Male voices
  TxGEqnHWrfWFTfGW9XjX: "Hello, I'm Josh. My voice is deep and warm.",
  VR6AewLTigWG4xSOukaG: "Hey, I'm Arnold! I have a strong and bold voice.",
  pNInz6obpgDQGcFmaJgB: "Hi there, I'm Adam. I sound clear and natural.",
  yoZ06aMxZJJ28mfd3POQ: "Hey! I'm Sam, your friendly guy.",
}

const EMOTIONS: Array<{
  id: Emotion
  label: string
  color: string
  Icon: React.ComponentType<{ className?: string }>
  preview: string
}> = [
  {
    id: "neutral",
    label: "Normal",
    color: "bg-gray-100 text-gray-600",
    Icon: NeutralFaceIcon,
    preview: "This is how I normally sound. Clear and steady.",
  },
  {
    id: "happy",
    label: "Happy",
    color: "bg-yellow-100 text-yellow-600",
    Icon: HappyFaceIcon,
    preview: "This is wonderful! I'm so happy to help you today!",
  },
  {
    id: "excited",
    label: "Excited",
    color: "bg-orange-100 text-orange-600",
    Icon: ExcitedIcon,
    preview: "Wow! This is so exciting! Let's do this!",
  },
  {
    id: "calm",
    label: "Calm",
    color: "bg-blue-100 text-blue-600",
    Icon: CalmFaceIcon,
    preview: "Everything is okay. Take your time. I'm here for you.",
  },
  {
    id: "sad",
    label: "Sad",
    color: "bg-indigo-100 text-indigo-600",
    Icon: SadFaceIcon,
    preview: "I understand. Sometimes things are hard.",
  },
  {
    id: "serious",
    label: "Serious",
    color: "bg-slate-100 text-slate-600",
    Icon: SeriousFaceIcon,
    preview: "This is important. Please listen carefully.",
  },
  {
    id: "angry",
    label: "Angry",
    color: "bg-red-100 text-red-600",
    Icon: SeriousFaceIcon,
    preview: "No! I don't like that! That's not fair!",
  },
  {
    id: "fearful",
    label: "Fearful",
    color: "bg-purple-100 text-purple-600",
    Icon: SadFaceIcon,
    preview: "I'm scared. I don't want to do that.",
  },
  {
    id: "disgusted",
    label: "Disgusted",
    color: "bg-green-100 text-green-600",
    Icon: SeriousFaceIcon,
    preview: "Ew, yuck! I don't like that at all.",
  },
  {
    id: "surprised",
    label: "Surprised",
    color: "bg-pink-100 text-pink-600",
    Icon: ExcitedIcon,
    preview: "Oh wow! I didn't expect that! Amazing!",
  },
]

export default function SettingsPage() {
  const { settings, setSettings } = useAppStore()
  const { speak, stop, isSpeaking, isLoading } = useElevenLabs()

  const handleGenderChange = (gender: "female" | "male") => {
    stop() // Stop any current playback
    const voices = gender === "female" ? FEMALE_VOICES : MALE_VOICES
    const defaultVoice = voices[0]
    setSettings({
      ...settings,
      voiceGender: gender,
      voiceId: defaultVoice.id,
      voiceName: defaultVoice.name,
    })
    // Instant preview
    const previewText = VOICE_PREVIEW_PHRASES[defaultVoice.id] || `Hi, I'm ${defaultVoice.name}!`
    speak(previewText, {
      voiceId: defaultVoice.id,
      speed: settings.voiceSpeed,
      emotion: settings.emotion,
    })
  }

  const handleVoiceChange = (voiceId: string, voiceName: string) => {
    stop() // Stop any current playback
    setSettings({ ...settings, voiceId, voiceName })
    // Instant preview
    const previewText = VOICE_PREVIEW_PHRASES[voiceId] || `Hi, I'm ${voiceName}!`
    speak(previewText, {
      voiceId,
      speed: settings.voiceSpeed,
      emotion: settings.emotion,
    })
  }

  const handleSpeedChange = (speed: VoiceSpeed) => {
    stop()
    setSettings({ ...settings, voiceSpeed: speed })
    const speedPhrases: Record<VoiceSpeed, string> = {
      slow: "Now I'll speak slower, nice and easy.",
      normal: "This is my normal speaking speed.",
      fast: "Now I'm speaking a bit faster!",
    }
    speak(speedPhrases[speed], {
      voiceId: settings.voiceId,
      speed,
      emotion: settings.emotion,
    })
  }

  const handleEmotionChange = (emotion: Emotion) => {
    stop()
    setSettings({ ...settings, emotion })
    const emotionData = EMOTIONS.find((e) => e.id === emotion)
    const previewText = emotionData?.preview || "This is how I sound now."
    speak(previewText, {
      voiceId: settings.voiceId,
      speed: settings.voiceSpeed,
      emotion,
    })
  }

  const testVoice = () => {
    const testPhrases: Record<Emotion, string> = {
      neutral: "Hello! This is how I sound normally.",
      happy: "This is wonderful! I'm so happy to help you today!",
      excited: "Wow! This is so exciting! Let's do this!",
      calm: "Everything is okay. Take your time. I'm here for you.",
      sad: "I understand. Sometimes things are hard.",
      serious: "This is important. Please listen carefully.",
      angry: "No! I really don't like that! That's not fair!",
      fearful: "I'm scared. I don't want to do that.",
      disgusted: "Ew, yuck! I really don't like that at all.",
      surprised: "Oh wow! I didn't expect that! Amazing!",
    }
    speak(testPhrases[settings.emotion], {
      voiceId: settings.voiceId,
      speed: settings.voiceSpeed,
      emotion: settings.emotion,
    })
  }

  const currentVoices = settings.voiceGender === "female" ? FEMALE_VOICES : MALE_VOICES

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-secondary/30 to-accent/30 shadow-lg">
          <SpeakingIcon className="h-10 w-10 text-secondary" />
        </div>
        <h1 className="text-3xl font-extrabold text-foreground">Your Voice</h1>
        <p className="mt-2 text-lg text-muted-foreground">Tap any option to hear it instantly!</p>
      </div>

      {/* Voice Type */}
      <Card className="mb-6 border-2 border-primary/20">
        <CardContent className="p-6">
          <Label className="mb-4 block text-lg font-bold">Voice Type</Label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleGenderChange("female")}
              disabled={isSpeaking || isLoading}
              className={cn(
                "flex flex-col items-center justify-center rounded-2xl border-3 p-6 transition-all",
                "hover:scale-[1.02] active:scale-[0.98]",
                "disabled:opacity-70",
                settings.voiceGender === "female"
                  ? "border-pink-400 bg-pink-50 shadow-lg shadow-pink-200"
                  : "border-border bg-card hover:border-pink-200",
              )}
            >
              <div
                className={cn(
                  "mb-2 flex h-16 w-16 items-center justify-center rounded-full",
                  settings.voiceGender === "female" ? "bg-pink-400 text-white" : "bg-pink-100 text-pink-400",
                )}
              >
                <FemaleIcon className="h-8 w-8" />
              </div>
              <span className="text-xl font-bold">Female</span>
            </button>
            <button
              onClick={() => handleGenderChange("male")}
              disabled={isSpeaking || isLoading}
              className={cn(
                "flex flex-col items-center justify-center rounded-2xl border-3 p-6 transition-all",
                "hover:scale-[1.02] active:scale-[0.98]",
                "disabled:opacity-70",
                settings.voiceGender === "male"
                  ? "border-blue-400 bg-blue-50 shadow-lg shadow-blue-200"
                  : "border-border bg-card hover:border-blue-200",
              )}
            >
              <div
                className={cn(
                  "mb-2 flex h-16 w-16 items-center justify-center rounded-full",
                  settings.voiceGender === "male" ? "bg-blue-400 text-white" : "bg-blue-100 text-blue-400",
                )}
              >
                <MaleIcon className="h-8 w-8" />
              </div>
              <span className="text-xl font-bold">Male</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Voice Selection */}
      <Card className="mb-6 border-2 border-secondary/20">
        <CardContent className="p-6">
          <Label className="mb-4 block text-lg font-bold">Pick a Voice</Label>
          <div className="grid grid-cols-2 gap-3">
            {currentVoices.map((voice) => (
              <button
                key={voice.id}
                onClick={() => handleVoiceChange(voice.id, voice.name)}
                disabled={isSpeaking || isLoading}
                className={cn(
                  "rounded-xl border-2 p-4 text-left transition-all",
                  "hover:scale-[1.02] active:scale-[0.98]",
                  "disabled:opacity-70",
                  settings.voiceId === voice.id
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border/50 bg-card hover:border-primary/50",
                )}
              >
                <p className="font-bold text-foreground">{voice.name}</p>
                <p className="text-sm text-muted-foreground">{voice.description}</p>
                {settings.voiceId === voice.id && (isSpeaking || isLoading) && (
                  <p className="text-xs text-primary mt-1 animate-pulse">Playing...</p>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How Fast? */}
      <Card className="mb-6 border-2 border-accent/20">
        <CardContent className="p-6">
          <Label className="mb-4 block text-lg font-bold">How Fast?</Label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "slow" as VoiceSpeed, label: "Slower", Icon: SlowSpeedIcon },
              { id: "normal" as VoiceSpeed, label: "Normal", Icon: NormalSpeedIcon },
              { id: "fast" as VoiceSpeed, label: "Faster", Icon: FastSpeedIcon },
            ].map((speed) => (
              <button
                key={speed.id}
                onClick={() => handleSpeedChange(speed.id)}
                disabled={isSpeaking || isLoading}
                className={cn(
                  "flex flex-col items-center rounded-xl border-2 p-4 transition-all",
                  "hover:scale-[1.02] active:scale-[0.98]",
                  "disabled:opacity-70",
                  settings.voiceSpeed === speed.id
                    ? "border-accent bg-accent/10 shadow-md"
                    : "border-border/50 bg-card hover:border-accent/50",
                )}
              >
                <speed.Icon className="mb-1 h-8 w-8" />
                <span className="font-bold">{speed.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How Should It Feel? - Expanded with more emotions */}
      <Card className="mb-6 border-2 border-secondary/20">
        <CardContent className="p-6">
          <Label className="mb-4 block text-lg font-bold">How Should It Feel?</Label>
          <p className="mb-4 text-sm text-muted-foreground">
            This emotion colors ALL your messages until you change it
          </p>
          <div className="grid grid-cols-5 gap-2">
            {EMOTIONS.map((emotion) => (
              <button
                key={emotion.id}
                onClick={() => handleEmotionChange(emotion.id)}
                disabled={isSpeaking || isLoading}
                className={cn(
                  "flex flex-col items-center rounded-xl border-2 p-3 transition-all",
                  "hover:scale-[1.02] active:scale-[0.98]",
                  "disabled:opacity-70",
                  settings.emotion === emotion.id
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border/50 bg-card hover:border-primary/50",
                )}
              >
                <div className={cn("mb-1 flex h-8 w-8 items-center justify-center rounded-full", emotion.color)}>
                  <emotion.Icon className="h-5 w-5" />
                </div>
                <span className="font-bold text-xs">{emotion.label}</span>
                {settings.emotion === emotion.id && (isSpeaking || isLoading) && (
                  <span className="text-[10px] text-primary animate-pulse">Playing</span>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test button */}
      <Button
        onClick={testVoice}
        className="btn-premium w-full rounded-full py-8 text-xl font-bold"
        disabled={isSpeaking || isLoading}
        variant="secondary"
      >
        <SpeakingIcon className="mr-3 h-7 w-7" />
        {isLoading ? "Getting ready..." : isSpeaking ? "Listening..." : "Test It!"}
      </Button>

      {/* Next step CTA */}
      <div className="mt-8 text-center">
        <Button asChild size="lg" className="btn-premium rounded-full px-10 py-6 text-xl font-bold">
          <Link href="/communicate">Done! Start Talking</Link>
        </Button>
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Your emotion setting ({settings.emotion}) will color all your messages!
      </p>
    </div>
  )
}
