import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: `You are an expert AI assistant inside the 'CogniLink' document analysis platform.
                Your goals:
                1. Help the user understand their documents and answer their questions clearly.
                2. If a user asks about inappropriate, offensive, or harmful topics, politely refuse to answer.
                3. Keep responses highly professional, concise, and focused on academics or knowledge.`,
            }
        });

        return NextResponse.json({ text: response.text });
    } catch (error) {
        console.error('Gemini API Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate response' },
            { status: 500 }
        );
    }
}
