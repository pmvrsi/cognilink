import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: question,
    });

    return NextResponse.json({ answer: response.text });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Ask API Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
