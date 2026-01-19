/**
 * Image Manifest Generator for InnerVoice
 *
 * Generates a comprehensive JSON manifest of all images needed for the app.
 * Each image includes:
 * - filename
 * - description for AI generation prompt
 * - dimensions needed
 * - Ghibli style specifications
 *
 * Usage: npx ts-node scripts/generate-image-list.ts
 */

interface ImageSpec {
  filename: string
  path: string
  description: string
  aiPrompt: string
  width: number
  height: number
  category: string
  priority: 'high' | 'medium' | 'low'
}

const GHIBLI_STYLE = `Studio Ghibli anime style, soft watercolor lighting, warm pastel colors,
gentle expressions, highly detailed background, peaceful atmosphere,
hand-drawn aesthetic, no text or words in image`

const DIMENSIONS = {
  thumbnail: { width: 400, height: 300 },
  panel: { width: 1024, height: 768 },
  card: { width: 512, height: 512 },
  icon: { width: 256, height: 256 },
  scene: { width: 1280, height: 720 },
}

// ============================================
// STORIES IMAGES (Watch feature)
// ============================================
const storiesImages: ImageSpec[] = [
  // Doctor Visit Story (5 scenes)
  {
    filename: 'doctor-visit-1.jpg',
    path: '/images/stories/doctor-visit/',
    description: 'Child arriving at doctor office with parent',
    aiPrompt: `A young child holding their parent's hand, walking into a friendly pediatric doctor's office.
      Colorful waiting room visible with toys. Child looks curious but slightly nervous. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.scene,
    category: 'stories',
    priority: 'high',
  },
  {
    filename: 'doctor-visit-2.jpg',
    path: '/images/stories/doctor-visit/',
    description: 'Nurse measuring child height',
    aiPrompt: `A kind nurse in colorful scrubs measuring a child's height against a wall chart with fun animal markers.
      Child standing straight and proud. Warm medical office setting. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.scene,
    category: 'stories',
    priority: 'high',
  },
  {
    filename: 'doctor-visit-3.jpg',
    path: '/images/stories/doctor-visit/',
    description: 'Doctor listening to heartbeat',
    aiPrompt: `A friendly doctor with a stethoscope listening to a child's heartbeat.
      Child sitting on examination table, looking curious. Doctor has warm, reassuring smile. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.scene,
    category: 'stories',
    priority: 'high',
  },
  {
    filename: 'doctor-visit-4.jpg',
    path: '/images/stories/doctor-visit/',
    description: 'Doctor looking in ears',
    aiPrompt: `Doctor using an otoscope to look in a child's ear. Child sitting calmly, parent nearby for comfort.
      Bright, cheerful examination room. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.scene,
    category: 'stories',
    priority: 'high',
  },
  {
    filename: 'doctor-visit-5.jpg',
    path: '/images/stories/doctor-visit/',
    description: 'Child getting sticker reward',
    aiPrompt: `Happy child receiving a colorful sticker from the doctor. Child beaming with pride.
      Parent smiling in background. Celebration of being brave. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.scene,
    category: 'stories',
    priority: 'high',
  },

  // Birthday Party Story (5 scenes)
  {
    filename: 'birthday-party-1.jpg',
    path: '/images/stories/birthday-party/',
    description: 'Arriving at birthday party',
    aiPrompt: `Child arriving at a birthday party, holding a wrapped gift. Colorful balloons and decorations visible.
      Other children playing in background. Excited expression. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.scene,
    category: 'stories',
    priority: 'high',
  },
  {
    filename: 'birthday-party-2.jpg',
    path: '/images/stories/birthday-party/',
    description: 'Playing party games',
    aiPrompt: `Children playing party games together, laughing and having fun.
      Musical chairs or pin the tail on the donkey visible. Festive decorations. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.scene,
    category: 'stories',
    priority: 'high',
  },
  {
    filename: 'birthday-party-3.jpg',
    path: '/images/stories/birthday-party/',
    description: 'Singing happy birthday',
    aiPrompt: `Children gathered around a birthday cake with lit candles, singing happy birthday.
      Birthday child in center, about to make a wish. Joyful atmosphere. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.scene,
    category: 'stories',
    priority: 'high',
  },
  {
    filename: 'birthday-party-4.jpg',
    path: '/images/stories/birthday-party/',
    description: 'Eating cake and ice cream',
    aiPrompt: `Children sitting at a decorated table, eating colorful birthday cake and ice cream.
      Happy faces, party hats visible. Messy but joyful eating. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.scene,
    category: 'stories',
    priority: 'high',
  },
  {
    filename: 'birthday-party-5.jpg',
    path: '/images/stories/birthday-party/',
    description: 'Opening presents',
    aiPrompt: `Birthday child opening presents surrounded by friends. Wrapping paper scattered around.
      Excited reactions from all children. Warm, celebratory scene. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.scene,
    category: 'stories',
    priority: 'high',
  },

  // Playground Story (5 scenes)
  {
    filename: 'playground-1.jpg',
    path: '/images/stories/playground/',
    description: 'Arriving at playground',
    aiPrompt: `Child approaching a colorful playground with swings, slides, and climbing structures.
      Sunny day, other children playing. Excited anticipation. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.scene,
    category: 'stories',
    priority: 'high',
  },
  {
    filename: 'playground-2.jpg',
    path: '/images/stories/playground/',
    description: 'Playing on swings',
    aiPrompt: `Child swinging high on a swing, hair flowing in the wind.
      Blue sky background, pure joy on face. Other playground equipment visible. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.scene,
    category: 'stories',
    priority: 'high',
  },
  {
    filename: 'playground-3.jpg',
    path: '/images/stories/playground/',
    description: 'Going down slide',
    aiPrompt: `Child sliding down a colorful slide with arms up, laughing.
      Bright playground setting, soft landing area at bottom. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.scene,
    category: 'stories',
    priority: 'high',
  },
  {
    filename: 'playground-4.jpg',
    path: '/images/stories/playground/',
    description: 'Making a friend',
    aiPrompt: `Two children meeting at the sandbox, one offering to share toys.
      Friendly introduction moment, building sandcastle together. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.scene,
    category: 'stories',
    priority: 'high',
  },
  {
    filename: 'playground-5.jpg',
    path: '/images/stories/playground/',
    description: 'Saying goodbye to new friend',
    aiPrompt: `Child waving goodbye to new playground friend, both smiling.
      Parents in background, sunset lighting. Promise to play again. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.scene,
    category: 'stories',
    priority: 'high',
  },

  // Grocery Store Story (5 scenes)
  {
    filename: 'grocery-store-1.jpg',
    path: '/images/stories/grocery-store/',
    description: 'Entering grocery store',
    aiPrompt: `Child walking into a grocery store with parent, getting a shopping cart.
      Bright, colorful produce section visible ahead. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.scene,
    category: 'stories',
    priority: 'high',
  },
  {
    filename: 'grocery-store-2.jpg',
    path: '/images/stories/grocery-store/',
    description: 'Picking fruits',
    aiPrompt: `Child reaching for colorful apples in the produce section, parent helping.
      Various fruits and vegetables beautifully displayed. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.scene,
    category: 'stories',
    priority: 'high',
  },
  {
    filename: 'grocery-store-3.jpg',
    path: '/images/stories/grocery-store/',
    description: 'Helping with groceries',
    aiPrompt: `Child putting items in the shopping cart, being a helpful shopper.
      Cereal aisle or snack section visible. Feeling proud. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.scene,
    category: 'stories',
    priority: 'high',
  },
  {
    filename: 'grocery-store-4.jpg',
    path: '/images/stories/grocery-store/',
    description: 'Waiting in line',
    aiPrompt: `Child waiting patiently in checkout line with parent.
      Looking at items, being patient. Cashier visible ahead. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.scene,
    category: 'stories',
    priority: 'high',
  },
  {
    filename: 'grocery-store-5.jpg',
    path: '/images/stories/grocery-store/',
    description: 'Carrying bags to car',
    aiPrompt: `Child proudly carrying a small grocery bag to the car.
      Parking lot setting, parent with other bags. Successful shopping trip. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.scene,
    category: 'stories',
    priority: 'high',
  },
]

