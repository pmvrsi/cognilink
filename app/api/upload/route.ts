import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        if (file.type !== 'application/pdf') {
            return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        // Read the file bytes and convert to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ask Gemini to summarize the provided document
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    inlineData: {
                        data: buffer.toString('base64'),
                        mimeType: file.type,
                    }
                },
                "Please provide a comprehensive summary of this document."
            ],
            config: {
                systemInstruction: `You are an expert AI assistant inside the 'CogniLink' document analysis platform.
                Your goals:
                1. Provide highly professional, concise, and accurate summaries of the provided academic documents.
                2. Do not summarize or process documents containing inappropriate, offensive, or harmful topics; instead return a polite refusal.`,
            }
        });

        return NextResponse.json({
            summary: response.text,
            filename: file.name,
            size: file.size
        });

    } catch (error) {
        console.error('Upload API Error:', error);
        return NextResponse.json(
            { error: 'Failed to analyze document' },
            { status: 500 }
        );
    }
}
