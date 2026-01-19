/**
 * Image Manifest - Centralized registry of all cached images
 *
 * Image Strategy:
 * - All repeatable content uses pre-cached images from /public/images/
 * - Only user-created custom buttons use dynamic AI generation
 * - All images follow Studio Ghibli anime style: soft lighting, warm colors, highly detailed
 */

// Base path for cached images
const IMAGE_BASE = '/images'

/**
 * Story Mode - Interactive stories with 3 panels each
 * Path: /public/images/story-mode/
 */
export const STORY_MODE_IMAGES = {
  // Story thumbnails (story selection screen)
  thumbnails: {
    'kenji-drink': `${IMAGE_BASE}/story-mode/kenji-drink-thumb.jpg`,
    'brave-helper': `${IMAGE_BASE}/story-mode/brave-helper-thumb.jpg`,
    'ice-cream-wait': `${IMAGE_BASE}/story-mode/ice-cream-wait-thumb.jpg`,
    'making-friend': `${IMAGE_BASE}/story-mode/making-friend-thumb.jpg`,
  },

  // Story panels (3 per story)
  panels: {
    'kenji-drink': [
      `${IMAGE_BASE}/story-mode/kenji-drink-panel-1.jpg`, // Playing outside, thirsty
      `${IMAGE_BASE}/story-mode/kenji-drink-panel-2.jpg`, // Mom giving water
      `${IMAGE_BASE}/story-mode/kenji-drink-panel-3.jpg`, // Drinking happily
    ],
    'brave-helper': [
      `${IMAGE_BASE}/story-mode/brave-helper-panel-1.jpg`, // Stuck on puzzle
      `${IMAGE_BASE}/story-mode/brave-helper-panel-2.jpg`, // Dad helping
      `${IMAGE_BASE}/story-mode/brave-helper-panel-3.jpg`, // High-five completion
    ],
    'ice-cream-wait': [
      `${IMAGE_BASE}/story-mode/ice-cream-wait-panel-1.jpg`, // In line at shop
      `${IMAGE_BASE}/story-mode/ice-cream-wait-panel-2.jpg`, // Waiting patiently
      `${IMAGE_BASE}/story-mode/ice-cream-wait-panel-3.jpg`, // Enjoying ice cream
    ],
    'making-friend': [
      `${IMAGE_BASE}/story-mode/making-friend-panel-1.jpg`, // Watching kids play
      `${IMAGE_BASE}/story-mode/making-friend-panel-2.jpg`, // Invited to play
      `${IMAGE_BASE}/story-mode/making-friend-panel-3.jpg`, // Playing together
    ],
  },
} as const

/**
 * Practice Mode - 5 communication scenarios
 * Path: /public/images/practice/
 */
export const PRACTICE_IMAGES = {
  scenarios: [
    {
      id: 'thirsty',
      image: `${IMAGE_BASE}/practice/scenario-thirsty.jpg`,
      prompt: "You're thirsty. What do you say?",
      correct: 'DRINK',
    },
    {
      id: 'stop',
      image: `${IMAGE_BASE}/practice/scenario-stop.jpg`,
      prompt: "You want to stop doing something. What do you say?",
      correct: 'STOP',
    },
    {
      id: 'hungry',
      image: `${IMAGE_BASE}/practice/scenario-hungry.jpg`,
      prompt: "You're hungry. What do you say?",
      correct: 'EAT',
    },
    {
      id: 'help',
      image: `${IMAGE_BASE}/practice/scenario-help.jpg`,
      prompt: "You need assistance. What do you say?",
      correct: 'HELP',
    },
    {
      id: 'more',
      image: `${IMAGE_BASE}/practice/scenario-more.jpg`,
      prompt: "You want more of something. What do you say?",
      correct: 'MORE',
    },
  ],
} as const

/**
 * Stories/Watch Feature - Pre-generated story slideshows
 * Path: /public/images/stories/
 */
