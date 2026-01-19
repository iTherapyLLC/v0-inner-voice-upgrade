// Complete Lightspeed Literacy Curriculum
import type { Curriculum } from "@/types/literacy"
import { phase1 } from "./phases/phase1"
import { phase2 } from "./phases/phase2"
import { phase3 } from "./phases/phase3"
import { phase4 } from "./phases/phase4"
import { phase5 } from "./phases/phase5"
import { phase6 } from "./phases/phase6"
import { phase7 } from "./phases/phase7"
import { phase8 } from "./phases/phase8"
import { phase9 } from "./phases/phase9"
import { phase10 } from "./phases/phase10"
import { phase11 } from "./phases/phase11"

export const curriculum: Curriculum = {
  phases: [
    phase1,   // Letter Recognition & Sounds
    phase2,   // Short Vowels
    phase3,   // Consonants & Digraphs
    phase4,   // Open Syllables (CV)
    phase5,   // CVC Words
    phase6,   // Silent-e (CVCe)
    phase7,   // Soft C & Soft G
    phase8,   // Vowel Teams
    phase9,   // R-Controlled Vowels
    phase10,  // Diphthongs
    phase11,  // Consonant-le
  ],
}

export function getPhaseById(phaseId: string) {
  return curriculum.phases.find(phase => phase.id === phaseId)
}

export function getLessonById(lessonId: string) {
  for (const phase of curriculum.phases) {
    const lesson = phase.lessons.find(l => l.id === lessonId)
    if (lesson) return lesson
  }
  return null
}

export function getNextLesson(currentLessonId: string) {
  for (let i = 0; i < curriculum.phases.length; i++) {
    const phase = curriculum.phases[i]
    const lessonIndex = phase.lessons.findIndex(l => l.id === currentLessonId)
    
    if (lessonIndex !== -1) {
      // Found current lesson, return next lesson in same phase or first lesson of next phase
      if (lessonIndex < phase.lessons.length - 1) {
        return phase.lessons[lessonIndex + 1]
      } else if (i < curriculum.phases.length - 1) {
        return curriculum.phases[i + 1].lessons[0]
      }
    }
  }
  return null
}
