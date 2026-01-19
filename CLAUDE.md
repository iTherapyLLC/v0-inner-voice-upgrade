# InnerVoice - AAC + Literacy Learning Platform

## Mission
AAC device that teaches communication AND literacy. Target users: individuals on the autism spectrum, including children struggling with reading.

## Design Principles
- Studio Ghibli anime style images (avoids uncanny valley, highly motivating for autistic users)
- Zero learning curve - "offensively easy" to use
- Multi-sensory approach: visual + audio + kinesthetic
- Scaffolded learning with mastery checks before advancing
- No emojis - custom vector icons only

## Literacy Curriculum (Lightspeed Literacy)
Multi-sensory phonics-based curriculum with these drill types:
1. Auditory Drill - hear sound, type grapheme
2. Visual Drill - see letter, speak sound
3. Air Writing - kinesthetic tracing
4. Blending Drill - sequential letter blending
5. Speech-to-text and text-to-speech exercises

Progression: Letters → Short vowels → Consonants → Open syllables → CVC words → Silent-e → Soft c/g → Vowel teams → R-controlled → Diphthongs → Consonant-le

## Key Requirement
Review previous concepts for mastery. Reteach unmastered information before teaching new content.

## Image Strategy
- Cache all repeatable content images (stories, drills, practice)
- Only generate dynamically for user-created custom buttons
- All images: Studio Ghibli anime style, highest quality

## Tech Stack
- Next.js, TypeScript, Tailwind
- ElevenLabs TTS with IPA/SSML for accurate phoneme pronunciation
- Zustand for state management

## Project Structure
```
app/                    # Next.js app router pages
  communicate/          # AAC button board (Talk mode)
  practice/             # Multiple choice practice scenarios
  story-mode/           # Interactive stories with narration
  literacy/             # Full literacy curriculum
    lesson/[id]/        # Dynamic lesson player
    progress/           # Student progress tracking
    dashboard/          # Parent/instructor dashboard
  api/                  # Backend routes (speak, chat, images, etc.)

components/
  literacy/drills/      # Drill components (Auditory, Visual, AirWriting, Blending)
  ui/                   # Shared UI components (Radix-based)
  learning-modal.tsx    # Modal for AAC button interactions

hooks/
  use-elevenlabs.ts     # TTS with emotion/speed control
  use-speech-recognition.ts  # Web Speech API wrapper

lib/
  store.ts              # Global Zustand store
  literacy-store.ts     # Literacy progress tracking
  literacy/
    curriculum/         # Phase-based curriculum data
    phoneme-utils.ts    # CV pronunciation mapping
    mastery.ts          # Mastery calculation logic
```

## Key Features
- **Talk Mode**: 30+ AAC buttons with categories, custom buttons, translation support
- **Practice Mode**: 5 scenarios with multiple choice, animated text highlighting
- **Story Mode**: Interactive stories with narration sync, answer options
- **Literacy Drills**: Multi-sensory drills with mastery tracking (85-90% thresholds)
- **Watch First Mode**: Modeling before imitation for learning support