export const STORIES_IMAGES = {
  // Pre-defined story scenarios (5 scenes each)
  scenarios: {
    dentist: {
      thumbnail: `${IMAGE_BASE}/stories/dentist-thumb.jpg`,
      scenes: [
        `${IMAGE_BASE}/stories/dentist-scene-1.jpg`,
        `${IMAGE_BASE}/stories/dentist-scene-2.jpg`,
        `${IMAGE_BASE}/stories/dentist-scene-3.jpg`,
        `${IMAGE_BASE}/stories/dentist-scene-4.jpg`,
        `${IMAGE_BASE}/stories/dentist-scene-5.jpg`,
      ],
    },
    doctor: {
      thumbnail: `${IMAGE_BASE}/stories/doctor-thumb.jpg`,
      scenes: [
        `${IMAGE_BASE}/stories/doctor-scene-1.jpg`,
        `${IMAGE_BASE}/stories/doctor-scene-2.jpg`,
        `${IMAGE_BASE}/stories/doctor-scene-3.jpg`,
        `${IMAGE_BASE}/stories/doctor-scene-4.jpg`,
        `${IMAGE_BASE}/stories/doctor-scene-5.jpg`,
      ],
    },
    school: {
      thumbnail: `${IMAGE_BASE}/stories/school-thumb.jpg`,
      scenes: [
        `${IMAGE_BASE}/stories/school-scene-1.jpg`,
        `${IMAGE_BASE}/stories/school-scene-2.jpg`,
        `${IMAGE_BASE}/stories/school-scene-3.jpg`,
        `${IMAGE_BASE}/stories/school-scene-4.jpg`,
        `${IMAGE_BASE}/stories/school-scene-5.jpg`,
      ],
    },
    playground: {
      thumbnail: `${IMAGE_BASE}/stories/playground-thumb.jpg`,
      scenes: [
        `${IMAGE_BASE}/stories/playground-scene-1.jpg`,
        `${IMAGE_BASE}/stories/playground-scene-2.jpg`,
        `${IMAGE_BASE}/stories/playground-scene-3.jpg`,
        `${IMAGE_BASE}/stories/playground-scene-4.jpg`,
        `${IMAGE_BASE}/stories/playground-scene-5.jpg`,
      ],
    },
    birthday: {
      thumbnail: `${IMAGE_BASE}/stories/birthday-thumb.jpg`,
      scenes: [
        `${IMAGE_BASE}/stories/birthday-scene-1.jpg`,
        `${IMAGE_BASE}/stories/birthday-scene-2.jpg`,
        `${IMAGE_BASE}/stories/birthday-scene-3.jpg`,
        `${IMAGE_BASE}/stories/birthday-scene-4.jpg`,
        `${IMAGE_BASE}/stories/birthday-scene-5.jpg`,
      ],
    },
    bedtime: {
      thumbnail: `${IMAGE_BASE}/stories/bedtime-thumb.jpg`,
      scenes: [
        `${IMAGE_BASE}/stories/bedtime-scene-1.jpg`,
        `${IMAGE_BASE}/stories/bedtime-scene-2.jpg`,
        `${IMAGE_BASE}/stories/bedtime-scene-3.jpg`,
        `${IMAGE_BASE}/stories/bedtime-scene-4.jpg`,
        `${IMAGE_BASE}/stories/bedtime-scene-5.jpg`,
      ],
    },
    mealtime: {
      thumbnail: `${IMAGE_BASE}/stories/mealtime-thumb.jpg`,
      scenes: [
        `${IMAGE_BASE}/stories/mealtime-scene-1.jpg`,
        `${IMAGE_BASE}/stories/mealtime-scene-2.jpg`,
        `${IMAGE_BASE}/stories/mealtime-scene-3.jpg`,
        `${IMAGE_BASE}/stories/mealtime-scene-4.jpg`,
        `${IMAGE_BASE}/stories/mealtime-scene-5.jpg`,
      ],
    },
    'feelings-overwhelmed': {
      thumbnail: `${IMAGE_BASE}/stories/feelings-overwhelmed-thumb.jpg`,
      scenes: [
        `${IMAGE_BASE}/stories/feelings-overwhelmed-scene-1.jpg`,
        `${IMAGE_BASE}/stories/feelings-overwhelmed-scene-2.jpg`,
        `${IMAGE_BASE}/stories/feelings-overwhelmed-scene-3.jpg`,
        `${IMAGE_BASE}/stories/feelings-overwhelmed-scene-4.jpg`,
        `${IMAGE_BASE}/stories/feelings-overwhelmed-scene-5.jpg`,
      ],
    },
  },
} as const

/**
 * Literacy Drills - Visual aids for phonics instruction
 * Path: /public/images/literacy/
 */
export const LITERACY_IMAGES = {
  // Letter cards for visual drills
  letters: {
    // These would be stylized letter cards in Ghibli style
    // Currently literacy drills don't use images, but this is reserved
  },

  // CVC word illustrations
  words: {
    // Reserved for illustrated vocabulary words
  },
} as const

