import { fal } from "@fal-ai/client"
import { type NextRequest, NextResponse } from "next/server"

// Configure fal.ai
fal.config({
  credentials: process.env.FAL_KEY,
})

const HAND_INSTRUCTION = "All hands must be anatomically correct with exactly 5 fingers on each hand."

// Pre-defined story scenarios with image prompts for slideshow
const STORY_SCENARIOS: Record<
  string,
  {
    title: string
    description: string
    scenes: Array<{
      prompt: string
      narration: string
    }>
    buttons: Array<{ label: string; phrase: string }>
  }
> = {
  dentist: {
    title: "Going to the Dentist",
    description: "Learn what happens at the dentist and how to stay calm",
    scenes: [
      {
        prompt: `Warm cartoon illustration of a child and parent walking toward a friendly dental office building, sunny day, welcoming entrance with colorful door, Studio Ghibli style, soft pastel colors. ${HAND_INSTRUCTION}`,
        narration: "Today we're going to visit the dentist. The building looks friendly and welcoming!",
      },
      {
        prompt: `Warm cartoon illustration of a cozy dental waiting room, comfortable chairs, toys and books on a table, fish tank, friendly receptionist waving, child looking curious, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "First, we wait in the waiting room. There are fun things to look at while we wait.",
      },
      {
        prompt: `Warm cartoon illustration of a kind dentist with a gentle smile showing a child the special dental chair that goes up and down, bright clean room, child looking interested, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "The dentist shows us the special chair. It can go up and down like a ride!",
      },
      {
        prompt: `Warm cartoon illustration of dentist using a small mirror to look at child's teeth, child with mouth open looking calm, parent nearby, bright overhead light, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "The dentist uses a tiny mirror to count your teeth. It doesn't hurt at all!",
      },
      {
        prompt: `Warm cartoon illustration of happy child receiving a sticker and small toy from the smiling dentist, parent looking proud, celebration moment, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "All done! You were so brave! You might even get a sticker or small prize!",
      },
    ],
    buttons: [
      { label: "I'm nervous", phrase: "I'm feeling a little nervous" },
      { label: "What's that?", phrase: "What is that tool for?" },
      { label: "I need a break", phrase: "Can I take a break please?" },
      { label: "All done!", phrase: "I did it! All done!" },
    ],
  },
  doctor: {
    title: "Visiting the Doctor",
    description: "See what happens during a doctor visit",
    scenes: [
      {
        prompt: `Warm cartoon illustration of child and parent entering a bright friendly doctor's office, colorful walls with animal posters, kind nurse at reception, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "Today we're visiting the doctor. The office has friendly pictures on the walls.",
      },
      {
        prompt: `Warm cartoon illustration of nurse measuring child's height on a measuring chart, child standing tall and proud, parent watching with smile, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "First, the nurse measures how tall you've grown. Stand up straight and tall!",
      },
      {
        prompt: `Warm cartoon illustration of caring doctor with stethoscope listening to child's heart, child sitting on exam table looking calm, parent nearby, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "The doctor listens to your heart with a special tool. It feels a little cold but doesn't hurt.",
      },
      {
        prompt: `Warm cartoon illustration of doctor looking in child's ears with otoscope, child sitting still, bright examination room, gentle expression on doctor, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "The doctor looks in your ears. Just sit still for a moment!",
      },
      {
        prompt: `Warm cartoon illustration of happy child getting a high-five from the doctor, parent smiling, child looking proud and relieved, sunny doctor's office, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "All finished! The doctor says you're healthy and strong. Great job being so brave!",
      },
    ],
    buttons: [
      { label: "Does it hurt?", phrase: "Will this hurt?" },
      { label: "I'm brave", phrase: "I'm being very brave" },
      { label: "Almost done?", phrase: "Are we almost done?" },
      { label: "Thank you", phrase: "Thank you for helping me" },
    ],
  },
  school: {
    title: "Going to School",
    description: "What to expect on a school day",
    scenes: [
      {
        prompt: `Warm cartoon illustration of child waking up in cozy bedroom, morning sunlight through window, parent gently opening curtains, stuffed animals on bed, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "Time to wake up! It's a school day. The sun is shining and it's going to be a great day!",
      },
      {
        prompt: `Warm cartoon illustration of child eating breakfast at kitchen table, backpack ready by door, parent preparing lunch box, cheerful morning scene, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "Eat a good breakfast to have lots of energy. Your backpack is ready to go!",
      },
      {
        prompt: `Warm cartoon illustration of colorful school building with children walking toward entrance, friendly teacher waving at door, yellow school bus, bright sunny day, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "Here's the school! Other kids are arriving too. The teacher waves hello at the door.",
      },
      {
        prompt: `Warm cartoon illustration of classroom with children sitting at desks, teacher at board, colorful artwork on walls, child finding their seat, welcoming atmosphere, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "In the classroom, everyone finds their seat. The teacher is happy to see you!",
      },
      {
        prompt: `Warm cartoon illustration of children playing together on playground, swings and slides, child making friends, laughter and fun, sunny recess time, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "At recess, you can play with friends! School is a place to learn AND have fun!",
      },
    ],
    buttons: [
      { label: "Good morning", phrase: "Good morning everyone!" },
      { label: "Bye mom/dad", phrase: "Goodbye! See you later!" },
      { label: "I'm here", phrase: "I'm here and ready to learn" },
      { label: "Where do I go?", phrase: "Where should I go?" },
    ],
  },
  playground: {
    title: "Playing at the Playground",
    description: "How to play and make friends",
    scenes: [
      {
        prompt: `Warm cartoon illustration of sunny playground with slides, swings, climbing structure, children playing, parent on bench nearby, blue sky, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "The playground is a fun place with lots of things to do! Look at all the kids playing.",
      },
      {
        prompt: `Warm cartoon illustration of child watching other children play, standing nearby looking interested, friendly atmosphere, deciding what to do, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "Sometimes it's hard to know how to join in. It's okay to watch first.",
      },
      {
        prompt: `Warm cartoon illustration of child approaching another child, waving hello, friendly expressions, about to ask to play together, inclusive moment, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "You can walk up and say 'Hi! Can I play with you?' Most kids will say yes!",
      },
      {
        prompt: `Warm cartoon illustration of two children taking turns on a swing, one pushing the other, laughing and having fun, sharing the equipment, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "Taking turns is important. Push your friend, then they can push you!",
      },
      {
        prompt: `Warm cartoon illustration of group of children playing together happily, waving goodbye as it's time to leave, new friendships made, warm sunset colors, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "Playing together is the best! You made a new friend today!",
      },
    ],
    buttons: [
      { label: "Can I play?", phrase: "Can I play with you?" },
      { label: "Your turn", phrase: "It's your turn now" },
      { label: "Watch me!", phrase: "Watch what I can do!" },
      { label: "Let's share", phrase: "Let's share and take turns" },
    ],
  },
  birthday: {
    title: "Birthday Party",
    description: "What happens at a birthday party",
    scenes: [
      {
        prompt: `Warm cartoon illustration of decorated party room with balloons, streamers, wrapped presents on table, excited children arriving, festive atmosphere, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "It's a birthday party! Look at all the colorful decorations and balloons!",
      },
      {
        prompt: `Warm cartoon illustration of children playing party games, pin the tail on the donkey, musical chairs, laughing and having fun, birthday child happy, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "At parties, we play fun games together. Everyone gets a turn!",
      },
      {
        prompt: `Warm cartoon illustration of birthday cake with lit candles, children gathered around table, birthday child about to make a wish, excited faces, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "Here comes the cake! Everyone sings Happy Birthday, then the birthday child makes a wish!",
      },
      {
        prompt: `Warm cartoon illustration of children eating cake and ice cream, party hats on heads, sharing treats, joyful celebration, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "Yummy cake and ice cream for everyone! Remember to say please and thank you.",
      },
      {
        prompt: `Warm cartoon illustration of child saying goodbye at party, holding a goody bag, waving to birthday child and parents, happy memories, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "Time to go home! Say thank you for the fun party. What a great day!",
      },
    ],
    buttons: [
      { label: "Happy birthday!", phrase: "Happy birthday to you!" },
      { label: "Thank you", phrase: "Thank you for inviting me" },
      { label: "Can I have?", phrase: "Can I have some cake please?" },
      { label: "This is fun!", phrase: "This party is so fun!" },
    ],
  },
  bedtime: {
    title: "Bedtime Routine",
    description: "Getting ready for a good night's sleep",
    scenes: [
      {
        prompt: `Warm cartoon illustration of evening scene, sun setting outside window, parent telling child it's almost bedtime, cozy living room, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "The sun is going down. It's almost time to get ready for bed.",
      },
      {
        prompt: `Warm cartoon illustration of child in bathroom brushing teeth, looking in mirror, parent helping, toothbrush and toothpaste, clean and fresh, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "First, we brush our teeth until they're nice and clean. Brush brush brush!",
      },
      {
        prompt: `Warm cartoon illustration of child in cozy pajamas, picking out a bedtime story book, bookshelf with many books, excited to read, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "Put on your comfy pajamas and pick out a story. Which book looks good tonight?",
      },
      {
        prompt: `Warm cartoon illustration of parent reading bedtime story to child in bed, soft lamp light, stuffed animals around, peaceful and cozy room, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "Snuggle up for story time. The story takes you on an adventure!",
      },
      {
        prompt: `Warm cartoon illustration of child peacefully sleeping in bed, moonlight through window, parent giving gentle kiss goodnight, stars visible, dreamy atmosphere, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "Goodnight! Time for sweet dreams. You did such a great job today.",
      },
    ],
    buttons: [
      { label: "Goodnight", phrase: "Goodnight, I love you" },
      { label: "One more story", phrase: "Can I have one more story?" },
      { label: "I'm sleepy", phrase: "I'm feeling sleepy now" },
      { label: "Stay with me", phrase: "Can you stay with me?" },
    ],
  },
  mealtime: {
    title: "Eating Together",
    description: "Family mealtime routines",
    scenes: [
      {
        prompt: `Warm cartoon illustration of family kitchen, parent cooking at stove, delicious smells, child setting table with plates and utensils, teamwork, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "Dinner is cooking! You can help by setting the table. Put a plate at each seat!",
      },
      {
        prompt: `Warm cartoon illustration of family sitting down together at dinner table, colorful healthy food served, everyone smiling, about to eat, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "Everyone sits together. Look at all the yummy food! Wait until everyone is ready.",
      },
      {
        prompt: `Warm cartoon illustration of child eating with fork and spoon properly, taking small bites, parent modeling good manners, pleasant conversation, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "Use your fork and spoon. Take small bites and chew with your mouth closed.",
      },
      {
        prompt: `Warm cartoon illustration of child trying a new food, curious expression, parent encouraging, small taste on plate, being brave, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "Sometimes there's new food to try. Just take a small taste - you might like it!",
      },
      {
        prompt: `Warm cartoon illustration of family finished eating, child asking to be excused, clean plates, satisfied expressions, warm family moment, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "All done! You can ask 'May I be excused?' Great job eating your dinner!",
      },
    ],
    buttons: [
      { label: "More please", phrase: "Can I have more please?" },
      { label: "All done", phrase: "I'm all done eating" },
      { label: "Yummy!", phrase: "This is yummy!" },
      { label: "May I be excused?", phrase: "May I be excused from the table?" },
    ],
  },
  "feelings-overwhelmed": {
    title: "Feeling Overwhelmed",
    description: "What to do when everything feels like too much",
    scenes: [
      {
        prompt: `Warm cartoon illustration of child looking overwhelmed in a busy environment, hands over ears, too much noise and activity around, empathetic portrayal, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "Sometimes things feel like too much. It's okay to feel this way.",
      },
      {
        prompt: `Warm cartoon illustration of caring adult noticing child is upset, kneeling down to child's level, offering comfort, understanding expression, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "A grown-up can help. You can say 'I need a break' or 'It's too much.'",
      },
      {
        prompt: `Warm cartoon illustration of quiet calm corner with soft cushions, dim lighting, child taking deep breaths, peaceful safe space, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "Find a quiet spot. Take deep breaths - in through your nose, out through your mouth.",
      },
      {
        prompt: `Warm cartoon illustration of child hugging a stuffed animal or soft pillow, eyes closed, feeling calmer, comfort object helping, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "Hug something soft. It's okay to take all the time you need.",
      },
      {
        prompt: `Warm cartoon illustration of child looking calmer, small smile returning, ready to try again, feeling better, resilience shown, Studio Ghibli style. ${HAND_INSTRUCTION}`,
        narration: "You're feeling better now. You did a great job calming down. You're so strong!",
      },
    ],
    buttons: [
      { label: "I need a break", phrase: "I need to take a break" },
      { label: "Too loud", phrase: "It's too loud for me" },
      { label: "Help me", phrase: "Can you help me calm down?" },
      { label: "I'm okay now", phrase: "I'm feeling better now" },
    ],
  },
}