// ============================================
// PRACTICE IMAGES
// ============================================
const practiceImages: ImageSpec[] = [
  {
    filename: 'thirsty.jpg',
    path: '/images/practice/',
    description: 'Child feeling thirsty',
    aiPrompt: `Young child looking thirsty, touching throat, looking at a glass of water.
      Hot day feeling, longing expression. Kitchen or outdoor setting. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'practice',
    priority: 'high',
  },
  {
    filename: 'hungry.jpg',
    path: '/images/practice/',
    description: 'Child feeling hungry',
    aiPrompt: `Young child holding stomach, looking at food on the table with hungry expression.
      Kitchen setting, meal time atmosphere. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'practice',
    priority: 'high',
  },
  {
    filename: 'help.jpg',
    path: '/images/practice/',
    description: 'Child needing help',
    aiPrompt: `Young child struggling with a task, reaching up for help.
      Could be trying to reach something high or working on a puzzle. Requesting assistance. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'practice',
    priority: 'high',
  },
  {
    filename: 'bathroom.jpg',
    path: '/images/practice/',
    description: 'Child needs bathroom',
    aiPrompt: `Young child doing the "potty dance", crossing legs, looking urgent but appropriate.
      Near a hallway or door. Needs to use the bathroom. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'practice',
    priority: 'high',
  },
  {
    filename: 'tired.jpg',
    path: '/images/practice/',
    description: 'Child feeling tired',
    aiPrompt: `Young child yawning, rubbing eyes, looking sleepy.
      Cozy room setting, evening atmosphere. Ready for rest. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'practice',
    priority: 'high',
  },
  {
    filename: 'stop.jpg',
    path: '/images/practice/',
    description: 'Child wanting to stop',
    aiPrompt: `Young child holding up hand in stop gesture, clear boundaries expression.
      Calm but firm. Communicating need to stop an activity. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'practice',
    priority: 'high',
  },
  {
    filename: 'more.jpg',
    path: '/images/practice/',
    description: 'Child wanting more',
    aiPrompt: `Young child with empty plate, looking hopefully for more food.
      Dinner table setting, pointing to plate. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'practice',
    priority: 'high',
  },
]

// ============================================
// COMMUNICATE IMAGES
// ============================================
const communicateImages: ImageSpec[] = [
  // Greetings
  {
    filename: 'hi.jpg',
    path: '/images/communicate/greetings/',
    description: 'Saying hi/hello',
    aiPrompt: `Young child waving hello with a big friendly smile.
      Open, welcoming gesture. Meeting someone new. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'communicate',
    priority: 'high',
  },
  {
    filename: 'bye.jpg',
    path: '/images/communicate/greetings/',
    description: 'Saying goodbye',
    aiPrompt: `Young child waving goodbye, slightly sad but understanding expression.
      Farewell moment, other person walking away. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'communicate',
    priority: 'high',
  },
  {
    filename: 'good-morning.jpg',
    path: '/images/communicate/greetings/',
    description: 'Good morning greeting',
    aiPrompt: `Young child stretching and yawning in bed, morning sunlight through window.
      Fresh start to the day, cozy bedroom. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'communicate',
    priority: 'medium',
  },
  {
    filename: 'good-night.jpg',
    path: '/images/communicate/greetings/',
    description: 'Good night greeting',
    aiPrompt: `Young child in pajamas, hugging stuffed animal, ready for bed.
      Moon visible through window, peaceful bedtime. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'communicate',
    priority: 'medium',
  },

  // Feelings
  {
    filename: 'happy.jpg',
    path: '/images/communicate/feelings/',
    description: 'Feeling happy',
    aiPrompt: `Young child with huge joyful smile, arms spread wide in happiness.
      Bright, sunny atmosphere. Pure joy. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'communicate',
    priority: 'high',
  },
  {
    filename: 'sad.jpg',
    path: '/images/communicate/feelings/',
    description: 'Feeling sad',
    aiPrompt: `Young child with tears in eyes, downcast expression.
      Soft, empathetic scene. Acknowledging sadness. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'communicate',
    priority: 'high',
  },
  {
    filename: 'angry.jpg',
    path: '/images/communicate/feelings/',
    description: 'Feeling angry',
    aiPrompt: `Young child with frustrated expression, furrowed brow, arms crossed.
      Not scary, just showing anger is okay. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'communicate',
    priority: 'high',
  },
  {
    filename: 'scared.jpg',
    path: '/images/communicate/feelings/',
    description: 'Feeling scared',
    aiPrompt: `Young child looking scared, hiding behind something, wide eyes.
      Not terrifying, just expressing fear. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'communicate',
    priority: 'high',
  },
  {
    filename: 'excited.jpg',
    path: '/images/communicate/feelings/',
    description: 'Feeling excited',
    aiPrompt: `Young child jumping up with excitement, hands in air, huge smile.
      Celebratory moment, anticipation. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'communicate',
    priority: 'high',
  },
  {
    filename: 'tired.jpg',
    path: '/images/communicate/feelings/',
    description: 'Feeling tired',
    aiPrompt: `Young child yawning widely, eyes half closed, slouching.
      Need for rest clearly shown. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'communicate',
    priority: 'high',
  },

  // Needs
  {
    filename: 'hungry.jpg',
    path: '/images/communicate/needs/',
    description: 'Feeling hungry',
    aiPrompt: `Young child rubbing tummy, looking at food longingly.
      Kitchen setting, empty plate nearby. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'communicate',
    priority: 'high',
  },
  {
    filename: 'thirsty.jpg',
    path: '/images/communicate/needs/',
    description: 'Feeling thirsty',
    aiPrompt: `Young child pointing to throat, looking at water bottle.
      Clear need for a drink. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'communicate',
    priority: 'high',
  },
  {
    filename: 'bathroom.jpg',
    path: '/images/communicate/needs/',
    description: 'Need bathroom',
    aiPrompt: `Young child doing small dance, hands near body, urgent expression.
      Need to use bathroom clearly shown. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'communicate',
    priority: 'high',
  },
  {
    filename: 'hurt.jpg',
    path: '/images/communicate/needs/',
    description: 'Feeling hurt',
    aiPrompt: `Young child holding knee or elbow, small scrape, tears forming.
      Need for comfort and care. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'communicate',
    priority: 'high',
  },

  // Responses
  {
    filename: 'yes.jpg',
    path: '/images/communicate/responses/',
    description: 'Saying yes',
    aiPrompt: `Young child nodding enthusiastically, thumbs up, agreeing expression.
      Clear affirmative response. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'communicate',
    priority: 'high',
  },
  {
    filename: 'no.jpg',
    path: '/images/communicate/responses/',
    description: 'Saying no',
    aiPrompt: `Young child shaking head gently, hands out in polite refusal.
      Not angry, just declining. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'communicate',
    priority: 'high',
  },
  {
    filename: 'please.jpg',
    path: '/images/communicate/responses/',
    description: 'Saying please',
    aiPrompt: `Young child with hands together in pleading gesture, hopeful expression.
      Polite request being made. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'communicate',
    priority: 'high',
  },
  {
    filename: 'thank-you.jpg',
    path: '/images/communicate/responses/',
    description: 'Saying thank you',
    aiPrompt: `Young child receiving something with grateful expression, small bow or smile.
      Gratitude clearly shown. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'communicate',
    priority: 'high',
  },
  {
    filename: 'sorry.jpg',
    path: '/images/communicate/responses/',
    description: 'Saying sorry',
    aiPrompt: `Young child with apologetic expression, looking down slightly, remorseful.
      Making amends. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'communicate',
    priority: 'high',
  },
  {
    filename: 'help.jpg',
    path: '/images/communicate/responses/',
    description: 'Asking for help',
    aiPrompt: `Young child reaching up toward adult, needing assistance.
      Clear request for help with a task. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'communicate',
    priority: 'high',
  },
  {
    filename: 'stop.jpg',
    path: '/images/communicate/responses/',
    description: 'Saying stop',
    aiPrompt: `Young child holding up hand in stop gesture, firm but calm expression.
      Setting a boundary. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'communicate',
    priority: 'high',
  },
  {
    filename: 'wait.jpg',
    path: '/images/communicate/responses/',
    description: 'Asking to wait',
    aiPrompt: `Young child with one finger up in "wait a moment" gesture.
      Patient, about to do something. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'communicate',
    priority: 'high',
  },
  {
    filename: 'more.jpg',
    path: '/images/communicate/responses/',
    description: 'Wanting more',
    aiPrompt: `Young child with empty bowl, looking hopefully for more.
      Hands together in "more" sign. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'communicate',
    priority: 'high',
  },
  {
    filename: 'all-done.jpg',
    path: '/images/communicate/responses/',
    description: 'All done/finished',
    aiPrompt: `Young child with hands raised showing palms out, "all done" gesture.
      Completed activity, satisfied expression. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'communicate',
    priority: 'high',
  },
]

// ============================================
// LITERACY IMAGES
// ============================================
const literacyImages: ImageSpec[] = []

// Letters (a-z)
const letters = 'abcdefghijklmnopqrstuvwxyz'.split('')
letters.forEach(letter => {
  literacyImages.push({
    filename: `letter-${letter}.jpg`,
    path: '/images/literacy/letters/',
    description: `Letter ${letter.toUpperCase()} illustration`,
    aiPrompt: `Beautiful illustration for the letter "${letter.toUpperCase()}".
      Shows a child-friendly object that starts with "${letter}" (like ${getWordForLetter(letter)}).
      Clean, educational, appealing to children. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'literacy',
    priority: 'medium',
  })
})

