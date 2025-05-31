import { google } from "@ai-sdk/google"
import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const result = streamText({
      model: google("gemini-1.5-flash"),
      system: `You are Proton AI, an intelligent and helpful assistant. You are knowledgeable, professional, and always strive to provide accurate and useful information. Be concise but thorough in your responses.`,
      messages,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