export async function POST(request: NextRequest) {
  try {
    const { scenario } = await request.json()

    if (!process.env.FAL_KEY) {
      return NextResponse.json({ error: "FAL_KEY not configured" }, { status: 500 })
    }

    const storyData = scenario && STORY_SCENARIOS[scenario] ? STORY_SCENARIOS[scenario] : null

    if (!storyData) {
      return NextResponse.json({ error: "Invalid scenario" }, { status: 400 })
    }

    console.log("[v0] Generating images for story:", storyData.title)

    const sceneImages: Array<{ imageUrl: string; narration: string }> = []

    for (let i = 0; i < storyData.scenes.length; i++) {
      const scene = storyData.scenes[i]
      console.log(`[v0] Generating image ${i + 1}/${storyData.scenes.length}...`)

      try {
        const result = (await fal.subscribe("fal-ai/flux-pro/v1.1", {
          input: {
            prompt: scene.prompt,
            image_size: "landscape_16_9",
            safety_tolerance: "5",
          },
        })) as any

        const imageUrl = result?.data?.images?.[0]?.url || result?.images?.[0]?.url

        if (imageUrl) {
          sceneImages.push({
            imageUrl,
            narration: scene.narration,
          })
        } else {
          console.error(`[v0] No image URL for scene ${i + 1}`)
        }
      } catch (err) {
        console.error(`[v0] Failed to generate image ${i + 1}:`, err)
        // Continue with other images even if one fails
      }
    }

    if (sceneImages.length === 0) {
      return NextResponse.json(
        {
          error: "Failed to generate any images",
          storyData: {
            title: storyData.title,
            description: storyData.description,
            buttons: storyData.buttons,
          },
        },
        { status: 200 },
      )
    }

    return NextResponse.json({
      success: true,
      slideshow: sceneImages,
      storyData: {
        title: storyData.title,
        description: storyData.description,
        buttons: storyData.buttons,
      },
    })
  } catch (error) {
    console.error("[v0] Story generation error:", error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate story",
      },
      { status: 500 },
    )
  }
}

// GET endpoint to list available scenarios
export async function GET() {
  const scenarios = Object.entries(STORY_SCENARIOS).map(([key, value]) => ({
    id: key,
    title: value.title,
    description: value.description,
  }))

  return NextResponse.json({ scenarios })
}