/**
 * Communicate/Talk Mode - Default AAC button images
 * Path: /public/images/communicate/
 *
 * NOTE: Only pre-cache images for DEFAULT buttons.
 * User-created CUSTOM buttons use dynamic AI generation.
 */
export const COMMUNICATE_IMAGES = {
  // Core communication buttons (most frequently used)
  buttons: {
    hi: `${IMAGE_BASE}/communicate/hi.jpg`,
    bye: `${IMAGE_BASE}/communicate/bye.jpg`,
    yes: `${IMAGE_BASE}/communicate/yes.jpg`,
    no: `${IMAGE_BASE}/communicate/no.jpg`,
    help: `${IMAGE_BASE}/communicate/help.jpg`,
    stop: `${IMAGE_BASE}/communicate/stop.jpg`,
    more: `${IMAGE_BASE}/communicate/more.jpg`,
    wait: `${IMAGE_BASE}/communicate/wait.jpg`,
    'all-done': `${IMAGE_BASE}/communicate/all-done.jpg`,
    please: `${IMAGE_BASE}/communicate/please.jpg`,
    'thank-you': `${IMAGE_BASE}/communicate/thank-you.jpg`,
    sorry: `${IMAGE_BASE}/communicate/sorry.jpg`,

    // Feelings
    happy: `${IMAGE_BASE}/communicate/happy.jpg`,
    sad: `${IMAGE_BASE}/communicate/sad.jpg`,
    angry: `${IMAGE_BASE}/communicate/angry.jpg`,
    scared: `${IMAGE_BASE}/communicate/scared.jpg`,
    tired: `${IMAGE_BASE}/communicate/tired.jpg`,
    excited: `${IMAGE_BASE}/communicate/excited.jpg`,

    // Needs
    hungry: `${IMAGE_BASE}/communicate/hungry.jpg`,
    thirsty: `${IMAGE_BASE}/communicate/thirsty.jpg`,
    bathroom: `${IMAGE_BASE}/communicate/bathroom.jpg`,
    hurt: `${IMAGE_BASE}/communicate/hurt.jpg`,

    // Actions
    play: `${IMAGE_BASE}/communicate/play.jpg`,
    eat: `${IMAGE_BASE}/communicate/eat.jpg`,
    drink: `${IMAGE_BASE}/communicate/drink.jpg`,
    sleep: `${IMAGE_BASE}/communicate/sleep.jpg`,
    go: `${IMAGE_BASE}/communicate/go.jpg`,
    look: `${IMAGE_BASE}/communicate/look.jpg`,

    // Questions
    what: `${IMAGE_BASE}/communicate/what.jpg`,
    where: `${IMAGE_BASE}/communicate/where.jpg`,
    when: `${IMAGE_BASE}/communicate/when.jpg`,
    why: `${IMAGE_BASE}/communicate/why.jpg`,
    who: `${IMAGE_BASE}/communicate/who.jpg`,
  },
} as const

/**
 * Placeholder images for loading states
 */
export const PLACEHOLDER_IMAGES = {
  blur: `${IMAGE_BASE}/placeholder-blur.jpg`, // Tiny blurred placeholder
  loading: `${IMAGE_BASE}/placeholder-loading.jpg`, // Loading state image
  error: `${IMAGE_BASE}/placeholder-error.jpg`, // Error state image
  default: '/placeholder.svg', // Default fallback
} as const

/**
 * Get all images that should be preloaded for a specific route
 */
export function getPreloadImagesForRoute(route: string): string[] {
  switch (route) {
    case '/story-mode':
      return Object.values(STORY_MODE_IMAGES.thumbnails)

    case '/practice':
      return PRACTICE_IMAGES.scenarios.map(s => s.image)

    case '/stories':
      return Object.values(STORIES_IMAGES.scenarios).map(s => s.thumbnail)

    case '/communicate':
      // Preload most common buttons
      return [
        COMMUNICATE_IMAGES.buttons.hi,
        COMMUNICATE_IMAGES.buttons.help,
        COMMUNICATE_IMAGES.buttons.yes,
        COMMUNICATE_IMAGES.buttons.no,
        COMMUNICATE_IMAGES.buttons.more,
        COMMUNICATE_IMAGES.buttons.stop,
      ]

    default:
      return []
  }
}

/**
 * Check if a button should use cached image or dynamic generation
 */
export function shouldUseCachedImage(buttonId: string): boolean {
  return buttonId in COMMUNICATE_IMAGES.buttons
}

/**
 * Get cached image path for a communicate button
 */