// Common CV syllables
const syllables = ['ba', 'da', 'ga', 'ka', 'la', 'ma', 'na', 'pa', 'ra', 'sa', 'ta', 'wa',
                   'be', 'de', 'ge', 'ke', 'le', 'me', 'ne', 'pe', 're', 'se', 'te', 'we',
                   'bi', 'di', 'gi', 'ki', 'li', 'mi', 'ni', 'pi', 'ri', 'si', 'ti', 'wi',
                   'bo', 'do', 'go', 'ko', 'lo', 'mo', 'no', 'po', 'ro', 'so', 'to', 'wo',
                   'bu', 'du', 'gu', 'ku', 'lu', 'mu', 'nu', 'pu', 'ru', 'su', 'tu', 'wu']
syllables.forEach(syllable => {
  literacyImages.push({
    filename: `syllable-${syllable}.jpg`,
    path: '/images/literacy/syllables/',
    description: `Syllable ${syllable.toUpperCase()} illustration`,
    aiPrompt: `Educational illustration showing the syllable "${syllable.toUpperCase()}"
      with a visual mnemonic. Child-friendly, memorable association. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'literacy',
    priority: 'low',
  })
})

// CVC words
const cvcWords = ['cat', 'bat', 'hat', 'mat', 'sat', 'rat', 'pat', 'fat',
                  'bed', 'red', 'fed', 'led', 'wed', 'pet', 'wet', 'set',
                  'big', 'pig', 'dig', 'wig', 'fig', 'jig', 'bit', 'sit',
                  'dog', 'log', 'fog', 'hog', 'jog', 'cot', 'dot', 'hot',
                  'bug', 'mug', 'rug', 'hug', 'jug', 'tug', 'cut', 'nut']
cvcWords.forEach(word => {
  literacyImages.push({
    filename: `cvc-${word}.jpg`,
    path: '/images/literacy/cvc-words/',
    description: `CVC word "${word}" illustration`,
    aiPrompt: `Clear illustration of a "${word}".
      Child learning to read this word. Educational, recognizable. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.card,
    category: 'literacy',
    priority: 'medium',
  })
})

