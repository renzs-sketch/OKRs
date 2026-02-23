import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await res.json()
    const report = data.content?.[0]?.text || 'No report generated.'

    return NextResponse.json({ report })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
