import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { AvatarIcon, SettingsIcon, ChatBubbleIcon, SparklesIcon, LightbulbIcon, SpeakingIcon } from "@/components/icons"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const tutorialSteps = [
  {
    number: 1,
    icon: AvatarIcon,
    title: "Pick Your Buddy",
    description:
      "First, choose an avatar that represents you! Pick from fun presets, upload your own photo, or try the AI-powered buddy that talks and moves in real-time.",
    tip: "The AI buddy creates a super engaging experience with real lip-syncing!",
    color: "bg-secondary text-white",
  },
  {
    number: 2,
    icon: SettingsIcon,
    title: "Set Up Your Voice",
    description:
      "Head to Settings to customize how your messages sound. Pick a voice type, adjust the speed, and set the volume to make it perfect for you.",
    tip: 'Hit the "Test Voice" button to hear how it sounds before you start!',
    color: "bg-primary text-white",
  },
  {
    number: 3,
    icon: ChatBubbleIcon,
    title: "Start Communicating",
    description:
      "Go to the Communicate page and tap the colorful buttons to say things! They're organized by type - Greetings, Feelings, Needs, and Responses.",
    tip: "Each category has its own color to help you find what you need fast!",
    color: "bg-greetings text-white",
  },
  {
    number: 4,
    icon: SpeakingIcon,
    title: "Type Your Own",
    description:
      'Want to say something specific? Type it in the text box and press "Speak" to hear it out loud. Your messages are saved so you can see what you said.',
    tip: "You can clear your message history anytime with the Clear button.",
    color: "bg-feelings text-white",
  },
  {
    number: 5,
    icon: SparklesIcon,
    title: "Practice & Explore",
    description:
      "InnerVoice is all about having fun while learning! Try different buttons, explore all the features, and make it your own. The more you use it, the easier it gets!",
    tip: "InnerVoice works on phones, tablets, and computers - use it anywhere!",
    color: "bg-needs text-white",
  },
]

export default function TutorialPage() {
  redirect("/communicate")

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-10 text-center">
        <div className="relative mx-auto mb-4 inline-block">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent animate-float">
            <LightbulbIcon className="h-10 w-10 text-accent-foreground" />
          </div>
          <SparklesIcon className="absolute -right-2 -top-2 h-6 w-6 text-primary animate-pulse" />
        </div>
        <h1 className="text-3xl font-extrabold text-foreground">How to Use InnerVoice</h1>
        <p className="mt-2 text-lg text-muted-foreground">Follow these easy steps to get started!</p>
      </div>

      <div className="space-y-6">
        {tutorialSteps.map((step) => (
          <Card
            key={step.number}
            className="card-playful border-2 border-transparent hover:border-primary/20 overflow-hidden"
          >
            <CardContent className="flex gap-6 p-0">
              {/* Step number and icon */}
              <div className={`flex flex-col items-center justify-center gap-2 p-6 ${step.color}`}>
                <span className="text-3xl font-extrabold">{step.number}</span>
                <step.icon className="h-8 w-8" />
              </div>

              {/* Content */}
              <div className="flex-1 space-y-4 py-6 pr-6">
                <h2 className="text-xl font-bold text-foreground">{step.title}</h2>
                <p className="text-muted-foreground">{step.description}</p>
                <div className="flex items-start gap-2 rounded-xl bg-accent/30 p-3 text-sm">
                  <LightbulbIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-foreground" />
                  <span>
                    <strong className="text-accent-foreground">Tip:</strong>{" "}
                    <span className="text-muted-foreground">{step.tip}</span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Help Section */}
      <Card className="mt-10 border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <h3 className="text-xl font-bold text-foreground">Ready to Start?</h3>
          <p className="text-muted-foreground">You've got this! Jump in and start communicating with InnerVoice.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              className="btn-tactile rounded-full px-8 py-6 text-lg font-bold shadow-lg shadow-primary/20"
            >
              <Link href="/communicate">
                <ChatBubbleIcon className="mr-2 h-5 w-5" />
                Let's Go!
              </Link>
            </Button>
            <Button variant="outline" asChild className="btn-tactile rounded-full px-6 py-6 font-bold bg-transparent">
              <Link href="/settings">
                <SettingsIcon className="mr-2 h-5 w-5" />
                Settings
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
