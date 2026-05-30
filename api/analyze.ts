import type { VercelRequest, VercelResponse } from '@vercel/node'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({ error: 'No message provided' })
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content: `
Ты анализируешь бизнес-обсуждение.

Верни строго JSON без пояснений:

{
  "nodes": [
    { "type": "thesis", "text": "...", "parentIndex": null },
    { "type": "argument", "text": "...", "parentIndex": 0 },
    { "type": "counterargument", "text": "...", "parentIndex": 0 }
  ]
}
`
        },
        { role: 'user', content: message }
      ],
    })

    const text = completion.choices[0].message.content || '{}'

    res.status(200).json(JSON.parse(text))
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'AI analysis failed' })
  }
}