export function getCommunicateButtonImage(buttonId: string): string | null {
  const key = buttonId.toLowerCase().replace(/\s+/g, '-')
  return (COMMUNICATE_IMAGES.buttons as Record<string, string>)[key] || null
}

/**
 * Cached story scenarios with images and narrations
 * These are fully pre-generated stories that don't need API calls
 */
export const CACHED_STORY_SCENARIOS: Record<string, {
  images: string[]
  narrations: string[]
}> = {
  dentist: {
    images: STORIES_IMAGES.scenarios.dentist.scenes,
    narrations: [
      "Today you're going to the dentist. The dentist helps keep your teeth healthy and strong.",
      "First, you sit in a special chair that can go up and down. The dentist wears gloves and a mask.",
      "The dentist uses a tiny mirror to look at your teeth. It doesn't hurt at all.",
      "Then they might clean your teeth with a special brush that tickles a little bit.",
      "All done! The dentist gives you a sticker and says great job! Your teeth are so clean and healthy.",
    ],
  },
  doctor: {
    images: STORIES_IMAGES.scenarios.doctor.scenes,
    narrations: [
      "Today you're visiting the doctor. Doctors help us stay healthy and feel better when we're sick.",
      "First, the nurse might measure how tall you are and check your weight on a scale.",
      "The doctor will listen to your heart with a stethoscope. It feels a little cold but doesn't hurt.",
      "The doctor might look in your ears and throat with a special light.",
      "All done! You did great! The doctor says you're healthy and strong.",
    ],
  },
  school: {
    images: STORIES_IMAGES.scenarios.school.scenes,
    narrations: [
      "It's time to go to school! School is a place where you learn new things and see friends.",
      "You can hang up your backpack and find your seat. Your teacher will say good morning.",
      "At school, you might learn letters, numbers, and fun songs. You can raise your hand to talk.",
      "When it's break time, you can play with friends on the playground or have a snack.",
      "At the end of the day, you pack up and your family comes to pick you up. What a great day!",
    ],
  },
  playground: {
    images: STORIES_IMAGES.scenarios.playground.scenes,
    narrations: [
      "You're going to the playground today! The playground is so much fun.",
      "You can climb on the jungle gym. Hold on tight with both hands.",
      "The swings go up high in the air. Pump your legs to go higher!",
      "You can slide down the slide. Weee! That was fast!",
      "Time to go home now. You had so much fun at the playground today!",
    ],
  },
  birthday: {
    images: STORIES_IMAGES.scenarios.birthday.scenes,
    narrations: [
      "Today is a birthday party! There are balloons and decorations everywhere.",
      "Your friends are here to celebrate. Everyone is happy and excited.",
      "It's time to sing Happy Birthday and make a wish before blowing out the candles.",
      "Now it's time for cake! What's your favorite flavor? Chocolate or vanilla?",
      "What a wonderful party! You can say thank you to everyone for coming.",
    ],
  },
  bedtime: {
    images: STORIES_IMAGES.scenarios.bedtime.scenes,
    narrations: [
      "It's getting late and the sky is getting dark. That means it's almost bedtime.",
      "First, you take a bath and put on your cozy pajamas.",
      "Then it's time to brush your teeth. Brush, brush, brush all around.",
      "You can pick a story to read before bed. Snuggle up with your favorite stuffed animal.",
      "Now close your eyes and dream sweet dreams. Goodnight! See you in the morning.",
    ],
  },
  mealtime: {
    images: STORIES_IMAGES.scenarios.mealtime.scenes,
    narrations: [
      "It's time to eat! Mealtime is when we sit together and enjoy our food.",
      "First, wash your hands to get them nice and clean.",
      "Sit down at the table. What delicious food do you see on your plate?",
      "Use your fork or spoon to eat. Take small bites and chew your food well.",
      "All done eating! You can say 'I'm finished' or 'May I be excused please?'",
    ],
  },
  'feelings-overwhelmed': {
    images: STORIES_IMAGES.scenarios['feelings-overwhelmed'].scenes,
    narrations: [
      "Sometimes things feel like too much. Your body might feel tense or upset.",
      "When you feel overwhelmed, it helps to take deep breaths. Breathe in slowly... and out.",
      "You can find a quiet spot to calm down. Maybe sit somewhere comfortable.",
      "It's okay to ask for help. You can say 'I need a break' or 'This is too much.'",
      "After resting, you'll start to feel better. You did a great job calming down!",
    ],
  },
}
