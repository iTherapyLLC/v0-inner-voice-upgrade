"use client"
import { useAppStore } from "@/lib/store"
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

const EMOTIONS = [
  { id: "neutral" as Emotion, label: "Normal", color: "bg-gray-100 text-gray-600", Icon: NeutralFaceIcon },
  { id: "happy" as Emotion, label: "Happy", color: "bg-yellow-100 text-yellow-600", Icon: HappyFaceIcon },
  { id: "excited" as Emotion, label: "Excited", color: "bg-orange-100 text-orange-600", Icon: ExcitedIcon },
  { id: "calm" as Emotion, label: "Calm", color: "bg-blue-100 text-blue-600", Icon: CalmFaceIcon },
  { id: "sad" as Emotion, label: "Sad", color: "bg-indigo-100 text-indigo-600", Icon: SadFaceIcon },
  { id: "serious" as Emotion, label: "Serious", color: "bg-slate-100 text-slate-600", Icon: SeriousFaceIcon },
]

export default function SettingsPage() {
  const { settings, setSettings } = useAppStore()
  const { speak, isSpeaking, isLoading } = useElevenLabs()

  const handleGenderChange = (gender: "female" | "male") => {
    const voices = gender === "female" ? FEMALE_VOICES : MALE_VOICES
    const defaultVoice = voices[0]
    setSettings({
      ...settings,
      voiceGender: gender,
      voiceId: defaultVoice.id,
      voiceName: defaultVoice.name,
    })
  }

  const handleVoiceChange = (voiceId: string, voiceName: string) => {
    setSettings({ ...settings, voiceId, voiceName })
  }

  const handleSpeedChange = (speed: VoiceSpeed) => {
    setSettings({ ...settings, voiceSpeed: speed })
  }

  const handleEmotionChange = (emotion: Emotion) => {
    setSettings({ ...settings, emotion })
  }

  const testVoice = () => {
    const testPhrases: Record<Emotion, string> = {
      neutral: "Hello! This is how I sound normally.",
      happy: "This is wonderful! I'm so happy to help you today!",
      excited: "Wow! This is so exciting! Let's do this!",
      calm: "Everything is okay. Take your time. I'm here for you.",
      sad: "I understand. Sometimes things are hard.",
      serious: "This is important. Please listen carefully.",
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
        <p className="mt-2 text-lg text-muted-foreground">Make it sound just right!</p>
      </div>

      {/* Voice Type */}
      <Card className="mb-6 border-2 border-primary/20">
        <CardContent className="p-6">
          <Label className="mb-4 block text-lg font-bold">Voice Type</Label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleGenderChange("female")}
              className={cn(
                "flex flex-col items-center justify-center rounded-2xl border-3 p-6 transition-all",
                "hover:scale-[1.02] active:scale-[0.98]",
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
              className={cn(
                "flex flex-col items-center justify-center rounded-2xl border-3 p-6 transition-all",
                "hover:scale-[1.02] active:scale-[0.98]",
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
                className={cn(
                  "rounded-xl border-2 p-4 text-left transition-all",
                  "hover:scale-[1.02] active:scale-[0.98]",
                  settings.voiceId === voice.id
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border/50 bg-card hover:border-primary/50",
                )}
              >
                <p className="font-bold text-foreground">{voice.name}</p>
                <p className="text-sm text-muted-foreground">{voice.description}</p>
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
                className={cn(
                  "flex flex-col items-center rounded-xl border-2 p-4 transition-all",
                  "hover:scale-[1.02] active:scale-[0.98]",
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

      {/* How Should It Feel? */}
      <Card className="mb-6 border-2 border-secondary/20">
        <CardContent className="p-6">
          <Label className="mb-4 block text-lg font-bold">How Should It Feel?</Label>
          <p className="mb-4 text-sm text-muted-foreground">
            This changes how the voice sounds and how the avatar looks
          </p>
          <div className="grid grid-cols-3 gap-3">
            {EMOTIONS.map((emotion) => (
              <button
                key={emotion.id}
                onClick={() => handleEmotionChange(emotion.id)}
                className={cn(
                  "flex flex-col items-center rounded-xl border-2 p-4 transition-all",
                  "hover:scale-[1.02] active:scale-[0.98]",
                  settings.emotion === emotion.id
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border/50 bg-card hover:border-primary/50",
                )}
              >
                <div className={cn("mb-2 flex h-10 w-10 items-center justify-center rounded-full", emotion.color)}>
                  <emotion.Icon className="h-6 w-6" />
                </div>
                <span className="font-bold text-sm">{emotion.label}</span>
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

      <p className="mt-8 text-center text-sm text-muted-foreground">Need help? Tap the friendly face in the corner!</p>
    </div>
  )
}