// ============================================
// STORY MODE IMAGES
// ============================================
const storyModeImages: ImageSpec[] = [
  // Park Adventure (4 panels)
  {
    filename: 'park-1.jpg',
    path: '/images/story-mode/park-adventure/',
    description: 'Child arriving at park',
    aiPrompt: `Child walking into a beautiful park with parent, sunny day.
      Trees, flowers, playground equipment in distance. Excited anticipation. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.panel,
    category: 'story-mode',
    priority: 'high',
  },
  {
    filename: 'park-2.jpg',
    path: '/images/story-mode/park-adventure/',
    description: 'Playing on equipment',
    aiPrompt: `Child happily playing on playground equipment, climbing or swinging.
      Other children nearby, sunny atmosphere. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.panel,
    category: 'story-mode',
    priority: 'high',
  },
  {
    filename: 'park-3.jpg',
    path: '/images/story-mode/park-adventure/',
    description: 'Making choice at park',
    aiPrompt: `Child at decision point - slides or swings? Looking between two options.
      Thoughtful expression, both options visible. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.panel,
    category: 'story-mode',
    priority: 'high',
  },
  {
    filename: 'park-4.jpg',
    path: '/images/story-mode/park-adventure/',
    description: 'Happy ending at park',
    aiPrompt: `Child waving goodbye to park, happy from fun day.
      Sunset lighting, content expression. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.panel,
    category: 'story-mode',
    priority: 'high',
  },

  // Lunch Time (4 panels)
  {
    filename: 'lunch-1.jpg',
    path: '/images/story-mode/lunch-time/',
    description: 'Getting hungry for lunch',
    aiPrompt: `Child rubbing tummy, clock showing noon, kitchen background.
      Starting to feel hungry, anticipating lunch. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.panel,
    category: 'story-mode',
    priority: 'high',
  },
  {
    filename: 'lunch-2.jpg',
    path: '/images/story-mode/lunch-time/',
    description: 'Choosing what to eat',
    aiPrompt: `Child looking at lunch options - sandwich, fruit, vegetables.
      Decision moment, kitchen table setting. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.panel,
    category: 'story-mode',
    priority: 'high',
  },
  {
    filename: 'lunch-3.jpg',
    path: '/images/story-mode/lunch-time/',
    description: 'Eating lunch together',
    aiPrompt: `Child eating lunch at table, maybe with family member.
      Enjoying meal, conversation. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.panel,
    category: 'story-mode',
    priority: 'high',
  },
  {
    filename: 'lunch-4.jpg',
    path: '/images/story-mode/lunch-time/',
    description: 'Finishing lunch',
    aiPrompt: `Child with clean plate, satisfied expression.
      Saying thank you, ready for next activity. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.panel,
    category: 'story-mode',
    priority: 'high',
  },

  // Making Friends (4 panels)
  {
    filename: 'friends-1.jpg',
    path: '/images/story-mode/making-friends/',
    description: 'Seeing other kids',
    aiPrompt: `Child watching other children play from a distance, wanting to join.
      Park or school setting, hopeful expression. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.panel,
    category: 'story-mode',
    priority: 'high',
  },
  {
    filename: 'friends-2.jpg',
    path: '/images/story-mode/making-friends/',
    description: 'Deciding to say hi',
    aiPrompt: `Child taking brave step to approach other children.
      Building courage, friendly posture. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.panel,
    category: 'story-mode',
    priority: 'high',
  },
  {
    filename: 'friends-3.jpg',
    path: '/images/story-mode/making-friends/',
    description: 'Introducing self',
    aiPrompt: `Child waving and saying hi to other children who look welcoming.
      Introduction moment, friendly atmosphere. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.panel,
    category: 'story-mode',
    priority: 'high',
  },
  {
    filename: 'friends-4.jpg',
    path: '/images/story-mode/making-friends/',
    description: 'Playing together',
    aiPrompt: `Children playing together happily, including original child.
      New friendship formed, shared activity. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.panel,
    category: 'story-mode',
    priority: 'high',
  },

  // Bedtime (4 panels)
  {
    filename: 'bedtime-1.jpg',
    path: '/images/story-mode/bedtime/',
    description: 'Getting tired',
    aiPrompt: `Child yawning, evening setting, sun going down outside window.
      Day winding down, getting sleepy. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.panel,
    category: 'story-mode',
    priority: 'high',
  },
  {
    filename: 'bedtime-2.jpg',
    path: '/images/story-mode/bedtime/',
    description: 'Bedtime routine',
    aiPrompt: `Child brushing teeth in bathroom, pajamas on.
      Part of bedtime routine, bathroom setting. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.panel,
    category: 'story-mode',
    priority: 'high',
  },
  {
    filename: 'bedtime-3.jpg',
    path: '/images/story-mode/bedtime/',
    description: 'Story time',
    aiPrompt: `Parent reading bedtime story to child in bed.
      Cozy bedroom, warm lighting, stuffed animals. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.panel,
    category: 'story-mode',
    priority: 'high',
  },
  {
    filename: 'bedtime-4.jpg',
    path: '/images/story-mode/bedtime/',
    description: 'Goodnight',
    aiPrompt: `Child tucked in bed, eyes closing, peaceful expression.
      Night sky through window, dream-like atmosphere. ${GHIBLI_STYLE}`,
    ...DIMENSIONS.panel,
    category: 'story-mode',
    priority: 'high',
  },
]

// Helper function for letter illustrations
function getWordForLetter(letter: string): string {
  const words: Record<string, string> = {
    a: 'apple', b: 'ball', c: 'cat', d: 'dog', e: 'elephant',
    f: 'fish', g: 'grape', h: 'house', i: 'ice cream', j: 'jellyfish',
    k: 'kite', l: 'lion', m: 'moon', n: 'nest', o: 'orange',
    p: 'penguin', q: 'queen', r: 'rainbow', s: 'sun', t: 'tree',
    u: 'umbrella', v: 'violin', w: 'watermelon', x: 'xylophone', y: 'yarn', z: 'zebra'
  }
  return words[letter] || letter
}

// ============================================
// MAIN MANIFEST
// ============================================
const manifest = {
  generated: new Date().toISOString(),
  totalImages: 0,
  ghibliStyle: GHIBLI_STYLE,
  dimensions: DIMENSIONS,
  categories: {
    stories: storiesImages,
    practice: practiceImages,
    communicate: communicateImages,
    literacy: literacyImages,
    storyMode: storyModeImages,
  },
  all: [] as ImageSpec[],
}

// Combine all images
manifest.all = [
  ...storiesImages,
  ...practiceImages,
  ...communicateImages,
  ...literacyImages,
  ...storyModeImages,
]
manifest.totalImages = manifest.all.length

// Output
console.log(JSON.stringify(manifest, null, 2))

// Also output summary
console.error('\n=== IMAGE MANIFEST SUMMARY ===')
console.error(`Total images: ${manifest.totalImages}`)
console.error(`  - Stories: ${storiesImages.length}`)
console.error(`  - Practice: ${practiceImages.length}`)
console.error(`  - Communicate: ${communicateImages.length}`)
console.error(`  - Literacy: ${literacyImages.length}`)
console.error(`  - Story Mode: ${storyModeImages.length}`)
console.error(`\nHigh priority: ${manifest.all.filter(i => i.priority === 'high').length}`)
console.error(`Medium priority: ${manifest.all.filter(i => i.priority === 'medium').length}`)
console.error(`Low priority: ${manifest.all.filter(i => i.priority === 'low').length}`)
