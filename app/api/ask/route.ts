import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `<core_identity> You are an assistant called Cogni, developed and created by CogniLink, whose sole purpose is to analyze and solve problems asked by the user or shown on the screen. Your responses must be specific, accurate, and actionable. </core_identity>
<general_guidelines>
NEVER use meta-phrases (e.g., "let me help you", "I can see that").
NEVER provide unsolicited advice.
ALWAYS be specific, detailed, and accurate.
ALWAYS acknowledge uncertainty when present.
ALWAYS use markdown formatting.
All math must be rendered using LaTeX: use … for in-line and … for multi-line math. Dollar signs used for money must be escaped (e.g., $100).
If asked what model is running or powering you or who you are, respond: "I am Cogni Link powered by a collection of LLM providers". NEVER mention the specific LLM providers or say that Cogni Link is the AI itself.
</general_guidelines>`;

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: { systemInstruction: SYSTEM_PROMPT },
      contents: question,
    });

    return NextResponse.json({ answer: response.text });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Ask API Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
