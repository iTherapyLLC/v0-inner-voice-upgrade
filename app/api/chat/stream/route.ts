import { streamText, convertToModelMessages, type UIMessage } from "ai"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { messages }: { messages: UIMessage[] } = await request.json()

    const systemPrompt = `You are a friendly, supportive communication assistant for Inner Voice, 
an app that helps people with communication development and literacy skills. 
You speak in a warm, encouraging tone appropriate for all ages.
Keep responses concise and easy to understand.`

    const result = streamText({
      model: "anthropic/claude-sonnet-4.5",
      system: systemPrompt,
      messages: convertToModelMessages(messages),
      maxOutputTokens: 200,
      temperature: 0.7,
      abortSignal: request.signal,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("Error streaming response:", error)
    return new Response("Failed to stream response", { status: 500 })
  }
}
