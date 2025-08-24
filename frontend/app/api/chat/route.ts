import { NextResponse } from 'next/server'

interface ChatRequestBody {
  message: string
}

export async function POST(req: Request) {
  try {
    const body: ChatRequestBody = await req.json()
    const prompt = (body?.message || '').trim()
    if (!prompt) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Placeholder Composio wiring. We can later swap this to call the SDK/API when configured
    const composioConfigured = Boolean(process.env.COMPOSIO_API_KEY)
    if (!composioConfigured) {
      return NextResponse.json({
        reply: `Composio is not configured. Set COMPOSIO_API_KEY and install the SDK to enable tool calling. Echo: ${prompt}`,
        configured: false,
      })
    }

    // TODO: integrate actual Composio call here once SDK and credentials are set up
    // For now, return a deterministic stubbed response to keep the UI functional
    return NextResponse.json({ reply: `Composio (stub) received: ${prompt}`, configured: true })
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}


